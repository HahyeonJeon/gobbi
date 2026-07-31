# Wrap-up Handoff Template

This direct child supplies the operator brief used by parent Step 2.2 and the Git receipt used by parent
Step 4.2. [`SKILL.md`](SKILL.md) owns the operation, actors, authority, sequencing, failures, and recovery.

The report is durable Memory. The receipt is conversation-only evidence created after Git finalization and
must never be added to the report.

## Tracked operator brief

Write the tracked report with this template:

````markdown
# Handoff · {outcome title}

> **Work status:** {Complete | Complete with concerns | Stopped}
>
> {One-sentence factual outcome.}

| Context | Value |
|---|---|
| Mode | `{Cowork | Workflow}` |
| Session | `{Gobbi UUID}` |
| Prepared | `{ISO 8601 UTC}` |
| Base | `{base branch} @ {base commit}` |
| Work branch | `{branch}` |
| Worktree | `{absolute worktree path}` |
| Git intent | `{local | push | pull request, plus configured extras}` |

## Delivered

- **{Outcome}:** {What changed and why it matters.}
  **Evidence:** {Repository-relative artifacts, commits already present before finalization, and verification.}

## Memory

- **Created:** {Paths or `None`.}
- **Updated:** {Paths or `None`.}
- **Moved or removed:** {Paths or `None`.}

## Quality and decisions

- **Verification:** {Exact checks and results.}
- **Evaluation:** {Coverage and verdict, waiver, decline, or `Not run`.}
- **Decisions to respect:** {Durable constraints or `None`.}
- **Limits and risks:** {Known concerns or `None`.}

## Continue

> **Next objective:** {One concrete continuation objective or `None — work is complete`.}

**Read first**

1. {Repository-relative path or `None`.}
2. {Repository-relative path or remove this row when one item is enough.}

**First command**

```bash
{Exact read-only recovery or continuation command, or `# None — work is complete`}
```
````

### Content rules

- Keep every displayed heading and mandatory field. Use `None` when mandatory content is empty; omit only an
  explicitly optional repeated row.
- Use ISO 8601 UTC for `Prepared`. Use repository-relative or project-relative paths everywhere except the
  absolute `Worktree` value and an exact command that requires an absolute path.
- State one factual work status. `Complete with concerns` names each concern under `Limits and risks`;
  `Stopped` names the blocker and recovery objective without claiming completion.
- Cite only evidence that exists before Git finalization. Existing shaping or task commits may be cited when
  they predate the finalization step.
- Describe the intended Git path in `Git intent`, not its outcome. Never claim the report's own final commit,
  push, pull request, issue, merge, branch removal, or worktree removal.
- Keep the operator brief portable and easy to scan. Use its hierarchy, whitespace, status card, compact
  context table, short lists, and fenced command without renderer alerts, icons, emoji, color, or
  position-dependent meaning.

## Display-only Git receipt

After displaying the verified tracked report unchanged, append this separate template:

````markdown
## Git receipt

| Action | State | Evidence |
|---|---|---|
| Local commit | `{completed | failed | not attempted}` | {Direct evidence.} |
| Publication | `{not configured | not authorized | deferred | failed | completed}` | {Direct evidence.} |
| Merge | `{not configured | not authorized | deferred | failed | completed}` | {Direct evidence.} |
| Branch | `{retained | removed}` | {Direct evidence.} |
| Worktree | `{retained | removed}` | {Direct evidence.} |

**First recovery command**

```bash
{Exact command, or `# None — no recovery action is required`}
```
````

### Receipt rules

- Keep all five rows even when an action did not occur. Use only the literal states offered by that row.
- Derive every state from direct current evidence. Never convert intent, authority, a successful prerequisite,
  or visual completeness into a successful outcome.
- Name the commit hash, ref, pull request, merge result, registered worktree, retained branch, failure, or
  absence that proves each row. Use `None` only when a mandatory evidence value is genuinely empty.
- Give the first safe recovery command for a retained, deferred, or failed state. Use the explicit no-recovery
  comment only when direct evidence shows that no recovery action is required.
- Keep the receipt outside the tracked report and its frozen digest. Do not edit the report to reconcile a
  later Git result.
