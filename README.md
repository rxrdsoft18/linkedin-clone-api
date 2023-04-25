## LinkedIn Clone using NestJS
POC for a LinkedIn clone using NestJS, TypeORM, PostgreSQL, and Socker IO.

## Tech Stack
- NestJS
- TypeORM
- PostgreSQL
- Socket IO
- Docker
- Docker Compose
- Jwt
- Bcrypt
- Multer



## Installation

```bash
$ yarn install

# Create a .env file in the root directory and add the following variables
$ cp .env.example .env

# run docker-compose to start the database
$ docker-compose up -d
```



## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Build Docker Image

```bash
$ Enter to docker-compose.yml file and uncomment linkedin-api service
$ Environment variable POSTGRES_HOST must be postgres
$ docker-compose up -d
```


## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

```
