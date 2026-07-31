# Peer Adapters

Direct lookup for the symmetric command-line peer boundary described by [Codex](SKILL.md). The active-runtime assistant owns this wrapper boundary. Opposite-system processes remain read-only, ephemeral, and unable to write the Gobbi session tree.

## Supported installed surfaces

| Direction | Installed version verified during implementation | Structured surface |
|---|---|---|
| Claude Code to Codex | Codex CLI 0.144.6 | `codex exec -C ROOT --ephemeral --sandbox read-only --output-schema FILE -` |
| Native Codex to Claude | Claude Code 2.1.214 | `claude -p --permission-mode plan --no-session-persistence --safe-mode --tools "Read,Grep,Glob" --json-schema JSON` |

Re-run `codex exec --help` and `claude --help` before changing a flag or relying on a later installed version. Installed help wins over remembered syntax.

## Wrapper-owned temporary boundary

Create the prompt, schema selection, response, and stderr capture in a runtime temporary directory outside the session tree. The wrapper owns those files and removes them after the operation completes or its failure is surfaced. Never point a peer output option at the worktree session record.

Required wrapper values:

```text
trusted_read_root  absolute existing directory containing every permitted input
schema_file        one structured-output schema supplied by the wrapper
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

Include the same neutral contract and complete evidence used for the other system. Exclude the other draft and all information derived from it.

### Cross-review

Include the complete neutral contract and the complete frozen opposite-system draft after both drafts freeze. Exclude the reviewer's own draft as a comparison input.

### Evaluation report

Include every item in the evaluation owner's frozen bundle. Include the complete canonical subject, both drafts, both cross-reviews, decisions, applicable waiver, scope, upstream artifacts, scenarios, checklist source, plan, and verification. Exclude every evaluator report and prior evaluator context.

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

The active-runtime assistant reports the failure. It does not generate substitute content. It does not trim fences, select the first of several values, extract JSON from prose, repair fields, or rerender a response; any such transformation would make the wrapper an author. The manager owns all recovery choices and any user-approved one-system waiver.

## References

- [Codex tool skill](SKILL.md)
