# Usage — iter3

**Perspective:** Usage (executor + Plan-acceptance runner)
**Verdict:** PASS

## Stage 1 inheritance

- iter2 F-USAGE2-1 / codex-usage-005 (G3 placeholders) — `addressed (regression closed)` confirmed by grep:
  - Verification-command placeholder hits: zero outside narrative.
  - Common-variable preamble pattern documented at every task's verification block.
- iter2 F-USAGE2-2 (G5 FLAG-2 NOTE-in-YAML) — `addressed`. Executor reading the YAML can now copy-paste `required-skills:` directly into a subagent briefing without stripping the NOTE.

## Stage 2 — executor-as-runner ergonomics

- **Copy-paste correctness.** Every verification command is now a literal one-liner with absolute paths. No template substitution required. Executor can paste verbatim into bash and read the OK/FAIL token.
- **G4 subshell hazard documented.** §3 head note + new P-R8 row + T4/T5 inline G4 comments tell executor exactly what NOT to do (`bash -c '...'` wrapping the verification batch will lose `PRE_T4_REV`). Workaround documented: `export` from parent or re-capture at sub-shell start.
- **T6 wrap-up.** `2026-MM-DD` in `archive/backlogs/2026-MM-DD-...` is a clear placeholder for ship-date stamping at run time, NOT a verification-command placeholder. The `find -name '*chat-mode-tiki-taka-redesign*'` (line 498) uses substring matching that tolerates the date. Correct.
- **T7 backlog path.** Slug `model-assignment-drift-delegation-vs-settings-default` is identical across T7 `files:`, success-criteria, verification-commands, §4 #9, and §5/§6 cross-references — F8 self-review confirms.

## Findings

None.

## Must-preserve

- The G3 `Fn=/Mn=` pattern + the rule "no placeholders in verification commands". Future Planning Loops should follow the same idiom.
- The G5 prose-note-above-YAML idiom for FLAG-2-style skill absences.

Verdict: **PASS**.
