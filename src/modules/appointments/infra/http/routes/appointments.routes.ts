//Responsabilidade da rota: receber requisiçoes e retornar erros

import { Router } from "express";
import { parseISO } from "date-fns";
import { getCustomRepository } from "typeorm";

import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";
import AppointmentsRepository from "@modules/appointments/repositories/AppointmentsRepository";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

/**
 * Appointment = compromisso/agendamento
 */

const appointmentRouter = Router();

appointmentRouter.use(ensureAuthenticated); // aplicando ensure em todas as rotas de agendamento

/**
//Usado para fazer tipagem de uma variavel
interface Appointment {
  id: string;
  provider: string;
  date: Date;
}*/

appointmentRouter.get("/", async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentRouter.post("/", async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default appointmentRouter;
