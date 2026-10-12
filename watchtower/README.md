# watchtower

Revisa todos los containers del host cada día a las 2:00 am (hora Colombia). Si hay una imagen nueva, la baja, recrea el container y borra la imagen anterior. Avisa por Telegram solo cuando algo se actualizó o falló.

## Forzar una corrida

```sh
curl -X POST -H "Authorization: Bearer <token>" "https://watchtower.nufi.com.co/v1/update?async=true"
```

- `<token>` es el valor de `WATCHTOWER_HTTP_API_TOKEN` en las env vars del stack.
- `async=true` hace que responda `202` de inmediato. Sin él la respuesta se corta si la corrida actualiza a NPM, que es el proxy del request.
- Para actualizar un solo container: `?async=true&container=fondi`.
- El dominio solo resuelve dentro de la LAN o por la VPN.
