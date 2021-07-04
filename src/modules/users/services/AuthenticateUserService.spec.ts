import AppError from "@shared/errors/AppError";
import FakeHashProvider from "../providers/hashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import AuthenticateUserService from "./AuthenticateUserService";
import CreateUserService from "./CreateUserService";

describe("AuthenticateUser", () => {
  // it: isso
  it("should be able to authenticate", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    const user = await createUser.execute({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "123456",
    });

    const response = await authenticateUser.execute({
      email: "fulano@gmail.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
    expect(response.user).toEqual(user);
  });

  it("should not be able to authenticate with non existing user", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    );

    expect(
      authenticateUser.execute({
        email: "fulano@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
