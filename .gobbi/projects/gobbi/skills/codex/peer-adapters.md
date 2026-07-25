# Peer Adapters

Direct lookup for the symmetric command-line peer boundary described by [Codex](SKILL.md). The active-runtime assistant owns this wrapper boundary. Opposite-system processes remain read-only, ephemeral, and unable to write the Gobbi session tree.

## Supported installed surfaces

| Direction | Installed version verified during implementation | Structured surface |
|---|---|---|
| Claude Code to Codex | Codex CLI 0.144.6 | `codex exec -C ROOT --ephemeral --sandbox read-only --output-schema FILE -` |
| Native Codex to Claude | Claude Code 2.1.214 | `claude -p --permission-mode plan --no-session-persistence --safe-mode --tools "Read,Grep,Glob" --json-schema JSON` |

Re-run `codex exec --help` and `claude --help` before changing a flag or relying on a later installed version. Installed help wins over remembered syntax.

## Wrapper-owned temporary boundary

Create the prompt, schema selection, response, and stderr capture in a runtime temporary directory outside the session tree. The wrapper owns those files and removes them after it has either stored a valid response or surfaced the failure. Never point a peer output option at the worktree session record.

Required wrapper values:

```text
trusted_read_root  absolute existing directory containing every permitted input
schema_file        one canonical record-owned artifact schema
prompt_file        complete frozen neutral envelope
response_file      peer stdout only
stderr_file        immediate diagnostic only
peer_timeout       positive manager-supplied bound
```

All five file/root values are resolved and containment-checked before launch. Input files are regular non-symlink files. Output files begin absent. The wrapper records their preimages when a retry could encounter an existing path.

## Codex peer form

```bash
timeout "$peer_timeout" codex exec \
  -C "$trusted_read_root" \
  --ephemeral \
  --sandbox read-only \
  --output-schema "$schema_file" \
  - < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

Installed-help meanings:

- `-C` sets Codex's working root.
- `--ephemeral` runs without persisting session files.
- `--sandbox read-only` selects the read-only sandbox for model-generated commands.
- `--output-schema` accepts a path to the JSON Schema for the final response.
- `-` reads the prompt from standard input.

Do not use `--add-dir`, `workspace-write`, `danger-full-access`, `--json`, or `--output-last-message` for this boundary. The response must be the one artifact JSON value, not an event stream or a second output channel.

## Claude peer form

The parent wrapper starts the command from `trusted_read_root` and supplies the prompt on standard input:

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

Installed-help meanings:

- `-p` prints a non-interactive result and exits.
- `--permission-mode plan` selects plan permission mode.
- `--no-session-persistence` disables saved sessions for print mode.
- `--safe-mode` disables user and project customizations for the call.
- `--tools` restricts built-in tools to the named read-only set.
- `--json-schema` accepts a JSON Schema value. It does not accept the schema path as a schema value.

Compact the schema with `jq -c .` and pass those contents. Do not add `Bash`, `Write`, `Edit`, a background agent flag, a persistence flag, or a write directory.

## Neutral prompt envelope

Render the envelope deterministically. Keep headings and field order stable so its digest is reproducible.

```text
operationKind: draft | cross-review | evaluation-report
expectedKind: draft | cross-review | evaluation-report
expectedSystem: claude | codex
step: ideation | planning | execution | wrap-up
iteration: positive integer
assignment: stable assignment ID
runtimeIdentity: new wrapper-assigned process identity
invocationIdentity: new one-use identity
contractSha256: lowercase SHA-256
subjectSystem: opposite system when cross-review
subjectSha256: rendered draft or evaluated subject SHA-256 when required
scope: complete in-scope, out-of-scope, authority, and failure contract
inputs: complete labeled contents plus digest for every binding artifact
output: exactly one JSON object matching the selected schema; no prose or fences
```

The peer echoes only fields defined by the selected schema. `invocationIdentity` is wrapper evidence and is not added to the closed artifact JSON. The wrapper binds it to the fresh `runtimeIdentity`, prompt digest, launch, and response digest to reject replay.

## Operation packages

### Draft

Include the same neutral contract and complete evidence used for the other system. Exclude the other draft and all information derived from it. Expect:

- `kind` equal to `draft`;
- the assigned system, step, iteration, assignment, and runtime identity; and
- `contractSha256` equal to the frozen envelope's neutral-contract digest.

### Cross-review

Include the complete neutral contract and the complete rendered opposite-system draft after both drafts freeze. Exclude the reviewer's own draft as a comparison input. Expect:

- `kind` equal to `cross-review`;
- `subjectSystem` equal to the opposite system;
- `subjectSha256` equal to SHA-256 of the exact rendered subject Markdown; and
- `contractSha256` equal to both frozen drafts' contract digest.

### Evaluation report

Include every item in the evaluation owner's frozen bundle. Include the complete canonical subject, both drafts, both cross-reviews, decisions, applicable waiver, scope, upstream artifacts, scenarios, checklist source, plan, and verification. Exclude every evaluator report and prior evaluator context. Expect:

- `kind` equal to `evaluation-report`;
- `subjectSha256` equal to the exact evaluated subject digest;
- the ordered seven perspectives and Overall;
- a complete finding ledger and checklist; and
- the schema-derived verdict.

## Strict response gate

Run every gate before `write-artifact`:

1. `command -v` proves the selected peer, `timeout`, `jq`, and `jsonschema` are available.
2. The prompt and schema files exist, are non-empty regular files, and pass their own parse checks.
3. The peer runs once in the foreground. Capture its exact status immediately.
4. Status `124` is timeout. Any nonzero status blocks. Read the bounded stderr diagnostic and stop.
5. The response is a non-empty regular file. `jq -e -s 'length == 1'` proves one top-level JSON value. Require `jq -e -s 'length == 1 and (.[0] | type == "object")'` before any field read.
6. `jsonschema -i "$response_file" "$schema_file"` passes the complete closed schema.
7. `jq` equality checks bind kind, system, step, iteration, assignment, and runtime identity to the frozen envelope.
8. Recompute and compare `contractSha256`, `subjectSystem`, and `subjectSha256` as applicable.
9. Compare the runtime identity, invocation identity binding, prompt digest, and response digest with prior peer-operation evidence. Any reuse or stale identity blocks.
10. Confirm the canonical target matches the current system, step, iteration, task when applicable, and artifact kind. A frozen valid target is not overwritten by a different invocation.

Do not trim fences, select the first of several values, extract JSON from prose, repair fields, or rerender a response before validation. Any such transformation would make the wrapper an author.

## Storage and owner validation

After the strict gate, store the unmodified JSON response:

```bash
.gobbi/projects/gobbi/skills/record/scripts/session-record.sh write-artifact \
  --root "$session_root" \
  --kind "$expected_kind" \
  --input "$response_file" \
  --target "$canonical_target" \
  --expected-system "$expected_system" \
  --expected-step "$expected_step" \
  --expected-iteration "$expected_iteration" \
  --expected-assignment "$expected_assignment"
```

Reread the rendered target and verify its machine JSON matches the validated input. Then use the owner command that matches the boundary.

Complete WORK package:

```bash
.gobbi/projects/gobbi/skills/workflow/scripts/validate-dual-system-work.sh \
  --root "$session_root" \
  --step "$expected_step" \
  --iteration "$expected_iteration" \
  --assignment "$expected_assignment"
```

For Execution, also pass the validator's canonical `--task task-NN-slug` argument.

One evaluation report:

```bash
.gobbi/projects/gobbi/skills/evaluation/scripts/validate-evaluation-report.sh one \
  --report "$stored_report" \
  --expected-system "$expected_system" \
  --expected-step "$expected_step" \
  --expected-iteration "$expected_iteration" \
  --expected-assignment "$expected_assignment" \
  --expected-subject-sha256 "$expected_subject_sha256"
```

The manager runs pair validation only after both independently produced reports pass `one`. A package validator is not run prematurely while required package artifacts are still absent.

## Failure matrix

| Failure | Evidence to surface | Mutation rule |
|---|---|---|
| Binary unavailable | binary name and `command -v` result | No launch and no target write |
| Timeout | status `124` and configured bound | No partial response storage |
| Process error | nonzero status and immediate stderr diagnostic | No target write |
| Empty output | response size check | No target write |
| Multiple values or wrapper text | strict parse result | No extraction or repair |
| Schema-invalid output | schema path and validator failure | No target write |
| Identity mismatch | expected and observed field | No relabeling |
| Digest mismatch | named expected and observed digest | No stale-input acceptance |
| Reused process or response | prior identity/digest collision | No replay |
| Record command failure | exact command diagnostic | Existing target remains authoritative |
| Package/report validator failure | exact owner-validator diagnostic | Pause before workflow transition |

The active-runtime assistant reports the failure. It does not generate substitute content. The manager owns all recovery choices and any user-approved one-system waiver.

## References

- [Codex tool skill](SKILL.md)
- [Dual-system WORK](../workflow/steps/dual-system-work.md)
- [Evaluation method](../evaluation/SKILL.md)
- [Record command map](../record/record-map.md)
- [Draft schema](../record/schemas/draft.schema.json)
- [Cross-review schema](../record/schemas/cross-review.schema.json)
- [Evaluation-report schema](../record/schemas/evaluation-report.schema.json)
- [Dual-system WORK validator](../workflow/scripts/validate-dual-system-work.sh)
- [Evaluation report validator](../evaluation/scripts/validate-evaluation-report.sh)
