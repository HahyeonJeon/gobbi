# Partner

## Intent

Partner is Gobbi's Tool Manual for using the runtime opposite the active runtime through
[Delegation](../../../skills/delegation/SKILL.md). Claude Code invokes Codex, and Codex invokes Claude Code.
The caller retains participant selection, scope, synthesis, acceptance, and every next action.

## Write contract

Every Partner prompt names two required absolute paths:

- the Gobbi session directory that contains the external run;
- one writing path inside that session directory for the authoritative result.

The external process receives write permission only to produce that result. It returns a compact final Handoff
on stdout that references the saved file instead of reproducing it. The caller records the preimage, verifies
that no other session path changed, rereads the result, reproduces verification, and compares the Handoff with
direct evidence.

## Runtime boundary

Each run uses a fresh, non-persistent opposite-runtime process. Codex uses `codex exec` with the session
directory as a `workspace-write` sandbox; Claude Code uses print mode with `acceptEdits`, no session
persistence, safe mode, and only `Read`, `Grep`, `Glob`, `Write`, and `Edit`.

The command table in the canonical skill was verified against Codex CLI 0.147.0 and Claude Code 2.1.226.
Installed `codex exec --help` and `claude --help` remain authoritative for later versions.

## Failure boundary

A missing binary, timeout, process error, missing result, unexpected write, or Handoff mismatch ends the run.
Partner never repairs, extracts, relabels, moves, or automatically retries the result. The caller decides
whether to retry with a new assignment, repair bounded input, continue without Partner when authorized, or
stop.

Partner is not a persistent teammate. Context-aware re-delegation belongs to Agent Teams and other active
runtime subagent controls; every Partner invocation starts fresh to preserve opposite-runtime independence.

## References

- [Canonical Partner skill](../../../skills/gobbi/partner/SKILL.md)
- [Agent Teams](../../../skills/gobbi/agent-teams/SKILL.md)
- [Plugin skill locator](../architecture/plugin-skill-locator.md)
- [Measured Codex CLI behavior](../../learnings/codex/tips.md)
