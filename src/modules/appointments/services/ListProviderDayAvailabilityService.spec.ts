import FakeAppointmentRepository from "../repositories/fakes/FakeAppointmentsRepository";
import ListProviderDayAvailability from "./ListProviderDayAvailabilityService";

let listProviderDayAvailability: ListProviderDayAvailability;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe("ListProviderDayAvailability", () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    listProviderDayAvailability = new ListProviderDayAvailability(
      fakeAppointmentRepository
    );
  });

  it("should be able to list the day availability from providers", async () => {
    await fakeAppointmentRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: "user",
      user_id: "user",
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    // Pegando o tempo atual //mockImplementationOnce: ao inves de executar a função nativa (Date.now), irá executar a minha
    //Once: uma única vez
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 20, 11).getTime(); // todos horários antes das 11 devem estar indisponíveis
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id: "user",
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ])
    );
  });
});
