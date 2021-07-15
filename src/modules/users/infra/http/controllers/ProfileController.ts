import { Request, Response } from "express";
import { container } from "tsyringe";
import { classToClass } from "class-transformer";

import ShowProfileService from "@modules/users/services/ShowProfileServices";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    // impedindo que mostre essa informação na requisição
    // foi substituido pelo class-transformer em User.ts
    //delete user.password;

    return res.json(classToClass(user));
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;
    const { name, email, old_password, password } = req.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    // foi substituido pelo class-transformer em User.ts
    // delete user.password;

    // classToClass implementa os métodos utilizado via class-transformer lá na entity User.ts
    return res.json(classToClass(user));
  }
}
