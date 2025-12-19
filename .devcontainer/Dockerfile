FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    jq \
    zip \
    unzip \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Align with Do Not Ghost Me tooling (npm@11.6.4).
RUN npm i -g npm@11.6.4
