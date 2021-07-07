// Responsavel pela regra de negócio

import { injectable, inject } from "tsyringe";
import { isAfter, addHours } from "date-fns";

import AppError from "@shared/errors/AppError";

import IHashProvider from "../providers/hashProvider/models/IHashProvider";
import IUserRepository from "../repositories/IUsersRepository";
import IUserTokensRepository from "../repositories/IUserTokensRepository";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token does not exist");
    }

    const user = await this.usersRepository.findById((await userToken).user_id);

    if (!user) {
      throw new AppError("User does not exist");
    }

    const tokenCreatedAt = userToken.created_at;

    // adiciona 2 horas ao tokenCreatedAt
    const compareDate = addHours(tokenCreatedAt, 2);

    // verifica se já passou o tempo limite de criação do token até o atual horário
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expired");
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
