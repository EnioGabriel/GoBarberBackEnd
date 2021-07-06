import IUserTokensRepository from "../../repositories/IUserTokensRepository";

import UserToken from "../../infra/typeorm/entities/UserToken";
import { uuid } from "uuidv4";

class FakeUserTokensRepository implements IUserTokensRepository {
  // Criando array de userTokens vazio
  private ArrayUserTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.ArrayUserTokens.push(userToken);

    return userToken;
  }
}

export default FakeUserTokensRepository;
