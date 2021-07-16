import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/hashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let fakeCashProvider: FakeCacheProvider;

describe("CreateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCashProvider = new FakeCacheProvider();
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCashProvider
    );
  });
  // it: isso
  it("should be able to create a new user", async () => {
    const user = await createUser.execute({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
  });

  // it: isso
  it("should not be able to create a new user with same email", async () => {
    await createUser.execute({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "123456",
    });

    // criando mais um usuário com o mesmo email para apontar o erro
    await expect(
      createUser.execute({
        name: "fulano",
        email: "fulano@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
