// Classe para realizar testes isolados do banco de dados

import { uuid } from "uuidv4";
import { isEqual } from "date-fns";

import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentsRepositories";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

import Appointment from "../../infra/typeorm/entities/Appointment";

class AppointmentsRepository implements IAppointmentRepository {
  // Criando array de appointment
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date)
    );

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    appointment.id = uuid();
    appointment.date = date;
    appointment.provider_id = provider_id;

    // jogando appointment criado dentro do array
    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
