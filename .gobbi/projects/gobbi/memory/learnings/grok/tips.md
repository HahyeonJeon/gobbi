# Grok Tips

## Only Stop can inject model-visible hook text

**Context:** Choosing a Grok hook event to feed reminder or other text to the model.

**Tip:** Grok ignores stdout for SessionStart and UserPromptSubmit. Stop is the event that can inject. Emit
`hookSpecificOutput.additionalContext` only. Identify Grok by a non-empty `GROK_HOOK_EVENT`. SessionStart
fires once per session and cannot re-inject on a later user turn.

**Application:** Do not add a SessionStart hook to inject text on Grok. Use Stop and a per-turn lock. See
[stop reminder](../../design/feature/stop-reminder.md).
