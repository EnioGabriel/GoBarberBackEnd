//Responsabilidade da rota: receber requisiçoes e retornar erros

import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";
import { celebrate, Segments, Joi } from "celebrate";

import UsersController from "../controllers/UsersControllers";
import UserAvatarController from "../controllers/UserAvatarController";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

usersRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

//Patch: usado qnd quer alterar um único campo. Diferente do put
usersRouter.patch(
  "/avatar",
  // deixando as rotas disponíveis apenas se o usuário estiver logado
  ensureAuthenticated,
  upload.single("avatar"),
  userAvatarController.update
);

export default usersRouter;
