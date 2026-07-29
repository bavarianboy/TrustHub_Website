# Deploying to a VPS

This guide takes a fresh Ubuntu VPS to a running production instance of Trust
Hub: one Node process serving both the API and the built frontend, behind
nginx doing TLS termination.

Repo: [github.com/bavarianboy/TrustHub_Website](https://github.com/bavarianboy/TrustHub_Website)
(private — see [Get the code onto the server](#3-get-the-code-onto-the-server)
for the deploy-key setup a VPS needs to clone it).

## Architecture

In production (`NODE_ENV=production`), `artifacts/api-server` serves the
built SPA itself — [artifacts/api-server/src/app.ts](artifacts/api-server/src/app.ts)
mounts `express.static` on `artifacts/trust-hub/dist/public` and falls back to
`index.html` for any non-`/api` route, so wouter's client-side routing (`/ar/...`
included) works on a hard refresh or a shared link, not just client-side
navigation. That means:

- **One process to run and monitor** — no separate static file server.
- **No CORS to configure** — the API and the page it's rendered from share an
  origin.
- **Session cookies work correctly** — `secure` and `SameSite=Lax` both
  assume same-origin, which this setup gives you.

Postgres is **not self-hosted** — this project uses [Neon](https://console.neon.tech),
a managed Postgres service, from both dev and prod. There's nothing to
install or back up on the VPS for the database itself; point `DATABASE_URL`
at your Neon project's pooled connection string.

The one piece of state that *does* live on the VPS is
`artifacts/api-server/uploads/` — locally-stored admin-uploaded images (see
`CLAUDE.md`). It's plain disk, not part of git, and not automatically backed
up — see [Uploaded images](#uploaded-images) below.

```
Internet → nginx (:80, :443, TLS) → Node (127.0.0.1:5000) → Neon Postgres
                                          └─ serves dist/public (built SPA)
                                          └─ serves uploads/ (admin images)
```

## Prerequisites

- A VPS running Ubuntu 22.04 or 24.04 LTS, with a non-root sudo user
- A domain name with its DNS `A` (and `AAAA`, if using IPv6) record pointed
  at the VPS's IP address
- A [Neon](https://console.neon.tech) Postgres project and its pooled
  connection string
- SSH access to the VPS

Everything below assumes you're logged in as that sudo user, not root.

## 1. Install system dependencies

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx ufw
```

**Node.js 24** (via NodeSource — this project was built and tested against
this version; see the `--env-file-if-exists` note in `README.md` for why
older Node 22.9+ would technically also work, but 24 is what's used here):

```sh
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
node --version   # confirm v24.x
```

**pnpm**, pinned to the version this repo expects, via Corepack (bundled with
Node):

```sh
sudo corepack enable
corepack prepare pnpm@10.34.5 --activate
pnpm --version   # confirm 10.34.5
```

## 2. Firewall

Allow SSH and web traffic; nginx is the only thing that should be reachable
from the internet — the Node process binds to `127.0.0.1` only (see the
systemd unit below) and is never exposed directly.

```sh
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## 3. Get the code onto the server

The repo is [github.com/bavarianboy/TrustHub_Website](https://github.com/bavarianboy/TrustHub_Website)
and is **private**, so cloning from the VPS needs its own credential — don't
reuse a personal token in the clone URL. Set up a deploy key instead:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/trust_hub_deploy -C "trust-hub-vps-deploy" -N ""
cat ~/.ssh/trust_hub_deploy.pub
```

Add that public key at
[github.com/bavarianboy/TrustHub_Website/settings/keys](https://github.com/bavarianboy/TrustHub_Website/settings/keys)
→ **Add deploy key** (read-only is enough — the VPS only ever pulls).

```sh
cat >> ~/.ssh/config <<'EOF'
Host github-trust-hub
  HostName github.com
  User git
  IdentityFile ~/.ssh/trust_hub_deploy
  IdentitiesOnly yes
EOF

sudo mkdir -p /opt/trust-hub
sudo chown "$USER":"$USER" /opt/trust-hub
git clone github-trust-hub:bavarianboy/TrustHub_Website.git /opt/trust-hub
cd /opt/trust-hub
```

## 4. Configure environment variables

```sh
cp .env.example .env
chmod 600 .env
```

Edit `.env`:

```sh
# Neon's pooled connection string, from console.neon.tech
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

PORT=5000
NODE_ENV=production

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Must differ from any value used in dev — a leaked dev secret would let
# someone forge a production session cookie.
SESSION_SECRET=<paste a freshly generated 64-char hex string here>

# Leave CORS_ORIGIN unset in production — see Architecture, above.

LOG_LEVEL=info
```

Do **not** set `CORS_ORIGIN` here — its presence switches the API into
dev-style cross-origin mode (see the comment in
[app.ts](artifacts/api-server/src/app.ts)), which is neither needed nor
wanted once nginx and Node share an origin.

## 5. Install, build, and initialize the database

```sh
cd /opt/trust-hub
pnpm install --frozen-lockfile
pnpm run build          # typechecks, builds the API bundle and the SPA
pnpm run db:push        # pushes the Drizzle schema to Neon
```

Create your first admin login and seed the initially-empty content tables —
**these seed scripts are one-time**, not idempotent against admin edits (see
`CLAUDE.md`); running them again later will overwrite anything edited from
`/admin`:

```sh
pnpm --filter @workspace/scripts run seed-admin -- you@example.com "a-strong-password" "Your Name"
pnpm --filter @workspace/scripts run seed-page-content
pnpm --filter @workspace/scripts run seed-legal-content
pnpm --filter @workspace/scripts run seed-contact-content
```

Change the admin password immediately after first login if you typed it on
the command line (it'll be in your shell history).

## 6. Run it with systemd

Create `/etc/systemd/system/trust-hub.service`:

```ini
[Unit]
Description=Trust Hub API + SPA
After=network.target

[Service]
Type=simple
User=<your-sudo-user>
WorkingDirectory=/opt/trust-hub/artifacts/api-server
EnvironmentFile=/opt/trust-hub/.env
ExecStart=/usr/bin/node --enable-source-maps ./dist/index.mjs
Restart=always
RestartSec=5
# Node process only ever needs to bind 127.0.0.1:5000 — nginx is the public
# edge — but hardening beyond that (NoNewPrivileges, ProtectSystem, etc.) is
# left as a follow-up rather than risking an under-tested unit here.

[Install]
WantedBy=multi-user.target
```

`EnvironmentFile` reads `.env` directly — this is why
[the api-server's `start` script](artifacts/api-server/package.json) (unlike
`dev`) does *not* pass `--env-file-if-exists`: systemd is what supplies the
environment in production, not Node's own `.env` loading.

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now trust-hub
sudo systemctl status trust-hub
curl -s http://127.0.0.1:5000/api/healthz   # expect {"status":"ok"}
journalctl -u trust-hub -f                  # tail logs
```

### Alternative: pm2

If you'd rather not write a systemd unit, `npx pm2 start artifacts/api-server/dist/index.mjs
--name trust-hub --cwd artifacts/api-server` plus `pm2 save` and `pm2 startup`
achieves the same thing (env vars still need to come from somewhere — export
them in the shell that runs `pm2 start`, or use pm2's `--env-file`). This
guide uses systemd because it needs nothing beyond what Ubuntu already
ships.

## 7. nginx reverse proxy

Create `/etc/nginx/sites-available/trust-hub`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # Admin-uploaded images can be up to 5MB (see the multer limit in
    # artifacts/api-server/src/routes/admin/uploads.ts) — nginx's own 1MB
    # default would reject those uploads before they ever reach Node.
    client_max_body_size 6M;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```sh
sudo ln -s /etc/nginx/sites-available/trust-hub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

At this point the site should be reachable over plain HTTP at your domain.

## 8. TLS with Let's Encrypt

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot rewrites the nginx server block to redirect HTTP → HTTPS and add the
certificate paths, and installs a systemd timer for renewal — nothing further
to do. Confirm with:

```sh
sudo certbot renew --dry-run
```

## Redeploying after a change

```sh
cd /opt/trust-hub
git pull
pnpm install --frozen-lockfile
pnpm run build
sudo systemctl restart trust-hub
curl -s http://127.0.0.1:5000/api/healthz
```

If a change touched `lib/db/src/schema/`, run `pnpm run db:push` before
restarting. This is a brief-downtime redeploy (the old process stops, the new
one starts) — fine for this traffic profile; blue/green or a process
supervisor with graceful reload is a later concern if it ever isn't.

## Uploaded images

`artifacts/api-server/uploads/` (admin-uploaded Services images, see
`CLAUDE.md`) is local disk on the VPS, gitignored, and untouched by
`git pull`/`pnpm run build` — a redeploy is safe. It is **not** covered by
Neon's backups (that's the database only) and **not** automatically backed up
by anything in this guide. Until it's worth migrating to S3-compatible object
storage (flagged as a known gap in `CLAUDE.md`), back it up yourself, e.g. a
cron'd `rsync` to another host, or at minimum include it in whatever VPS
snapshot/backup routine you already have.

## Database backups

Neon takes these care of — point-in-time restore is available from the Neon
console without any setup on your end. Nothing to configure here.

## Health checks / monitoring

- `GET /api/healthz` → `{"status":"ok"}` — wire this into whatever uptime
  monitor you use (UptimeRobot, a cron'd curl + alert, etc.)
- `sudo systemctl status trust-hub` — is the process up
- `journalctl -u trust-hub -f` — tail application logs (pino JSON lines)
- `sudo systemctl status nginx` / `sudo tail -f /var/log/nginx/error.log`

## Environment variable reference

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Neon pooled connection string |
| `SESSION_SECRET` | Yes | ≥16 chars; the server refuses to start without one. Use a different value than dev. |
| `PORT` | No (default `5000`) | What Node binds to; nginx proxies to it |
| `NODE_ENV` | Yes, set to `production` | Enables the SPA static-serving block in `app.ts`, `secure` session cookies, and JSON (non-pretty) logs |
| `CORS_ORIGIN` | No — leave unset | Only for local dev's two-process setup; see Architecture |
| `LOG_LEVEL` | No (default `info`) | `trace`\|`debug`\|`info`\|`warn`\|`error` |
| `UPLOADS_DIR` | No | Overrides where admin image uploads are written (default: `artifacts/api-server/uploads/`) |
| `FRONTEND_DIST_DIR` | No | Overrides where the built SPA is served from (default: `artifacts/trust-hub/dist/public`) |

## Security checklist

- [ ] `.env` is `chmod 600`, owned by the deploy user, never committed
- [ ] `SESSION_SECRET` is unique to production, not reused from `.env.example` or dev
- [ ] `ufw` is enabled with only SSH + nginx open; port 5000 is not reachable from outside `127.0.0.1`
- [ ] TLS certificate is installed and auto-renewing (`certbot renew --dry-run` passes)
- [ ] The admin password set during `seed-admin` was changed after first login if it ever touched shell history
- [ ] OS packages are kept current (`sudo apt update && sudo apt upgrade`)
