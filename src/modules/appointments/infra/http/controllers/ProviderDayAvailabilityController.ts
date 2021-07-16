import { Response, Request } from "express";
import { container } from "tsyringe";
import ListProviderDayAvailabilityService from "@modules/appointments/services/ListProviderDayAvailabilityService";

// index: metodo do tipo get, não aceita corpo de requisição (.body)
// user .query = http://localhost:3333/rota/year=2021&month=12&day=21
// year=2021&month=12&day=21 expemplo de query

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const listProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService
    );

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
