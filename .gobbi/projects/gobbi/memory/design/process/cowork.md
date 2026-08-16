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

- If uncommitted tracked implementation changes exist, default whole-branch `evaluate` stops and asks for
  `commit` or a named subject.
- `wrap up` stops and requires `commit` first when those changes remain.
- Evaluation corrections that change tracked files wait for `commit`. They do not auto-commit.

## Ownership

The canonical [Cowork](../../../skills/cowork/SKILL.md) skill owns this contract. The generated plugin copy
must stay byte-equal. Do not rewrite Execution or Git as global skills for this gate.
