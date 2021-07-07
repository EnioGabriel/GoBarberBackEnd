import AppError from "@shared/errors/AppError";

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";
import FakeHashProvider from "../providers/hashProvider/fakes/FakeHashProvider";
import ResetPasswordService from "./ResetPasswordService";

// Declarando var globais
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe("ResetPasswordService", () => {
  // preenchendo infos repetitivas antes de rodar cada teste
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  // it: isso
  it("should be able to reset the password", async () => {
    const user = await fakeUsersRepository.create({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "senhaantiga",
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    await resetPasswordService.execute({
      password: "novasenha",
      token: userToken.token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith("novasenha");
    expect(updatedUser?.password).toBe("novasenha");
  });

  it("should not be able to reset the password with non-existing token ", async () => {
    // Criando um token inexistente
    const { token } = await fakeUserTokensRepository.generate(
      "non-existing-user"
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: "novasenha",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing token ", async () => {
    await expect(
      resetPasswordService.execute({
        token: "invalid",
        password: "novasenha",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password with non-existing user", async () => {
    // Criando usuário inexistente com um token válido
    const { token } = await fakeUserTokensRepository.generate(
      "non-existing-user"
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to reset the password if passed more than 2 hours", async () => {
    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    // Gerando token
    const { token } = await fakeUserTokensRepository.generate(user.id);

    // Pegando o tempo atual //mockImplementationOnce: ao inves de executar a função nativa (Date.now), irá executar a minha
    //Once: uma única vez
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      // Customizando um Date para simular uma data do futuro, no caso +3h
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: "123123",
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
