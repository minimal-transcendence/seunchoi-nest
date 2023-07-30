# build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# prod stage

FROM nginx:1.24

WORKDIR /app

COPY run.sh /app/run.sh
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build ./build

# CMD ["sh", "run.sh"]

#----------------------------------------#

# dev stage
# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# CMD ["npm", "run", "start:migrate:dev"]

#---------------------____#
# test

# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN npm run build

# CMD ["tail", "-f", "/dev/null"]