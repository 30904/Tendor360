**TENDER360**

**AI Tender Intelligence Platform**

  -----------------------------------------------------------------------
  **Developer Implementation Guide**

  -----------------------------------------------------------------------

  ------------------ ----------------------------------------------------
  **Document**       Tender360 --- Developer Implementation Guide
                     (Priority-Ordered)

  **Version**        1.0 --- Combined Claude Code + Cursor Audit Output

  **Prepared by**    Celeris Ventures --- Product & Architecture Team

  **Date**           June 2026

  **Status**         ACTIVE --- For immediate developer handoff

  **Audience**       Backend Developers, AI/ML Engineers, Frontend
                     Developers
  ------------------ ----------------------------------------------------

*This document consolidates the full static codebase audit conducted by
Claude Code and Cursor against the Thermo Fisher RTM. It is ordered
strictly by delivery priority. Developers must complete each phase
before starting the next. Every item includes: current status, exact
file location, what to build, and acceptance test.*

**Executive Summary --- Combined Audit Findings**

Two independent static analyses (Claude Code + Cursor) were run against
the full Tender360 codebase. Both audits independently agreed on the
same critical gaps. The system is approximately 35% functional
end-to-end against the Thermo Fisher RTM.

  -----------------------------------------------------------------------
  **Overall Readiness Score: 35% Functional**

  -----------------------------------------------------------------------

  --------------------- --------------- --------------- ----------------------
  **Workflow Block**    **Readiness**   **RTM Items**   **Biggest Gap**

  GovWin + SAM.gov      **70%**         TB-001 → TB-006 Auth model wrong;
  Discovery                                             saved search ID
                                                        missing; placeholder
                                                        file fallback

  Email Tender Scanning **60%**         ATS-001 →       Excel keyword loader
  (ATS)                                 ATS-010         missing; PDF
                                                        attachment scan not
                                                        wired; Thermo
                                                        mailboxes not
                                                        configured

  Document Intelligence **15%**         TB-007 → TB-010 Only generic AI
                                                        summary; no ship-to,
                                                        T&C, or pricing
                                                        extraction

  Storage & Output      **5%**          TB-011 → TB-016 No PostgreSQL, no
                                                        SharePoint, no Excel
                                                        reports --- nothing
                                                        built

  Scheduler             **40%**         Cross-cutting   setInterval only; no
                                                        production cron; no 3
                                                        AM UTC guarantee
  --------------------- --------------- --------------- ----------------------

**Where the Two Audits Agreed (Validated Findings)**

The following findings were independently confirmed by both Claude Code
and Cursor --- treat these as highest-confidence gaps:

-   GovWin uses apiKey + baseUrl --- searchID / userID fields do not
    exist anywhere in the codebase

-   PostgreSQL: zero instances. Entire persistence layer is
    MongoDB/Mongoose. No pg, prisma, or sequelize in package.json

-   SharePoint / Teams: Graph API used for Outlook email only. No drive
    upload, no folder provisioning, no
    \@microsoft/microsoft-graph-client

-   Excel report generation: no exceljs or xlsx-write in package.json.
    No report builder code exists

-   PDF attachment scanning in ATS: pdf-parse library EXISTS but is NOT
    wired into the email scanning path --- only used in
    document-intelligence module

-   Scheduler: setInterval with 60s default. No cron library. 3 AM UTC
    is impossible in current architecture

-   Attachment download fallback: createPlaceholderFile() writes fake
    50-byte text files when download fails --- this will expose the gap
    in a demo

-   ATS-002 keyword loading from Excel: no Excel file loader. Keywords
    come from MongoDB, not the Excel file the client specified

**What IS Demo-Ready Today**

-   Dashboard, Discovery UI, Tender feed, Intelligence workspace ---
    fully built frontend navigation (confirmed by screenshot)

-   GovWin + SAM.gov API calls work with demo credentials --- returns
    seeded bids

-   Email inbox scan, move to folder, forward to sales --- all work with
    demo seed data

-   New vs updated bid detection with content hash deduplication

-   MongoDB CRUD persistence --- all bid data stores correctly

-   AI relevancy scoring --- works in heuristic mode on demo data

**Implementation Phases --- Priority Order**

Each phase must be completed and tested before the next begins. Phases
are ordered by: (1) what the client will demo first, (2) what unblocks
downstream features, (3) effort-to-impact ratio.

  ----------- ---------------------- -------------- ---------------- ---------------------
  **Phase**   **Focus Area**         **Timeline**   **RTM            **Outcome**
                                                    Requirements**   

  **P1**      **Discovery ---        Weeks 1--4     *TB-001→006,     Full discovery
              GovWin + SAM + Email                  ATS-001→010*     working end-to-end
              ATS**                                                  with real data and
                                                                     real mailboxes

  **P2**      **Document             Weeks 5--8     *TB-007→010,     Structured extraction
              Intelligence +                        Scheduler*       from PDFs;
              Scheduler**                                            production-grade cron
                                                                     at 3 AM UTC

  **P3**      **Output Layer ---     Weeks 9--12    *TB-014, TB-015, Daily Excel reports
              Excel + PostgreSQL**                  TB-016*          generated; data
                                                                     written to client
                                                                     PostgreSQL

  **P4**      **Teams/SharePoint +   Weeks 13--20   *TB-011→013*     Bid docs uploaded to
              Salesforce**                                           Teams; account
                                                                     validation against
                                                                     Salesforce
  ----------- ---------------------- -------------- ---------------- ---------------------

  -----------------------------------------------------------------------
  **PHASE 1 --- DISCOVERY ENGINE**

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  GovWin Bid Prospecting \| SAM.gov Fallback \| Outlook Email Tender
  Scanning \| Scheduler Hardening

  -----------------------------------------------------------------------

Priority 1 is your demo anchor. Both GovWin/SAM.gov discovery and the
Outlook ATS email bot must work end-to-end with real credentials before
anything else. This is what Thermo Fisher will look at first in any demo
or pilot.

**1A --- GovWin Bid Discovery (TB-001 → TB-006)**

**Current State**

The GovWin connector makes REST API calls to GovWin IQ and returns bids
--- but the authentication model is wrong. The current code passes a
generic apiKey field. The actual GovWin API (Deltek IQ) requires a
searchID and userID pair, not a bearer token. This means every live
GovWin call silently falls back to buildDemoOpportunities() and returns
fake data.

**Requirement-by-Requirement Audit**

  ------------------------------------------------------------------------------------------------------------------------
  **Req \#**   **Requirement /       **Current     **Key File(s)**                 **Effort**   **What to Build / Fix**
               Task**                Status**                                                   
  ------------ --------------------- ------------- ------------------------------- ------------ --------------------------
  **TB-001**   Auto-login GovWin via **PARTIAL**   *GovWinConnector.js L9--13*     3-5d         Replace apiKey with
               saved credentials +                                                              searchID + userID auth;
               searchID                                                                         remove demo fallback

  **TB-002**   Scan new bids from    **EXISTS**    *connectorConfigBuilder.js;     0            Works. Add unit test.
               last 24 hours                       DiscoveryService.js*                         

  **TB-003**   Detect new vs updated **EXISTS**    *opportunityContentHash.js;     0            Works. Verify changeStatus
               bids                                DiscoveryService.js*                         field in output.

  **TB-004**   Download all tender   **PARTIAL**   *AttachmentHarvestService.js    2-3d         Remove
               documents                           L102--110*                                   createPlaceholderFile();
                                                                                                add retry logic + alert on
                                                                                                failure

  **TB-005**   SAM.gov free API      **EXISTS**    *SamGovConnector.js;            0            Works. Confirm env var
               fallback for missing                AttachmentHarvestService.js                  SAM_GOV_API_KEY is set.
               docs                                L73--82*                                     

  **TB-006**   Extract full GovWin   **PARTIAL**   *DiscoveryMetadataService.js;   3-4d         Add: solicitation number,
               metadata (all fields)               GovWinConnector.js*                          contract value, type of
                                                                                                award, duration, place of
                                                                                                performance, analyst
                                                                                                updates, contacts
                                                                                                (title/type/location),
                                                                                                related docs, interested
                                                                                                vendors
  ------------------------------------------------------------------------------------------------------------------------

**Step-by-Step Implementation Instructions**

**Step 1.A.1 --- Fix GovWin Authentication (TB-001) --- CRITICAL**

Both audits agree: the GovWin auth model is wrong. Here is exactly what
to change:

  ---------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                 **File / Location**                                                      **Acceptance Test**
  -------- ------------------------------------------ ------------------------------------------------------------------------ ----------------------
  **1**    Open GovWinConnector.js. Find the config   *backend/src/services/connectors/GovWinConnector.js*                     Config object has
           block (L9--13) where apiKey is read. Add                                                                            searchId, userId,
           two new fields: searchId and userId. The                                                                            baseUrl. No apiKey
           Deltek IQ API uses OAuth2 with a search                                                                             field.
           profile ID, not a bearer key.                                                                                       

  **2**    Update the API call (L68--77). Change the  *GovWinConnector.js L68--77*                                             Connector returns HTTP
           Authorization header from Bearer                                                                                    200 from live GovWin
           \${apiKey} to the correct GovWin OAuth2                                                                             IQ API with real
           token exchange: POST to                                                                                             credentials.
           https://iq.govwin.com/neo-ws/oauth/token                                                                            
           with client_id=userId,                                                                                              
           client_secret=searchId,                                                                                             
           grant_type=client_credentials. Cache the                                                                            
           token with 1-hour TTL.                                                                                              

  **3**    Remove the buildDemoOpportunities()        *GovWinConnector.js L15--43*                                             Without credentials,
           fallback entirely (L15--43). Replace with                                                                           connector throws
           a proper error throw so the scheduler                                                                               ConfigurationError ---
           catches and logs the failure rather than                                                                            not returns demo data.
           silently serving demo data.                                                                                         

  **4**    Add GOVWIN_SEARCH_ID, GOVWIN_USER_ID to    *backend/.env.production.example; backend/src/config/env.js*             App fails to start if
           .env.production.example and                                                                                         GOVWIN_SEARCH_ID or
           backend/src/config/env.js validator.                                                                                GOVWIN_USER_ID
           Remove the old GOVWIN_API_KEY reference.                                                                            missing.

  **5**    Add searchId support to the TenderSource   *backend/src/modules/tender-discovery/models/TenderSource.js*            TenderSource document
           model. The saved search filter \"Bid                                                                                can store
           automation search filters\" from the PDD                                                                            searchFilterName;
           must be configurable per-source. Add                                                                                GovWin connector reads
           searchFilterName field to TenderSource                                                                              it in the API query.
           schema.                                                                                                             

  **6**    Update connectorConfigBuilder.js to pass   *backend/src/modules/tender-discovery/utils/connectorConfigBuilder.js*   buildGovWinConfig()
           searchId, userId, and searchFilterName                                                                              returns object with
           when building GovWin config objects.                                                                                all three new fields.
  ---------------------------------------------------------------------------------------------------------------------------------------------------

**Step 1.A.2 --- Fix Attachment Download Fallback (TB-004) --- HIGH**

The createPlaceholderFile() function in AttachmentHarvestService.js
writes fake text files when a download fails. This will embarrass the
team in a demo if a client clicks \"Download\" and gets a 50-byte text
file.

  -------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                    **File / Location**                                         **Acceptance Test**
  -------- ----------------------------- ----------------------------------------------------------- ----------------------
  **1**    Remove                        *AttachmentHarvestService.js L102--110*                     On download failure,
           createPlaceholderFile() call                                                              system retries 3× then
           (L102--110). Replace with a                                                               marks document as
           proper retry: attempt                                                                     \"download_failed\"
           download up to 3 times with                                                               --- no placeholder
           2s exponential backoff before                                                             file created.
           giving up.                                                                                

  **2**    If all 3 retries fail, set    *AttachmentHarvestService.js; models/Document.js*           Document record has
           Document.downloadStatus =                                                                 downloadStatus:
           \"failed\" and                                                                            \"failed\" with error
           Document.downloadError = the                                                              message. No file on
           HTTP error. Do not create any                                                             disk.
           file. Log a                                                                               
           TenderDiscoveryLog warning                                                                
           entry.                                                                                    

  **3**    Add downloadStatus field to   *backend/src/modules/tender-discovery/models/Document.js*   Document schema
           Document model: enum                                                                      validates
           \[\"pending\",                                                                            downloadStatus enum
           \"downloading\",                                                                          correctly.
           \"completed\", \"failed\"\].                                                              
           Add downloadAttempts counter.                                                             

  **4**    Remove demo:// URL handling   *AttachmentHarvestService.js L51--54*                       No demo:// protocol
           from                                                                                      handling in production
           AttachmentHarvestService.js                                                               code. Seed data uses
           (L51--54). These are                                                                      real test URLs.
           seed-data artifacts that                                                                  
           should not exist in                                                                       
           production code paths.                                                                    
  -------------------------------------------------------------------------------------------------------------------------

**Step 1.A.3 --- Complete GovWin Metadata Extraction (TB-006) ---
MEDIUM**

The current DiscoveryMetadataService.js captures approximately 30% of
the fields the RTM requires. The following fields are missing and must
be added:

-   solicitation_number --- from Opportunity Summary section on GovWin
    bid page

-   contract_value --- from Funding/Contract Value section

-   type_of_award --- from Opportunity Summary (e.g. IDIQ, FFP, T&M)

-   duration --- period of performance

-   place_of_performance --- city, state, country

-   analyst_updates --- from Timeline section (array of dated update
    strings)

-   contact_title, contact_type, contact_location --- additional contact
    fields beyond name/email/phone

-   related_documents --- list of document titles and types from
    Resources section

-   interested_vendors --- vendor list from Vendors and Teaming section

  -----------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                      **File / Location**                                                           **Acceptance Test**
  -------- ------------------------------- ----------------------------------------------------------------------------- ------------------------
  **1**    Map all missing fields in       *GovWinConnector.js L100--133*                                                Opportunity object
           GovWinConnector.js                                                                                            contains all 15
           normalizeRecord() method                                                                                      RTM-required metadata
           (L100--133). Add the new fields                                                                               fields with non-null
           to the opportunity schema                                                                                     values for a real GovWin
           mapping. Refer to the GovWin IQ                                                                               bid.
           API response documentation for                                                                                
           exact field names in the JSON                                                                                 
           response.                                                                                                     

  **2**    Add corresponding fields to the *models/TenderOpportunity.js or Opportunity.js*                               Mongoose schema
           Opportunity/TenderOpportunity                                                                                 validates all new
           Mongoose model. Use nested                                                                                    fields. No schema
           objects for contacts (array),                                                                                 validation errors on
           related_documents (array), and                                                                                save.
           analyst_updates (array).                                                                                      

  **3**    Update                          *backend/src/modules/tender-discovery/services/DiscoveryMetadataService.js*   buildGovWinMetadata()
           DiscoveryMetadataService.js                                                                                   returns object with
           buildGovWinMetadata() to                                                                                      contacts\[\],
           populate the new fields from                                                                                  related_documents\[\],
           the connector output.                                                                                         analyst_updates\[\] all
                                                                                                                         populated.
  -----------------------------------------------------------------------------------------------------------------------------------------------

**1B --- Email Tender Scanning --- ATS Module (ATS-001 → ATS-010)**

**Current State**

The email scanning module is architecturally sound but has four specific
gaps that prevent production use: (1) Thermo Fisher mailbox addresses
are not configured --- demo seed uses fake \@healthcare.example.com
addresses. (2) No Excel keyword file loader --- keywords come from
MongoDB not the Excel file the client specified. (3) PDF attachment
content is downloaded but never passed through pdf-parse for keyword
scanning. (4) The email forward does not strip non-matching link
sections before sending.

**Requirement-by-Requirement Audit**

  ---------------------------------------------------------------------------------------------------------------------
  **Req \#**    **Requirement /       **Current     **Key File(s)**                   **Effort**   **What to Build /
                Task**                Status**                                                     Fix**
  ------------- --------------------- ------------- --------------------------------- ------------ --------------------
  **ATS-001**   Read tender emails    **PARTIAL**   *MicrosoftGraphMailService.js;    1d           Configure real
                from US + Austria                   emailTenderDemoSeed.js*                        Thermo mailbox
                Outlook mailboxes                                                                  addresses; set Graph
                                                                                                   env vars

  **ATS-002**   Load keywords from    **MISSING**   *EmailKeywordScanner.js --- no    2d           Build
                Excel file (.xlsx)                  Excel loader*                                  ExcelKeywordLoader
                                                                                                   service using xlsx
                                                                                                   library; replace
                                                                                                   hardcoded keywords

  **ATS-003**   Scan PDF/text         **PARTIAL**   *EmailKeywordScanner.js;          2-3d         Wire pdf-parse into
                attachments for                     MicrosoftGraphMailService.js                   email attachment
                keywords                            L230*                                          scan path; download
                                                                                                   attachment bytes
                                                                                                   before scanning

  **ATS-004**   Multi-link emails:    **PARTIAL**   *extractLinks.js;                 2d           Build cleaned email
                retain matched                      EmailTenderScanService.js*                     body assembler; pass
                sections, strip                                                                    to forwardMessage
                unmatched                                                                          instead of full
                                                                                                   bodyText

  **ATS-005**   Move rejected emails  **EXISTS**    *EmailTenderScanService.js        0            Works. Verify
                to Rejected Folder                  L172--184*                                     folderRejected name
                                                                                                   matches \"Rejected
                                                                                                   Tenders\".

  **ATS-006**   Forward matched       **PARTIAL**   *EmailTenderScanService.js        1d           SMTP must be
                tenders to sales team               L186--192;                                     configured
                                                    MicrosoftGraphMailService.js*                  (SMTP_HOST,
                                                                                                   SMTP_USER, SMTP_PASS
                                                                                                   env vars)

  **ATS-007**   Handle emails with no **EXISTS**    *EmailTenderScanService.js        0            Works. Add test
                links --- keyword                   scanMode: keywords_only*                       case.
                scan on body only                                                                  

  **ATS-009**   Retry Outlook login   **EXISTS**    *OutlookAuthRetryService.js       0            Works. Verify
                3× before failure                   MAX_RETRIES=3*                                 exponential backoff
                alert                                                                              delay.

  **ATS-010**   Failure notification  **PARTIAL**   *FailureNotificationService.js;   2d           Current SVG artifact
                with error screenshot               FailureScreenshotService.js*                   is not a screenshot.
                                                                                                   Build Puppeteer or
                                                                                                   HTML screenshot
                                                                                                   capture.
  ---------------------------------------------------------------------------------------------------------------------

**Step-by-Step Implementation Instructions**

**Step 1.B.1 --- Configure Real Outlook Mailboxes (ATS-001) ---
CRITICAL**

  -----------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                             **File / Location**                              **Acceptance Test**
  -------- -------------------------------------- ------------------------------------------------ ----------------------------
  **1**    In emailTenderDemoSeed.js (or          *backend/src/seed/data/emailTenderDemoSeed.js;   EmailTenderMailbox documents
           whichever seed file creates mailbox    models/EmailTenderMailbox.js*                    exist in DB with correct
           records), replace the demo mailbox                                                      Thermo Fisher email
           addresses with the real Thermo Fisher                                                   addresses and correct region
           addresses: US =                                                                         codes.
           cmdamericasbids@thermofisher.com,                                                       
           Austria = admin.at@thermo.com. The                                                      
           EmailTenderMailbox model already                                                        
           supports region enum \[\"US\", \"AT\",                                                  
           \"GLOBAL\"\].                                                                           

  **2**    Ensure all four Microsoft Graph        *backend/.env.production.example;                App refuses to start without
           environment variables are set in       backend/src/config/env.js*                       all four Graph env vars.
           production: MS_GRAPH_TENANT_ID,                                                         OutlookAuthRetryService
           MS_GRAPH_CLIENT_ID,                                                                     returns a real token from
           MS_GRAPH_CLIENT_SECRET,                                                                 login.microsoftonline.com.
           MS_GRAPH_USER_EMAIL. Add to                                                             
           .env.production.example. Add                                                            
           validation in env.js so app fails on                                                    
           start if any are missing.                                                               

  **3**    Austria mailbox (admin.at@thermo.com)  *models/EmailTenderMailbox.js;                   Austria mailbox processes
           uses a different sender filter: only   EmailTenderScanService.js*                       only emails from
           emails from service@auftrag.at should                                                   service@auftrag.at. US
           be processed. Add a senderFilter field                                                  mailbox processes all unread
           to EmailTenderMailbox model. Update                                                     emails.
           EmailTenderScanService.scanMailbox()                                                    
           to apply sender filter when set.                                                        
  -----------------------------------------------------------------------------------------------------------------------------

**Step 1.B.2 --- Build Excel Keyword File Loader (ATS-002) --- HIGH**

This is the only missing module in the ATS block that has zero existing
code. The client specifically calls out two Excel files: \"Product
Keywords.xlsx\" and \"Thermo Scientific - Key Words.xlsx\" (US), and
\"KEYWORDS_auftrag.at service@auftrag.at.xlsx\" (Austria). Keywords must
be loaded from these files, not hardcoded in MongoDB.

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                                                         **File / Location**                                                                **Acceptance Test**
  -------- ---------------------------------------------------------------------------------- ---------------------------------------------------------------------------------- --------------------------------
  **1**    Install xlsx package: npm install xlsx \--save. This is not in package.json. This  *backend/package.json*                                                             xlsx appears in package.json
           is the only new dependency needed for this step.                                                                                                                      dependencies. require(\"xlsx\")
                                                                                                                                                                                 resolves without error.

  **2**    Create new service:                                                                *backend/src/modules/email-tender-scanning/services/ExcelKeywordLoaderService.js   loadKeywordsFromFile(\"Product
           backend/src/modules/email-tender-scanning/services/ExcelKeywordLoaderService.js.   (NEW)*                                                                             Keywords.xlsx\") returns array
           Export one function: loadKeywordsFromFile(filePath). It should: read the xlsx                                                                                         of keyword strings. No
           file, iterate all sheets, collect all non-empty cell values, deduplicate, return                                                                                      duplicates. Works on both test
           as string\[\]. Handle both .xlsx and .xls formats.                                                                                                                    xlsx files.

  **3**    Update EmailKeywordScanner.js loadKeywordsForCompany() to check if the mailbox has *EmailKeywordScanner.js*                                                           When keywordFilePath is set on
           a keywordFilePath configured. If yes, call                                                                                                                            mailbox, keywords are loaded
           ExcelKeywordLoaderService.loadKeywordsFromFile(). If no, fall back to MongoDB                                                                                         from Excel. When not set,
           Watchlist keywords (keep existing behavior as fallback).                                                                                                              MongoDB keywords are used.

  **4**    Add keywordFilePath field to EmailTenderMailbox model. Add a file upload endpoint  *models/EmailTenderMailbox.js; routes/intelligencePlatform.js or admin routes*     Mailbox document stores
           (or admin UI config) to allow uploading/updating the keyword file per mailbox                                                                                         keywordFilePath. Updating the
           without a code deploy.                                                                                                                                                Excel file updates keywords on
                                                                                                                                                                                 next scan run without restart.
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

**Step 1.B.3 --- Wire PDF Attachment Scanning (ATS-003) --- HIGH**

The pdf-parse library IS in package.json (L35: \"pdf-parse\":
\"\^1.1.1\"). It is used in
document-intelligence/services/ExtractionPipeline.js. It is NOT wired
into the email scanning path. The email scanner only processes the
message textContent field --- attachments are downloaded but their
content is never extracted.

  ---------------------------------------------------------------------------------------------------
  **\#**   **Action**                     **File / Location**                 **Acceptance Test**
  -------- ------------------------------ ----------------------------------- -----------------------
  **1**    In                             *MicrosoftGraphMailService.js ---   Message object returned
           MicrosoftGraphMailService.js   around L230*                        from
           fetchInboxMessages(), add                                          fetchInboxMessages()
           attachment download logic.                                         contains attachments
           After fetching message list,                                       array with contentBytes
           for each message with                                              (base64) for each
           hasAttachments=true, call GET                                      attachment.
           /messages/{id}/attachments to                                      
           get the attachment list, then                                      
           fetch each attachment                                              
           contentBytes. Currently line                                       
           230 creates messages with                                          
           attachments: \[\] --- this                                         
           must be populated with actual                                      
           bytes.                                                             

  **2**    In EmailKeywordScanner.js      *EmailKeywordScanner.js             When email has PDF
           scanAttachments(), import      scanAttachments()*                  attachment, keyword
           pdf-parse. For each attachment                                     matches are found in
           where contentType is                                               PDF text --- not just
           \"application/pdf\", convert                                       email body.
           contentBytes from base64 to                                        
           Buffer, then call                                                  
           pdfParse(buffer) to extract                                        
           text. Pass extracted text to                                       
           the existing keyword matching                                      
           logic.                                                             

  **3**    For non-PDF text attachments   *EmailKeywordScanner.js*            Keyword scan works on
           (text/plain, text/html,                                            PDF, .txt, and .docx
           application/msword via                                             email attachments.
           mammoth), extract text                                             
           directly. mammoth is already                                       
           in package.json for Word                                           
           documents --- use it here too                                      
           for .docx attachments.                                             

  **4**    Add attachment scan results to *models/EmailTenderScanResult.js*   Scan result includes
           the EmailTenderScanResult                                          attachmentMatches\[\]
           model. Record: which                                               with filename and
           attachment matched, which                                          matchedKeywords\[\] per
           keyword, at what character                                         attachment.
           offset. This gives auditors                                        
           proof of match.                                                    
  ---------------------------------------------------------------------------------------------------

**Step 1.B.4 --- Build Cleaned Email Forward (ATS-004) --- MEDIUM**

When an email contains multiple tender sections (each with its own
link), the bot must strip non-matching sections and only forward the
relevant ones. Currently, MicrosoftGraphMailService.forwardMessage()
sends the full bodyText unmodified.

  ------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                   **File / Location**             **Acceptance Test**
  -------- -------------------------------------------- ------------------------------- ----------------------
  **1**    In EmailTenderScanService.js, after link     *EmailTenderScanService.js ---  cleanedBody contains
           section analysis, build a cleanedBody        around L186--192*               only matched tender
           string. Start with the email header/intro                                    sections. Non-matching
           text, then append only the link sections                                     sections are absent.
           where decision === \"matched\". This is the                                  
           body to forward.                                                             

  **2**    Pass cleanedBody to                          *MicrosoftGraphMailService.js   Forwarded email body
           MicrosoftGraphMailService.forwardMessage()   forwardMessage()*               contains only matching
           as the body parameter. Update the method                                     tender sections.
           signature to accept an optional customBody                                   
           parameter.                                                                   

  **3**    If all sections are matched (100% match),    *EmailTenderScanService.js*     All-match email
           forward the original email unmodified. If                                    forwards original.
           all sections are non-matching, do not                                        No-match email moves
           forward --- move to Rejected Folder.                                         to Rejected Folder.
                                                                                        Partial-match email
                                                                                        forwards cleaned
                                                                                        version.
  ------------------------------------------------------------------------------------------------------------

**1C --- Scheduler Hardening (Cross-cutting --- do in Phase 1)**

**Current State**

DiscoveryScheduler.js uses setInterval(fn, 60000) --- a simple 60-second
poll loop. The RTM requires the bot to run daily at 3 AM UTC. The
current architecture cannot guarantee any specific time. If the Node.js
process restarts, the interval resets. There is no distributed queue, no
persistence of scheduled jobs between restarts, and no cron expression
support.

  ---------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                       **File / Location**            **Acceptance Test**
  -------- ------------------------------------------------ ------------------------------ ----------------------------------
  **1**    Install node-cron: npm install node-cron         *backend/package.json*         node-cron in package.json.
           \--save. This is the minimum change needed for a                                require(\"node-cron\") resolves
           proper cron schedule.                                                           without error.

  **2**    Replace the setInterval block in                 *DiscoveryScheduler.js         Scheduler fires at 03:00:00 UTC
           DiscoveryScheduler.js (L14--21) with:            L14--21*                       exactly. Does not fire at any
           cron.schedule(\"0 3 \* \* \*\", () =\>                                          other time unless manually
           this.tick(), { timezone: \"UTC\" }). Keep the                                   triggered via API.
           existing this.tick() method unchanged.                                          

  **3**    Add a manual trigger API endpoint: POST          *backend/src/routes/admin.js   POST
           /api/admin/discovery/trigger-now. This allows    or intelligencePlatform.js*    /api/admin/discovery/trigger-now
           developers and the client to run the discovery                                  starts a discovery run
           job on demand without waiting for 3 AM. Guard                                   immediately. Returns 202 Accepted
           with admin role middleware.                                                     with job ID.

  **4**    Add DISCOVERY_CRON_EXPRESSION env var with       *backend/src/config/env.js;    Scheduler reads cron expression
           default \"0 3 \* \* \*\" so the schedule can be  DiscoveryScheduler.js*         and timezone from env. App logs
           changed without a code deploy. Add                                              the cron expression on startup.
           DISCOVERY_CRON_TIMEZONE with default \"UTC\".                                   

  **5**    Wire the email tender scanning (ATS) bot into    *DiscoveryScheduler.js         At 3 AM UTC, BOTH GovWin discovery
           the same scheduler. Currently ATS scan is        this.tick()*                   and email ATS scan run
           manual-only (POST                                                               automatically.
           /api/intelligence/email-tender-scanning/scan).                                  
           Add it to the scheduler tick alongside GovWin                                   
           discovery.                                                                      
  ---------------------------------------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **PHASE 2 --- DOCUMENT INTELLIGENCE**

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  Commercial Field Extraction (TB-007 → TB-009) \| AI Relevancy Scoring
  Production Hardening (TB-010)

  -----------------------------------------------------------------------

Phase 2 is the AI/ML engineering phase. The generic summarization that
exists today (ExtractionPipeline.js) must be replaced with three
specialized parsers. This is the biggest technical build in the project.
Allocate your AI/ML resource for this phase.

**2A --- Ship-to, Scope, and SKU Extraction (TB-007)**

**Current State**

tenderIntelligenceExtractors.js has extractCommercialFields() which uses
basic regex. Both audits confirm it falls back to hardcoded demo text
when no document is present (TenderIntelligenceService.js L41--42). This
is not acceptable for production.

  ----------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                     **File / Location**                                                             **Acceptance Test**
  -------- ------------------------------ ------------------------------------------------------------------------------- ----------------------
  **1**    Remove the hardcoded fallback  *TenderIntelligenceService.js L41--42*                                          When document text is
           text from                                                                                                      absent, extraction
           TenderIntelligenceService.js                                                                                   returns null fields
           (L41--42). If no document text                                                                                 --- not demo text.
           is available, return empty                                                                                     
           extraction result --- not fake                                                                                 
           data.                                                                                                          

  **2**    Build a ShipToAddressExtractor *backend/src/modules/document-intelligence/services/ShipToAddressExtractor.js   Extract ship-to
           class. Use Named Entity        (NEW)*                                                                          address from 5 sample
           Recognition via OpenAI (or the                                                                                 Thermo Fisher tender
           existing HeuristicAiProvider)                                                                                  PDFs with \>80%
           to identify delivery                                                                                           accuracy.
           addresses. Look for patterns:                                                                                  
           \"Ship to:\", \"Deliver to:\",                                                                                 
           \"FOB Destination:\", \"Place                                                                                  
           of Delivery:\". Return                                                                                         
           normalized address object with                                                                                 
           street, city, state, zip,                                                                                      
           country.                                                                                                       

  **3**    Build a                        *backend/src/modules/document-intelligence/services/SKUPartNumberExtractor.js   Correctly extracts at
           SKUPartNumberExtractor. Look   (NEW)*                                                                          least one SKU/part
           for patterns matching \"SKU\",                                                                                 number from a test bid
           \"Part No\", \"Catalog No\",                                                                                   document containing
           \"Model No\" followed by                                                                                       product line items.
           alphanumeric identifiers.                                                                                      
           Thermo Fisher products                                                                                         
           typically follow patterns like                                                                                 
           SKU-XXXXX or catalog numbers                                                                                   
           like 12345678.                                                                                                 

  **4**    Integrate both extractors into *backend/src/modules/document-intelligence/services/ExtractionPipeline.js*      runFullPipeline()
           the ExtractionPipeline.js                                                                                      result object has
           runFullPipeline() method as                                                                                    shipToAddress and
           new pipeline stages after the                                                                                  partNumbers fields
           existing text extraction                                                                                       populated for
           stage.                                                                                                         documents containing
                                                                                                                          this data.
  ----------------------------------------------------------------------------------------------------------------------------------------------

**2B --- Terms & Conditions Extraction (TB-008)**

  ----------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                        **File / Location**                                                      **Acceptance Test**
  -------- ------------------------------------------------- ------------------------------------------------------------------------ ----------------------
  **1**    Build a ClauseExtractor service. The extraction   *backend/src/modules/document-intelligence/services/ClauseExtractor.js   For a test T&C
           pipeline already has basic clause detection       (NEW)*                                                                   document, extractor
           (regex /shall\|must\|liability\|indemn/i at L91).                                                                          returns JSON with at
           Replace this with an AI prompt that specifically                                                                           least 5 of the 7
           asks to extract: bid delivery instructions,                                                                                required clause types
           freight charges, FOB terms, pricing, scope of                                                                              populated.
           work, insurance requirements, certificate of                                                                               
           insurance details, indemnification clauses. Use                                                                            
           structured JSON output from OpenAI.                                                                                        

  **2**    Map the extracted clause fields to the existing   *models/ClauseExtraction.js*                                             ClauseExtraction model
           ClauseExtraction Mongoose model. Verify the model                                                                          validates without
           has fields for all required clause types. Add any                                                                          error when populated
           missing fields.                                                                                                            with real T&C
                                                                                                                                      extraction output.

  **3**    Surface T&C extraction results on the AI Docs     *frontend/src/pages/ai-document-intelligence/; frontend pages matching   T&C extracted fields
           page                                              Commercials menu*                                                        visible in the
           (frontend/src/pages/ai-document-intelligence/).                                                                            Commercials section of
           The Commercials menu item in the sidebar likely                                                                            the UI.
           maps to this output --- confirm with frontend                                                                              
           team.                                                                                                                      
  ----------------------------------------------------------------------------------------------------------------------------------------------------------

**2C --- Pricing Sheet Extraction (TB-009)**

This is the most technically complex extraction task. Price sheets come
as both XLSX tables and PDF tables. The current system has no XLSX
parser and no PDF table extraction.

  -----------------------------------------------------------------------------------------
  **\#**   **Action**                   **File / Location**          **Acceptance Test**
  -------- ---------------------------- ---------------------------- ----------------------
  **1**    For XLSX price sheets:       *ExtractionPipeline.js;      XLSX price sheet with
           install xlsx (already needed PricingSheetExtractor.js     10 line items returns
           for ATS-002 keyword loader). (NEW)*                       10 structured objects
           In ExtractionPipeline.js,                                 with description, qty,
           detect when the attachment                                and UoM.
           is an .xlsx file. Parse it                                
           with                                                      
           xlsx.utils.sheet_to_json()                                
           to get row arrays. Look for                               
           columns matching                                          
           \"Description\", \"Qty\",                                 
           \"Unit\", \"UoM\", \"Price\"                              
           (case-insensitive header                                  
           matching).                                                

  **2**    For PDF price sheets: use    *PricingSheetExtractor.js*   PDF price sheet
           pdf-parse to extract text,                                extraction returns
           then apply table detection                                structured line items.
           heuristics --- look for                                   UoM defaults to \"EA\"
           lines with consistent column                              when not specified.
           spacing or pipe/tab                                       
           delimiters. Alternatively,                                
           use OpenAI with a prompt:                                 
           \"Extract all line items                                  
           from this price table as                                  
           JSON array with fields:                                   
           description, qty, uom,                                    
           unit_price\".                                             

  **3**    Store extracted line items   *models/Opportunity.js or    Opportunity record has
           as PricingLineItem           TenderOpportunity.js*        pricingLineItems\[\]
           subdocuments in the                                       array after extraction
           Opportunity model. Link to                                pipeline runs.
           the source Document record.                               
  -----------------------------------------------------------------------------------------

**2D --- AI Relevancy Scoring Production Hardening (TB-010)**

ScoringEngine.js and AiOrchestrator.js exist and work. The gaps are: (1)
AI_DEMO_MODE forces heuristic scoring in development, (2) no connection
to an external GenAI agent as the RTM expects, (3) scoring is not tuned
to Thermo Fisher product catalog.

  -----------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                   **File / Location**                                              **Acceptance Test**
  -------- ---------------------------- ---------------------------------------------------------------- ----------------------
  **1**    Remove                       *AiOrchestrator.js*                                              With OPENAI_API_KEY
           AI_DEMO_MODE=deterministic                                                                    set, system always
           dependency. The heuristic                                                                     uses OpenAI provider
           provider should be a                                                                          regardless of
           configurable fallback, not                                                                    AI_DEMO_MODE value.
           forced by environment. Use                                                                    
           HeuristicAiProvider only                                                                      
           when OPENAI_API_KEY is not                                                                    
           set.                                                                                          

  **2**    Build a Thermo Fisher        *backend/src/modules/ai-scoring/prompts/thermoFisherContext.js   Scoring prompt
           product catalog context      (NEW)*                                                           includes Thermo Fisher
           loader. Load CAD product                                                                      product context. Score
           categories (chromatography,                                                                   for a chromatography
           mass spectrometry, lab                                                                        tender is \>70. Score
           equipment) as a system                                                                        for a road
           prompt prefix for the                                                                         construction tender is
           scoring LLM call. This                                                                        \<20.
           dramatically improves                                                                         
           relevancy accuracy for                                                                        
           Thermo-specific tenders.                                                                      

  **3**    Add score breakdown to the   *ScoringEngine.js; models/ScoringResult.js*                      Scoring result has
           scoring output: { overall:                                                                    both overall score and
           82, breakdown: {                                                                              breakdown object with
           strategic_fit: 85,                                                                            at least 4 sub-scores.
           product_match: 78,                                                                            
           competition: 60, risk: 45 }                                                                   
           }. Map this to the RTM                                                                        
           decision matrix fields.                                                                       
  -----------------------------------------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **PHASE 3 --- OUTPUT LAYER**

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  Excel Report Generation (TB-014) \| PostgreSQL Output Sync (TB-015) \|
  Failure Notifications (TB-016)

  -----------------------------------------------------------------------

**3A --- Daily Excel Report Generation (TB-014)**

The RTM requires two Excel reports generated daily: (1) Summary Report
--- all active bids sorted by solicitation date newest-first, expired
rows removed. (2) Product Customer Analysis Report --- bids mapped to
CAD product lines with customer intelligence. No Excel generation code
exists.

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                                      **File / Location**                                             **Acceptance Test**
  -------- --------------------------------------------------------------- --------------------------------------------------------------- -------------------------
  **1**    Install exceljs: npm install exceljs \--save. This is the       *backend/package.json*                                          exceljs in package.json.
           industry standard for Excel generation in Node.js with full                                                                     require(\"exceljs\")
           formatting support.                                                                                                             resolves without error.

  **2**    Create                                                          *backend/src/modules/reporting/services/ExcelReportService.js   generateSummaryReport()
           backend/src/modules/reporting/services/ExcelReportService.js.   (NEW)*                                                          produces a valid .xlsx
           Implement generateSummaryReport(): queries MongoDB for all                                                                      file with correct
           opportunities where responseDate \>= today, sorts by                                                                            columns. File can be
           solicitationDate descending, writes to Excel with columns: Bid                                                                  opened in Excel without
           ID, Title, Agency, Status, Solicitation Date, Response Date,                                                                    errors.
           Value, Place of Performance, Opportunity URL, AI Score,                                                                         
           Division.                                                                                                                       

  **3**    Implement generateProductAnalysisReport(): same base query, but *ExcelReportService.js*                                         Product analysis report
           adds extracted commercial fields (product line, SKU matches,                                                                    has two worksheets:
           extracted line items). Groups by CAD product category. Second                                                                   summary and product
           worksheet with customer intelligence data from Salesforce                                                                       detail. No formula
           cache.                                                                                                                          errors.

  **4**    Wire into the scheduler: after each daily discovery run,        *DiscoveryScheduler.js; routes/reports.js (NEW)*                After scheduler run, two
           auto-generate both reports and save to                                                                                          Excel files exist in the
           uploads/{companyId}/reports/YYYY-MM-DD/. Add a download API                                                                     reports folder for that
           endpoint: GET                                                                                                                   date. Download endpoint
           /api/reports/daily?date=YYYY-MM-DD&type=summary\|product.                                                                       returns the files.

  **5**    Add report expiry logic: remove bids where responseDate \<      *ExcelReportService.js*                                         Report contains zero bids
           yesterday from the report. On each daily run, re-generate ---                                                                   with responseDate before
           do not append. Each report is a fresh full-state snapshot.                                                                      today.
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------

**3B --- PostgreSQL Output Sync (TB-015)**

The RTM explicitly specifies a PostgreSQL database endpoint owned by the
client:
gene-ai-solutions-prospects-db.cpuz5conexqr.us-east-1.rds.amazonaws.com
port 5432, login: geneAiDbUser. The platform is MongoDB-only. An ETL
sync layer must be built --- this does NOT require replacing MongoDB.
MongoDB remains the operational database; PostgreSQL is the output
destination for reporting.

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                                         **File / Location**                                           **Acceptance Test**
  -------- ------------------------------------------------------------------ ------------------------------------------------------------- -----------------------
  **1**    Install pg: npm install pg \--save. This is the official           *backend/package.json*                                        pg in package.json.
           PostgreSQL client for Node.js.                                                                                                   require(\"pg\")
                                                                                                                                            resolves without error.

  **2**    Create                                                             *PostgreSQLSyncService.js (NEW);                              PostgreSQLSyncService
           backend/src/modules/reporting/services/PostgreSQLSyncService.js.   backend/.env.production.example*                              connects to the PG
           Configure connection using env vars: PG_HOST, PG_PORT,                                                                           endpoint and returns
           PG_DATABASE, PG_USER, PG_PASSWORD. The actual client values                                                                      client.query(\"SELECT
           (gene-ai-solutions-prospects-db endpoint, geneAiDbUser) go in the                                                                1\") = 1.
           production .env --- not hardcoded in source.                                                                                     

  **3**    Build a schema migration script: create the opportunities_awards   *backend/src/migrations/001_create_opportunities_awards.sql   Migration runs without
           table in PG matching the Combined_Opportunities_Awards.xlsx column (NEW)*                                                        error on the PG
           structure from the RTM (the client provided this as the output                                                                   endpoint. Table exists
           schema). Fields: bid_id, title, agency, status, solicitation_date,                                                               with all required
           response_date, value, place_of_performance, naics_codes,                                                                         columns.
           primary_requirement, opportunity_url, ai_score, last_updated.                                                                    

  **4**    Implement syncOpportunity(opportunityId): reads from MongoDB,      *PostgreSQLSyncService.js; DiscoveryService.js*               After importing 5 bids,
           upserts to PostgreSQL using ON CONFLICT (bid_id) DO UPDATE. Run                                                                  all 5 appear in the PG
           this after each bid import in                                                                                                    opportunities_awards
           DiscoveryService.importOpportunities().                                                                                          table with correct
                                                                                                                                            data.

  **5**    Add daily full-sync as a fallback: after the daily discovery run,  *DiscoveryScheduler.js; PostgreSQLSyncService.js*             PG record count matches
           sync all active opportunities to PG to catch any missed                                                                          MongoDB active
           incremental updates. Run as a post-scheduler job.                                                                                opportunity count after
                                                                                                                                            daily sync.
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------

**3C --- Failure Notification Emails (TB-016)**

FailureNotificationService.js exists for ATS failures. The RTM requires
separate failure emails for two scenarios: (1) Application/BOT failure
--- system error, crash, API failure. (2) Summary report failure ---
daily report could not be generated. SMTP must be configured for either
to work.

  ----------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                      **File / Location**                 **Acceptance Test**
  -------- ------------------------------- ----------------------------------- -----------------------------------------------
  **1**    Configure SMTP: add SMTP_HOST,  *backend/.env.production.example;   Calling
           SMTP_PORT, SMTP_USER, SMTP_PASS FailureNotificationService.js*      FailureNotificationService.sendFailureAlert()
           to .env.production.example. The                                     delivers an email to the test address.
           nodemailer transporter is                                           
           already instantiated in the                                         
           codebase --- just needs real                                        
           credentials.                                                        
           BOT_FAILURE_NOTIFY_EMAILS env                                       
           var should be a comma-separated                                     
           list of admin addresses.                                            

  **2**    Add a                           *FailureNotificationService.js;     When report generation throws an error, an
           sendSummaryReportAlert(error)   ExcelReportService.js;              email is sent to BOT_FAILURE_NOTIFY_EMAILS.
           method to                       PostgreSQLSyncService.js*           
           FailureNotificationService.js                                       
           for TB-016 scenario 2. Call                                         
           this from ExcelReportService.js                                     
           and PostgreSQLSyncService.js                                        
           when their daily jobs fail.                                         

  **3**    Replace the SVG artifact in     *FailureScreenshotService.js*       Failure email has an attachment --- either .png
           FailureScreenshotService.js                                         screenshot or .txt stack trace.
           with a proper approach. Use                                         
           Puppeteer to capture a                                              
           screenshot of the Tender360                                         
           dashboard error state, OR                                           
           simply attach the Node.js error                                     
           stack trace as a .txt file. The                                     
           client asked for a screenshot                                       
           --- a stack trace attachment is                                     
           acceptable as Phase 1; real                                         
           screenshot via Puppeteer is                                         
           Phase 2.                                                            
  ----------------------------------------------------------------------------------------------------------------------------

  -----------------------------------------------------------------------
  **PHASE 4 --- TEAMS / SHAREPOINT + SALESFORCE**

  -----------------------------------------------------------------------

  -----------------------------------------------------------------------
  Microsoft Graph Upload (TB-012, TB-013) \| Salesforce Account
  Validation (TB-011)

  -----------------------------------------------------------------------

Phase 4 is the most effort-intensive phase (8-12 weeks) and is
explicitly out of scope for Phase 1. Confirm with the client before
starting. Do not let Phase 4 block Phase 1-3 delivery.

**4A --- SharePoint / Teams Upload (TB-012, TB-013)**

  ----------------------------------------------------------------------------------------------------------------------
  **Req \#**   **Requirement /       **Current     **Key File(s)**    **Effort**   **What to Build / Fix**
               Task**                Status**                                      
  ------------ --------------------- ------------- ------------------ ------------ -------------------------------------
  **TB-012**   Upload bid docs to    **MISSING**   *None exists*      6-8w         Install
               Teams \"CAD AI Tender                                               \@microsoft/microsoft-graph-client;
               Prospecting\"                                                       build SharePointUploadService;
                                                                                   request Files.ReadWrite.All
                                                                                   permission in Azure AD app

  **TB-013**   Create per-bid        **MISSING**   *None exists*      Blocked by   Add folder provisioning via Graph API
               subfolder using Bid                                    TB-012       drive/{id}/root:/BidId:/children
               ID                                                                  
  ----------------------------------------------------------------------------------------------------------------------

  ----------------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                            **File / Location**                                                **Acceptance Test**
  -------- ------------------------------------- ------------------------------------------------------------------ ----------------------
  **1**    In Azure AD: add Files.ReadWrite.All  *Azure AD App Registration (external)*                             Graph access token
           and Sites.ReadWrite.All permissions                                                                      includes
           to the existing app registration used                                                                    Files.ReadWrite.All
           for Outlook Graph access. Get admin                                                                      scope.
           consent from Thermo Fisher IT team.                                                                      

  **2**    Install                               *backend/package.json*                                             Package resolves
           \@microsoft/microsoft-graph-client:                                                                      without error.
           npm install                                                                                              
           \@microsoft/microsoft-graph-client                                                                       
           \--save. This is the official                                                                            
           Microsoft SDK --- not present in                                                                         
           package.json currently.                                                                                  

  **3**    Create SharePointUploadService.js.    *backend/src/modules/storage/services/SharePointUploadService.js   uploadDocument()
           Implement: (a)                        (NEW)*                                                             creates the folder and
           getOrCreateFolder(bidId) --- checks                                                                      uploads a test PDF to
           if folder exists in \"CAD AI Tender                                                                      SharePoint. Verify in
           Prospecting\" site, creates if not;                                                                      Teams client.
           (b) uploadDocument(bidId, filename,                                                                      
           buffer) --- uploads file to the bid                                                                      
           folder.                                                                                                  

  **4**    Wire SharePointUploadService into     *AttachmentHarvestService.js; models/Document.js*                  After discovery run,
           AttachmentHarvestService.js: after                                                                       documents have
           successful document download, also                                                                       sharePointUrl field
           upload to SharePoint (async,                                                                             populated. Files
           non-blocking). Store the SharePoint                                                                      visible in Teams.
           URL on the Document record.                                                                              
  ----------------------------------------------------------------------------------------------------------------------------------------

**4B --- Salesforce Account Validation (TB-011)**

SalesforceCrmService.js already exists with SOQL query capability. The
gaps are: (1) no accountNumber field in the CrmAccount model, (2) falls
back to seeded cache without live credentials, (3) not integrated into
the intelligence pipeline automatically.

  ------------------------------------------------------------------------------------------------------------------------------
  **\#**   **Action**                                                 **File / Location**                 **Acceptance Test**
  -------- ---------------------------------------------------------- ----------------------------------- ----------------------
  **1**    Add accountNumber field to CrmAccount model (currently has *models/CrmAccount.js;              CRM lookup returns
           salesforceId, name, division --- missing account number).  SalesforceCrmService.js*            accountNumber
           Map from the Salesforce Account.AccountNumber field in the                                     alongside accountName
           SOQL query.                                                                                    and division.

  **2**    Configure SALESFORCE_INSTANCE_URL and                      *backend/.env.production.example;   Live Salesforce query
           SALESFORCE_ACCESS_TOKEN in .env.production.example. Add a  SalesforceCrmService.js*            returns account data
           refresh flow for the access token (Salesforce tokens                                           for a known Thermo
           expire --- implement OAuth refresh).                                                           Fisher customer
                                                                                                          address.

  **3**    TenderIntelligenceService.runFullIntelligenceForTender()   *TenderIntelligenceService.js*      CRM validation
           already calls CRM validation --- verify it uses the                                            succeeds when matched
           contactPhone, contactEmail, and placeOfPerformance address                                     by address or contact
           extracted in Phase 2 as lookup keys, not just the bid                                          info from bid
           agency name.                                                                                   document.
  ------------------------------------------------------------------------------------------------------------------------------

**Pre-Demo Security & Mock Data Cleanup**

Before any client demo or staging environment setup, the following must
be addressed. Both audits independently flagged these:

  ------- -------------------------------- ------------------------------------------ -----------------------
  **⚠**   **Issue**                        **File / Location**                        **Action**

  🔴      **Default JWT secret hardcoded   *backend/src/server.js*                    Move to JWT_SECRET env
          in server.js**                                                              var. App must refuse to
                                                                                      start if env var not
                                                                                      set.

  🔴      **Demo GovWin API keys in seed   *seed/data/sourcesWatchlistsSeedData.js*   Remove from repo. Add
          data                                                                        to .gitignore. Use env
          (demo-govwin-medicare-key)**                                                vars only.

  🔴      **createPlaceholderFile()        *AttachmentHarvestService.js L102--110*    Remove entirely.
          serving fake PDFs**                                                         Replace with proper
                                                                                      error handling (see
                                                                                      Phase 1 steps).

  🟡      **Seeded user passwords          *seed/userSeeder.js; supportSeed.js*       Force password change
          (Admin@123, admin123)**                                                     on first login. Remove
                                                                                      default passwords from
                                                                                      seed.

  🟡      **Demo AI mode                   *AiOrchestrator.js*                        Remove this mode. If no
          (AI_DEMO_MODE=deterministic)**                                              OpenAI key, log a clear
                                                                                      error --- do not
                                                                                      silently use demo mode.

  🟡      **Salesforce seeded CRM cache    *salesforceCrmSeed.js*                     Mark seed data clearly.
          with fake accounts**                                                        Ensure live Salesforce
                                                                                      takes precedence.

  🟡      **Mock chart/win-ratio data in   *dashboardController.js*                   Replace with real
          dashboardController**                                                       aggregations from
                                                                                      MongoDB discovery data.

  🟢      **No hardcoded API keys in       *All backend/src files*                    Confirmed clean. All
          source code**                                                               credentials use env
                                                                                      vars. Good.
  ------- -------------------------------- ------------------------------------------ -----------------------

**Risk Register**

  ---------------------- --------------- ---------------------------------
  **Risk**               **Impact**      **Mitigation**

  GovWin API auth model  **CRITICAL**    Get GovWin API documentation from
  requires Deltek IQ API                 Thermo Fisher contact before
  documentation --- if                   starting TB-001 implementation.
  Brandi Cheetham                        If no API access,
  credentials are                        WebScrapeConnector.js is already
  profile-based not                      in the codebase as a fallback.
  API-key-based, the                     
  integration approach                   
  may change                             

  PDF attachment         **HIGH**        Test attachment download with
  download from GovWin                   real GovWin credentials in
  may require                            Week 1. If it requires UI
  authenticated session                  session, WebScrapeConnector +
  cookies, not just an                   cookie-based auth is the
  API key                                fallback.

  SharePoint/Teams file  **HIGH**        Initiate Azure AD permission
  upload requires IT                     request early (Phase 1). Do not
  admin consent from                     wait for Phase 4.
  Thermo Fisher for                      
  Files.ReadWrite.All                    
  scope --- this is                      
  outside Celeris                        
  control                                

  PostgreSQL endpoint    **MEDIUM**      Request PG credentials from Anand
  credentials                            Kumar / Lakshman Akhil Kumar as
  (geneAiDbUser                          listed in PDD. Add to
  password) are stored                   .env.production.example
  in Keeper --- must be                  immediately.
  shared before Phase 3                  
  starts                                 

  ATS email scanning     **MEDIUM**      Raise with Thermo Fisher IT team
  requires Thermo Fisher                 in the 24-hour call. This is a
  IT to grant Microsoft                  blocker for ATS-001 going live.
  Graph consent to the                   
  registered Azure AD                    
  app for BOTH US and                    
  Austria mailboxes                      
  ---------------------- --------------- ---------------------------------

**Missing NPM Dependencies --- Install These Now**

The following packages are required by the implementation above and are
NOT in backend/package.json. Install all of them before starting any
phase. Zero of these require architectural changes --- they are
additive.

  ---------------------------------------- ----------- ----------------- ------------------------------------
  **Package**                              **Phase**   **Requirement**   **Install Command**

  **node-cron**                            **P1**      Scheduler at 3 AM npm install node-cron \--save
                                                       UTC               

  **xlsx**                                 **P1**      ATS-002 Excel     npm install xlsx \--save
                                                       keyword loader    

  **exceljs**                              **P3**      TB-014 Excel      npm install exceljs \--save
                                                       report generation 

  **pg**                                   **P3**      TB-015 PostgreSQL npm install pg \--save
                                                       sync              

  **\@microsoft/microsoft-graph-client**   **P4**      TB-012/013        npm install
                                                       SharePoint upload \@microsoft/microsoft-graph-client
                                                                         \--save
  ---------------------------------------- ----------- ----------------- ------------------------------------

**Developer Checklist --- Before First Commit**

Complete this checklist before raising a pull request for any Phase 1
work:

-   Install all Phase 1 NPM dependencies: node-cron, xlsx

-   Set all required env vars in .env.production.example:
    GOVWIN_SEARCH_ID, GOVWIN_USER_ID, MS_GRAPH_TENANT_ID,
    MS_GRAPH_CLIENT_ID, MS_GRAPH_CLIENT_SECRET, MS_GRAPH_USER_EMAIL,
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SAM_GOV_API_KEY,
    BOT_FAILURE_NOTIFY_EMAILS

-   Remove createPlaceholderFile() from AttachmentHarvestService.js
    before merging any PR

-   Remove buildDemoOpportunities() fallback from GovWinConnector.js
    before merging any PR

-   Remove hardcoded JWT secret from server.js

-   Replace demo seed mailbox addresses with real Thermo Fisher
    addresses

-   Confirm GovWin API auth model with Thermo Fisher before coding
    TB-001

-   Request Microsoft Graph Files.ReadWrite.All permission from Thermo
    Fisher IT (even in Phase 1 --- long lead time)

-   Request PostgreSQL credentials (geneAiDbUser password) from
    Anand/Lakshman Kumar

-   Add acceptance test for every implementation step before marking as
    done

**--- END OF DOCUMENT ---**
