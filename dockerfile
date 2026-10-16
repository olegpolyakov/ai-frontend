FROM node:25-alpine AS build

WORKDIR /code

ARG DOMAIN
ARG HOST
ARG AUTH_URL
ARG FILES_API_URL
ARG UPLOAD_URL
ARG API_URL
ARG WS_URL

ENV DOMAIN=$DOMAIN
ENV HOST=$HOST
ENV AUTH_URL=$AUTH_URL
ENV FILES_API_URL=$FILES_API_URL
ENV UPLOAD_URL=$UPLOAD_URL
ENV API_URL=$API_URL
ENV WS_URL=$WS_URL

COPY .npmrc package*.json ./

RUN --mount=type=secret,id=GHP_TOKEN,env=GHP_TOKEN \
    npm config set //npm.pkg.github.com/:_authToken=$GHP_TOKEN && \
    npm ci --include=dev

COPY . .

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /code/dist /usr/share/nginx/html

EXPOSE 80