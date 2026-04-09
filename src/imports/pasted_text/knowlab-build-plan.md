KNOWLAB
Phased Build Plan + Full Unit & Test Reference
Clinical Knowledge Platform for Nigerian Teaching Hospitals

Version 1.0  |  This document contains: 4 build phases, step-by-step AI-executable tasks, and the complete test catalogue for 5 clinical units across 22 benches.
 
Overview
Knowlab is built across 4 sequential phases. Each phase ends with a deployable, testable build that a real user can interact with. Phases are structured so an AI agent (Gemini CLI, Codex, or Claude) can execute each step, push to a branch, and get feedback before proceeding.
The phases are:
•	Phase 1: Foundation & Dashboard Shell — core layout, auth, and the staff dashboard with real bench-scoped data
•	Phase 2: SOP Module — the full SOP lifecycle including library, detail view, and the create/submit flow
•	Phase 3: Tests, Job Aids & AI Assistant — the test catalogue, job aid reader, and the AI assistant interface
•	Phase 4: Admin, Compliance & Training — audit trail, roles, user management, training hub
Each phase step is written as a discrete task with a clear deliverable and a push/commit point. When feeding to an AI agent, feed one step at a time.

Unit & Bench Reference
The following 5 units are seeded in the Knowlab database. Each unit has multiple benches. The full test catalogue (250+ tests) is included in the interactive reference document. Below is the structural summary.

Unit	Benches	Sample tests (representative)
Hematology & Blood Transfusion	Hematology Routine, Coagulation, Blood Bank / Transfusion, Morphology / Film Reading	FBC, ESR, Reticulocyte Count, PT/INR, APTT, Fibrinogen, D-Dimer, ABO Grouping, Crossmatch, DAT, Hb Electrophoresis, HPLC, Malaria film, G6PD, Bone Marrow Report
Chemical Pathology	Routine Chemistry, Endocrinology / Hormones, Tumour Markers, Urine Chemistry, Toxicology / TDM	U&E, LFTs, FBG, HbA1c, Lipid Profile, Troponin, CRP, Creatinine, TSH, FT4, Cortisol, PSA, AFP, CEA, CA-125, Phenytoin, Digoxin, Vancomycin, Paracetamol level
Medical Microbiology	Bacteriology, TB / AFB, Serology, Parasitology, Mycology	Blood Culture C&S, UMCS, HVS, Wound Swab, CSF Culture, GeneXpert MTB/RIF, ZN Stain, HIV Rapid, HBsAg, CD4 Count, Widal, VDRL, Malaria RDT, OCP, KOH prep, CrAg
Histopathology & Cytology	Histology / Tissue Processing, Special Stains, Cytology, Immunohistochemistry (IHC)	H&E biopsy, Frozen Section, FNAC (thyroid, breast, lymph node), Pap Smear, PAS, Masson's Trichrome, Congo Red, GMS, ER/PR/HER2, Ki-67, TTF-1, CK7/CK20, p16
Immunology	Autoimmune Serology, Immunoglobulins & Complement	ANA, anti-dsDNA, ENA Panel, anti-CCP, RF, ANCA, anti-GBM, AMA, SPEP, IFE, Free Light Chains, IgG/IgA/IgM/IgE, C3, C4, CH50

Total tests seeded at launch: 257 tests across 22 benches in 5 units.

 
Phase 1
Foundation & Dashboard Shell
Auth, layout, DB schema, unit/bench scoping, and the staff dashboard with real data.

Goal: By the end of Phase 1 you should be able to log in as Adaeze Nwosu (Hematology, assigned benches: Hematology Routine / Coagulation / Film Reading) and see a real, populated dashboard showing actual SOPs, tests, and job aids scoped to her benches. Nothing placeholder.
Phase 1 Steps
Step	Task	What to build	Commit / push point
1.1	Project setup	Next.js 14 (app router) + Tailwind + Prisma + PostgreSQL (Supabase). Install Shadcn/ui. Init git repo. Set up .env.	PUSH: empty Next.js scaffold with DB connected
1.2	Database schema	Create schema: User, Unit, Bench, BenchAssignment, SOP, Test, JobAid, TestBenchLink, SOPBenchLink. Run migrations.	PUSH: prisma schema + migration files
1.3	Seed data: Units & Benches	Seed all 5 units and their 22 benches (exact names from Unit & Bench Reference above).	PUSH: seed/units.ts + seed/benches.ts
1.4	Seed data: Tests (Phase 1 units)	Seed all 63 Hematology tests + 90 Chemical Pathology tests. Link each test to its bench in TestBenchLink.	PUSH: seed/tests_heme.ts + seed/tests_chem.ts
1.5	Seed data: Remaining units	Seed Microbiology (53 tests), Histopathology (54 tests), Immunology (27 tests). Link to benches.	PUSH: seed/tests_micro.ts + seed/tests_histo.ts + seed/tests_immuno.ts
1.6	Auth: NextAuth setup	NextAuth with credentials provider. Roles: STAFF, AUTHOR, REVIEWER, SUPERVISOR, ADMIN. User.unitId + User.benchIds.	PUSH: auth config + login page
1.7	Seed test users	Seed 5 test users: one per unit, each with 2-3 bench assignments. Include Adaeze Nwosu (Hematology).	PUSH: seed/users.ts
1.8	Layout shell	Persistent sidebar (240px) + top header (66px) as server components. Sidebar reads session for unit name and user info. Active route highlighting.	PUSH: /components/layout/Sidebar.tsx + Header.tsx
1.9	Dashboard page	Build /app/dashboard/page.tsx. Hero card (bench workspace), quick access cards (SOP/Tests/Job Aids), bench focus chips with filter logic.	PUSH: dashboard renders correctly for Adaeze
1.10	Dashboard: Unit SOPs panel	Fetch top 3 approved SOPs for user's unit from DB. Render with SOP code, version, status badge.	PUSH: dashboard shows real SOP rows (even if SOP content is empty)
1.11	Dashboard: Tests To Check panel	Fetch top 4 tests for user's primary bench. Show name, specimen, container, TAT.	PUSH: tests panel shows Full Blood Count, ESR, Reticulocyte Count, PLT
1.12	Dashboard: Quick Job Aids	Fetch 2 job aids for user's primary bench. Show type badge and title.	PUSH: dashboard complete — all panels populated
1.13	Bench context switching	Implement bench context chip in header. Clicking switches active bench and re-scopes all dashboard panels.	PUSH: switching bench re-renders dashboard with scoped data
1.14	Search (global, scoped)	Search bar in header queries SOPs + tests + job aids within the user's unit only. Show typeahead results.	PUSH: search returns unit-scoped results
1.15	Deploy Phase 1	Deploy to Vercel (or Render). Smoke test all dashboard flows with each test user.	PUSH: Phase 1 live on staging URL

 
Phase 2
SOP Module
SOP library, detail view, create/submit flow, version management, and read acknowledgements.

Goal: A supervisor can create, submit, and approve an SOP. Staff receive a notification and acknowledge reading it. The SOP detail page renders the full structured content with a working ToC sidebar and the AI Ask button.
Phase 2 Steps
Step	Task	What to build	Commit / push point
2.1	SOP schema additions	Add to SOP model: body sections (JSON — Purpose, Scope, Responsibilities, Materials, Procedure, QC, Documentation, References), relatedJobAids[], relatedTests[], status enum (DRAFT/REVIEW/APPROVED/ARCHIVED), versionHistory[].	PUSH: migration + updated seed with full SOP body for FBC SOP-HEM-001
2.2	SOP Library page (/sops)	Search panel (main search + 3 filter chips + stats), featured SOP card, 2-column card grid. Card component: title, code/version, status badge, 3 metadata boxes, footer.	PUSH: /sops renders with real hematology SOPs
2.3	SOP search & filtering	Wire search input to DB query. Implement filter chips: Department, Status, Equipment. Stats counters (Total, Approved, Under Review) update dynamically.	PUSH: filters + search working
2.4	SOP Detail page (/sops/[slug])	Left ToC panel, version warning banner, metadata row (Version, Effective Date, Review Date, Dept), procedure panel with 3 CTAs, numbered sections, right Job Aids panel.	PUSH: FBC SOP detail fully readable with working ToC scroll
2.5	Read acknowledgement flow	"Confirm I have read this version" button on SOP detail. Creates SOPRead record in DB with userId, sopId, version, timestamp. Shows confirmation.	PUSH: reading SOP-HEM-001 creates acknowledgement record
2.6	Version history view	Accordion or tab on SOP detail showing all past versions with author, date, and change summary. Old versions are read-only.	PUSH: version history visible on SOP detail
2.7	Create SOP page (/sops/new)	Left column: file upload drop zone (PDF/DOCX), 10-field metadata grid, 8-section structured editor. Right column: submission flow list (5 steps) + pre-submit checklist.	PUSH: form saves draft SOP to DB correctly
2.8	File import: PDF/DOCX parsing	On file upload to /sops/new, parse document with pdf-parse / mammoth to extract text. Pre-fill metadata fields where identifiable. Store original file in Supabase Storage.	PUSH: uploading a sample SOP PDF pre-fills title and SOP code fields
2.9	Submit for review flow	"Submit for approval" button changes SOP status to REVIEW. Assigns reviewer based on unit config. Creates Notification record for reviewer.	PUSH: submitted SOP shows "Under Review" badge in library
2.10	Approval flow (supervisor)	Reviewer sees a "Pending review" notification. Opens SOP, sees "Approve" or "Return with comments" actions. Approve changes status to APPROVED and sets effective date.	PUSH: SOP moves from REVIEW to APPROVED, badge updates
2.11	Staff notification on approval	On approval, create Notification records for all staff in the relevant benches. Notifications list shows "SOP-HEM-001 v4.3 approved — acknowledgement required".	PUSH: staff see notification in /notifications
2.12	Deploy Phase 2	Full SOP lifecycle smoke test. Test with 3 SOPs across 2 units. Verify bench scoping (Microbiology staff should not see Hematology SOPs).	PUSH: Phase 2 live on staging

 
Phase 3
Tests, Job Aids & AI Assistant
Full test catalogue, job aid reader, and the AI assistant backed by the unit knowledge base.

Goal: Staff can browse the full test catalogue (all 257 tests), open a test record with specimen/TAT/reference range details, read job aids (checklists and step cards with interactive checkboxes), and use the AI assistant to ask procedural questions that reference the unit's actual SOP content.
Phase 3 Steps
Step	Task	What to build	Commit / push point
3.1	Test schema extensions	Add to Test model: referenceRanges (JSON by demographic), specimenVolume, storageConditions, analyzerEquipment, governingSOP (relation), QCrequirements.	PUSH: migration + updated test seeds with full data for FBC, PT/INR
3.2	Tests Library page (/tests)	Card grid similar to SOP library. Each test card: test name, specimen type + container, TAT badge, governing SOP link.	PUSH: /tests shows all unit-scoped tests
3.3	Test Detail page (/tests/[slug])	Full test record: specimen requirements (type, volume, container, transport), TAT (routine + urgent), reference ranges table, related SOP link, related job aid link.	PUSH: FBC test detail fully populated with real values
3.4	Job Aids schema	JobAid model: title, type (CHECKLIST | STEPS | REFERENCE_CARD), content (JSON array of items), linkedSOP[], linkedTest[], benchAssignment[].	PUSH: migration + seed 6 real job aids (Sysmex XN-350 startup, Emergency O-Neg release, Stago STA-R startup, UMCS collection, Gram stain procedure, Pap smear preparation)
3.5	Job Aids Library page (/job-aids)	Card grid with type badge. Filter by type.	PUSH: /job-aids shows seeded job aids scoped to logged-in user's benches
3.6	Job Aid Detail: Checklist type	Render checklist items as interactive checkboxes. Progress bar. Session-only state (not persisted — checklists reset each visit). Print button.	PUSH: Sysmex XN-350 startup checklist interactive
3.7	Job Aid Detail: Steps type	Numbered steps with optional image slots. Current step highlight. Mark step complete. Linear progression.	PUSH: Emergency O-Neg release step card works
3.8	AI Assistant: infrastructure	Set up Anthropic (or OpenAI) SDK route at /api/ai/chat. System prompt: you are a clinical lab assistant for [Unit Name]. You have access to the following SOPs and tests: [inject unit knowledge]. Cite source document in every answer.	PUSH: /api/ai/chat returns accurate FBC specimen type when asked
3.9	AI Assistant UI (/ai-assistant)	Chat interface: input box, message thread, source citation chips, suggested prompts ("What specimen for PT/INR?", "Walk me through Sysmex startup"). System context injects user's unit SOPs and test data.	PUSH: full chat UI working with real answers
3.10	AI "Ask about this SOP" integration	On SOP detail page: "Ask AI" button opens AI assistant pre-loaded with that specific SOP as context. AI answers questions about the current document.	PUSH: from FBC SOP detail, clicking "Ask AI" and asking "what QC frequency is required?" returns the correct answer from the document body
3.11	Deploy Phase 3	Full test catalogue + job aids + AI smoke test across all 5 units.	PUSH: Phase 3 live on staging

 
Phase 4
Admin, Compliance & Training
Audit trail, roles & permissions, user management, and the training hub.

Goal: A supervisor can export a full audit trail of SOP reads and acknowledgements. An admin can add/remove users and assign bench roles. A new staff member can be enrolled in an onboarding training track.
Phase 4 Steps
Step	Task	What to build	Commit / push point
4.1	Activity log schema	AuditLog model: userId, action (ENUM: READ_SOP, ACKNOWLEDGED_SOP, CREATED_SOP, SUBMITTED_SOP, APPROVED_SOP, USED_AI, OPENED_TEST, OPENED_JOB_AID), entityId, entityType, timestamp, metadata (JSON).	PUSH: all prior actions now log to AuditLog
4.2	Activity Log page (/activity-log)	Personal view: chronological list of user's own actions. Filterable by action type and date range.	PUSH: /activity-log shows user's own recent activity
4.3	Audit Trail page (/audit-trail)	Supervisor view: filter by user, unit, document, date range. Export as CSV. Table shows: User, Action, Document, Timestamp.	PUSH: supervisor can export read acknowledgements for SOP-HEM-001 as CSV
4.4	Roles & Permissions page	List all roles (STAFF, AUTHOR, REVIEWER, SUPERVISOR, ADMIN). Show permissions per role. Supervisor can change a user's role.	PUSH: /roles-permissions renders with role matrix
4.5	User Management page (/users)	Table of all users in supervisor's unit. Add new user (email invite). Edit bench assignments. Deactivate user. Change role.	PUSH: supervisor can add a new staff member and assign them to Coagulation bench
4.6	Units page (/units)	For ADMIN only: list all institutional units. Create a new unit. Edit unit name and SOP library assignment.	PUSH: /units and /units/[slug] accessible to admin role only
4.7	Settings page (/settings)	User account: name, email, password change, notification preferences (email digest for SOP updates), bench display preferences.	PUSH: user can update notification preferences
4.8	Notifications page (/notifications)	Full notification inbox: all alert types (document updates, review requests, training due, audit flags). Mark as read. Filter by type.	PUSH: /notifications shows unread badge count in sidebar
4.9	Training Hub: schema	Training model: title, unit, type (ONBOARDING | REFRESHER | POLICY_UPDATE), modules (JSON array), enrollments[], completions[].	PUSH: migration + seed 3 training tracks: Hematology New Staff Orientation, Sysmex XN-350 Operator Refresher, WHO Blood Transfusion Safety Update
4.10	Training Hub: browse + detail	List view at /training. Detail at /training/[id] shows modules as a progress-trackable list. Mark module complete.	PUSH: /training working with all 3 seeded tracks
4.11	Full regression test	End-to-end flow: new staff created → enrolled in onboarding training → SOP published → staff notified → staff acknowledges → supervisor exports audit → audit shows acknowledgement.	PUSH: Phase 4 live on staging
4.12	Production deployment	Environment variables, DB backup schedule, Vercel prod deployment, custom domain config, error monitoring (Sentry).	PUSH: knowlab.ng (or subdomain) live

 
Content Seeding Reference
Use these exact bench names when seeding the database. They must match the design exactly.
Hematology & Blood Transfusion
•	Hematology Routine  (18 tests — FBC, ESR, Reticulocyte, PBF, Sickling, G6PD, Osmotic fragility, Hb estimation, PCV, TWBC, DWBC, PLT, Heinz body, Malaria film, Malaria RDT, Microfilaria, Hb electrophoresis, HPLC)
•	Coagulation  (15 tests — PT/INR, APTT, Thrombin time, Fibrinogen, D-Dimer, Bleeding time, Clotting time, Factor VIII, Factor IX, VWF:Ag, Platelet aggregation, Lupus anticoagulant, Antithrombin III, Protein C, Protein S)
•	Blood Bank / Transfusion  (14 tests — ABO grouping, Rh typing, IS crossmatch, AHG crossmatch, Antibody screening, Antibody ID, DAT, IAT, Elution, Autologous crossmatch, Neonatal grouping, Exchange transfusion compatibility, Blood component issue, HbS donor screen)
•	Morphology / Film Reading  (9 tests — BMA reporting, BMB histology, MAHA film, Leukaemia blast film, Malaria species ID, Trypanosome search, LE cell prep, Sickle cell film confirmation, Neonatal blood film)
Chemical Pathology
•	Routine Chemistry  (45 tests — U&E, LFTs, glucose, HbA1c, lipid profile, calcium, magnesium, phosphate, amylase, lipase, LDH, CRP, iron studies, folate, B12, troponin, CK-MB, BNP, RF, ASOT, lactate)
•	Endocrinology / Hormones  (25 tests — TSH, FT4, FT3, T3, T4, Anti-TPO, Anti-Tg, Thyroglobulin, Prolactin, FSH, LH, E2, Progesterone, Testosterone, DHEAS, Cortisol, ACTH, GH, IGF-1, Insulin, C-Peptide, PTH, Aldosterone, Renin, Beta-hCG)
•	Tumour Markers  (10 tests — PSA total, Free PSA, AFP, CEA, CA-125, CA 19-9, CA 15-3, CA 72-4, Beta-hCG, LDH oncology)
•	Urine Chemistry  (15 tests — dipstick, protein quantitative, 24 hr protein, PCR, microalbumin, creatinine, sodium, potassium, urea, glucose, osmolality, Bence-Jones protein, uric acid, calcium, qualitative protein SSA)
•	Toxicology / TDM  (12 tests — Phenytoin, Carbamazepine, Valproate, Phenobarbitone, Digoxin, Gentamicin, Vancomycin, Paracetamol, Salicylate, Ethanol, Lead, Lithium)
Medical Microbiology
•	Bacteriology  (20 tests — Blood culture, UMCS, HVS, Wound swab, Sputum C&S, CSF C&S, Ear, Eye, Throat, Nasal/MRSA, Stool culture, Pleural fluid, Ascitic fluid, Cervical, Urethral, Synovial fluid, Gram stain, Acridine orange, Kirby-Bauer, MIC)
•	TB / AFB  (10 tests — Sputum ZN x3, Auramine-rhodamine, Sputum MGIT/LJ culture, GeneXpert MTB/RIF, DST, LPA/Hain, ADA, Urine ZN, Stool AFB, Tissue ZN)
•	Serology  (23 tests — HBsAg, Anti-HBs, HBeAg, Anti-HBc IgM, Anti-HCV, HCV RNA PCR, HIV rapid (Determine+Unigold), HIV ELISA 4th gen, CD4 count, HIV viral load, VDRL, RPR, TPHA, Widal, Brucella agglutination, CrAg, ASOT, TORCH, H. pylori stool, H. pylori IgG, Dengue NS1+IgM/IgG, Lassa IgG/IgM, Typhidot)
•	Parasitology  (13 tests — Stool OCP, Formol-ether concentration, Kato-Katz, Malaria RDT, Malaria thick/thin film, Urine for Schistosoma, Skin snip Onchocerca, Microfilaria night blood, Trichomonas vaginalis wet prep, Urethral discharge wet prep, Sellotape/pinworm, Leishmania smear, Lymph node Trypanosomes)
•	Mycology  (10 tests — KOH prep, India ink, Fungal culture SDA, CrAg lateral flow, Candida species ID, Aspergillus galactomannan, Beta-D-glucan, Wood's lamp examination, Tinea capitis culture, Antifungal susceptibility)
Histopathology & Cytology
•	Histology / Tissue Processing  (11 tests — H&E routine, Incisional biopsy, Excisional biopsy, Core needle biopsy, TURP/TURBT, Endometrial biopsy/curettings, Cone/LLETZ, Placental examination, Frozen section, Autopsy, Sentinel lymph node)
•	Special Stains  (12 stains — PAS, Masson's trichrome, Congo red, ZN on tissue, Grocott GMS, Giemsa, Alcian blue, Reticulin/Gordon-Sweet, Elastic Van Gieson, Prussian Blue, Oil Red O, PAS-D)
•	Cytology  (14 tests — Pap smear conventional, LBC/ThinPrep, FNAC thyroid, FNAC breast, FNAC lymph node, FNAC soft tissue, Sputum cytology, Pleural fluid cytology, Ascitic fluid cytology, CSF cytology, Urine cytology, Peritoneal washings, Nipple discharge, Synovial fluid cytology)
•	Immunohistochemistry  (17 markers — ER, PR, HER2, Ki-67, TTF-1, CK7/CK20, PSA tissue, CD20, CD3, CD30, CD68, S100, Melan-A, AFP tissue, PLAP, p53, p16)
Immunology
•	Autoimmune Serology  (15 tests — ANA IF, anti-dsDNA, ENA panel (anti-Sm, anti-Ro/SSA, anti-La/SSB, anti-Scl-70, anti-Jo-1), anti-CCP, RF IgM quantitative, ANCA IF, anti-PR3, anti-MPO, anti-GBM, AMA, ASMA, anti-LKM1, anticardiolipin IgG/IgM, Beta-2 GP1, Anti-TPO)
•	Immunoglobulins & Complement  (12 tests — IgG, IgA, IgM, IgE total, SPEP, IFE, Free light chains, C3, C4, CH50, Beta-2 microglobulin, Cryoglobulins)

Recommended Tech Stack
•	Framework: Next.js 14 (App Router) — server components for DB queries, client components for interactive UI
•	Database: PostgreSQL on Supabase — managed postgres, file storage for SOP PDFs, built-in auth helpers
•	ORM: Prisma — type-safe schema, easy migrations, seed scripts
•	Styling: Tailwind CSS + Shadcn/ui — pre-built accessible components (tables, badges, dialogs, sheets)
•	Auth: NextAuth.js v5 — credentials provider, session with JWT, role-based middleware
•	AI: Anthropic Claude API — claude-sonnet-4-20250514 for AI assistant. Inject unit SOP and test data as system context
•	File parsing: pdf-parse (PDF), mammoth (DOCX) — for SOP import on create page
•	Deployment: Vercel (frontend + API routes), Supabase (DB + Storage)
•	Monitoring: Sentry (error tracking), Vercel Analytics (usage)

Instructions for AI Agent Execution
When feeding this plan to Gemini CLI, Claude Code, or Codex, use the following protocol:
1.	Feed one step at a time. Do not feed the entire phase at once.
2.	At the end of each step, explicitly instruct: "Verify this compiles and the specific test case listed in the push point passes. Then push to branch phase-{N}/step-{N.N}."
3.	After every 3 steps, instruct the agent to run the full test suite and smoke test from the login screen.
4.	Use this exact prompt prefix for each step: "We are building Knowlab, a clinical knowledge platform for Nigerian teaching hospitals. The tech stack is Next.js 14 / Prisma / PostgreSQL / Tailwind. We are on Phase [X], Step [X.X]. The goal is: [paste step goal]. The specific deliverable is: [paste build column]. Do not proceed beyond this step. When done, confirm the push point: [paste push point]."
5.	Keep the full PRD document and this build plan open in a separate context window and reference them when the agent asks for clarification on data models or UI specifics.
Seed data note: The exact test names, specimen types, container types, and TAT values are in the Interactive Test Reference document. Use those verbatim in seed files — they are clinically accurate.

Knowlab Build Plan v1.0  —  4 Phases  |  257 tests  |  22 benches  |  5 units
