# Peer Adapters

Direct lookup for the symmetric command-line peer boundary described by [Codex](SKILL.md). The active-runtime assistant owns this wrapper boundary. Opposite-system processes remain read-only, ephemeral, and unable to write the Gobbi session tree.

## Supported installed surfaces

| Direction | Installed version verified during implementation | Peer command |
|---|---|---|
| Claude Code to Codex | Codex CLI 0.146.0 | `codex exec -C ROOT --ephemeral --sandbox read-only -` |
| Native Codex to Claude | Claude Code 2.1.220 | `claude -p --permission-mode plan --no-session-persistence --safe-mode --tools "Read,Grep,Glob"` |

Re-run `codex exec --help` and `claude --help` before changing a flag or relying on a later installed version. Installed help wins over remembered syntax.

## Wrapper-owned temporary boundary

Create the prompt, response, and stderr capture in a runtime temporary directory outside the session tree. The wrapper owns those files and removes them after the operation completes or its failure is surfaced. Never point a peer output option at the worktree session record.

Required wrapper values:

```text
trusted_read_root  absolute existing directory containing every permitted input
prompt_file        complete frozen neutral envelope
response_file      peer stdout only
stderr_file        immediate diagnostic only
peer_timeout       positive manager-supplied bound
```

All four file/root values are resolved and containment-checked before launch. Input files are regular non-symlink files. Output files begin absent. The wrapper records their preimages when a retry could encounter an existing path.

## Codex peer form

```bash
timeout "$peer_timeout" codex exec \
  -C "$trusted_read_root" \
  --ephemeral \
  --sandbox read-only \
  - < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

Installed-help meanings:

- `-C` sets Codex's working root.
- `--ephemeral` runs without persisting session files.
- `--sandbox read-only` selects the read-only sandbox for model-generated commands.
- `-` reads the prompt from standard input.

Do not use `--add-dir`, `workspace-write`, `danger-full-access`, `--json`, or `--output-last-message` for this boundary. The response must be the one report on standard output, not an event stream or a second output channel.

## Claude peer form

The parent wrapper starts the command from `trusted_read_root` and supplies the prompt on standard input:

```bash
timeout "$peer_timeout" claude \
  -p \
  --permission-mode plan \
  --no-session-persistence \
  --safe-mode \
  --tools "Read,Grep,Glob" \
  < "$prompt_file" > "$response_file" 2> "$stderr_file"
```

Installed-help meanings:

- `-p` prints a non-interactive result and exits.
- `--permission-mode plan` selects plan permission mode.
- `--no-session-persistence` disables saved sessions for print mode.
- `--safe-mode` disables user and project customizations for the call.
- `--tools` restricts built-in tools to the named read-only set.

Do not add `Bash`, `Write`, `Edit`, a background agent flag, a persistence flag, or a write directory.

## Neutral prompt envelope

State every field below in the prompt. The order is a readable convention, not a protocol the peer must reproduce.

```text
operationKind: draft | cross-review | evaluation-report
expectedSystem: claude | codex
step: ideation | planning | execution | wrap-up
iteration: positive integer
assignment: stable assignment ID
runtimeIdentity: new wrapper-assigned process identity
invocationIdentity: new one-use identity
subjectSystem: opposite system when cross-review
scope: complete in-scope, out-of-scope, authority, and failure contract
inputs: complete labeled contents for every binding artifact
output: exactly one self-contained report and nothing else
```

The peer restates the binding identity fields in its report and adds no other metadata. `invocationIdentity` is wrapper evidence and is not stated back. The wrapper binds it to the fresh `runtimeIdentity` and that single launch, so a reused identity is rejected as replay.

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
| Truncated, doubled, or second-channel output | the observed extra or missing content | No extraction or repair |
| Identity mismatch | expected and observed field | No relabeling |
| Reused process or response | the prior operation that already used the identity | No replay |

The active-runtime assistant reports the failure. It does not generate substitute content. It does not trim fences, select the first of several responses, extract a fragment from a response, repair fields, or rerender a response; any such transformation would make the wrapper an author. The manager owns all recovery choices and any user-approved one-system waiver.

## References

- [Codex tool skill](SKILL.md)
