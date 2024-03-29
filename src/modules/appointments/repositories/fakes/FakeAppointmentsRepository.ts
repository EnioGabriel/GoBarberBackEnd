// Classe para realizar testes isolados do banco de dados

import { uuid } from "uuidv4";
import { isEqual, getMonth, getYear, getDate } from "date-fns";

import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentsRepositories";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

import Appointment from "../../infra/typeorm/entities/Appointment";
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllinMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

class AppointmentsRepository implements IAppointmentRepository {
  // Criando array de appointment
  private appointments: Appointment[] = [];

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment) =>
        isEqual(appointment.date, date) &&
        appointment.provider_id == provider_id
    );

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      (appointment) =>
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month && // +1 pois o mes começa em zero
        getYear(appointment.date) === year
    );

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      (appointment) =>
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month && // +1 pois o mes começa em zero
        getYear(appointment.date) === year
    );

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;
    appointment.user_id = user_id;

    // jogando appointment criado dentro do array
    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
