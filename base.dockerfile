FROM node:22-bullseye

# install the linux version of all dependencies
RUN apt update

WORKDIR /srv
WORKDIR /srv/mos-mit-ctc/