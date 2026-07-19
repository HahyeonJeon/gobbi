---
name: codex-side-prompts-need-skill-load-directives
description: "Dual-system Codex proposer/evaluator prompts must carry a Codex-side Load-Directives preamble (read gobbi skills), so Codex runs the same skill-grounded procedure as its Claude counterpart."
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-01
session: 0dc5cf75-54c5-4b52-82fa-b18750bdaade
tags: [codex, evaluation, process]
keywords: [dual-system, delegation, skill-load-directives, codex-prompts]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Codex-side dual-system prompts must load gobbi skills (detailed prompts)

## v0.5.3 lifecycle reconciliation

The evidence paths below identify a historical five-loop session and remain unchanged for audit.
Apply any future fix to the current four-loop prompt surfaces and current ordinals.

## Design decision (USER, 2026-06-30)
**In the gobbi system, Codex agents should get DETAILED prompts.** A Codex `codex exec` run
in dual-system production/evaluation is a gobbi agent doing real gobbi work — it must be
grounded in the same canonical skills/mistakes as its Claude counterpart, via a **Codex-side
Load-Directives preamble** in the `@prompt-file`. Independence is preserved by NOT seeing the
peer's output (the Claude draft / the other evaluator), NOT by withholding project standards.

## The gap (observed, session 0dc5cf75 / G1)
The dual-system Codex proposer + evaluator are invoked as `codex exec "@<prompt-file>"`. Codex
is a stateless CLI with no gobbi context, so everything must be in the prompt. This session's
Codex prompts INLINED a subset (independence stamp, output contract, the 7 perspective names,
finding schema, verdict thresholds, scrutiny targets) but never directed Codex to **read the
canonical gobbi skills**:
- **Proposer prompts**: no `principles/SKILL.md`, no `mistakes/`. (Yet `codex/SKILL.md:153`
  already sizes the proposer timeout for *"large skill reads + a complete draft"* — the design
  EXPECTS skill reads; the prompt didn't ask for them.)
- **Evaluator prompt**: no `evaluation/SKILL.md` (the 4-stage procedure, finding metadata,
  producer/evaluator separation), no phase-specific `execution/evaluation.md` seed scenarios,
  no `mistakes/` cross-check — while the parallel **Claude evaluator loaded all of them** via
  its Load Directives. This breaks the dual-eval contract that *both systems run the same
  7-perspective procedure*; the Codex side ran a lighter, ad-hoc version.

**Impact:** worked this session (the Codex evaluator still caught 2 real High bugs on the
inlined subset), but the asymmetry means the Codex side can apply inconsistent severity/schema
or miss a class the full skill would catch. Latent, not yet a failure.

## Fix
Add a **Codex-side Load-Directives preamble** to the proposer/evaluator prompt patterns —
mirroring the Claude subagent Load Directives (principles → rules → skills → mistakes),
adapted for Codex (it READs files via absolute paths; no Skill tool):
- **Proposer**: read `principles/SKILL.md` + the relevant domain skill(s) + `mistakes/{domain}`.
- **Evaluator**: read `principles/SKILL.md` + `evaluation/SKILL.md` + the phase
  `{loop}/evaluation.md` + `mistakes/{relevant}` — THEN run the 4-stage procedure.
Then proceed to the (existing) task/independence/output-contract sections. The 1200s timeout
already budgets for the reads.

## Affected surfaces
- `skills/codex/SKILL.md` § Dual-System Production + § Dual-System Evaluation — add the
  mandatory Codex-side Load-Directives preamble to the worked prompt patterns (today they only
  give the WRAPPER load directives, not Codex's).
- `skills/orchestration/workflow/production.md` + `workflow/evaluation.md` — mandate it +
  state that Codex runs the same skill-grounded procedure as Claude.
- Any proposer/evaluator prompt template that encodes the `@prompt-file` shape.

## Verification
A future dual-system session's `proposer-prompt.md` / `codex-eval-prompt.md` opens with a
"READ these SKILL.md/mistakes files first" block; the Codex evaluator's output applies the
canonical finding metadata + shows a mistakes cross-check.

## Related
- [[dual-system-production-is-not-optional]] — same theme: don't shortcut the Codex co-work.
- Evidence file: `sessions/2026-06-29-0dc5cf75-.../{1-ideation,3-planning,4-execution}/**/{proposer-prompt,codex-eval-prompt}.md` (the 5 as-shipped Codex prompts — none carry a skill-load preamble).
