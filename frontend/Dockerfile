FROM node:22-slim AS setup

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@0.20
RUN corepack enable

WORKDIR /app

COPY . .
COPY .env.prod .env

FROM setup AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx /etc/nginx/conf.d

RUN nginx -t

EXPOSE 1984
