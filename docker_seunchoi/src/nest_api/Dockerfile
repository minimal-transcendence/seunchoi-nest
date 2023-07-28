# build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# prisma
RUN npx prisma generate

RUN npm run build

# prod stage

FROM node:18-alpine

WORKDIR /app

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env .env
# COPY package*.json ./
RUN npm install --only-production

# prisma studio
COPY ./prisma .

# RUN npm run prisma:generate
RUN rm package*.json

CMD ["node", "dist/main.js"]