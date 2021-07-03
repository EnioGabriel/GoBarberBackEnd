// Responsavel pela regra de negócio

import User from "../infra/typeorm/entities/User";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";
import IUserRepository from "../repositories/IUsersRepository";
import IHashProvider from "../providers/hashProvider/models/IHashProvider";

interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError("Email já está em uso");
    }

    const hashedPassword = await this.hashProvider.generateHash(password); // Criptografando a senha

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
