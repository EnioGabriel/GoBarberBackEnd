import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/hashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";

describe("CreateUser", () => {
  // it: isso
  it("should be able to create a new user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const appointment = await createUser.execute({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "123456",
    });

    expect(appointment).toHaveProperty("id");
  });

  // it: isso
  it("should not be able to create a new user with same email", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createAppointment = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    await createAppointment.execute({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "123456",
    });

    // criando mais um usuário com o mesmo email para apontar o erro
    expect(
      createAppointment.execute({
        name: "fulano",
        email: "fulano@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
