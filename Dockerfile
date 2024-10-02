FROM debian:bookworm-slim as deps

WORKDIR /app
RUN apt-get update && apt-get -y install git curl nodejs npm
RUN curl -L https://foundry.paradigm.xyz | bash
RUN /root/.foundry/bin/foundryup
COPY package.json yarn.lock ./
RUN npm install --global yarn@3.2.3
RUN /usr/local/bin/yarn install

FROM debian:bookworm-slim as builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN /usr/local/bin/yarn build

FROM debian:bookworm-slim as runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV PATH $PATH:/root/.foundry/bin

CMD ["tail", "-f", "/dev/null"]