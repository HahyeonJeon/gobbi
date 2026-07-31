# Delegation

This document is the sole owner of Gobbi specialist assignment construction for Workflow and Cowork. Read it
before every dispatch. A delegation is a bounded contract, not a suggestion: it gives a capable specialist
enough context to act without guessing while reserving scope and user authority to the manager.

## Role and runtime map

| Role | Claude default | Codex default | Normal ownership |
|---|---|---|---|
| manager | opus | gpt-5.6-sol | User relationship, routing, assignment, verification |
| leader | opus | gpt-5.6-sol | Ideation and Planning |
| executor | opus | gpt-5.6-sol | Ordered implementation tasks |
| evaluator | opus | gpt-5.6-sol | Fresh independent review |
| assistant | sonnet | gpt-5.6-sol | Narrow research, record support, bounded mechanical support |

In Claude Code, use a stable persistent leader, executor, or assistant when [`agent-teams.md`](agent-teams.md) allows it. Use fresh specialists when the capability is unavailable. Native Codex uses the matching repository custom agent and an ephemeral Claude command-line peer when opposite-system work is required. Evaluators are always fresh in both runtimes.

## Shared delegation skeleton

Every first assignment contains the following headings in this order. Put the primary task contract inline. Links may add evidence but cannot replace the contract.

### 1. Orchestration context

Name the selected orchestration mode and say why this assignment is ready now.

- **Workflow:** state the Gobbi session UUID, active runtime, absolute session root, absolute worktree, branch,
  current `step`, `stage`, `iteration`, current task when applicable, stable assignment ID, and prerequisite
  artifact status.
- **Cowork:** state the Cowork UUID, active runtime, locked base branch and commit, absolute worktree, branch,
  current head and status, current user topic, selected delivery depth and stage, stable assignment ID, and
  prerequisite commits or artifacts. Do not invent a Workflow session root, cursor, iteration, or record.

### 2. Role

Name exactly one role and its responsibility for this assignment. State that the manager retains user discussion, scope, routing, acceptance, reassignment, and destructive-action authority.

### 3. Objective and reason

Give one observable outcome and why it is needed for the current transition. Include the user's locked intent and exact acceptance criteria. A specialist must be able to tell whether it is done without inferring a broader objective.

### 4. Ordered load directives

List every required file as an exact workspace-relative or absolute path in read order. A fresh Gobbi specialist normally loads:

1. `.gobbi/projects/gobbi/skills/principles/SKILL.md`;
2. applicable project rules;
3. its canonical role prompt;
4. `.gobbi/projects/gobbi/skills/mistake/SKILL.md` and the applicable project and skill-owned mistake paths;
5. the current Workflow productive-step skill or selected Cowork stage skill, including `memory` for Cowork
   Wrap-up;
6. task-specific language, tool, Git, evaluation, record, scenario, or checklist skills that the selected
   mode and assignment require; and
7. the primary artifacts named under Inputs.

Fresh specialists do not inherit the manager's loaded skills. Require them to read every directive completely before acting and report the exact loaded paths.

### 5. Inputs

Name immutable and mutable inputs separately. Include canonical artifacts, frozen source identities, accepted decisions, approved finding dispositions, relevant repository state, and commands or schemas the specialist must use. State trust boundaries and which input wins if two disagree.

### 6. In scope and out of scope

Enumerate allowed outcomes and paths, then explicit exclusions. For write-capable work, provide an allowlist, the single absolute write root, and any protected paths. State whether creating, updating, deleting, moving, committing, or invoking an external side effect is authorized.

### 7. Authority and write roots

State the specialist's decision authority and stop points. The specialist may make routine in-scope implementation choices supported by the contract. It must stop for new scope, missing user authority, destructive action, material design conflict, unsafe recovery, publication, or a conflict with protected user work.

Every filesystem write uses the selected mode's absolute worktree root. Git commands use that worktree
explicitly. One ordered writer chain owns mutations; read-only helpers cannot write to the worktree, a mode
record, or an external system.

### 8. Conditional independence rules

State the assignment's applicable independence requirements:

- Workflow independent draft authors do not see each other's draft before both freeze;
- Workflow reciprocal reviewers receive the opposite frozen draft only after freeze;
- evaluators are fresh, do not share a creator context, and never see another evaluator report;
- an opposite-system command-line process is read-only and ephemeral;
- parallel helpers are limited to assigned research, factual handoff, or critique;
- a continuation is allowed only after the previous assignment's report, idle/addressable confirmation, and manager artifact reread.

Workflow applies its dual-system creation and reciprocal-review rules whenever that owner triggers them.
Cowork does not run dual-system creation automatically; an explicit user-called evaluation still requires
fresh isolated evaluators. Omit a condition only when its trigger cannot apply, and mark it `not applicable`
with the reason.

### 9. Expected artifacts

Name each required artifact, structured response, diff, commit, or decision record and give its owner.
Workflow names the record-command operation that stores or validates applicable outputs. Cowork names the
artifact and commit owner and has no record-command path. Do not ask an opposite-system process to write
directly into the worktree or Workflow session tree.

### 10. Verification

List mechanical and semantic checks. Include rereads, schemas, validators, tests, exact acceptance evidence, scope checks, protected-file checks, and worktree checks. Define what proves completion and what merely reports progress.

### 11. Escape paths

Give explicit responses for missing context, blocked dependencies, malformed peer output, validation failure, user-owned conflicting changes, unavailable system, unexpected scope, and unsafe or unauthorized action. Require the specialist to stop with exact evidence rather than broaden scope or degrade silently.

### 12. Status contract

Require the final response to start with these fields and no text before them:

```text
STATUS: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
VERDICT: PASS | REVISE | FAIL
ARTIFACT: <canonical path>
SKILLS LOADED:
  - <exact path, in read order>
```

`VERDICT` is evaluator-only and must be omitted by other roles. `ARTIFACT` is omitted only when the contract requires no artifact. After the prefix, require a concise outcome, evidence, exact changed paths or findings, verification results, and concerns. `DONE_WITH_CONCERNS` means the bounded work is complete but a named non-blocking concern remains. `NEEDS_CONTEXT` means a specific required input or authority is missing. `BLOCKED` means an attempted in-scope path cannot safely proceed; it includes the attempted evidence and recovery choice.

## Dispatch and acceptance

### First assignment

Assign a stable task ID and predictable role name. Send the full skeleton. For a persistent teammate, wait for an explicit acknowledgement that repeats the task ID, scope, and intended artifact before treating it as running.

### Continued assignment

Continue a leader, executor, or assistant only when the role, dependency chain, subsystem, scope authority,
and context remain coherent. Send a delta brief containing the new stable assignment ID, changed objective
and inputs, current orchestration position, reread requirements, full current scope boundary, independence
changes, expected artifact, verification, escape paths, and unchanged status contract. The position is the
Workflow cursor or the Cowork topic, stage, and head.

Replace the specialist on subsystem change, context drift, failure, lost addressability, or an explicit independence need. There is no arbitrary task-count rule.

### Report handling

After a report, the manager:

1. validates the response-first status fields;
2. confirms the report matches the stable assignment;
3. confirms idle and addressable state when a continuation may follow;
4. rereads every promised artifact or commit from disk;
5. runs the named verification and checks the absolute worktree;
6. updates the selected mode's owned state only after the evidence passes; and
7. sends another brief only after the previous assignment is closed.

An idle notification, runtime task status, plausible summary, or clean-looking diff cannot replace these checks. If an artifact differs from the report, the artifact is evidence and the manager investigates before routing.
Cowork records accepted facts in the conversation and local Git history; it never creates Workflow state.

## Role overlays

These are additions to the shared skeleton, not separate templates.

### Leader

Identify whether the assignment belongs to Ideation or Planning, include the relevant specialist method, and
name every user-owned decision. For Cowork, include `caller-owned-independent-evaluation`, exact artifact
paths, and focused commit authority. A leader may research, critique, author, verify, and commit its assigned
artifact when authorized; it cannot implement an Execution task or lock user scope.

### Executor

Include one Workflow plan task or one locked Cowork implementation unit, absolute write root, allowlisted
paths, current preimage, verification commands, commit authority, and protected files. An executor implements
only that unit and does not push, merge, or accept its own work.

### Evaluator

Require a fresh isolated context, all seven perspectives plus Overall, finding schema, checklist, report
schema, and validator. Supply the complete Workflow creation package or the exact frozen Cowork subject named
by the user call. State that creator communication and the other evaluator's report are unavailable until the
independent report is frozen.

### Assistant

Keep the objective narrow. State whether it is read-only research, Workflow record support, Cowork Wrap-up
memory work, or bounded mechanical work. For Cowork Wrap-up, provide the accepted closure evidence, current
project memory root, allowlisted paths, verification, and focused commit authority; require `memory` and every
applicable category skill, permit a verified no-change result, and prohibit Workflow staging or promotion.
An assistant cannot invent durable content, scope, a promotion candidate, or a finding to populate an empty
area.

## References

- Persistent teammate lifecycle and handshake: [`agent-teams.md`](agent-teams.md)
- Active routing and completion transitions: [`steps/state-machine.md`](steps/state-machine.md)
- Dual-system WORK order: [`steps/dual-system-work.md`](steps/dual-system-work.md)
- Record command boundary: [`steps/session-record.md`](steps/session-record.md)
- Cowork orchestration: [`../cowork/SKILL.md`](../cowork/SKILL.md)
- Git isolation and commits: [`../git/SKILL.md`](../git/SKILL.md)
- Generic bounded delegation: [`../delegation/SKILL.md`](../delegation/SKILL.md)
- Canonical role prompts: [`.gobbi/projects/gobbi/agents/`](../../agents/)
