//Responsabilidade da rota: receber requisiçoes e retornar erros

import { Router } from "express";
import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

const sessionsRouter = Router();

sessionsRouter.post("/", async (request, response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password; //Deletando retorno da senha para q nao fique visivel no front

  return response.json({ user, token }); // Enviando para o front-end
});

export default sessionsRouter;
