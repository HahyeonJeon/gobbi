---
name: codex
description: Use for native Codex entry surfaces or a structured read-only Codex/Claude peer process.
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Codex

Use this skill to locate Gobbi in native Codex or to invoke one opposite-system command-line peer for a draft, cross-review, or evaluation report. It documents the installed Codex and Claude non-interactive surfaces and the wrapper boundary around them.

Gobbi workflow order, specialist authority, and finding policy remain with their own skills. This tool never chooses scope, a waiver, a finding disposition, a model, or a workflow route.

## Principles

### Keep Gobbi identity separate from runtime identity

The Gobbi-owned UUID names the session, branch, and worktree. A Codex thread ID or peer-process identity is runtime evidence only. A context boundary may attach a newly observed runtime ID without changing the Gobbi session ID.

### Give every peer a complete neutral input

Each peer operation starts a new process. Its prompt contains the complete neutral contract and complete input contents. It does not rely on earlier process context, private runtime state, or follow-up questions.

### Keep the peer read-only and the wrapper accountable

The peer returns one closed response and never writes the session tree. The active-runtime assistant handles that response, reports what it received, and leaves acceptance of the operation to the manager.

### Treat failure as a visible pause

An unavailable binary, timeout, nonzero exit, empty response, more than one response, or identity mismatch blocks the operation. The wrapper never authors replacement content under the missing system's label.

## Rules

### Must follow

- **C-1 — Use canonical Gobbi sources.** Load skills from `.gobbi/projects/gobbi/skills/`. Treat `.agents/skills/` and `plugins/gobbi/skills/` as discovery or package views, not alternate owners.
- **C-2 — Use repo-local specialists in native Codex.** Role wrappers live under `.codex/agents/` and point to the protected canonical role documents.
- **C-3 — Resolve settings through their owners.** Repo-local Codex configuration owns the repository-wide runtime defaults, and each role wrapper owns that role's model and instructions. Do not duplicate or change those values here.
- **C-4 — Keep every peer operation independent.** A draft operation receives nothing from the other draft until both freeze, and an evaluator receives no other evaluator report and no prior evaluator context.
- **C-5 — Start a fresh peer process for every operation.** Draft, cross-review, and evaluation operations each receive a new runtime identity and no persisted peer session.
- **C-6 — Enforce read-only execution.** Codex uses its read-only sandbox. Claude uses plan permission mode, safe mode, and only `Read`, `Grep`, and `Glob`.
- **C-7 — Bind output to the invocation.** The peer states the operation's kind, system, step, iteration, and stable assignment so the manager can bind the response to the assignment it accepts.
- **C-8 — Require one closed response.** The peer returns exactly one self-contained report and nothing else: no partial response, second response, second output channel, or follow-up turn.
- **C-9 — Surface exact failures.** Report the command status and immediate diagnostic, change nothing, and return control to workflow for retry, user decision, or abort.

This skill defines no artifact schema, no per-kind response shape, and no digest comparison. The manager's acceptance of the reported response is the only control over peer output.

### Must not follow

- Do not use a persistent or resumed peer session.
- Do not give an opposite-system process a write-capable sandbox, write tool, shell tool, or session-tree output path.
- Do not let one independent draft operation read the other draft before both freeze.
- Do not let an evaluator read another evaluator report or reuse a prior evaluator context.
- Do not accept a wrapper summary, reconstructed response, partial response, stale response, or reused runtime identity as peer output.
- Do not add a second adapter executable, peer surface, or output channel.
- Do not infer a missing-system waiver. Waiver authority remains with workflow and the user.

## Manual

### Native Codex entry surfaces

| Need | Surface | Owner consequence |
|---|---|---|
| Canonical skill | `.gobbi/projects/gobbi/skills/{skill}/SKILL.md` | Read this source; do not edit a discovery view |
| Skill discovery | `.agents/skills/{skill}/` | Resolves to the canonical skill directory |
| Repo-local specialist | `.codex/agents/{role}.toml` | Loads the matching protected role document |
| Shared plugin package | `plugins/gobbi/` | Package topology is verified by the root sync and smoke commands |

When `CODEX_THREAD_ID` is available, treat it as the observed native runtime ID. The manager supplies the authoritative runtime identity at a context boundary and carries it in the assignment as runtime evidence. Absence of one environment variable never authorizes inventing an identity or changing the Gobbi UUID.

For role selection and model values, read the repo-local Codex configuration and the role wrappers named by the runtime entry documents. This skill adds no model override. For package setup, topology, and installed-cache checks, follow the root runtime instructions rather than copying their commands here.

### Peer operation selection

Use an opposite-system peer only through the workflow-owned WORK or EVALUATION contract:

| Active runtime | Opposite-system process | Response |
|---|---|---|
| Claude Code | `codex exec` | One self-contained report on standard output |
| Native Codex | `claude -p` | One self-contained report on standard output |

This skill defines no artifact schema and never states what a response of a given kind must contain. The manager reads the reported response and accepts or refuses it.

### Common invocation envelope

Before launch, render a neutral prompt in a runtime temporary directory outside the session tree. The prompt includes:

- operation kind: draft, cross-review, or evaluation report;
- expected output system, step, iteration, stable assignment, and fresh runtime identity;
- one unique invocation identity for replay detection;
- the closed-response rule: exactly one self-contained report and nothing else;
- the complete neutral contract;
- every binding input as complete inline content with its source label;
- exact in-scope and out-of-scope boundaries;
- independence restrictions for the operation;
- the operation-specific frozen subject; and
- the exact failure contract: stop without substitute output when required context is absent.

Paths may identify evidence, but they do not replace the complete contents. The wrapper freezes the prompt inputs before launch. A retry receives the same frozen envelope and a new invocation and runtime identity.

### Claude Code to Codex

Use the installed non-interactive surface:

```bash
timeout "$peer_timeout" codex exec \
  -C "$trusted_read_root" \
  --ephemeral \
  --sandbox read-only \
  - < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

The load-bearing command is `codex exec -C "$trusted_read_root" --ephemeral --sandbox read-only -`. The final `-` reads the complete prompt from standard input. `--ephemeral` prevents session persistence. `--sandbox read-only` prevents model-generated writes. Nothing validates the response shape; the prompt states the closed-response rule and the manager reads what came back.

Do not add `--add-dir`, a write-capable sandbox, or a session output path. The parent wrapper owns stdin, stdout, and the immediate stderr diagnostic. These temporary files stay outside the session record.

### Native Codex to Claude

Set the parent process working directory to the trusted read root, then use the installed print surface:

```bash
timeout "$peer_timeout" claude \
  -p \
  --permission-mode plan \
  --no-session-persistence \
  --safe-mode \
  --tools "Read,Grep,Glob" \
  < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

`-p` makes the call non-interactive. `--permission-mode plan` blocks an edit-oriented permission path. `--no-session-persistence` prevents later resume. `--safe-mode` disables project and user customizations for the call. `--tools "Read,Grep,Glob"` removes write and shell capabilities.

### Draft input

Both systems receive the same neutral contract and complete evidence. A draft operation receives no content, summary, or hint from the other draft.

Freeze both drafts before either cross-review prompt is constructed. A response from an earlier invocation, step, iteration, or assignment is stale even when its content appears useful.

### Cross-review input

The reviewer receives the complete original neutral contract plus the complete frozen draft from the opposite system. It does not receive its own draft as a comparison target. The wrapper names the expected opposite subject system and states that the contract is the same one both drafts received.

Claude reviews Codex and Codex reviews Claude. Same-system or same-subject labeling blocks the operation.

### Evaluation input

Each evaluator receives the complete frozen evaluation bundle required by the evaluation owner: canonical synthesis or actual tree, both drafts, both cross-reviews, resolved decisions, applicable waiver, locked scope, upstream artifacts, scenarios, checklist source, plan, and verification evidence. It never receives the other evaluator report or a prior evaluator session.

The wrapper supplies the exact frozen subject as complete content. The evaluation method owns what an evaluation report contains.

### Response handling

The active-runtime assistant performs these checks in order:

1. Confirm the peer binary and required local dependencies exist before launch.
2. Launch once with a bounded timeout. Capture the exact exit status before inspecting content.
3. Treat status `124` as timeout and every other nonzero status as failure. Read the immediate stderr diagnostic; do not keep it as session evidence.
4. Require a non-empty regular response file holding exactly one self-contained report. A truncated response, a second response, and a second output channel fail this check.
5. Compare kind, system, step, iteration, assignment, and runtime identity with the frozen invocation envelope.
6. Reject a runtime identity or invocation response already used by an earlier peer operation.

No later check compensates for a failed earlier check. A failure changes nothing and pauses the workflow. The manager decides whether the reported response is accepted.

### Failure diagnosis

| Symptom | Classification | Required response |
|---|---|---|
| Peer binary missing or unavailable | availability failure | Pause and name the binary and lookup failure |
| Exit status `124` | timeout | Pause and report the configured bound |
| Any other nonzero status | process failure | Pause with status and immediate stderr diagnostic |
| Empty response | empty output | Pause; do not synthesize missing content |
| Truncated response, second response, or second output channel | malformed output | Pause with the observed content |
| Metadata or runtime identity mismatch | stale, replayed, or mislabeled output | Pause and show expected versus observed identity |

Only the manager may offer retry, a bounded input repair, an explicit one-system waiver, return to DISCUSSION, or abort. This tool does not create the decision or mutate the workflow cursor.

## References

- [Peer adapter command lookup](peer-adapters.md)
- [Dual-system WORK and EVALUATION owner](../workflow/SKILL.md), including its [specialist assignment additions](../workflow/SKILL.md#13-build-and-accept-specialist-assignments)
- [Evaluation method](../evaluation/SKILL.md)
- [Generic specialist delegation owner](../delegation/SKILL.md)
- [Repository runtime entry contract](../../../../../AGENTS.md)
