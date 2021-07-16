import AppError from "@shared/errors/AppError";

import CreateAppointmentService from "./CreateAppointmentService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe("CreateAppointment", () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  // it: isso
  it("should be able to create a new appointment", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: "user_id",
      provider_id: "provider_id",
    });

    expect(appointment).toHaveProperty("id");
    expect(appointment.provider_id).toBe("provider_id");
  });

  it("should not be aple to create two appointments on the same time", async () => {
    const appointmentDate = new Date(2022, 4, 12, 14);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: "user_id",
      provider_id: "provider_id",
    });

    // tentando criar um novo agendamento na mesma data
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: "user_id",
        provider_id: "provider_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment on past date", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // criando uma data anterior ao return e esperando um erro
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: "user_id",
        provider_id: "provider_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with same user provider", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // criando uma data anterior ao return e esperando um erro
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: "user_id",
        provider_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment with same user provider", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: "user_id",
        provider_id: "user_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment before 8am and after 5pm", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: "user_id",
        provider_id: "provider_id",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: "user_id",
        provider_id: "provider_id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
