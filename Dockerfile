FROM node:20.11.0-alpine

WORKDIR /app

# MySQL 호스트 설정
ENV MYSQL_DB_HOST host.docker.internal

COPY package*.json yarn.lock .
RUN yarn install

# 애플리케이션 소스 코드 복사, 빌드
COPY . .
RUN yarn build

EXPOSE 8001
CMD ["yarn", "start"]
