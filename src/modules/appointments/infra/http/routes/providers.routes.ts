//Responsabilidade da rota: receber requisiçoes e retornar erros

import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import ProvidersController from "../../controllers/ProvidersController";

const providersRouter = Router();
const providersController = new ProvidersController();

providersRouter.use(ensureAuthenticated); // aplicando ensure em todas as rotas de agendamento

providersRouter.get("/", providersController.index);

export default providersRouter;
