FROM node:25-alpine AS build

WORKDIR /code

ARG AUTH_URL
ARG APP_URL
ARG API_URL
ARG WS_URL
ARG STATIC_URL
ARG STORAGE_URL

COPY .npmrc ./
COPY package*.json ./

RUN --mount=type=secret,id=GH_TOKEN,env=GH_TOKEN \
    npm config set //npm.pkg.github.com/:_authToken=$GH_TOKEN && \
    npm i --include=dev

COPY . .

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /code/dist /usr/share/nginx/html

EXPOSE 80