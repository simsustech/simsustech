---
id: cloudstorage
title: Cloud storage
label: Cloud storage
---
## Cloud storage
This guide will show you how to host the following stack:
- [Owncloud Infinite Storage](https://owncloud.dev/ocis/)

## Installation
- Install `docker` and `docker-compose` on your system.

## Docker setup
- Copy the [docker files](/docker/) to your desired location.
- Edit the [Caddy .env](/docker/caddy/.env) file and enter your email address.
- Run the [Caddy docker container](/docker/caddy/docker-compose.yaml) with `docker compose up`.
- Start all cloud storage services with `docker compose up`.
- Visit your OCIS_DOMAIN and login with `admin:ADMIN_PASSWORD`.


## Security
### Firewall
If you are hosting this on your own (home or office) network, it is strongly recommended to place the server in its own [VLAN](https://en.wikipedia.org/wiki/VLAN).

