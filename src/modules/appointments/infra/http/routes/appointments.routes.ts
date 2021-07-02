//Responsabilidade da rota: receber requisiçoes e retornar erros

/**
 * Appointment = compromisso/agendamento
 */

import { Router } from "express";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";
import AppointmentsController from "../../controllers/AppointmentsController";

const appointmentRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentRouter.use(ensureAuthenticated); // aplicando ensure em todas as rotas de agendamento

appointmentRouter.post("/", appointmentsController.create);

export default appointmentRouter;
