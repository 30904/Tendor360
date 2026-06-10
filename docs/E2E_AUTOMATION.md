# Tender360 — Automated E2E testing (Playwright)

**Tool:** [Playwright](https://playwright.dev/) (modern alternative to Selenium — faster, built-in reports, auto-wait)  
**Test plan alignment:** `TENDER360_END_TO_END_TEST_PLAN.md`

---

## What you get

| Output | Location |
|--------|----------|
| **HTML report** (pass/fail, screenshots, video, trace) | `playwright-report/index.html` |
| **Markdown summary** | `test-results/SUMMARY.md` |
| **JUnit / JSON** | `test-results/results.xml`, `results.json` |

Tests cover: **login → dashboard → discovery → pipeline (create/award/close) → intelligence/CRM → post-award archive**.

---

## Prerequisites

1. **Node 18+** on your machine  
2. **MongoDB** reachable (`MONGO_URI` in `backend/.env`)  
3. **Seed users** (MediCare admin):

```bash
cd backend
npm run seed:all
```

Default credentials (override with env vars):

| Role | Email | Password |
|------|-------|----------|
| System Administrator | `admin@medicare.com` | `Admin@123` |

4. **Install Playwright browsers** (once):

```bash
npx playwright install chromium
```

---

## Run locally

### Option A — Playwright starts everything (recommended first time)

Requires MongoDB reachable from `backend/.env` (`MONGO_URI`).

```bash
cd backend && npm run seed:all
cd ..
npx playwright install chromium
npm run test:e2e
```

Uses backend port **5026** (test mode, no auth rate limit) and frontend **5173**.

### Option B — You already run `npm run dev`

In one terminal:

```bash
npm run dev
```

In another:

```bash
npm run test:e2e:reuse
```

Uses your running servers on **5025** / **5173**. Wait 15 minutes if you previously hit “too many login attempts” (429).

Playwright will:

1. Start backend on **`5026`** (test mode) and frontend (`5173`) if not already running  
2. Log in once (`tests/auth.setup.js`) → save session to `tests/.auth/admin.json`  
3. Run all specs in order  
4. Write HTML + `SUMMARY.md` report  

### View report

```bash
npm run test:report
```

Opens `playwright-report/index.html` in the browser.

### Run with visible browser

```bash
npm run test:e2e:headed
```

### Interactive debugger

```bash
npm run test:e2e:ui
```

---

## Run against production

Backend and frontend must already be up on the server:

```bash
npm run test:e2e:prod
```

Or manually:

```bash
set PLAYWRIGHT_BASE_URL=https://tender360.smart-aiapps.com
set PLAYWRIGHT_API_URL=https://tender360.smart-aiapps.com/api
set PLAYWRIGHT_SKIP_WEBSERVER=1
npx playwright test
```

Use production admin credentials:

```bash
set E2E_ADMIN_EMAIL=your-prod-admin@company.com
set E2E_ADMIN_PASSWORD=your-password
```

---

## Test files

| File | Scope |
|------|--------|
| `tests/e2e/01-auth.spec.js` | Login page, bad password, good login, API health |
| `tests/e2e/02-navigation.spec.js` | All main module routes load |
| `tests/e2e/03-discovery-email.spec.js` | Discovery + email RTM |
| `tests/e2e/04-pipeline-lifecycle.spec.js` | Create tender → edit → award → close (serial) |
| `tests/e2e/05-intelligence-crm.spec.js` | AI RTM, CRM, admin connectors |

---

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `PLAYWRIGHT_BASE_URL` | `http://localhost:5173` | Frontend URL |
| `PLAYWRIGHT_API_URL` | `http://localhost:5026/api` | API base |
| `PLAYWRIGHT_API_PORT` | `5026` | Dedicated E2E backend (avoids clashing with dev/prod on 5025) |
| `PLAYWRIGHT_SKIP_WEBSERVER` | — | Set `1` when servers already running |
| `E2E_ADMIN_EMAIL` | `admin@medicare.com` | Login user |
| `E2E_ADMIN_PASSWORD` | `Admin@123` | Login password |

---

## CI example (GitHub Actions snippet)

```yaml
- run: cd backend && npm run seed:all
- run: npx playwright install --with-deps chromium
- run: npm run test:e2e
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Selenium vs Playwright

| | Selenium | Playwright (this project) |
|--|----------|---------------------------|
| Browser control | WebDriver | Direct CDP |
| Auto-wait | Manual | Built-in |
| Reports | Extra (Extent, etc.) | HTML built-in |
| Speed | Slower | Faster |
| Already in repo | No | Yes (`@playwright/test`) |

You can add Selenium later, but Playwright already meets your requirement.

---

## Extending tests

1. Copy a spec in `tests/e2e/`  
2. Use `test('TC-M-xxx description', async ({ page }) => { ... })`  
3. Reuse `tests/helpers/auth.js` for login  
4. Map IDs to `TENDER360_END_TO_END_TEST_PLAN.md`  

---

*Last updated: 2026-05-20*
