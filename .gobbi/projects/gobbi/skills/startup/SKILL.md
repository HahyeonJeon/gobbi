---
name: startup
description: "Use when starting a new project, when the project's memory is empty/sparse, or for an explicit baseline reset — runs the manager's structured startup talk and writes the project baseline docs (vision, users, features, experience, architecture, conventions, risks)."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
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

> **Dependency comes before detail.**

Problem, users, outcomes, and boundary give the product its shape; the product shape then constrains
the system shape. Walking the talk in that order stops a late technical choice from silently redefining
an earlier product decision.

> **Evidence comes before assertion.**

Observed behavior and verified facts separate what is real today from what is only hoped or assumed.
Marking each answer by its evidence strength keeps a plausible guess from hardening into a false
foundation the whole baseline rests on.

> **One answer can have many typed effects.**

The conversation follows dependencies, but the durable record follows the kind and scope of each
concept. A single answer can refine several distinct records — one per concept — without ever bundling
unrelated ideas into one document.

> **A transcript is not memory.**

Raw conversation is an audit trail, not a reference. Durable memory is a separate synthesis that stands
on its own for a reader who never saw the talk. The two are different layers with different lifetimes.

> **The current reference beats historical accumulation.**

A baseline review tests the existing claims and classifies each change; it never stacks a new layer of
prose over an outdated one. Keeping one current, coherent reference is worth more than a growing pile of
half-true history.

> **The user owns product intent.**

The manager investigates, challenges, and recommends; the user decides. Product direction, scope, binding
rules, and which capabilities become durable features are the user's calls, and no durable write happens
without the user's approval.

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

Startup runs seven phases in order. Read [`topics.md`](topics.md) before asking any topic question — it
holds the full Level-1/Level-2 question tree plus the traversal, checkpoint, and mandatory-coverage rules.
Read [`recording.md`](recording.md) before creating a staged draft, building the manifest, promoting,
resuming an interrupted run, or reviewing an existing baseline — it holds the capture model, the
staging→destination contract, and the startup-close promotion procedure.

### The 7-phase talk

| Phase | Manager action | User gate | Output / exit |
|---|---|---|---|
| **P1 — Detect, classify & bound** | Run the read-only resume classifier in [`recording.md`](recording.md). Confirm the trigger, lifecycle, and first-run vs resume vs rerun, and confirm no productive loop is active. Inventory existing baseline docs and verified repo facts. For standalone use, create the `startup/` session scaffold only AFTER classification and scope confirmation. | Confirm startup scope + decision authority; on an in-progress dir, choose resume or restart | Startup contract, resolved lifecycle state, existing-doc inventory, coverage matrix |
| **P2 — Establish current reality** | Traverse Topic 1 in [`topics.md`](topics.md) (including 1.4 license/distribution/governance). Separate verified repo facts from claims, assumptions, and unknowns. Append every answer to the ledger. | Confirm the current-state summary | Evidence register + initial doc effects; P3 stays closed until confirmation |
| **P3 — Traverse the tree** | Walk Topics 2–11 in order from [`topics.md`](topics.md): one question per turn, evidence-led smart-skip, adaptive probes. Write a resumable checkpoint marker at each Level-1 close. | Confirm each Level-1 checkpoint | Answer ledger: every required branch `confirmed` / `proven-irrelevant` / `recorded-open` |
| **P4 — Synthesize staged docs** | Follow [`recording.md`](recording.md): convert confirmed answers into atomic typed drafts under the session staging tree using the staging→destination contract; stamp the matching memory template. No durable write. | Surface gaps; never fill them by inference | Complete session-local staging set |
| **P5 — Reconcile, challenge & pre-write validate** | Run the cross-topic contradiction pass and a jargon-free final challenge per [`recording.md`](recording.md). Build the promotion manifest. Validate the WHOLE approved set and pre-compute every destination, collision, supersession, and archive move — dry-run, no durable write. | Confirm corrections + the final manifest | One approved, whole-set-valid promotion plan |
| **P6 — Promote baseline (startup-owned)** | Ask the final Always-Ask baseline-write question. Then run startup's promotion procedure in [`recording.md`](recording.md): safe-order write → verify every path → post-write standing guards. On any failure, HALT and present the recorded partial-state recovery. | **Always-Ask** final baseline write | All destinations written, guard-green, and path-verified — OR a surfaced partial-state recovery |
| **P7 — Close** | Write the startup summary (promoted paths, completion marker, unresolved questions, rerun triggers). Resume Configuration or apply the standalone exit contract in [`recording.md`](recording.md). | User acknowledges the baseline summary | Later phases can read the confirmed baseline |

**Phase gates:**
- No P3 before the current-state summary is confirmed.
- No feature or architecture synthesis before Topics 2–5 are confirmed.
- No durable write until the whole set passes the P5 pre-write validation.
- No rule promoted without explicit user confirmation.
- No feature directory for a task, sprint, speculative idea, or internal mechanism.
- No secret promoted.
- No completion while any in-scope Level-2 branch is neither answered, proven irrelevant, nor recorded
  open with an owner.

### Memory Access Matrix

Startup writes session evidence throughout, and — only at the P6 startup-close gate — a bounded set of
durable destinations named in the approved manifest. It is a named bounded pre-Wrap-up memory writer.

| Surface | Access before P6 | Access at P6–P7 | Boundary |
|---|---|---|---|
| **Repository + existing project reference** | **READ-ONLY** | **READ + bounded WRITE** for approved manifest destinations only | P6 is startup's named startup-close exception; no unlisted durable path is writable |
| **`sessions/{date}-{session-id}/startup/working/`** | **READ + WRITE** | **READ + WRITE** | Raw log, answer ledger, promotion manifest — session evidence, never promoted |
| **`sessions/{date}-{session-id}/startup/staging/`** | **READ + WRITE** | **READ-ONLY source** while promoting | Only synthesized typed drafts + living-index candidates live here |
| **`sessions/{date}-{session-id}/startup/outputs/`** | **READ + WRITE** | **READ + WRITE** | The startup summary is session evidence, not a memory doc |
| **Project / feature memory outside approved destinations** | **READ-ONLY** | **READ-ONLY** | Existing memory informs classification + collision checks; only the manifest grants the P6 write set |
| **Skill sources + memory templates** | **READ-ONLY** | **READ-ONLY** | Startup stamps or proposes against owners; it creates or edits no skill and no template |

**Delete semantics:** delete authority is never granted. A planned supersession writes a new record, flips
the old record's status in place, and moves the old file to `archive/{type}/{area}/` — it is never
deleted. A standalone run may create its minimal `session.json` and the `startup/` scaffold; it adds no
productive-loop entries.

### Output paths

Before promotion, startup writes only these session surfaces (all under
`sessions/{date}-{session-id}/startup/`):

| Path | Written by | Purpose |
|---|---|---|
| `working/discussion-log.md` | manager (P2–P3) | Raw conversation audit; never promoted |
| `working/answer-ledger.md` | manager (P2–P3) | Structured answers + statuses + evidence + effects + follow-ups + Level-1 checkpoint markers; never promoted |
| `working/promotion-manifest.md` | manager (P5) | Per-output operation, routing, exact destination, supersession/archive plan |
| `staging/{decisions,design,references,rules,learnings}/{slug}.md` | manager (P4) | Project-scoped atomic typed drafts + mistake-candidates (in `decisions/`) |
| `staging/backlogs/{feature,project}/{slug}.md` | manager (P4) | Deferrals with a pick-up trigger |
| `staging/features/{feature-name}/{type}/{slug}.md` | manager (P4) | Per-feature drafts, each carrying a staging-time `feature:` field |
| `outputs/startup-summary.md` | manager (P7) | Completion marker + verified promoted paths + open questions + rerun triggers |

At P6 startup writes only the exact durable destinations approved in `working/promotion-manifest.md`: the
root `README.md`, ratified feature `README.md` indexes, and atomic typed project or feature records routed
per [`recording.md`](recording.md). Startup never writes a project `plans/` record and never promotes its
own raw log, ledger, manifest, or summary. The full staging→destination contract, path conventions, and
promotion steps are in [`recording.md`](recording.md).

---

## References

Each entry names one owner and the specific claim in this skill it validates. To audit a fact, find its
claim here and follow the single owner link.

- [`discussion/SKILL.md`](../discussion/SKILL.md) § Question Card Structure + § Decision Classification —
  validates: the active-runtime question-card form and the Always-Ask handling used at every startup user
  gate (P1–P7; the promotion Always-Ask gate).
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
