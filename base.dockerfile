FROM node:22-bullseye

# install the linux version of all dependencies
RUN apt update

RUN corepack enable

WORKDIR /srv
WORKDIR /srv/mos-mit-ctc/