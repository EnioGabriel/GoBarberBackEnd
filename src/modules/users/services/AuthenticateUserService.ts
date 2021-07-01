// Responsavel pela regra de negócio

import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken"; //sign = assinar
import authConfig from "@config/auth";

import AppError from "@shared/errors/AppError";

import User from "../infra/typeorm/entities/User";

interface RequestDTO {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AutenticateUserService {
  public async execute({ email, password }: RequestDTO): Promise<Response> {
    const usersRepository = getRepository(User); // Pegando repositorio User do DB

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError("Email/senha incorretos.", 401);
    }

    // user.password = Senha criptografada la do DB
    // password = senha que o usuário digitou
    const passwordMatched = await compare(password, user.password); // comparando as senhas

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
