import { container } from "tsyringe";

import IAppointmentRepository from "@modules/appointments/repositories/IAppointmentsRepositories";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

import IUserRepository from "@modules/users/repositories/IUsersRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

container.registerSingleton<IAppointmentRepository>(
  "AppointmentsRepository",
  AppointmentsRepository
);

container.registerSingleton<IUserRepository>(
  "UsersRepository",
  UsersRepository
);
