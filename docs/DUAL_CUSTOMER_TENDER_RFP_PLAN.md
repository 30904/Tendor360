# Tender360 — Dual customer model: reference & tracking

**Document purpose:** Single reference for implementing **(1) customers participating in tenders** and **(2) customers creating RFPs and inviting participants** (criteria, terms, conditions). Use this for alignment, backlog grooming, and milestone tracking.

**Last reviewed:** 2026-05-11  
**Product:** Tender360 (`tm-app-code`)

**See §10** for concrete implementation order, API/schema sketches, and **Milestone 1 (first shippable slice)**.

---

## 1. Executive summary

The codebase today is largely optimized for **one buying organization** (`Company`): users belong to that company; **tenders** represent **external opportunities** the organization tracks and qualifies internally. There is **no first-class “issued RFP” lifecycle** with authenticated **supplier respondents**, **invitations**, or **submission objects** in the backend.

To support both customer types, introduce a clear **domain split**, new **entities** (issued event, invitation, submission), **cross-tenant access rules**, and **separate UX surfaces** (issuer workspace vs participant workspace), implemented in phases below.

---

## 2. Customer types (target state)

| Customer type | Role | Core jobs |
|---------------|------|-----------|
| **Participant / respondent** | Supplier-side user | Receive invitations, accept T&C, view RFP package, submit proposal, track status |
| **Issuer / buyer** | Buying organization | Create/publish RFP, define criteria & T&C, invite/select participants, evaluate submissions |

---

## 3. Current codebase — what we have

### 3.1 Tenancy & identity

- **`User`** — Required `companyId`; unique email **per company** (`backend/src/models/User.js`).
- **`Company`** — Tenant container, subscription fields, branding (`backend/src/models/Company.js`).
- **Roles** — `ROLES` in `backend/src/config/constants.js` (e.g. `TENDER MANAGER`, `ADMIN`, …); **`Role`** model with permission strings (`backend/src/models/Role.js`).
- **Auth** — JWT + `req.companyId` from authenticated user (`backend/src/middlewares/auth.js`).

**Implication:** Everything is **single-tenant buyer** by default; no “participant org” or cross-tenant invitation flow.

### 3.2 Tender model (buy-side opportunity)

- **`Tender`** — Scoped to issuer **pursuit** of **external** opportunities: `organization`, `deadline`, `pipelineStage`, internal `owner` / `assignedTo`, `winProbability`, `competitors`, etc. (`backend/src/models/Tender.js`).
- **Not** modeled as: “RFP we published for others to respond to.”

### 3.3 Evaluation (internal bid decision)

- **`Evaluation`** — Criteria/scores and `EVALUATION_DECISION` (BID / NO_BID / PENDING) tied to **`companyId` + `tenderId`** (`backend/src/models/Evaluation.js`).
- **Use case today:** Internal decision whether **we** bid on a tracked opportunity — **not** scoring multiple **supplier proposals** for **our** RFP.

### 3.4 Supplier registry (data, not login)

- **`PreQualificationVendor`** (and related) — Vendor **records** owned by the buying company (contacts, tiers, status). Useful as **supplier master**, **not** as logged-in respondents (`backend/src/models/PreQualificationVendor.js`).

### 3.5 Frontend

- Single **app shell** with modules: dashboard, tender intelligence, qualification, documents, pricing, calendar, RFP management **hubs**, admin (`frontend/src/App.jsx`).
- **RFP creation** UI exists as workflow/pages; **backend persistence for a full issuer→participant lifecycle** is not represented as a dedicated aggregate in core `models/index.js`.

### 3.6 Strengths to reuse

- Document pipeline & AI analysis paths.
- Permission patterns (`Role` + middleware).
- Dashboard and analytics patterns (after new entities exist).

---

## 4. Gaps — what is missing

### 4.1 Participants (tender / RFP respondents)

| Topic | Gap |
|--------|-----|
| Identity | No respondent user type bound to **supplier organization** vs buyer org |
| Access | No invitation/participation record governing **what** a user can see |
| Isolation | APIs assume `companyId` = data owner; respondents need **scoped** cross-tenant read via invitation/submission |
| Submissions | No persisted **proposal package** (files, pricing envelope, versions) per issued event |
| T&C | No **acceptance** record (version, timestamp, actor) |
| Notifications | No invite / deadline / clarification flows for respondents |

### 4.2 Issuers (RFP creators + inviters)

| Topic | Gap |
|--------|-----|
| Issued RFP entity | No canonical **`IssuedRfp`** / `SourcingEvent` / `ProcurementProject` in core models |
| Invitations | No invite tokens, participant list, eligibility, NDA flags |
| Bid evaluation | Need **per-submission** scoring; current evaluation model is **internal** bid/no-bid on **market** tenders |
| Permissions | Missing e.g. `rfp:issue`, `rfp:invite`, `submission:read`, `submission:score` |
| Terminology | UI “tender” vs “RFP” — align **market opportunity** vs **issued RFP** to avoid one schema doing two jobs |

---

## 5. Architectural recommendation

**Split aggregates:**

| Aggregate | Purpose |
|-----------|---------|
| **Market opportunity** (existing `Tender` or renamed in UX) | Track **external** tenders the **buying org** pursues; internal pipeline & bid/no-bid |
| **Issued RFP** (new) | **Our** published event: documents, schedule, criteria, T&C, visibility, status |

**Avoid** overloading `Tender` for both meanings unless you add explicit `recordType` and accept migration complexity — **new root entity for issued RFP is usually clearer.**

---

## 6. Phased implementation plan

Use the checklist in §7 for tracking; adjust dates/owners in your PM tool.

### Phase A — Product & compliance (design)

- [ ] Define issuer vs participant **user journeys** (happy path + edge cases).
- [ ] Legal: T&C versioning, retention, export/delete expectations.
- [ ] Decide **visibility**: invite-only vs open RFP vs hybrid.

### Phase B — Backend foundation

- [ ] New collections (names indicative): `IssuedRfp`, `RfpInvitation`, `RfpSubmission`, optional `SupplierOrganization` if distinct from registry-only vendors.
- [ ] Invitation token strategy (single-use, expiry, resend).
- [ ] Extend auth: claims for **organization type** / **capabilities**; middleware for **scoped cross-tenant** access.
- [ ] New permission strings + seeded roles (issuer admin, issuer user, supplier user, read-only).
- [ ] APIs: CRUD issued RFP (issuer), accept invitation, submit/update withdrawal, issuer evaluate.

### Phase C — Participant UX

- [ ] Route group or subdomain for **respondent** experience (`/respond/*` or equivalent).
- [ ] Pages: inbox, RFP brief, T&C acceptance, submission builder/upload, status.
- [ ] Hide full issuer navigation unless role permits both.

### Phase D — Issuer UX completion

- [ ] Publish workflow; participant management (import from `PreQualificationVendor` optional).
- [ ] Evaluation matrix across submissions; confidentiality rules.

### Phase E — Platform

- [ ] Email/SMS for invites and deadlines.
- [ ] Storage ACLs so participants cannot access each other’s artifacts.
- [ ] Reporting split: issuer analytics vs participant “my submissions.”

---

## 7. Tracking checklist (copy to sprint board)

### Discovery / alignment

- [ ] Stakeholder sign-off on §5 aggregate split
- [ ] UX wireframes: issuer vs participant shells

### Data model

- [ ] `IssuedRfp` schema approved
- [ ] `RfpInvitation` schema approved
- [ ] `RfpSubmission` schema approved
- [ ] Migration / seed strategy documented

### Backend

- [ ] Auth claims + middleware for participant access
- [ ] Issuer APIs for issued RFP lifecycle
- [ ] Participant APIs for invitation + submission
- [ ] Evaluation APIs for **submissions** (not only internal BID/NO_BID)

### Frontend

- [ ] Participant portal shell + routes
- [ ] Issuer: publish + invite flows wired to APIs
- [ ] Admin: optional supplier org onboarding

### Quality & release

- [ ] Security review (IDOR, token leakage, file URLs)
- [ ] E2E tests: invite → accept → submit → evaluate
- [ ] Release notes & operator runbook (email provider, token TTL)

---

## 8. File / module pointers (quick nav)

| Area | Location |
|------|----------|
| User / company | `backend/src/models/User.js`, `Company.js` |
| Tender (opportunity) | `backend/src/models/Tender.js` |
| Internal evaluation | `backend/src/models/Evaluation.js` |
| Roles / permissions | `backend/src/models/Role.js`, `backend/src/config/constants.js` |
| Auth middleware | `backend/src/middlewares/auth.js` |
| Vendor registry | `backend/src/models/PreQualificationVendor.js` |
| Frontend routes | `frontend/src/App.jsx` |

---

## 9. Revision history

| Date | Change |
|------|--------|
| 2026-05-11 | Initial document from codebase review |
| 2026-05-11 | Added §10 implementation guide (build order, schemas, APIs, Milestone 1) |
| 2026-05-11 | §10.11: Milestone 1 baseline implemented (APIs + buyer/participant UI) |

---

## 10. Implementation guide

This section turns §5–§7 into **executable work**: order of delivery, minimal contracts, and the **smallest vertical slice** that proves issuer → invite → participant → submit.

### 10.1 Principles

1. **Vertical slices** — Each milestone ships **working API + DB + one UI path**; avoid “model-only” PRs that nothing calls.
2. **Issuer `companyId` stays source of truth** for issued data; participants gain access only via **`RfpInvitation` / `RfpSubmission`**, not broad tenant bypass.
3. **Reuse existing auth** where possible: extend JWT payload and middleware rather than a second auth stack unless compliance requires it.

### 10.2 Recommended build order

| Step | What | Why first |
|------|------|-----------|
| 1 | **`IssuedRfp` model + issuer CRUD API** + register in `models/index.js` | Establishes aggregate root; dashboard can list “our RFPs” |
| 2 | **`RfpInvitation`** (token, email, supplier org ref, status, expiry) + **invite/resend** API | Gates all participant access |
| 3 | **Participant identity** — either `Company.type` / `User.roles` extension **or** dedicated `SupplierCompany` + users under it | Login must resolve **participant vs issuer** |
| 4 | **Middleware** `requireInvitationAccess` / `resolveRfpContext` | Centralizes cross-tenant rules (no ad-hoc checks per route) |
| 5 | **`RfpSubmission`** + upload metadata + submit/withdraw | Core product value |
| 6 | **Participant shell** (`/respond/*`) — inbox + brief + accept T&C + submit | UX proof |
| 7 | **Issuer evaluation** of submissions (new evaluator model or extend pattern from `Evaluation`) | Close the loop |
| 8 | Email, hardening, reporting | Production readiness |

### 10.3 Milestone 1 — “Thin slice” definition (first release candidate)

**Goal:** Issuer creates draft → publishes → adds one invitation with magic link → supplier user registers/logs in → sees one RFP → accepts T&C → uploads one file and submits.

**Out of scope for M1:** scoring matrix, clarifications thread, payments, multi-round bids, public open RFP.

**Done when:**

- [ ] All steps above work on staging with two browser profiles (issuer org / supplier org).
- [ ] Supplier cannot open another supplier’s submission URLs (403).
- [ ] Issuer sees submission row for that RFP.

### 10.4 Schema sketches (indicative — adjust before coding)

**`IssuedRfp`** (new collection, e.g. `IssuedRfp`)

- `issuerCompanyId` (ObjectId, ref `Company`, required, indexed)
- `title`, `reference`, `description`
- `status`: `draft | published | closed | cancelled`
- `visibility`: `invite_only` (extend later: `open`)
- `publishedAt`, `submissionDeadline`
- `termsAndConditions`: `{ version, bodyMarkdown or url, required: true }`
- `eligibilityCriteria`: array of strings or structured rules (start simple)
- `documentRefs`: links to existing `Document` IDs or embedded attachment meta
- `createdBy`, `updatedBy`, timestamps

**`RfpInvitation`**

- `issuedRfpId`, `issuerCompanyId`
- `email` (invited), optional `supplierCompanyId` once user/org bound
- `tokenHash` (never store raw token), `expiresAt`, `status`: `pending | accepted | declined | expired`
- `acceptedTermsVersion`, `acceptedAt`, `acceptedByUserId`
- `singleUse` / `usedAt` if using one-time redeem

**`RfpSubmission`**

- `issuedRfpId`, `issuerCompanyId`, `supplierCompanyId` (or `invitationId` as FK)
- `status`: `draft | submitted | withdrawn`
- `files`: `[{ documentId or storageKey, name, uploadedAt }]`
- `submittedAt`, `withdrawnAt`
- optional `pricingNotes` / sealed-bid flag later

### 10.5 Auth & JWT extensions

**Option A (minimal):** Keep single `User` collection; add `organizationKind`: `buyer | supplier` on `Company` (or `User.capabilities`). JWT includes `companyId`, `organizationKind`, and optional `participantScopes: [{ issuedRfpId, role }]`.

**Option B:** Separate `SupplierCompany` entity if buyer and supplier must never share `Company` semantics.

**Middleware pattern:**

- Issuer routes: existing `requireAuth` + `req.companyId === issuedRfp.issuerCompanyId`.
- Participant routes: `requireAuth` + load active `RfpInvitation` or `RfpSubmission` for `(user, issuedRfpId)` + check status/deadline.

### 10.6 API surface (indicative)

**Issuer (authenticated buyer)**

- `POST /api/issued-rfps` — create draft  
- `PATCH /api/issued-rfps/:id` — update draft fields  
- `POST /api/issued-rfps/:id/publish`  
- `POST /api/issued-rfps/:id/invitations` — body: `{ email, message? }`  
- `GET /api/issued-rfps/:id/submissions` — list submissions (issuer only)

**Participant**

- `GET /api/respond/invitations` — my pending invitations (by logged-in user email/org)  
- `POST /api/respond/invitations/redeem` — body: `{ token }` — bind invitation to user/session  
- `GET /api/respond/issued-rfps/:id` — brief + attachments **if** invitation valid  
- `POST /api/respond/issued-rfps/:id/accept-terms` — body: `{ version }`  
- `POST /api/respond/issued-rfps/:id/submissions` — create/update draft; upload via existing document upload pattern  
- `POST /api/respond/submissions/:id/submit` — final submit  

Prefix paths can match your existing `loaders/routes.js` style.

### 10.7 Frontend layout

- **`/issued-rfps/**`** (or under `/rfp-management`) — issuer list/detail/publish/invite; reuse `MainLayout`.
- **`/respond/**`** — **lighter layout**: logo, minimal nav (Inbox, Profile, Logout); no tender-intelligence sidebar until user also has issuer role.

Use route guards: `organizationKind === supplier` default to `/respond`; issuer stays on current app.

### 10.8 Security checklist (implement alongside M1)

- [ ] Invitation tokens: cryptographically random; store **hash only**; constant-time compare.
- [ ] Every participant read/write checks **invitation + RFP id** (no IDOR on `:id`).
- [ ] File URLs: signed URLs or auth-gated download route; no guessable S3 keys shared across bidders.
- [ ] Rate-limit redeem and login on invitation endpoints.

### 10.9 Testing strategy

- **Integration tests:** redeem token → accept terms → submit; issuer lists submission.
- **Contract tests:** OpenAPI or Postman collection checked into `docs/api/` (optional).

### 10.10 Suggested PR breakdown

| PR | Contents |
|----|----------|
| PR1 | `IssuedRfp` model, routes, issuer list/create (stub UI optional) |
| PR2 | `RfpInvitation` + publish + invite email (log-only OK if no SMTP yet) |
| PR3 | Participant redeem + `RfpSubmission` draft |
| PR4 | Participant UI `/respond/*` + issuer submissions table |
| PR5 | Evaluation stub + hardening |

### 10.11 Implemented in codebase (Milestone 1 baseline)

| Area | Location |
|------|----------|
| Issuer APIs | `GET/POST/PATCH /api/issued-rfps`, `POST …/publish`, `POST …/invitations`, `GET …/submissions` |
| Participant APIs | `GET /api/respond/invitations`, `POST /api/respond/invitations/redeem`, issued-RFP + submission routes under `/api/respond` |
| Participant signup | `POST /api/auth/register-respondent` |
| Buyer UI | `/issued-rfps`, `/issued-rfps/new`, `/issued-rfps/:id` (sidebar **Issued**) |
| Participant UI | `/respond/inbox`, `/respond/redeem`, `/respond/rfp/:id`; login link **Create participant account** |
| Org kind | `Company.organizationKind`: `buyer` \| `supplier`; JWT + `/auth/profile` include `organizationKind` |

---

*Maintainers: update §7 checkboxes and §9 when milestones complete; keep §5 decision record if aggregate names or schema change.*
