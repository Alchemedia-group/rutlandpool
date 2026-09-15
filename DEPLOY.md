# Deploying to your own server

This is a Next.js app. The backend (database, auth, file storage) is
Supabase and stays exactly as-is — you're only moving where the *website
itself* runs, not the data. Two ways to do that below; pick whichever
matches your server. Either way you need **Node.js 20+** installed (or
Docker) — this is a server-rendered app, not static HTML, so a plain
shared/PHP-only host won't work.

The `.env` file already included has your live Supabase URL and anon key
(the public, client-safe key — this is normal for Supabase, not a leaked
secret). No editing needed unless you want to point it at a different
Supabase project.

## Option A — Docker (recommended, simplest)

```bash
docker build -t rutlandpool .
docker run -d --name rutlandpool -p 3000:3000 --restart unless-stopped rutlandpool
```

The site is now listening on port 3000. Point your reverse proxy /
domain at that port (see the nginx example below).

## Option B — Plain Node + pm2

```bash
npm ci
npm run build
npm install -g pm2        # if you don't already have a process manager
pm2 start npm --name rutlandpool -- start
pm2 save
```

`npm start` runs `next start`, which listens on port 3000 by default
(set `PORT=xxxx` before it to change that). `pm2 save` + `pm2 startup`
(follow the printed instructions) makes it survive a server reboot.

## Pointing your domain at it (nginx example)

Whichever option you used, the app is now listening on `localhost:3000`.
A typical nginx reverse proxy config:

```nginx
server {
    listen 80;
    server_name yourdomain.co.uk;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then get HTTPS with `certbot --nginx` (Let's Encrypt) as usual.

## Updating the site later

- **Docker:** pull/copy the new source, `docker build -t rutlandpool .`
  again, then `docker stop rutlandpool && docker rm rutlandpool` and
  re-run the `docker run` command above.
- **pm2:** copy the new source over, `npm ci && npm run build`, then
  `pm2 restart rutlandpool`.

## What doesn't move

Supabase (database + auth + the admin login) keeps running on Supabase's
own servers regardless of where this Next.js app is hosted — there's
nothing to migrate there. If you ever decide to leave Vercel *and* stop
using this Vercel project, remember to also disconnect/delete it in the
Vercel dashboard so it stops auto-deploying from GitHub pushes.
