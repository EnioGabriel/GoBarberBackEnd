// Responsavel pela regra de negócio
import { sign } from "jsonwebtoken"; //sign = assinar
import authConfig from "@config/auth";
import { injectable, inject } from "tsyringe";

import IUserRepository from "../repositories/IUsersRepository";
import AppError from "@shared/errors/AppError";
import IHashProvider from "../providers/hashProvider/models/IHashProvider";

import User from "../infra/typeorm/entities/User";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AutenticateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Email/senha incorretos.", 401);
    }

    // user.password = Senha criptografada la do DB
    // password = senha que o usuário digitou
    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    ); // comparando as senhas

    if (!passwordMatched) {
      throw new AppError("Email/senha incorretos.", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    // 1° param = info do usuario para usar dps obs: nunca usar senha como param
    // 2° param = chave secreta usei md5 online para gerar um hash e usar de chave
    // 3° param = config do token
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    //Usuario autenticado
    return {
      user,
      token,
    };
  }
}

export default AutenticateUserService;
