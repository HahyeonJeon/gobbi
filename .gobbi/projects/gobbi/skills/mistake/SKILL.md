---
name: mistake
description: "MUST load before agent work. Checks known mistakes, stages mistake-candidates after corrections, and defers promotion to Wrap-up."
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Mistake

Skill for every agent in every role. Loaded as the first domain skill in the Load Directives block owned by [`orchestration/delegation.md`](../orchestration/delegation.md). Its discipline spans two directions: **check before acting** (so known pitfalls are avoided) and **write immediately after correction** (so the correction survives across sessions).

The model is **staging → promotion**. During productive steps, agents write mistake-candidates to session staging only. Promotion to memory (`mistakes/` directories) is performed during Wrap-up (no separate command). Productive-step agents never write directly to memory; Wrap-up is the sole durable-memory writer.

---

## Memory Access Matrix

The moved Gobbi dispatch trap companion is `skills/orchestration/mistakes.md`; the generic
`skills/delegation/` capability has no compatibility companion copy.

The agent MUST observe these tier boundaries. For productive-step agents, the only write surface is session staging. During Wrap-up, the promotion operation writes approved candidates to project or feature `mistakes/` or to a skill-owned `skills/{skill}/mistakes.md` home (the hybrid model; see the P4 routing modifier).

| Memory tier | Path root | Access |
|---|---|---|
| **Project mistakes — project-level** | `.gobbi/projects/{project-name}/mistakes/` | **READ-ONLY** during productive steps; written only by Wrap-up promotion |
| **Feature mistakes** | `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` | **READ-ONLY** during productive steps; written only by Wrap-up promotion |
| **Skill-surface mistakes — skill-owned home** | `.gobbi/projects/{project-name}/skills/{skill}/mistakes.md` (one `## ` section per trap; a skill-surface doc OUT of the memory frontmatter standard — [`memory/rules.md` § Scope boundary](../memory/rules.md)) | **READ when a task loads that skill** through the delegation companion path; written only by Wrap-up promotion. Never written during a productive step |
| **Session staging** | `{gobbi-session-root}/{N}-{step}/staging/decisions/{slug}.md`, or the current Execution task's `staging/decisions/{slug}.md`, with frontmatter `mistake-candidate: true` | **WRITE (PASS only, during RECORD)** — the only productive-step write surface; Wrap-up promotes according to the user-confirmed routing and scope in step 4 |

**Delete semantics**: agents NEVER delete mistake files in any tier. When a mistake is superseded, the new file carries `supersedes: <old-slug>` frontmatter; the old file has its `status:` flipped to `superseded` + `superseded_by: <new-slug>` added. Physical deletion is forbidden. **Active mistakes never move** under normal operation — the trap stays live in `mistakes/` where agents load it and where `required-mistakes:` paths point. Only a **superseded** mistake is moved (`git mv`) by Wrap-up to `archive/mistakes/{area}/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model in [`memory/templates/archive.md`](../memory/templates/archive.md). The only sanctioned active-file move is a deliberate namespace refactor (carve-out below).

> **Namespace-refactor carve-out (USER-APPROVED 2026-06-21):** the "never move" rule governs NORMAL operation — only a supersession (→ `archive/`) moves a file. A deliberate **namespace refactor is a distinct, sanctioned operation** that MAY move active mistakes between areas while preserving slug identity: the mistake's own `name` slug, body `[[slug]]` links, and `supersedes`/`superseded_by`/`related` frontmatter are plain slugs (rename-robust — they survive the move untouched). What does NOT survive: inbound **`required-mistakes:` references are PATH refs, not slugs**, so they break on the move and MUST be repointed. Inventory every reference class, repoint every inbound path, run the root-owned `scripts/check-markdown-links.sh`, run `skills/memory/scripts/validate-frontmatter.sh` over the moved records, run `skills/mistake/scripts/validate-skill-mistakes.sh` when a skill companion changes, and use scoped `rg` sweeps to prove every retired path and label is absent from active consumers.

**Promotion**: Wrap-up promotes staged mistake-candidates to memory (no separate command). Promotion is not a context reload—agents do not re-read project mistakes after promotion; they read them at the start of the next session.

---

## Core Principles

> **Check before acting.**

Every agent reads the applicable mistakes before starting any non-trivial work. Mistakes are the highest-density knowledge in the system — a mistake read is a mistake avoided.

> **Write immediately after correction.**

When the user or an evaluator corrects an approach, the agent stages a mistake-candidate before the session ends. A correction not staged is a correction that will repeat across sessions.

> **Include WHY and HOW-TO-APPLY.**

A mistake without its cause and recovery pattern is unactionable. Every mistake entry must state: (1) what went wrong; (2) why it went wrong (the mistaken assumption); (3) how to recognize the situation before making the same mistake; (4) the corrected approach.

> **Promotion happens during Wrap-up—productive-step agents do not promote.**

Wrap-up promotes staged mistake-candidates from session staging to memory (`mistakes/`). Productive-step agents write to session staging only and never write directly to `mistakes/`. Startup is read-only and has no promotion exception.

> **Supersede, never delete. Active mistakes never move except during a deliberate namespace refactor.**

When a new mistake supersedes an older one (new understanding overrides the prior correction), write the new mistake with a `supersedes:` frontmatter pointer, and flip the older file's frontmatter in place (`status: superseded`, `superseded_by: <new-slug>`). Physical deletion is forbidden. The in-place flip is step 1 of two: at session Wrap-up, the now-superseded mistake is moved (`git mv`) to `archive/mistakes/{area}/{YYYY-MM-DD}-{slug}.md` — it is never deleted, never left in `mistakes/` once superseded. **Active** mistakes never move — the trap must remain live in `mistakes/` where agents load it and where `required-mistakes:` paths point.

> **Namespace-refactor carve-out (USER-APPROVED 2026-06-21):** the "never move" rule governs NORMAL operation — only a supersession (→ `archive/`) moves a file. A deliberate **namespace refactor is a distinct, sanctioned operation** that MAY move active mistakes between areas while preserving slug identity: the mistake's own `name` slug, body `[[slug]]` links, and `supersedes`/`superseded_by`/`related` frontmatter are plain slugs (rename-robust — they survive the move untouched). What does NOT survive: inbound **`required-mistakes:` references are PATH refs, not slugs**, so they break on the move and MUST be repointed. Inventory every reference class, repoint every inbound path, run the root-owned `scripts/check-markdown-links.sh`, run `skills/memory/scripts/validate-frontmatter.sh` over the moved records, run `skills/mistake/scripts/validate-skill-mistakes.sh` when a skill companion changes, and use scoped `rg` sweeps to prove every retired path and label is absent from active consumers.

---

## Procedures

### 1. Load mistakes before starting work

At the start of any task:

1. Read `.gobbi/projects/{project-name}/mistakes/**/*.md` — all project-level mistake files. The glob MUST be recursive (`**/*.md`, or `find .../mistakes -name '*.md'`): mistakes nest one area level under the type dir (`mistakes/{area}/{slug}.md`), so a single-level `mistakes/*.md` glob silently misses every by-area file and the agent loads mistake-blind.
2. If the task is feature-scoped: read `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/**/*.md` — recursively, for the same reason (feature mistakes also nest under `{area}/`).
3. Read each `skills/{skill}/mistakes.md` skill-companion that the task's loaded skills bring in — the skill-owned mistakes home (the hybrid model). A spawned subagent has no Skill tool, so this load is wired as a delegation Load-Directives **companion path**: every brief that lists `skills/{skill}/SKILL.md` ALSO lists `skills/{skill}/mistakes.md`, and the subagent READs it. The project tier (steps 1-2) loads session-start-wide; the skill companions load per the skills the task actually uses, so a skill-relevant trap arrives in the skill's own context.
4. Filter by domain relevance — load mistakes whose domain tag matches the task's domain (e.g., `docs-sync`, `process`, `security`, `hooks`).
5. Note any applicable mistakes explicitly before acting or making a decision in that domain.

**Do not skim.** A mistake that is not read is a mistake that repeats.

### 2. Detect a correction during work

During work at any stage, a correction is any of:

- The user explicitly saying an approach is wrong and providing the right one.
- An evaluator finding of type `design_flaw` or `assumption_risk` with confidence ≥ 75 that reveals a repeating pattern.
- A wrong assumption the agent itself caught before the user noticed — record it; the discipline is the same.

When a correction occurs:

1. Stop and acknowledge it — do not silently adjust and continue.
2. Note it as a mistake-candidate with: what went wrong, why (the mistaken assumption), how to recognize it next time, the corrected approach.
3. Write the candidate note **immediately** — do not defer to RECORD. If the session is interrupted before RECORD runs, deferred notes are lost. This is the moment-of-capture discipline; see [`record/SKILL.md` § Core Principles § Moment-of-capture](../record/SKILL.md#core-principles) for the rationale and empirical witness.

### 3. Stage a mistake-candidate during RECORD

During RECORD on PASS:

1. For each correction noted during step 2, write a staging file under the current Record-owned step or Execution-task `staging/decisions/{slug}.md` path.
2. Stamp the file with the `decisions.md` template from `memory/templates/decisions.md`.
3. Set frontmatter `mistake-candidate: true`.
4. Body must contain all four elements: what went wrong / why / how to recognize / corrected approach.
5. Add a `domain:` frontmatter tag matching the mistake's domain (e.g., `docs-sync`, `process`, `security`, `hooks`).

The slug is kebab-case derived from the primary symptom — not from "mistake" or the domain tag.

**Routing is deferred to step 4.** Staging records the candidate; the home—a skill-owned `skills/{skill}/mistakes.md` section or the cross-cutting project `mistakes/{area}/` tier—is chosen at Wrap-up promotion through an Always-Ask decision. Do not decide it at staging time. The `domain:` tag seeds the advisory `domain → skill` hint.

### 4. Promote during Wrap-up

During Wrap-up, the promotion operation moves approved mistake-candidates from session staging into a mistake home. The next session's load picks up the project tier through step 1 and a skill-owned home through the delegation companion path. Productive-step agents never perform promotion themselves.

**Skill-vs-project routing modifier (Always-Ask).** At promotion, each staged mistake-candidate routes to ONE of two homes (the hybrid model):

- **Skill-owned trap** → a `## ` section appended to `skills/{skill}/mistakes.md` (the owning skill's surface doc), loaded in that skill's context via the Load-Directives companion path.
- **Cross-cutting / no-owner trap** → stays in the project `mistakes/` tier at `mistakes/{area}/{slug}.md`, loaded at session start by step 1.

The choice is **Always-Ask** — the Wrap-up assistant surfaces "skill-owned (which skill?) vs cross-cutting" through the manager's user-decision primitive; a `domain → skill` hint map seeds it but is advisory. A trap that spans two skills goes to ONE section in the PRIMARY owner; the secondary skill gets a `### Related` cross-link only — never a duplicate. One record per trap, in exactly one home. The full routing procedure (and the skill-surface frontmatter allowlist) lives in [`wrap-up/promotion.md`](../wrap-up/promotion.md).

**`mistake-candidate` is a staging-only flag, stripped on promotion.** The `mistake-candidate: true` frontmatter is a **staging-only** routing flag — its sole job is to tell Wrap-up to route a `staging/decisions/{slug}.md` file to `mistakes/` rather than `decisions/`. Once it has routed the file, its job is done: Wrap-up **strips** it when writing the promoted mistake, so a promoted mistake file in `mistakes/` does NOT carry `mistake-candidate`. The promoted file carries only the base + mistakes-type extension frontmatter ([`memory/rules.md` § 2`](../memory/rules.md)). This is the reciprocal of the Wrap-up frontmatter-allowlist step (see [`wrap-up/promotion.md` § Frontmatter allowlist on promotion](../wrap-up/promotion.md#frontmatter-allowlist-on-promotion)). A promoted mistake file that still carries `mistake-candidate: true` is a frontmatter-strip miss, not a valid state.

### 5. Validate skill-owned homes

After creating or changing a skill-owned `skills/{skill}/mistakes.md` home, run `skills/mistake/scripts/validate-skill-mistakes.sh <file> ...`. Use `--all` for a complete skill-surface audit. This Mistake-owned gate checks the light file header, active-section structure and metadata, anchor uniqueness, and the wikilink and bare-path reference classes that `scripts/check-markdown-links.sh` does not inspect. A validation failure blocks completion.

---

## Constraints

- **MUST load before any non-trivial work** — every delegation prompt's Load Directives block includes the `mistake` skill at position 3 (after `principles` and project rules).
- **MUST read applicable mistakes before acting** — do not skip, do not filter to "what seems relevant today."
- **MUST stage immediately after correction** — do not defer to the end of the loop; do not assume the session will complete normally.
- **MUST NOT write directly to `mistakes/`** — productive-step agents never write to memory; only Wrap-up promotion writes to it.
- **MUST NOT delete** — supersede via frontmatter; physical deletion of any mistake file is forbidden.
- **MUST include all four elements in every mistake entry** — what / why / how-to-recognize / corrected approach. Missing elements make the mistake unactionable.

---

## Output paths

RECORD writes follow the routing defined in `evaluation/SKILL.md` § Finding Metadata → Domain `process`.

| Path | Written by | Written |
|---|---|---|
| `{gobbi-session-root}/{N}-{step}/staging/decisions/{slug}.md` (non-Execution, with `mistake-candidate: true`) | assistant (RECORD) | PASS only — one file per mistake-candidate, stamped with `decisions.md` template |
| `{gobbi-session-root}/3-execution/task-{NN}-{task-slug}/staging/decisions/{slug}.md` (Execution task, with `mistake-candidate: true`) | assistant (RECORD) | PASS only — one file per mistake-candidate, stamped with `decisions.md` template |

Wrap-up reads these staging files and promotes to the destination based on the user-confirmed routing (skill-owned vs cross-cutting, step 4) and scope:

| Routing / scope (user-confirmed) | Destination |
|---|---|
| Skill-owned mistake (the owning skill is confirmed) | `.gobbi/projects/{project-name}/skills/{skill}/mistakes.md` — appended as a `## ` section (the skill-surface home; the hybrid model). Loaded via the Load-Directives companion path, not by step 1 |
| Cross-cutting, feature-scoped mistake | `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/{area}/{slug}.md` |
| Cross-cutting, project-scoped mistake | `.gobbi/projects/{project-name}/mistakes/{area}/{slug}.md` |

**Path conventions**

- `{gobbi-session-root}` — the absolute session root supplied by the manager and named by the Gobbi-owned UUID; never derive it from a runtime ID or environment variable
- `{step}` — the persisted v3 step (`ideation`, `planning`, `execution`, or `wrap-up`)
- `{N}` — the step's fixed ordinal (`1`=ideation, `2`=planning, `3`=execution, `4`=wrap-up)
- `{NN}` / `{task-slug}` — the canonical plan-locked Execution task identity
- `{slug}` — kebab-case derived from the mistake's primary symptom (≤ 60 characters)
- `{project-name}` — project slug from `session.json.project`
- `{feature-name}` — feature slug from `session.json.feature`
