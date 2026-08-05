---
name: partner
description: "MUST load when a caller needs one independent result from the other runtime. Partner prepares, launches, validates, and returns one frozen external response."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
user-invocable: false
---

# Partner

Use this skill when a caller needs one result from the runtime other than the active runtime. In Claude Code,
Partner invokes Codex. In native Codex, Partner invokes Claude Code. One **partner run** is one bounded,
read-only invocation of that other runtime.

The operation prepares one neutral envelope, launches one fresh process, validates its response, and returns
that response as labeled frozen content. It may use a private runtime-temporary directory for prompt, stdout,
and stderr capture. It writes no durable project or session state.

The caller owns local participants, the complete subject, round assembly, policy, acceptance, and every next
action. Partner neither creates active-runtime drafts or evaluators nor decides mode, scope, gates, coverage,
waivers, finding disposition, or routing. Failure returns an exact pause instead of substitute content.

## Principles

### Keep every partner run independent

An independent result is evidence only when nothing derived from the result it will be compared against
reached it. Independence is built at launch — a fresh process, a new identity, and inputs carrying no content,
summary, or hint from another run — because it cannot be restored afterwards.

### Keep durable state read-only and the caller accountable

The other runtime reads and reports. Private temporary capture supports the invocation, while the caller owns
every durable placement, comparison, acceptance decision, and follow-up action.

### Accept only frozen caller input

Partner preserves the complete input bytes it receives. The caller freezes subjects, drafts, bundles, and
round order before invoking Partner.

### Treat failure as a visible pause

A missing binary, a timeout, an unusable response, or a mismatched identity ends the run in a reported pause,
never in repaired or substituted content. Rescuing a run by editing what came back makes this operation the
author of the result it was asked to obtain independently.

## Rules

- **MUST bind each partner run to a fresh read-only process with a new runtime identity and a new invocation
  identity.** Every launch uses the direction's read-only command form and an identity pair no earlier run
  used; a reused process or identity is rejected as replay.

- **MUST supply the complete neutral contract and every input inline.** Each run receives its caller-supplied
  scope, authority, and failure contract plus the complete content of every binding artifact; a path standing
  in for that content leaves the run unsupplied.

- **MUST preserve the caller's frozen input and independence boundary.** Change no supplied content and reject
  any input the caller marks as prohibited for this run.

- **MUST return one labeled frozen response and write no durable file.** Prompt, response, and stderr captures
  live in one private runtime-temporary directory outside every project and session root and are removed
  before a successful return or after failure evidence is surfaced.

- **NEVER transform a response.** Trimming fences, selecting among several responses, extracting a fragment,
  repairing a field, rerendering, or generating substitute content under a missing system's label each make
  this operation an author; a response is returned whole or its run is reported as failed.

- **NEVER infer a scope, waiver, gate, disposition, or route.** This operation reports what a run produced or
  why it paused and stops there; what the run's scope covers, which mode invokes it, whether coverage is met,
  whether one system suffices, and what happens to a finding all belong to the caller.

## Procedure

### Phase 1 — Prepare One External Run

#### 1.1 Determine the direction, confirm availability, and take the caller's context

- Enter with the active runtime named and with the caller's operation kind, stage, assignment ID, and
  iteration. These values belong to the caller; this operation never invents one or decides whether a round
  needs this external participant.
- Derive the launch direction from the active runtime. In Claude Code the partner is Codex; in native Codex
  the partner is Claude Code. One active runtime allows exactly one direction.
- Confirm the partner binary and every required local dependency before anything else runs. Run `command -v`
  for the direction's binary and for `timeout`, and record each exact result.
- Evidence is the resolved direction, the recorded `command -v` results, and the caller's operation kind,
  stage, assignment, and iteration.
- Continue to Step 1.2 when the binary and its dependencies exist. Go to Step 2.3 with the `Binary
  unavailable` row when either is missing. Stop and ask the caller when the operation kind, stage,
  assignment, or iteration is missing.

#### 1.2 Freeze the subject and compose the neutral envelope

- Enter with the subject the caller wants an independent result over and the direction from Step 1.1.
- Freeze the subject: take its complete content as the caller supplied it and change nothing afterwards. A
  path may identify evidence, but it never replaces that evidence's complete content.
- Create one private runtime temporary directory outside every project, worktree, and session root. Restrict
  the directory and its capture files to the current user. Place the prompt, response, and stderr captures
  there, and never point an output option at durable project or session state. Resolve and containment-check
  all six values below before launch. Require every input file to be a regular non-symbolic-link file and
  every output file to be absent at the start.

```text
trusted_read_root  absolute existing directory containing every permitted input
capture_root       private runtime temporary directory outside durable project and session state
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
- Evidence is the frozen subject, the composed envelope, and the six resolved capture values.
- Continue to Phase 2. Stop and report to the caller when the subject cannot be frozen or a binding input is
  missing, naming the exact missing input and composing nothing in its place.

### Phase 2 — Launch, Validate, and Return One External Run

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
- Continue to Step 2.4 when all six checks pass. Go to Step 2.3 on the first failure.

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
- Retain captures only until the exact diagnostic is read and surfaced. Then remove the complete private
  capture directory. Report a cleanup failure with the retained absolute path; never copy its content into
  durable state.
- Evidence is the paused run, the classification, the surfaced evidence, and the removed captures or exact
  retained cleanup path.
- Return the pause to the caller, who owns every recovery choice — retry, a bounded input repair, a
  user-approved one-system waiver, or abort. This operation neither retries nor substitutes content, and it
  decides no scope, waiver, gate, disposition, or route.

#### 2.4 Return the labeled frozen response

- Enter with the one response that passed Step 2.2. Freeze its bytes without trimming, extracting, repairing,
  or rerendering them.
- Return the complete response labeled with its operation kind, producing system, stage, assignment, and
  iteration. The caller owns placement, local participants, assembly with other content, acceptance, and
  every next action.
- Remove the complete private capture directory before return. If cleanup fails, return an exact failure and
  retained absolute path instead of reporting successful completion.
- State the non-goals with the return: Partner created no local participant, assembled no round, wrote no
  durable project or session state, and decided no policy, mode, scope, gate, coverage rule, waiver, finding
  disposition, or route.
- Evidence is the labeled frozen response and proof that the private captures are absent. One partner run is
  complete. A failed run returns Step 2.3 instead.

## References
