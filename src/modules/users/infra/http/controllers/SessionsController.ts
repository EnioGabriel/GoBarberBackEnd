import { Request, Response } from "express";
import { container } from "tsyringe";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    delete user.password; //Deletando retorno da senha para q nao fique visivel no front

    return response.json({ user, token }); // Enviando para o front-end
  }
}
