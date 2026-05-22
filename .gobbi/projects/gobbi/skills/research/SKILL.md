---
name: research
description: MUST load when researching internal codebase or external prior art to inform downstream design choices. Defines what targets to investigate, what procedure to follow for each surface (internal / external), and what artifacts the research produces.
allowed-tools: Read, Grep, Glob, Bash, WebSearch, WebFetch, Write
---

# Research

Skill for **research** activities — investigating internal and external surfaces to extract insights that anchor downstream design choices. Loaded by whichever agent needs to do reference-rich investigation before deciding direction: typically the Ideation Loop's leader during Sub-step C, and occasionally the Preparation Loop's leader when verifying readiness against external prior art.

Internal and external research surfaces are managed **independently** — each must be sufficiently deep on its own before any design decision is made. The thinking pattern is **research → consult → design**: insights are not just collected, they actively inform every downstream choice.

---

## Memory Access Matrix

The agent in the leader role (or any role that loads this skill) MUST observe these tier boundaries. Research writes only to the calling loop's session memory.

| Memory tier | Path root | Access from research |
|---|---|---|
| **Session memory — calling loop's rawdata** | `sessions/{date}-{session-id}/{loop}/rawdata/` | **READ + WRITE** — internal insights integrated into `rawdata/draft-iter{n}.md`; per-external-reference files written to `rawdata/research/{slug}.md` |
| **Session memory — calling loop's staging** | `sessions/{date}-{session-id}/{loop}/staging/` | **READ-ONLY during WORK** — the assistant (MEMORIZATION) promotes rawdata/research/ to `staging/references/` on PASS; the leader does not write to staging directly |
| **Workspace codebase** | The repository under analysis | **READ-ONLY** — internal research reads files, types, tests, git history; never modifies code |
| **Feature memory** | `.gobbi/projects/{project-name}/features/{feature-name}/` | **READ-ONLY** — mistakes, decisions, design, scenarios, checklists provide internal context |
| **Project memory** | `.gobbi/projects/{project-name}/{mistakes,rules,design,notes,backlogs,references,decisions,plans,reviews,reports,learnings,archive,skills}/` | **READ-ONLY** — required for project-wide internal context. Never written; Wrap-up owns project-memory writes |
| **External sources** | URLs / documentation / RFC / blog posts / open-source repositories | **READ-ONLY (via WebSearch / WebFetch)** — external research surfaces; cite stable anchors |
| **Session memory — `session.json`** | `sessions/{date}-{session-id}/session.json` | **FORBIDDEN** — research never reads or writes session.json; the manager owns it |

**Write surface in practice (two-step model)**:
1. **During WORK** — the leader integrates internal insights into `rawdata/draft-iter{n}.md` (under a `Research Insights` section) and writes each confirmed external insight as a separate file at `rawdata/research/{slug}.md` using the Insight format below. The leader does NOT write to `staging/references/` during WORK.
2. **On PASS** — the assistant (MEMORIZATION phase) reads `rawdata/research/*.md`, extracts confirmed external insights, and stages them at `sessions/{date}-{session-id}/{loop}/staging/references/{slug}.md` per the calling loop's procedure. This keeps **research's external-reference staging** (`staging/references/`) as an assistant-owned, PASS-only surface. Other staging surfaces (decisions, scenarios, design, etc.) remain leader-writable during WORK per the calling loop's skill — see `ideation/SKILL.md`, `preparation/SKILL.md`, `planning/SKILL.md`, `execution/SKILL.md` Memory Access Matrix sections.

Research does not own its own session subdirectory — it lives inside the loop that invoked it.

**Delete semantics**: research never deletes any file in any tier. Supersession via frontmatter is handled by the calling loop's MEMORIZATION.

---

## Core Principles

> **Strategic direction, not implementation recipes.**

Research surfaces what approach to take and which references matter — not step-by-step code. Findings inform design; design defers detail to execution. Research that micromanages implementation suppresses downstream judgment.

> **Reference-rich output.**

Specific file paths + line numbers, function signatures, doc URLs + section anchors, RFC sections, code snippets. Vague findings ("consider caching") force re-investigation. Strong findings name the source precisely so the next reader can verify in seconds.

> **Internal and external surfaces are managed independently.**

Each surface must be researched to sufficient depth on its own. Internal coverage gaps cannot be compensated by external research and vice versa. Insights are extracted per surface (internal insights / external insights) so coverage and bias can be evaluated separately.

> **Insights, not link dumps.**

A bare URL or file path is not an insight. Every captured insight states (a) the specific lesson that applies HERE, (b) why it applies given the current scope, and (c) the source it came from.

> **Out-of-scope insights are dropped.**

Even high-quality findings that don't apply to the current Scope Contract are dropped rather than stockpiled. Out-of-scope candidates may become backlog hints, but they do not enter the insight pool.

---

## Internal Research

**Purpose**
Investigate the project's own codebase, project memory, tests, and history to extract insights that inform design. Internal research grounds design in what already exists — the patterns, conventions, mistakes, and decisions the project carries — so new work doesn't accidentally diverge from or duplicate existing solutions.

**Inputs**
- Locked Scope Contract (defines what's in scope) — schema canonical at `evaluation/SKILL.md` § Scope Contract Schema
- Framed Problem (defines what to look for and why)

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Scope Contract; codebase | **Grep / Glob the codebase** for patterns related to the Scope Contract's `Feature` and `Task` — similar features, related modules, recurring patterns. Note specific file paths + line numbers | Codebase pattern findings |
| 2 | Leader | Scope Contract; `.gobbi/projects/{project-name}/` | **Read project memory** — mistakes, decisions, design docs, prior discussions in `.gobbi/projects/{project-name}/` and `features/{feature-name}/` | Project memory findings |
| 3 | Leader | Scope Contract; existing tests | **Grep test files** for behaviors / scenarios similar to the task — what is already verified and how | Existing test findings |
| 4 | Leader | Scope Contract; git log | **Grep git log** for the area being touched — prior attempts, refactors, reverts, what was tried and what worked | Git history findings |
| 5 | Leader | All step-1–4 findings | **Extract internal insights** using the Insight format below — drop out-of-scope; bare links and file lists are not insights | Internal insights |

**Outputs**

- Internal insights stamped to the Insight format below (target: 3–5; deeper research may yield more — coverage is the bar, not the count)

Insight format (one block per insight):

- **Source** — codebase path (with line numbers) / git ref / project memory path
- **Insight** — the specific lesson that applies HERE (one or two sentences)
- **Why** — in one sentence, why the insight applies given the Scope Contract

---

## External Research

**Purpose**
Investigate prior art outside the project — library / framework docs, RFCs, papers, blog posts, open-source codebases — to extract insights that inform design. External research grounds design in proven approaches from the broader community, so choices stand on community-tested ground rather than reinvention.

**Inputs**
- Locked Scope Contract
- Framed Problem

**Procedure**

| # | Agent | Input | Action | Output |
|---|---|---|---|---|
| 1 | Leader | Scope Contract | **WebSearch / WebFetch library and framework documentation** relevant to the Research Targets below. Note exact URLs + section anchors | Library / framework findings |
| 2 | Leader | Scope Contract | **WebSearch / WebFetch prior art** — open-source codebases, blog posts, papers, RFCs / design docs that solved similar problems | Prior art findings |
| 3 | Leader | Scope Contract | **WebSearch / WebFetch adversarial references** — what failed, what the community warns against, known footguns | Adversarial findings |
| 4 | Leader | All step-1–3 findings | **Extract external insights** using the Insight format below — drop out-of-scope; bare links are not insights | External insights |

**Outputs**

- External insights stamped to the Insight format below (target: 3–5; deeper research may yield more — coverage is the bar, not the count)

Insight format (one block per insight):

- **Source** — URL with stable anchor or section reference
- **Insight** — the specific lesson that applies HERE (one or two sentences)
- **Why** — in one sentence, why the insight applies given the Scope Contract

---

## Research Targets

What to investigate during Internal and External research. The list is a **checklist of what to consider**, not what to always cover — coverage is judged per Scope Contract.

| Target | What to look for |
|---|---|
| **Library / framework / SDK** | What tools the project (internal) or community (external) uses for the same problem space. Version, maturity, license, integration cost, alternatives. |
| **Design pattern** | Patterns that solve similar problems — factory, observer, strategy, etc. — and how they're applied in the codebase or external code. |
| **API shape** | How interfaces are typically structured — config object vs positional parameters, REST vs GraphQL vs RPC, sync vs async, builder vs fluent, etc. |
| **Code API interface** | Specific function signatures, class constructors, type definitions, method names. Both (a) external library APIs the design will *consume*, and (b) existing codebase APIs the design will *pattern after* or extend. |
| **Others** | Anything else relevant to the design direction: data model / persistence, concurrency model, error-handling strategy, configuration approach, security model, performance characteristics, build / deployment, migration / versioning, etc. |

---

## Output paths

Research does not own its own session subdirectory — it writes into the calling loop's session memory. The calling loop's MEMORIZATION (and Wrap-up) handles promotion to project memory.

**Path conventions**

- `{date}` — the session start date in `YYYY-MM-DD` format
- `{session-id}` — the Claude Code session ID from `$CLAUDE_CODE_SESSION_ID` (or the Codex session ID under Codex)
- `{loop}` — the calling loop's name (`ideation` / `preparation` / `planning`)
- `{slug}` — slug for a specific reference artifact, set by the writer at stage time

| Path | Written by | Written |
|---|---|---|
| `sessions/{date}-{session-id}/{loop}/rawdata/draft-iter{n}.md` (Research Insights section) | leader (calling loop's WORK) | Internal + external insights integrated into the loop's rawdata draft |
| `sessions/{date}-{session-id}/{loop}/rawdata/research/{slug}.md` | leader (calling loop's WORK) | One file per confirmed external insight — raw capture in Insight format, pre-staging. Written during WORK. |
| `sessions/{date}-{session-id}/{loop}/staging/references/{slug}.md` | assistant (MEMORIZATION, PASS only) | Promoted from `rawdata/research/{slug}.md` by MEMORIZATION on PASS; Wrap-up promotes to `features/{feature-name}/references/` |

Internal insights do not stage as separate reference files — they live inline in the rawdata draft's Decisions Log and design rationale. Only confirmed external insights with citable URLs produce rawdata/research/ files that MEMORIZATION later stages.

---

## Constraints

- **MUST never extract an insight without a source** — a bare claim without citation is not an insight.
- **MUST never mix internal and external insights** into a single bucket — they're managed independently so coverage and bias can be evaluated separately.
- **MUST never produce step-by-step implementation guidance** — research provides direction and references; implementation detail belongs to Execution.
- **MUST never stockpile out-of-scope findings** — drop them or log a backlog hint.
- **MUST read the relevant codebase** before extracting external insights — internal context shapes which external patterns apply.
- **MUST cite the specific source** — file path + line numbers, URL + section anchor, git ref + commit hash — not the project / repo at large.
- **MUST write every confirmed external insight to `rawdata/research/{slug}.md`** during WORK — the leader does not stage to `staging/references/` directly. MEMORIZATION (PASS only) promotes rawdata/research/ to staging. Silent drops of citable externals are forbidden.
- **MUST never write to `staging/references/` during WORK** — research's external-reference staging is an assistant-owned, PASS-only surface. The leader writes external insights to `rawdata/research/{slug}.md` only; MEMORIZATION promotes to `staging/references/` on PASS. Other staging surfaces (decisions, scenarios, design, etc.) remain leader-writable during WORK per the calling loop's skill — this constraint applies only to research's reference surface, not to staging at large.
- **MUST never write to project memory or feature memory** — Wrap-up owns those writes; research lives in session memory only.
