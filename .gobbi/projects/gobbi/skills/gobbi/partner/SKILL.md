---
name: partner
description: "MUST load when a caller needs an independent result from the partner system. Partner is an operation skill for preparing, launching, validating, and returning the frozen content of one partner round."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
user-invocable: false
---

# Partner

{Intro — written by the Principles, Rules, Intro, and References task. Two or three short paragraphs orienting
a cold reader to the actor, trigger, outcome, boundary, and operating model. Defines both senses at first use:
"partner" names the system that runs in the runtime the active one is not, and "partner run" names one bounded
invocation of it. Adds no policy the body does not own.}

## Principles

### Keep every partner run independent

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Keep the partner read-only and the caller accountable

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Freeze before comparing

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Treat failure as a visible pause

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

## Rules

- **MUST {bind each partner run to a fresh read-only process with new runtime and invocation identity}.**
  {Self-contained pass condition.}

- **MUST {supply the complete neutral contract and every input inline}.** {Self-contained pass condition.}

- **MUST {freeze both drafts before any cross-review and isolate every evaluator}.** {Self-contained pass
  condition.}

- **MUST {return labeled frozen content and write no file}.** {Self-contained pass condition.}

- **NEVER {transform a response}.** {Self-contained failure condition.}

- **NEVER {infer a waiver, gate, disposition, or route}.** {Self-contained failure condition.}

## Procedure

### Phase 1 — Prepare the Run

#### 1.1 Determine the direction, confirm availability, and take the caller's context

- Enter with the active runtime named and with the caller's stage, assignment ID, and iteration. Those three
  values belong to the caller; this operation never invents one.
- Derive the launch direction from the active runtime. In Claude Code the partner is Codex; in native Codex
  the partner is Claude Code. One active runtime allows exactly one direction.
- Confirm the partner binary and every required local dependency before anything else runs. Run `command -v`
  for the direction's binary and for `timeout`, and record each exact result.
- Evidence is the resolved direction, the recorded `command -v` results, and the caller's stage, assignment,
  and iteration.
- Continue to Step 1.2 when the binary and its dependencies exist. Go to Step 2.3 with the `Binary
  unavailable` row when either is missing. Stop and ask the caller when the stage, assignment, or iteration
  is missing.

#### 1.2 Freeze the subject and compose the neutral envelope

- Enter with the subject the caller wants an independent result over and the direction from Step 1.1.
- Freeze the subject: take its complete content as the caller supplied it and change nothing afterwards. A
  path may identify evidence, but it never replaces that evidence's complete content.
- Place the prompt, response, and stderr captures in a runtime temporary directory outside the session tree,
  and never point an output option at the session record. Resolve and containment-check all five values below
  before launch, require every input file to be a regular non-symbolic-link file, require both output files
  to be absent at the start, and record their preimages when a retry could meet an existing path.

```text
trusted_read_root  absolute existing directory containing every permitted input
prompt_file        complete frozen neutral envelope
response_file      partner standard output only
stderr_file        immediate diagnostic only
partner_timeout    positive caller-supplied bound
```

- Compose the neutral envelope in `prompt_file` and state every field below. The order is a readable
  convention, not a protocol the partner must reproduce.

```text
operationKind:      draft | cross-review | evaluation-report
expectedSystem:     claude | codex
stage:              the caller's stage or topic label
iteration:          positive integer
assignment:         stable assignment ID
runtimeIdentity:    new process identity assigned for this run
invocationIdentity: new one-use identity
subjectSystem:      the system that produced the draft under review, for a cross-review only
scope:              complete in-scope, out-of-scope, authority, and failure contract
inputs:             complete labeled contents for every binding artifact
output:             exactly one self-contained report and nothing else
```

- Require the partner to restate the binding identity fields in its report and to add no other metadata.
  `invocationIdentity` stays this operation's own evidence and is not stated back. Bind it to the fresh
  `runtimeIdentity` and to this single launch, so a reused identity is rejected as replay at Step 2.2.
- State the failure contract in `scope`: the partner stops without substitute output when required context is
  absent.
- Evidence is the frozen subject, the composed envelope, and the five resolved capture values.
- Continue to Phase 2. Stop and report to the caller when the subject cannot be frozen or a binding input is
  missing, naming the exact missing input and composing nothing in its place.

### Phase 2 — Run and Validate One Partner Run

#### 2.1 Launch one partner run

- Enter with the composed envelope, the resolved direction, and the confirmed binary.
- Launch exactly once under the caller's bounded timeout, using the command form for the resolved direction.
  A retry is a new run of this step with the same frozen envelope and a new `runtimeIdentity` and
  `invocationIdentity`, and only the caller decides it.

| Direction | Installed version verified for this table | Partner command |
|---|---|---|
| Claude Code to Codex | Codex CLI 0.146.0 | `codex exec -C ROOT --ephemeral --sandbox read-only -` |
| Native Codex to Claude | Claude Code 2.1.220 | `claude -p --permission-mode plan --no-session-persistence --safe-mode --tools "Read,Grep,Glob"` |

- Re-run `codex exec --help` and `claude --help` before changing a flag or relying on a later installed
  version. Installed help wins over this recorded table.
- For Claude Code to Codex, run the form below.

```bash
timeout "$partner_timeout" codex exec \
  -C "$trusted_read_root" \
  --ephemeral \
  --sandbox read-only \
  - < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

- `-C` sets Codex's working root. `--ephemeral` runs without persisting session files. `--sandbox read-only`
  selects the read-only sandbox for model-generated commands. `-` reads the prompt from standard input.
- Never add `--add-dir`, `workspace-write`, `danger-full-access`, `--json`, or `--output-last-message`. The
  response must be the one report on standard output, not an event stream and not a second output channel.
- For native Codex to Claude, start the command from `trusted_read_root` and supply the prompt on standard
  input.

```bash
timeout "$partner_timeout" claude \
  -p \
  --permission-mode plan \
  --no-session-persistence \
  --safe-mode \
  --tools "Read,Grep,Glob" \
  < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

- `-p` prints a non-interactive result and exits. `--permission-mode plan` selects plan permission mode.
  `--no-session-persistence` disables saved sessions for print mode. `--safe-mode` disables user and project
  customizations for the call. `--tools` restricts built-in tools to the named read-only set.
- Never add `Bash`, `Write`, or `Edit` to `--tools`, and never add a background-agent flag, a persistence
  flag, or a writable directory.
- Evidence is the exact exit status captured before any content is read, the response capture, and the stderr
  capture.
- Continue to Step 2.2 on any completed launch. Go to Step 2.3 when the launch cannot start.

#### 2.2 Validate the response

- Enter with the exit status and both captures from Step 2.1.
- Run the response-handling check order below in order. No later check compensates for a failed earlier one,
  so stop at the first failure and carry to Step 2.3 exactly what that check observed.

  1. Confirm the partner binary and required local dependencies exist before launch. Step 1.1 performs this
     check; confirm its recorded result before reading any content.
  2. Launch once with a bounded timeout and capture the exact exit status before inspecting content. Step 2.1
     performs this check.
  3. Treat status `124` as timeout and every other nonzero status as failure. Read the immediate stderr
     diagnostic and do not keep it as session evidence.
  4. Require a non-empty regular response file holding exactly one self-contained report. A truncated
     response, a second response, and a second output channel each fail this check.
  5. Compare kind, system, stage, iteration, assignment, and runtime identity against the frozen envelope.
  6. Reject a runtime identity or invocation response that an earlier partner run already used.

- Evidence is the validated response, or the exact check that failed and what it observed.
- Continue to Phase 3 when all six checks pass. Go to Step 2.3 on the first failure.

#### 2.3 Pause and report an exact failure

- Enter from a failed availability check, a launch that cannot start, or a failed response check.
- Classify the failure in the matrix below, surface exactly the evidence its row names, and obey the mutation
  rule its row fixes. Change nothing else.

| Failure | Evidence to surface | Mutation rule |
|---|---|---|
| Binary unavailable | binary name and `command -v` result | No launch and no target write |
| Timeout | status `124` and configured bound | No partial response storage |
| Process error | nonzero status and immediate stderr diagnostic | No target write |
| Empty output | response size check | No target write |
| Truncated, doubled, or second-channel output | the observed extra or missing content | No extraction or repair |
| Identity mismatch | expected and observed field | No relabeling |
| Reused process or response | the prior operation that already used the identity | No replay |

- Never generate substitute content under the missing system's label. Never trim fences, select the first of
  several responses, extract a fragment from a response, repair a field, or rerender a response; any such
  transformation makes this operation an author.
- Remove the prompt, response, and stderr captures once the failure is surfaced.
- Evidence is the paused round, the classification, the surfaced evidence, and the removed captures.
- Return the pause to the caller, who owns every recovery choice — retry, a bounded input repair, a
  user-approved one-system waiver, or abort. This operation neither retries nor substitutes content, and it
  decides no waiver, gate, disposition, or route.

### Phase 3 — Compose the Round and Return It

#### 3.1 Compose an independent-draft round

- Enter with the caller's neutral contract, the frozen subject, and the complete evidence both systems
  receive.
- Run Phase 2 once per draft. Give each run the same neutral contract and the same complete evidence, and give
  neither run any content, summary, or hint derived from the other draft. Freeze both drafts before anything
  else reads either one.
- Treat a response from an earlier invocation, stage, iteration, or assignment as stale even when its content
  looks useful.
- Evidence is two frozen drafts, each labeled with the system that produced it.
- Continue to Step 3.4, or to Step 3.2 when the caller asked for cross-review. A run paused at Step 2.3
  pauses the round.

#### 3.2 Compose a cross-review round

- Enter only after both drafts from Step 3.1 are frozen. Construct no cross-review envelope before both
  freeze.
- Run Phase 2 once per direction. Give each reviewer the complete original neutral contract and the complete
  frozen draft it did not write, and state that both drafts received that same contract. Exclude the
  reviewer's own draft as a comparison input.
- Name the expected `subjectSystem` in each envelope. Same-system or same-subject labeling blocks the run.
- Evidence is the two reciprocal frozen cross-reviews.
- Continue to Step 3.4. Stop and report when either draft is not yet frozen.

#### 3.3 Compose an evaluation round

- Enter with the complete frozen bundle the caller's evaluation owner requires: the canonical synthesis or
  actual tree, both drafts, both cross-reviews, resolved decisions, applicable waiver, locked scope, upstream
  artifacts, scenarios, checklist source, plan, and verification evidence.
- Run Phase 2 once per evaluator. Give each evaluator the complete bundle as inline content, and give it no
  other evaluator's report and no prior evaluator context.
- State no report shape here. The caller's evaluation method owns what an evaluation report contains.
- Evidence is the isolated frozen evaluation reports.
- Continue to Step 3.4. Stop and report when isolation cannot be proved.

#### 3.4 Return the labeled frozen content

- Enter with the frozen content this round produced.
- Return each item as content, labeled with its kind, its producing system, and the assignment and iteration
  it ran under. The caller places every returned item in its own evidence model.
- Remove the prompt, response, and stderr captures once the content is returned.
- State the non-goals with the return: this operation writes no file, defines no package layout, and decides
  no mode, gate, coverage rule, waiver, finding disposition, or route. Acceptance belongs to the caller.
- Evidence is the returned labeled content and the removed captures.
- The round is complete. A paused round returns the Step 2.3 report instead of content.

## References
