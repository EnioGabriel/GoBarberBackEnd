import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Validacao token jwt

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token não encontrado", 401);
  }

  // [, token] quando se deixa em branco uma posiçao usa-se somente a outra
  const [, token] = authHeader.split(" "); // Dividindo e seperando a palavra 'Bearer'
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as TokenPayload; // forcando o tipo de uma variável

    // incluido info do usuario dentro do request na pasta @types/express.d.ts
    request.user = {
      id: sub,
    };

    return next(); // autorizando usuário a usar a aplicação
  } catch {
    throw new AppError("JWT inválido", 401);
  }
}
