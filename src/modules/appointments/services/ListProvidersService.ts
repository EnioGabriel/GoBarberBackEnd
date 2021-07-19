import { injectable, inject } from "tsyringe";

import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import User from "@modules/users/infra/typeorm/entities/User";
import { classToClass } from "class-transformer";

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    // tentando pegar os dados da list
    let usersInCache = await this.cacheProvider.recover<User[]>(
      `providers-list:${user_id}`
    );

    if (!usersInCache) {
      usersInCache = await this.usersRepository.findAllProviders({
        except_user_id: user_id, // impedindo listagem do usuário logado
      });

      // Salvando busca nova em cache
      await this.cacheProvider.save(
        `providers-list:${user_id}`,
        classToClass(usersInCache)
      );
    }

    return usersInCache;
  }
}

export default ListProvidersService;
