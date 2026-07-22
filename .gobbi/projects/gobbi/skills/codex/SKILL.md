---
name: codex
description: Use for native Codex entry surfaces or a structured read-only Codex/Claude peer process.
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Codex

Use this skill to locate Gobbi in native Codex or to invoke one opposite-system command-line peer for a draft, cross-review, or evaluation report. It documents the installed Codex and Claude non-interactive surfaces and the validation boundary around them.

Gobbi workflow order, specialist authority, artifact schemas, and finding policy remain with their own skills. This tool never chooses scope, a waiver, a finding disposition, a model, or a workflow route.

## Principles

### Keep Gobbi identity separate from runtime identity

The Gobbi-owned UUID names the session, branch, and worktree. A Codex thread ID or peer-process identity is runtime evidence only. A context boundary may attach a newly observed runtime ID without changing the Gobbi session ID.

### Give every peer a complete neutral input

Each peer operation starts a new process. Its prompt contains the complete artifact contract and complete input contents. It does not rely on earlier process context, private runtime state, or follow-up questions.

### Keep the peer read-only and the wrapper accountable

The peer returns one structured JSON value and never writes the session tree. The active-runtime assistant validates the response, renders it through the record command, and then runs the applicable owner validator.

### Treat failure as a visible pause

An unavailable binary, timeout, nonzero exit, empty response, malformed JSON, schema failure, identity mismatch, digest mismatch, renderer failure, or validator failure blocks the operation. The wrapper never authors replacement content under the missing system's label.

## Rules

### Must follow

- **C-1 — Use canonical Gobbi sources.** Load skills from `.gobbi/projects/gobbi/skills/`. Treat `.agents/skills/` and `plugins/gobbi/skills/` as discovery or package views, not alternate owners.
- **C-2 — Use repo-local specialists in native Codex.** Role wrappers live under `.codex/agents/` and point to the protected canonical role documents.
- **C-3 — Resolve settings through their owners.** The session manifest owns resolved role models. Repo-local Codex configuration and role wrappers own runtime defaults. Do not duplicate or change those values here.
- **C-4 — Start a fresh peer process for every operation.** Draft, cross-review, and evaluation operations each receive a new runtime identity and no persisted peer session.
- **C-5 — Enforce read-only execution.** Codex uses its read-only sandbox. Claude uses plan permission mode, safe mode, and only `Read`, `Grep`, and `Glob`.
- **C-6 — Require one schema-valid JSON value.** Reject empty output, multiple top-level values, prose wrappers, code fences, unknown fields, and any value that fails the selected artifact schema.
- **C-7 — Bind output to the invocation.** Before storage, match kind, system, step, iteration, assignment, runtime identity, neutral-contract digest, and the operation-specific frozen subject digest.
- **C-8 — Store only through the record owner.** Pass the validated JSON to `session-record.sh write-artifact`. A peer process cannot write or repair Markdown directly.
- **C-9 — Validate the stored boundary.** Run the dual-system WORK validator when its full package exists, or the evaluation validator for an evaluation report. Reread the stored artifact before accepting the operation.
- **C-10 — Surface exact failures.** Preserve the prior target bytes, report the command status and immediate diagnostic, and return control to orchestration for retry, user decision, or abort.

### Must not follow

- Do not use a persistent or resumed peer session.
- Do not give an opposite-system process a write-capable sandbox, write tool, shell tool, or session-tree output path.
- Do not let one independent draft operation read the other draft before both freeze.
- Do not let an evaluator read another evaluator report or reuse a prior evaluator context.
- Do not accept a wrapper summary, reconstructed response, partial value, stale response, or reused runtime identity as peer output.
- Do not add a second renderer, artifact schema, adapter executable, or storage path.
- Do not infer a missing-system waiver. Waiver authority remains with orchestration and the user.

## Manual

### Native Codex entry surfaces

| Need | Surface | Owner consequence |
|---|---|---|
| Canonical skill | `.gobbi/projects/gobbi/skills/{skill}/SKILL.md` | Read this source; do not edit a discovery view |
| Skill discovery | `.agents/skills/{skill}/` | Resolves to the canonical skill directory |
| Repo-local specialist | `.codex/agents/{role}.toml` | Loads the matching protected role document |
| Shared plugin package | `plugins/gobbi/` | Package topology is verified by the root sync and smoke commands |
| Session identity and settings | `session.json` version 5 | Record and orchestration own attachment and validation |
| Active workflow cursor | `state.json` version 3 | Orchestration owns transitions; native task lists are projections |

When `CODEX_THREAD_ID` is available, treat it as the observed native runtime ID. The manager supplies the authoritative runtime identity at a context boundary and checkpoints it through the record owner. Absence of one environment variable never authorizes inventing an identity or changing the Gobbi UUID.

For role selection and model values, read the validated session settings and the repo-local Codex configuration named by the runtime entry documents. This skill adds no model override. For package setup, topology, and installed-cache checks, follow the root runtime instructions rather than copying their commands here.

### Peer operation selection

Use an opposite-system peer only through the orchestration-owned WORK or EVALUATION contract:

| Active runtime | Opposite-system process | Structured-output owner |
|---|---|---|
| Claude Code | `codex exec` | `--output-schema` receives the artifact schema file |
| Native Codex | `claude -p` | `--json-schema` receives the compact schema contents |

The applicable JSON Schema is one of the record-owned draft, cross-review, or evaluation-report schemas. The active-runtime assistant chooses it from the assigned artifact kind. It does not weaken or extend the schema for a single call.

### Common invocation envelope

Before launch, render a neutral prompt in a runtime temporary directory outside the session tree. The prompt includes:

- operation kind: draft, cross-review, or evaluation report;
- expected output system, step, iteration, stable assignment, and fresh runtime identity;
- one unique invocation identity for replay detection;
- the exact artifact schema contract and output-only-JSON rule;
- the neutral contract plus its lowercase SHA-256 digest;
- every binding input as complete inline content, with its source label and digest;
- exact in-scope and out-of-scope boundaries;
- independence restrictions for the operation;
- the operation-specific frozen subject and expected digest; and
- the exact failure contract: stop without substitute output when required context is absent.

Paths may identify evidence, but they do not replace the complete contents. The wrapper freezes and hashes the prompt inputs before launch. A retry receives the same frozen envelope and a new invocation and runtime identity.

### Claude Code to Codex

Use the installed non-interactive surface:

```bash
timeout "$peer_timeout" codex exec \
  -C "$trusted_read_root" \
  --ephemeral \
  --sandbox read-only \
  --output-schema "$schema_file" \
  - < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

The load-bearing command is `codex exec -C "$trusted_read_root" --ephemeral --sandbox read-only --output-schema "$schema_file" -`. The final `-` reads the complete prompt from standard input. `--ephemeral` prevents session persistence. `--sandbox read-only` prevents model-generated writes. `--output-schema` validates the final response shape through the installed Codex interface.

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
  --json-schema "$(jq -c . "$schema_file")" \
  < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

`-p` makes the call non-interactive. `--permission-mode plan` blocks an edit-oriented permission path. `--no-session-persistence` prevents later resume. `--safe-mode` disables project and user customizations for the call. `--tools "Read,Grep,Glob"` removes write and shell capabilities. `--json-schema` accepts the compact JSON Schema contents, not the schema path.

The wrapper must not pass `"$schema_file"` itself to `--json-schema`. It must compact and pass the file contents exactly as shown.

### Draft input

Both systems receive the same neutral contract and complete evidence. A draft operation receives no content, digest, summary, or hint from the other draft. Its response must match `draft.schema.json`, echo the assigned runtime identity, and carry the exact `contractSha256`.

Freeze and store both rendered drafts before either cross-review prompt is constructed. A response from an earlier invocation, step, iteration, or assignment is stale even when its content appears useful.

### Cross-review input

The reviewer receives the complete original neutral contract plus the complete frozen rendered draft from the opposite system. It does not receive its own draft as a comparison target. The wrapper supplies:

- the expected opposite `subjectSystem`;
- the SHA-256 of the exact rendered subject file as `subjectSha256`; and
- the same `contractSha256` used by both drafts.

The response must match `cross-review.schema.json`. Claude reviews Codex and Codex reviews Claude. Same-system or same-subject labeling blocks storage.

### Evaluation input

Each evaluator receives the complete frozen evaluation bundle required by the evaluation owner: canonical synthesis or actual tree, both drafts, both cross-reviews, resolved decisions, applicable waiver, locked scope, upstream artifacts, scenarios, checklist source, plan, and verification evidence. It never receives the other evaluator report or a prior evaluator session.

The wrapper hashes the exact evaluated subject and expects it as `subjectSha256`. The response must match `evaluation-report.schema.json`, including the ordered seven perspectives, Overall, ledger, completed checklist, and derived verdict.

### Pre-storage validation

The active-runtime assistant performs these checks in order:

1. Confirm the peer binary and required local dependencies exist before launch.
2. Launch once with a bounded timeout. Capture the exact exit status before inspecting content.
3. Treat status `124` as timeout and every other nonzero status as failure. Read the immediate stderr diagnostic; do not store it as a session artifact.
4. Require a non-empty regular response file. Parse with a strict JSON reader. `jq -e -s 'length == 1'` rejects multiple top-level values; a second check requires the one value to be an object. Prose, wrappers, and code fences fail parsing.
5. Validate the response against the selected record-owned schema with `jsonschema`.
6. Compare kind, system, step, iteration, assignment, and runtime identity with the frozen invocation envelope.
7. Compare `contractSha256`, `subjectSystem`, and `subjectSha256` where the selected schema requires them. Recompute the frozen file digests rather than trusting prompt prose.
8. Reject a runtime identity or invocation response already used by an earlier peer operation. Confirm the target is the current canonical system-labeled path and is not an already frozen artifact from another operation.
9. Call `session-record.sh write-artifact` with the exact expected kind, system, step, iteration, assignment, input, and canonical root-relative target.
10. Reread the rendered artifact. When the complete WORK package exists, run `validate-dual-system-work.sh`. For an evaluation report, run `validate-evaluation-report.sh one`; after both reports validate independently, the manager may run its pair mode.

No later check compensates for a failed earlier check. A storage or validator failure leaves the prior valid artifact bytes authoritative and pauses the workflow.

### Failure diagnosis

| Symptom | Classification | Required response |
|---|---|---|
| Peer binary missing or unavailable | availability failure | Pause and name the binary and lookup failure |
| Exit status `124` | timeout | Pause and report the configured bound |
| Any other nonzero status | process failure | Pause with status and immediate stderr diagnostic |
| Empty response | empty output | Pause; do not synthesize missing content |
| Multiple values, prose, fence, or parse error | malformed output | Pause with the parser result |
| JSON Schema failure | contract failure | Pause with the failing schema path and validator result |
| Metadata or runtime identity mismatch | stale or mislabeled output | Pause and show expected versus observed identity |
| Frozen digest mismatch | wrong input or replay | Pause and show the named digest mismatch |
| Record renderer or owner validator failure | storage boundary failure | Preserve prior bytes and report the exact failing command |

Only the manager may offer retry, a bounded input repair, an explicit one-system waiver, return to DISCUSSION, or abort. This tool does not create the decision or mutate the workflow cursor.

## References

- [Peer adapter command and validation lookup](peer-adapters.md)
- [Dual-system WORK owner](../orchestration/workflow/dual-system-work.md)
- [EVALUATION manager adapter](../orchestration/workflow/evaluation.md)
- [Evaluation method](../evaluation/SKILL.md)
- [Record method](../record/SKILL.md) and [record command map](../record/record-map.md)
- [Draft schema](../record/schemas/draft.schema.json), [cross-review schema](../record/schemas/cross-review.schema.json), and [evaluation-report schema](../record/schemas/evaluation-report.schema.json)
- [Record renderer](../record/scripts/session-record.sh)
- [Dual-system WORK validator](../orchestration/scripts/validate-dual-system-work.sh)
- [Evaluation report validator](../evaluation/scripts/validate-evaluation-report.sh)
- [Specialist delegation owner](../orchestration/delegation.md)
- [Codex-specific mistakes](mistakes.md)
- [Repository runtime entry contract](../../../../../AGENTS.md)
