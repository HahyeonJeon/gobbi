# Partner

## Intent

Partner is Gobbi's Tool Manual for invoking one named runtime from `{claude-code, codex, cursor, grok}` through
[Delegation](../../../skills/delegation/SKILL.md). The recorded policy is `disabled` or one or two of those
names in lexicographic order. Valid two-name values are `claude-code,codex`, `claude-code,cursor`,
`claude-code,grok`, `codex,cursor`, `codex,grok`, and `cursor,grok`. Launch set is the selected names minus
the active runtime. An empty launch set after skip stays valid and is not rewritten to `disabled`. The caller
retains participant selection, scope, synthesis, acceptance, and every next action.

## Write contract

Every Partner prompt names three required absolute paths:

- the worktree write root;
- the Gobbi session directory inside that worktree;
- one writing path under that worktree for the named result.

The assignment write set is `writing-path-only`, `runtime-directory`, or `worktree`. A missing write
set means `writing-path-only`. `writing-path-only` may change only the named writing path.
`runtime-directory` may also write sibling `checklist.md` beside `writing-path` and may create the
missing parent of `writing-path` when that parent resolves inside the caller-named directory from
the brief and is not a symlink. Both files must be regular, non-symlink, and non-empty. Missing
`checklist.md` is a missing result. Forbidden under this set: `gate.md`, other siblings, nested
files, other runtimes' directories, target files, and reusable checklist sources. Remaining-runtime
wrappers may run in parallel when every assignment is `writing-path-only` or `runtime-directory`
and those writing-paths plus implied `checklist.md` siblings are disjoint. A `worktree` assignment
stays serial. `worktree` may change listed worktree paths.
Documented extras are incidental only: Grok `~/.grok/`, `/tmp`, `/var/tmp`, and official macOS temp dirs;
incidental Codex `/tmp`; and the wrapper capture directory. They are not results.

The process returns a compact final Handoff on stdout that names the writing path and every changed worktree
path. The caller records the preimage, verifies the listed worktree write set, unchanged main checkout, and
unchanged worktree git semantic state (`HEAD`, current branch, and `git worktree list` registration), rereads
the result, reproduces verification, and compares the Handoff with direct evidence.

## Runtime boundary

Each run uses a fresh, non-persistent named-runtime process with the worktree as cwd. The process may read
outside the worktree and may use workspace-bounded Bash. Codex uses `codex exec` with a `workspace-write`
sandbox and a disk-full-read-access grant, without `--add-dir`. Claude Code uses print mode with
`acceptEdits`, no session persistence, safe mode, `--add-dir` of the main checkout, and `Read`, `Grep`,
`Glob`, `Write`, `Edit`, and workspace-bounded `Bash`.

Grok 1.0.5 launches with `--cwd` at the worktree and `--sandbox workspace`. The postimage allows the
authorized write set. It fails a main-checkout identity change and a non-extra outside-worktree write.
`--always-approve` is not the restricting flag.

The command table was verified against Codex CLI 0.147.0, Claude Code 2.1.234, and Grok 1.0.5.
Installed `codex exec --help`, `claude --help`, and `grok --help` remain authoritative for later versions.

Cursor is named. Command availability is Unavailable. The measured binary is `cursor-agent`
`2026.08.11-e8db854`. Installed help starts with `Usage: agent [options] [command] [prompt...]` and names
`--sandbox` (`enabled` or `disabled`) and `--workspace`. A write-test with `--sandbox enabled` failed to
start (AppArmor); the target was not created. `--sandbox disabled` is not the bound. Never invoke bare
`agent`. Do not pass `--resume`, `--continue`, `--session-id`, `--worktree`, or `--yolo`.

## Failure boundary

A missing binary, timeout, process error, missing result, unexpected write, tool denial, or Handoff mismatch ends the run.
Partner never repairs, extracts, relabels, moves, or automatically retries the result. The caller decides
whether to retry with a new assignment, repair bounded input, continue without Partner when authorized, or
stop.

The caller starts each launch through one local wrapper subagent using the active runtime's ordinary
execute-capable spawn. Wrappers for different remaining runtimes may run in parallel. The wrapper only runs
the Partner command and returns the Handoff. Partner is not a persistent teammate. Context-aware
re-delegation belongs to Agent Teams and other active-runtime subagent controls; every Partner process
starts fresh to preserve named-runtime independence.

## References

- [Canonical Partner skill](../../../skills/gobbi/partner/SKILL.md)
- [Agent Teams](../../../skills/gobbi/agent-teams/SKILL.md)
- [Plugin skill locator](../architecture/plugin-skill-locator.md)
- [Measured Codex CLI behavior](../../learnings/codex/tips.md)
- [Measured Cursor CLI behavior](../../learnings/cursor/tips.md)
- [Evaluation](../process/evaluation.md)
