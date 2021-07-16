import { startOfHour, isBefore, getHours, format } from "date-fns";
import { injectable, inject } from "tsyringe";

import AppError from "@shared/errors/AppError";

import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";

import Appointment from "../infra/typeorm/entities/Appointment";
import IAppointmentsRepository from "../repositories/IAppointmentsRepositories";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository") // nome capturado lá de index do container
    private appointmentsRepository: IAppointmentsRepository,

    @inject("NotificationsRepository") // nome capturado lá de index do container
    private notificationsRepository: INotificationsRepository,

    @inject("CacheProvider") // nome capturado lá de index do container
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    //Date.now setado no mock de teste
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create a appointment on a past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create a appointment with yourself");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError("You can't create appointment between 8am and 5pm");
    }

    const findAppointmentInSameDate =
      await this.appointmentsRepository.findByDate(appointmentDate);

    if (findAppointmentInSameDate) {
      throw new AppError("Este horário já está reservado");
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo Agendamento para dia ${dateFormatted}`,
    });

    // Limpando cache após as buscas serem atualizadas
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy-M-d"
      )}`
    );

    console.log(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy-M-d"
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
