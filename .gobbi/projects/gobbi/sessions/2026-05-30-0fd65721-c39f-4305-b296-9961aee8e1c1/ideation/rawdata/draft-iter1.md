# Ideation Draft — `.claude-plugin` package + `claude-plugin` skill (iter 1, RATIFIED)

> STATUS: all design decisions below were **RATIFIED by the user via AskUserQuestion on 2026-05-30**
> (see `rawdata/discussion-log.md`). The leader's recommendations were accepted as-is: DD-1 full breadth,
> DD-2 canonical-file layout (manager auto-decided — alternative is technically broken), DD-3 hook
> registration relocation, DD-4 in-repo marketplace + local install, DD-5 marketplace.json in scope,
> DD-6 skill = general guide + layered gobbi section.

## Scope Contract

```yaml
artifact_type: scope-contract
feature: install-runtime
goal: "Package gobbi as an installable Claude Code plugin and codify plugin authoring as a reusable skill"
created-by: 0fd65721-c39f-4305-b296-9961aee8e1c1
created-at: 2026-05-30T00:00:00Z
```

**Project:** gobbi · **Feature:** install-runtime · **Task:** Two coupled deliverables —
(1) a `.claude-plugin/` manifest packaging gobbi as an installable Claude Code plugin;
(2) a `claude-plugin` skill (general Claude-Code-plugin authoring/update guide + layered gobbi-specific section).

## In-Scope
- A `.claude-plugin/plugin.json` manifest at the repo root, conformant to the current Claude Code schema
  (`name` required; component-path keys as needed).
- Making gobbi's bundled components (skills, agents, the two hooks) discoverable/functional from the plugin,
  per the breadth decision the user ratifies (DD-1).
- Making the two hooks portable: relocate their registration to `${CLAUDE_PLUGIN_ROOT}`-based command paths
  (script bodies unchanged — they resolve work targets from the runtime `cwd`/`$CLAUDE_ENV_FILE`).
- A `claude-plugin` skill homed at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` with a
  `.claude/skills/claude-plugin/SKILL.md` mirror symlink (matching the established per-file symlink mirror).
- (Proposed, DD-5) An in-repo Claude-schema `marketplace.json` at `.claude-plugin/marketplace.json` enabling
  local install for the solo user.

## Out-of-Scope
- Implementation itself (Execution owns it) — this loop frames + designs directionally only.
- Publishing/hosting gobbi on a public/hosted marketplace → backlog `publish-gobbi-to-public-marketplace.md`.
- Refactoring the Codex `.codex-plugin` / `.agents/plugins/marketplace.json` → backlog
  `reconcile-codex-plugin-and-claude-plugin-manifests.md`.
- Adding MCP servers, LSP servers, monitors, themes, output-styles, or `commands/` (gobbi has none today).
- Any rewrite of hook script LOGIC (only the registration path moves).

## Decisions Locked
- **Plugin breadth (DD-1): full — skills + agents + hooks.** gobbi installs as a working system, not skill text.
- **Layout (DD-2): plugin root at repo root; `skills`/`agents` point at canonical `./.gobbi/projects/gobbi/...` real files.** Pointing at the `.claude/` symlink mirror is forbidden (escaping symlinks are skipped on install → empty plugin).
- **Hooks (DD-3): relocate registration to `hooks/hooks.json` via `${CLAUDE_PLUGIN_ROOT}`; script bodies unchanged.**
- **Install path (DD-4): in-repo Claude-schema `marketplace.json` + `/plugin marketplace add ./` + local install.**
- **marketplace.json (DD-5): in scope this session.**
- **Skill (DD-6): general Claude-Code-plugin authoring/update guide + layered gobbi-specific section**, homed at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` with a `.claude/skills/claude-plugin/SKILL.md` mirror symlink.
- **Feature: install-runtime** (reuse, not a new feature).
- **Open residual for Planning:** decide whether the plugin's `hooks/hooks.json` replaces or coexists with the project-local `.claude/settings.json` hook registration (double-fire risk).

## Success Criteria
- `claude plugin validate ./` (or `--strict`) passes on the `.claude-plugin/plugin.json` (JSON-valid,
  `name` present, no wrong-type fields). [verification: run validator / JSON-schema check]
- After a real install (chosen install path), gobbi's skills are loadable and the two hooks fire on
  `SessionStart` / `PostToolUse` with their work-targets still resolving into the project `.gobbi/` tree.
- The `claude-plugin` skill exists at the canonical path, the `.claude/skills/claude-plugin/SKILL.md`
  symlink resolves, and the skill contains both a general authoring/update guide and a layered
  gobbi-specific section. [verification: `readlink` + section presence]
- Every external manifest/hook/marketplace claim in both deliverables traces to the authoritative
  code.claude.com docs (no memory-sourced schema).

## Deferred
- Public marketplace publish — backlog `publish-gobbi-to-public-marketplace.md` (feature level).
- Codex/Claude manifest reconciliation — backlog `reconcile-codex-plugin-and-claude-plugin-manifests.md`.

---

## Framed Problem

**Root cause**
Gobbi's value (16 workflow skills, the 5-role agent taxonomy, the two runtime hooks) is currently
**installable only by manual `.claude/` mirror-sync** — the same surface PR #261 had to hand-repair after
PR #260 left broken symlinks (MEMORY: pr257_adversarial_review_complete). There is no single declarative
package that says "this is gobbi, here are its components, install it." The Codex side already solved its
half with `.codex-plugin/plugin.json` (created in commit 159eb21, PR #265) pointing `skills` at
`./.gobbi/projects/gobbi/skills/`; the Claude Code side has no analogue. The deeper cause: gobbi has a
canonical component tree but no manifest contract declaring it to the Claude Code plugin loader.

**Impact**
- **Who is affected**: the solo user (install/update friction, manual symlink repair); any future adopter;
  every session that depends on the `.claude/` mirror being intact.
- **Severity**: not a runtime blocker today (mirror works when intact) but a recurring fragility and a
  missing-capability gap — gobbi is a "tool for Claude Code" that is not packaged as a Claude Code plugin.
- **Cost of inaction**: continued manual mirror maintenance; no clean install/update/uninstall story;
  the plugin-authoring knowledge stays tacit and is re-derived (or mis-derived) each time, exactly the
  failure mode the second deliverable (the skill) prevents.

**Success criteria**
- See Scope Contract → Success Criteria (validator passes; install makes skills loadable + hooks fire;
  skill exists with both layers; all schema claims doc-cited).

**Prior attempts**
- `.codex-plugin/plugin.json` + `.agents/plugins/marketplace.json` added in 159eb21 (PR #265) — the Codex
  analogue and closest prior art (skills-only, directory-pointer for skills).
- PR #261 (MEMORY: pr257_adversarial_review_complete) mirror-sync repair + `plugin.json`/marketplace touch,
  and backlog `#258 drift detector` — evidence that the hand-maintained mirror is the fragility a manifest
  would replace.
- No prior `.claude-plugin/` attempt on record (`ls` confirms absent; git log shows none).

**Counterfactual / steel-man**
*"A plugin is unnecessary — gobbi already works via the `.claude/` mirror, and gobbi is solo-user
(feedback_solo_user_context), so install ergonomics for external adopters don't matter."* Counter-evidence:
(1) the user's brief explicitly asks for the plugin AND the learnings-skill — the witness is a direct user
request (Iron Law 10 satisfied). (2) The recurring mirror-repair work (PR #260→#261, backlog #258) is a
real maintenance cost even for the solo user. (3) The plugin manifest is the *declarative source of truth*
that the drift-detector backlog (#258) wants anyway. The steel-man does narrow scope (it argues against a
*public marketplace*, which we accordingly DEFER), but not against the plugin itself.

**Re-framing conclusion**
A more ambitious framing hides inside the literal ask: the plugin manifest could become the **single
canonical declaration** that the mirror-sync and the #258 drift-detector both derive from — i.e. the plugin
is not just packaging, it is the authority the existing mirror should conform to. Surfaced as DD-6 (a
direction to consider), not forced into scope. Literal ask otherwise stands.

---

## Research Insights

### Internal insights (codebase / git / project memory)

- **Source**: `ls -la .claude/skills/gobbi/` + `find .claude/skills -type l | wc -l` (= 59 symlinks, 0 real
  files); `.claude/agents/*.md` are direct symlinks into `.gobbi/projects/gobbi/agents/`.
  **Insight**: `.claude/skills/<skill>/` are real directories whose `SKILL.md` + child files are per-file
  symlinks pointing `../../../.gobbi/projects/gobbi/skills/<skill>/...`; agents are direct file symlinks.
  The canonical real files live ONLY under `.gobbi/projects/gobbi/skills|agents/`.
  **Why**: the plugin must point at the canonical real tree (or accept symlink dereferencing rules), since a
  marketplace/local install copies and would skip symlinks escaping the plugin root.

- **Source**: `.codex-plugin/plugin.json` (skills-only; `"skills": "./.gobbi/projects/gobbi/skills/"`).
  **Insight**: the established gobbi pattern points the plugin `skills` key directly at the canonical
  `.gobbi/projects/gobbi/skills/` directory — a directory pointer, not the `.claude/` mirror.
  **Why**: confirms the directory-pointer approach is viable and already in use; the Claude plugin can mirror
  it because Claude's `skills` key is `string|array` and ADDS-to (so a custom dir pointer is supported).

- **Source**: `.claude/hooks/session-start.sh` (reads `$CLAUDE_ENV_FILE`), `.claude/hooks/post-tool-use-agents.sh`
  (resolves `$cwd/.gobbi/projects/...` from the hook payload `cwd`).
  **Insight**: both hooks resolve their work targets from RUNTIME inputs (env file + payload cwd), not from
  their own on-disk location. Neither script hard-codes its own path.
  **Why**: the script bodies are already relocation-safe; only the registration path must change from
  `.claude/hooks/...` to `${CLAUDE_PLUGIN_ROOT}/hooks/...` — a low-risk move that enables full-breadth.

- **Source**: `.claude/settings.json` (`hooks.SessionStart` matcher `startup|resume|clear|compact`;
  `hooks.PostToolUse`/`PostToolUseFailure` matcher `Task|Agent`; `permissions.allow` lists every Skill()/Agent()).
  **Insight**: gobbi's working config registers two hooks + skill/agent permissions in the project
  `.claude/settings.json`. There is NO `.claude/commands/` and NO `.mcp.json`.
  **Why**: the plugin's `hooks/hooks.json` must reproduce exactly these two registrations; the breadth
  decision must account for whether settings.json permissions are part of the plugin or stay project-local.

- **Source**: `.gobbi/projects/gobbi/skills/*/SKILL.md` cross-references (`grep` shows relative links stay
  within the skills/agents tree, e.g. `../../agents/manager.md`; plus prose mentions of
  `.gobbi/projects/gobbi/` as RUNTIME session-memory locations).
  **Insight**: inter-skill links are tree-relative (survive a copy that preserves the tree); the
  `.gobbi/projects/gobbi/` strings in prose are runtime instructions about where session memory lives in the
  USER's project, not file-resolution paths inside the package.
  **Why**: confirms the skills tree is internally self-consistent under copy, so bundling the whole
  `.gobbi/projects/gobbi/skills` + `agents` tree keeps cross-links working.

### External insights (authoritative Claude Code docs)
All three staged as references:
- `references/claude-code-plugin-manifest-schema.md` — `plugin.json` schema: only `name` required;
  components at plugin root; `skills` ADDS-to and accepts a directory pointer; `hooks` → `hooks/hooks.json`;
  `version` semantics; `${CLAUDE_PLUGIN_ROOT}`. (https://code.claude.com/docs/en/plugins-reference)
- `references/plugin-cache-symlink-dereferencing-and-path-traversal.md` — install COPIES to cache; no `../`
  traversal; symlinks escaping the plugin/marketplace root are SKIPPED; within-marketplace symlinks are
  dereferenced. THE layout-deciding constraint.
- `references/marketplace-json-schema-and-skills-dir-plugins.md` — `marketplace.json` schema (`name`/`owner`/
  `plugins`, each plugin `name`+`source`, relative `"./..."` source string); plus the no-install
  `@skills-dir` in-place mode and its launch-dir/trust constraints.
- `references/plugin-hooks-config-and-plugin-root-var.md` — plugin hooks ship as `hooks/hooks.json`, scripts
  referenced via `"\"${CLAUDE_PLUGIN_ROOT}\"/..."`; gobbi's two hooks need only registration relocation.

---

## Scenarios

- **Golden — install fresh**: user installs the gobbi plugin (chosen install path). Skills appear (namespaced
  `gobbi:<skill>`), the 5 agents appear, both hooks register and fire on the next session, session-memory
  writes land in the user's project `.gobbi/` tree.
- **Golden — author/update a plugin (skill consumer)**: a future session reads `claude-plugin/SKILL.md`,
  scaffolds or edits a plugin manifest, knows the schema/dirs/`${CLAUDE_PLUGIN_ROOT}` rules without
  re-researching, and bumps `version` correctly so users get the update.
- **Edge — installed elsewhere / path resolution**: plugin copied into `~/.claude/plugins/cache/<ver>/`; any
  symlink that escapes the plugin root is skipped; hook scripts resolve via `${CLAUDE_PLUGIN_ROOT}`; work
  targets resolve via runtime `cwd`. Verify nothing silently drops.
- **Edge — version/update cadence**: with `version` set, pushing commits without bumping yields "already
  latest"; with `version` omitted, every commit is a new version. Skill must teach this footgun.
- **Failure — symlink mirror pointed at directly**: if the plugin naively points `skills` at `.claude/skills/`
  (symlinks escaping into `.gobbi/`), install-time copy SKIPS the content → empty skills. Must be prevented
  by layout choice (DD-2).
- **Failure — components placed in `.claude-plugin/`**: putting `skills/`/`agents/`/`hooks/` inside
  `.claude-plugin/` → components missing (docs "Directory structure mistakes"). Only `plugin.json` goes there.
- **Uninstall**: `claude plugin uninstall` removes the cached copy + data dir; project `.gobbi/` memory is
  untouched (it lives in the user's repo, not the plugin). Verify no project-memory loss.

## Implementation Checklist
*(directional; each item anchored to an insight — Execution refines mechanism)*

- [ ] Decide plugin ROOT + which path `skills`/`agents`/`hooks` point at — anchored to
      `plugin-cache-symlink-dereferencing-and-path-traversal.md` (no escaping symlinks survive copy).
- [ ] Author `.claude-plugin/plugin.json` with `name: gobbi`, metadata, and component keys per DD-1/DD-2 —
      anchored to `claude-code-plugin-manifest-schema.md`.
- [ ] Relocate hook REGISTRATION into `hooks/hooks.json` with `${CLAUDE_PLUGIN_ROOT}`-based command paths;
      keep script bodies unchanged — anchored to `plugin-hooks-config-and-plugin-root-var.md` + internal hook insight.
- [ ] Decide settings.json permissions disposition (stay project-local vs. shipped) — anchored to settings.json insight.
- [ ] (If DD-5 ratified) author `.claude-plugin/marketplace.json` in Claude schema (NOT the Codex object
      schema) — anchored to `marketplace-json-schema-and-skills-dir-plugins.md`.
- [ ] Author `claude-plugin/SKILL.md` (general guide + layered gobbi section) at canonical path + create the
      `.claude/skills/claude-plugin/SKILL.md` symlink — anchored to `skills-mirror-symlinks-not-copies` mistake.
- [ ] Verify: `claude plugin validate` passes; install dry-run; `readlink` on the new skill symlink.

## Design

> Detailed mechanism deferred to Execution. These are DIRECTIONAL choices. **All PROPOSED — awaiting
> ratification.** DD-1 is the lead contribution point.

### DD-1 — Plugin breadth *(LEAD CONTRIBUTION POINT)*
**Options:** (A) skills-only (mirror `.codex-plugin`); (B) **skills + agents + hooks** (full working gobbi);
(C) skills + agents, no hooks.
**Recommendation: (B) skills + agents + hooks.**
**Rationale:** The manifest format fully expresses all three (skills via directory pointer/ADDS-to; agents
via `agents` key or `agents/` dir; hooks via `hooks/hooks.json`). gobbi is non-functional without its 5-role
agent taxonomy AND the two runtime hooks (session env-var persistence + subagent-metadata capture) — a
skills-only plugin would install a half-broken gobbi that still needs manual hook/agent setup, defeating the
"installable gobbi" purpose (root cause). Critically, research shows the hooks are **relocation-safe** (script
bodies resolve targets from runtime cwd/env, not their own path), so shipping them is low-risk — only the
registration path changes. Anchored: `claude-code-plugin-manifest-schema.md`, `plugin-hooks-config-and-plugin-root-var.md`, internal hook insight.
**Validation:** `claude plugin validate`; post-install session where both hooks fire and an agent is invocable.

### DD-2 — Plugin directory ROOT + skills/agents source path
**Options:** (A) plugin rooted at REPO ROOT, `skills` → `./.gobbi/projects/gobbi/skills/`, `agents` →
`./.gobbi/projects/gobbi/agents/` (real canonical files, mirrors Codex); (B) plugin points at `.claude/skills`
+ `.claude/agents` (the symlink mirror); (C) a dedicated `plugin/` subtree with in-marketplace symlinks.
**Recommendation: (A) root at repo root, point at the canonical `.gobbi/projects/gobbi/` real files.**
**Rationale:** Option B FAILS — `.claude/skills/*` symlinks escape into `.gobbi/` (outside any `.claude/`-rooted
plugin), so install-time copy SKIPS them → empty plugin (Failure scenario). Option A points at REAL files that
copy cleanly and exactly matches the proven Codex `.codex-plugin` approach. Anchored:
`plugin-cache-symlink-dereferencing-and-path-traversal.md`, internal `.codex-plugin` insight.
**Validation:** install into cache, confirm skill/agent files are present (not skipped) in the cached copy.

### DD-3 — Hook portability mechanism
**Direction:** Ship both hook scripts inside the plugin (e.g. under `hooks/` or `scripts/`) and register them
in `hooks/hooks.json` with `"\"${CLAUDE_PLUGIN_ROOT}\"/hooks/session-start.sh"` etc.; script bodies unchanged.
**Rationale:** bodies resolve work targets from runtime cwd/`$CLAUDE_ENV_FILE`, so only registration moves.
Anchored: `plugin-hooks-config-and-plugin-root-var.md`, internal hook insight.
**Validation:** post-install, confirm `session.json` env-vars persist and `agents[]` upserts occur.

### DD-4 — Install path for the solo user
**Options:** (A) in-repo `marketplace.json` + `/plugin marketplace add ./` + `/plugin install`; (B)
`--plugin-dir`/local-path session-scoped; (C) `@skills-dir` in-place (no copy, tolerates current symlinks).
**Recommendation: (A) in-repo Claude-schema `marketplace.json` + local install** (with B as the dev-iteration
fallback). **Rationale:** A gives a real install/update/uninstall story and matches the Codex marketplace
prior art; C is rejected as the primary because its launch-dir/trust constraints + symlink tolerance make it
fragile and it sidesteps the canonical-file layout we want. Anchored:
`marketplace-json-schema-and-skills-dir-plugins.md`. **Validation:** `/plugin marketplace add` + install dry-run.

### DD-5 — Is `marketplace.json` in scope this session?
**Options:** (A) yes — author the Claude-schema `marketplace.json` now; (B) no — manifest only, defer marketplace.
**Recommendation: (A) yes**, because DD-4(A) needs it and it is small. **Rationale:** the manifest alone is not
installable via the recommended path without a marketplace catalog. **Validation:** schema-validate the JSON.
*(If the user picks DD-4(B)/(C), this flips to (B).)*

### DD-6 — `claude-plugin` skill structure + manifest-as-authority framing
**Direction:** the skill = a general Claude-Code-plugin authoring/update guide (schema, dirs, component
conventions, `${CLAUDE_PLUGIN_ROOT}`, version cadence, symlink/path-traversal footguns, validate/install/update
CLI) + a layered "gobbi-specifics" section (our root, our skills/agents/hooks layout, our install path,
relationship to `.codex-plugin` and the #258 drift-detector). Re-framing (DD-6): note in the gobbi section that
the manifest is the candidate single source of truth the mirror + drift-detector should conform to — as a
documented direction, not this session's build. **Validation:** section-presence check + `readlink` on the symlink.

## Decisions Log

| # | Topic | Outcome | Source |
|---|---|---|---|
| A1 | Root cause | Gobbi has a canonical component tree but no Claude-plugin manifest declaring it; install = manual mirror | git 159eb21, MEMORY pr257, backlog #258 — PROPOSED |
| A2 | Counterfactual | Steel-man argues against *public marketplace* (deferred), not the plugin itself; witness = direct user request | feedback_solo_user_context — PROPOSED |
| A3 | Re-framing | Manifest could become single source of truth for mirror + #258 drift-detector (DD-6, surfaced only) | PROPOSED |
| B1 | Scope triplet | gobbi / install-runtime / two coupled deliverables (plugin + skill) | PROPOSED — feature reuse rationale below |
| B2 | Deferred candidates | public-marketplace publish; codex/claude manifest reconciliation → 2 feature backlogs staged | staged |
| C1 | External schema | 4 references staged; all schema claims doc-cited (no memory) | references/ staged |
| C2 | Internal topology | skills/agents = canonical real files under .gobbi; .claude = per-file symlink mirror; hooks relocation-safe | verified via ls/find/grep |
| D1 | Plugin breadth (DD-1) | RATIFIED: skills+agents+hooks (full) | AskUserQuestion 2026-05-30 |
| D2 | Layout/root (DD-2) | RATIFIED (manager auto-decide, forced): root at repo root, point at canonical .gobbi files | discussion-log 2026-05-30 |
| D3 | Hooks (DD-3) | RATIFIED (implied by D1 full breadth): relocate registration to ${CLAUDE_PLUGIN_ROOT}, bodies unchanged | AskUserQuestion 2026-05-30 |
| D4 | Install path (DD-4) | RATIFIED: in-repo marketplace.json + local install | AskUserQuestion 2026-05-30 |
| D5 | marketplace.json scope (DD-5) | RATIFIED: in scope this session | AskUserQuestion 2026-05-30 |
| D6 | Skill structure (DD-6) | RATIFIED (config gate): general guide + layered gobbi section; manifest-as-authority noted | AskUserQuestion 2026-05-30 |

**Feature-vs-new-feature note (B1):** This work belongs under the existing **install-runtime** feature — its
README already owns "channel-split install + `.claude/`↔project mirror-sync + per-session runtime contract
(hooks, env-vars, session config)", and the plugin is the declarative packaging of exactly those components.
A new feature would fragment the install story. PROPOSED; user may reroute.

**Reference promotion log:** 4 external insights → `staging/references/` (manifest-schema, cache-symlink,
marketplace-schema, hooks). 0 skipped. **Backlog log:** 2 → `staging/backlogs/feature/`.
