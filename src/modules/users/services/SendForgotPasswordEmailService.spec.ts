import AppError from "@shared/errors/AppError";

import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import SendForgotPasswordEmail from "./SendForgotPasswordEmailService";

describe("SendForgotPasswordEmail", () => {
  // it: isso
  it("should be able to recover the password using email", async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeMailProvider = new FakeMailProvider();

    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    const sendForgotPasswordEmail = new SendForgotPasswordEmail(
      fakeUsersRepository,
      fakeMailProvider
    );

    await fakeUsersRepository.create({
      name: "fulano",
      email: "fulano@gmail.com",
      password: "123123",
    });

    await sendForgotPasswordEmail.execute({
      email: "fulano@gmail.com",
    });

    expect(sendMail).toHaveBeenCalled();
  });
});
