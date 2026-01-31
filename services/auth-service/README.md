# Auth Service

## 1) Install

npm i

## 2) Create RSA keys (RS256)

mkdir -p keys
openssl genrsa -out keys/jwtRS256.key 2048
openssl rsa -in keys/jwtRS256.key -pubout -out keys/jwtRS256.key.pub

## 3) Setup env

cp .env.example .env

## 4) Setup Postgres DB

Create database auth_db then run:
psql -d auth_db -f scripts/schema.sql

## 5) Run

npm run dev

## Endpoints

- GET /health
- GET /auth/.well-known/jwks.json
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me
