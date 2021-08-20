# GoBarber API

## Projeto

Gerencia todo back-end da parte [web](https://github.com/EnioGabriel/GoBarberWeb) e [mobile](https://github.com/EnioGabriel/appgobarber) da aplicação

## Tecnologias utilizadas

O projeto foi feito com as seguintes tecnologias:

- [VSCode](https://code.visualstudio.com/)
- [Typescript](https://www.typescriptlang.org/)
- [NodeJS](https://nodejs.org/en/)
- [ExpressJS](https://expressjs.com/pt-br/)
- [JWT](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/pt-br)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [TypeORM](https://typeorm.io/)

## Pré-requisitos
Ter instalado os dockers do postgres, redis e mongoDB em sua máquina.

## :zap: Executando o Projeto

#### Clonando o projeto
```sh
$ git clone https://github.com/EnioGabriel/GoBarberBackEnd.git
$ cd GoBarberBackEnd
```
#### Rodando o back-end
```sh
  # Instalar as dependências:
  $ yarn

  # Rodar as migrations:
  $ yarn typeorm migration:run
  
  # Rodar a aplicação
  yarn dev:server
```
