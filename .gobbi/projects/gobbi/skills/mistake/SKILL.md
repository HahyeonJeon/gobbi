---
name: mistake
description: "MUST load before agent work. Checks known mistakes, stages mistake-candidates after corrections, and defers promotion to Wrap-up."
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Mistake

Skill for every agent in every role. Loaded as the first domain skill in the Load Directives block of every delegation prompt. Its discipline spans two directions: **check before acting** (so known pitfalls are avoided) and **write immediately after correction** (so the correction survives across sessions).

The model is **staging → promotion**. During the working loops, agents write mistake-candidates to session staging only. Promotion to memory (`mistakes/` directories) is performed by agents during the Wrap-up phase (no CLI command). Working-loop agents never write directly to memory; the Wrap-up assistant performing promotion during Wrap-up is the documented sole exception.

---

## Memory Access Matrix

The agent MUST observe these tier boundaries. For working-loop agents, the only write surface is session staging. The Wrap-up assistant is the sole exception: it writes promoted candidates to project or feature `mistakes/` during the Wrap-up phase.

| Memory tier | Path root | Access |
|---|---|---|
| **Project mistakes — project-level** | `.gobbi/projects/{project-name}/mistakes/` | **READ-ONLY** — load at the start of any work; never written by working-loop agents (Wrap-up assistant is the sole exception) |
| **Feature mistakes** | `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` | **READ-ONLY** — load when the task is feature-scoped; never written by working-loop agents (Wrap-up assistant is the sole exception) |
| **Session staging** | `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` with frontmatter `mistake-candidate: true` | **WRITE (PASS only, during RECORD)** — the only surface agents write to; Wrap-up promotes to project or feature `mistakes/` based on scope confirmed with user |

**Delete semantics**: agents NEVER delete mistake files in any tier. When a mistake is superseded, the new file carries `supersedes: <old-path>` frontmatter; the old file has its `status:` flipped to `superseded` + `superseded_by: <new-path>` added. Physical deletion is forbidden. **Active mistakes never move** — the trap stays live in `mistakes/` where agents load it and where `required-mistakes:` paths point. Only a **superseded** mistake is moved (`git mv`) by Wrap-up to `archive/mistakes/{YYYY-MM-DD}-{slug}.md` per the move-on-terminal model in [`memory/templates/archive.md`](../memory/templates/archive.md).

> **Namespace-refactor carve-out (USER-APPROVED 2026-06-21):** the "never move" rule governs NORMAL operation — only a supersession (→ `archive/`) moves a file. A deliberate **namespace refactor is a distinct, sanctioned operation** that MAY move active mistakes between areas while preserving slug identity: the mistake's own `name` slug, body `[[slug]]` links, and `supersedes`/`superseded_by`/`related` frontmatter are plain slugs (rename-robust — they survive the move untouched). What does NOT survive: inbound **`required-mistakes:` references are PATH refs, not slugs**, so they break on the move and MUST be repointed — the refactor procedure repoints every inbound `required-mistakes:` path ref and runs both guards (`check-markdown-links.sh` + `check-residual-vocab.sh`) to zero.

**Promotion**: The Wrap-up assistant promotes staged mistake-candidates to memory during the Wrap-up phase (no CLI command). Promotion is NOT a context reload — agents do not re-read project mistakes after promotion; they read them at the start of the next session.

---

## Core Principles

> **Check before acting.**

Every agent reads the applicable mistakes before starting any non-trivial work. Mistakes are the highest-density knowledge in the system — a mistake read is a mistake avoided.

> **Write immediately after correction.**

When the user or an evaluator corrects an approach, the agent stages a mistake-candidate before the session ends. A correction not staged is a correction that will repeat across sessions.

> **Include WHY and HOW-TO-APPLY.**

A mistake without its cause and recovery pattern is unactionable. Every mistake entry must state: (1) what went wrong; (2) why it went wrong (the mistaken assumption); (3) how to recognize the situation before making the same mistake; (4) the corrected approach.

> **Promotion happens during the Wrap-up phase — working-loop agents do not promote.**

The Wrap-up assistant promotes staged mistake-candidates from session staging to memory (`mistakes/`) during the Wrap-up phase. Working-loop agents write to session staging only and never write directly to `mistakes/`. The Wrap-up phase is the sole documented exception to the staging boundary.

> **Supersede, never delete. Active mistakes never move (except a sanctioned namespace refactor).**

When a new mistake supersedes an older one (new understanding overrides the prior correction), write the new mistake with a `supersedes:` frontmatter pointer, and flip the older file's frontmatter in place (`status: superseded`, `superseded_by: <new-path>`). Physical deletion is forbidden. The in-place flip is step 1 of two: at session Wrap-up, the now-superseded mistake is moved (`git mv`) to `archive/mistakes/{YYYY-MM-DD}-{slug}.md` — it is never deleted, never left in `mistakes/` once superseded. **Active** mistakes never move — the trap must remain live in `mistakes/` where agents load it and where `required-mistakes:` paths point.

> **Namespace-refactor carve-out (USER-APPROVED 2026-06-21):** the "never move" rule governs NORMAL operation — only a supersession (→ `archive/`) moves a file. A deliberate **namespace refactor is a distinct, sanctioned operation** that MAY move active mistakes between areas while preserving slug identity: the mistake's own `name` slug, body `[[slug]]` links, and `supersedes`/`superseded_by`/`related` frontmatter are plain slugs (rename-robust — they survive the move untouched). What does NOT survive: inbound **`required-mistakes:` references are PATH refs, not slugs**, so they break on the move and MUST be repointed — the refactor procedure repoints every inbound `required-mistakes:` path ref and runs both guards (`check-markdown-links.sh` + `check-residual-vocab.sh`) to zero.

---

## Procedures

### P1 — Load mistakes before starting work

At the start of any task:

1. Read `.gobbi/projects/{project-name}/mistakes/*.md` — all project-level mistake files.
2. If the task is feature-scoped: read `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/*.md`.
3. Filter by domain relevance — load mistakes whose domain tag matches the task's domain (e.g., `docs-sync`, `process`, `security`, `hooks`).
4. Note any applicable mistakes explicitly in the Study phase before making any decision in that domain.

**Do not skim.** A mistake that is not read is a mistake that repeats.

### P2 — Detect a correction during work

During work (any phase), a correction is any of:

- The user explicitly saying an approach is wrong and providing the right one.
- An evaluator finding of type `design_flaw` or `assumption_risk` with confidence ≥ 75 that reveals a repeating pattern.
- A wrong assumption the agent itself caught before the user noticed — record it; the discipline is the same.

When a correction occurs:

1. Stop and acknowledge it — do not silently adjust and continue.
2. Note it as a mistake-candidate with: what went wrong, why (the mistaken assumption), how to recognize it next time, the corrected approach.
3. Write the candidate note **immediately** — do not defer to RECORD. If the session is interrupted before RECORD runs, deferred notes are lost. This is the moment-of-capture discipline; see [`record/SKILL.md` § Core Principles § Moment-of-capture](../record/SKILL.md#core-principles) for the rationale and empirical witness.

### P3 — Stage a mistake-candidate during RECORD

During RECORD on PASS:

1. For each correction noted during P2, write a staging file at `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md`.
2. Stamp the file with the `decisions.md` template from `memory/templates/decisions.md`.
3. Set frontmatter `mistake-candidate: true`.
4. Body must contain all four elements: what went wrong / why / how to recognize / corrected approach.
5. Add a `domain:` frontmatter tag matching the mistake's domain (e.g., `docs-sync`, `process`, `security`, `hooks`).

The slug is kebab-case derived from the primary symptom — not from "mistake" or the domain tag.

### P4 — Wrap-up-phase promotion

During the Wrap-up phase, the Wrap-up assistant promotes staged mistake-candidates from session staging into `mistakes/`. The next session's P1 load will pick them up. Working-loop agents never perform promotion themselves — staging is their sole write surface during the working loops.

**`mistake-candidate` is a staging-only flag, stripped on promotion.** The `mistake-candidate: true` frontmatter is a **staging-only** routing flag — its sole job is to tell Wrap-up to route a `staging/decisions/{slug}.md` file to `mistakes/` rather than `decisions/`. Once it has routed the file, its job is done: Wrap-up **strips** it when writing the promoted mistake, so a promoted mistake file in `mistakes/` does NOT carry `mistake-candidate`. The promoted file carries only the base + mistakes-type extension frontmatter ([`memory/rules.md` § 2`](../memory/rules.md)). This is the reciprocal of the Wrap-up frontmatter-allowlist step (see [`wrap-up/SKILL.md` § Frontmatter allowlist on promotion](../wrap-up/SKILL.md)). A promoted mistake file that still carries `mistake-candidate: true` is a frontmatter-strip miss, not a valid state.

---

## Constraints

- **MUST load before any non-trivial work** — every delegation prompt's Load Directives block includes the `mistake` skill at position 3 (after `principles` and project rules).
- **MUST read applicable mistakes at Study phase** — do not skip, do not filter to "what seems relevant today."
- **MUST stage immediately after correction** — do not defer to the end of the loop; do not assume the session will complete normally.
- **MUST NOT write directly to `mistakes/`** — working-loop agents never write to memory; only the Wrap-up assistant writes to it (by promoting staged candidates during Wrap-up).
- **MUST NOT delete** — supersede via frontmatter; physical deletion of any mistake file is forbidden.
- **MUST include all four elements in every mistake entry** — what / why / how-to-recognize / corrected approach. Missing elements make the mistake unactionable.

---

## Output paths

Staging-phase writes during RECORD follow the routing defined in `evaluation/SKILL.md` § Finding Metadata → Domain `process`.

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{N}-{loop}/staging/decisions/{slug}.md` (with `mistake-candidate: true`) | assistant (RECORD) | PASS only — one file per mistake-candidate, stamped with `decisions.md` template |

Wrap-up reads these staging files and promotes to the destination based on user-confirmed scope:

| Scope (user-confirmed) | Destination |
|---|---|
| Feature-scoped mistake | `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/{slug}.md` |
| Project-scoped mistake | `.gobbi/projects/{project-name}/mistakes/{slug}.md` |

**Path conventions**

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — runtime session ID resolved by the manager during Configuration and supplied by the delegation prompt's `session-id:` header field (the parent session's id). Use `CLAUDE_CODE_SESSION_ID` for Claude Code and `CODEX_THREAD_ID` for native Codex. Do NOT read runtime env vars from spawned subagents for this value: in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's — use the parent session id supplied by the manager.
- `{loop}` — the loop during which the mistake was staged (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`). On disk the loop dir carries the `{N}-` ordinal prefix (`1-ideation` … `5-wrap-up`); the `workflow.{loop}` keys in `session.json` stay **bare** (SEAM-3 — see [`record/record-map.md`](../record/record-map.md))
- `{N}` — the loop's fixed ordinal (`1`=ideation, `2`=preparation, `3`=planning, `4`=execution, `5`=wrap-up); the on-disk loop-dir prefix
- `{slug}` — kebab-case derived from the mistake's primary symptom (≤ 60 characters)
- `{project-name}` — project slug from `session.json.project`
- `{feature-name}` — feature slug from `session.json.feature`
