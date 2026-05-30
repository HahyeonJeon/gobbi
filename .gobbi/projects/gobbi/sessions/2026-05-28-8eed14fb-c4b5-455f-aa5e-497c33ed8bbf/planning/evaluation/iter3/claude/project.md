# Project — iter3

**Perspective:** Project
**Verdict:** PASS

## Stage 1 inheritance from iter2/claude

- F-PROJ-1 (iter1, develop..HEAD baseline) — confirmed `addressed` in iter3 §4 #7/#8 + §4 preamble. `grep -c 'main\.\.HEAD' draft-iter3.md` returns 1 (a single mention inside the F7 preamble explaining the replacement); zero in actual commands.
- No new iter2 project-perspective findings to inherit beyond the F7 carry.

## Stage 2 findings — iter3 surgical fixes (G1-G6) verified

Grep verification of the iter3 G-pack against `draft-iter3.md`:

- **G1 (T4 mode-keys)** — `grep -c OK_MODE_KEYS` = 2 (T4 verification + §6 disposition row). T4 line 275: `[ "$(jq -r '.chat.mode' "$F4")" = "chat" -a "$(jq -r '.auto.mode' "$F4")" = "auto" ] && echo OK_MODE_KEYS || echo FAIL_MODE_KEYS`. Exact path; no recursive walk. **landed**.
- **G2 (T4 models semantic guard)** — T4 line 280: `jq -S '.chat.models'` vs `git show "$PRE_T4_REV:...settings.default.json" | jq -S '.models'`. Structural equivalence, both `.chat.models` and `.auto.models` compared. **landed**.
- **G3 (placeholders eliminated in verification commands)** — `grep -cE '<chat-mode\.md|<auto-mode\.md|<settings\.default|<SKILL\.md|<state\.template|<session\.template' draft-iter3.md` = 1 (a single hit on line 602 inside the G3 disposition row enumerating *what got removed*). Zero hits inside verification-commands blocks. Each task opens with an `Fn=/playinganalytics/...` absolute-path variable line. **landed**.
- **G4 (`/tmp/t[45]-pre` removal)** — `grep -cE '/tmp/t[45]-pre' draft-iter3.md` = 2 (both in narrative: row 603 disposition + line 656 §5 self-review). Zero in commands. `PRE_T4_REV` / `PRE_T5_REV` bash variables present (14 hits). **landed**.
- **G5 (FLAG-2 NOTE outside YAML)** — Prose `Note: .claude/skills/claude/SKILL.md is intentionally absent ...` lines appear at 109, 178, 238, 294, 345 — directly above each T1/T2/T3/T4/T5 YAML block (G5 tag inline). `required-skills:` blocks now list only existing skills. **landed**.
- **G6 (triple-escape → printf)** — T4 line 278: `[ "$(jq -r '.chat.workflow.ideation.evaluate.mode, .auto.workflow.ideation.evaluate.mode' "$F4")" = "$(printf 'always\nalways')" ] && echo OK_EVAL_MODE || echo FAIL_EVAL_MODE`. No `\\\\` quadruple-backslash sequences. **landed**.

## Inherited disposition count

- iter1 inheritance: F1-F8 — all `addressed (carried)` with §6 anchors.
- iter2 inheritance: G1-G6 — all `addressed` per Stage 2 grep verification above.
- Lower-confidence appendix items (iter1/iter2): `acknowledged — not in iter3 scope` per Stage-1 surgical-brief discipline. Acceptable at the cap iteration; residuals route through Execution NEEDS_CONTEXT.

## Must-preserve

- 7-task DAG + dependency edges (T3 → T1,T2; T6 → T1,T2,T3).
- All Idea-doc locks (R1-R5, R8, D-A, D-B, L-S1, F1-F8 anchors).
- The §6.7 `workflow.chat.tasks[]` additive schema (no key collision with `workflow.{loop}`).
- G3's `Fn=/$Mn=` common-variable preamble at every task's verification block.

No project-perspective findings. Verdict: **PASS**.
