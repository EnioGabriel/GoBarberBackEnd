//Middleware para evitar muitas requisições de um usuário (BruteForce)
import { NextFunction, Request, Response } from "express";
import redis from "redis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import AppError from "@shared/errors/AppError";

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimit",
  points: 5, // maximo de 5 request para cada IP
  duration: 1, // 5s: tempo estimado para fazer o número de req definido em 'points'(5)
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (error) {
    throw new AppError("Too many request", 429);
  }
}
