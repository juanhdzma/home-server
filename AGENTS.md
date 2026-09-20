# home-server

Repo de infra: un folder por stack, cada uno con su `docker-compose.yml` para deploy vía Portainer (git stack).

## Workflow

- Se trabaja directo sobre `master`. Sin branches ni PRs.
- Commits siguen Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).

## Docker Compose

- Cada service debe declarar un `container_name` explícito.
- Cada service debe conectarse a la network externa `infra_proxy`, excepto los que usan `network_mode: host`.
- Los datos persistentes deben usar named volumes declarados bajo `volumes:` sin `name:`, para que Compose les aplique el prefijo del stack.
- Cada stack que use variables de entorno debe incluir un `example.env` versionado con valores de ejemplo y un `stack.env` ignorado con los valores reales de deploy.
