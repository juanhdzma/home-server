# Host

Configuración del host que no vive en Portainer. Sirve para rehacer el servidor desde cero: correr cada bloque en orden sobre un Ubuntu Server 24.04 limpio.

## IP fija

`/etc/netplan/00-installer-config.yaml`, con `systemd-networkd` como renderer (el default de Ubuntu Server). El nombre `enp1s0` también lo usa el stack `infra` como parent de la network macvlan.

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

Desde los repos de Ubuntu.

```sh
sudo apt install docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

## Rotación de logs de Docker

Sin `daemon.json`, el driver `json-file` no rota los logs de los containers. Con esto cada container guarda como máximo 3 archivos de 50 MB.

```sh
sudo tee /etc/docker/daemon.json <<'JSON'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "50m", "max-file": "3" }
}
JSON
sudo systemctl restart docker
```

Solo aplica a containers creados después, por eso va antes de levantar Portainer y los stacks.

## Portainer

Es el único container que no se despliega como stack de Portainer. Su compose vive en `~/infra/portainer/docker-compose.yml`:

```yaml
services:
  portainer:
    image: portainer/portainer-ce:latest
    container_name: portainer
    restart: always
    security_opt:
      - no-new-privileges:true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - init_portainer_data:/data
    ports:
      - "9443:9443"
      - "9000:9000"
      - "8000:8000"

volumes:
  init_portainer_data:
    external: true
```

```sh
docker volume create init_portainer_data
docker compose -f ~/infra/portainer/docker-compose.yml up -d
```

Los demás stacks se crean en Portainer como git stacks apuntando a este repo, uno por folder. El primero es `infra`: crea las networks `infra_proxy` y `vpn_wg`, que los demás usan como externas.

## Firewall

UFW con deny por defecto para tráfico entrante. Solo necesitan regla los servicios que escuchan directo en el host: SSH y Home Assistant (`network_mode: host`), con su descubrimiento por mDNS.

```sh
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 8123/tcp
sudo ufw allow 5353/udp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw logging off
```

El logging va apagado porque el multicast de la LAN genera unas 140 líneas `UFW BLOCK` por hora y se come el tope de journald.

Los puertos publicados por Docker y el DNS de Pi-hole en macvlan no pasan por UFW cuando el tráfico viene de la LAN, la VPN u otra network de Docker. La excepción es un container que llama a la IP del host en un puerto publicado por otro container de su misma network: Docker no le aplica el DNAT y el paquete sí llega a UFW. Es el caso de `automati`, que está en `infra_proxy` igual que NPM y consume `https://home.nufi.com.co`; por eso 80 y 443 llevan regla.

## SSH solo con llave

El usuario tiene sudo sin password, así que su clave equivale a la de root. Se deshabilita el login por password y queda solo la llave pública. El archivo usa prefijo `10-` porque sshd toma el primer valor que lee y la instalación deja un `50-cloud-init.conf` con `PasswordAuthentication yes`.

Antes, copiar la llave desde cada equipo que vaya a entrar: `ssh-copy-id juanhdzma@192.168.78.250`.

```sh
printf 'PasswordAuthentication no\n' | sudo tee /etc/ssh/sshd_config.d/10-no-password.conf
sudo sshd -t && sudo systemctl reload ssh
```

## Services deshabilitados

Vienen activos en Ubuntu Server y no aplican a un equipo bare metal, con un solo disco SATA, sin wifi ni módem. Se deshabilitan en vez de purgarlos porque `apt purge` arrastra el metapaquete `ubuntu-server`.

```sh
sudo systemctl disable --now ModemManager multipathd.socket multipathd iscsid.socket open-iscsi open-vm-tools vgauth wpa_supplicant gpu-manager apport ubuntu-fan
sudo touch /etc/cloud/cloud-init.disabled
```

La red la maneja `systemd-networkd` vía netplan, por eso `wpa_supplicant` y `ModemManager` sobran.

Revertir: `sudo systemctl enable --now <unit>` y borrar `/etc/cloud/cloud-init.disabled`.

## Tope de journald

Sin tope, los logs del sistema crecen sin límite. Con `SystemMaxUse`, journald borra lo más viejo al llegar al límite.

```sh
sudo mkdir -p /etc/systemd/journald.conf.d
printf '[Journal]\nSystemMaxUse=200M\n' | sudo tee /etc/systemd/journald.conf.d/size.conf
sudo systemctl restart systemd-journald
```

## Prune semanal de imágenes

Cada redeploy deja la imagen anterior en disco. El script borra toda imagen que no tenga un container, corriendo o detenido.

```sh
printf '#!/bin/sh\ndocker image prune -af\n' | sudo tee /etc/cron.weekly/docker-prune
sudo chmod +x /etc/cron.weekly/docker-prune
```

## Actualizaciones automáticas de apt

Por defecto `unattended-upgrades` corre a diario y solo instala parches de security. Esto agrega el pocket `-updates`, pasa el intervalo a 7 días y reinicia solo cuando un paquete lo pide. La hora es UTC: `08:00` son las 3 am en Colombia.

```sh
sudo sed -i 's|^//\(\s*"${distro_id}:${distro_codename}-updates";\)|\1|' /etc/apt/apt.conf.d/50unattended-upgrades
printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "7";\n' | sudo tee /etc/apt/apt.conf.d/20auto-upgrades
printf 'Unattended-Upgrade::Automatic-Reboot "true";\nUnattended-Upgrade::Automatic-Reboot-Time "08:00";\n' | sudo tee /etc/apt/apt.conf.d/51auto-reboot
```

apt solo actualiza paquetes del host, no imágenes. Cuando se actualiza `docker.io`, el daemon se reinicia y con él los containers.

## Router

Fuera del servidor, en el router (`192.168.78.1`):

- Port forward de `51820/udp` a `192.168.78.250`, para WireGuard.
- DHCP entregando `192.168.78.251` (Pi-hole) como DNS de la red.

Los dominios `*.nufi.com.co` resuelven en DNS público a `192.168.78.250`, una IP privada: solo funcionan dentro de la LAN o por la VPN, y no necesitan port forward de 80 ni 443.
