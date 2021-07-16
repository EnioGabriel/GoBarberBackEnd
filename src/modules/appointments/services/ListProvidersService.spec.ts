import ListProvidersService from "./ListProvidersService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe("ListProviders", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    );
  });

  it("should be able show to list the providers", async () => {
    const user1 = await fakeUsersRepository.create({
      name: "Fulano",
      email: "fulano@example.com",
      password: "123456",
    });

    const user2 = await fakeUsersRepository.create({
      name: "Fulano 2",
      email: "fulano2@example.com",
      password: "123456",
    });

    const loggedUser = await fakeUsersRepository.create({
      name: "Fulano logado",
      email: "fulanologado@example.com",
      password: "123456",
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
