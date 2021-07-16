import Redis, { Redis as RedisClient } from "ioredis";
import cacheConfig from "@config/cache";
import ICacheProvider from "../models/ICacheProvider";

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    // transformando dados em tipo T para corrigir o return
    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Apaga todo o cache de buscas
  public async invalidatePrefix(prefix: string): Promise<void> {
    // buscando todas as chaves que contenham provider list com
    // padrão de 'list-providers:' e qlqr coisa dps disso. Representado pelo '*'
    const keys = await this.client.keys(`${prefix}:*`);

    //pipeline(): Performático para executar múltiplas funções ao mesmo tempo
    const pipeline = this.client.pipeline();

    keys.forEach((key) => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
