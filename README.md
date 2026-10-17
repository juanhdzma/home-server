<div align="center">

# home-server

**Every service on the home server, as code.**

<img src="https://cdn.simpleicons.org/ubuntu" height="14" alt=""> Ubuntu &nbsp;·&nbsp; <img src="https://cdn.simpleicons.org/docker" height="14" alt=""> Docker &nbsp;·&nbsp; <img src="https://cdn.simpleicons.org/portainer" height="14" alt=""> Portainer &nbsp;·&nbsp; <img src="https://cdn.simpleicons.org/nginxproxymanager" height="14" alt=""> Nginx Proxy Manager &nbsp;·&nbsp; <img src="https://cdn.simpleicons.org/pihole" height="14" alt=""> Pi-hole &nbsp;·&nbsp; <img src="https://cdn.simpleicons.org/wireguard" height="14" alt=""> WireGuard

[Features](#features) · [Docs](docs/SETUP.md)

</div>

**The problem:** a server configured by hand drifts. Nothing records which port is open or why, and rebuilding it after a dead disk means remembering every command.

**What home-server does:** each service is a folder with a `docker-compose.yml` that Portainer deploys straight from this repo. The host configuration that can't live in a compose file is written down step by step in [docs/SETUP.md](docs/SETUP.md).

> [!WARNING]
> Built for a trusted home network: only WireGuard is meant to be reachable from the internet. Details in [Security](#security).

[Features](#features) · [How do I…](#how-do-i) · [Running](#running) · [Configuration](#configuration) · [Documentation](#documentation) · [Security](#security)

## Features

**Network**

- Reverse proxy with Let's Encrypt certificates for `*.nufi.com.co`
- Network-wide ad blocking and local DNS with Pi-hole
- WireGuard VPN to reach everything from outside

**Home**

- Home Assistant with Tuya, Cast and Android TV devices
- automati, which talks to Home Assistant through its API

**Operations**

- Portainer deploys every stack from this repo
- Watchtower updates images nightly and reports to Telegram
- beszel monitors the host and every container

**Apps**

- fondi, moni and crewi, built and published from their own repos
- libredb as a web database client

## How do I…

### Change a stack
Edit its `docker-compose.yml`, commit and push to `master`, then redeploy the stack in Portainer. Stacks don't redeploy on their own when the repo changes.

### Add a new stack
Create a folder with a `docker-compose.yml` that follows the rules in [CLAUDE.md](CLAUDE.md), push it, and deploy it from Portainer as shown in [Deploy a stack](docs/SETUP.md#deploy-a-stack).

### Update images now
Watchtower runs every night at 02:00. To force a run, call its HTTP API as shown in [watchtower/README.md](watchtower/README.md).

### Change Portainer itself
Edit [portainer/docker-compose.yml](portainer/docker-compose.yml), copy it to `~/infra/portainer/` on the server and run `docker compose up -d` there. Portainer doesn't manage itself.

## Running

Everything runs on one host, `192.168.78.250`. Each stack is a git stack in Portainer, and each web UI gets its domain as a proxy host in Nginx Proxy Manager.

| Stack | Runs |
|---|---|
| `infra` | Nginx Proxy Manager, Pi-hole |
| `portainer` | Portainer, applied by hand |
| `vpn` | wg-easy (WireGuard) |
| `home_assistant` | Home Assistant, on the host network |
| `monitoring` | beszel and its agent |
| `watchtower` | Watchtower |
| `dbms` | libredb |
| `automati`, `crewi`, `fondi`, `moni` | Apps from their own repos, images on GitHub Container Registry |

To rebuild the server from scratch, follow [docs/SETUP.md](docs/SETUP.md).

## Configuration

Stacks that need secrets ship an `example.env`. Copy it to `stack.env` in the same folder (gitignored), fill in the real values and load it in Portainer when deploying the stack, as shown in [Deploy a stack](docs/SETUP.md#deploy-a-stack).

## Documentation

| Doc | Read it when |
|---|---|
| [Setup](docs/SETUP.md) | You're rebuilding the server or changing host config outside Docker |
| [Scheduled tasks](docs/SCHEDULE.md) | You want to know what runs on its own and when |
| [Watchtower](watchtower/README.md) | You want to force an image update |
| [CLAUDE.md](CLAUDE.md) | You're writing or reviewing a `docker-compose.yml` |

## Security

Built for a trusted home network, not the public internet.

- **Only WireGuard needs to be exposed.** The router only has to forward `51820/udp`, and the domains resolve to a private IP, so they only work from the LAN or the VPN.
- **Secrets never reach the repo.** They live in `stack.env` (gitignored) and in each stack's environment variables in Portainer.
