# Scheduled tasks

What runs on its own and was set up by hand. Ubuntu defaults and the internal cron jobs of each image (Pi-hole, Nginx Proxy Manager, Home Assistant, Portainer) aren't listed.

The host runs in UTC. Times are Colombia time (UTC-5), with UTC in parentheses.

| Colombia time | Task | Frequency | Configured in |
|---|---|---|---|
| 01:00–02:00 (06:00–07:00 UTC) | [unattended-upgrades](#unattended-upgrades) | Weekly | `/etc/apt/apt.conf.d/20auto-upgrades` |
| 02:00 | [Watchtower](#watchtower) updates the images | Daily | [`watchtower/docker-compose.yml`](../watchtower/docker-compose.yml) |
| 03:00 (08:00 UTC) | Automatic reboot, only if an update asks for it | When needed | `/etc/apt/apt.conf.d/51auto-reboot` |

## unattended-upgrades

Updates the host's Ubuntu packages. It isn't a custom script: `unattended-upgrades` ships with Ubuntu and runs on its own. What changed is its configuration, in three files under `/etc/apt/apt.conf.d/`.

| File | Ubuntu default | Change |
|---|---|---|
| `50unattended-upgrades` | Security patches only | Also installs `-updates` |
| `20auto-upgrades` | Installs every day | Installs every 7 days |
| `51auto-reboot` | Doesn't exist: never reboots on its own | Reboots at 03:00 Colombia if an update asks for it |

To apply it on a new server:

```sh
sudo sed -i 's|^//\(\s*"${distro_id}:${distro_codename}-updates";\)|\1|' /etc/apt/apt.conf.d/50unattended-upgrades
printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "7";\n' | sudo tee /etc/apt/apt.conf.d/20auto-upgrades
printf 'Unattended-Upgrade::Automatic-Reboot "true";\nUnattended-Upgrade::Automatic-Reboot-Time "08:00";\n' | sudo tee /etc/apt/apt.conf.d/51auto-reboot
```

apt only updates host packages, not images. When `docker.io` is updated, the daemon restarts and so do the containers.

### How the weekly interval works

The check is daily; the install is weekly. `apt-daily-upgrade.timer` fires every day at 01:00 Colombia (06:00 UTC, with up to 60 random minutes) and checks whether 7 days have passed since the last install (`APT::Periodic::Unattended-Upgrade "7"`):

- **Less than 7 days:** it does nothing.
- **7 days or more:** it installs.

The 7 days count from the last install (`/var/lib/apt/periodic/unattended-upgrades-stamp`), not from a fixed weekday, and apt compares dates, not hours. If the server is off on the day it's due, it installs the next day instead of waiting another week. A manual `unattended-upgrade` run restarts the cycle from that day.

If the update leaves `/var/run/reboot-required`, the server reboots at 03:00 Colombia (`Automatic-Reboot-Time "08:00"`, in UTC).

## Watchtower

Every day at 02:00 (`WATCHTOWER_SCHEDULE: "0 0 2 * * *"`, `TZ: America/Bogota`). It pulls new images, recreates the containers, deletes the old images and reports to Telegram. A run can also be forced through its HTTP API, see [watchtower/README.md](../watchtower/README.md).
