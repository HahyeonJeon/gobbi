# Settings shell-quoting for JSON-array / JSON-object values

When writing array or object values via `gobbi config set`, the shell can eat the brackets unless they're single-quoted. The result is silent corruption: the CLI stores the stripped string instead of the structured value, and later reads surface a type mismatch only when the validator runs.

---

### Bash eats `[...]` and `{...}` without single quotes

**Priority:** High (wrong output looks correct)

**What happened:**
A setup script ran `gobbi config set notify.slack.events [workflow.complete,error]` without quoting the bracketed array. Bash interpreted `[workflow.complete,error]` as a glob pattern, found no matches, and passed the literal string `[workflow.complete,error]` as a scalar. The CLI's coercion rules saw a leading `[`, attempted `JSON.parse`, and failed on the unquoted element names — then silently fell back to string coercion.

The result: `notify.slack.events = "[workflow.complete,error]"` (a string literal) instead of `["workflow.complete", "error"]` (the intended array). Downstream `validateSettings` rejected the file on next read, and `gobbi config get` exited 2 with an AJV diagnostic about type mismatch — far from the original write.

**User feedback:**
After a 20-minute debugging session: "why doesn't my events filter work?"

**Correct approach:**

Always single-quote JSON-array and JSON-object values passed to `gobbi config set`:

```
gobbi config set notify.slack.events '["workflow.complete", "error"]'
gobbi config set notify.slack '{"enabled": true, "events": ["error"]}'
```

Double-quotes work for simple cases but interpolate `$` — use single-quotes by default.

For scripted callers (e.g., the `/gobbi` skill's FIFTH step), construct the JSON string in code and pass it as a single argv element. Do NOT build the value by concatenating shell expansions — that path leaks shell interpretation.

Scalars (`true`, `false`, `null`, numbers, plain strings) don't need quoting. The coercion rule is: leading `[` or `{` triggers JSON.parse; anything else is coerced via the primitive rules in `commands/config.ts`.

**Related:**
- `commands/config.ts::coerceValue` documents the leading-character detection
- The regex for plain numbers is deliberately strict (`^-?(?:0|[1-9]\d*)(?:\.\d+)?$`) — rejects leading-zero and exp-form to avoid silent number coercion of zero-padded IDs
- Testing shell escape behavior via `echo "$VALUE"` before the `set` call is a cheap pre-flight
