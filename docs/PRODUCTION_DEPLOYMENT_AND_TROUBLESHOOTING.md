# Tender360 — Production deployment & 500 error troubleshooting

**Production URL (reported):** `https://tender360.smart-aiapps.com`  
**Symptom:** Browser shows **nginx `500 Internal Server Error`** (HTML page), **no application logs**  
**Created:** 2026-05-20  

---

## 1. Why you see nginx 500 with no Node logs

The error page footer **`nginx/1.18.0 (Ubuntu)`** means **nginx generated the response**, not Express.

| Layer | Typical log location | Your symptom |
|-------|-------------------|--------------|
| **nginx** | `/var/log/nginx/error.log` or `tender360.error.log` | **Check here first** |
| **PM2 / Node** | `backend/logs/pm2-*.log` | Empty if nginx never reaches Node for `/` |

Common causes (in order):

1. **`root` points to a missing folder** — e.g. `/var/www/tender360/frontend/dist` does not exist (build not run or wrong path) → nginx `500` on `try_files`.  
2. **Permission denied** — `www-data` cannot read `dist/` → nginx `500`.  
3. **Backend not running** — usually **`502 Bad Gateway`** for `/api`, but misconfigured `proxy_pass` can surface as `500`.  
4. **Only backend deployed** — nginx still configured for static `root` that was never copied.  
5. **Invalid nginx config** — `alias`/`rewrite` typo; run `sudo nginx -t`.

The **favicon 404** in the console is secondary (file missing); it does **not** cause the main 500.

---

## 2. Correct production architecture

Tender360 is **two parts**:

| Part | Build output | Runtime |
|------|--------------|---------|
| **Frontend** | `frontend/dist/` (Vite) | nginx **static** **or** Node `SERVE_STATIC` |
| **Backend** | `backend/src/server.js` | PM2 on `127.0.0.1:5025` |

**Recommended:** nginx serves `dist/`; nginx proxies `/api` and `/uploads` to Node.

Example config: [`deploy/nginx/tender360.conf`](../deploy/nginx/tender360.conf)

---

## 3. Deployment checklist (server)

Run on the Ubuntu server as the deploy user:

```bash
# 1. Clone / pull code
cd /var/www/tender360

# 2. Install dependencies
npm run install:all

# 3. Build frontend (REQUIRED for nginx root)
cd frontend
# Ensure production API URL:
#   VITE_API_URL=https://tender360.smart-aiapps.com/api
npm run build
ls -la dist/index.html   # MUST exist

# 4. Backend environment
cd ../backend
cp .env.production.example .env
nano .env   # set MONGO_URI, JWT secrets, CORS_ORIGIN

# 5. Create log dirs
mkdir -p ../backend/logs

# 6. Start API with PM2
cd ..
pm2 start deploy/ecosystem.config.cjs --env production
pm2 logs tender360-api --lines 50

# 7. nginx
sudo cp deploy/nginx/tender360.conf /etc/nginx/sites-available/tender360
# Edit paths: root, ssl_certificate, server_name
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Environment variables (production)

Copy [`backend/.env.production.example`](../backend/.env.production.example) → `backend/.env`.

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | Yes | `5025` (match nginx `proxy_pass`) |
| `MONGO_URI` | Yes | Atlas: **whitelist server public IP** |
| `JWT_ACCESS_SECRET` | Yes | Strong random string |
| `JWT_REFRESH_SECRET` | Yes | Strong random string |
| `CORS_ORIGIN` | Yes | `https://tender360.smart-aiapps.com` (no trailing `/`) |

Frontend build-time (before `npm run build`):

```env
# frontend/.env.production
VITE_API_URL=https://tender360.smart-aiapps.com/api
```

---

## 5. Diagnostic commands (run on server now)

```bash
# A) nginx error log — most important for your 500
sudo tail -n 80 /var/log/nginx/error.log
sudo tail -n 80 /var/log/nginx/tender360.error.log 2>/dev/null

# B) Confirm static build exists
ls -la /var/www/tender360/frontend/dist/index.html

# C) Permissions (nginx user must read dist)
namei -l /var/www/tender360/frontend/dist/index.html
sudo -u www-data test -r /var/www/tender360/frontend/dist/index.html && echo OK || echo FAIL

# D) Backend health (bypass nginx)
curl -s http://127.0.0.1:5025/api/health | jq .

# E) API through nginx
curl -sI https://tender360.smart-aiapps.com/api/health

# F) Homepage through nginx
curl -sI https://tender360.smart-aiapps.com/

# G) PM2
pm2 list
pm2 logs tender360-api --lines 100
```

### Expected results

| Check | Healthy |
|-------|---------|
| `dist/index.html` | File exists |
| `curl 127.0.0.1:5025/api/health` | JSON `"status":"OK"` |
| `curl -I .../api/health` | `HTTP/2 200` |
| `curl -I .../` | `HTTP/2 200` + `content-type: text/html` |
| nginx error.log | No `Permission denied` / `No such file` on root |

---

## 6. Fix patterns

### Fix A — Missing frontend build (most common)

```bash
cd /var/www/tender360/frontend
echo "VITE_API_URL=https://tender360.smart-aiapps.com/api" > .env.production
npm run build
sudo chown -R www-data:www-data dist   # if nginx runs as www-data
sudo nginx -t && sudo systemctl reload nginx
```

### Fix B — Wrong nginx `root`

In `/etc/nginx/sites-enabled/tender360`, set:

```nginx
root /var/www/tender360/frontend/dist;
```

Must match the path where `index.html` actually lives.

### Fix C — Backend not running

```bash
cd /var/www/tender360
pm2 start deploy/ecosystem.config.cjs --env production
pm2 save
```

If PM2 exits immediately, read `backend/logs/pm2-error.log` — usually **`MONGO_URI` missing** or MongoDB IP not whitelisted.

### Fix D — Proxy entire site to Node (alternative)

If you prefer **not** using nginx static `root`:

1. Build frontend on server.  
2. In `backend/.env`: `SERVE_STATIC=true`  
3. nginx: single `location / { proxy_pass http://127.0.0.1:5025; }`  
4. Redeploy latest code (includes `loaders/staticFrontend.js`).

### Fix E — MongoDB blocks startup (no PM2 logs)

Backend **exits** before listening if DB connect fails. Fix `MONGO_URI`, network, and Atlas IP allowlist. Then:

```bash
cd backend && node src/server.js
# Watch console for "MongoDB Connected" and "running on port 5025"
```

---

## 7. After deploy — smoke test

| Step | URL / action |
|------|----------------|
| 1 | `https://tender360.smart-aiapps.com/api/health` → JSON OK |
| 2 | `https://tender360.smart-aiapps.com/` → React login page (not nginx 500) |
| 3 | Login as seeded admin |
| 4 | Dashboard loads |

Full UAT: [`TENDER360_END_TO_END_TEST_PLAN.md`](./TENDER360_END_TO_END_TEST_PLAN.md)

---

## 8. Logging reference

| Source | Path |
|--------|------|
| nginx access | `/var/log/nginx/tender360.access.log` |
| nginx errors | `/var/log/nginx/tender360.error.log` |
| PM2 stdout | `backend/logs/pm2-out.log` |
| PM2 stderr | `backend/logs/pm2-error.log` |
| Node (morgan) | PM2 out log when `NODE_ENV=production` |

Enable PM2 log rotation:

```bash
pm2 install pm2-logrotate
```

---

## 9. SSL note

The sample nginx config includes commented `ssl_certificate` lines. Use **Certbot**:

```bash
sudo certbot --nginx -d tender360.smart-aiapps.com
```

---

## 10. Quick reference — repo deploy files

| File | Purpose |
|------|---------|
| `deploy/nginx/tender360.conf` | nginx site template |
| `deploy/ecosystem.config.cjs` | PM2 process + log paths |
| `backend/.env.production.example` | Production env template |
| `backend/src/loaders/staticFrontend.js` | Optional SPA from Node |

---

*If you paste the output of `sudo tail -n 30 /var/log/nginx/error.log` and `ls -la frontend/dist`, the exact fix can be confirmed in one step.*
