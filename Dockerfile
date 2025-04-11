FROM node:22

WORKDIR /app

COPY ./ /app

RUN npm install -g @quasar/cli
RUN npm install

CMD ["quasar", "dev"]
