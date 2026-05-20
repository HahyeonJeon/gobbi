### SessionStart matcher must include `clear`
---
priority: high
tech-stack: claude-code, hooks
enforcement: advisory
---

**What happened**

The `SessionStart` hook in `plugins/gobbi/hooks/hooks.json` and `.claude/settings.json` was registered with `matcher: "startup|resume|compact"`. After the user ran `/clear`, the hook did not fire — the next turn's shell had `$CLAUDE_SESSION_ID` and `$CLAUDE_ENV_FILE` empty, breaking every `gobbi config` and `gobbi workflow` call that depends on the env-file pipeline.

**User feedback**

> I think the root cause is that the $CLAUDE_SESSION_ID ENV VARS were not set after "/clear".

**Correct approach**

Per Anthropic's hooks doc, `SessionStart` fires with `source` ∈ {`startup`, `resume`, `clear`, `compact`}. `/clear` starts a NEW session (new `session_id`) and emits `source: "clear"`. The matcher MUST include `clear` for the hook to re-populate `$CLAUDE_ENV_FILE`. Use `"startup|resume|clear|compact"` in every place that registers the SessionStart matcher: plugin manifest, per-repo `.claude/settings.json`, install-test assertions, and any docs/scenarios referencing the canonical matcher.

`gobbi notify configure` writes blocks WITHOUT a matcher (fires for every source) — that path was already correct.
