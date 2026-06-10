# Thermo Fisher — Requirement Traceability Matrix (RTM) Gap Analysis

**Customer document:** Tender Management — Requirement Traceability Matrix (Thermo Fisher)  
**Product assessed:** Tender360 (`tm-app-code`)  
**Analysis date:** 2026-05-13  
**Last updated:** 2026-05-20 (Phase A discovery implementation — MediCare / healthcare tenant)  
**Method:** Full RTM list (TB-001–TB-019, ATS-001–ATS-010) compared to backend connectors, intelligence/discovery modules, document AI, automation, frontend hubs, and `docs/TENDER360_FUNCTIONAL_USER_GUIDE.md` §19 (feature maturity).

---

## 1. Executive summary

Thermo Fisher’s RTM describes a **BOT-led discovery and ingestion platform** tightly integrated with **GovWin**, **SAM.gov**, **Microsoft 365 (Outlook / Teams / SharePoint)**, **Salesforce**, **PostgreSQL**, and **GenAI** agents—with several workflow items explicitly **out of scope** (department routing, automated bid submission, response reminders, image-based email tenders).

**Tender360** is a **buyer/supplier tender and RFP workspace** (React, Express, **MongoDB**) with strong **market opportunity pipeline**, **discovery connectors (GovWin API, SAM.gov)**, **scoring/relevancy**, **document upload + AI extraction**, and **issued-RFP / respond** flows. It does **not** implement the Thermo Fisher BOT automation stack end-to-end.

| Category | Count | RTM IDs |
|----------|------:|---------|
| **Implemented (MVP / in-app)** — Phase A discovery delivered in code | **6** | TB-001, TB-002, TB-003, TB-004, TB-005, TB-006 |
| **Available** (meets intent without major RTM-specific build) | **1** | TB-005 (search API; now includes attachment fallback) |
| **Requires modification** (partial fit; further hardening) | **12** | TB-007–TB-011, TB-014–TB-016, ATS-002, ATS-009 |
| **Not available** (missing or RTM out of scope) | **12** | TB-012, TB-013, TB-017–TB-019, ATS-001, ATS-003–ATS-008, ATS-010 |

> **May 2026 note:** TB-001–TB-006 are **not** full Thermo “unattended BOT + M365” parity; they are **API-first discovery** with scheduler, upsert, attachment harvest (incl. demo placeholders), SAM fallback, and import-time metadata. See **§9 Implementation progress**.

**Notes on “Available” vs “Modification”:** Several Phase 1 RTM items marked **Available** by the customer (e.g. TB-001 GovWin login, TB-006 metadata extraction) are classified here as **Modification** because Tender360 implements a **different integration pattern** (API/portal workspace vs unattended BOT + M365). See Section 4 for per-row rationale.

**Strategic alignment**

- **Good fit:** SAM.gov ingestion, GovWin-style API discovery, tender pipeline, AI relevancy scoring, document intelligence hub, import queue, automation console (in-app).
- **Major gaps:** Outlook email tender BOT (ATS suite), SharePoint/Teams folder automation, Salesforce account validation, **production-hardened** GovWin/SAM attachment download (MVP worker exists), structured commercial extraction (ship-to, SKU, pricing sheets), PostgreSQL as system of record, BOT operational emails/screenshots (TB-016).
- **Customer out-of-scope items (TB-017, TB-018, TB-019, ATS-008):** Tender360 also does **not** deliver these as production BOT features; some related **UI scaffolds** exist (workflows, calendar reminders) but not Thermo-specified automation.

### 1.1 One-page executive briefing (leadership / customer)

**Thermo Fisher ask:** Unattended BOT discovers GovWin/SAM/email tenders → downloads documents → AI extracts commercial data → scores relevancy → stores in DB → publishes to Teams/SharePoint → Excel reports → alerts on failure.

**Tender360 today:** Buyer **tender workspace** with **GovWin + SAM + generic API / web-scrape discovery connectors**, **24h lookback scheduled jobs**, **new/updated bid upsert**, **attachment harvest + SAM fallback**, **import-time GovWin metadata**, **prospecting RTM UI**, and **supplier RFP portal**—on **MongoDB**, without **Outlook/SharePoint/Salesforce BOT** automation.

| Lens | Verdict |
|------|---------|
| **Can we pursue Thermo Phase 1 with current product?** | **Stronger on discovery (TB-001–006 MVP)** — pipeline + scoring + document AI yes; production GovWin/SAM credentials, email BOT, M365 outputs, commercial parsers (TB-007–009), Excel BOT reports (TB-014), and failure email (TB-016) still needed. |
| **What is already strong?** | Discovery Connectors admin, Intelligence Platform config, prospecting hub, import queue with new/updated counts, SAM.gov API + notice-doc fallback, relevancy scoring, document AI hub. |
| **What blocks “RTM Available” claims?** | Email ATS (10 reqs), SharePoint/Teams (2 reqs), production attachment URLs from live GovWin (vs demo), structured line-item extraction (TB-007–009). |
| **What is explicitly excluded by customer?** | TB-017, TB-018, TB-019, ATS-008 — **no Tender360 build required** unless RTM changes. |

**Coverage at a glance (32 requirements)** — *after May 2026 Phase A build*

```
Implemented MVP (TB-001–006) ..  6  ██████
Still needs modification .... 12  ████████████
Not available / OOS ......... 12  ████████████
```

**Recommended investment (engineering bands, one team)**

| Phase | Focus | Calendar (indicative) | Cumulative effort |
|-------|--------|------------------------|-------------------|
| **A** | Discovery hardening: updates, 24h scan, attachments, failure email, Excel export | **8–10 weeks** | ~**35–45 dev-days** |
| **B** | AI commercial extraction + Salesforce + scoring alignment + optional Postgres sync | **10–14 weeks** | ~**50–70 dev-days** |
| **C** | Full Outlook email tender BOT (ATS, except ATS-008) | **14–20 weeks** | ~**70–100 dev-days** |
| **D (optional)** | Microsoft 365: SharePoint upload + bid folders (TB-012, TB-013) | **8–12 weeks** | ~**40–55 dev-days** |

**Total (A+B+C):** roughly **32–44 weeks** sequential, or **20–28 weeks** with parallel backend/integration squads. **Phase D** adds **8–12 weeks** if customer insists on Teams/SharePoint instead of in-platform document rooms.

**Three decisions for the customer workshop**

1. **System of record:** Accept **MongoDB** in Tender360 + BI export (TB-015 **M**), or mandate **PostgreSQL** sync (**L**).  
2. **Relevancy (TB-010):** Use **in-platform scoring** (ready, **M** to tune) vs retain **external GenAI agent** (**M** integration).  
3. **Collaboration (TB-012/013):** Build **Microsoft Graph** (**XL/L**) vs standardize on **Tender360 data rooms** per tender (**M**, no SharePoint).

---

### 1.2 Implementation effort matrix (S / M / L / XL)

**Sizing legend (one full-stack engineer + QA; ranges are indicative)**

| Size | Dev effort | Typical scope |
|------|------------|---------------|
| **S** | 3–8 days | Config, small API/UI, wiring existing modules |
| **M** | 2–4 weeks | New service slice, moderate UI, one integration surface |
| **L** | 5–10 weeks | Multi-module feature, parsers, or substantial integration |
| **XL** | 10–16+ weeks | New subsystem (e.g. Microsoft Graph mail + rules engine) |
| **—** | No build | Out of scope in RTM or not offered |

**Master matrix — all RTM requirements**

| ID | Gap category | Effort | Phase | Tender360 status (May 2026) | Notes / dependency |
|----|--------------|--------|-------|-----------------------------|-------------------|
| TB-001 | Modification → **MVP done** | **M** | A | **Done** | Admin → Discovery Connectors; GovWin/SAM/generic API/web scrape; tenant credentials on `TenderSource`; `POST /api/discovery-connectors/seed-demo` |
| TB-002 | Modification → **MVP done** | **S** | A | **Done** | Default `lookbackHours: 24`; `modifiedSince` / SAM `postedFrom` on each job; Scheduler UI |
| TB-003 | Modification → **MVP done** | **M** | A | **Done** | Upsert by `discovery.externalKey`; content-hash change detection; `recordsNew` / `recordsUpdated` on batches |
| TB-004 | Modification → **MVP done** | **L** | A | **Partial** | `AttachmentHarvestService`; links `Document` to tender; demo placeholder files when URL unavailable |
| TB-005 | Available | **S** | A | **Done** | `SamGovConnector.fetchAttachments` fallback when primary feed has no files |
| TB-006 | Modification → **MVP done** | **M** | A | **Partial** | `DiscoveryMetadataService` on import; `/tender-discovery/metadata` UI; not GovWin HTML scrape |
| TB-007 | Modification | **L** | B | Line-item / ship-to / SKU parsers |
| TB-008 | Modification | **M** | B | T&C field templates + AI prompts |
| TB-009 | Modification | **L** | B | Pricing sheet XLSX/PDF tables |
| TB-010 | Modification | **M** | B | Tune weights or external agent API |
| TB-011 | Modification | **L** | B | Salesforce REST + workspace linkage |
| TB-012 | Not available | **XL** | D | Microsoft Graph upload to Teams site |
| TB-013 | Not available | **L** | D | Depends on TB-012; or **M** if in-app data room only |
| TB-014 | Modification | **M** | A | Batch Excel template (summary + product analysis) |
| TB-015 | Modification | **L** | B | ETL/sync to Postgres; **S** if export-only acceptable |
| TB-016 | Modification | **S** | A | SMTP on `AutomationFailure` |
| TB-017 | Not available (OOS) | **—** | — | Customer out of scope |
| TB-018 | Not available (OOS) | **—** | — | Customer out of scope |
| TB-019 | Not available (OOS) | **—** | — | Customer out of scope |
| ATS-001 | Modification | **M** | C | Graph mail read (US + AT mailboxes) — MVP done |
| ATS-002 | Modification | **M** | C | Keyword body scan — MVP done |
| ATS-003 | Modification | **M** | C | Attachment keyword scan — MVP done |
| ATS-004 | Modification | **M** | C | Multi-link parse + retain/reject — MVP done |
| ATS-005 | Modification | **S** | C | Move to Rejected folder — MVP done |
| ATS-006 | Modification | **M** | C | Forward-to-sales rules — MVP done |
| ATS-007 | Modification | **S** | C | No-link keyword path — MVP done |
| ATS-008 | Not available (OOS) | **—** | — | Customer out of scope |
| ATS-009 | Modification | **S** | C | Outlook login retry (3x) — MVP done |
| ATS-010 | Modification | **M** | C | Failure email + screenshot artifact — MVP done |

**Effort rollup by gap category**

| Gap category | Items | Effort sum (order-of-magnitude) |
|--------------|------:|----------------------------------|
| Available | 1 | **S** |
| Modification | 18 | **~2.5–3.5 FTE-years** if all built sequentially |
| Not available (build if in scope) | 8 | **~1.5–2 FTE-years** (ATS + M365) |
| Not available (OOS — skip) | 4 | **—** |

**Phase backlog (prioritized)**

| Priority | IDs | Status (May 2026) | Remaining effort |
|----------|-----|------------------|------------------|
| **P0 — Phase A** | TB-001–TB-006 | **Delivered (MVP)** | Harden live GovWin/SAM credentials; production attachment URLs; QA on upsert at scale |
| **P0 — Phase A (open)** | TB-014, TB-016 | **Not started** | Excel summary export; SMTP on `AutomationFailure` |
| **P1 — Phase B** | TB-007, TB-008, TB-009, TB-010, TB-011, TB-015 | **TB-007–011 MVP in progress** | **3×L + 3×M** ≈ 14–18 weeks (TB-011 cache/API MVP done May 2026) |
| **P2 — Phase C** | ATS-001–010 | **ATS-001–010 MVP done** (May 2026) | Graph/SMTP hardening ≈ 2–4 weeks |
| **P3 — Phase D (optional)** | TB-012, TB-013 | **Not started** | **XL + L** ≈ 8–12 weeks |

**Quick wins still open:** TB-014, TB-016.

**Critical path (updated):** Production attachment fidelity (TB-004 hardening) → TB-007–009 (commercial parsers) → ATS-001 (email) → TB-012 (SharePoint, if required).

---

## 2. Platform baseline vs customer assumptions

| Customer RTM assumption | Tender360 reality | Impact |
|-------------------------|-------------------|--------|
| BOT / unattended operator | Scheduled **discovery jobs** + connectors; no RPA/UI login bot | TB-001, TB-004, TB-018 |
| PostgreSQL structured store | **MongoDB** (Mongoose) | TB-015 |
| Teams / SharePoint outputs | No Microsoft Graph integration | TB-012, TB-013 |
| Outlook mailboxes (US + Austria) | **ATS-001–007 MVP:** Graph or demo mailboxes, keyword scan, folder/forward actions | ATS-001–ATS-007 |
| Salesforce CRM validation | **TB-011 MVP:** CRM cache + optional REST; workspace validation; not full org sync | TB-011 |
| GenAI Agent (external) for relevancy | In-platform **ScoringEngine** + **OpenAI/heuristic** providers | TB-010 |
| Phase 1 “Available” = production BOT | Mix of **live API**, **demo seed**, and **UI-first** modules (see user guide §19) | All rows |

---

## 3. Summary matrix (by customer RTM status)

### 3.1 Tender BOT / discovery / intelligence (TB-001–TB-019)

| Req ID | Customer RTM status | Tender360 gap category (May 2026) |
|--------|----------------------|-----------------------------------|
| TB-001 | Available (Phase 1) | **MVP implemented** (API credentials; not UI/RPA login) |
| TB-002 | Available (Phase 1) | **MVP implemented** (24h lookback on scheduled jobs) |
| TB-003 | Available (Phase 1) | **MVP implemented** (new + updated upsert) |
| TB-004 | Available (Phase 1) | **MVP partial** (attachment worker; demo placeholders without live URLs) |
| TB-005 | Available (Phase 1) | **Available** (+ SAM notice-doc fallback implemented) |
| TB-006 | Available (Phase 1) | **MVP partial** (metadata on import; not automated page scrape) |
| TB-007 | Available (Phase 1) | **Modification** |
| TB-008 | Available (Phase 1) | **Modification** |
| TB-009 | Available (Phase 1) | **Modification** |
| TB-010 | Partial / External (Phase 2) | **Modification** (in-app scoring exists) |
| TB-011 | Planned (Phase 2) | **MVP implemented** (CRM cache + optional Salesforce REST) |
| TB-012 | Available (Phase 1) | **Not available** |
| TB-013 | Available (Phase 1) | **Not available** |
| TB-014 | Available (Phase 1) | **Modification** |
| TB-015 | Available (Phase 1) | **Modification** (different DB) |
| TB-016 | Available (Phase 1) | **Modification** |
| TB-017 | **Not available / Out of scope** | **Not available** (aligned) |
| TB-018 | **Not available / Out of scope** | **Not available** (aligned) |
| TB-019 | **Not available / Out of scope** | **Not available** (aligned) |

### 3.2 Email tender scanning (ATS-001–ATS-010)

| Req ID | Customer RTM status | Tender360 gap category |
|--------|----------------------|-------------------------|
| ATS-001 | Available (Phase 1) | **MVP implemented** (Graph or demo US/AT mailboxes) |
| ATS-002 | Available (Phase 1) | **MVP implemented** (watchlist + source keywords on body) |
| ATS-003 | Available (Phase 1) | **MVP implemented** (PDF/text attachment text scan; images excluded) |
| ATS-004 | Available (Phase 1) | **MVP implemented** (multi-link retain/reject sections) |
| ATS-005 | Available (Phase 1) | **MVP implemented** (rejected folder via Graph or simulated) |
| ATS-006 | Available (Phase 1) | **MVP implemented** (forward to sales; SMTP or logged) |
| ATS-007 | Available (Phase 1) | **MVP implemented** (keyword-only when no links) |
| ATS-008 | **Not available / Out of scope** | **Not available** (aligned — image reading excluded) |
| ATS-009 | Available (Phase 1) | **MVP implemented** (Graph 3× retry) |
| ATS-010 | Available (Phase 1) | **MVP implemented** (failure SVG artifact + SMTP/logged notify) |

---

## 4. Detailed requirement analysis

**Legend**

- **Available** — Capability present and usable without major RTM-specific build.
- **Modification** — Partial implementation; needs design/development to match Thermo Fisher RTM.
- **Not available** — No implementation, or customer marked out of scope.

---

### 4.1 TB-001 — Auto login to GovWin using saved credentials/search

| | |
|--|--|
| **Customer** | BOT / CAD Sales User; GovWin API + credential-based login; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** — still **Modification** vs RTM if UI/RPA login is mandatory |
| **Completed** | **Admin → Discovery Connectors** (`/admin-config/discovery-connectors`): Executive-style UI, connector marketplace (GovWin, SAM.gov, Generic REST API, web scrape, email, manual). Tenant-scoped credentials on `TenderSource` (`authCredentials`, `discoveryConfig`). **Intelligence Platform** panel links to connectors. **Healthcare demo seed** for MediCare (`MEDICARE` / MediCare Innovations Healthcare Pvt Ltd): SAM.gov, GovWin, Texas SmartBuy, Vizient GPO, email inbox, manual upload. **`POST /api/discovery-connectors/seed-demo`** seeds current tenant (admin roles). TB-001 generic connector framework (`GenericApiConnector`, `WebScrapeConnector`). |
| **Evidence** | `GovWinConnector.js`, `discoveryConnectorsController.js`, `DiscoveryConnectors.jsx`, `sourcesWatchlistsSeedData.js` (`buildHealthcareDiscoveryConnectors`), `medicareDiscoveryConnectorsSeeder.js` |
| **Remaining gap** | No saved **interactive** GovWin UI session or RPA; API key / bearer only. |
| **Recommendation** | Document API setup for customer workshops; scope RPA only if API path rejected. |

---

### 4.2 TB-002 — Scan new bids posted in last 24 hours

| | |
|--|--|
| **Customer** | Daily automated scan; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | Per-source **`lookbackHours`** (default **24**) in `connectorConfigBuilder.js` → GovWin **`modifiedSince`** and SAM **`postedFrom`/`postedTo`**. `DiscoveryScheduler` runs due sources on `frequency` (e.g. daily). Job logs record 24h window. **UI:** `/tender-discovery/scheduler` (TB-002 policy + source cadence). |
| **Evidence** | `connectorConfigBuilder.js`, `DiscoveryService.runJob`, `DiscoveryScheduler.js`, `DiscoverySchedulerPage.jsx` |
| **Remaining gap** | Scheduler tick is ~60s poll of *due* sources, not a single enterprise-wide “midnight batch” job name—functionally equivalent for daily sources. |

---

### 4.3 TB-003 — Identify new or updated bids

| | |
|--|--|
| **Customer** | Based on solicitation/update date; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | Upsert by **`discovery.externalKey`** (`connectorType:externalId`). **Content-hash** change detection (`opportunityContentHash.js`). Existing tenders **updated** when hash changes; **unchanged** counted as duplicates. Batch/job stats: **`recordsNew`**, **`recordsUpdated`**, **`duplicatesSkipped`**. Tender field **`discovery.changeStatus`**: `new` \| `updated` \| `unchanged`. **UI:** Discovery history + import queue columns. |
| **Evidence** | `DiscoveryService.js`, `TenderImportBatch.js`, `TenderDiscoveryJob.js`, `Tender.js` (`discovery` schema), `DiscoveryHistoryPage.jsx`, `DiscoveryImportQueuePage.jsx` |
| **Remaining gap** | No separate “solicitation version” entity; updates overwrite pipeline tender fields. |

---

### 4.4 TB-004 — Download all tender documents

| | |
|--|--|
| **Customer** | GovWin/SAM.gov attachments; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP partial** |
| **Completed** | **`AttachmentHarvestService`**: after each new/updated import, downloads attachment URLs from connector payload into `uploads/{companyId}/discovery/`, creates **`Document`** rows linked to **`Tender`**. GovWin/SAM **`attachments`** arrays on normalized opportunities. Batch stats: **`attachmentsDownloaded`**, **`attachmentsFailed`**. In **development**, GovWin demo opportunities include `demo://` files → placeholder files when live download fails. |
| **Evidence** | `AttachmentHarvestService.js`, `GovWinConnector.js`, `SamGovConnector.js`, `DiscoveryService.js` |
| **Remaining gap** | Production GovWin/SAM attachment URLs and auth headers not fully proven; not all portal document types covered. |
| **Recommendation** | Harden download auth per connector; retry queue for failed files; surface download status in opportunity workspace. |

---

### 4.5 TB-005 — Use SAM.gov API for missing attachments

| | |
|--|--|
| **Customer** | Free API integration; Phase 1 Available |
| **Tender360 (May 2026)** | **Available** (search + fallback) |
| **Completed** | **`SamGovConnector.fetchAttachments`** — `GET …/noticedocuments?noticeId=` when primary connector returned **no** files. Import batch flag **`samFallbackUsed`**. Resource links mapped on SAM search results. |
| **Evidence** | `SamGovConnector.js`, `AttachmentHarvestService.js`, `DiscoveryImportQueuePage.jsx` |
| **Remaining gap** | Requires valid **`SAM_GOV_API_KEY`**; notice-doc API availability depends on SAM notice type. |

---

### 4.6 TB-006 — Extract bid metadata from GovWin page

| | |
|--|--|
| **Customer** | Program summary, timeline, contacts; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`DiscoveryMetadataService`** on import → `discovery.metadata`. **`ExtractionPipeline`** (`metadata`) on downloaded docs. Auto-trigger after discovery import via **`TenderIntelligenceService`**. **UI:** `/tender-discovery/metadata`, `/ai-document-intelligence/rtm`. |
| **Evidence** | `DiscoveryMetadataService.js`, `TenderIntelligenceService.js`, `DiscoveryMetadataPage.jsx`, `TenderIntelligenceRtmPage.jsx` |
| **Remaining gap** | Not GovWin HTML page scrape; API + attachment text only. |

---

### 4.7 TB-007 — Extract ship-to address, quantity, scope, SKU

| | |
|--|--|
| **Customer** | From attachments; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`tenderIntelligenceExtractors.js`** (ship-to, qty, scope, SKU heuristics). Pipelines **`commercial`** on `DocumentExtraction`. Aggregated to **`tender.intelligence.commercial`**. Runs after TB-004 download. |
| **Evidence** | `tenderIntelligenceExtractors.js`, `TenderIntelligenceService.js`, `Tender.js` (`intelligence.commercial`) |
| **Remaining gap** | Heuristic/regex — not production table/OCR for all attachment formats. |

---

### 4.8 TB-008 — Extract terms & conditions details

| | |
|--|--|
| **Customer** | Insurance, freight, pricing terms; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | Pipeline **`terms`** extracts insurance, freight, pricing term lines + **`ClauseExtraction`** obligations. Stored on **`tender.intelligence.terms`**. |
| **Evidence** | `tenderIntelligenceExtractors.js`, `ExtractionPipeline.js`, `TenderIntelligenceService.js` |
| **Remaining gap** | Not full contract playbook vs Thermo legal taxonomy. |

---

### 4.9 TB-009 — Extract pricing sheet details

| | |
|--|--|
| **Customer** | Qty, UoM, description; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP partial** |
| **Completed** | Pipeline **`pricing`** with **`line_items`** (qty, UoM, description) via regex on attachment text. **`tender.intelligence.pricing.lineItems`**. |
| **Evidence** | `tenderIntelligenceExtractors.js`, `DocumentExtraction` enum `pricing`, `TenderIntelligenceService.js` |
| **Remaining gap** | XLSX/PDF table parser not production-grade; empty if attachment has no tabular text. |

---

### 4.10 TB-010 — Generate relevancy score

| | |
|--|--|
| **Customer** | GenAI Agent; **Partial / External**; Phase 2 / External |
| **Tender360 (May 2026)** | **MVP implemented** (in-platform) |
| **Completed** | **`ScoringEngine.scoreOpportunity`** after intelligence aggregation; **`tender.intelligence.relevancy`** + **`OpportunityScore`**. Healthcare scoring profile from MediCare seed. **UI:** Qualification scoring, RTM board TB-010 status. |
| **Evidence** | `ScoringEngine.js`, `TenderIntelligenceService.scoreTenderRelevancy`, `intelligencePlatformController.getTenderIntelligenceRtm` |
| **Remaining gap** | Not wired to customer **external GenAI agent** unless integrated via API/webhook. |

---

### 4.11 TB-011 — Validate customer/account from Salesforce

| | |
|--|--|
| **Customer** | **Planned** Phase 2; BOT / Sales User; account lookup by address/contact; RTM **Requires Modification** |
| **Tender360 (May 2026)** | **MVP implemented** — still **Modification** vs unattended BOT / full Salesforce org sync |
| **Completed** | **`SalesforceCrmService`**: lookup by **organization**, **ship-to** (`tender.intelligence.commercial.shipTo`), and **contact email** (discovery metadata). **`CrmAccount`** tenant cache (healthcare demo seed). Optional live API when **`SALESFORCE_INSTANCE_URL`** + **`SALESFORCE_ACCESS_TOKEN`** or connector config set. Results on **`tender.crmValidation`** (`validated` \| `partial` \| `not_found`). Auto-run after tender intelligence (TB-006–010). **UI:** `/ai-document-intelligence/crm` (RTM board), **Validate in Salesforce** on opportunity workspace CRM tab. **API:** `GET/POST /api/intelligence/crm-account/*`, `POST …/seed-demo`. |
| **Evidence** | `SalesforceCrmService.js`, `CrmAccount.js`, `salesforceCrmSeed.js`, `CrmAccountIntelligencePage.jsx`, `OpportunityWorkspaceDetail.jsx`, `WorkspaceAggregationService.js` |
| **Remaining gap** | No OAuth-connected Salesforce app UI; no Account–Contact–Opportunity full sync; heuristic fallback when cache/API miss; match scoring is token overlap not Salesforce duplicate rules. |
| **Recommendation** | Wire customer Salesforce Connected App; map ship-to to Account ShippingAddress fields; optional nightly account sync job. |

---

### 4.12 TB-012 — Upload downloaded documents to Teams/SharePoint

| | |
|--|--|
| **Customer** | AI Prospecting Teams site; Phase 1 Available |
| **Tender360** | **Not available** |
| **Evidence** | No SharePoint/Graph SDK, upload jobs, or Teams site configuration in codebase. |
| **Gap** | Full Microsoft 365 upload path missing. |
| **Recommendation** | New integration module (Microsoft Graph) or confirm customer accepts Tender360 document store instead. |

---

### 4.13 TB-013 — Create bid-specific folders

| | |
|--|--|
| **Customer** | Folder named by Bid ID; Phase 1 Available |
| **Tender360** | **Not available** |
| **Evidence** | `DataRooms.jsx` uses **client-side mock** rooms; not provisioned per bid ID in SharePoint or server-side folder API. |
| **Gap** | No automated folder creation tied to discovery import. |
| **Recommendation** | Either implement Graph folder create on import, or map “Data room” entity per tender in MongoDB with document ACLs. |

---

### 4.14 TB-014 — Generate Excel summary reports

| | |
|--|--|
| **Customer** | Summary + Product Analysis; Phase 1 Available |
| **Tender360** | **Modification** |
| **Evidence** | `DataTable.jsx` client export via `xlsx`; calendar CSV export; reporting hubs largely UI-first (user guide §19). |
| **Gap** | No scheduled **bid ingestion Excel** artifact (summary + product analysis) as BOT output. |
| **Recommendation** | Report template service post-import batch; export from pipeline + extraction results. |

---

### 4.15 TB-015 — Store outputs in PostgreSQL

| | |
|--|--|
| **Customer** | Structured DB output; Phase 1 Available |
| **Tender360** | **Modification** |
| **Evidence** | **MongoDB** throughout (`mongoose`, `MONGO_URI`). Import batches, tenders, extractions, automation failures are collections. |
| **Gap** | Different database technology; customer may require Postgres for BI/reporting. |
| **Recommendation** | ETL/sync to Postgres for analytics, or agree MongoDB as system of record with BI connector. |

---

### 4.16 TB-016 — BOT failure notifications via email

| | |
|--|--|
| **Customer** | BOT Admin / Support; Phase 1 Available |
| **Tender360** | **Modification** |
| **Evidence** | `AutomationFailure` model; automation console API; discovery hub shows failure KPIs. **`nodemailer` in package.json but no `sendMail` in `backend/src`**. |
| **Gap** | Failures visible in UI/DB only; no email to admins. |
| **Recommendation** | Wire SMTP env + notification service on `AutomationFailure` create; reuse pattern planned for invitation email. |

---

### 4.17 TB-017 — Route bids to departments

| | |
|--|--|
| **Customer** | **Not available / Out of scope** |
| **Tender360** | **Not available** (aligned with RTM) |
| **Evidence** | `admin-config/Workflows.jsx` is scaffold; go/no-go and approvals are manual UI—not department routing BOT. |
| **Note** | Do not sell as in-scope unless customer revises RTM. |

---

### 4.18 TB-018 — Automated bid submission

| | |
|--|--|
| **Customer** | **Not available / Out of scope** |
| **Tender360** | **Not available** (aligned with RTM) |
| **Evidence** | Supplier **respond** portal submits proposals to **issued RFPs** only—manual user action, not GovWin portal automation. |

---

### 4.19 TB-019 — Response reminders / alerts

| | |
|--|--|
| **Customer** | **Not available / Out of scope** |
| **Tender360** | **Not available** (aligned with RTM) |
| **Evidence** | Calendar/notifications UI exists; not tied to BOT lifecycle or Thermo reminder rules. |

---

### 4.20 ATS-001 — Read tender emails from Outlook mailbox

| | |
|--|--|
| **Customer** | US + Austria mailboxes; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** — still **Modification** vs production unattended BOT |
| **Completed** | **`EmailTenderMailbox`** (US + AT). **`MicrosoftGraphMailService`** reads inbox when `MS_GRAPH_TENANT_ID`, `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET` set; else **demo inbox** seeded per tenant. **`EmailTenderConnector`** runs scan → discovery opportunities. **UI:** `/tender-discovery/email-scanning`. |
| **Evidence** | `EmailTenderScanService.js`, `MicrosoftGraphMailService.js`, `emailTenderDemoSeed.js`, `EmailTenderScanningPage.jsx` |
| **Remaining gap** | No interactive Outlook OAuth per user; app-only Graph client credentials. |

---

### 4.21 ATS-002 — Keyword scanning in email body

| | |
|--|--|
| **Customer** | Keywords file; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`EmailKeywordScanner`** loads keywords from active **Watchlists** + **email TenderSources**; scans `bodyText` / preview. Hits stored on `EmailTenderMessage.scan.bodyKeywordHits`. |
| **Remaining gap** | No separate uploaded “Keywords.xlsx” admin file—uses platform watchlist keywords. |

---

### 4.22 ATS-003 — Keyword scanning in attachments

| | |
|--|--|
| **Customer** | PDF/Text attachments; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | Attachment `textContent` scanned (demo seed + future Graph attachment download). **Images skipped** (feeds ATS-008). |
| **Remaining gap** | Live Graph attachment binary fetch + `pdf-parse` on downloaded files not fully wired in demo mode. |

---

### 4.23 ATS-004 — Process emails with multiple tender links

| | |
|--|--|
| **Customer** | Retain/reject sections; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`extractLinks`** + **`buildLinkSections`** — per-link retain/reject from keyword match in URL + body context. Partial decision when mixed. Multiple opportunities per email on discovery import. |
| **Remaining gap** | No operator UI to manually retain/reject sections before BOT runs. |

---

### 4.24 ATS-005 — Move rejected tenders to folder

| | |
|--|--|
| **Customer** | Rejected Folder; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`moveMessageToFolder`** → `folderRejected` (default “Rejected Tenders”) via Graph or **simulated** action log in demo. |
| **Remaining gap** | Folder must exist in mailbox; auto-create folder not implemented. |

---

### 4.25 ATS-006 — Forward matched tenders to sales team

| | |
|--|--|
| **Customer** | Email forwarding automation; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | Per-mailbox **`forwardTo`** lists; **`forwardMessage`** via SMTP (`SMTP_HOST` etc.) or logged simulation. |
| **Remaining gap** | Not using Graph `forward` API when SMTP absent—logged only. |

---

### 4.26 ATS-007 — Handle emails with no links

| | |
|--|--|
| **Customer** | Keyword-only scan; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | `scanMode: keywords_only` when no URLs; match on body + attachment keywords only. Demo seed includes no-link amendment email. |

---

### 4.27 ATS-008 — Handle image-based tenders

| | |
|--|--|
| **Customer** | **Not available / Out of scope** (image reading excluded) |
| **Tender360** | **Not available** (aligned) |
| **Completed** | Image-only messages → `decision: image_oos`, action `skipped_image_oos`; RTM board shows **not_available**. No OCR pipeline. |

---

### 4.28 ATS-009 — Retry Outlook login failures

| | |
|--|--|
| **Customer** | Retry 3 times; BOT Admin; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`OutlookAuthRetryService`**: 3× token acquisition with backoff; **`EmailTenderMailbox.authRetry`** tracks attempts/status; on final failure triggers **ATS-010** notification pipeline. Used by **`MicrosoftGraphMailService`**. |
| **Evidence** | `OutlookAuthRetryService.js`, `MicrosoftGraphMailService.js`, `EmailTenderMailbox.js` |
| **Remaining gap** | Not interactive user OAuth retry UI; app-only client credentials. |

---

### 4.29 ATS-010 — Send failure screenshots to users

| | |
|--|--|
| **Customer** | Error notifications; BOT Admin / Support; Phase 1 Available |
| **Tender360 (May 2026)** | **MVP implemented** |
| **Completed** | **`FailureScreenshotService`** (SVG artifact in `uploads/{companyId}/failure-artifacts/`). **`FailureNotificationService`** emails **`notifyOnFailure`** + `BOT_FAILURE_NOTIFY_EMAILS` via SMTP when configured. **`AutomationFailure`** extended with `screenshotUrl`, `notificationSentAt`. **UI:** failures table + **Simulate failure** on `/tender-discovery/email-scanning`. |
| **Evidence** | `FailureNotificationService.js`, `FailureScreenshotService.js`, `AutomationFailure.js`, `EmailTenderScanningPage.jsx` |
| **Remaining gap** | SVG diagnostic artifact, not true desktop/RPA screenshot; requires SMTP for live email delivery. |

---

## 5. Tender360 capabilities that support the RTM (not explicit IDs)

These strengthen a Thermo Fisher deployment but are not line items in the RTM spreadsheet:

| Capability | Route / module | Relevance |
|------------|----------------|-----------|
| Tender pipeline (CRUD, stages) | `/tender-intelligence/pipeline` | Pursuit management after ingestion |
| Sources & watchlists | `/tender-intelligence/sources-watchlists` | Keyword/region/value monitoring (ATS-002 partial analog) |
| Discovery hub, prospecting RTM, history, import queue, scheduler, metadata | `/tender-discovery/*` | TB-001–006 operator console (May 2026) |
| Discovery Connectors (admin) | `/admin-config/discovery-connectors` | TB-001 credentials & portal config |
| Intelligence Platform (admin) | `/admin-config/intelligence-platform` | Connector catalog, scoring, scheduler links |
| Table action center (ellipsis menus) | `ActionMenu` / `DataTable` / `TableActionsCell` | Consistent row actions app-wide |
| Go / No-Go, qualification, scoring UI | Qualification modules | Human decisions after TB-010 |
| Issued RFP + supplier respond | `/issued-rfps`, `/respond/*` | Separate from GovWin BOT; not TB-018 |
| Document management + AI analysis | Document modules | Supports TB-006–009 when files are in platform |
| Integrations hub | `/integrations` | Catalog for future Salesforce/M365 connectors |
| Executive command center UX | Multiple hubs | Sales/ops dashboards |

---

## 6. Recommended phased alignment

### Phase A — Close high-value gaps without changing RTM scope

**Completed (May 2026 — MVP):**

1. ~~**TB-001**~~ — Discovery Connectors + healthcare demo seed + seed-demo API.  
2. ~~**TB-002**~~ — 24-hour lookback on scheduled GovWin/SAM jobs.  
3. ~~**TB-003**~~ — Upsert + new/updated detection.  
4. ~~**TB-004**~~ — Attachment harvest worker (partial: production URL hardening pending).  
5. ~~**TB-005**~~ — SAM.gov search + notice-doc fallback.  
6. ~~**TB-006**~~ — Import-time metadata mapping + metadata UI.

**Still open in Phase A:**

7. **TB-016** — SMTP alerts on automation failure.  
8. **TB-014** — Standard Excel export from import batch + extraction fields.

### Phase B — Customer Phase 2 / partial items

1. **TB-010** — Agree in-app vs external GenAI scoring.  
2. **TB-011** — Harden Salesforce OAuth + shipping-address field mapping (MVP cache/API done).  
3. **TB-007–TB-009** — Structured commercial and pricing extraction pipelines.  
4. **TB-015** — Postgres read replica or sync if required for customer BI.

### Phase C — Email tender automation (full ATS except out-of-scope)

1. **ATS-001–ATS-007, ATS-009–ATS-010** — Microsoft Graph mail service, keyword engine, folder routing, forward rules, retries, screenshot on failure.  
2. **ATS-008** — Remains out of scope unless customer changes RTM.

### Explicitly exclude (unless RTM revised)

- **TB-017, TB-018, TB-019, ATS-008** — Match customer “Out of Scope.”

---

## 7. Traceability to codebase (quick reference)

| Area | Primary paths |
|------|----------------|
| GovWin connector (+ dev demo fallback) | `backend/src/services/connectors/GovWinConnector.js` |
| SAM.gov connector (+ notice documents) | `backend/src/services/connectors/SamGovConnector.js` |
| Generic API / web scrape (TB-001) | `GenericApiConnector.js`, `WebScrapeConnector.js` |
| Email connector (stub) | `backend/src/services/connectors/EmailTenderConnector.js` |
| Discovery import / upsert | `backend/src/modules/tender-discovery/services/DiscoveryService.js` |
| Attachment harvest (TB-004) | `backend/src/modules/tender-discovery/services/AttachmentHarvestService.js` |
| Metadata on import (TB-006) | `backend/src/modules/tender-discovery/services/DiscoveryMetadataService.js` |
| Lookback / config | `backend/src/modules/tender-discovery/utils/connectorConfigBuilder.js` |
| Content hash (TB-003) | `backend/src/modules/tender-discovery/utils/opportunityContentHash.js` |
| Scheduler | `backend/src/modules/tender-discovery/services/DiscoveryScheduler.js` |
| Seed demo / MediCare platform | `intelligencePlatformSeed.js`, `medicareDiscoveryConnectorsSeeder.js`, `POST …/discovery-connectors/seed-demo` |
| Discovery API (RTM dashboard) | `GET …/intelligence/discovery/prospecting-rtm`, `…/metadata` |
| Extraction (documents) | `backend/src/modules/document-intelligence/services/ExtractionPipeline.js` |
| Scoring / relevancy | `backend/src/modules/ai-scoring/services/ScoringEngine.js` |
| Tender intelligence (TB-006–010) | `backend/src/modules/tender-intelligence/services/TenderIntelligenceService.js`, `…/tenderIntelligenceExtractors.js` |
| CRM / Salesforce (TB-011) | `backend/src/modules/crm/services/SalesforceCrmService.js`, `…/crm/models/CrmAccount.js`, `salesforceCrmSeed.js`, `/ai-document-intelligence/crm` |
| Email tender scanning (ATS-001–010) | `backend/src/modules/email-tender-scanning/*`, `OutlookAuthRetryService.js`, `FailureNotificationService.js`, `/tender-discovery/email-scanning` |
| Auth role fix (admin seed) | `backend/src/middlewares/auth.js` (`normalizeRequiredRoles`) |
| Discovery UI | `frontend/src/pages/tender-discovery/*`, `admin-config/DiscoveryConnectors.jsx` |
| Table action center | `frontend/src/components/ActionMenu.jsx`, `TableActionsCell.jsx`, `utils/tableActions.js` |
| Feature maturity | `docs/TENDER360_FUNCTIONAL_USER_GUIDE.md` §19 |

---

## 8. Implementation progress log (completed work)

| Date | Scope | Summary |
|------|--------|---------|
| 2026-05-20 | **TB-001** | Discovery Connectors admin UI; connector catalog; MediCare healthcare seed (7 sources); `seed-demo` for logged-in tenant; Intelligence Platform integration status. |
| 2026-05-20 | **TB-002** | Default 24h `lookbackHours`; `modifiedSince` / SAM date window; scheduler + policy UI. |
| 2026-05-20 | **TB-003** | Upsert by external key; SHA content hash; new/updated/unchanged stats on jobs and import batches. |
| 2026-05-20 | **TB-004** | `AttachmentHarvestService` + `Document` linkage; batch attachment metrics. |
| 2026-05-20 | **TB-005** | `SamGovConnector.fetchAttachments` fallback. |
| 2026-05-20 | **TB-006** | `DiscoveryMetadataService`; metadata feed API; Prospecting RTM + metadata pages. |
| 2026-05-20 | **Platform** | Admin nav consolidation; `requireRoles` array fix for System Administrator; GovWin dev demo opportunities when API unreachable; table **action center** (ellipsis menu) on `DataTable` and key raw tables. |
| 2026-05-20 | **TB-006–TB-010** | `TenderIntelligenceService`, attachment extractors (commercial/terms/pricing), auto-run after discovery, `tender.intelligence` schema, `GET/POST …/tender-intelligence/*`, `/ai-document-intelligence/rtm` UI. |
| 2026-05-20 | **TB-011** | `SalesforceCrmService`, `CrmAccount` cache + healthcare seed, `tender.crmValidation`, CRM validate after intelligence, `/ai-document-intelligence/crm`, workspace **Validate in Salesforce** button. |

**How to verify (MediCare tenant):**

1. Log in as MediCare admin → **Admin** → **Discovery Connectors** → **Load healthcare demo connectors**.  
2. **Run discovery now** on GovWin or SAM.gov source.  
3. **Discovery** → **Prospecting RTM** — confirm TB-001–006 show active/ready.  
4. Review **History**, **Import queue** (new/updated/attachments), **Bid metadata**.

**npm (local DB):** `npm run seed:medicare-connectors` from `backend/` if UI seed button cannot reach MongoDB.

---

## 9. Document maintenance

When implementation changes, update this gap analysis together with:

- `docs/TENDER360_FUNCTIONAL_USER_GUIDE.md`  
- `docs/DUAL_CUSTOMER_TENDER_RFP_PLAN.md`  
- Connector/env documentation for GovWin and SAM.gov keys  

| Date | Change |
|------|--------|
| 2026-05-13 | Initial gap analysis from Thermo Fisher RTM (TB-001–TB-019, ATS-001–ATS-010) vs Tender360 codebase |
| 2026-05-13 | Added §1.1 executive one-pager and §1.2 S/M/L/XL effort matrix with phased backlog |
| 2026-05-20 | **Phase A MVP:** TB-001–TB-006 implemented (discovery connectors, 24h scan, upsert, attachments, SAM fallback, metadata UI); updated §1, §3, §4.1–4.6, §6, §7; added §8 implementation log; MediCare seed + prospecting routes |
| 2026-05-20 | **Tender Intelligence:** TB-006–TB-010 MVP (extractors, `tender.intelligence`, scoring hook, RTM UI); updated §4.6–4.10 |
| 2026-05-20 | **CRM Account Intelligence:** TB-011 MVP (Salesforce REST optional, CRM cache, `crmValidation`, RTM + workspace UI); updated §4.11 |
| 2026-05-20 | **Email Tender Scanning:** ATS-001–007 MVP (Graph/demo mailboxes, keyword body/attachment, multi-link, reject folder, forward, no-link path); ATS-008 OOS; updated §3.2, §4.20–4.27 |
| 2026-05-20 | **Error handling:** ATS-009 (3× Outlook login retry), ATS-010 (failure SVG + notify); updated §4.28–4.29 |

---

*This document is for internal planning and customer discussions. RTM “Available” labels reflect the customer spreadsheet. **MVP implemented** (May 2026) means in-app API-first discovery—not full Thermo BOT + Microsoft 365 parity.*
