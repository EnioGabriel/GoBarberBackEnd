//Responsabilidade da rota: receber requisiçoes e retornar erros

/**
 * Appointment = compromisso/agendamento
 */

import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";
import AppointmentsController from "../controllers/AppointmentsController";

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentRouter.use(ensureAuthenticated); // aplicando ensure em todas as rotas de agendamento

appointmentRouter.post("/", appointmentsController.create);
appointmentRouter.get("/me", providerAppointmentsController.index);

export default appointmentRouter;
