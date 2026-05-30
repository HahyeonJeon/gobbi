# Risk

## COD-RISK-001 — Installed-runtime checks mutate Claude plugin state without an explicit cleanup boundary

Type: assumption_risk
Severity: Medium
Confidence: 75

Evidence:
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:172-177` installs the plugin into a clean installed-only environment and asserts a cache path under `~/.claude/plugins/cache/<id>/`.
- `.gobbi/projects/gobbi/sessions/2026-05-30-0fd65721-c39f-4305-b296-9961aee8e1c1/planning/rawdata/plan.md:191-196` reuses that installed plugin for T6 and may conditionally edit `.claude/settings.json`.
- The task records do not specify an isolated temporary Claude home/config root, plugin uninstall/marketplace removal, cache cleanup, or rollback boundary if T5 or T6 fails mid-run.

Why-it-matters:
Execution can leave user-level plugin marketplace, install cache, or project permissions state behind, contaminating later validations. A stale install also weakens the worktree-sentinel proof because future checks may observe a previous cache.

Suggested-direction:
Make T5/T6 run in an isolated temp Claude config/HOME when possible. If the real user config must be used, require recorded pre-state, explicit uninstall/marketplace-remove/cache cleanup commands, and a verifier that the plugin registry and settings are restored except for the intentional T6 conditional `+2` allow entries.
