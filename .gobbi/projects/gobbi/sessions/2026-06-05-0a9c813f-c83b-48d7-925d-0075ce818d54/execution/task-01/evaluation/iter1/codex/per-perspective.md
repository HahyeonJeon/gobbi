# Per-Perspective Notes

## Project

Locked A, B, C, and E landed in the templates and symlink tree. Locked D did not land fully: the documentation sweep missed stale cap and evaluator-model references, and the new `skip` key is not included in the Configuration customization procedure.

## Structure

The JSON shape is valid and `skip` is placed before `maxIterations` in every workflow step object. The `.claude/` symlinks are genuine symlinks and resolve. No broken symlink remains in `.claude/skills/orchestration/templates`.

## Consistency

Docs and templates disagree in multiple places: `chat-mode.md` still has `maxIter=2` / `maxIter=1` in the diagram, `SKILL.md` still shows default `3` examples, workflow child docs still state default `3` / `1`, and `workflow/evaluation.md` still states Codex evaluator default `gpt-5`.

## Risk

The R1 path was retained and the precedence rule is stated clearly in the main state-machine block. The main risk is operator/manager misconfiguration: the new step-level `skip` exists in settings and is required for Chat preparation opt-in, but the documented customization row omits it.

## Usage

The `skip` key is understandable when reading the templates and the loop-entry block, but the actual customization workflow remains incomplete. A config author following Step 1 row 2 would not be prompted to set or clear `skip`.

## Performance

No runtime performance checks apply to markdown settings. Raising caps to `5` increases possible review/remediation work; some live docs still describe old lower budgets, so the operational cost implication is not consistently visible to readers.

## Aesthetics

Most new prose is plain and clear. The stale ASCII diagram in `chat-mode.md` undermines readability because it is visually prominent and contradicts nearby updated cap prose.
