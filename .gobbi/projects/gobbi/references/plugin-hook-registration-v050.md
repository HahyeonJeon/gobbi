# Plugin Hook Registration (v0.5.0)

## Purpose

This document resolves an empirical question for v0.5.0: how does Claude Code actually discover and load hooks from a plugin? Specifically, does `plugin.json` need to declare `"hooks": "./hooks/hooks.json"` for plugin hooks to fire, and does declaring *other* components (like `skills` or `agents`) in `plugin.json` disable hook auto-discovery?

The Phase 2 executor for PR F.4 (hook wiring) will consume this doc to decide whether the current `plugins/gobbi/.claude-plugin/plugin.json` needs a `hooks` field, and what the exact shape of `plugins/gobbi/hooks/hooks.json` must be. The doc also supersedes the assertion in `_gotcha/__system.md` about "auto-discovery of other components being disabled when `plugin.json` declares any component" — that assertion is refuted for hooks specifically.

## Claude Code version tested

- **Current binary inspected:** `2.1.110` (resolved from `claude --version`; binary at `$HOME/.local/share/claude/versions/2.1.110`, non-stripped ELF).
- **Live session log cross-reference:** `2.1.87` (from `~/.claude/debug/<session-uuid>.txt`, 2026-03-31). Same plugin-loader behavior visible in the log lines and in the 2.1.110 binary's embedded JS.

The behaviour described below is stable across Claude Code 2.1.87 through 2.1.110.

## Method

Hybrid — three independent evidence sources reinforcing each other:

1. **Binary source reading.** The Claude Code distribution binary is a bundled Node application with readable JavaScript strings and JSDoc-style schema descriptions. `strings $HOME/.local/share/claude/versions/2.1.110 | grep hooks.json` extracted the plugin-loader source including the `loadPluginHooks` function (minified as `ZQ`), the per-plugin manifest handler (`$YK`), and the zod schema for `manifest.hooks` (identifier `Wb_`). These are ground truth — this is the code that actually runs.

2. **Official documentation.** `WebFetch` of `https://code.claude.com/docs/en/plugins-reference` confirmed the public contract: "Location: `hooks/hooks.json` in plugin root, or inline in `plugin.json`" and the `hooks` field in the manifest is described as "Hook config paths **or inline config**" with the example `"./my-extra-hooks.json"` — "extra" explicitly signalling additional.

3. **Production log replay.** The gobbi plugin v0.4.5 was installed and active in multiple user projects (confirmed via `~/.claude/plugins/installed_plugins.json`). The cached install at `~/.claude/plugins/cache/gobbi/gobbi/0.4.5/` has the exact Cell 2 configuration (declares `skills` + `agents`, NOT `hooks`, with `hooks/hooks.json` present). The debug log at `~/.claude/debug/<session-uuid>.txt` from a real session on 2026-03-31 records the plugin loading end-to-end and the SessionStart hook firing.

No new scratch Claude Code session was spawned. All three evidence sources were already present on the machine; synthesising them answers every cell of the matrix without additional runtime risk.

## 4-cell matrix result

| | `plugin.json` declares `"hooks": "./hooks/hooks.json"` | `plugin.json` does NOT declare `hooks` |
|---|---|---|
| `hooks/hooks.json` present | **Cell 1 — FIRES with warning** (duplicate-detection error pushed to manifest errors list; hooks still registered from the auto-loaded standard location) | **Cell 2 — FIRES** (standard-location auto-load; no error) |
| `hooks/hooks.json` absent | **Cell 3 — ERROR, no hooks** (path-not-found error; manifest entry skipped; nothing auto-loaded either) | **Cell 4 — SILENTLY NO HOOKS** (no error, no hooks registered; plugin loads as a hookless plugin) |

### Supporting evidence per cell

**Cell 2 (FIRES) — the current gobbi configuration.** Confirmed both in source and in a live log.

Source (Claude Code 2.1.110 binary, from `$YK`, the per-plugin loader):
```js
let G, W = new Set, Z = b7.join(H, "hooks", "hooks.json");
if (await n4(Z)) try {
    G = await o3K(Z, f.name);                   // parse hooks.json
    try { W.add(await N1.realpath(Z)) } catch { W.add(Z) }
    N(`Loaded hooks from standard location for plugin ${f.name}: ${Z}`)
} catch (E) { /* error push */ }
```
The standard-location check is **unconditional** — it runs for every plugin regardless of what fields `plugin.json` declares.

Live log (Claude Code 2.1.87, 2026-03-31, gobbi plugin with `plugin.json` declaring `skills` + `agents` but not `hooks`):
```
[DEBUG] Loaded hooks from standard location for plugin gobbi: $HOME/.claude/plugins/marketplaces/gobbi/plugins/gobbi/hooks/hooks.json
[DEBUG] Checking plugin gobbi: skillsPath=none, skillsPaths=1 paths
[DEBUG] Loading hooks from plugin: gobbi
[DEBUG] Registered 8 hooks from 1 plugins
[DEBUG] Getting matching hook commands for SessionStart with query: startup
[DEBUG] Hooks: Registering async hook async_hook_86295 (SessionStart:startup) with timeout 5000ms
```
All eight hooks from `hooks/hooks.json` (3× SessionStart matchers + Stop + Notification + StopFailure + SubagentStop + SessionEnd) were registered; SessionStart fired at session start.

**Cell 1 (FIRES with warning).** When the manifest also lists `./hooks/hooks.json`, the loader sees the same real-path already in its loaded-set `W` and hits the duplicate branch:
```js
if (W.has(C)) {
    if (N(`Skipping duplicate hooks file for plugin ${f.name}: ${I} (resolves to already-loaded file: ${C})`), _) {
        let u = `Duplicate hooks file detected: ${I} resolves to already-loaded file ${C}. The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files.`;
        fH(Error(u)), A.push({ type: "hook-load-failed", source: $, plugin: f.name, hookPath: S, reason: u })
    }
    continue
}
```
`_` (the strict flag) defaults to `true` (`async function $YK(H,$,q,K,_=!0)`), so the error is always recorded on the plugin's errors list (visible via `/plugin`). The `continue` means the duplicate manifest entry is skipped — but the already-successful standard-location load means hooks still fire. Net effect: hooks work, plus a nagging load-time warning. Avoid.

**Cell 3 (ERROR, no hooks).** When the manifest points at `./hooks/hooks.json` but the file is missing, the path-not-found branch fires:
```js
if (!await n4(S)) {
    N(`Hooks file ${I} specified in manifest but not found at ${S} for ${f.name}`, {level:"error"}),
    fH(Error(`Plugin component file not found: ${S} for ${f.name}`)),
    A.push({ type: "path-not-found", source: $, plugin: f.name, path: S, component: "hooks" });
    continue
}
```
No standard auto-load is possible either (same file is missing), so no hooks register.

**Cell 4 (SILENT, no hooks).** The auto-load `if (await n4(Z))` guard returns false, no `hooksConfig` is assigned, and `loadPluginHooks` has:
```js
for (let K of H) { if (!K.hooksConfig) continue; /* ... */ }
```
The plugin is skipped silently — this is legitimate for plugins that only ship skills or agents.

## Root cause

> **Plugin hooks fire iff the file `hooks/hooks.json` exists at the plugin root.** The presence or absence of a `hooks` key in `plugin.json` is orthogonal to this: it only governs *additional* hook files to merge into the standard-location config.

The `manifest.hooks` field is declared in the Claude Code zod schema (identifier `Wb_`) with self-describing JSDoc:

> `"Path to file with additional hooks (in addition to those in hooks/hooks.json, if it exists), relative to the plugin root"`

and

> `"Additional hooks (in addition to those in hooks/hooks.json, if it exists)"`

And the duplicate-detection error message states it directly:

> `"The standard hooks/hooks.json is loaded automatically, so manifest.hooks should only reference additional hook files."`

This refutes the gotcha's overreach. The gotcha at `_gotcha/__system.md` correctly states that plugin `settings.json` does NOT accept hooks (that part is still true — `settings.json` is only for agent/model settings). But its secondary claim is wrong:

> ~~"When `plugin.json` declares any component paths (`skills`, `agents`), auto-discovery of other components is disabled — hooks must be explicitly listed."~~

Auto-discovery-disable-by-declaration is true for `agents`, `skills`, `commands`, and `output-styles`. For those four, the loader code is:
```js
let [M, w, D, j] = await Promise.all([
    !f.commands    ? n4(b7.join(H, "commands"))      : !1,
    !f.agents      ? n4(b7.join(H, "agents"))        : !1,
    !f.skills      ? n4(b7.join(H, "skills"))        : !1,
    !f.outputStyles? n4(b7.join(H, "output-styles")) : !1
]);
```
Declaring any of those in `plugin.json` short-circuits the dir-exists check for that component. Hooks are NOT in this list — the hooks loader runs unconditionally.

## Implications for current repo

**The current plugin.json is correctly wired for Phase 2.** No change is required to make hooks fire. Evidence:

- `plugins/gobbi/.claude-plugin/plugin.json` declares `skills` + `agents` + zero-production-deps, and does NOT declare `hooks`. This is Cell 2.
- `plugins/gobbi/hooks/hooks.json` exists with 8 hook entries across SessionStart/Stop/Notification/StopFailure/SubagentStop/SessionEnd.
- A real Claude Code 2.1.87 session (log from 2026-03-31) loaded this exact configuration and logged `Registered 8 hooks from 1 plugins` plus `Getting matching hook commands for SessionStart with query: startup`. The hooks fired.
- The current binary at 2.1.110 contains the same loader code (the `Loaded hooks from standard location` log line is still emitted at the same call site in `$YK`, confirmed via `strings`).

The design-doc claim in `v050-hooks.md` ("Claude Code v2.1 and later auto-load `hooks/hooks.json` from the plugin directory") is therefore confirmed. Its associated recommendation — "Declaring the same hooks in `plugin.json` causes duplicate detection errors at plugin load time. The hook manifest lives in one place — `hooks/hooks.json`. The `plugin.json` manifest does not contain a `hooks` key." — is empirically correct and should stand.

## Recommendation for PR F.4

**Do NOT add a `hooks` field to `plugins/gobbi/.claude-plugin/plugin.json`.** Adding `"hooks": "./hooks/hooks.json"` would drop us into Cell 1 and emit a duplicate-detection error on every session start.

**Keep the file path `plugins/gobbi/hooks/hooks.json`** exactly as-is — this is the standard auto-load location. Only the *contents* of `hooks/hooks.json` change for v0.5.0.

**`plugins/gobbi/hooks/hooks.json` v0.5.0 shape.** Per `v050-hooks.md` → "Hook-to-CLI Delegation," the v0.5.0 file expands the current `0.4.5` 8-entry file to cover the full v0.5.0 hook set. Each entry is a thin command delegation. PR F.4's exact target content is:

```json
{
  "hooks": {
    "SessionStart": [
      { "matcher": "startup|resume|clear|compact",
        "hooks": [{ "type": "command", "command": "gobbi workflow init", "timeout": 10 }] }
    ],
    "PreToolUse": [
      { "hooks": [{ "type": "command", "command": "gobbi workflow guard", "timeout": 5 }] }
    ],
    "PostToolUse": [
      { "matcher": "ExitPlanMode",
        "hooks": [{ "type": "command", "command": "gobbi workflow capture-plan", "timeout": 10 }] }
    ],
    "SubagentStop": [
      { "hooks": [{ "type": "command", "command": "gobbi workflow capture-subagent", "timeout": 30 }] }
    ],
    "Stop": [
      { "hooks": [{ "type": "command", "command": "gobbi workflow stop", "timeout": 10 }] }
    ]
  }
}
```

The 0.4.5 `gobbi notify *` commands are NOT part of v0.5.0's core hook model — if notification hooks are retained, PR F.4 may preserve them alongside the new entries, but that is a product decision for PR F.4's briefing, not a plugin-loader constraint. The matrix above only governs the loading contract.

**Reminders derived from the source that PR F.4 must honour:**

- The `command` string can use `${CLAUDE_PLUGIN_ROOT}` and `${CLAUDE_PLUGIN_DATA}` placeholders — these are substituted at hook-fire time. Only hooks *declared inside a plugin* can use these; user `settings.json` hooks get an error if they reference them.
- `plugins/gobbi/settings.json` must stay empty-ish (`{}`). Do NOT add hook config to plugin `settings.json` — Claude Code treats plugin `settings.json` only for agent/model overrides, per the original gotcha, which that part remains true. The `hooks.json` file is the sole plugin-hook surface.
- Default command-hook timeout is 600 s per `v050-hooks.md` → "Plugin Hook Registration." Per-entry `timeout` keys in `hooks.json` are in seconds (the same units that `0.4.5`'s existing file uses).

## Open questions for Phase 3

1. **Matcher precedence when multiple plugins register for the same event.** Source reading of `loadPluginHooks` shows hooks are flat-`push`ed into the registry in plugin-enumeration order (built-ins first, then plugins by enumeration order). Whether this leads to deterministic ordering across sessions — and whether gobbi's guards can rely on firing first vs. later — is not resolved here. Test with a second plugin that also registers PreToolUse once PR F.4 lands.

2. **`PATH` resolution for the `gobbi` command in subagents.** The hook command `gobbi workflow guard` assumes `gobbi` is on `PATH`. The user's shell `PATH` is what's used when Claude Code spawns the hook process. Subagents inherit the same environment, so this should work uniformly — but confirmation requires testing with a user whose `gobbi` binary lives in a non-default location. This is the kind of issue that would surface as silent guard failure; worth a runtime smoke test in PR F.4.

3. **`PluginHookHotReload` behaviour on `hooks.json` edits mid-session.** Source references `setupPluginHookHotReload` (`uM9`) and `resetHotReloadState`. It only reloads on "plugin-affecting settings changes" — direct edits to `hooks/hooks.json` during a session may or may not reload. Relevant for dev-loop iteration speed but not correctness.

4. **`StopFailure` / `Elicitation*` events.** These appear in the 2.1.110 schema (`bM9` enumerates `PostToolUseFailure`, `PermissionDenied`, `Elicitation`, `ElicitationResult`, `WorktreeCreate`, `WorktreeRemove`, `InstructionsLoaded`, `CwdChanged`, `FileChanged`, etc.) that gobbi's 0.4.5 hooks file already uses (`StopFailure` matcher `rate_limit|authentication_failed|billing_error|server_error`). They are not part of v0.5.0 design-doc scope but are available if Phase 3 wants to enforce additional signals.

5. **Whether Claude Code's `allowManagedHooksOnly` policy setting affects gobbi hooks.** The binary reads `E8("policySettings")?.allowManagedHooksOnly` in `$R7`. If an enterprise policy sets this, gobbi's plugin hooks won't run. Not relevant for individual dev use but is a deployment-time consideration for any enterprise distribution of gobbi.
