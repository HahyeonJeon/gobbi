---
name: mistake
description: "MUST load before starting any work in any agent. Defines the cross-session mistake recording model: check existing mistakes before acting, stage new mistake-candidates immediately after corrections, and promote via `gobbi mistake promote` — never write directly to project memory."
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Mistake

Skill for every agent in every role. Loaded as the first domain skill in the Load Directives block of every delegation prompt. Its discipline spans two directions: **check before acting** (so known pitfalls are avoided) and **write immediately after correction** (so the correction survives across sessions).

The model is **staging → promotion**. Agents write mistake-candidates to session staging only. Promotion to project memory (`mistakes/` directories) happens via `gobbi mistake promote` after the session ends — agents never write directly to project memory.

---

## Memory Access Matrix

The agent MUST observe these tier boundaries. The only write surface is session staging.

| Memory tier | Path root | Access |
|---|---|---|
| **Project mistakes — project-level** | `.gobbi/projects/{project-name}/mistakes/` | **READ-ONLY** — load at the start of any work; never written by agents |
| **Feature mistakes** | `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/` | **READ-ONLY** — load when the task is feature-scoped; never written by agents |
| **Session staging** | `sessions/{date}-{session-id}/{loop}/staging/decisions/{slug}.md` with frontmatter `mistake-candidate: true` | **WRITE (PASS only, during MEMORIZATION)** — the only surface agents write to; Wrap-up promotes to project or feature `mistakes/` based on scope confirmed with user |

**Delete semantics**: agents NEVER delete mistake files in any tier. When a mistake is superseded, the new file carries `supersedes: <old-path>` frontmatter; the old file is updated in place with `status: superseded` + `superseded_by: <new-path>`.

**Promotion**: `gobbi mistake promote` runs outside the session (post-session). Promotion is NOT a context reload — agents do not re-read project mistakes after promotion; they read them at the start of the next session.

---

## Core Principles

> **Check before acting.**

Every agent reads the applicable mistakes before starting any non-trivial work. Mistakes are the highest-density knowledge in the system — a mistake read is a mistake avoided.

> **Write immediately after correction.**

When the user or an evaluator corrects an approach, the agent stages a mistake-candidate before the session ends. A correction not staged is a correction that will repeat across sessions.

> **Include WHY and HOW-TO-APPLY.**

A mistake without its cause and recovery pattern is unactionable. Every mistake entry must state: (1) what went wrong; (2) why it went wrong (the mistaken assumption); (3) how to recognize the situation before making the same mistake; (4) the corrected approach.

> **Promotion is a separate command — agents do not promote.**

`gobbi mistake promote` is the user-facing command that moves staged mistake-candidates from session staging to project memory. Agents never call it and never write directly to `mistakes/`. The staging boundary is non-negotiable.

> **Supersede, never delete.**

When a new mistake supersedes an older one (new understanding overrides the prior correction), write the new mistake with a `supersedes:` frontmatter pointer, and update the older file's frontmatter in place (`status: superseded`, `superseded_by: <new-path>`). Physical deletion is forbidden.

---

## Procedures

### P1 — Load mistakes before starting work

At the start of any task:

1. Read `.gobbi/projects/{project-name}/mistakes/*.md` — all project-level mistake files.
2. If the task is feature-scoped: read `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/*.md`.
3. Filter by domain relevance — load mistakes whose domain tag matches the task's domain (e.g., `docs-sync`, `process`, `security`).
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
3. Do not defer to MEMORIZATION — write the candidate note immediately so it survives if the session is interrupted.

### P3 — Stage a mistake-candidate during MEMORIZATION

During MEMORIZATION on PASS:

1. For each correction noted during P2, write a staging file at `sessions/{date}-{session-id}/{loop}/staging/decisions/{slug}.md`.
2. Stamp the file with the `decisions.md` template from `memorization/templates/decisions.md`.
3. Set frontmatter `mistake-candidate: true`.
4. Body must contain all four elements: what went wrong / why / how to recognize / corrected approach.
5. Add a `domain:` frontmatter tag matching the mistake's domain (e.g., `docs-sync`, `process`, `security`).

The slug is kebab-case derived from the primary symptom — not from "mistake" or the domain tag.

### P4 — Reference the promotion command

After `gobbi mistake promote` runs (outside the session), staged mistake-candidates appear in `mistakes/`. The next session's P1 load will pick them up. Agents never invoke `gobbi mistake promote` themselves and do not need to track whether it has run.

---

## Constraints

- **MUST load before any non-trivial work** — every delegation prompt's Load Directives block includes the `mistake` skill at position 3 (after `principles` and project rules).
- **MUST read applicable mistakes at Study phase** — do not skip, do not filter to "what seems relevant today."
- **MUST stage immediately after correction** — do not defer to the end of the loop; do not assume the session will complete normally.
- **MUST NOT write directly to `mistakes/`** — project memory is read-only for all agents; only Wrap-up (via staging promotion) touches it.
- **MUST NOT delete** — supersede via frontmatter; physical deletion of any mistake file is forbidden.
- **MUST include all four elements in every mistake entry** — what / why / how-to-recognize / corrected approach. Missing elements make the mistake unactionable.

---

## Output paths

Staging-phase writes during MEMORIZATION follow the routing defined in `evaluation/SKILL.md` § Finding Metadata → Domain `process`.

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{loop}/staging/decisions/{slug}.md` (with `mistake-candidate: true`) | assistant (MEMORIZATION) | PASS only — one file per mistake-candidate, stamped with `decisions.md` template |

Wrap-up reads these staging files and promotes to the destination based on user-confirmed scope:

| Scope (user-confirmed) | Destination |
|---|---|
| Feature-scoped mistake | `.gobbi/projects/{project-name}/features/{feature-name}/mistakes/{slug}.md` |
| Project-scoped mistake | `.gobbi/projects/{project-name}/mistakes/{slug}.md` |

**Path conventions**

- `{date}` — session start date in `YYYY-MM-DD`
- `{session-id}` — Claude Code session ID from `$CLAUDE_CODE_SESSION_ID`
- `{loop}` — the loop during which the mistake was staged (`ideation` / `preparation` / `planning` / `execution` / `wrap-up`)
- `{slug}` — kebab-case derived from the mistake's primary symptom (≤ 60 characters)
- `{project-name}` — project slug from `session.json.project`
- `{feature-name}` — feature slug from `session.json.feature`
