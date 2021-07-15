import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    // foi substituido pelo class-transformer em User.ts
    //delete user.password; //Deletando retorno da senha para q nao fique visivel no front

    // classToClass implementa os métodos utilizado via class-transformer lá na entity User.ts
    return response.json({ user: classToClass(user), token }); // Enviando para o front-end
  }
}
