import "reflect-metadata";
import "dotenv/config";

import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import "express-async-errors";

import routes from "./routes";
import uploadConfig from "@config/upload";
import { errors } from "celebrate";
import rateLimiter from "./middlewares/rateLimiter";
import AppError from "@shared/errors/AppError";

import "@shared/infra/typeorm";
import "@shared/container";

const app = express();

//Cors evita que sites não confiaveis visite esse site
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.uploadsFolder));
// a posição onde esse midleware é colocada, faz com que seja aplicado deste ponto pra baixo
// ou seja, pula os outros 3 app.use() ali de cima
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    // Se o erro for uma instancia de AppError
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    // Se nao for instancia de AppError (um erro q nao esperado)
    return response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
);

app.listen(3333, () => {
  console.log("🚀️ Server started on port 3333");
});
