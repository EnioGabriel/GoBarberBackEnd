//Responsabilidade da rota: receber requisiçoes e retornar erros
import { Router } from "express";

import ProfileController from "../controllers/ProfileController";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileController = new ProfileController();

// deixando as rotas disponíveis apenas se o usuário estiver logado
profileRouter.use(ensureAuthenticated);

profileRouter.put("/", profileController.update);
profileRouter.get("/", profileController.show);

export default profileRouter;
