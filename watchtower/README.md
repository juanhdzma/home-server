# watchtower

Checks every container on the host each day at 02:00 (Colombia time). When there's a new image, it pulls it, recreates the container and deletes the old image. It reports to Telegram only when something was updated or failed.

## Force a run

```sh
curl -X POST -H "Authorization: Bearer <token>" "https://watchtower.nufi.com.co/v1/update?async=true"
```

- `<token>` is the value of `WATCHTOWER_HTTP_API_TOKEN` in the stack's environment variables.
- `async=true` makes it answer `202` right away. Without it, the response is cut off if the run updates Nginx Proxy Manager, which proxies the request.
- To update a single container: `?async=true&container=fondi`.
- The domain only resolves from the LAN or the VPN.
