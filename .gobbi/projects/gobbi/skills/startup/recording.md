# Startup Recording

This document defines startup's capture, synthesis, rerun, resume, and startup-close promotion procedure.
Read it before creating any staged draft, building the manifest, promoting the baseline, resuming an
interrupted run, or reviewing an existing baseline.

Startup follows the shared memory rules **by reference** — area resolution, per-type templates, the
frontmatter allowlist and staging-field strip, supersession, and archival are owned by `memory/rules.md`
and `memory/templates/`; the shared routing and the standing post-promotion guards are owned by
`wrap-up/SKILL.md`. Startup does not copy those rules; it runs its own distinct startup-close procedure
that obeys them.

## Contents

- [1. Four-layer capture](#1-four-layer-capture)
- [2. Answer-ledger schema](#2-answer-ledger-schema)
- [3. Startup session shape](#3-startup-session-shape)
- [4. Topic → durable-output effects](#4-topic--durable-output-effects)
- [5. Authoritative staging → destination contract](#5-authoritative-staging--destination-contract)
- [6. During-talk capture & topic-close synthesis](#6-during-talk-capture--topic-close-synthesis)
- [7. Manifest & contradiction pass](#7-manifest--contradiction-pass)
- [8. Root README — the living index](#8-root-readme--the-living-index)
- [9. Startup-close promotion (the honest "atomic")](#9-startup-close-promotion-the-honest-atomic)
- [10. Frontmatter & raw-vs-synthesized](#10-frontmatter--raw-vs-synthesized)
- [11. Re-run classification (5 states)](#11-re-run-classification-5-states)
- [12. Interruption / resume classifier (4 states)](#12-interruption--resume-classifier-4-states)
- [13. Standalone entry / exit](#13-standalone-entry--exit)
- [14. Privacy / retention](#14-privacy--retention)

---

## 1. Four-layer capture

Keep four layers separate. Only the last is durable project reference.

```
raw conversation audit  →  structured answer ledger  →  synthesized staged docs  →  user-approved promoted reference
```

| Layer | Purpose | Durable? |
|---|---|---|
| **Raw discussion log** | Verbatim or near-verbatim audit of the manager–user conversation. | No. Never promoted. |
| **Answer ledger** | Structured interpretation with evidence, status, decisions, affected outputs, and follow-ups visible (schema §2). | No. Never promoted. |
| **Synthesized staged docs** | Atomic typed drafts, each stamped from its matching memory template, in session staging. | No. Session-local until promotion. |
| **Promoted reference** | The user-approved typed records and living indexes written by startup-close promotion (§9). | Yes. |

**Why this makes abandon SAFE:** promotion (§9) is the ONLY durable write. Everything before it is
session-local under `sessions/` (gitignored). A run abandoned at any point before promotion leaves ZERO
partial durable state — no memory cleanup is needed. Only a mid-promotion failure needs the recovery path
(§9 step 5).

## 2. Answer-ledger schema

Write one ledger row per answer. The ledger is startup-owned session evidence; because `sessions/` is
outside the memory frontmatter standard, it uses this startup-owned schema, not memory frontmatter.

| Field | Meaning |
|---|---|
| **Topic ID** | Stable Level-1/Level-2 node (e.g. `7.4 Data & state`). |
| **Question** | The exact question asked. |
| **Answer** | The user's answer, summarized without changing its meaning. |
| **Status** | `confirmed` / `assumption` / `open` / `contradicted`. |
| **Evidence** | User authority / repo path / observed behavior / named external source. |
| **Decision** | The binding choice made by the answer, if any. |
| **Affected docs** | Candidate root-index / design / decision / feature / rule / mistake / backlog / reference / scenario / checklist / learning effects. |
| **Follow-up** | The next probe, evidence, owner, or resolution method needed. |

**Answer status is not branch closure.** An answer's `Status` records evidence strength. A Level-2 branch
closes only as `confirmed`, `proven-irrelevant` (with a recorded reason), or `recorded-open` (with an
owner and resolution method). At each confirmed Level-1 close, append a checkpoint marker to the ledger
holding the topic number and confirmation timestamp.

## 3. Startup session shape

`startup` is NOT a productive loop — it has no `{N}-` loop dir and is never smuggled into the fixed
`1-ideation … 5-wrap-up` set. It uses its own unnumbered `startup/` surface:

```
sessions/{date}-{session-id}/startup/
├── working/
│   ├── discussion-log.md         # raw audit
│   ├── answer-ledger.md          # structured ledger (schema §2) — carries the resumable checkpoint markers
│   └── promotion-manifest.md     # per-file CRUD + destination + supersede/archive plan (§7)
├── staging/
│   ├── decisions/                # decision records AND mistake-candidates (frontmatter `mistake-candidate: true`)
│   ├── design/
│   ├── references/
│   ├── learnings/                # project-scoped transferable techniques
│   ├── rules/                    # binding-rule candidates (explicit user confirmation required to promote)
│   ├── backlogs/{feature,project}/
│   └── features/{feature-name}/{type}/   # feature-scoped drafts, one subtree per ratified feature (multi-feature)
└── outputs/
    └── startup-summary.md        # manifest + unresolved questions + promoted paths + completion marker + rerun triggers
```

`working/` and `staging/` are gitignored session surfaces. The raw log, ledger, manifest, staged drafts,
and startup summary are never promoted as records. A later same-session Wrap-up promotion inventory
EXCLUDES the entire `startup/` tree, because startup has already promoted its approved set (§9 step 5).

**Staging tree covers every type the topic map produces.** The `staging/learnings/` path and the full
`staging/features/{feature-name}/{type}/` subtree exist so the staging sources match the topic → durable
output map in §4 one-for-one — every durable type §4 can produce has a staging source, and the staging
tree names no source without a durable destination. In particular:

- A **transferable technique** (Topic 11) is a `learnings/` record: project-scoped → `staging/learnings/`;
  feature-scoped → `staging/features/{f}/learnings/`.
- A **skill-candidate note** (Topic 11 / a convention or idiom that may warrant a project skill) is an
  atomic **decision** record → `staging/decisions/{slug}.md`. Startup owns no `staging/notes/` path and
  never stamps a skill; the note is handed to a later phase and the skill-authoring owner.

## 4. Topic → durable-output effects

Many-to-many: the tree structures the talk; the memory types structure the durable record. Every typed
destination carries the required `{area}` segment resolved by the area rule (§5); startup NEVER invents a
free-form area. Paths are shown without the project prefix. The staging source each row promotes through
is §5.

| Topic | Durable output(s) | Granularity rule |
|---|---|---|
| 1. Existing Reality & Intent | `README.md` (lifecycle/current-state + license/governance summary); `references/{area}/{slug}.md`; `decisions/{area}/{date}-{slug}.md` (binding authority/license/baseline choice) | One reference per source insight; one decision per binding choice — no bundled "startup context" decision. The license decision is atomic |
| 2. Vision, Problem & Success | `README.md`; `design/{area}/{slug}.md`; `decisions/{area}/{date}-{slug}.md` | One design doc when the model needs detail; one decision per accepted success metric |
| 3. Users, Jobs, Alternatives & Value | `README.md`; `design/{area}/{slug}.md`; `references/{area}/{slug}.md` | One design doc per model that constrains product design; one reference per insight (not per link) |
| 4. Scope, Boundaries & Non-goals | `README.md`; `decisions/{area}/{date}-{slug}.md`; `backlogs/{area}/{slug}.md` | Each consequential inclusion/exclusion = one decision; each deferred capability = one project backlog with a pick-up trigger |
| 5. Features & User Journeys | `features/{f}/README.md`; `features/{f}/design/…`; `features/{f}/scenarios/…`; `features/{f}/backlogs/…`; project `backlogs/…` | A feature dir ONLY for a user-ratified durable value-feature. Multi-feature: each feature-scoped staged doc carries a `feature: {f}` field naming its target dir (§9) |
| 6. Experience & Product Design | `design/…` or `features/{f}/design/…`; `decisions/…`; `references/…`; feature `scenarios/…` | One design per coherent experience topic; one decision per direction; scenarios for accessibility/trust/failure |
| 7. Architecture, System Context & Data | project or feature `design/…`; project or feature `decisions/…`; `references/…` | Split context/blocks/runtime/deployment/data ONLY when each is independently useful; one decision per hard choice — never an ADR-bundle architecture doc |
| 8. Tech Stack, Delivery & Operations | `decisions/…` (stack); project/feature `design/…` (delivery/ops); `references/…`; feature `scenarios/…` (failure/rollback) | Stack choice = decision; delivery/ops = design; dependency evidence = one reference per insight |
| 9. Conventions, Constraints & Quality bar | project/feature `rules/{area}/{slug}.md`; `decisions/…`; project/feature `design/…`; feature `scenarios/`/`checklists/` | One binding invariant per rule, explicit user confirmation; preferences stay in design/decisions |
| 10. Risks, Unknowns & Roadmap | `README.md` (now/next/later + top risks); `decisions/…`; `backlogs/…`; feature `backlogs/`; project/feature `design/…` | One accepted risk / sequencing choice per decision; one deferred item per backlog. No loop-written project `plans/` — roadmap = README summary + atomic backlogs |
| 11. Idioms, Rules & Recurring Mistakes | project/feature `rules/{area}/{slug}.md`; project/feature `mistakes/{trap-class}/{slug}.md`; project/feature `learnings/{area}/{slug}.md`; `references/…` | One mandatory invariant per rule; one recurring trap per mistake; one transferable technique per learning; a skill-candidate convention = one decision record. Mistakes stage via `staging/decisions/{slug}.md` + `mistake-candidate: true` (§5), NOT a `staging/mistakes/` dir |

**Atomicity:** one record = one concept. The **root README is a living index, not a typed memory doc**
(§8).

## 5. Authoritative staging → destination contract

startup's staging conforms to the SAME representation the shared Wrap-up routing inputs expect, so the
shared routing rules apply per file. Every durable destination below is relative to
`.gobbi/projects/{project-name}/`. Every by-area destination receives an allowed `{area}` via the
area-resolution order at the end of this section.

| Staging source | Durable destination | Conditions |
|---|---|---|
| `staging/decisions/{slug}.md` | `decisions/{area}/{date}-{slug}.md` | Project-scoped atomic decision (includes a skill-candidate note). |
| `staging/decisions/{slug}.md` with `mistake-candidate: true` | `skills/{skill}/mistakes.md` as one owned `## ` section, OR `mistakes/{area}/{slug}.md` | Always-Ask ownership route. A skill-owned trap is only PROPOSED for the owning surface; startup creates/edits no skill. Strip the routing flag on promotion. |
| `staging/design/{slug}.md` | `design/{area}/{slug}.md` | Project-scoped design. |
| `staging/references/{slug}.md` | `references/{area}/{slug}.md` | Project-scoped extracted insight; a bare external link is not enough. |
| `staging/learnings/{slug}.md` | `learnings/{area}/{slug}.md` | Project-scoped transferable technique. |
| `staging/rules/{slug}.md` | `rules/{area}/{slug}.md` | Project rule. Promotion requires explicit user confirmation of invariant, scope, reason, and exception. |
| `staging/backlogs/project/{slug}.md` | `backlogs/{area}/{slug}.md` | Project deferral with actionable work + a pick-up trigger. |
| `staging/backlogs/feature/{slug}.md` | `features/{f}/backlogs/{area}/{slug}.md` | The staged file carries `feature: {f}`. |
| `staging/features/{f}/decisions/{slug}.md` | `features/{f}/decisions/{area}/{date}-{slug}.md` | Feature decision; the staged file carries `feature: {f}`. |
| `staging/features/{f}/decisions/{slug}.md` with `mistake-candidate: true` | `skills/{skill}/mistakes.md` section, OR `features/{f}/mistakes/{area}/{slug}.md`, OR project `mistakes/{area}/{slug}.md` | Always-Ask ownership + scope route. Strip the routing flag. |
| `staging/features/{f}/design/{slug}.md` | `features/{f}/design/{area}/{slug}.md` | Feature design. |
| `staging/features/{f}/references/{slug}.md` | `features/{f}/references/{area}/{slug}.md` | Feature reference insight. |
| `staging/features/{f}/scenarios/{slug}.md` | `features/{f}/scenarios/{area}/{slug}.md` | Feature scenario. |
| `staging/features/{f}/checklists/{slug}.md` | `features/{f}/checklists/{area}/{slug}.md` | Feature checklist. |
| `staging/features/{f}/rules/{slug}.md` | `features/{f}/rules/{area}/{slug}.md` | Feature rule; explicit user confirmation. |
| `staging/features/{f}/learnings/{slug}.md` | `features/{f}/learnings/{area}/{slug}.md` | Feature-scoped transferable technique. |
| Ratified feature identity, synthesized from confirmed answers | `features/{f}/README.md` | A living index, updated LAST. The feature is a durable value-feature, not a task, sprint, epic, subsystem, mechanism, or speculative idea. |
| Root identity, synthesized from confirmed answers | `README.md` | A frontmatter-less living index (§8), created/updated LAST. |

**Multi-feature routing.** Each feature-scoped staging file carries a per-file `feature: {f}` field.
Startup uses that per-file field for routing — NOT a session-global `session.json.feature`. On promotion,
`feature` stays the required durable base field for a feature-scoped record; it is not stripped.
Startup-only routing fields and `area:` ARE stripped.

**Area-resolution order** (for every by-area record):
1. Use an explicit staging `area:` only when it is allowed for the record's type.
2. Otherwise apply that type's fixed, priority-ordered tag→area mapping and take the first match. Normalize
   a feature-directory input before matching.
3. If no area matches, HALT routing and ask the user to select an existing area or approve a vocabulary
   change. Never create a fallback area.

## 6. During-talk capture & topic-close synthesis

**During the talk**, for every answer:
1. Append the raw exchange to `working/discussion-log.md`.
2. Append one structured row to `working/answer-ledger.md`.
3. Record candidate output effects — write only to session working/staging, never durable memory.
4. If the answer corrects an earlier one, mark the earlier ledger row `contradicted` and identify every
   affected staged draft.

**At each Level-1 close:**
1. Present confirmed facts / assumptions / open questions / contradictions / decisions / proposed doc
   effects (the checkpoint).
2. Ask the user whether the summary is accurate.
3. On correction, update the ledger FIRST, then regenerate the affected staged drafts from the ledger
   rather than patching around stale synthesis.
4. On confirmation, update or create the atomic staged drafts and append the Level-1 checkpoint marker.

Do not promote at topic close. All capture and synthesis stays session-local until the startup-close gate.

## 7. Manifest & contradiction pass

After every required Level-2 branch closes:

1. **Build the promotion manifest** (`working/promotion-manifest.md`) — one row per candidate output:

   | Field | Required content |
   |---|---|
   | Operation | `create` / `living-index update` / `supersede` / `no change` / `defer` |
   | Type | Durable memory type, or `living index` for the root/feature READMEs |
   | Scope | Project or feature |
   | Area | Resolved allowed area for a typed record |
   | Feature | Per-file target feature for feature scope |
   | Slug | Stable atomic-concept slug |
   | Source topics | The ledger branches supporting the output |
   | Destination | The exact durable path |
   | Supersession plan | For `supersede`: old path, new record's `supersedes`, old record's status-flip + `superseded_by`, and the exact archive-move path |

2. **Cross-topic contradiction pass** — check at least: vision vs scope; users vs critical journeys;
   non-goals vs roadmap; quality vs stack; data promises vs architecture; risk mitigations vs
   schedule/capacity; binding rules vs actual codebase examples. Re-open the contradicting branch and
   resolve it in the ledger; do not hide a conflict in synthesis.

3. **Final jargon-free challenge** over purpose, evidence, alternatives, risks, cost, time, and success.
   This challenges the current baseline; it is not a new architecture-design phase.

4. **Stamp every typed staging file** from its matching `memory/templates/{type}.md`. Free-form typed
   drafts do not enter promotion.

## 8. Root README — the living index

The root `README.md` is a **frontmatter-less living index, NOT a typed memory doc**: no memory frontmatter,
and no project-README memory template exists — do not fabricate one. Keep these sections:

1. Project statement.
2. Problem & first target users.
3. Value & success summary.
4. Scope & non-goals.
5. Durable feature index.
6. Architecture & design pointers.
7. Quality & constraint summary.
8. License / governance summary.
9. Now / next / later.
10. Known risks & open questions.
11. Where detailed memory lives.

Keep detail in the typed records. The index summarizes and points; it never duplicates the records it
indexes.

## 9. Startup-close promotion (the honest "atomic")

`startup` does NOT invoke Wrap-up. Wrap-up promotion is stage 2 of a non-callable 5-stage pipeline, so
startup defines its own promotion procedure that FOLLOWS the shared memory rules by reference (routing,
placement, per-type templates, the frontmatter allowlist + staging-field strip, supersession, area
resolution) but is a distinct step. "Atomic" here is a validate-heavy pre-write + verify + halt-on-failure
model, NOT a database transaction — it promises no automatic rollback.

The final **Always-Ask baseline-write approval** opens step 2: show the user the complete manifest — exact
destinations, living-index changes, supersessions, archive moves, and unresolved questions — through the
manager's active-runtime user-decision primitive, and proceed only after explicit approval.

### Step 1 — PRE-WRITE validation of the WHOLE approved set (all-or-none gate)

Before ANY durable write, over the complete manifest + staging set:
- Confirm every required Level-2 branch has a valid closure state; every candidate has a manifest entry;
  every manifest entry traces to ledger evidence.
- Validate every staged file: well-formed frontmatter + `type`/`area` resolve against the memory
  vocabulary + zero-context prose (dry-run `validate-frontmatter.sh` over the staged files).
- Resolve every destination path deterministically (routing + area + per-file `feature:`), and detect
  collisions: a pre-existing target is either a create-collision (HALT unless the user re-slugs or approves
  a supersession) or a supersession (pre-compute the new file's `supersedes:`, the old file's status-flip +
  `superseded_by`, and its `git mv` archive path). Pre-compute ALL supersession/archive moves into the
  manifest.
- Confirm all binding rules have explicit user approval; all proposed features are user-ratified durable
  value-features; and no secret, credential, or user-marked sensitive value is present in any draft, index,
  or the summary.
- If ANY file fails validation or has an unresolvable collision → **STOP before any durable write**;
  surface to the user (Always-Ask). Nothing durable written = safe (§1).

### Step 2 — Write in a safe order

Apply only approved manifest entries, in an order that keeps a mid-write halt maximally recoverable:
- (a) Create/update new typed docs first (idempotent overwrite by deterministic path). Lazily create each
  ratified `features/{f}/` parent a feature-scoped record needs.
- (b) Apply supersession: flip the old file's `status` in place, add `superseded_by`, and `git mv`
  old → `archive/{type}/{area}/`. Never delete.
- (c) Update living indexes (root README, feature READMEs) in place **LAST** — after the typed docs they
  point to exist, so a halt before (c) leaves typed docs present and no index claiming a missing record.

### Step 3 — Verify every destination

For every manifest entry: check the exact destination exists with the expected post-strip/post-stamp
content; check every supersession link is paired and every planned archive path exists; check each
living-index pointer resolves to an existing typed record. Record the verification result beside the
manifest entry.

### Step 4 — POST-WRITE validation gate (standing guards)

Run the standing memory guards over the post-promotion tree; ALL must exit 0:
- `validate-frontmatter.sh` — memory frontmatter + per-type allowed fields.
- `check-markdown-links.sh` — relative-link resolution.
- `check-residual-vocab.sh` — retired vocabulary.
- `check-skill-mistakes.sh` — skill-owned mistake sections.

A clean frontmatter check alone is not sufficient. Startup does NOT run Wrap-up's dual-system memory
validation, Stage-2c compaction, or git finalization — the Always-Ask user gate + these standing guards
are startup's substitute, because the baseline is user-confirmed answer-by-answer.

### Step 5 — On any mid-write failure (steps 2–4) → HALT + Always-Ask partial-state recovery

Stop immediately; do not continue to another manifest item and do not mark the baseline valid. Report
exactly which files were written, which supersessions/archives were applied, and what remains. Offer three
Always-Ask choices: **complete-forward** from the deterministic manifest / **roll back** — remove the
step-2(a) created typed docs, revert the applied step-2(b) `git mv`s + status-flips, and restore any
step-2(c) in-place living-index edits (all recoverable via git), returning the tree to the pre-promotion
state / **abandon** the partial baseline for manual repair. Never choose a recovery path silently. The startup summary cannot carry `baseline_valid: true` until recovery
completes, all exact paths verify, and every guard passes.

**Prevent double promotion.** After successful promotion, write every promoted path + the completion marker
into `outputs/startup-summary.md`. Because startup promotes at startup-close, its staging is already durable
before any same-session Wrap-up runs; Wrap-up's promotion-inventory EXCLUDES `startup/`, so it never
re-promotes a startup staging surface.

## 10. Frontmatter & raw-vs-synthesized

- Every typed durable doc carries the full shared memory base + only its per-type extensions. `author` is
  the runtime that synthesized the doc (`claude` / `codex`); the user is the decision authority, recorded
  in the body + discussion log. `area:` and startup-only routing fields are staging-only and stripped on
  promotion; `feature` on a feature-scoped record is part of the base and is NOT stripped.
- The root `README.md`, `startup-summary.md`, the answer ledger, and the raw discussion log are NOT memory
  docs and carry no memory frontmatter.
- Raw log + ledger are audit inputs, never promoted. A synthesized doc stands alone for a zero-context
  reader — no topic ID is load-bearing context; at most a `## Source` footer points to the startup summary.

## 11. Re-run classification (5 states)

A completed startup run followed by another startup invocation is a **baseline review**, not an append pass.
Inventory existing memory first; build a coverage matrix from topic nodes to existing docs; present each
recorded answer + evidence and ask confirm / correct / unknown. Classify every output into exactly one:

| State | Action |
|---|---|
| `unchanged` | No write; record the validation in the startup summary. |
| `living-index update` | Update the root/feature README in place after approval (safe-order step 2c). |
| `new record` | Create one new atomic typed doc. |
| `superseding record` | New typed doc with `supersedes:`; flip + backlink + archive the old via the terminal-state procedure. |
| `deferred/open` | A backlog ONLY when there is actionable work + a pick-up trigger; else the open question stays in the startup summary with an owner + resolution method. |

Never blind-append to an old design/decision/rule/mistake. Never delete — supersede + move-on-terminal.
Living indexes update in place; prior states recover via git + the manifest.

## 12. Interruption / resume classifier (4 states)

At startup entry, a **read-only** classifier inspects `sessions/{date}-{session-id}/startup/` (and any prior
startup session dir needed to detect completion) and resolves ONE state — it writes nothing:

| State | Signal | Action |
|---|---|---|
| `fresh` | No `startup/` dir. | First run — full 11-topic traversal. |
| `in-progress-resumable` | `working/answer-ledger.md` exists with ≥ 1 confirmed Level-1 checkpoint marker AND no completion marker. | Ask resume vs restart. On resume: reload the ledger + confirmed checkpoints; re-show each confirmed Level-1 summary for a quick re-confirm; regenerate staged drafts from the ledger (idempotent); continue from the first unconfirmed checkpoint. |
| `abandoned` | A stale in-progress dir the user chooses to discard. | SAFE discard — nothing durable was written (§1), so no memory cleanup; drop or ignore the gitignored session working/staging. |
| `completed` | `outputs/startup-summary.md` with a completion marker AND promotion verified. | This is a rerun — go to the §11 baseline-review path. |

The classifier writes nothing. A `/clear`, `/compact`, or interruption after a confirmed Level-1 marker is
survivable: on re-entry the classifier reads the ledger READ-ONLY and resumes. An interruption DURING
promotion is not a normal resume — use the §9 step 5 partial-state recovery.

## 13. Standalone entry / exit

A standalone `startup` (outside `/gobbi`) must obtain a session root, settings, runtime identity, and leave
durable evidence a later Configuration can trust.

**Entry:**
1. Resolve `{session-id}` from the runtime (`CLAUDE_CODE_SESSION_ID` for Claude Code / `CODEX_THREAD_ID`
   for native Codex).
2. After the read-only classifier and the scope gate, create `sessions/{date}-{session-id}/startup/` with
   the startup-owned `working/` + `staging/` + `outputs/` scaffold.
3. Write a minimal `session.json` (`project`, `system`, `startedAt`, `mode: startup-standalone`); add NO
   `1-ideation … 5-wrap-up` loop entries.
4. Inherit settings from the repo `.claude/settings.json` (or the runtime's settings); do not fabricate a
   separate policy set.

**Exit:** write `outputs/startup-summary.md` with a completion marker:

```yaml
startup_complete: true
baseline_valid: true
promoted_paths: [...]
open_questions: [...]
```

Include the rerun triggers + non-sensitive verification notes. This is the durable evidence a later
Configuration reads: on the next `/gobbi`, the memory-baseline check finds the promoted memory AND the
completion marker → treats the baseline as established and skips the auto-recommend.

**Standalone git:** a standalone run's promotion writes are committed by an explicit standalone commit step
(manager/user-owned); startup itself never pushes or merges. Inside a `/gobbi` session, the enclosing
Wrap-up git-finalization stage later absorbs the already-promoted tracked writes.

## 14. Privacy / retention

The raw discussion log and answer ledger are session artifacts under `sessions/` (gitignored,
worktree-local) that may hold sensitive detail (business, security, regulatory, personal). Apply:

- Keep the raw discussion and the ledger under the gitignored session tree.
- Never promote the raw log, the ledger, the promotion manifest, or any secret/credential.
- Synthesis STRIPS secrets/credentials: a value the user marks sensitive stays in the session tree only —
  never in a promoted typed record, a feature README, the root README, or the startup summary.
- Keep only non-sensitive promoted paths + open-question summaries in `startup-summary.md`.
- Retention = session lifetime. On abandon or standalone-end, the session tree is left in place (gitignored,
  never committed) or removed by the runtime's session cleanup — it is never shipped as project reference.
