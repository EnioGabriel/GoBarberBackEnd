import { Request, Response } from "express";
import { container } from "tsyringe";

import ShowProfileService from "@modules/users/services/ShowProfileServices";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id;

    const showProfile = container.resolve(ShowProfileService);

    const user = await showProfile.execute({ user_id });

    // impedindo que mostre essa informação na requisição
    delete user.password;

    return res.json(user);
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

    delete user.password;

    return res.json(user);
  }
}
