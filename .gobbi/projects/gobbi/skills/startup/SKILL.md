---
name: startup
description: "Use for an accepted evidence-backed software-project interview that produces confirmed Startup design briefs for ordinary Ideation."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion
skill-type: operation
---

# Startup

Startup helps a manager turn an accepted software-project interview into confirmed, reader-friendly Startup
design briefs. Use it for a new or sparse project, a project with conflicting direction, or an explicit design
reset after ordinary Ideation DISCUSSION has begun.

The operation studies current project evidence and relevant external material while it interviews through the
adaptable hierarchy in [`topics.md`](topics.md). It records current answers and corrections in one temporary
working file, self-reviews the developing design, and asks additional questions until the result is complete.

The confirmed briefs are evidence inputs for ordinary Ideation, not evaluated designs, implementation plans,
staging candidates, or durable memory. Each brief declares an intended `memory/design/` destination; Ideation,
Record, and Wrap-up retain evaluation, staging, and later memorization ownership.

## Principles

### Let evidence lead the interview

Start each topic from verified project facts, concrete problem events, observed behavior, and authoritative
prior art. Treat preferences, forecasts, and unsupported claims as evidence gaps rather than facts.

### Adapt the hierarchy to the project

The seed topics and questions are an editable starting point, not mandatory coverage. Change them when the
interview exposes a material design concern that is missing, misplaced, resolved, or irrelevant.

### Reconcile before continuing

A later answer never silently replaces an earlier answer. Show the conflict, let the user state the current or
conditional truth, and update every affected answer, topic, brief, and checkpoint.

### Write for future readers

Organize the result by its dominant design subjects rather than by interview order. Preserve concise
traceability without turning a design brief into a transcript or question dump.

## Rules

- **MUST run only after the user requests or accepts Startup inside ordinary Ideation DISCUSSION.** Validate
  the current session, iteration, record directory, and recovery state before the first write.
- **MUST ask one neutral, evidence-led axis under one stable semantic alias per turn.** Adapt the topic tree
  and question agenda to the project instead of requiring every seed prompt.
- **MUST record each material answer, source, decision, open owner, topic effect, and correction.** Resolve a
  material conflict with the user before treating either answer or any dependent checkpoint as current.
- **MUST use the read-only Study operation for a material direction that internal evidence does not settle.**
  Store only validated study evidence at the current Ideation cursor.
- **MUST render, verify, and receive user confirmation for the complete brief set.** Remove the temporary
  record only after the confirmed index and every listed brief agree.
- **NEVER record raw conversation, secrets, credentials, or user-marked sensitive values.** Startup creates
  no cursor, evaluation, implementation plan, staging candidate, durable-memory write, or private lifecycle.

## Procedure

### Phase 1 — Study and Interview the Topic Tree

#### 1.1 Validate or recover the working record

- Receive the accepted Startup request, absolute project root, manifest-declared absolute `{session-root}`, and
  current Ideation iteration `{n}` from the manager. Require the current cursor to be Ideation DISCUSSION at
  iteration `{n}`.
- Apply the containment and session-tree contract owned by
  [`../record/record-map.md`](../record/record-map.md). Confirm the session root belongs to the current
  worktree and session, the `research/` directory is authorized, and no root, parent, or target is a symbolic
  link.
- Normalize and require these regular-file targets to remain beneath the supplied session root:

```text
{session-root}/1-ideation/working/iteration-{n}/research/startup-interview.tmp.md
{session-root}/1-ideation/working/iteration-{n}/research/startup-design-brief-index.md
{session-root}/1-ideation/working/iteration-{n}/research/startup-design-{architecture|feature|process|roadmap}-{descriptive-kebab-case-subject}.md
```

- When no Startup artifact exists, create the temporary record from
  [`templates/interview.tmp.md`](templates/interview.tmp.md). Populate its identity and the thirteen seed
  topics from [`topics.md`](topics.md), then set Interview status to `active`.
- When the temporary record exists, resume only after its project, session, iteration, and artifact identities
  match. Treat it as authoritative; validate any matching unconfirmed index and briefs before regenerating
  them, and verify a matching confirmed set before completing it.
- When only a confirmed index and all of its briefs exist, verify and return `completed`. A mismatched artifact,
  an unconfirmed set without its temporary record, a symbolic-link escape, or a legacy single-report artifact
  that would require migration returns `blocked` without a write.

#### 1.2 Inspect evidence and shape the current hierarchy

- Read current project memory, documentation, source, configuration, tests, history, decisions, and
  conventions. Separate verified facts, user-reported facts, assumptions, forecasts, contradictions,
  decisions, and open questions in the temporary record.
- For a material direction that internal evidence does not settle, invoke
  [`../study/SKILL.md`](../study/SKILL.md) with the exact Ideation cursor, question, decision, scope, and
  evidence classes. Validate its source-grounded report before recording or using its evidence.
- Initialize topic IDs `S01`–`S13`. Preserve an adapted seed's ID and give an emergent topic the earliest
  owning seed plus a sequence such as `S06.E01`.
- Order current topics by dependency, uncertainty, reversibility, consequence, and the cheapest reliable test.
  Use the four Topic Phases in [`topics.md`](topics.md) as checkpoints while moving within or back across them
  when evidence requires it.
- Add, adapt, reorder, split, merge, reopen, retire, or mark a topic `not-needed` when project evidence supports
  the change. Record its origin, reason, evidence, dependencies, and current disposition.
- Activate only software-domain axes that affect an owned outcome, external contract, compatibility promise,
  risk, or validation claim. Scope an axis to its component or surface and derive distinct aliases when sibling
  components can answer differently.

#### 1.3 Ask and record one evidence-led axis

- Keep the question agenda separate from the topic tree. Give each instantiated axis a globally unique
  lowercase kebab-case alias such as `[tech-stack]`, and use sequential answer IDs such as `A001` for immutable
  answer events.
- Before asking, inspect available internal evidence. Present a verified fact for confirmation or correction
  instead of asking the user to rediscover it.
- Ask one literal question about one semantic axis. Seek a concrete event, behavior, alternative, cost,
  constraint, or evidence-to-change before accepting a preference or forecast.
- Record the alias, component or surface, origin, derived aliases, exact question, faithful non-sensitive
  answer, claim kind, evidence and source, interpretation, decision or open owner, dependencies, topic effects,
  and follow-up method. Record summaries, not conversation turns.
- Retain an alias when only contextual wording changes. Mint a new alias when the semantic axis, component,
  external contract, or topic owner changes; never reuse a retired alias for another meaning.
- Smart-skip a prompt only when evidence resolves it and the user confirms or corrects that evidence. Add an
  emergent or follow-up question whenever a material actor, interface, state, data duty, failure, recovery path,
  trust concern, compatibility promise, risk, or validation claim has no current owner.

#### 1.4 Reconcile conflicts and checkpoint progress

- When answers conflict, assign a conflict ID and show the incompatible answer IDs, claims, evidence, and
  consequence. Ask which claim is current or whether each applies under a distinct condition.
- Write a new current answer, mark replaced answers superseded, and preserve correction links. Re-evaluate
  every dependency, reopen the earliest affected Topic Phase, and update each affected checkpoint.
- A Topic Phase may checkpoint when every current topic is `resolved`, `not-needed` with reason and evidence,
  `merged`, or `open` with an owner and method. Record current topics, aliases, answers, evidence, decisions,
  open items, conflicts, corrections, downstream effects, and user confirmation.
- When the interview pauses, set Interview status to `interrupted` and retain the latest complete temporary
  record. Return `interrupted` with its path, current Topic Phase, next unresolved alias, and first safe recovery
  action; resume through Step 1.1.

### Phase 2 — Self-Review and Complete the Design

#### 2.1 Review applicable completeness

- Review the evolving topic tree, question agenda, current answers, evidence, decisions, dependencies,
  conflicts, risks, and open questions against the actual software-project context.
- Check applicable actors, outcomes, scope, boundaries, capabilities, interfaces, journeys, state, data,
  failures, recovery, technology, security, privacy, compatibility, ownership, operations, conventions, and
  verification. Do not turn this review into fixed mandatory coverage.
- Add or change a topic or question whenever a material design concern still lacks a clear owner. Use targeted
  internal inspection or invoke [`../study/SKILL.md`](../study/SKILL.md) when evidence can resolve the gap.
- Return to Phase 1 for every material omission, vague answer, contradiction, unsupported direction, or
  unresolved user-owned choice. Leave an item open only with an explicit owner, consequence, and resolution
  method.

#### 2.2 Confirm the design understanding

- Audit that every current topic and question has an allowed disposition, every adaptation has a reason, every
  current answer is reachable from one alias, every material conflict has the user's resolution, and every
  reopened checkpoint is current.
- Require each alias to match `^\[[a-z][a-z0-9]*(?:-[a-z0-9]+)*\]$` and own one semantic axis and component
  scope. Normalize an unanswered question to `open` with an owner and method; neither `asked` nor `reopened`
  may advance.
- Present the complete current design understanding, evidence strength, decisions, risks, and owned open items
  to the user. Apply corrections through the temporary record and repeat the affected Phase 1 work and this
  self-review before continuing.

### Phase 3 — Write and Handoff Startup Design Briefs

#### 3.1 Route current design subjects

- Group current material by its dominant design subject rather than by Topic Phase. Use one canonical subject
  brief and link related subjects instead of copying their content.
- Select the intended Design Memory category through
  [`../memory/design/SKILL.md`](../memory/design/SKILL.md):
  - `architecture` for technology stack, system composition, runtime, state, data architecture,
    infrastructure, deployment topology, and cross-cutting technical foundations;
  - `feature` for a named capability, users, behavior, interfaces, journeys, states, and failure handling;
  - `process` for development, documentation, testing, evaluation, release, migration, maintenance,
    collaboration, ownership, and governance; or
  - `roadmap` for current direction, future horizons, sequencing, adoption or release direction, and rationale.
- Use an existing canonical design-memory path when the same subject already exists. Otherwise declare
  `memory/design/{category}/{descriptive-kebab-case-subject}.md`; create no empty category brief and declare
  that later memorization must update `memory/design/README.md` navigation.

#### 3.2 Render and verify the complete brief set

- Render at least one subject brief from [`templates/design-brief.md`](templates/design-brief.md) and one
  index from [`templates/design-brief-index.md`](templates/design-brief-index.md). Keep every file directly
  under the current Ideation `research/` directory with the names validated in Step 1.1.
- Make each brief readable without the interview record. Include its current design, decisions and evidence,
  constraints and trade-offs, risks and open questions, related briefs, and a compact alias-to-question-to-
  current-answer traceability section.
- In the index, record every brief and intended destination, every topic and alias disposition, every material
  answer's single owning brief, every correction, every merged, retired, or `not-needed` item, and every open
  owner. Remove stale briefs from the rendered set only when they match this Startup identity and the
  temporary record proves they are no longer current.
- Verify that the index and briefs agree; every current material answer appears exactly once; links and paths
  resolve; current corrections point to the current answer; open questions have owners and methods; and raw
  conversation, sensitive values, detailed implementation tasks, and unsupported readiness claims are absent.

#### 3.3 Confirm, complete, and hand off

- Present the verified index and briefs to the user. Apply corrections through the temporary record, reopen
  affected topics and checkpoints, and repeat Phases 2–3 before asking for confirmation again.
- After user confirmation, set the index status to `confirmed`, record timestamped confirmation evidence, and
  verify the complete set again. Remove the temporary record only after this verification, then verify that
  the confirmed index and every listed brief remain.
- Return `completed` with the index path, all brief paths and intended `memory/design/` destinations, current
  Topic Phase statuses, open owners, and material correction IDs. Supply the confirmed set to ordinary
  Ideation as Startup design inputs before dual-system WORK.
- Ordinary Ideation evaluates and integrates the briefs. Record may derive supported staging candidates after
  PASS, and Wrap-up owns later memorization; Startup does not write durable memory.
- Return exactly one outcome: `completed` for a verified confirmed set with no temporary record,
  `interrupted` for a recoverable temporary record with an exact next action, or `blocked` for invalid identity,
  containment, evidence, or recovery state that cannot be changed safely inside Startup.

## References

- [`topics.md`](topics.md)
- [`templates/interview.tmp.md`](templates/interview.tmp.md)
- [`templates/design-brief.md`](templates/design-brief.md)
- [`templates/design-brief-index.md`](templates/design-brief-index.md)
