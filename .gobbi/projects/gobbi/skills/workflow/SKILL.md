---
name: workflow
description: "Workflow is a durable Gobbi mode that routes one isolated session through three checkpointed phases. It uses native TODOs, policy-selected participants, verified records, and a terminal note."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion, TaskCreate, TaskGet, TaskUpdate, TaskList
skill-type: operation
---

# Workflow

Workflow is the durable Gobbi mode for creating or recovering one isolated session and routing it through Configuration, Ideation, Planning, Execution, Wrap-up, and Note. Use it when work needs checkpointed evidence, policy-selected participants, verified local history, recovery, and a terminal note.

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
after the Wrap-up Note agrees with the committed and merged result.

## Rules

- **MUST use the native runtime TODO list to select the current phase, step, stage, task, and iteration.** Use
  only `pending`, `in_progress`, and `completed`, with at most one item `in_progress`.
- **MUST run DISCUSSION → WORK → EVALUATION → RECORD for Ideation, Planning, every Execution task, and
  Wrap-up.** Verify the current stage evidence before changing the TODO.
- **MUST apply the recorded session-wide partner policy to every productive step.** Disabled invokes no
  external runtime; enabled adds each applicable external result through one
  [Partner](../gobbi/partner/SKILL.md) invocation while Workflow retains round assembly and acceptance.
- **MUST keep worktree mutations in one ordered writer chain.** Parallel work is response-form Study, factual
  analysis, or critique that does not write. A saved Study result joins the writer chain.
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
- Gobbi publishes the complete fixed Workflow template immediately after mode selection, before the slug and
  partner questions. Start only Configuration. Use the same ordered titles in Claude Code task controls and
  Codex `update_plan`:

```text
P1 · Configuration
P1 · Ideation
P1 · Hand-off
P2 · Planning
P2 · Execution
P2 · Hand-off
P3 · Wrap-up
P3 · Note
```

- Keep these titles stable. Store the current DISCUSSION, WORK, EVALUATION, RECORD, or PASS stage, iteration,
  task ID, and execution cap in the checkpoint and evidence record. On revision, update the evidence and status
  of the same template item; do not add a decision-shaped title field.
- Recover through [`gobbi/agent-teams`](../gobbi/agent-teams/SKILL.md): start at the latest verified checkpoint, walk records and
  task commits in order, reconstruct the first unproved TODO, correct the native list, and load its phase child.

#### 1.2 Configure identity, isolation, and evidence

- Enter Configuration with Gobbi's normalized slug, partner policy, and
  validated `{gobbi-skills-root}` / `{gobbi-agents-root}` pair. Resolve the Execution cap, roles, required-system
  availability, narrow waivers, base revision, publication intent, merge authority, and cleanup authority. The
  Execution cap defaults to three total passes per task.
- Bind these five Workflow configuration properties:

| Property | Workflow value |
|---|---|
| Proved identity | Original UTC start date, normalized slug, full UUID, partner policy, purpose-based branch, and byte-matching worktree and session leaves. |
| Immutable base commit | The user-resolved clean head, or the one approved layout-bootstrap commit. |
| Isolated worktree | A fresh free path or one exact registered canonical pair outside the main checkout. |
| Publication intent | The configured local, push, or pull-request outcome; later actions cannot exceed it. |
| Required layout | Gobbi Step 1.1 paths, tracked/ignored states, and exact ignore bytes. |

- For a fresh session, generate one full lowercase hyphenated UUID and capture the original UTC start date
  before deriving the worktree and session names. Through [Git](../git/SKILL.md), name the branch
  `<type>/<slug>`, or `<type>/<issue>-<slug>` when a real issue exists. Name both leaves
  `<YYYY-MM-DD>-<slug>-<full-uuid>`.
- Run Gobbi's layout resolver and Git bootstrap preflight before capturing the base. If repair is required,
  obtain explicit user approval for the sole tracked main-checkout write: one commit containing only the
  required directories and `.gobbi/.gitignore`. Never write the repository root `.gitignore`.
- On recovery, require the recorded branch, exact registered worktree, and byte-matching worktree and session
  leaves. Do not parse or migrate a legacy branch name, rename live state, or choose among competing records.
- Create or verify the isolated worktree while applying Git preferences. Create the evidence root at
  `{worktree}/.gobbi/projects/{project}/sessions/<YYYY-MM-DD>-<slug>-<full-uuid>/`; the worktree and session
  leaves are byte-identical.
- Write `configuration.md` with mode, original UTC date, normalized slug, UUID, partner
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
Ideation to `1-ideation/outputs/ideation/` with `ideation-index.md` as its locator and Planning to
`2-planning/outputs/planning/` with `plan-index.md` as its locator; Execution outputs stay at tracked planned
paths. `{evidence-root}/work/` holds other session-only work. Every evidence-root path is ignored, receives
Memory `Temporary Record`, and is never staged. Use `{evidence-root}/work/memory-change-points.md` only when
Memory records a detected durable change point. Wrap-up later applies `Memorize` to the full root.

New sessions use indexed Ideation and Planning results. Recovery may retain a receipt-proved legacy
`1-ideation/outputs/ideation.md` or `2-planning/outputs/{tasks.md,plan.md}` pair; never migrate a legacy result or
choose between both shapes when the accepted evidence does not identify one canonical result.

#### 1.3 Build and accept specialist assignments

- Build every brief through Delegation's `Metadata`, `Task`, `Instructions`, `Resources`, and `Return` headings.
  Add session UUID, runtime, absolute worktree and evidence root, branch, phase, exact TODO/status, step/stage,
  iteration/cap, task and assignment IDs, prerequisite evidence, role, outcome, locked Phase 1 terms, acceptance,
  authority, scope, allowed/protected paths, writer and external-effect boundaries, independence, stops, outputs,
  checks, escape responses, exact result locators, and the required final handoff.
- In `Resources`, provide the validated absolute root pair, then exact paths in this order: Principles; all
  project rules or `NO_PROJECT_RULES`; canonical role; this parent; active phase child; step/task skills; primary
  artifacts. Fresh specialists inherit no loaded skill. A continuation receives a new assignment ID, current
  TODO, changed inputs, mandatory rereads, full scope, and changed independence rules.
- Make each required result and its acceptance evidence explicit. Durable design and evaluation name an exact
  caller-owned absolute path with containment, rereading, and checks. Commit-based Execution names the branch,
  assignment-owned paths, commit authority, and verification. Study names either an exact
  caller-owned absolute destination with its allowed write boundary and checks, or its response subject, shape,
  and consumer. Assistant lookup, Partner, or another conversation result names its subject, response shape,
  and consumer.
- An indexed Ideation or Planning result names its absolute root index as `RESULT`. The owning skill defines the
  complete result; Workflow validates and freezes every file reached in declared order rather than treating the
  locator alone as the subject.
- Require this base handoff prefix:

```text
STATUS: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
RESULT: <exact absolute path | commit revision | concise response result>
SKILLS LOADED:
  - <exact path, in read order>
HANDOFF:
  SUMMARY: <completed outcome or terminal state>
  VERIFICATION: <fresh commands and results, or not run with reason>
  CONCERNS: <remaining concerns or none>
  NEXT ACTION: <next owner and action, or none>
```

- A successful evaluator inserts `VERDICT: PASS | REVISE | FAIL` immediately after `STATUS`. An evaluator
  omits it for `NEEDS_CONTEXT`, `BLOCKED`, or an evidence gap that prevents a verdict. Other roles omit it.
- Validate assignment, role, prefix, loaded paths, result locator, acceptance proof, handoff, checks, scope, and
  protected paths before routing. A handoff cannot substitute for a promised file or commit. In
  Claude Code, load [Agent Teams](../gobbi/agent-teams/SKILL.md) for tool behavior. Reuse a leader only within
  one Ideation or Planning chain, an executor only across related ordered tasks in one subsystem, and an
  assistant only within one memorization chain.

#### 1.4 Apply the shared productive-step cycle

Each phase child invokes this cycle with a local role, frozen subject, canonical output, gate, cap, and unique
acceptance checks.

1. **DISCUSSION:** Load the step operation, study current evidence, resolve decisions within the current
   authority, and freeze one neutral contract. A subject is design-bearing when it chooses architecture,
   strategy, naming, vocabulary, functions, classes, interfaces, data shapes, or any other structure, meaning,
   or contract, including small local choices. User-owned choices return to the user.
2. **WORK:** For every design-bearing subject, inventory each design choice and assign available active-runtime
   subagents or teammates bounded independent read-only evidence, alternatives, or critique. Related minor
   choices may share one assignment only when every choice is named. Assign one active-runtime creator as the
   sole writer to produce and self-review the local draft and synthesize the inputs. With partner enabled,
   require at least one independent Partner draft and one Partner cross-review over frozen input for every
   design-bearing package before synthesis; disabled invokes no external runtime. Place labeled returns, give
   the creator all selected artifacts, synthesize, and accept the complete package before mutation or
   evaluation.
3. **EVALUATION:** Load [Evaluation](../evaluation/SKILL.md). Dispatch one fresh isolated active-runtime
   evaluator and, when enabled, one fresh isolated external evaluator through Partner over the same frozen
   subject. Neither receives the other report. Each applies the complete Evaluation guidelines to the full
   frozen subject. Preserve each complete report and applicable verdict.
4. **RECORD:** Classify every finding through Gobbi's finding gate, derive the applicable Workflow gate, and
   apply Memory `Temporary Record` to the ignored package, gate, receipt, and any detected change points.
   Record a tracked canonical output only by its locator and hash in the receipt; never pass it to Temporary
   Record. Reread all promised evidence before routing.

A WORK package contains only `drafts/`, `cross-reviews/`, `research/`, `synthesis.md`, and
`open-decisions.md`. The manager confirms the required local draft and self-review, synthesis, open decisions,
and every enabled system-labeled external artifact. Missing, unexpected, or unlabeled content rejects the
package; no script substitutes for this reading.

The participant matrix is:

| Policy | WORK | EVALUATION |
|---|---|---|
| Disabled | One assigned active-runtime self-reviewed creator draft plus available bounded local evidence, alternatives, or critique for every design choice; no external invocation. | One fresh isolated active-runtime evaluator; no external invocation. |
| Enabled | The disabled set plus at least one independent draft and one cross-review through Partner for every design-bearing package; the local creator synthesizes after both validate. | The disabled evaluator plus one fresh isolated external evaluator through Partner over the same subject. |

#### 1.5 Gate, record, and recover

- Every evaluator report conveys subject identity and independence, investigated coverage and gaps, evidence
  and reproduction, distinct Problems, Optional Improvements, Strengths and Must-Preserve Conditions, and
  criteria and verdict reasoning when applicable. Workflow requires those meanings without prescribing one
  report order or set of section labels.
- Every Problem states ID, severity, evidence, impact, cause, uncertainty, suggested direction, and
  `blocking: yes|no`. A completed report declares a criteria-derived verdict. Evidence insufficiency names
  the gaps, issues no verdict, and pauses the evaluation round before gate validation.
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
- For an indexed Ideation or Planning result, the receipt records the index locator, ordered relative member paths, each
  file hash, and the complete-result freeze. A membership, order, path, or byte change invalidates the prior
  gate and receipt.
- On a failed partner run or specialist, preserve valid evidence, identify the exact failed system, assignment,
  operation, and check, and retry only that bounded operation when safe. Replace a stale specialist through
  [`gobbi/agent-teams`](../gobbi/agent-teams/SKILL.md). Continue only after the missing output validates. A waiver must already
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
  `P2 · Planning` and continue automatically.

#### 2.2 Dispatch Phase 2

- Load [`phase-2/SKILL.md`](phase-2/SKILL.md) only after the verified Phase 1 Hand-off activates Planning, or
  when recovery selects an unfinished Phase 2 item.
- Require fast-gate PASS for the canonical plan and normal-gate PASS plus one focused commit for every task.
  Preserve completed plan and task history during amendments and recovery.
- Return failure to the earliest unproved Planning or Execution step. On success, activate
  `P3 · Wrap-up` and continue automatically.

#### 2.3 Dispatch Phase 3 and terminate

- Load [`phase-3/SKILL.md`](phase-3/SKILL.md) only after the verified Phase 2 Hand-off activates Wrap-up, or
  when recovery selects an unfinished Phase 3 item.
- Require fast-gate PASS over the actual frozen pre-Git closure before Git integration begins. Commit every
  closure-owned change and merge the exact accepted work head into the configured base branch.
- End only after Wrap-up returns the factual Note, `P3 · Note` is completed, its facts match the committed and
  merged result, and no next TODO remains.

## References

- [`phase-1/SKILL.md`](phase-1/SKILL.md) owns Phase 1 Configuration and Ideation actions.
- [`phase-2/SKILL.md`](phase-2/SKILL.md) owns Phase 2 Planning and Execution actions.
- [`phase-3/SKILL.md`](phase-3/SKILL.md) owns the Phase 3 Workflow adapter to Wrap-up.
- [`gobbi/agent-teams`](../gobbi/agent-teams/SKILL.md) owns TODO-based assignment recovery and context-boundary continuity.
- [Git](../git/SKILL.md) supplies Git preferences. [Memory](../memory/SKILL.md), [Delegation](../delegation/SKILL.md),
  [Partner](../gobbi/partner/SKILL.md), [Evaluation](../evaluation/SKILL.md), and
  [Wrap-up](../wrap-up/SKILL.md) own their named mechanisms.
