import AppError from "@shared/errors/AppError";

import FakeHashProvider from "../providers/hashProvider/fakes/FakeHashProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it("should be able to update the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: "Fulano",
      email: "fulano@example.com",
      password: "123456",
    });

    // Atualizando nome e email do usuário
    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "Fulano da Silva",
      email: "fulanosilva@example.com",
    });

    expect(updatedUser.name).toBe("Fulano da Silva");
    expect(updatedUser.email).toBe("fulanosilva@example.com");
  });

  it("should not be able to change to another user e-mail", async () => {
    await fakeUsersRepository.create({
      name: "Fulano",
      email: "fulano@example.com",
      password: "123456",
    });

    const user = await fakeUsersRepository.create({
      name: "Test",
      email: "test@example.com",
      password: "123456",
    });

    // tentando atualizar com email que outro usuário já possui
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Fulano",
        email: "fulano@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Fulano",
      email: "fulano@example.com",
      password: "123456",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "Fulano da Silva",
      email: "fulanosilva@example.com",
      old_password: "123456",
      password: "123123",
    });

    expect(updatedUser.password).toBe("123123");
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Fulano",
      email: "fulano@example.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Fulano da Silva",
        email: "fulanosilva@example.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: "Fulano",
      email: "fulano@example.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Fulano da Silva",
        email: "fulanosilva@example.com",
        old_password: "wrong-old-password",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able update the profile from non-existing user", async () => {
    await expect(
      updateProfile.execute({
        user_id: "non-existing-user-id",
        name: "Fulano",
        email: "fulano@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
