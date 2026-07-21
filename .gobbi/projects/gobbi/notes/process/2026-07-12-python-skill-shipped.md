---
name: python-skill-shipped
description: "Built the python coding-standard skill (SKILL.md + 7 child docs, Python 3.12+ / PEP 695 baseline); dual-system caught 21 High-severity gaps a single Claude pass missed; fixed a code-blind link guard."
type: notes
scope: project
feature: null
status: active
created: 2026-07-12
session: f87055a2-08b2-4605-b33b-c01c47416830
tags: [process, docs-sync]
keywords: [python-skill, skill-authoring, dual-system-eval, codex-live-interpreter, link-guard-fix, pep695, typescript-sibling]
author: claude
features_touched: []
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [brief-override-silently-competes-with-loaded-skill-default, python-skill-shipped]
---

# python skill shipped

## What happened

The session ran the full gobbi loop (Ideation → Preparation → Planning → Execution → Wrap-up) to build a new `python` coding-standard skill — the language-specific sibling `coding/SKILL.md`'s "Next session" note (2026-06-24) named as a follow-up. Ideation collected 18 external Python references (PEP 695, PEP 8, PEP 20, PEP 257, PEP 649, mypy gradual typing, Black, Ruff, pytest, structural typing, structured concurrency, packaging/`src` layout) into `1-ideation/staging/references/` and locked a Python 3.12+ baseline with PEP 695 native type parameters.

Execution ran two dual-system evaluation waves. On `SKILL.md` (T1), Claude PASSed on its own read but Codex's independent pass returned REVISE with 3 High findings: the parent doc omitted whole common-path areas the locked area-map assigned to it (iteration idioms, config/CLI, compat/evolution, durability, notebook/script), a principle restated `coding`'s general property instead of teaching the Python-specific mechanism, and the 88-column line convention was used but unowned in `SKILL.md`'s own References section. All three were fixed before PASS.

On the 7 child docs (T2-T8), the divergence was larger: Claude's same-family evaluator returned REVISE with only 1 High (a guard false-positive) + 3 Low; Codex — running a live Python 3.12 interpreter — returned REVISE with 13 High findings, 0 Critical. Genuine code-correctness bugs Claude's read-only review missed: fenced `async`/`await` examples that don't parse outside an `async def`; `bisect.insort` mislabeled O(log n) when insertion is O(n); a false "CPython eliminates the dead result" claim; a durable-write example using a predictable shared `.tmp` path (unsafe under concurrent writers); a semaphore presented as bounding memory/task count when it only bounds active concurrency (repeated in two docs); PEP 440 mischaracterized as a semver + deprecation policy rather than a version-string format; pytest-specific protocols presented as the tool-agnostic portable-testing contract; and traceability links keying to parent headings that don't exist verbatim. Two PEP 695 examples (`def f[T](x)`) also broke `check-markdown-links.sh` — diagnosed as a guard bug (the guard scanned inside fenced code blocks and mismatched Python's `[T](` generic syntax for a markdown link), not a content bug, and fixed at the root by making the guard strip fenced code before matching link syntax.

## What shipped

- `.gobbi/projects/gobbi/skills/python/SKILL.md` (501 lines) — the python coding-standard skill; Python 3.12+ floor, PEP 695 native type parameters, built-in generics, `X | None` unions.
- 7 child docs: `concurrency.md`, `evaluation.md` (the skill's own 7-perspective eval child), `interoperability.md`, `packaging.md`, `performance.md`, `testing.md`, `typing.md`.
- `skills/orchestration/scripts/check-markdown-links.sh` made code-aware (strips fenced code blocks before matching link syntax) — commit `9a76a5ca`.
- Runtime mirrors wired for the new skill (`.claude/skills/python`, `.agents/skills/python`, `plugins/gobbi/skills/python`) — commit `5721ff58`.
- PR #349 (branch `claude-2026-07-12-f87055a2-08b2-4605-b33b-c01c47416830`) open against `develop`, 4 commits ahead / 0 behind `origin/develop`.
- Mistake `brief-override-silently-competes-with-loaded-skill-default` promoted to `skills/delegation/mistakes.md`.

## What got stuck

Nothing blocked shipping. Two items were deliberately deferred, not stuck:

- A stricter "MUST load" on-demand-skill grammar sweep across `coding` + `python` (skill-writing's on-demand skills are supposed to use a softer trigger grammar than "MUST load"; both skills currently use "MUST load" for consistency with each other). Filed as a follow-up, not a formal backlog, per the T1 reconciliation.
- The main checkout's local `develop` branch is 5 commits ahead of / 1 behind `origin/develop` (unreconciled since before this session — unrelated to this PR's branch, which is current with `origin/develop`). Still open; out of scope for this session.

## What shifted

- T1 (`SKILL.md`) went REVISE → 3 targeted fixes (broaden common-path coverage, re-angle the coding-property-restatement principle to the Python mechanism, own the 88-column convention) → PASS on iter2.
- The child-doc batch went REVISE → content fixes across 5 docs (concurrency, performance, evaluation, interoperability, packaging, testing) + the guard fix → PASS on iter2. The `MUST load … / structure/consistency` divergence on T1 (Codex High vs Claude Low) was disputed and the user confirmed 2026-07-12: keep `MUST load` for `coding`-sibling consistency and the locked design.

## Decisions to respect

- **Python 3.12+ / PEP 695 is the skill's locked baseline floor** — do not lower it without a new Ideation pass.
- **`MUST load` grammar is kept** for `python` (matching `coding`) despite both being on-demand skills — user-confirmed 2026-07-12. A stricter on-demand-grammar sweep is a separate, deliberately out-of-scope follow-up; do not silently correct `python`'s grammar alone.
- **The `check-markdown-links.sh` code-aware fix is the root-cause fix**, not a per-doc PEP 695 workaround — a future language skill whose syntax looks like a markdown link (generics, comprehensions, etc.) should rely on this guard behavior rather than re-litigating it per doc.
- **Prefer a loaded skill's own default over a brief override** — the commit-override conflict this session hit (see `[[brief-override-silently-competes-with-loaded-skill-default]]`) is now a recorded delegation trap; future Execution briefs that must deviate from `git/SKILL.md`'s per-task-commit default should state the override loudly and explain why.

## Next session

- **`typescript` is the next sibling skill** — `coding`'s own "Next session" note named `typescript`/`python` as the pending language-specific children; this session's pattern (Ideation reference collection → locked baseline → SKILL.md + child docs → dual-system Execution) and the now-fixed link guard both carry forward directly.
- **Reconcile the main checkout's local `develop`** (5 ahead / 1 behind `origin/develop`) — unrelated to this PR, still open.
- Optional: the `MUST load` on-demand-grammar sweep across `coding` + `python`, filed as a follow-up above.

## Related

- [[brief-override-silently-competes-with-loaded-skill-default]] — mistake promoted this session
- [[template-embeds-unnamed-exception]] — the general delegation-drift pattern the above mistake instantiates
