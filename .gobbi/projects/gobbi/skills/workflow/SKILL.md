---
name: workflow
description: How a manager runs one durable Gobbi session through three checkpointed phases using native TODO routing, policy-selected participants, verified records, and a terminal hand-off.
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Workflow

A Gobbi manager loads this skill to create or recover one isolated Workflow session and route it through
Configuration, Ideation, Planning, Execution, Wrap-up, and Hand-off. The result is verified local history,
recoverable evidence, and an exact terminal handoff.

This parent owns the shared state machine: native TODOs, evidence, participants, assignments, gates, records,
recovery, checkpoints, and transitions. Its internal phase children own phase-specific actions. Supporting
operations own their mechanisms.

The manager owns user discussion, routing, assignments, acceptance, and authority checks. The user owns Phase 1
direction, changes outside its locked contract, new safety or external authority, destructive actions,
publication, merge, and cleanup. Specialists own only their bounded work.

## Principles

### Route through one native TODO

The native TODO list is the sole progression authority. Evidence proves a transition; it never becomes a
second route.

### Lock direction before autonomous delivery

Phase 1 locks material direction with the user. Later phases resolve routine in-contract choices without
routine user questions.

### Keep shared contracts in the parent

Every productive step uses the same participant, evidence, gate, and record contracts. Phase children supply
only their role, subject, output, gate, cap, and phase-specific checks.

### Make every boundary recoverable

Every nonterminal checkpoint names verified evidence, Git location, and the exact next TODO. Phase 3 ends only
after the Wrap-up handoff and factual Git receipt agree with current evidence.

## Rules

- **MUST use the native runtime TODO list to select the current phase, step, stage, task, and iteration.** Use
  only `pending`, `in_progress`, and `completed`, with at most one item `in_progress`.
- **MUST run DISCUSSION → WORK → EVALUATION → RECORD for Ideation, Planning, every Execution task, and
  Wrap-up.** Verify the current stage evidence before changing the TODO.
- **MUST apply the recorded session-wide partner policy to every productive step.** Disabled invokes no
  external runtime; enabled adds each applicable external result through one
  [Partner](../gobbi/partner/SKILL.md) invocation while Workflow retains round assembly and acceptance.
- **MUST keep worktree mutations in one ordered writer chain.** Parallel work is read-only study, factual
  analysis, or critique.
- **MUST apply Gobbi's [session-wide finding gate](../gobbi/SKILL.md#14-apply-the-session-wide-finding-gate).**
  Every correction receives fresh evaluation, and only a verified PASS continues automatically.
- **NEVER accept a report, idle signal, TODO status, or summary as completion evidence by itself.** Reread the
  promised artifact or commit and run its named verification.

## Procedure

### Phase 1 — Establish the shared Workflow contracts

#### 1.1 Initialize or recover the native TODO

- Load [Delegation](../delegation/SKILL.md), [Discussion](../discussion/SKILL.md),
  [Git](../git/SKILL.md), and [Memory](../memory/SKILL.md), in that order. Inspect repository, branch,
  worktrees, TODO state, and unfinished evidence without mutation.
- In Claude Code, use `TaskList`, `TaskGet`, `TaskCreate`, and `TaskUpdate`. In Codex, publish the complete
  ordered list and statuses with `update_plan`.
- On a fresh session, create Configuration, one mutable item for each productive-step iteration, and each
  Hand-off. Start only Configuration. Use this exact title grammar:

```text
P1 · Configuration
P1 · Ideation · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/2
P1 · Hand-off
P2 · Planning · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/2
P2 · Execution · <unplanned|task-NN-slug> · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/<configured-max>
P2 · Hand-off
P3 · Wrap-up · <DISCUSSION|WORK|EVALUATION|RECORD|PASS> · <iteration>/2
P3 · Hand-off
```

- Retitle an item at each stage. `PASS` is the verified gate marker after RECORD. On revision, complete the
  recorded iteration and create the next at DISCUSSION; Ideation, Planning, and Wrap-up allow two total
  iterations, while Execution uses its configured cap.
- Recover through [`agent-teams.md`](agent-teams.md): start at the latest verified Hand-off, walk records and
  task commits in order, reconstruct the first unproved TODO, correct the native list, and load its phase child.

#### 1.2 Configure identity, isolation, and evidence

- Enter Configuration with Gobbi's normalized slug or recovered `slug: not-applicable`, partner policy, and
  validated `{gobbi-skills-root}` / `{gobbi-agents-root}` pair. Resolve the Execution cap, roles, required-system
  availability, narrow waivers, base revision, publication intent, merge authority, and cleanup authority. The
  Execution cap defaults to three total passes per task.
- Supply [Git](../git/SKILL.md) these five contract properties:

| Property | Workflow value |
|---|---|
| Proved identity | Runtime, original UTC start date, slug or `not-applicable`, full UUID, partner policy, and separately derived names. |
| Immutable base commit | The user-resolved clean head, or the one approved layout-bootstrap commit. |
| Isolated worktree | A fresh free path or one exact registered new or permanent legacy pair outside the main checkout. |
| Publication intent | The configured local, push, or pull-request outcome; later actions cannot exceed it. |
| Required layout | Gobbi Step 1.1 paths, tracked/ignored states, and exact ignore bytes. |

- For a fresh session, generate one full lowercase hyphenated UUID and capture the original UTC start date
  before deriving names. Derive branch and leaf separately through [Git conventions](../git/conventions.md):
  `<runtime-prefix>-<YYYY-MM-DD>-<slug>-<full-uuid>` and `<YYYY-MM-DD>-<slug>-<full-uuid>`.
- Run Gobbi's layout resolver and Git bootstrap preflight before capturing the base. If repair is required,
  obtain explicit user approval for the sole tracked main-checkout write: one commit containing only the
  required directories and `.gobbi/.gitignore`. Never write the repository root `.gitignore`.
- On recovery, require separately parsed branch, worktree, and session leaves to reproduce one new or legacy
  tuple. Record `identity-shape: new|legacy`; never infer a legacy slug, rename or migrate live state, accept a
  mixed shape, or choose among competing tuples.
- Create or verify the isolated worktree through Git. Create the evidence root at
  `{worktree}/.gobbi/projects/{project}/sessions/<YYYY-MM-DD>-<slug>-<full-uuid>/`; the new worktree and session
  leaves are byte-identical. Keep a recovered legacy `<YYYY-MM-DD>-<full-uuid>` root unchanged.
- Write `configuration.md` with mode, identity shape, original UTC date, slug or `not-applicable`, UUID, partner
  policy, settings, repository, base, branch, worktree leaf, session leaf, absolute worktree, runtime, validated
  root pair, and creation checks. Apply Memory `Temporary Record`, prove it ignored, and verify the tracked tree
  is unchanged.

Use these fixed evidence owners:

| Productive work | Evidence directory |
|---|---|
| Ideation | `1-ideation/` |
| Planning | `2-planning/` |
| Execution | `3-execution/task-NN-slug/` |
| Wrap-up | `4-wrap-up/` |

Each owner uses `working/iteration-N/`, `evaluation/iteration-N/`, and `record/iteration-N.md`.
`evaluation/iteration-N/` contains `gate.md` and only required `claude.md` or `codex.md` reports. PASS writes
Ideation to `1-ideation/outputs/ideation.md` and Planning to `2-planning/outputs/{tasks.md,plan.md}`; Execution
outputs stay at tracked planned paths. `{evidence-root}/work/` holds other session-only work. Every evidence-root
path is ignored, receives Memory `Temporary Record`, and is never staged. Wrap-up later applies `Memorize` to
the full root, including readable legacy `memory/` input.

#### 1.3 Apply the shared productive-step cycle

Each phase child invokes this cycle with a local role, frozen subject, canonical output, gate, cap, and unique
acceptance checks.

1. **DISCUSSION:** Load the step operation, study current evidence, resolve decisions within the current
   authority, and freeze one neutral contract. User-owned choices return to the user.
2. **WORK:** Assign one active-runtime creator to produce and self-review a local draft. With partner enabled,
   call Partner for each applicable independent external draft and cross-review over frozen input. Place labeled
   returns, give the creator all selected artifacts, synthesize, and accept the complete package before mutation
   or evaluation.
3. **EVALUATION:** Load [Evaluation](../evaluation/SKILL.md). Dispatch one fresh isolated active-runtime
   evaluator and, when enabled, one fresh isolated external evaluator through Partner over the same frozen
   subject. Neither receives the other report. Preserve each complete report and verdict.
4. **RECORD:** Classify every finding through Gobbi's finding gate, derive the applicable Workflow gate, and
   apply Memory `Temporary Record` to the package, gate, canonical output, and receipt. Reread all promised
   evidence before routing.

A WORK package contains only `drafts/`, `cross-reviews/`, `research/`, `synthesis.md`, and
`open-decisions.md`. The manager confirms the required local draft and self-review, synthesis, open decisions,
and every enabled system-labeled external artifact. Missing, unexpected, or unlabeled content rejects the
package; no script substitutes for this reading.

The participant matrix is:

| Policy | WORK | EVALUATION |
|---|---|---|
| Disabled | One assigned active-runtime self-reviewed draft; no external invocation. | One fresh isolated active-runtime evaluator; no external invocation. |
| Enabled | The disabled set plus each applicable external draft and cross-review through Partner; the local creator synthesizes. | The disabled evaluator plus one fresh isolated external evaluator through Partner over the same subject. |

#### 1.4 Build and accept specialist assignments

- Build every brief through Delegation's `Metadata`, `Task`, `Instructions`, `Resources`, and `Return` headings.
  Add session UUID, runtime, absolute worktree and evidence root, branch, phase, exact TODO/status, step/stage,
  iteration/cap, task and assignment IDs, prerequisite evidence, role, outcome, locked Phase 1 terms, acceptance,
  authority, scope, allowed/protected paths, writer and external-effect boundaries, independence, stops, outputs,
  checks, and escape responses.
- In `Resources`, provide the validated absolute root pair, then exact paths in this order: Principles; all
  project rules or `NO_PROJECT_RULES`; canonical role; this parent; active phase child; step/task skills; primary
  artifacts. Fresh specialists inherit no loaded skill. A continuation receives a new assignment ID, current
  TODO, changed inputs, mandatory rereads, full scope, and changed independence rules.
- Require this return prefix; omit `VERDICT` for non-evaluators and omit `ARTIFACT` only when none is required:

```text
STATUS: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
VERDICT: PASS | REVISE | FAIL
ARTIFACT: <path or response-only>
SKILLS LOADED:
  - <exact path, in read order>
```

- Validate assignment, role, prefix, loaded paths, artifact or commit, checks, scope, and protected paths before
  routing. In Claude Code, load [Agent Teams](../gobbi/agent-teams/SKILL.md) for tool behavior. Reuse a leader
  only within one Ideation or Planning chain, an executor only across related ordered tasks in one subsystem,
  and an assistant only within one memorization chain.

#### 1.5 Gate, record, and recover

- Every evaluator report is a complete Evaluation result. Every finding states ID, severity, evidence, impact,
  cause, confidence, suggested direction, and `blocking: yes|no`.
- A fast gate applies to Ideation, Planning, and Wrap-up with two total iterations. Preserve evaluator verdicts
  as report evidence. PASS requires no unresolved Critical or actual blocking finding, every user-owned finding
  disposition, no pending reevaluation, and a satisfied contract. Otherwise iteration 1 is REVISE when repair is
  authorized; iteration 2 is FAIL. Never create a third iteration.
- A normal gate applies to each Execution task with its configured cap. Its decision is the most severe required
  verdict: FAIL outranks REVISE, which outranks PASS. REVISE creates the next iteration below the cap; FAIL or
  cap exhaustion preserves recovery evidence and stops after safe in-contract recovery.
- Each `gate.md` records mode, partner policy, required participants, report paths and hashes, all declared
  verdicts, unresolved Critical IDs, actual blocking IDs, automatically correctable IDs, user dispositions,
  pending reevaluation IDs, and Workflow decision.
- Each `record/iteration-N.md` contains only exact TODO and decision; source artifact, package, report, gate,
  commit, or output identifiers and hashes as applicable; verification; accepted finding dispositions; and next
  or recovery state. Gates and receipts prove recovery; only the native TODO routes.
- On a failed partner run or specialist, preserve valid evidence, identify the exact failed system, assignment,
  operation, and check, and retry only that bounded operation when safe. Replace a stale specialist through
  [`agent-teams.md`](agent-teams.md). Continue only after the missing output validates. A waiver must already
  name the system, step, and iteration; otherwise an unavailable required system is a critical blocker. Never
  replay a possibly side-effecting operation until its prior effect is proved absent or safely reusable.

#### 1.6 Verify checkpoints and transition

Before every Hand-off, verify the phase output, gates, receipts, commits and checks when applicable, findings,
branch, worktree, and active Hand-off TODO. Return to the earliest responsible stage on failure.

Render nonterminal checkpoints with this schema:

```text
Phase: <Phase 1|Phase 2>
Outcome: <verified outcome>
Completed: <completed steps and stable task IDs when applicable>
Evidence: <artifacts, receipts, commits, tests, and evaluations>
Decisions: <material authorities and in-contract decisions>
Finding dispositions: <automatic corrections and user dispositions or none>
Branch: <exact branch>
Worktree: <absolute worktree>
Next TODO: <exact next TODO>
Continuation: automatic unless the user interrupts for clear or compact
```

Reread every field, complete the Hand-off, activate `Next TODO`, display the checkpoint, and continue in the
same turn. A context boundary preserves established mode, slug, partner policy, identity, route, and evidence.

### Phase 2 — Dispatch the phase operations

#### 2.1 Dispatch Phase 1

- Load [`phase-1/SKILL.md`](phase-1/SKILL.md) before `P1 · Configuration` or any recovered Phase 1 item.
- Require a configured or safely recovered isolated session, a user-locked Ideation contract, fast-gate PASS,
  canonical Ideation output, and a verified Phase 1 checkpoint.
- Return phase-specific failure to its earliest unproved Configuration or Ideation step. On success, activate
  `P2 · Planning · DISCUSSION · 1/2` and continue automatically.

#### 2.2 Dispatch Phase 2

- Load [`phase-2/SKILL.md`](phase-2/SKILL.md) only after the verified Phase 1 Hand-off activates Planning, or
  when recovery selects an unfinished Phase 2 item.
- Require fast-gate PASS for the canonical plan and normal-gate PASS plus one focused commit for every task.
  Preserve completed plan and task history during amendments and recovery.
- Return failure to the earliest unproved Planning or Execution step. On success, activate
  `P3 · Wrap-up · DISCUSSION · 1/2` and continue automatically.

#### 2.3 Dispatch Phase 3 and terminate

- Load [`phase-3/SKILL.md`](phase-3/SKILL.md) only after the verified Phase 2 Hand-off activates Wrap-up, or
  when recovery selects an unfinished Phase 3 item.
- Require fast-gate PASS over the actual frozen pre-Git closure before authorized finalization begins. Perform
  only configured, currently authorized Git actions; retain exact recovery state for incomplete finalization.
- End only after Wrap-up displays the immutable tracked handoff and factual Git receipt, `P3 · Hand-off` is
  completed, all facts match direct evidence, and no next TODO remains.

## References

- [`phase-1/SKILL.md`](phase-1/SKILL.md) owns Phase 1 Configuration and Ideation actions.
- [`phase-2/SKILL.md`](phase-2/SKILL.md) owns Phase 2 Planning and Execution actions.
- [`phase-3/SKILL.md`](phase-3/SKILL.md) owns the Phase 3 Workflow adapter to Wrap-up.
- [`agent-teams.md`](agent-teams.md) owns TODO-based assignment recovery and context-boundary continuity.
- [Git](../git/SKILL.md), [Memory](../memory/SKILL.md), [Delegation](../delegation/SKILL.md),
  [Partner](../gobbi/partner/SKILL.md), [Evaluation](../evaluation/SKILL.md), and
  [Wrap-up](../wrap-up/SKILL.md) own their named mechanisms.
