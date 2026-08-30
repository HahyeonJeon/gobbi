# Cowork implementation commits

## Intent

Cowork writes implementation commits only after an explicit user `commit` call. The user inspects the diff in
their IDE. The manager does not render the diff. The call is the confirmation.

## Commit gate

- `commit` is a user-called action, parallel to `evaluate` and `wrap up`.
- The fixed TODO title is `CW · Commit`, after `CW · Topic · PASS`.
- Execution assignments have commit authority none until that call.
- PASS accepts verified implementation without a clean tracked tree or an implementation commit.
- On `commit`, create focused commits of accepted uncommitted tracked implementation changes: one commit in
  the normal case, or one commit per accepted topic when the dirty set spans more than one topic.
- Executors own those implementation commits once authority is granted.
- Wrap-up Memory commits stay on `wrap up`.

## Evaluate and wrap-up interaction

- Evaluator briefs name one `evaluation-depth` token. Tokens and in-contract bars live in
  [Evaluation](evaluation.md#evaluation-depth).
- Whole-branch `evaluate` uses `by-owning-stage`.
- If uncommitted tracked implementation changes exist, default whole-branch `evaluate` still stops and
  asks for `commit` or a named subject.
- `wrap up` stops and requires `commit` first when those changes remain.
- Evaluation corrections that change tracked files wait for `commit`. They do not auto-commit.

## Evaluation layout

Cowork evaluation uses one unique caller-named directory below `tmp/` as the aggregation parent.
Per-runtime children are `<runtime>/report.md` and `<runtime>/checklist.md`. Runtime tokens are
`claude-code`, `codex`, `cursor`, and `grok`. There is no `gate.md`. Remaining-runtime briefs name
write set `runtime-directory`. A directory that holds only one of the two files is incomplete
evidence and never PASS input. Wrapper capture stays outside the session.

The Evaluation SOP, dual record, depth tokens, and Workflow layout live in [Evaluation](evaluation.md).
This file keeps the Cowork commit gate, `evaluation-depth` routing, and the Cowork-specific evaluation
parent.

## Ownership

The canonical [Cowork](../../../skills/cowork/SKILL.md) skill owns this contract. The generated plugin copy
must stay byte-equal. Do not rewrite Execution or Git as global skills for this gate.
