//Responsabilidade da rota: receber requisiçoes e retornar erros

import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import ProvidersController from "../controllers/ProvidersController";
import ProviderMonthAvailabilityController from "../controllers/ProviderMonthAvailabilityController";
import ProviderDayAvailabilityController from "../controllers/ProviderDayAvailabilityController";

const providersRouter = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController =
  new ProviderDayAvailabilityController();
const providerMonthAvailabilityController =
  new ProviderMonthAvailabilityController();

providersRouter.use(ensureAuthenticated); // aplicando ensure em todas as rotas de agendamento

providersRouter.get("/", providersController.index);

providersRouter.get(
  "/:provider_id/month-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index
);

providersRouter.get(
  "/:provider_id/day-availability",
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDayAvailabilityController.index
);

export default providersRouter;
