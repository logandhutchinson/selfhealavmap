Self-Healing Map (SHM) internal operations console for the Atlas L5 Autonomy Platform.

A clickable, role-aware prototype UI that lets Mapping, Autonomy, Safety, and Fleet Ops teams review detected map mismatches, inspect proposed micro-patches with evidence bundles, advance patches through a staged deployment pipeline, and execute rollbacks or kill switches — all with a full immutable audit trail.

Overview
Autonomous vehicles depend on centimeter-accurate HD maps. When the physical world changes — lane re-striping, construction, new turn restrictions — the onboard map lags behind, causing conservative driving behavior, remote assist escalations, and rider complaints.

The Self-Healing Map Console closes that gap. It surfaces statistically-validated mismatch clusters detected from fleet telemetry, proposes micro-patches, and lets human operators review evidence, promote patches through a safety-gated pipeline (Candidate → Shadow → Silent → Active), and monitor fleet distribution — all with role-based access control and zero-trust auditability.

Features
8 Fully Routed Pages
Page	Description
Login / Role Switch	Role selector for demo: Mapping On-call, Autonomy Engineer, Safety Engineer, Fleet Ops Manager, Admin
Dashboard	KPI tiles (trips, mismatch rate, TTM, remote assists), Launch Zone cards, Patch Pipeline funnel
Mismatch Feed	Filterable work queue of detected clusters with confidence scores and evidence completeness
Patch Detail	5-tab deep-dive: Summary, Map Delta Preview, Evidence Items, Audit Log, Safety Gates
Distribution & Fleet	Patch distribution table, staged rollout controls (10/25/50/100%), fleet success rates
Kill Switch & Rollback	Global SHM kill switch (typed-phrase confirmation), geo-fence kills, manual rollbacks
Thresholds & Policy	Evidence thresholds, patch type allowlist, TTL defaults — role-gated editing
Observability	TTM trends, interventions pre/post patch, conservative mode time, patch clutter index, alerts
Core Interactions
Stage promotions update patch state, write to the audit log, and reflect in the Distribution page
Rollback moves patches to Rolled Back state with a new audit entry
Global kill switch requires typing DISABLE SHM and triggers a persistent fleet-wide banner
RBAC disables or hides action buttons based on the active role
Evidence snapshots open in a modal with vehicle/sensor metadata
Sample Data
Pre-loaded with three launch zones and realistic patch examples:

Zone 19 – Airport Loop: Terminal 4 Merge lane shift ~1.2m (N=10, M=40, 3-day spread, Shadow stage)
Zone 19 – Departures Curve: Turn restriction added (N=15, M=52, 5-day spread, Silent stage)
Zone 12 – Downtown Core: Construction churn with low-confidence candidates
Zone 7 – Highway Corridor: Lane re-striping with medium confidence
Tech Stack
React 18 + TypeScript
Vite — fast dev server and bundler
Tailwind CSS — dark ops-console design system (semantic tokens throughout)
shadcn/ui — accessible component primitives
Recharts — observability charts
React Router v6 — multi-page routing
React Context — role state, patch state, kill switch state
Design System
Dark "mission control" aesthetic — deep navy/slate backgrounds, electric blue primary actions, amber warnings, red for safety-critical controls. Typography pairs Inter (UI) with JetBrains Mono (data/IDs). All colors use HSL semantic tokens defined in index.css and tailwind.config.ts.

Stage badges use a distinct color language:

Stage	Color
Candidate	Blue
Shadow	Purple
Silent	Amber
Active	Green
Rolled Back	Red
Expired	Gray
RBAC Model
Role	Permissions
Mapping On-call	create_draft, mark_duplicate, request_evidence, promote_shadow, propose_silent
Autonomy Engineer	create_draft, request_evidence, promote_shadow
Safety Engineer	block, approve, rollback, change_thresholds, create_safety_note, promote_shadow, promote_silent
Fleet Ops Manager	view_distribution, rollback
Admin	All of the above + promote_active, kill_switch
Developer Notes
Each page includes collapsible Developer Notes panels documenting:

Intended REST API endpoints
Data model schemas (patch schema, cluster model, evidence bundle)
Stage state machine rules
Permission checks per action
Signature verification requirements for patch artifacts
These are visible in the UI and intended for engineering/design handoff.

Getting Started

# Clone and install
git clone <repo-url>
cd atlas-shm-console
npm install

# Start dev server
npm run dev
Navigate to http://localhost:5173, select a role, and explore the console.

Project Status
This is a prototype UI with deterministic mock data — no backend is required. It is intended for stakeholder review, design iteration, and API contract definition prior to production implementation.
