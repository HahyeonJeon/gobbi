# Execution Eval — Overall (iter2, Claude)

**Perspective:** Overall — aggregate of Project / Consistency / Structure / Risk for remediated state (commit ec2c735).

## Aggregate Verdict: REVISE

| Perspective | Verdict |
|---|---|
| Project | REVISE |
| Consistency | PASS |
| Structure | PASS |
| Risk | REVISE |

## What is closed (verified by fresh evidence, not the report)
- **F1** — CLAUDE.md nav-footer count 14: `:31` "The 14 principles", `:62` "14 behavioral principles". Closed.
- **F2** — `---` before `## Principle 14`: present (`principles/SKILL.md:382`; closing `---` at `:404`). Closed.
- **F3** — old P6 wording in `agents/assistant.md` (canonical `.gobbi/projects/gobbi/agents/assistant.md`) + delegation template: grep = 0; now reads "make a vague requirement concrete before acting". Closed.
- **F4** — P10 vocab in the two backlog files (`hooks-domain-mistakes-watchlist`, `ci-symlink-integrity-check`): `motivator` = 0; residual `witness` there is generic English. Closed.
- **Sweep extras** — `.codex/AGENTS.md` Iron Law table (rows 1-14) matches `.claude/CLAUDE.md` char-for-char and matches the canonical `**Iron Law:**` bodies; interview blockquote now "Make every answer concrete before moving on." Closed.
- **Both nav tables = 14 rows, identical, canonical-matching.** Count = 14 everywhere.

## What blocks PASS
- **RISK-01 (High, docs-sync, conf 100):** `features/install-runtime/decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md:56` still teaches retired wording `Principle 10 (witness-bound work)`. The F4 blast-radius sweep migrated two backlog files but missed this live `features/.../decisions/` doc. This is the same class as the iter1 REVISE (stranded old wording outside the primary edits) and exactly the failure the mistake `claude-evaluator-step4-only-vs-codex-whole-file-grep` warns about — caught here only by dropping the path restriction the brief's scope list implied.

## Scope caveat (manager input may be warranted)
The brief's explicit grep scope (`.claude .codex .agents skills/ agents/ rules/ backlogs/`) did NOT list `features/`. RISK-01 lives under `features/`. Strict-brief reading = out-of-scope; user-GOAL reading ("no live doc still teaches retired wording") = in-scope. Adversarial discipline favors flagging it. The manager/user may dispose it `disputed`/`deferred` if historical decision docs are treated as frozen — that is a user call, not the evaluator's.

## Cross-perspective tensions
None structural. The only tension is scope-literal vs goal-literal on RISK-01 (above).

## Must-preserve list
- Char-for-char parity of both nav Iron Law tables with the canonical principles file.
- P14 `---` fencing (`:382` / `:404`), self-reference (`:402`), quoted counter-examples (`:391-392`).
- 6 legitimate "witness" usages in backlogs.
- Locked SURGICAL shorthand: P11 Goodhart/"games the tool", P13 CRUD/blast-radius, P4 contract/client.

## Verdict computation
RISK-01 = High, confidence 100 (>= 50) -> REVISE. No Critical. -> aggregate REVISE.
