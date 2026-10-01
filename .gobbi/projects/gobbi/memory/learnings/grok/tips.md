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
`hookSpecificOutput.additionalContext` only. The hook file names the runtime. The script does not probe for a
host. SessionStart fires once per session and cannot inject text on a later user turn.

**Application:** Grok SessionStart prints nothing. Store one settings report there. The next eligible Stop
shows it once and then deletes it. Do not use a per-turn lock. See
[Session hooks](../../design/feature/stop-reminder.md).

## Grok roles load from the plugin

**Context:** Launching a Gobbi role on Grok.

**Tip:** This checkout loads Grok from `plugins/gobbi` through `.grok/plugins/gobbi`. It does not keep
`.grok/agents`, `.grok/skills`, or `.grok/hooks`. A 2026-09-26 probe of Grok 1.0.41 found local `--agent`
files only in `.grok/agents/`, and an unknown name fell back to `grok-build-plan` with no error. That
directory is not this checkout's load path.

**Application:** Do not add `.grok/agents` as the load path. After a launch that still uses `--agent`, read
`agent_name` in the saved session's `summary.json`. See
[Grok silent fallback](../../backlogs/project.md#grok-silent-fallback-for-an-unknown-agent-name).
