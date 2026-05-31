# Preparation Discussion Log — session 2026-05-30-0fd65721

## 2026-05-30 — Q: Hook double-registration steady-state (CP-1 / DD-8) | A: Dev-vs-installed split | Decision: design (Always-Ask)
User chose Option C (dev-vs-installed split), NOT the leader's recommended Option A (replace). Steady state: `.claude/settings.json` KEEPS the 3 hook-event registrations for in-repo development; the plugin's `hooks/hooks.json` serves installed users. Two registration sources, scoped to different contexts. Planning MUST: (a) keep the two coherent (drift risk between settings.json and hooks.json), and (b) add a fire-exactly-once validation keyed on hook_event_name for the installed case, and note the double-fire caveat on a machine that both develops in-repo AND installs the plugin.

## 2026-05-30 — Q: Permissions disposition (CP-2 / DD-9) | A: Keep project-local + verify auto-grant empirically | Decision: design (Always-Ask)
Do NOT ship `permissions.allow` in the bounded package (settings.json is out of the package per DD-2). Rely on plugin-component auto-grant; add a post-install invocability check (invoke one skill + one agent) to confirm. If the check proves components are NOT auto-granted, a follow-up re-opens the boundary. Note: packaging all 18 skills may require adding 2 project-local allow entries (Skill(codex), Skill(gobbi-hook-authoring)) which the live list omits.

## 2026-05-30 — Q: Skill inventory count (CP-3) | A: Package all 18 | Decision: auto-decide (completeness)
Manager auto-decided (completeness, not a trade-off): package all 18 canonical skills including the unmirrored 18th `gobbi-hook-authoring`. Logged here for auditability.

## Resolved (leader recommendations accepted as-is, not escalated)
- Package root = `plugins/gobbi/`; marketplace catalog at repo-root `.claude-plugin/marketplace.json`; plugin manifest at `plugins/gobbi/.claude-plugin/plugin.json`; marketplace `source: "./plugins/gobbi"`.
- Materialization: real copies in `plugins/gobbi/{skills,agents,hooks}/`; named re-sync trigger = any commit touching canonical `skills/`, `agents/*.md`, or `.claude/hooks/*.sh` re-materializes the package in the same commit; mechanical diff gate (e.g. `scripts/sync-plugin-package.sh`) — mechanism is Execution-level.
- DD-7 worktree-test default = Option (a): commit/push + git-ref marketplace source + worktree-sentinel assertion.
