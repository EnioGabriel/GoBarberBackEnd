import { Response, Request } from "express";
import { container } from "tsyringe";
import ListProviderMonthAvailabilityService from "@modules/appointments/services/ListProviderMonthAvailabilityService";
import AppError from "@shared/errors/AppError";

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    try {
      const { provider_id } = request.params;
      const { month, year } = request.body;

      const listProviderMonthAvailability = container.resolve(
        ListProviderMonthAvailabilityService
      );

      const availability = await listProviderMonthAvailability.execute({
        provider_id,
        month,
        year,
      });

      return response.json(availability);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
