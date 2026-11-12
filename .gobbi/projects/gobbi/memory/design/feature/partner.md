# Partner

## Intent

[Partner](../../../skills/partner/SKILL.md) is a tool manual for a manager agent that runs another runtime's CLI
as a background partner: Codex, Claude Code, or Grok. The manager launches the process itself, learns that it
ended from the runtime's exit report and a captured status file, reads the final message and any changed files,
and follows up by resuming the captured session. A user can also invoke Partner directly, naming the runtime or
being asked which one.

## Policy and runtimes

- The session Partner policy is `disabled` or one or two of `{claude-code, codex, grok}`. Valid values are
  `disabled`, `claude-code`, `codex`, `grok`, `claude-code,codex`, `claude-code,grok`, and `codex,grok`. A
  recovered value outside that set, including one naming `cursor`, stops entry. A named set authorizes launching
  those runtimes except the active one, and `disabled` authorizes none.
- Cursor stays a supported runtime but is not a partner: `cursor-agent -p` failed with
  `Error: Authentication required` while `cursor-agent status` reported logged in. See the
  [Cursor tips](../../learnings/cursor/tips.md).
- The manager chooses participants, scope, synthesis, acceptance, and every next action.

## Manual shape

- The skill holds one run lifecycle (brief, capture directory, launch, completion, read, follow up), three
  access levels (read-only, workspace-write, full-access, the last only with the user's authorization for that
  run), one section per partner runtime with its launch command, options, output, session id, follow-up, and
  limits, one section per manager runtime for starting a background command, and a failure table.
- A run is launched by the manager in the background under `timeout`, not by a wrapper subagent. The write
  contract, write sets, and Handoff checks of the earlier design are removed; the manager reads the final
  message and the changed files itself and never edits, relabels, or automatically retries a result.
- The brief is one complete [Delegation](../../../skills/delegation/SKILL.md) brief that says the run is
  non-interactive and must name any denied tool or path in its final message. Captures (final message, session
  id, exit status, stderr) live in a private directory kept until the run is read.
- Read-only partner runs return their report as the final message and the caller saves it. The
  [Review](../../../skills/review/SKILL.md) skill uses a read-only Partner as its second reviewer.

## Failure boundary

A timeout, missing binary, authentication error, denied tool, empty or off-task output, or an unexpected file
change ends the run and is reported with its captures. A new run is a new decision. Measured behavior is dated
in the skill; installed `--help` stays authoritative after an upgrade.

## References

- [Canonical Partner skill](../../../skills/partner/SKILL.md)
- [Plugin skill locator](../architecture/plugin-skill-locator.md)
- [Measured Codex CLI behavior](../../learnings/codex/tips.md)
- [Measured Cursor CLI behavior](../../learnings/cursor/tips.md)
- [Review](../process/evaluation.md)
