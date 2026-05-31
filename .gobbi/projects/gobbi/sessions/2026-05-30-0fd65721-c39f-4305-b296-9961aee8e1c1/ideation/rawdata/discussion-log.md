# Ideation Discussion Log — session 2026-05-30-0fd65721

## 2026-05-30 — Q: Session goal | A: Build gobbi as a Claude Code plugin + author claude-plugin skill | Decision: scope (Always-Ask)
User set the session goal: (1) create `.claude-plugin/` + implement gobbi as an installable Claude Code plugin; (2) author a `claude-plugin` skill capturing the learnings.

## 2026-05-30 — Q: Orchestration mode | A: Auto | Decision: auto-decide (config)
Mode = auto; settings = defaults (worktree-pr, opus/sonnet split, evaluate=always all loops).

## 2026-05-30 — Q: claude-plugin skill nature | A: General authoring guide + layered gobbi specifics | Decision: scope (Always-Ask)
Skill = general Claude-Code-plugin authoring/update guide with a layered gobbi-specific section; homed at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` + `.claude/skills/claude-plugin/` mirror symlink.

## 2026-05-30 — Q: Plugin breadth (DD-1, deferred to leader research) | A: Full (skills + agents + hooks) | Decision: design+scope (Always-Ask)
Plugin packages all three component types. Rationale: agents + hooks are load-bearing; hooks are relocation-safe per research (bodies resolve targets from runtime inputs, not own path).

## 2026-05-30 — Q: Install path (DD-4) | A: In-repo marketplace.json + local install | Decision: design (Always-Ask)
Real install/update/uninstall lifecycle via `/plugin marketplace add ./` + `/plugin install`.

## 2026-05-30 — Q: marketplace.json in scope (DD-5) | A: Yes | Decision: scope (Always-Ask)
Author `.claude-plugin/marketplace.json` (Claude schema, distinct from the Codex marketplace schema already in repo) this session.

## 2026-05-30 — Q: Plugin root layout (DD-2) | A: Point manifest at canonical .gobbi real files | Decision: auto-decide (forced by research)
Manager auto-decided: install copies and SKIPS escaping symlinks for security, so pointing at `.claude/` (symlinks into `.gobbi/`) yields an empty plugin. Manifest must target the canonical real files under `.gobbi/projects/gobbi/skills|agents/` (matches `.codex-plugin` prior art). The alternative option was technically broken, so not surfaced as a user choice.

## 2026-05-30 — iter-1 EVALUATION reconciled REVISE (Claude PASS, Codex REVISE) | Decision: design (Always-Ask re-decision)
Dual-system divergence. Codex caught real gaps Claude missed; manager verified the load-bearing one against git history:
- P1 (verified TRUE): a full Claude Code plugin + marketplace (`plugins/gobbi-core`, commit 62b95a0 #6) existed through v0.4.5 and was wiped in the v0.5 reset (#263/#264). Prior fixes #251 (materialize symlinks for marketplace fetch) + ba8aa42 (remove invalid hooks/agents fields from plugin.json) + #254/#255/#256 (plugin metadata-hook saga) are authoritative references.
- R1 (High/75): repo-root plugin root would copy the 77M `.gobbi/.../sessions` tree into the global plugin cache.
- S1 (High/75): `agents` manifest key takes file paths, not a directory; `.gobbi/.../agents/` mixes `.md` + `.toml` (Codex) files.
- R2 (Medium/75): hook double-registration must be a Planning blocker with a decided steady-state.

## 2026-05-30 — Q: iter-2 approach | A: Build a perfectly fresh v0.5.0 plugin named `gobbi` (not gobbi-core, not a resurrection) | Decision: approach (Always-Ask)
Mine the wiped gobbi-core history for proven solutions, but build fresh on the current v0.5 structure; plugin name = `gobbi`.

## 2026-05-30 — Q: layout re-decision (overturns DD-2) | A: The plugin ships ONLY skills + agents + hooks — nothing else | Decision: design (Always-Ask)
Plugin root is a dedicated self-contained package (`.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`); install copies ONLY those three component types — no session memory, no repo content. Resolves R1 (bounded payload) and forces explicit agent-file enumeration (S1: the 5 `.md` agents only, exclude `.toml`). Supersedes the iter-1 ratified DD-2 ("root at repo root, point at canonical .gobbi dirs").

## Open residual (now a Planning blocker, per R2)
Hook double-registration: decide whether the plugin's `hooks/hooks.json` replaces or coexists with the project-local `.claude/settings.json` hook registration; require validation that each hook fires exactly once after install.
