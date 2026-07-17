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
- [12. Interruption / resume classifier (5 states)](#12-interruption--resume-classifier-5-states)
- [13. Standalone entry / exit](#13-standalone-entry--exit)
- [14. Privacy / retention](#14-privacy--retention)

---

## 1. Four-layer capture

Keep four layers separate. Only the last is durable project reference.

> **Level invariant — path determines authority.** This is the single owner of startup's two write
> tiers; `SKILL.md` cites it. Two write tiers, one boundary:
> - **RECORD-LEVEL** — every path under `sessions/{date}-{session-id}/startup/` (`working/` +
>   `staging/` + `outputs/`). Session-scoped, gitignored, worktree-local, non-authoritative, and
>   **never durable** — no record-level file is ever promoted wholesale.
> - **MEMORY-LEVEL** — the durable `.gobbi/projects/{project-name}/...` tree (outside `sessions/`,
>   `skills/`, and `agents/`). Read-only through P5, then written to the approved-manifest destinations
>   across the startup-close gate — the typed records at P6, and the living-index completion predicate
>   (root + feature README) at P7 **after the P6.5 gate PASSES** — and read-only otherwise.
>
> Nothing crosses record-level → memory-level except the startup-close promotion of synthesized typed
> records (P6) + the living-index completion-predicate edits (P7, after P6.5 PASS) — and promotion COPIES
> an approved staged source to its memory destination; it
> does not promote the source file itself. Repository code, skill sources, memory templates, and
> guards are read-only **source** inputs on neither write tier — startup never writes them. A staged
> draft may carry memory-shaped frontmatter, yet it stays record-level until the startup-close gate copies
> it to an approved memory destination (typed records at P6, living indexes at P7).

```
raw conversation audit  →  structured answer ledger  →  synthesized staged docs  →  user-approved promoted reference
```

| Layer | Level | Purpose | Durable? |
|---|---|---|---|
| **Raw discussion log** | record-level | Verbatim or near-verbatim audit of the manager–user conversation. | No. Never promoted. |
| **Answer ledger** | record-level | Structured interpretation with evidence, status, decisions, affected outputs, and follow-ups visible (schema §2). | No. Never promoted. |
| **Synthesized staged docs** | record-level | Atomic typed drafts, each stamped from its matching memory template, in session staging. | No. Session-local until promotion. |
| **Promoted reference** | memory-level | The user-approved typed records and living indexes written by startup-close promotion (§9). | Yes. |

**Why this makes abandon SAFE:** promotion (§9) is the ONLY memory-level write. Everything before it is
record-level under `sessions/` (gitignored). A run abandoned at any point before promotion leaves ZERO
partial durable state — no memory cleanup is needed. Only a mid-promotion failure needs the recovery path
(§9 step 5).

## 2. Answer-ledger schema

Write one append-only ledger event per answer. The ledger is startup-owned session evidence; because
`sessions/` is outside the memory frontmatter standard, it uses this startup-owned schema, not memory
frontmatter. Four distinct axes are kept SEPARATE — do NOT overload the single `Status` field to carry
all of them: evidence strength, claim kind, evidence verification, and branch closure are different
questions.

| Field | Meaning |
|---|---|
| **Answer ID** | Stable idempotency key for this answer event (kebab slug or ordinal). Regeneration and resume/rerun key off it, NOT off row position. |
| **Topic ID** | Stable Level-1/Level-2 node (e.g. `7.4 Data & state`). |
| **Question** | The exact question asked. |
| **Answer** | The user's answer, summarized without changing its meaning. |
| **Status** | `confirmed` / `assumption` / `open` / `contradicted` — the coarse capture tag (drives the MUST-tag rule and the Level-1 checkpoint display). |
| **Claim kind** | `observed-fact` / `user-intent` / `forecast` / `preference` / `decision` / `open-question`. Separates a verified fact from an intent, a forecast, or a preference. |
| **Evidence status** | `verified` / `corroborated` / `user-asserted` / `unverified` / `contradicted`. User authority alone confirms only intent/preference; an external fact needs verification or stays `user-asserted`/`unverified`. |
| **Evidence** | User authority / repo path / observed behavior / named external source. |
| **Sensitive?** | `y`/`n` + reason. Drives the synthesis strip (§9 step 1, §14): a `y` value stays record-level and never enters a promoted record, index, or summary. |
| **Branch closure** | `confirmed` / `proven-irrelevant:{reason}` / `recorded-open:{owner}` — the per-Level-2-branch closure state the validity gate audits, distinct from `Status`. |
| **Decision** | The binding choice made by the answer, if any. |
| **Affected docs** | Candidate root-index / design / decision / feature / rule / mistake / backlog / reference / scenario / checklist / learning effects. |
| **Follow-up** | The next probe, evidence, owner, or resolution method needed. |

For a **design-bearing** answer (the P3 design-decision micro-loop in `SKILL.md` § Procedure), the event
also carries the M3 decision-trace fields — do not fold them into `Decision`:

| Field | Meaning |
|---|---|
| **Decision brief** | Record-level path to the prior-art study (`working/research/{slug}.md`) holding the Source/Insight/Why entries. |
| **Recommendation** | The manager's recommended option, formed before the user chose. |
| **Evidence-to-change** | The falsifier — the observable evidence that would flip the recommendation. |
| **Chosen direction** | The option the user selected. |
| **Rationale** | Why the user selected it, plus the rejected alternatives. |

**The ledger is append-only and idempotent.** A correction appends a new event that supersedes an
earlier one (mark the earlier event `contradicted`, link by `Answer ID`); it never edits a row in place.
Staged-draft regeneration (resume, checkpoint correction, P4 rebuild) reads the CURRENT event set keyed
by `Answer ID`, not row position — so a resumed or re-run pass never re-asks or duplicates a settled
answer.

**Answer status is not branch closure.** `Status` records evidence strength; `Branch closure` records
per-branch coverage. A Level-2 branch closes only as `confirmed`, `proven-irrelevant` (with a recorded
reason), or `recorded-open` (with an owner and resolution method). At each confirmed Level-1 close, append
a checkpoint marker to the ledger holding the topic number and confirmation timestamp.

## 3. Startup session shape

`startup` is NOT a productive loop — it has no `{N}-` loop dir and is never smuggled into the fixed
`1-ideation … 5-wrap-up` set. It uses its own unnumbered `startup/` surface:

```
sessions/{date}-{session-id}/startup/          # the entire tree is RECORD-LEVEL (§1) — never durable
├── working/
│   ├── discussion-log.md         # raw audit
│   ├── answer-ledger.md          # append-only ledger (schema §2) — carries the resumable checkpoint markers
│   ├── research/                 # prior-art study per design-bearing branch: {slug}.md, Source/Insight/Why (M3)
│   ├── promotion-manifest.md     # per-file CRUD + per-touched-path preimage + supersede/archive plan (§7)
│   ├── preimages/                # restorable original bytes of each pre-existing edited/moved path (§7, §9 step 5)
│   └── evaluation/iter{n}/{claude,codex}/   # P6.5 dual-system gate evidence: 7 perspectives + overall.md + checklist.md (§9 step 4) — record-level, never promoted
├── staging/
│   ├── decisions/                # decision records AND mistake-candidates (frontmatter `mistake-candidate: true`)
│   ├── design/
│   ├── references/
│   ├── learnings/                # project-scoped transferable techniques
│   ├── rules/                    # binding-rule candidates (explicit user confirmation required to promote)
│   ├── indexes/
│   │   └── project-README.md     # root living-index candidate (frontmatter-less) — reviewed at P5, promoted at P7 after the P6.5 gate PASSES (§8)
│   ├── backlogs/{feature,project}/
│   └── features/{feature-name}/
│       ├── README.md             # feature living-index candidate — reviewed at P5, promoted at P7 after the P6.5 gate PASSES
│       └── {type}/               # feature-scoped drafts, one subtree per ratified feature (multi-feature)
└── outputs/
    └── startup-summary.md        # promoted paths + open questions + completion marker + rerun triggers — RECORD-LEVEL, live-session-only (§13)
```

`working/`, `staging/`, and `outputs/` are all parts of the record-level startup record (§1); none is
durable memory. They are gitignored session surfaces. The raw log, ledger, manifest, staged drafts, index
candidates, and startup summary are never promoted as records — promotion COPIES an approved staged source
to its memory destination (§9). A later same-session Wrap-up promotion inventory EXCLUDES the entire
`startup/` tree, because startup has already promoted its approved set (§9 step 5).

**Staging tree covers every type the topic map produces.** The `staging/learnings/` path, the
`staging/indexes/` + per-feature `README.md` index candidates, and the full
`staging/features/{feature-name}/{type}/` subtree exist so the staging sources match the topic → durable
output map in §4 one-for-one — every durable type §4 can produce (including the root and feature living
indexes) has a record-level staging source, and the staging tree names no source without a durable
destination. In particular:

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
| 11. Idioms, Rules & Recurring Mistakes | project/feature `rules/{area}/{slug}.md`; project/feature `mistakes/{trap-class}/{slug}.md`; project/feature `learnings/{area}/{slug}.md`; `references/…` | One mandatory invariant per rule; one recurring trap per mistake; one transferable technique per learning; a skill-candidate convention = one decision record. Startup promotes only CROSS-CUTTING project/feature traps to `mistakes/`; a SKILL-OWNED trap is handed off as a decision/backlog record (startup edits no skill), never written to `skills/{skill}/mistakes.md` (§5). Mistakes stage via `staging/decisions/{slug}.md` + `mistake-candidate: true` (§5), NOT a `staging/mistakes/` dir |

**Atomicity:** one record = one concept. The **root README is a living index, not a typed memory doc**
(§8).

## 5. Authoritative staging → destination contract

startup's staging conforms to the SAME representation the shared Wrap-up routing inputs expect, so the
shared routing rules apply per file. Every durable destination below is relative to
`.gobbi/projects/{project-name}/`. Every by-area destination receives an allowed `{area}` via the
area-resolution order at the end of this section.

**Level transition (§1).** Every left-column source is record-level; every right-column destination is
memory-level. Promotion COPIES an approved source to a newly created or changed memory-level destination —
the record-level source file itself is never promoted, moved, or mutated.

| Staging source | Durable destination | Conditions |
|---|---|---|
| `staging/decisions/{slug}.md` | `decisions/{area}/{date}-{slug}.md` | Project-scoped atomic decision (includes a skill-candidate note). |
| `staging/decisions/{slug}.md` with `mistake-candidate: true` | project `mistakes/{area}/{slug}.md` (cross-cutting trap), OR — for a SKILL-OWNED trap — an atomic `decisions/{area}/{date}-{slug}.md` or `backlogs/{area}/{slug}.md` handoff record | Always-Ask scope route. Startup promotes ONLY cross-cutting project/feature traps to `mistakes/`. It edits no skill, so a skill-owned trap is NEVER written to `skills/{skill}/mistakes.md`; instead it is handed off as a durable decision/backlog record naming the owning skill + a later-phase trigger for the skill-authoring owner to promote. Strip the routing flag on promotion. |
| `staging/design/{slug}.md` | `design/{area}/{slug}.md` | Project-scoped design. |
| `staging/references/{slug}.md` | `references/{area}/{slug}.md` | Project-scoped extracted insight; a bare external link is not enough. |
| `staging/learnings/{slug}.md` | `learnings/{area}/{slug}.md` | Project-scoped transferable technique. |
| `staging/rules/{slug}.md` | `rules/{area}/{slug}.md` | Project rule. Promotion requires explicit user confirmation of invariant, scope, reason, and exception. |
| `staging/backlogs/project/{slug}.md` | `backlogs/{area}/{slug}.md` | Project deferral with actionable work + a pick-up trigger. |
| `staging/backlogs/feature/{slug}.md` | `features/{f}/backlogs/{area}/{slug}.md` | The staged file carries `feature: {f}`. |
| `staging/features/{f}/decisions/{slug}.md` | `features/{f}/decisions/{area}/{date}-{slug}.md` | Feature decision; the staged file carries `feature: {f}`. |
| `staging/features/{f}/decisions/{slug}.md` with `mistake-candidate: true` | `features/{f}/mistakes/{area}/{slug}.md` OR project `mistakes/{area}/{slug}.md` (cross-cutting trap), OR — for a SKILL-OWNED trap — a `decisions/`/`backlogs/` handoff record | Always-Ask scope route; the staged file carries `feature: {f}`. A skill-owned trap is NEVER written to `skills/{skill}/mistakes.md` — it becomes a decision/backlog handoff to the skill owner. Strip the routing flag. |
| `staging/features/{f}/design/{slug}.md` | `features/{f}/design/{area}/{slug}.md` | Feature design. |
| `staging/features/{f}/references/{slug}.md` | `features/{f}/references/{area}/{slug}.md` | Feature reference insight. |
| `staging/features/{f}/scenarios/{slug}.md` | `features/{f}/scenarios/{area}/{slug}.md` | Feature scenario. |
| `staging/features/{f}/checklists/{slug}.md` | `features/{f}/checklists/{area}/{slug}.md` | Feature checklist. |
| `staging/features/{f}/rules/{slug}.md` | `features/{f}/rules/{area}/{slug}.md` | Feature rule; explicit user confirmation. |
| `staging/features/{f}/learnings/{slug}.md` | `features/{f}/learnings/{area}/{slug}.md` | Feature-scoped transferable technique. |
| `staging/features/{f}/README.md` | `features/{f}/README.md` | Feature living-index candidate → the durable feature index. Reviewed/diffed at P5, promoted at P7 after the P6.5 gate PASSES (part of the completion predicate). The feature is a durable value-feature, not a task, sprint, epic, subsystem, mechanism, or speculative idea. |
| `staging/indexes/project-README.md` | `README.md` | Root living-index candidate → the frontmatter-less root index (§8). Reviewed/diffed at P5, created/updated at P7 after the P6.5 gate PASSES (the durable completion predicate). |

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
2. Append one structured event (with its `Answer ID`) to `working/answer-ledger.md` — append-only (§2).
3. Record candidate output effects — write only to session working/staging, never durable memory. For a
   **design-bearing** branch, first run the P3 design-decision micro-loop ([`SKILL.md`](SKILL.md)
   § Procedure): capture the prior-art study to `working/research/{slug}.md` and the decision-trace fields
   to the ledger (§2) before recording the direction.
4. If the answer corrects an earlier one, append a superseding event linked by `Answer ID` that marks the
   earlier event `contradicted` (§2), and identify every affected staged draft — never edit a prior event
   in place.

**At each Level-1 close:**
1. Present confirmed facts / assumptions / open questions / contradictions / decisions / proposed doc
   effects (the checkpoint).
2. Ask the user whether the summary is accurate.
3. On correction, update the ledger FIRST (append a superseding event), then regenerate the affected staged
   drafts from the current ledger events keyed by `Answer ID`, rather than patching around stale synthesis.
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
   | Preimage (per touched path) | The state, captured NOW at P5, of EVERY path this row mutates — not just a singular destination. A `create` touches one path (the new destination). A `supersede` touches THREE: the new destination `[create]`, the old file `[in-place status-flip edit]`, and the old file's archive path `[git mv target]`. A `living-index update` touches one path (the index file `[in-place edit]`). For each touched path record: (i) a change-detection value — `absent`, or `present` + a content hash — for the per-path TOCTOU recheck (§9 step 2); AND (ii) for any PRE-EXISTING path the row edits-in-place or moves, a RESTORABLE representation of its original bytes (a `git hash-object -w` blob ref, or a `working/preimages/{slug}` byte copy) — a bare hash cannot reconstruct an uncommitted edit (§9 step 5). A `create` needs no restorable bytes (its preimage is `absent`; rollback is `rm`) |
   | Supersession plan | For `supersede`: old path, new record's `supersedes`, old record's status-flip + `superseded_by`, and the exact archive-move path. Each of the three touched paths carries its own preimage row above |

   Index candidates (`staging/indexes/project-README.md`, `staging/features/{f}/README.md`) each get a
   manifest row too — Operation `living-index update`, so P5 whole-set validation can inspect and diff
   them before P7 writes them after the P6.5 gate PASSES (the completion predicate, §9 step 6).

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
and no project-README memory template exists — do not fabricate one. It is synthesized at a record-level
candidate first — `staging/indexes/project-README.md` (§3) — so P5 whole-set validation can inspect and
diff its exact text, links, and secret-scan before P7 promotes it after the P6.5 gate PASSES (the durable
completion predicate). Keep these sections:

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

`startup` does NOT invoke Wrap-up. Wrap-up promotion is stage 2 of a non-callable five-stage pipeline, so
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
- **Create the startup-summary candidate** (`outputs/startup-summary.md`) as a draft — open questions,
  rerun triggers, provisional promoted-paths, and NO `baseline_valid` (or `baseline_valid: false`) — so the
  pre-write secret-scan below and the P6.5 gate have a target. Its field-level lifecycle is §13.
- Resolve every destination path deterministically (routing + area + per-file `feature:`), and detect
  collisions: a pre-existing target is either a create-collision (HALT unless the user re-slugs or approves
  a supersession) or a supersession (pre-compute the new file's `supersedes:`, the old file's status-flip +
  `superseded_by`, and its `git mv` archive path). Pre-compute ALL supersession/archive moves into the
  manifest. Each of a supersession's touched paths — new destination, old file, archive path — is collision-
  and preimage-checked in its own right (the archive path must be `absent`; a pre-existing archive target is
  a collision).
- **Record a per-touched-path preimage into the manifest (§7)** — for EVERY path each row mutates (a
  supersession touches the new destination, the old file, AND the archive path; a `living-index update`
  touches the index file), capture NOW both a change-detection value (`absent`, or `present` + a content
  hash) AND, for any pre-existing path the row edits-in-place or moves, a RESTORABLE byte representation (a
  `git hash-object -w` blob ref or a `working/preimages/{slug}` copy). The change-detection value feeds the
  per-path TOCTOU recheck (step 2) so a concurrent or user edit between P5 and P6/P7 cannot be
  blind-overwritten; the restorable representation is what recovery restores from (step 5). A bare content
  hash is NOT restorable — it cannot reconstruct an uncommitted edit.
- Confirm all binding rules have explicit user approval; all proposed features are user-ratified durable
  value-features. **Run the pre-write secret-scan** over EVERY staged typed draft + the index candidates
  (`staging/indexes/project-README.md`, `staging/features/{f}/README.md`) + the startup-summary candidate,
  driven by the ledger `Sensitive?` field (§2) — not only user-marked values. The scan is **automated +
  manual**: run an automated pattern-based scanner over those exact files when one is available, AND run a
  mandatory manual review of the same surface. **Fail-closed on tool absence** — if no automated scanner is
  available, the manual review is MANDATORY, not skipped. Record the scan result (files scanned, tool used
  or `manual-only`, hit/clean) as `working/` evidence. This P5 pass covers the PRE-write surface; the
  post-write surface — the actual promoted delta + the P6.5 evaluation evidence, which do not exist yet — is
  re-scanned at P6.5-time by the dual-system Risk perspective (checklist `STARTUP-RISK-SCENARIO-01`),
  together satisfying the checklist's full-surface automated+manual coverage. No secret, credential, or
  user-marked sensitive value may be present in any draft, index, or the summary.
- If ANY file fails validation, has an unresolvable collision, or trips the secret-scan → **STOP before
  any durable write**; surface to the user (Always-Ask). Nothing durable written = safe (§1).

### Step 2 — Write in a safe order (P6 — typed records only)

Apply only approved manifest entries, in an order that keeps a mid-write halt maximally recoverable. P6
writes the TYPED atomic records + their supersession/archive moves ONLY; the living-index completion
predicate is deferred to step 6 (P7, after the P6.5 gate PASSES).
**TOCTOU recheck — immediately before EACH mutation, per touched path**, re-read the exact path being
mutated and compare it against THAT path's manifest preimage recorded at step 1 (§7). If the live state no
longer matches its preimage (a concurrent or user edit landed after P5) → **HALT to the step-5 Always-Ask
recovery; NEVER overwrite**. This replaces blind "idempotent overwrite" — a matching per-path preimage is
the precondition for every write.
- (a) Create new typed docs first (write by deterministic path only after that path's preimage recheck
  confirms it is still `absent`). Lazily create each ratified `features/{f}/` parent a feature-scoped record
  needs.
- (b) Apply supersession, rechecking EACH touched path against its own preimage immediately before its
  mutation: recheck the old file's preimage, then flip its `status` in place and add `superseded_by`;
  recheck the archive path's preimage (must still be `absent`), then `git mv` old → `archive/{type}/{area}/`.
  Never delete.
- The living indexes (root README, feature READMEs) are NOT written here — they are the durable completion
  predicate and are written at step 6 (P7) only after the P6.5 gate PASSES, so no "complete baseline" signal
  can exist before evaluation clears it.

### Step 3 — Verify every typed-record destination (P6)

For every typed-record manifest entry: check the exact destination exists with the expected
post-strip/post-stamp content; check every supersession link is paired and every planned archive path
exists. Record the verification result beside the manifest entry. (Living-index pointer verification is
deferred to step 6 — the indexes are not written until P7.)

### Step 4 — POST-WRITE validation gate (standing guards)

Run the standing memory guards over the post-promotion tree; ALL must exit 0:
- `validate-frontmatter.sh` — memory frontmatter + per-type allowed fields.
- `check-markdown-links.sh` — relative-link resolution.
- `check-residual-vocab.sh` — retired vocabulary.
- `check-skill-mistakes.sh` — skill-owned mistake sections.

A clean frontmatter check alone is not sufficient. These standing guards judge **form** (frontmatter /
links / vocab / skill-mistake sections). After they pass, the **P6.5 dual-system evaluation gate** judges
the baseline's **completeness + quality**: two fresh evaluators (Claude + Codex) run the startup
[`scenario.md`](scenario.md) + [`checklist.md`](checklist.md) + [`evaluation.md`](evaluation.md) bundle
over the promoted baseline, each writing nine record-level files under
`sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/` (§3). Startup does NOT run
the compaction sub-procedure or git finalization, but it DOES run this dual-system gate — the baseline becomes
every later session's reference, so it is not exempt (this overrides the earlier design in which the
Always-Ask gate + standing guards were startup's full substitute for dual-system validation). The bundle
procedure is owned by [`evaluation.md`](evaluation.md); its non-loop recognition by the shared evaluator
is owned by `evaluation/SKILL.md` § Phase-specific focus — see also [`SKILL.md`](SKILL.md) § Procedure
(P6.5). The living-index completion predicate and `baseline_valid: true` are written at P7 (step 6) only
after P6.5 passes — the promoted set under evaluation here is the typed records, not yet any index.

### Step 5 — On a mid-write failure, a P6.5 REVISE/FAIL, or a P7 write failure → HALT + Always-Ask partial-state recovery

This handler fires on ANY of: a mid-write failure in steps 2–3; a **P6.5 REVISE or FAIL** verdict (step 4);
or a P7 living-index write failure (step 6). Stop immediately; do not continue to another manifest item and
do not mark the baseline valid. Report exactly which files were written, which supersessions/archives were
applied, and what remains. Offer three Always-Ask choices: **complete-forward** from the deterministic
manifest (after the fix, for a REVISE) / **roll back** the promoted typed-record set / **abandon** the
partial baseline for manual repair. Never choose a recovery path silently.

**A P6.5 REVISE/FAIL routes here.** When P6.5 does not PASS, the P6-promoted typed records already exist in
durable memory but the living-index completion predicate was never written (step 2 defers it to step 6), so
NO "complete baseline" signal exists. The manager returns to the earliest owning phase to fix the finding,
then either complete-forwards (re-promote the corrected set, re-run P6.5) or rolls back the promoted typed
records. A later session that finds promoted typed records with no root/feature index is NOT `completed`
(§12) — it correctly re-runs or resumes.

**Roll-back carve-out — the single narrow exception to startup's no-delete rule.** Roll-back operates
strictly by op, keyed to each touched path's manifest preimage (§7). It NEVER deletes a pre-existing memory
file; delete authority extends ONLY to this promotion's own uncommitted CREATEs.

- A **CREATE** — a file THIS promotion just created, whose manifest preimage is `absent`, whose on-disk
  content hash still matches the manifest write, and which is **uncommitted** — is rolled back by `rm` of
  exactly that listed file. These files are untracked, so there is NO `git reset` / `git checkout` target: a
  CREATE roll-back is a file delete of the listed paths, not a git op.
- A **supersession** or a **P7 in-place living-index edit** of a PRE-EXISTING file is rolled back by
  restoring its recorded RESTORABLE preimage (§7), NOT a bare hash — a content hash cannot reconstruct an
  uncommitted edit. Concretely: reverse the `git mv` (move the archived file back to its original path);
  then overwrite the edited file with its stored original bytes — re-materialize the `git hash-object` blob
  (`git cat-file -p <blob> > <path>`) or copy `working/preimages/{slug}` back over the path. This works even
  when the pre-existing file carried uncommitted edits before promotion — the stored bytes ARE the restore
  source, so recovery is possible on exactly the dirty-worktree case a hash cannot serve.

The startup summary cannot carry `baseline_valid: true` until recovery completes, all exact paths verify,
every standing guard passes, and the P6.5 dual-system gate passes.

### Step 6 — P7 completion-predicate write (only after P6.5 PASS)

The living-index completion predicate is written here — at P7, AFTER the P6.5 gate PASSES — never at P6.
This is what makes a later session's `completed` classification (§12) trustworthy: the root/feature index
exists in durable memory only when P6.5 has cleared the promoted baseline, so a pre-PASS or rejected
promoted set can never present as a complete baseline.

1. **TOCTOU recheck each index path** against its step-1 preimage (§7), then write/update the living indexes
   (root README, feature READMEs) in place — after the typed docs they point to exist, so every index
   pointer resolves to an existing typed record.
2. **Verify** each index destination exists with the expected content and every living-index pointer
   resolves to an existing typed record; re-run `check-markdown-links.sh` over the indices (they add the
   pointers the P6 guard pass could not yet check).
3. **Stamp the summary** — set `baseline_valid: true` and finalize `promoted_paths` (now including the
   written indices) in `outputs/startup-summary.md` (§13 lifecycle). A P7 write or verify failure routes to
   step 5.

**Prevent double promotion.** At P6, record every promoted typed-record path into the startup-summary
candidate's `promoted_paths` (§13); at P7 (step 6) finalize the paths and stamp `baseline_valid: true`. The
completion marker is record-level and live-session-only (§13) — it guards the SAME session against double
promotion (Wrap-up's promotion-inventory EXCLUDES `startup/`, so it never re-promotes a startup staging
surface). A LATER session does not read this gitignored marker; it derives rerun-state from durable
memory — specifically the root/feature living index, which exists only post-P6.5-PASS (§12 `completed`, §13).

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
| `living-index update` | Update the root/feature README in place at P7 after the P6.5 gate PASSES (§9 step 6). |
| `new record` | Create one new atomic typed doc. |
| `superseding record` | New typed doc with `supersedes:`; flip + backlink + archive the old via the terminal-state procedure. |
| `deferred/open` | A backlog ONLY when there is actionable work + a pick-up trigger; else the open question stays in the startup summary with an owner + resolution method. |

Never blind-append to an old design/decision/rule/mistake. Never delete — supersede + move-on-terminal.
Living indexes update in place; prior states recover via git + the manifest.

## 12. Interruption / resume classifier (5 states)

At startup entry, a **read-only** classifier inspects `sessions/{date}-{session-id}/startup/` and durable
memory (to detect completion) and resolves ONE state — it writes nothing:

| State | Signal | Action |
|---|---|---|
| `fresh` | No `startup/` dir. | First run — full 11-topic traversal. |
| `restart-safe` | `startup/` dir + `working/answer-ledger.md` present, but **0 confirmed Level-1 checkpoint markers** (interrupted before the first checkpoint). | No trusted resume point and nothing durable was written (§1). Re-confirm scope with the user, then **restart from Topic 1**; the prior gitignored ledger/staging is discarded or ignored. |
| `in-progress-resumable` | `working/answer-ledger.md` exists with ≥ 1 confirmed Level-1 checkpoint marker AND no completion marker. | Ask resume vs restart. On resume: reload the ledger + confirmed checkpoints; re-show each confirmed Level-1 summary for a quick re-confirm; regenerate staged drafts from the current ledger events keyed by `Answer ID` (idempotent, §2); continue from the first unconfirmed checkpoint. |
| `abandoned` | A stale in-progress dir the user chooses to discard. | SAFE discard — nothing durable was written (§1), so no memory cleanup; drop or ignore the gitignored session working/staging. |
| `completed` | **Durable memory present** — the root index (`README.md`) + the ratified feature indexes exist under `.gobbi/projects/{project-name}/` alongside the required durable typed records. The root/feature living index is the **completion predicate**: it is written only at P7 after the P6.5 gate PASSES (§9 step 6), so its presence is trustworthy proof the baseline was evaluated and cleared. Read this from durable memory, NOT the gitignored session summary a later session cannot read (§13, D2). Promoted typed records WITHOUT a root/feature index (a P6.5 REVISE/FAIL then abandoned) are NOT `completed` — that state re-runs or resumes, never presenting as a complete baseline. | This is a rerun — go to the §11 baseline-review path. |

The classifier writes nothing. A `/clear`, `/compact`, or interruption after a confirmed Level-1 marker is
survivable: on re-entry the classifier reads the ledger READ-ONLY and resumes (`in-progress-resumable`); an
interruption before the first checkpoint has no trusted resume point (`restart-safe`). An interruption
DURING promotion is not a normal resume — use the §9 step 5 partial-state recovery.

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

**Startup-summary field lifecycle (one contract across phases).** The summary has ONE field-level
lifecycle — no phase writes a field another phase owns:

| Phase | Summary action |
|---|---|
| **P5** | CREATE the candidate (draft): `open_questions`, rerun triggers, provisional `promoted_paths`, and `baseline_valid: false` (or absent). This gives the P5 pre-write secret-scan (§9 step 1) a target. |
| **P6** | UPDATE `promoted_paths` to the actual written typed-record destinations. Still `baseline_valid: false`. |
| **P6.5** | CONSUME (read-only): the dual-system evaluators read the candidate as part of the frozen baseline set; they never write it. |
| **P7** | STAMP final — only after P6.5 PASS: finalize `promoted_paths` (now including the written living indexes) and set `baseline_valid: true` (§9 step 6). |

**Exit:** at P7 the finalized `outputs/startup-summary.md` carries the completion marker:

```yaml
startup_complete: true
baseline_valid: true
promoted_paths: [...]
open_questions: [...]
```

Include the rerun triggers + non-sensitive verification notes. **This summary is record-level and
live-session-only** (§1) — gitignored, worktree-local, and removed by session cleanup; it is NOT durable
cross-session evidence. Within the live session it records completion and prevents double promotion (§9). A
LATER Configuration does NOT read this marker: on the next `/gobbi` the memory-baseline check derives
rerun-state from **durable memory** — the root index (`README.md`) + the ratified feature indexes (the
completion predicate, written only post-P6.5-PASS) alongside the required durable typed records under
`.gobbi/projects/{project-name}/` (§12 `completed`) — and treats the baseline as established when it finds
them, skipping the auto-recommend. `baseline_valid: true` is written here only after the P6.5 dual-system
gate passes (§9 step 6).

**Standalone git:** a standalone run's promotion writes are committed by an explicit standalone commit step
(manager/user-owned); startup itself never pushes or merges. Inside a `/gobbi` session, the enclosing
Wrap-up git-finalization stage later absorbs the already-promoted tracked writes.

## 14. Privacy / retention

The raw discussion log and answer ledger are session artifacts under `sessions/` (gitignored,
worktree-local) that may hold sensitive detail (business, security, regulatory, personal). Apply:

- Keep the raw discussion and the ledger under the gitignored session tree.
- Never promote the raw log, the ledger, the promotion manifest, or any secret/credential.
- Synthesis STRIPS secrets/credentials, driven by the ledger `Sensitive?` field (§2): any answer flagged
  `Sensitive? y` stays record-level only — never in a promoted typed record, a feature README, the root
  README, or the startup summary. As a backstop that does not rely on user marking, the P5 pre-write
  validation runs the automated+manual secret-scan (§9 step 1, fail-closed on scanner absence) over every
  staged candidate, the index candidates, and the summary candidate; the post-write surface (the promoted
  delta + the P6.5 evaluation evidence) is re-scanned at P6.5-time. A hit HALTS promotion.
- Keep only non-sensitive promoted paths + open-question summaries in `startup-summary.md`.
- Retention = session lifetime. On abandon or standalone-end, the session tree is left in place (gitignored,
  never committed) or removed by the runtime's session cleanup — it is never shipped as project reference.
