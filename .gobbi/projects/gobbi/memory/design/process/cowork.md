# Cowork implementation commits

## Intent

Cowork writes implementation commits only after an explicit user `commit` call. The user inspects the diff in
their IDE. The manager does not render the diff. The call is the confirmation.

## Commit gate

- `commit` is a user-called action, parallel to `review` and `wrap up`.
- Execution assignments have commit authority none until that call.
- PASS accepts verified implementation without a clean tracked tree or an implementation commit, and does not
  close the topic.
- On `commit`, the developer, designer, or author that matches the work creates focused commits of the accepted
  uncommitted tracked changes: one commit in the normal case, split into independent changes when needed.
- Wrap-up Memory commits stay on `wrap up`.
- Cowork wrap-up applies [Memory](../../../skills/memory/SKILL.md) Closure through one assistant, extracting
  accepted knowledge through [Wrap-up memory](wrap-up.md) and writing one `reports/note/` account. It does not
  load the Wrap-up skill and does not merge.

## Topics and records

- Related requests stay in one topic. A later request continues the current topic and is added to its contract.
  A new topic starts only when the user asks for one or approves the manager's proposal that the work is
  unrelated.
- Each PASS adds the request's outcome to the topic contract. Each Ideation result in a topic gets its own
  `1-ideation/NN-slug/` directory, plan and task numbers continue across the topic, and temporary work lives in
  `topic-NN-slug/tmp/`.
- There are no Fast and Light depths. Cowork runs Ideation when a request has an open design choice and Planning
  when the work is too large for one task. Planning splits the work into goal-based tasks with a task graph, and
  the manager runs ready tasks in parallel only when they change different files, committing one at a time.
- The manager rules a minor choice itself and records `Ruling: <what> - <why> - <cost if wrong>` in the topic
  contract. It no longer keeps a native TODO list; the TODO tools stay available.

## Review and wrap-up interaction

- `review` applies [Review](evaluation.md) to the subject the user names, or to the whole branch from the base.
  If uncommitted tracked implementation changes exist and no subject is named, it stops and asks for `commit` or
  a subject.
- `wrap up` stops and requires `commit` first when uncommitted tracked changes remain, and asks whether to
  review first when no review covers the current head.
- Review corrections that change tracked files wait for `commit`. They do not auto-commit.

## Ownership

The canonical [Cowork](../../../skills/cowork/SKILL.md) skill owns this contract. The generated plugin copy
must stay byte-equal. Do not rewrite Execution or Git as global skills for this gate.
