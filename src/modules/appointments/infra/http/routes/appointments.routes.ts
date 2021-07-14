//Responsabilidade da rota: receber requisiçoes e retornar erros

import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";
import AppointmentsController from "../controllers/AppointmentsController";

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated); // aplicando ensure em todas as rotas de agendamento

appointmentsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.required(),
    },
  }),
  appointmentsController.create
);

appointmentsRouter.get("/me", providerAppointmentsController.index);

export default appointmentsRouter;
