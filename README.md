# GoBarber API

## Projeto

Gerencia todo back-end da parte [web](https://github.com/EnioGabriel/GoBarberWeb) e [mobile](https://github.com/EnioGabriel/appgobarber) da aplicação

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
