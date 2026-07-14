---
name: startup
description: "Use when starting a new project, when the project's memory is empty/sparse, or for an explicit baseline reset — runs the manager's structured startup talk and writes the project baseline docs (vision, users, features, experience, architecture, conventions, risks)."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion, WebSearch, WebFetch
---

# Startup

Startup is the manager-run project-baseline conversation. Load it for a new project, when the project's
memory is empty or sparse, or for an explicit baseline reset. Configuration runs it before the productive
loops; it can also run standalone.

The talk walks a fixed, dependency-ordered topic tree — one question per turn — and turns the
user-confirmed answers into the project's durable reference: a root index plus atomic typed records for
vision, users, features, experience, architecture, conventions, quality, risks, and idioms. The outcome
is a baseline the same session's later loops, and every later session, can read as the current project
reference.

---

## Principles

The startup skill runs on ten craft principles in two named groups — five Interview Craft, five Design
Craft. Ten (not the usual three-to-six) is a deliberate, user-locked exception: each principle is pure
craft and each maps to a gradable acceptance family (the mapping table closes this section), so none is
un-failable. Do not reduce the set toward six.

### Group A — Interview Craft

> **A1 — Start with a real problem event.**

Before vision, features, or solution language, establish the last concrete occurrence: who experienced
it, what happened, what they did, and what it cost. If no real event or current behavior exists, do not
promote the problem as confirmed.

> **A2 — Weight behavioral evidence and commitments over praise.**

Believe what the user already did or gave up to cope with the problem — a workaround they built, effort,
time, or money they already spent, a tool they switched, a struggle they repeated — over what they say
they want. A compliment, a survey "yes", or "I'd use that" is not evidence a problem is real. Ask "have
they built a workaround, or already spent effort, time, or money to solve this?" as a truth-serum for the
problem's reality, never as a forward pricing question.

> **A3 — Ask neutrally, don't pitch or lead, then take a position and name the evidence that would flip it.**

Ask about the person's life and never put the desired answer inside the question; treat compliments and
feature-requests as prompts to investigate, not as validation. After the answer, state your evidence read
and what would change it — never hide behind soft neutrality. Push a vague or contradicted answer at most
twice, then record it open.

> **A4 — Attack the riskiest assumption first, and seek the evidence that would kill it.**

Name the claim most likely to make the project pointless, infeasible, or wrong, and spend the first
disconfirming probe there; allocate depth by uncertainty × reversibility × magnitude — fast on two-way
doors, slow on one-way — while still closing every required branch.

> **A5 — Name one first user and their switch.**

Ground the project in one first user or segment and a concrete job; identify the current alternative,
what pushes and pulls them toward change, and the anxiety of the new and habit of the old that block it.
Where a project has distinct roles, separate the person who acts from the one who operates, approves, or
is affected — as user / problem understanding, not a purchasing chain.

### Group B — Design Craft

> **B1 — Confirm the problem premises before shaping the solution.**

At the problem→solution boundary, show the premises — the problem and its last-instance evidence, the
first user and job, the current alternative and switching forces, the root cause and why-now, the fatal
assumption, and the boundary and explicit non-goals — for agree / disagree. Do not let a feature,
architecture, or stack choice repair an unconfirmed premise after the fact.

> **B2 — Study three layers and present real alternatives, then decide with the user.**

Study tried-and-true, new-and-popular, and first-principles prior art before recommending; present at
least two genuinely distinct options — one minimal, one ideal, at equal weight — with effort, risk,
reuse, a recommendation, and the evidence that would flip it. Judge references for applicability, not by
count.

> **B3 — Shape a rough, solved, bounded direction.**

Connect the main product elements, critical journeys, failure paths, boundary, and system direction at
the macro level; leave signatures, schemas, algorithms, module internals, and task breakdowns rough for
later loops. Start with the narrowest useful foundation that delivers real value, not infrastructure.

> **B4 — A good design has to be viable: feasible to build and sustainable to run.**

Check that the shaped direction can actually be built with the available skills, dependencies, and
constraints, and can be operated and maintained across its intended life — capacity, ownership, failure
recovery, and upkeep. Viability here is feasibility and sustainability, not profit.

> **B5 — The user owns product intent — the manager recommends; the user locks scope and direction, and it reopens only on evidence.**

The manager investigates, disagrees, recommends, and records rejected options; the user explicitly opts
into each scope or binding-direction change. A locked decision stays current until new evidence crosses
its recorded evidence-to-change threshold, at which point the earliest owning branch reopens.

### Principle → acceptance-family mapping

Each principle is graded through a sibling acceptance family in the `scenario.md` + `checklist.md` bundle,
so "each principle maps to a family" is checkable and no principle is un-failable.

| Principle | Acceptance family / check it is graded through |
|---|---|
| A1 Real problem event | Family 1 Problem reality (`STARTUP-PROJ-SCENARIO-05`) |
| A2 Behavioral evidence over praise | Family 1 Problem reality + Family 5 teeth (`STARTUP-RISK-SCENARIO-06`) |
| A3 Ask neutrally / take a position | evidence-quality proxies — Family 1 Problem reality (`STARTUP-PROJ-SCENARIO-05`) + Family 2 User & job clarity (`STARTUP-PROJ-SCENARIO-06`) grade each claim as the user's behavioral evidence, not the interviewer's framing — plus `STARTUP-PROJ-SCENARIO-03-CHECK-02` (take a position: recommended option first + evidence-to-change). Interview conduct is not baseline-observable, so A3 is graded through these proxies, not a conduct check |
| A4 Riskiest assumption first | PERF-01 (reversibility × magnitude depth) + Family 5 teeth |
| A5 One first user + switch | Family 2 User & job clarity (`STARTUP-PROJ-SCENARIO-06`) |
| B1 Confirm premises before solution | `STARTUP-PROJ-SCENARIO-01-CHECK-06` (the premise gate ran: every premise shown for agree / disagree and confirmed before the solution topics) + PROJ-02 (product intent constrains system) |
| B2 Three layers + real alternatives | PROJ-03 (researched + user-decided) |
| B3 Rough, solved, bounded | Family 3 Product-shape soundness (`STARTUP-PROJ-SCENARIO-07`) |
| B4 Viable = feasible + sustainable | Family 4 Feasibility & sustainability (`STARTUP-STRUCT-SCENARIO-05`) + Family 5 teeth |
| B5 User owns intent | PROJ-03 (user-decided) + the scope Rule |

---

## Rules

### Must-Follow

- **MUST ask one question per turn** — a single decision axis per turn keeps each answer clear enough to
  classify and record without conflating two concepts.
- **MUST close every Level-1 topic with a user-confirmed checkpoint and a resumable marker** — an
  interrupted run needs a precise, trusted point to restart from.
- **MUST tag every answer `confirmed` / `assumption` / `open` / `contradicted`** — evidence strength must
  stay visible from capture through synthesis.
- **MUST close every required Level-2 branch as `confirmed`, `proven-irrelevant` (with a reason), or
  `recorded-open` (with an owner)** before the baseline is valid — coverage is complete only when every
  branch is accounted for.
- **MUST establish and confirm scope and product shape before architecture** — a system choice must never
  set the product boundary by accident.
- **MUST confirm the scope boundary and explicit non-goals before entering the solution / features
  topics** — the problem-before-solution premise gate fixes what the project will NOT do before Topic 5,
  so a feature can never quietly expand an unconfirmed scope.
- **MUST run the study → recommend → user-decision micro-loop for every design-bearing branch** — study
  prior art (internal grep + external), present 2–3 reference-backed options with a recommendation and an
  evidence-to-change through the Question Card, then record the user's chosen direction + rejected
  alternatives; never close a design-bearing branch from a bare captured preference.
- **MUST allocate interview depth by uncertainty × reversibility × magnitude** — probe reversible
  two-way-door choices fast and irreversible / high-magnitude one-way doors slowly and with a
  disconfirming test, while still closing every required branch.
- **MUST keep every durable record atomic** — one record holds one concept, so later supersession and
  archival keep the right granularity.
- **MUST validate the whole approved promotion set before the first durable write** — any invalid or
  unroutable file stops the entire set while durable memory is still unchanged.
- **MUST promote only after the final Always-Ask baseline-write approval** — the user sees and approves the
  complete manifest before any bounded durable mutation begins.
- **MUST obtain explicit user confirmation before promoting a binding rule** — a preference becomes an
  invariant only with its scope, reason, and genuine exception confirmed.
- **MUST keep secrets and user-marked sensitive values out of every durable output** — only non-sensitive
  synthesis may enter the project reference.

### Must-Not-Follow

- **NEVER write durable project reference material before the startup-close promotion gate** — fix: keep
  the raw log, the ledger, and the typed drafts session-local until the whole set passes validation and
  the user approves the write.
- **NEVER invent a project fact, an unknown answer, a destination area, or a feature assignment** — fix:
  leave the item open and ask the user to supply the missing authority or routing input.
- **NEVER conflate the fact-invention ban with the design recommendation** — a reference-backed design
  DIRECTION the user ratifies is not an invented fact; the ban above applies to project FACTS and unknown
  answers, not to a recommendation the user decides. Fix: leave FACTS open; for a design-bearing branch,
  study prior art, recommend, and record the user's decision.
- **NEVER design detailed mechanism** — no interface signatures, module internals, algorithm, schema, or
  task breakdown. Fix: startup sets the reference-informed DIRECTION and records the user's decision;
  mechanism belongs to Ideation / Planning / Execution.
- **NEVER generate or offer to generate a project-specific skill** — fix: record an atomic skill-candidate
  note for a later phase and the skill-authoring owner to assess.
- **NEVER create a feature directory for a task, sprint, epic, subsystem, speculative idea, or internal
  mechanism** — fix: create one only for a user-ratified durable value-feature.
- **NEVER turn a preference into a binding rule, or a one-off failure into a recurring mistake** — fix:
  route each item to the type that matches its actual claim and evidence.
- **NEVER blind-append, silently overwrite, delete, or rewrite historical typed memory** — fix: classify
  each output as unchanged, a living-index update, a new record, a superseding record, or deferred/open.
- **NEVER rerun a baseline review during an active productive loop** — fix: run it at Configuration time or
  as a standalone startup.
- **NEVER promote the raw discussion, the answer ledger, or any secret or credential** — fix: synthesize
  only zero-context, non-sensitive typed records and keep the audit material session-scoped.

---

## Procedure

Startup runs seven phases in order, with a **P6.5 dual-system evaluation gate** between promotion (P6) and
close (P7). Read [`topics.md`](topics.md) before asking any topic question — it holds the full
Level-1/Level-2 question tree, the traversal, checkpoint, and mandatory-coverage rules, and the
design-bearing branch markers that trigger the P3 micro-loop below. Read [`recording.md`](recording.md)
before creating a staged draft, building the manifest, promoting, resuming an interrupted run, or reviewing
an existing baseline — it holds the capture model, the staging→destination contract, and the startup-close
promotion procedure.

### The 7-phase talk + the P6.5 evaluation gate

| Phase | Manager action | User gate | Output / exit |
|---|---|---|---|
| **P1 — Detect, classify & bound** | Run the read-only resume classifier in [`recording.md`](recording.md). Confirm the trigger, lifecycle, and first-run vs resume vs rerun, and confirm no productive loop is active. Inventory existing baseline docs and verified repo facts. For standalone use, create the `startup/` session scaffold only AFTER classification and scope confirmation. | Confirm startup scope + decision authority; on an in-progress dir, choose resume or restart | Startup contract, resolved lifecycle state, existing-doc inventory, coverage matrix |
| **P2 — Establish current reality** | Traverse Topic 1 in [`topics.md`](topics.md) (including 1.4 license/distribution/governance). Separate verified repo facts from claims, assumptions, and unknowns. Append every answer to the ledger. | Confirm the current-state summary | Evidence register + initial doc effects; P3 stays closed until confirmation |
| **P3 — Traverse the tree** | Walk Topics 2–11 in order from [`topics.md`](topics.md): one question per turn, evidence-led smart-skip, adaptive probes. For a **design-bearing branch** (marked in [`topics.md`](topics.md)), run the design-decision micro-loop (below) before recording the direction. Write a resumable checkpoint marker at each Level-1 close. | Confirm each Level-1 checkpoint; decide each design-bearing direction | Answer ledger: every required branch `confirmed` / `proven-irrelevant` / `recorded-open`; each design-bearing direction recorded with references + rejected alternatives |
| **P4 — Synthesize staged docs** | Follow [`recording.md`](recording.md): convert confirmed answers into atomic typed drafts under the session staging tree using the staging→destination contract; stamp the matching memory template. No durable write. | Surface gaps; never fill them by inference | Complete session-local staging set |
| **P5 — Reconcile, challenge & pre-write validate** | Run the cross-topic contradiction pass and a jargon-free final challenge per [`recording.md`](recording.md). Build the promotion manifest with a per-touched-path preimage (restorable bytes for any pre-existing edited/moved path). Create the startup-summary candidate (draft, `baseline_valid: false`) and run the automated+manual pre-write secret-scan. Validate the WHOLE approved set and pre-compute every destination, collision, supersession, and archive move — dry-run, no durable write. | Confirm corrections + the final manifest | One approved, whole-set-valid promotion plan |
| **P6 — Promote baseline (startup-owned)** | Ask the final Always-Ask baseline-write question. Then run startup's promotion procedure in [`recording.md`](recording.md): per-touched-path TOCTOU preimage recheck → safe-order write of the TYPED atomic records + supersession/archive (NOT the living index) → verify every typed destination → post-write standing guards. On any failure, HALT and present the recorded partial-state recovery. | **Always-Ask** final baseline write | All typed-record destinations written, guard-green, and path-verified — OR a surfaced partial-state recovery |
| **P6.5 — Evaluate completed baseline (dual-system)** | Run the non-skippable dual-system evaluation gate over the promoted typed-record set: two fresh evaluators (Claude + Codex) run the startup [`scenario.md`](scenario.md) + [`checklist.md`](checklist.md) + [`evaluation.md`](evaluation.md) bundle across the 7 perspectives + Overall, each writing nine record-level files under `sessions/{date}-{session-id}/startup/working/evaluation/iter{n}/{system}/`. `PASS` clears P7 (which then writes the living-index completion predicate); `REVISE`/`FAIL` route the promoted typed records to the [`recording.md`](recording.md) §9 step 5 recovery and write NO completion predicate, so no complete-baseline signal exists. This row is the gate slot only — the bundle procedure and its non-loop `evaluation/SKILL.md` recognition are authored in the sibling bundle files, not here. | Manager reconciles the two verdicts; divergence → user-decision | A dual-system verdict; `PASS` is required before P7 |
| **P7 — Close** | After the P6.5 gate PASSES: write/update the root + feature living-index — the durable **completion predicate** ([`recording.md`](recording.md) §9 step 6) — then stamp the startup summary's `baseline_valid: true` + final promoted paths ([`recording.md`](recording.md) §13 lifecycle). The summary is record-level and live-session-only. Resume Configuration or apply the standalone exit contract. | User acknowledges the baseline summary | The living index exists only post-PASS; later sessions derive rerun-state from that durable completion predicate, not the gitignored summary |

**Phase gates:**
- No P3 before the current-state summary is confirmed.
- No feature or architecture synthesis before Topics 2–5 are confirmed.
- No design-bearing branch closed without the study → recommend → user-decision micro-loop (references +
  rejected alternatives recorded).
- No durable write until the whole set passes the P5 pre-write validation.
- No memory path (any touched path — new destination, superseded file, or archive target) overwritten whose
  live state no longer matches its recorded per-path manifest preimage.
- No rule promoted without explicit user confirmation.
- No feature directory for a task, sprint, speculative idea, or internal mechanism.
- No secret promoted.
- No `baseline_valid: true` before the P6.5 dual-system evaluation passes.
- No living-index (root/feature README) write before the P6.5 gate PASSES — it is the durable completion
  predicate, written only at P7.
- No completion while any in-scope Level-2 branch is neither answered, proven irrelevant, nor recorded
  open with an owner.

### Anti-sycophancy traversal contract (P3)

During traversal the manager holds an anti-sycophancy posture:

- Do NOT use "that is interesting", "that could work", "there are many ways", or "you might consider" as
  standalone assessments — they read as agreement and teach nothing.
- Do NOT put the desired answer inside a discovery question.
- After each answer, state the read explicitly: "My read: [evidence status] because [specific evidence or
  gap]; this changes if [observable evidence]."
- When disagreeing, cite the contradiction, the source, or the missing signal — not a feeling.
- Push a vague or contradicted answer at most twice, then `recorded-open`.
- A user decision can lock intent, but it cannot convert a contradicted external fact into evidence.

### Riskiest-assumption-first depth override (P3)

After the first real problem event, the manager stacks the design's riskiest assumptions and probes the
top one first — the **riskiest-assumption-first depth override**. Stack the claims in this order:

1. the claim whose falsity means there is no real problem or user;
2. the claim whose falsity makes the project infeasible or unsafe to build;
3. the claim whose falsity makes the product shape wrong or unusable.

The top claim gets the first disconfirming probe before normal traversal continues. This changes DEPTH
only — never coverage or the macro topic order — and every required branch still closes. Re-score the
stack when a later answer changes the root problem.

### Problem-before-solution premise gate (P3, after Topic 4 / before Topic 5)

Before entering the solution / features topics, run an explicit confirmed checkpoint. Show these premises
one by one for agree / disagree:

1. the recurring problem + its last-instance evidence;
2. the first user / segment + the job;
3. the current alternative + the behavioral evidence the problem is real;
4. the root cause + why-now;
5. the fatal assumption + the current disconfirming evidence;
6. the outcome boundary + explicit non-goals.

A failed premise reopens its earliest owning branch; do not enter features until it is confirmed. No
commercial premise is graded here.

### Design-decision micro-loop (P3)

For every **design-bearing branch** — every branch [`topics.md`](topics.md) § Design-bearing markers marks
design-bearing (its authoritative set is an always-on core plus a conditional set that fires only when a
branch selects or changes a direction, not when it inventories current state) — run this micro-loop before
recording the direction. [`topics.md`](topics.md) is the ONE authoritative classification; do not restate
its topic numbers here. It restores the manager's "investigate, challenge, recommend" role at DIRECTION
altitude; it never designs mechanism.

1. **PRIOR-ART STUDY (three layers)** — before asking the design question, study prior art per
   [`research/SKILL.md`](../research/SKILL.md) § Internal Research + § External Research across three
   layers: **Layer 1** tried-and-true, **Layer 2** new-and-popular (scrutinize maturity, fit, and
   survivorship), **Layer 3** first-principles (where convention does not apply, plus the evidence for
   deviating). Internal = grep the codebase + existing memory for patterns already in use; external =
   references (via `WebSearch` / `WebFetch`, or a delegated `research` subagent) on how the decision is
   solved well. Capture each as Source / Insight / Why in `working/research/{slug}.md`, judging each
   reference for applicability rather than by count. Never fabricate a citation.
2. **RECOMMENDATION** — present at least two genuinely distinct reference-backed options — one minimal,
   one ideal, at equal weight — with effort / risk / reuse trade-offs, the recommended option first, and
   the evidence-to-change ("this recommendation flips if X"), through the Question Card
   ([`discussion/SKILL.md`](../discussion/SKILL.md) § Question Card Structure). The recommendation is
   opinionated but defeasible — "all options are valid" is a failure.
3. **DESIGN-DISCUSSION GATE** — the USER decides (an Always-Ask design decision —
   [`discussion/SKILL.md`](../discussion/SKILL.md) § Decision Classification). Record the chosen direction +
   rationale + rejected alternatives as one ADR-shaped `decisions/` (or `design/`) record citing the
   studied references, and write the decision-trace fields to the ledger ([`recording.md`](recording.md)
   §2).

**Boundary.** The micro-loop sets the reference-informed DIRECTION (which architecture style / which stack /
which convention) and records the user's decision. It does NOT design mechanism — interface signatures,
module internals, algorithms, schemas, and task breakdown stay in Ideation / Planning / Execution.

### Acceptance invariants + the two-gate check-resolution rule

The sibling [`scenario.md`](scenario.md) + [`checklist.md`](checklist.md) + [`evaluation.md`](evaluation.md)
bundle is the acceptance surface the P6.5 gate grades. Two of its invariants bind the traversal above:

- **A positive claim may never be stronger than its evidence** — an applicable load-bearing design claim
  is graded on whether it is evidenced, not on whether it reads complete.
- **Two gates that must not be collapsed** — a **coverage-closure gate** (a branch is accounted for when it
  is `confirmed`, `proven-irrelevant` with a reason, or `recorded-open` with an owner — the Level-2
  coverage Rule) and an **acceptance-pass gate** (a load-bearing design claim PASSes only when it is
  evidenced). `recorded-open` is a valid coverage closure but is NOT an acceptance pass — an applicable
  load-bearing claim left `recorded-open` still drives REVISE (the `STARTUP-RISK-SCENARIO-06` teeth).

### Rerun & supersession classification

A rerun tests the existing baseline's claims and classifies each change — unchanged, living-index update,
new record, superseding record, or deferred / open — rather than stacking a new layer of prose over an
outdated one. The current, coherent reference wins over accumulated history; a supersession writes the new
record, flips the old record's status in place, and archives the old file (never deletes it). See
[`recording.md`](recording.md) for the resume / rerun classifier and the supersession procedure.

### Memory Access Matrix

Startup writes session evidence throughout, and — across the startup-close gate — a bounded set of durable
destinations named in the approved manifest: the typed records at P6, and the living-index completion
predicate at P7 after the P6.5 gate PASSES. It is a named bounded pre-Wrap-up memory writer.

**Level invariant (path determines authority).** Everything under `sessions/.../startup/` is
**record-level** (ephemeral, gitignored, never durable); the ONLY **memory-level** writes are the
startup-close promotion of synthesized typed records (P6) + the living-index completion-predicate edits
(P7, after P6.5 PASS) to the approved-manifest destinations under `.gobbi/projects/{project-name}/`.
Repository code is a read-only **source** — startup never writes it. [`recording.md`](recording.md) §1 is
the single owner of this invariant and the record-level / memory-level terms; the matrix below tags every
surface by its tier.

| Tier | Surface | Access P1–P5 | Access P6 | Access P6.5 | Access P7 | Boundary |
|---|---|---|---|---|---|---|
| **record** | `startup/working/` (raw log, ledger, research, manifest, preimages, evaluation evidence) | READ + WRITE | READ + WRITE | READ + WRITE (evaluators write the 9 files/system under `working/evaluation/iter{n}/{system}/`) | READ + WRITE | Never promoted |
| **record** | `startup/staging/` (typed drafts + index candidates) | READ + WRITE | READ-ONLY promotion source | READ-ONLY (frozen; evaluators read) | READ-ONLY promotion source (index candidates) | Synthesized candidates only; each needs an approved manifest destination |
| **record** | `startup/outputs/` (startup summary) | READ + WRITE (P5 creates the candidate) | READ + WRITE (update promoted paths) | READ-ONLY (evaluators consume the candidate) | READ + WRITE (stamp `baseline_valid`) | Session evidence, not a memory doc; live-session-only; field lifecycle in [`recording.md`](recording.md) §13 |
| **memory** | Existing durable memory (`.gobbi/projects/{project-name}/...`) | READ-ONLY | READ-ONLY except the approved-manifest TYPED-RECORD destinations (`create` / `supersede` / `archive-move`) | **READ-ONLY** — evaluation reads, never writes memory | READ-ONLY except the approved-manifest LIVING-INDEX destinations (root + feature README), written only after P6.5 PASS — the completion predicate | The manifest is the only write grant; P6 writes typed records, P7 writes the completion-predicate living indexes; no other memory write in any phase |
| **source** | Repository code | READ-ONLY | READ-ONLY | READ-ONLY | READ-ONLY | Startup never writes code, in any phase |
| **source** | Skill sources + memory templates | READ-ONLY | READ-ONLY | READ-ONLY | READ-ONLY | Stamps or proposes against owners; creates or edits no skill and no template |

**Delete semantics:** delete authority is never granted, with ONE narrow carve-out. A planned supersession
writes a new record, flips the old record's status in place, and moves the old file to
`archive/{type}/{area}/` — it is never deleted. The single exception is the **roll-back carve-out**
([`recording.md`](recording.md) §9 step 5): on a mid-promotion HALT, a P6.5 REVISE/FAIL, or a P7 write
failure, roll-back may `rm` ONLY a file THIS promotion just created (manifest preimage `absent`, content
hash matches, uncommitted — so there is no `git reset` target); it restores every edited or moved
PRE-EXISTING file from its recorded RESTORABLE preimage (stored bytes, not a bare hash) and NEVER deletes
pre-existing memory. A standalone run may create its minimal `session.json` and the `startup/` scaffold; it
adds no productive-loop entries.

### Output paths

Startup's outputs fall into two write tiers (§ Memory Access Matrix level invariant): record-level session
surfaces written throughout, and the memory-level destinations written across the startup-close gate — the
typed records at P6 and the living-index completion predicate at P7 after the P6.5 gate PASSES.

#### Record-level outputs — the ephemeral startup record

All under `sessions/{date}-{session-id}/startup/`; none is durable, none is promoted wholesale.

| Path | Written by | Purpose |
|---|---|---|
| `working/discussion-log.md` | manager (P2–P3) | Raw conversation audit; never promoted |
| `working/answer-ledger.md` | manager (P2–P3) | Append-only answer events + claim/evidence axes + branch closure + decision-trace + Level-1 checkpoint markers; never promoted |
| `working/research/{slug}.md` | manager (P3 micro-loop) | Prior-art study for a design-bearing branch (Source / Insight / Why); never promoted |
| `working/promotion-manifest.md` | manager (P5) | Per-output operation, routing, exact destination, per-touched-path preimage, supersession/archive plan |
| `working/preimages/{slug}` | manager (P5) | Restorable original bytes of each pre-existing edited/moved path (a `git hash-object` blob ref or a byte copy) — the recovery source (§9 step 5) |
| `working/evaluation/iter{n}/{claude,codex}/{project,structure,performance,aesthetics,usage,consistency,risk,overall,checklist}.md` | evaluator ×2 systems (P6.5) | P6.5 dual-system gate evidence — nine record-level files per system (7 perspectives + `overall` + filled `checklist`); never promoted |
| `staging/{decisions,design,references,rules,learnings}/{slug}.md` | manager (P4) | Project-scoped atomic typed drafts + mistake-candidates (in `decisions/`) |
| `staging/indexes/project-README.md` | manager (P4) | Root living-index candidate (frontmatter-less); reviewed at P5, promoted at P7 after P6.5 PASS |
| `staging/backlogs/{feature,project}/{slug}.md` | manager (P4) | Deferrals with a pick-up trigger |
| `staging/features/{feature-name}/README.md` | manager (P4) | Feature living-index candidate; reviewed at P5, promoted at P7 after P6.5 PASS |
| `staging/features/{feature-name}/{type}/{slug}.md` | manager (P4) | Per-feature drafts, each carrying a staging-time `feature:` field |
| `outputs/startup-summary.md` | manager (P5 create → P6 update paths → P7 stamp) | Completion marker + promoted paths + open questions + rerun triggers — record-level, live-session-only; field lifecycle in [`recording.md`](recording.md) §13 |

#### Memory-level promotion destinations — the durable project reference

Across the startup-close gate startup writes ONLY the exact durable destinations approved in
`working/promotion-manifest.md`, each with a one-to-one record-level source: the atomic typed project or
feature records at P6, and the root `README.md` + ratified feature `README.md` indexes (the completion
predicate) at P7 after the P6.5 gate PASSES — routed per [`recording.md`](recording.md) §5. A skill-owned
mistake is NOT a destination — startup edits no skill, so it is handed off as a decision/backlog record
([`recording.md`](recording.md) §5). Startup never writes a project `plans/` record and never promotes its
own raw log, ledger, research, manifest, or summary. The full staging→destination contract, path
conventions, and promotion steps are in [`recording.md`](recording.md).

---

## References

Each entry names one owner and the specific claim in this skill it validates. To audit a fact, find its
claim here and follow the single owner link.

- [`discussion/SKILL.md`](../discussion/SKILL.md) § Question Card Structure + § Decision Classification —
  validates: the active-runtime question-card form and the Always-Ask handling used at every startup user
  gate (P1–P7; the P3 design-decision recommendation + gate; the promotion Always-Ask gate).
- [`research/SKILL.md`](../research/SKILL.md) § Internal Research + § External Research — validates: the
  prior-art study step of the P3 design-decision micro-loop — internal grep + external WebSearch/WebFetch,
  captured in the Source / Insight / Why format.
- [`evaluation/SKILL.md`](../evaluation/SKILL.md) § Phase-specific focus — validates: the shared
  dual-system evaluation procedure the P6.5 baseline gate runs (two systems × seven perspectives + Overall,
  reconciled verdict) and its recognition of `startup` as a non-loop evaluation target. The startup-specific
  frame it consumes is the sibling [`scenario.md`](scenario.md) + [`checklist.md`](checklist.md) +
  [`evaluation.md`](evaluation.md) bundle authored in this skill directory.
- [`memory/rules.md`](../memory/rules.md) § 1.5 + § 2 + § 2.6 + § 4.2 — validates: area resolution for every
  by-area destination, the memory-file frontmatter standard, the staging-field strip on promotion, and the
  per-type section contracts that the staged and promoted records follow (Rules; Procedure; the
  staging→destination contract).
- [`memory/templates/`](../memory/templates/) — validates: each typed record's frontmatter additions and
  body contract; startup stamps the matching template owner rather than copying it (P4 synthesis).
- [`record/record-map.md`](../record/record-map.md) § Canonical session tree + § Wrap-up promotion-inventory
  rule — validates: the numbered-loop session boundary that startup's own `startup/` surface sits outside,
  and the rule that only enumerated staging surfaces are promotion sources (the Memory Access Matrix; the
  Wrap-up-excludes-`startup/` boundary).
- [`wrap-up/SKILL.md`](../wrap-up/SKILL.md) § Staging → Memory routing — validates: the shared promotion
  rules and the standing post-promotion guards that startup follows by reference while running its own
  distinct startup-close procedure (P5–P6; the "does not invoke Wrap-up" boundary).
- [`skill-writing/SKILL.md`](../skill-writing/SKILL.md) — validates: the six-section skill form, the
  child-doc split into `topics.md` + `recording.md`, and the claim-owner register shape used here.
- [`gobbi/SKILL.md`](../gobbi/SKILL.md) § Session Bootstrap Order — validates: Configuration's
  empty/sparse-memory trigger that loads startup on-demand, and the return point after startup closes (Intro;
  P7 close).
