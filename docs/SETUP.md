# Setup

How to rebuild the server from scratch on a clean Ubuntu Server 24.04. Everything that lives in a `docker-compose.yml` is deployed by Portainer; this doc covers the rest.

Run the steps in order. Each section explains what the block does, then gives the commands.

1. [Static IP](#static-ip)
2. [Docker](#docker)
3. [Docker log rotation](#docker-log-rotation)
4. [Portainer and stacks](#portainer-and-stacks)
5. [Firewall](#firewall)
6. [Key-only SSH](#key-only-ssh)
7. [Disabled services](#disabled-services)
8. [journald size cap](#journald-size-cap)
9. [Scheduled tasks](SCHEDULE.md)
10. [Router](#router)

## Static IP

`/etc/netplan/00-installer-config.yaml`, with `systemd-networkd` as renderer (the Ubuntu Server default). The `infra` stack also uses the interface name `enp1s0` as the parent of its macvlan network.

```yaml
network:
  version: 2
  ethernets:
    enp1s0:
      dhcp4: false
      addresses:
        - 192.168.78.250/24
      routes:
        - to: default
          via: 192.168.78.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 9.9.9.9
```

```sh
sudo netplan apply
```

## Docker

From the Ubuntu repositories.

```sh
sudo apt install docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

## Docker log rotation

Without `daemon.json`, the `json-file` driver never rotates container logs. This caps each container at three files of 50 MB.

```sh
sudo tee /etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "3" }
}
JSON
sudo systemctl restart docker
```

It only applies to containers created afterwards, so it goes before Portainer and the stacks.

## Portainer and stacks

Portainer is the only container that isn't deployed as a Portainer stack. Its compose file is [`portainer/docker-compose.yml`](../portainer/docker-compose.yml), and on the server it lives in `~/infra/portainer/`. The folder must be named `portainer` so Compose names the volume `portainer_data`.

```sh
docker network create infra_proxy
mkdir -p ~/infra/portainer
cp portainer/docker-compose.yml ~/infra/portainer/
docker compose -f ~/infra/portainer/docker-compose.yml up -d
```

- **`infra_proxy` is created by hand** because Portainer needs it before any stack exists. Every stack, `infra` included, declares it as external.
- **The image uses the `alpine` tag** because the default one has no shell or `wget` for the healthcheck.
- **Nginx Proxy Manager reaches it by name** (`portainer:9000`). Only `9443` is published, as direct access that doesn't depend on the proxy.

Then deploy every other folder as a stack, one by one. Start with `infra`: it creates the `vpn_wg` network that `vpn` uses as external.

### Deploy a stack

1. If the folder has an `example.env`, copy it to `stack.env` in the same folder and fill in the real values. `stack.env` is gitignored, so it stays on your machine.
2. In Portainer: **Stacks → Add stack → Repository**, and fill in:

   | Field | Value |
   |---|---|
   | Name | The folder name, e.g. `fondi` |
   | Repository URL | `https://github.com/juanhdzma/home-server` |
   | Repository reference | `refs/heads/master` |
   | Compose path | `<folder>/docker-compose.yml`, e.g. `fondi/docker-compose.yml` |
   | Authentication | Off: the repo is public |
   | GitOps updates | Off: stacks are redeployed by hand after a push |
   | Environment variables | **Load variables from .env file** and pick that folder's `stack.env` |

3. **Deploy the stack.** Images come from Docker Hub or `ghcr.io/juanhdzma`, and all of them are public, so no registry credentials are needed.
4. If it has a web UI, add a proxy host in Nginx Proxy Manager: the domain, scheme `http`, and as forward host the `container_name` with its internal port (e.g. `fondi`, `8000`). Stacks on `infra_proxy` are reached by name.

To change a stack later, push the change and use **Pull and redeploy** in Portainer. Its environment variables stay as they were.

## Firewall

UFW denies incoming traffic by default. Only services listening directly on the host need a rule, and today that's just SSH.

```sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw logging off
```

- **Logging is off** because LAN multicast produces about 140 `UFW BLOCK` lines an hour and eats the journald cap.
- **Ports published by Docker skip UFW**, and so does Pi-hole's macvlan DNS, when traffic comes from the LAN, the VPN or another Docker network. That's why `80`, `443`, `9443` and the rest need no rule.
- **The exception is a container calling the host IP** on a port published by another container on its same network: Docker doesn't apply the DNAT and the packet reaches UFW, where it's dropped. Containers on `infra_proxy` call each other by `container_name` instead.

## Key-only SSH

The user has passwordless sudo, so their SSH key is as good as root. Password login is disabled and only the public key remains. The file uses the `10-` prefix because sshd keeps the first value it reads, and the installer leaves a `50-cloud-init.conf` with `PasswordAuthentication yes`.

First copy the key from every machine that needs access: `ssh-copy-id juanhdzma@192.168.78.250`.

```sh
printf 'PasswordAuthentication no\n' | sudo tee /etc/ssh/sshd_config.d/10-no-password.conf
sudo sshd -t && sudo systemctl reload ssh
```

## Disabled services

They ship enabled in Ubuntu Server and don't apply to a bare metal box with one SATA disk, no Wi-Fi and no modem. They're disabled instead of purged because `apt purge` drags the `ubuntu-server` metapackage with it.

```sh
sudo systemctl disable --now ModemManager multipathd.socket multipathd iscsid.socket open-iscsi open-vm-tools vgauth wpa_supplicant gpu-manager apport ubuntu-fan
sudo touch /etc/cloud/cloud-init.disabled
```

The network is handled by `systemd-networkd` through netplan, so `wpa_supplicant` and `ModemManager` aren't needed.

To revert: `sudo systemctl enable --now <unit>` and delete `/etc/cloud/cloud-init.disabled`.

## journald size cap

Without a cap, system logs grow forever. With `SystemMaxUse`, journald deletes the oldest entries when it reaches the limit.

```sh
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=200M\n' | sudo tee /etc/systemd/journald.conf.d/size.conf
sudo systemctl restart systemd-journald
```

## Router

Outside the server, on the router (`192.168.78.1`):

- **Port forward** of `51820/udp` to `192.168.78.250`, for WireGuard.
- **DHCP** handing out `192.168.78.251` (Pi-hole) as the network's DNS.

The `*.nufi.com.co` domains resolve in public DNS to `192.168.78.250`, a private IP: they only work from the LAN or the VPN, and need no port forward for `80` or `443`.
