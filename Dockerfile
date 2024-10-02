FROM node:bookworm-slim

WORKDIR /app
RUN apt-get update && apt-get -y install git curl
RUN curl -L https://foundry.paradigm.xyz | bash
RUN /root/.foundry/bin/foundryup

COPY . .
RUN yarn install

RUN git config --global --add safe.directory /app
RUN git submodule update --init --recursive

ENV PATH $PATH:/root/.foundry/bin

CMD ["tail", "-f", "/dev/null"]
