FROM node:18-alpine AS builder

WORKDIR /build

COPY package*.json ./


RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/node_modules ./node_modules

CMD ["npm", "run", "start:prod"]

