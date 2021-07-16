import { Response, Request } from "express";
import { container } from "tsyringe";
import ListProviderMonthAvailabilityService from "@modules/appointments/services/ListProviderMonthAvailabilityService";
import AppError from "@shared/errors/AppError";

// index: metodo do tipo get, não aceita corpo de requisição (.body)
// user .query = http://localhost:3333/rota/year=2021&month=12&day=21
// year=2021&month=12&day=21 expemplo de query

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { provider_id } = request.params;
      const { month, year } = request.query;

      const listProviderMonthAvailability = container.resolve(
        ListProviderMonthAvailabilityService
      );

      const availability = await listProviderMonthAvailability.execute({
        provider_id,
        month: Number(month),
        year: Number(year),
      });

      return response.json(availability);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
