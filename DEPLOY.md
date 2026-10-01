# Deploying to EC2

The landing page ships as two Docker Compose services: the app itself (`web`)
and [Caddy](https://caddyserver.com/) in front of it as a reverse proxy,
handling automatic HTTPS via Let's Encrypt. Deployment is manual and direct:
clone the repo onto an EC2 instance and run `docker compose up`. No CI/CD
pipeline at this stage.

This describes the general procedure. For the specifics of the actual running
deployment (instance ID, IP, domain, resource sizing), see
[`docs/deploy/01-ec2-resources-and-cost.md`](./docs/deploy/01-ec2-resources-and-cost.md).

## Prerequisites on the EC2 instance

- Amazon Linux 2023 or Ubuntu, with Docker and the Docker Compose plugin installed:

  ```bash
  # Amazon Linux 2023
  sudo dnf install -y docker git
  sudo systemctl enable --now docker
  sudo usermod -aG docker "$USER"   # log out/in for this to take effect

  DOCKER_COMPOSE_VERSION=v2.29.7
  sudo curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-$(uname -m)" \
    -o /usr/libexec/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
  ```

- A security group inbound rule allowing traffic on port 80/443 (and 22 for SSH,
  ideally restricted to a known IP rather than open to the world).
- On an instance with 1 GB RAM or less (e.g. `t3.micro`), add a swapfile first —
  `next build` inside the Docker build can otherwise get OOM-killed:

  ```bash
  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
  ```

## First deploy

```bash
git clone <this-repo-url> greppa
cd greppa
cp .env.example .env
# edit .env: set WAITLIST_EXPORT_PASSWORD to a real value, and
# GMAIL_USER / GMAIL_APP_PASSWORD if you want signup notification emails
# (see README.md — App Password, not the account's regular password)

# The container runs as uid 1001 (see Dockerfile). On a brand new clone the
# bind-mounted ./data directory doesn't exist yet, so Docker auto-creates it
# as root — which the app then can't write into ("unable to open database
# file" / SQLITE_CANTOPEN). Pre-create it with the right owner first:
mkdir -p data
sudo chown 1001:1001 data

docker compose up -d --build
```

Caddy (the `caddy` service) is what's actually bound to ports 80/443 on the
host; the `web` service isn't published to the host at all — Caddy reaches it
over the Compose network by service name (`web:3000`). Waitlist signups
persist to `./data/waitlist.db` on the host via the mounted volume, so they
survive `docker compose down` / container rebuilds.

## Pointing a custom domain at it

1. Allocate an Elastic IP and associate it with the instance, so the public IP
   doesn't change if the instance is stopped/started.
2. At your domain's registrar, add two `A` records pointing at that Elastic IP:
   one for the bare domain (`@`) and one for `www`.
3. Edit the `Caddyfile` in this repo so the first site block lists your actual
   domain(s):

   ```
   yourdomain.com, www.yourdomain.com {
     reverse_proxy web:3000
   }
   ```

   The second block (`:80 { reverse_proxy web:3000 }`) is a deliberate
   fallback that keeps the bare IP serving plain HTTP — useful for quick
   checks, and because Let's Encrypt can't issue a certificate for a raw IP
   address anyway.
4. `git push`, then on the instance: `git pull && docker compose up -d --build`.
   Caddy requests and renews the certificate automatically the first time it
   sees traffic for that domain — no manual certbot steps. Give DNS a few
   minutes (occasionally longer) to propagate before expecting the cert to
   issue; Caddy retries automatically if it isn't ready yet.
5. Verify: `curl -I https://yourdomain.com` should return `200`, and
   `curl -I http://yourdomain.com` should return a `3xx` redirect to HTTPS.

## Redeploying after changes

```bash
cd greppa
git pull
docker compose up -d --build
```

This rebuilds the `web` image and replaces the running container (Caddy is
untouched unless the `Caddyfile` changed). The mounted `./data` volume and
Caddy's certificate storage (`caddy_data` volume) are both untouched, so
waitlist signups and the TLS certificate are preserved across redeploys.

## Exporting waitlist signups

```bash
curl -u x:<WAITLIST_EXPORT_PASSWORD> https://yourdomain.com/api/waitlist/export -o waitlist.csv
```

## Logs / troubleshooting

```bash
docker compose logs -f web
docker compose logs -f caddy   # certificate issuance / renewal issues show up here
docker compose ps
```
