---
name: _doctor
description: Unified health check for .claude/ documentation. Load to detect drift, validate structure, and check completeness.
allowed-tools: Read, Grep, Glob, Bash
---

# Doctor

Unified health check for `.claude/` documentation — detects drift, validates structure, assesses maturity, and checks completeness in a single pass. Replaces `_audit` by consolidating reference checking, structural health, schema validation, JSON/MD sync, and completeness scoring into one tool. Run `gobbi doctor` to get a full picture of documentation health without switching between multiple commands.



---

## Core Principle

> **Docs that reference nonexistent files are worse than no docs.**

A stale reference sends agents on a hunt for something that does not exist, wasting context and producing confused output. Doctor catches these before agents encounter them.

> **Check what is verifiable. Skip what is subjective.**

Doctor checks concrete, machine-verifiable claims: does this file exist? Does this directory contain what is claimed? Does the JSON match the schema? It does NOT assess content quality, writing style, or whether a doc's advice is good. Content quality requires agent judgment and belongs to evaluator agents, not doctor.

> **Check living docs, not historical records.**

Skills, agents, gotchas, rules, and CLAUDE.md are living documentation that agents actively follow. Project notes (`$CLAUDE_PROJECT_DIR/.claude/project/` note directories) are historical records of past sessions — they describe what happened at a point in time and are not expected to stay current. Doctor checks the former, skips the latter.

---

## What Doctor Checks

Doctor consolidates six categories of checks into a single unified report. All checks are deterministic and filesystem-based — no LLM tokens consumed.

| Category | What it detects | Origin |
|---|---|---|
| File existence and broken references | Backtick-quoted paths and markdown links pointing to files or directories that do not exist on disk | From `gobbi audit references/conventions/commands` |
| Structural health | Orphan docs (not reachable from navigation), missing navigation entries, empty sections with no content | From `gobbi docs health` |
| Schema validation | JSON source files that do not conform to the gobbi-docs schema — missing required fields, invalid block types, malformed structure | From `gobbi docs validate` |
| JSON/MD sync | Pairs where the `.json` source and `.md` output have drifted — the `.md` was edited directly or `json2md` was not re-run after a JSON change | Content-based comparison: renders JSON via `renderDoc` and compares with existing `.md` |
| Completeness scoring | Inventory of what documentation exists versus a healthy baseline — missing CLAUDE.md, missing rules, missing project directory | New |
| Maturity level (0-4) | Progressive assessment of documentation adoption from Level 0 (no `.claude/` directory) to Level 4 (fully JSON-first with zero issues) | New |

---

## Maturity Model

Doctor computes a maturity level from deterministic filesystem criteria. No dependency on genome scanner, computed health scores, or LLM analysis. All levels are computable from filesystem state alone.

| Level | Name | Criteria |
|---|---|---|
| 0 | None | No `.claude/` directory |
| 1 | Bootstrap | CLAUDE.md exists |
| 2 | Structured | CLAUDE.md + project directory + at least one skill or agent |
| 3 | Active | Level 2 + rules + gotchas + at least 3 skills/agents + zero doctor errors (warnings OK) |
| 4 | Self-Sustaining | Level 3 + all docs have JSON sources (json2md workflow adopted) + zero doctor errors and warnings |

---

## Evaluation Criteria as Check Source

Gobbi's Docs-category skills (`_skills`, `_agents`, `_rules`, `_project`) each have an `evaluation.md` child doc containing a Verification Checklist. Each checklist item is tagged with one of two labels:

- `[structural]` — machine-verifiable. Can be checked by reading the filesystem: file exists, field present, pattern matches, line count under budget. These are `_doctor`'s domain.
- `[semantic]` — requires agent judgment. Assessing whether content is project-specific, whether principles teach mental models, whether descriptions trigger accurately. These belong to evaluator agents during the evaluation workflow and are outside `_doctor`'s scope.

When checking user-created documentation, `_doctor` loads the relevant evaluation.md from the corresponding gobbi skill and checks the `[structural]` items against the user's files:

| User docs location | Evaluation criteria source |
|---|---|
| `$CLAUDE_PROJECT_DIR/.claude/skills/` | `_skills/evaluation.md` (default, see disambiguation below) |
| `$CLAUDE_PROJECT_DIR/.claude/agents/` | `_agents/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/rules/` | `_rules/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/project/` | `_project/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/project/{project}/gotchas/` | `_gotcha/evaluation.md` |
| `$CLAUDE_PROJECT_DIR/.claude/skills/{skill}/gotchas.md` | `_gotcha/evaluation.md` |

The `[structural]` items describe exactly the kind of checks doctor performs — file existence, field presence, pattern matching, structural layout. The evaluation.md files provide a standardized, per-doc-type checklist rather than relying on doctor's own heuristics for each doc type.

### Doc-Type Disambiguation for Skills

Several specialized doc types live under `$CLAUDE_PROJECT_DIR/.claude/skills/` but need their own evaluation.md rather than the generic `_skills/evaluation.md`. When checking a skill directory, doctor looks for these patterns before falling back to `_skills/evaluation.md`:

- **Evaluation perspectives** — if the skill's directory name matches `_*-evaluation-*` (e.g., `_api-evaluation-security`), use `_evaluation/evaluation.md`
- **Innovation stance skills** — if the skill's SKILL.md description or content indicates an innovation stance, use `_innovation/evaluation.md`
- **Best-practice stance skills** — if the skill's SKILL.md description or content indicates a best-practice stance, use `_best-practice/evaluation.md`
- **All other skills** — use `_skills/evaluation.md`

Doc-type detection is heuristic, not mechanical — name patterns are reliable for evaluation perspectives, but stance detection depends on content inspection. Doctor flags ambiguous cases rather than silently applying the wrong checklist.

---

## When to Run Doctor

- **Every session** — gobbi runs `gobbi doctor` automatically before project-setup. Findings inform what project-setup Step 4 suggests.
- **After major restructuring** — file moves, directory reorganizations, renames
- **Before releases** — verify all docs point to real things and no drift has accumulated
- **After skill or agent creation** — confirm new references are valid and navigation tables are updated

---

## Scope

**In scope:**

- All `.md` and `.json` files in `.claude/` root (CLAUDE.md, rules)
- Skill definitions (SKILL.json, SKILL.md, and child docs)
- Agent definitions
- Gotcha files
- JSON/MD sync status for all paired files
- Any scripts referenced from skill docs

**Out of scope:**

- `$CLAUDE_PROJECT_DIR/.claude/project/` note directories — historical records, not living docs
- Content quality assessment — requires agent judgment, belongs to evaluator agents
- External URLs — network-dependent, separate concern
- Git-timestamp staleness — deferred to future docs-manifest phase

---

## Tools

Doctor is invoked as a single unified command. Internally it calls `checkHealth()`, `auditReferences()`, `auditConventions()`, `auditCommands()`, and `validateDoc()` as library functions — not subprocess CLI calls.

| Command | Purpose |
|---|---|
| `gobbi doctor` | Run unified health check with human-readable text output |
| `gobbi doctor --format json` | Structured JSON output for programmatic consumption |
| `gobbi doctor --plan` | Terraform-plan-style preview of remediations — shows auto-fixable, suggested, and skipped counts without changing anything |
| `gobbi doctor --fix` | Auto-apply deterministic fixes, then re-run doctor to show new state |

JSON output schema: `{ status: "clean" | "attention-needed" | "degraded", maturityLevel: 0-4, findings: Finding[], completeness: { score, missing }, summary: string }`. The `gobbi audit` command remains as a deprecated alias that prints a deprecation warning and forwards to `gobbi doctor`.

---

## Remediation Layer (--plan / --fix)

> **Show what would change before changing anything.**

The `--plan` flag previews all remediations without modifying the filesystem. This gives the user (and CI) a clear picture of what `--fix` will do. Run `--plan` first, review the output, then run `--fix` to apply.

### Auto-Fixable Categories

These categories have deterministic fixes that `--fix` applies automatically:

| Category | Fix strategy | What it does |
|---|---|---|
| `sync-out-of-date` | json2md | Re-generates the `.md` file from its `.json` source to bring the pair back in sync |
| `bidirectional-consistency` | add-nav-entry | Adds missing navigation entries so child docs are reachable from their parent |
| `naming-mismatch` | rename-frontmatter | Updates the frontmatter `name` field to match the directory or filename convention |

### Suggested Categories

These categories appear in `--plan` output as suggestions but are not auto-fixed — they require human judgment:

- `stale-reference` — a backtick-quoted path or markdown link points to a file that no longer exists. The fix depends on whether the file was moved, renamed, or intentionally deleted.
- `stale-directory-claim` — a doc claims a directory contains certain items but the directory contents have changed. Requires understanding the intended scope before updating.

### Exit Codes

| Exit code | Meaning | When |
|---|---|---|
| 0 | Clean or attention-needed | `gobbi doctor` — no errors (warnings OK). `gobbi doctor --fix` — all issues resolved after fix. `gobbi doctor --plan` — nothing auto-fixable. |
| 1 | Degraded | `gobbi doctor` — errors present. `gobbi doctor --fix` — still degraded after applying fixes (non-auto-fixable errors remain). |
| 2 | Has auto-fixes available | `gobbi doctor --plan` only — auto-fixable items exist. Intended as a CI signal: exit code 2 means `--fix` can improve the state. |
