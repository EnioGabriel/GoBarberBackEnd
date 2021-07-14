//Responsabilidade da rota: receber requisiçoes e retornar erros
import { celebrate, Joi, Segments } from "celebrate";
import { Router } from "express";

import ProfileController from "../controllers/ProfileController";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileController = new ProfileController();

// deixando as rotas disponíveis apenas se o usuário estiver logado
profileRouter.use(ensureAuthenticated);

profileRouter.get("/", profileController.show);
profileRouter.put(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string(),
      old_password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref("password")),
    },
  }),
  profileController.update
);

export default profileRouter;
