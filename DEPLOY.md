# Deploying to EC2

The landing page ships as a Docker container. Deployment is manual and direct:
clone the repo onto an EC2 instance, build the image there, and run it with
Docker Compose. No CI/CD pipeline at this stage.

## Prerequisites on the EC2 instance

- Amazon Linux 2023 or Ubuntu, with Docker and the Docker Compose plugin installed:

  ```bash
  # Amazon Linux 2023
  sudo dnf install -y docker
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"   # log out/in for this to take effect

  DOCKER_COMPOSE_VERSION=v2.29.7
  sudo curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-$(uname -m)" \
    -o /usr/libexec/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
  ```

- A security group inbound rule allowing traffic on port 80/443 (and 22 for SSH).
- Git installed (`sudo dnf install -y git`).

## First deploy

```bash
git clone <this-repo-url> greppa
cd greppa
cp .env.example .env
# edit .env: set WAITLIST_EXPORT_PASSWORD to a real value, and
# GMAIL_USER / GMAIL_APP_PASSWORD if you want signup notification emails
# (see README.md — App Password, not the account's regular password)
docker compose up -d --build
```

The app is now listening on port 3000 on the instance. Waitlist signups persist
to `./data/waitlist.db` on the host via the mounted volume, so they survive
`docker compose down` / container rebuilds.

## Pointing a custom domain at it

1. Allocate an Elastic IP and associate it with the instance, so the public IP
   doesn't change if the instance is stopped/started.
2. Create an `A` record for your domain pointing at that Elastic IP.
3. Put a reverse proxy in front of the container to terminate TLS before any
   real traffic hits it — waitlist emails should never be submitted over plain
   HTTP. The simplest option is [Caddy](https://caddyserver.com/), which
   handles Let's Encrypt certificates automatically:

   ```bash
   sudo dnf install -y caddy   # or follow Caddy's install docs for your distro
   ```

   Minimal `/etc/caddy/Caddyfile`:

   ```
   greppa.app {
     reverse_proxy localhost:3000
   }
   ```

   ```bash
   sudo systemctl enable --now caddy
   ```

   Open port 443 (and keep 80 open — Caddy uses it for the ACME challenge) in
   the instance's security group.

## Redeploying after changes

```bash
cd greppa
git pull
docker compose up -d --build
```

This rebuilds the image and replaces the running container. The mounted
`./data` volume is untouched, so waitlist signups are preserved.

## Exporting waitlist signups

```bash
curl -u x:<WAITLIST_EXPORT_PASSWORD> https://greppa.app/api/waitlist/export -o waitlist.csv
```

## Logs / troubleshooting

```bash
docker compose logs -f web
docker compose ps
```
