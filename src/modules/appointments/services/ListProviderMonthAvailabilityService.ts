import { getDate, getDaysInMonth, isAfter } from "date-fns";
import { injectable, inject } from "tsyringe";

import IAppointmentsRepository from "../repositories/IAppointmentsRepositories";

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments =
      await this.appointmentsRepository.findAllInMonthFromProvider({
        provider_id,
        year,
        month,
      });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // lista todos os dias do mês: 1, 2, 3, ..., 31
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1 // +1 devido ao mes iniciar em zero
    );

    const availability = eachDayArray.map((day) => {
      // year, month, day, 23, 59, 59: pegando o último horário do dia
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);

      // pegando os agendamentos no dia
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        // isAfter( new Date(), compareDate): verifica se o momento atual é após o compare date
        // Retornando somentos os dias posteriores como disponivel para agendamentos
        // 10 agendamentos é o maximo no dia, então se for < 10, tem horário disponível
        available:
          isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
