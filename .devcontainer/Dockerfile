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
