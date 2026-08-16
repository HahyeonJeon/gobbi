---
name: interview
description: "Interview is an operation that walks core topics and triggered children and writes a hierarchical session draft."
allowed-tools: Read, Grep, Glob, Write, Edit, AskUserQuestion, WebSearch, WebFetch
skill-type: operation
---

# Interview

Interview walks core topics and triggered children and writes one session draft. Use it when a
caller needs a hierarchical project interview that can feed Project Design.

## Principles

### Draft, do not complete the design

Interview produces a hierarchical recursive draft over core topics and triggered children. It is
not a complete design.

### Cite evidence before asking

Use current project evidence when it already answers a topic. Ask only when the answer would change
the draft.

### Walk parents before children

Resolve Branch 1 once, then Branch 2 and Branch 3 per product. A product topic inherits the project
answer unless the product differs, and named tasks are subject nodes only for `task-actors`,
`task-scope`, and `task-behavior`.

### Keep follow-ups cheap

First pass is one question per core per subject node. A named child is allowed only when its
trigger is true, only to two levels below the core, and only within the child budget in
[topics.md](topics.md).

## Rules

- **MUST stop if session root, target root, or project key is missing.** Do not derive a replacement
  identity or write the draft into the target project.
- **MUST write only `{session-root}/interview.md` from the interview template.** Never write Memory,
  Design Memory, or target-repo files.
- **MUST derive a topic answer from cited project evidence when that evidence resolves it, and ask one
  user question at a time.** Ask only the earliest unresolved topic.
- **MUST walk the core topic ids and triggered children in [topics.md](topics.md) with its recursion
  and stop rules.** Do not add topics, overlays, or alias lineage.
- **MUST stop and name a missing blocking answer instead of inventing it.** Blocking ids are
  `products`, `core-tasks`, `stack`, and `first-check`, and when `core-tasks` is not none,
  `task-actors`, `task-scope`, and `task-behavior`.
- **NEVER use Bash, produce Planning tasks, implement product features, publish, or merge.**

## Procedure

### Phase 1 — Establish the draft

#### 1.1 Confirm identity

- Require session root, target root, and project key from the caller. Stop and name the missing value if
  any is absent, including when this skill is loaded directly.

#### 1.2 Study evidence

- Read the target's current documents, code, constraints, and accepted decisions, and cite material
  evidence or expose uncertainty or conflict.
- Use WebSearch or WebFetch only when a public reference would change a draft statement.
- Do not treat imagined scenarios as facts.

#### 1.3 Create the draft

- Write `{session-root}/interview.md` from the [interview template](templates/interview.md).
- Fill Identity and Subject Tree from caller identity and current evidence. If the project has one
  product, still name it.
- Confirm the live path is `{session-root}/interview.md` and that no Memory or target-repo path was
  written.

### Phase 2 — Walk the topics

#### 2.1 Record Branch 1

- Walk Project ids `purpose` through `horizon-direction` in [topics.md](topics.md), asking at most one
  first-pass question per id through AskUserQuestion.
- After those cores, walk triggered children whose parent is a Branch 1 id. Activate at most three
  project-level children; mark extras `open`.
- Stop and name a missing blocking answer. Confirm `products` names every independently useful
  product.

#### 2.2 Record each product

- Walk Design / Development ids `shape` through `failure-containment`, then Product ids
  `software-type` through `end-of-life`, for each named product. For `task-actors`, `task-scope`,
  and `task-behavior`, use each named task as the subject node; if `core-tasks` is none, record
  those three as `not applicable`.
- Default to inherit the project answer and ask only where the product differs. Imagine ordinary
  failure and end-of-life before asking, then ask only if the answer would change the draft, and
  mark `experience-direction` and `accessibility-needs` `not applicable` when there is no
  human-facing surface.
- Keep Branch 2 provisional until that product's Branch 3 is recorded, and if Branch 3 contradicts
  Branch 2, revise the draft in place. After each product's cores, walk triggered children at most
  six per product and two per named task, mark extras `open`, and write one `Detail:` line under a
  parent when an answer names something no listed child covers.

#### 2.3 Confirm every core

- Confirm every core topic for the project and each product is answered, inherited, assumed,
  `not applicable`, or open, and every triggered child is answered, inherited, assumed, or open.
- If a blocking topic remains open, stay in Interview, name it, and do not present the draft as ready
  for Project Design.
- Confirm untriggered children are omitted and the draft uses only ids from [topics.md](topics.md).

### Phase 3 — Accept the draft

#### 3.1 Complete remaining sections

- Fill Assumptions and Open Questions from named assumptions and `open` topics, and mark whether each
  open question is blocking.
- Do not write secrets into the draft.
- Confirm every core heading from the template is present and each recorded child uses Status,
  Answer, and Evidence.

#### 3.2 Obtain acceptance

- Present `{session-root}/interview.md` as a session-only draft that Project Design may change.
- On rejection, return to the earliest disputed topic and revise the draft in place.
- On acceptance, record the user and date in Acceptance, and do not copy the file into Design Memory.

#### 3.3 Return the draft

- Return the absolute path `{session-root}/interview.md` and remaining evidence limits.
- State that Interview is complete only when every core is answered, inherited, assumed,
  `not applicable`, or open, every triggered child is answered, inherited, assumed, or open, and
  the user accepted the draft.
- Do not start Project Design, write Memory, or continue into planning.

## References

| Name | Description |
|---|---|
| [Topics](topics.md) | Core topic ids, destination headings, child triggers, recursion rules, and stop rule. |
| [Interview template](templates/interview.md) | Session draft sections Interview fills at `{session-root}/interview.md`. |
