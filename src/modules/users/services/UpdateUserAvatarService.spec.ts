import FakeStoreProvider from "@shared/container/providers/StorageProvider/fakes/FakeStorageProvider";
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import UpdateUserAvatarService from "./UpdateUserAvatarService";

import AppError from "@shared/errors/AppError";

describe("UpdateUserAvatar", () => {
  // it: isso
  it("should be able to update avatar", async () => {
    const fakeStoreProvider = new FakeStoreProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStoreProvider
    );

    const user = await fakeUsersRepository.create({
      name: "teste",
      email: "teste@gmail.com",
      password: "123123",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: "avatar.jpg",
    });

    expect(user.avatar).toBe("avatar.jpg");
  });

  it("should not be able to update avatar from non existing user", async () => {
    const fakeStoreProvider = new FakeStoreProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStoreProvider
    );

    expect(
      updateUserAvatar.execute({
        user_id: "non-existing-user",
        avatarFilename: "avatar.jpg",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should delete old avatar when updating new one", async () => {
    const fakeStoreProvider = new FakeStoreProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    // espionando o metodo delete file de fakeStorageProvider e armmaxendo na const
    const deleteFile = jest.spyOn(fakeStoreProvider, "deleteFile");

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStoreProvider
    );

    const user = await fakeUsersRepository.create({
      name: "teste",
      email: "teste@gmail.com",
      password: "123123",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: "avatar.jpg",
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFilename: "avatar2.jpg",
    });

    expect(deleteFile).toHaveBeenCalledWith("avatar.jpg");

    expect(user.avatar).toBe("avatar2.jpg");
  });
});
