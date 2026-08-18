# Grok Tips

## A Grok host tool timeout can kill a finished Partner wrapper

**Context:** Grok hosts a Partner wrapper that runs an inner command such as
`timeout 720 claude`.

**Tip:** Grok's host tool cap is about 300 seconds. It can kill the wrapper after
the inner command has already finished. The wrapper's `$?` is then the host kill,
not Claude's exit. Read the wrapper capture files for the real result.

**Application:** Do not treat a non-zero wrapper exit as Partner failure until the
capture files are read. This host cap is not Grok's Partner
`[toolset.bash] timeout_secs`. See also
[Grok Partner write-bound](../work/tips.md).

## Only Stop can inject model-visible hook text

**Context:** Choosing a Grok hook event to feed reminder or other text to the model.

**Tip:** Grok ignores stdout for SessionStart and UserPromptSubmit. Stop is the event that can inject. Emit
`hookSpecificOutput.additionalContext` only. Identify Grok by a non-empty `GROK_HOOK_EVENT`. SessionStart
fires once per session and cannot re-inject on a later user turn.

**Application:** Do not add a SessionStart hook to inject text on Grok. Use Stop and a per-turn lock. See
[stop reminder](../../design/feature/stop-reminder.md).
