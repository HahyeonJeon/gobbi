# Partner

## Intent

Partner is Gobbi's Tool Manual for invoking one named runtime from `{claude-code, codex, grok}` through
[Delegation](../../../skills/delegation/SKILL.md). The recorded policy is `disabled` or one or two of those
names. Launch set is the selected names minus the active runtime. An empty launch set after skip stays valid
and is not rewritten to `disabled`. The caller retains participant selection, scope, synthesis, acceptance,
and every next action.

## Write contract

Every Partner prompt names two required absolute paths:

- the Gobbi session directory that contains the external run;
- one writing path inside that session directory for the authoritative result.

The external process receives write permission only to produce that result. It returns a compact final Handoff
on stdout that references the saved file instead of reproducing it. The caller records the preimage, verifies
that no other session path changed, rereads the result, reproduces verification, and compares the Handoff with
direct evidence.

## Runtime boundary

Each run uses a fresh, non-persistent named-runtime process. Codex uses `codex exec` with the session
directory as a `workspace-write` sandbox; Claude Code uses print mode with `acceptEdits`, no session
persistence, safe mode, and only `Read`, `Grep`, `Glob`, `Write`, and `Edit`.

Grok 1.0.4 launches with `--sandbox workspace`. The session and project postimage may change only the
contracted writing path. `--always-approve` is not the restricting flag.

The command table was verified against Codex CLI 0.147.0, Claude Code 2.1.226, and Grok 1.0.4.
Installed `codex exec --help`, `claude --help`, and `grok --help` remain authoritative for later versions.

## Failure boundary

A missing binary, timeout, process error, missing result, unexpected write, or Handoff mismatch ends the run.
Partner never repairs, extracts, relabels, moves, or automatically retries the result. The caller decides
whether to retry with a new assignment, repair bounded input, continue without Partner when authorized, or
stop.

Partner is not a persistent teammate. Context-aware re-delegation belongs to Agent Teams and other active
runtime subagent controls; every Partner invocation starts fresh to preserve named-runtime independence.

## References

- [Canonical Partner skill](../../../skills/gobbi/partner/SKILL.md)
- [Agent Teams](../../../skills/gobbi/agent-teams/SKILL.md)
- [Plugin skill locator](../architecture/plugin-skill-locator.md)
- [Measured Codex CLI behavior](../../learnings/codex/tips.md)
