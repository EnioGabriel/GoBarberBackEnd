import { getDate, getDaysInMonth, getHours } from "date-fns";
import isAfter from "date-fns/isAfter";
import { injectable, inject } from "tsyringe";

import IAppointmentsRepository from "../repositories/IAppointmentsRepositories";

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
      });

    // Primeira hora do dia para agendamento
    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (value, index) => index + hourStart
    );
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map((hour) => {
      // Procura se existe agendamento na hora do parametro
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        // disponibilidade sempre será o contrario de hasAppointmentInHour
        // verifica se a data é após a comparação
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
