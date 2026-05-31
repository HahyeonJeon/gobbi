# Ideation Draft — fresh `gobbi` Claude Code plugin + `claude-plugin` skill (iter 2, REVISE→re-document)

> STATUS: iter-2 revision after dual-system EVALUATION reconciled REVISE (Claude PASS, Codex REVISE; Codex
> findings P1/S1/R1/R2/U1/U2 + Claude hook-count F-C1). User ratified two binding iter-2 decisions via
> AskUserQuestion 2026-05-30 (see `rawdata/discussion-log.md` lines 31-38): (1) build a **perfectly fresh
> v0.5.0 plugin named `gobbi`** — not a resurrection of `gobbi-core`, mine the wiped history only for proven
> solutions; (2) the plugin ships **ONLY skills + agents + hooks** as a bounded self-contained package. This
> SUPERSEDES the iter-1 ratified DD-2 ("plugin root at repo root, point at canonical `.gobbi` dirs").

## Scope Contract

```yaml
artifact_type: scope-contract
feature: install-runtime
goal: "Package gobbi as a self-contained installable Claude Code plugin (skills+agents+hooks only) and codify plugin authoring as a reusable skill"
created-by: 0fd65721-c39f-4305-b296-9961aee8e1c1
created-at: 2026-05-30T00:00:00Z
```

**Project:** gobbi · **Feature:** install-runtime · **Task:** Two coupled deliverables —
(1) a fresh, bounded `gobbi` Claude Code plugin package (`.claude-plugin/plugin.json` + `skills/` + `agents/`
+ `hooks/`, nothing else) + a Claude-schema `marketplace.json` cataloging it;
(2) a `claude-plugin` skill (general Claude-Code-plugin authoring/update guide + a layered gobbi-specific
section) homed at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` with a `.claude/skills/claude-plugin/`
mirror symlink.

## In-Scope
- A fresh `gobbi` plugin laid out as a **dedicated, self-contained package directory** whose contents are
  EXACTLY: `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`. No session memory, no `.gobbi/`
  project tree, no repo content, no `README`/`design`/`settings.json`. (DD-2, iter-2 user decision.)
- A `.claude-plugin/plugin.json` manifest conformant to the current Claude schema: `name: gobbi` (only
  required field), metadata, `skills` (directory pointer / ADDS-to), `agents` (ARRAY of the 5 role `.md`
  file paths — NOT a directory; excludes the `.toml` Codex wrappers), `hooks` → `./hooks/hooks.json`.
- The 5 Claude role agents (`manager.md`, `leader.md`, `executor.md`, `evaluator.md`, `assistant.md`) and
  the current skills present as REAL files inside the package (materialized), so the marketplace/local copy
  does not skip escaping symlinks (S1 + R1 resolution; proven by prior-art #251).
- The two hooks (`session-start.sh`, `post-tool-use-agents.sh`) shipped under the package `hooks/` and
  registered in `hooks/hooks.json` with `${CLAUDE_PLUGIN_ROOT}`-based command paths; script bodies unchanged.
- A Claude-schema `.claude-plugin/marketplace.json` (distinct from the Codex `.agents/plugins/marketplace.json`)
  cataloging the `gobbi` plugin for local install.
- The `claude-plugin` skill (general guide + layered gobbi section) at the canonical path + `.claude/skills/`
  mirror symlink. The gobbi section MUST document the materialize-vs-canonical **drift/sync surface** the
  bounded-package model creates.

## Out-of-Scope
- Implementation itself (Execution owns it) — this loop frames + designs directionally only.
- Reviving / borrowing files from the wiped `gobbi-core` package — history is a REFERENCE for proven
  solutions only; the build is fresh on the current v0.5 structure.
- Publishing/hosting gobbi on a public/hosted marketplace → backlog `publish-gobbi-to-public-marketplace.md`.
- Reconciling the Codex `.codex-plugin`/`.agents/plugins/marketplace.json` with the Claude side → backlog
  `reconcile-codex-plugin-and-claude-plugin-manifests.md`.
- MCP/LSP servers, monitors, themes, output-styles, `commands/`, `userConfig` (gobbi needs none today).
- Any rewrite of hook script LOGIC (only registration + bundled location move).

## Decisions Locked
- **DD-1 — Plugin breadth: full (skills + agents + hooks).** gobbi installs as a working system, not skill
  text. (iter-1 RATIFIED, retained.)
- **DD-2 (REPLACED) — Bounded self-contained package: ONLY skills + agents + hooks.** The plugin root is a
  dedicated package dir (`.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`); install copies
  ONLY those three component types. This overturns the iter-1 "root at repo root, point at canonical .gobbi"
  decision. (iter-2 RATIFIED.) Resolves R1 (no 77M `sessions/` tree in the cache) and forces S1's explicit
  agent-file enumeration.
- **DD-2a — Component files are MATERIALIZED real copies inside the package** (direction; mechanism is
  Execution's). Rationale anchored to proven prior art #251 (escaping symlinks were dropped by the
  marketplace fetch → empty plugin; real files survive). This creates a canonical-tree↔package-copy
  **drift/sync surface** the `claude-plugin` skill must document.
- **DD-3 — Hooks: bundle the 2 scripts under the package `hooks/`; register in `hooks/hooks.json` via
  `${CLAUDE_PLUGIN_ROOT}`; script bodies unchanged.** (iter-1 RATIFIED as implied-by-full-breadth; in iter-2
  the hooks-as-`hooks.json`-FILE shape is independently confirmed by prior art ba8aa42 + current schema.)
- **DD-4 — Install path: in-repo Claude-schema `marketplace.json` + `/plugin marketplace add` + local
  install,** with a worktree-faithful test path (see DD-7 / U1). (iter-1 RATIFIED, retained.)
- **DD-5 — `marketplace.json` in scope this session.** (iter-1 RATIFIED, retained.)
- **DD-6 — Skill = general authoring/update guide + layered gobbi-specific section**, canonical path +
  `.claude/skills/` mirror symlink. (iter-1 RATIFIED, retained.) The gobbi section gains a required
  drift/sync sub-topic (DD-2a) and the ADDS-to-vs-REPLACES footgun (F-C1/S1).
- **Feature: install-runtime** (reuse, not a new feature). (iter-1 RATIFIED, retained.)

## Success Criteria
- `claude plugin validate ./<package>` (and `--strict`) passes on `plugin.json`: JSON-valid, `name` present,
  no wrong-TYPE fields, no unrecognized/misspelled keys. [verify: run validator]
- **Post-install cache-contents gate (R1):** after a real install, the cached plugin dir contains ONLY the
  package's skills/agents/hooks — NO `.gobbi/.../sessions` tree, NO project memory, NO repo content.
  [verify: enumerate `~/.claude/plugins/cache/<id>/` contents and assert the allow-set]
- After install from the **worktree-faithful** path (U1), gobbi's skills are loadable (namespaced
  `gobbi:<skill>`), all 5 role agents are invocable, and **each hook fires exactly once** on
  `SessionStart` / `PostToolUse` / `PostToolUseFailure` with work-targets still resolving into the user's
  project `.gobbi/` tree. [verify: install + observe one fire per registration — see DD-8]
- The `claude-plugin` skill exists at the canonical path, the `.claude/skills/claude-plugin/SKILL.md` symlink
  resolves, and the skill contains BOTH a general authoring/update guide AND a layered gobbi section that
  documents the drift/sync surface (DD-2a) and the ADDS-to-vs-REPLACES footgun. [verify: `readlink` +
  section-presence check]
- Every external manifest/marketplace/hook claim in both deliverables traces to the authoritative
  code.claude.com docs (no memory-sourced schema); every prior-art claim cites a git sha.

## Deferred
- Public marketplace publish — backlog `publish-gobbi-to-public-marketplace.md` (feature level).
- Codex/Claude manifest reconciliation — backlog `reconcile-codex-plugin-and-claude-plugin-manifests.md`.

---

## Framed Problem

**Root cause**
Gobbi's value (the workflow skills, the 5-role agent taxonomy, the two runtime hooks) is currently
**installable only by manual `.claude/` mirror-sync** — the same surface PR #261 had to hand-repair after
PR #260 left broken symlinks (MEMORY: pr257_adversarial_review_complete; backlog #258 drift detector). gobbi
DID ship a Claude Code plugin + marketplace through v0.4.x (`plugins/gobbi-core`, commit `62b95a0` PR #6),
but that package was **wiped in the v0.5 reset** (`e083fad`, PR #264, refs #263). So today the v0.5 structure
has a canonical component tree but **no Claude-plugin manifest declaring it** — the Codex side has its
analogue (`.codex-plugin/plugin.json`, `"skills": "./.gobbi/projects/gobbi/skills/"`); the Claude side does
not. The root cause is the missing declarative package, not a first-ever attempt.

**Impact**
- **Who is affected**: the solo user (install/update friction, recurring manual symlink repair); any future
  adopter; every session that depends on the `.claude/` mirror being intact.
- **Severity**: not a runtime blocker today (mirror works when intact) but a recurring fragility + a
  missing-capability gap — gobbi is a "tool for Claude Code" not packaged as a Claude Code plugin.
- **Cost of inaction**: continued manual mirror maintenance; no clean install/update/uninstall story; the
  plugin-authoring knowledge stays tacit and is re-derived (or mis-derived) each time — exactly the failure
  mode the second deliverable (the skill) prevents, and exactly the failure the prior package hit twice
  (#251 empty-plugin, #256 matcher-too-narrow).

**Success criteria**
- See Scope Contract → Success Criteria (validate passes; cache-contents gate; worktree-faithful install
  with each hook firing once; skill exists with both layers + drift/sync doc; all claims doc/sha-cited).

**Prior attempts** *(corrects iter-1's false "no prior attempt on record")*
- **`plugins/gobbi-core` (62b95a0, PR #6)** — full prior Claude plugin in a dedicated bounded subtree, with
  `marketplace.json` (`name: gobbi`) + `plugin.json` (`name: gobbi-core`). Initial manifest used directory
  pointers for `skills`/`agents`/`hooks`.
- **ba8aa42** proved the old schema REJECTED directory-valued `agents` and `hooks` ("requires hooks to point
  to a hooks.json file, not a directory. Agents field also failed validation"); kept only `"skills"`.
- **c79d28e (#251/#252)** — the load-bearing lesson: escaping symlinks in the package were DROPPED by the
  marketplace fetch → "every published v0.4.x install had empty `agents/` and `skills/`"; fix = materialize
  REAL files inside the package. Explicit recorded trade-off: "Editing on main now requires editing in two
  places" (the drift/sync surface).
- **#253-#256 hooks saga** — `metadata hook matcher missed sdk-cli source — drop matcher entirely` (#256):
  too-narrow `matcher` silently misses event sources.
- **Last-live state (e083fad^)** already used `"agents": [5 .md file paths]` + a full `hooks/hooks.json` —
  the closest direct template (though it shipped a `gobbi-dev` CLI and a `README`/`settings.json` the fresh
  bounded build will NOT include).
- **`.codex-plugin/plugin.json` (159eb21, PR #265)** — the Codex analogue (skills-only directory pointer).
- All cited in `staging/references/prior-gobbi-core-plugin-package-history.md`.

**Counterfactual / steel-man**
*"A plugin is unnecessary — gobbi works via the `.claude/` mirror, and gobbi is solo-user
(feedback_solo_user_context), so install ergonomics for external adopters don't matter."* Counter-evidence:
(1) the user's brief is a direct request for the plugin AND the skill (Iron Law 10 witness satisfied);
(2) recurring mirror-repair work (PR #260→#261, backlog #258) is a real cost even solo; (3) the manifest is
the declarative source of truth the #258 drift-detector wants anyway. The steel-man narrows scope (argues
against a PUBLIC marketplace → DEFERRED), not against the plugin. NEW iter-2 counter-point: the prior package
was wiped in a deliberate reset, so "it already exists" is false — a fresh build is genuinely needed.

**Re-framing conclusion**
A more ambitious framing hides inside the literal ask: the plugin package could become the **single canonical
declaration** the mirror-sync + #258 drift-detector both derive from. Surfaced as a documented direction in
the skill's gobbi section (not built this session). Literal ask otherwise stands.

---

## Research Insights

### Internal insights (codebase / git / project memory) — re-verified iter-2

- **Source**: `git show 62b95a0:.claude-plugin/marketplace.json`, `...:plugins/gobbi-core/.claude-plugin/plugin.json`;
  `git show ba8aa42 -- '*plugin.json'`; `git show c79d28e --stat`; `git show e083fad^:plugins/gobbi/.claude-plugin/plugin.json`
  + `...:plugins/gobbi/hooks/hooks.json`; `git log --all --grep 254|255|256`.
  **Insight**: a full prior Claude plugin + marketplace existed (bounded `plugins/gobbi-core` subtree),
  wiped at `e083fad`. Proven lessons: bounded-package subtree; materialize-real-files over escaping symlinks
  (#251); `agents` as a file-path array + `hooks` as a hooks.json FILE (ba8aa42 + last-live shape); a
  too-narrow hook matcher silently drops event sources (#256).
  **Why**: corrects iter-1's false "no prior attempt"; gives Planning a proven base. Staged as
  `references/prior-gobbi-core-plugin-package-history.md`.

- **Source**: `ls -la .gobbi/projects/gobbi/agents/` → `manager|leader|executor|evaluator|assistant` each as
  BOTH `.md` (Claude role prompt) AND `.toml` (Codex wrapper); 5 + 5 = 10 files.
  **Insight**: the canonical agents dir MIXES `.md` and `.toml`. The Claude plugin `agents` key must
  enumerate exactly the 5 `.md` files and EXCLUDE the `.toml` wrappers.
  **Why**: settles S1 — a directory pointer (or `agents/` auto-discovery) would pull in the `.toml` Codex
  files, which are not Claude agent files.

- **Source**: live docs `https://code.claude.com/docs/en/plugins-reference` "Complete schema" + "Component
  path fields" + "Path behavior rules".
  **Insight**: `name` is the only required field; `skills` is `string|array` and ADDS-to the default
  `skills/`; `agents`/`commands`/`outputStyles` REPLACE their default dir, and the `agents` schema example is
  an ARRAY of FILE PATHS (`["./custom/agents/reviewer.md"]`); `hooks` points to a `hooks/hooks.json` file (or
  inline). Wrong-TYPE fields are load errors; `--strict` fails on unrecognized/misspelled keys.
  **Why**: settles S1 (agents = file array, not dir) and the F-C1/aesthetics ADDS-to-vs-REPLACES footgun the
  skill must teach. Staged (corrected) as `references/claude-code-plugin-manifest-schema.md`.

- **Source**: live docs `.../plugins-reference#plugin-caching-and-file-resolution`.
  **Insight**: marketplace installs COPY the plugin to `~/.claude/plugins/cache`; symlinks targeting OUTSIDE
  the plugin dir are SKIPPED (within-dir preserved; within-marketplace dereferenced; for `--plugin-dir`/local
  only within-dir preserved). No `../` traversal survives the copy.
  **Why**: bounding the package to skills+agents+hooks with MATERIALIZED real files (DD-2/DD-2a) is what makes
  the copy faithful AND keeps the 77M `sessions/` tree out of the cache (R1). Staged as
  `references/plugin-cache-symlink-dereferencing-and-path-traversal.md`.

- **Source**: live docs `https://code.claude.com/docs/en/plugin-marketplaces` "Relative paths" + the
  local-directory/worktree Note.
  **Insight**: a relative plugin `source` resolves against the **marketplace root**; a LOCAL relative
  marketplace source "resolves against your repository's MAIN checkout … When you run Claude Code from a git
  worktree, the path still points at the main checkout." This session runs in a worktree.
  **Why**: settles U1 — a naive `/plugin marketplace add ./` from the worktree can test stale main-checkout
  content. The install/test scenario must PROVE worktree content was loaded. Staged as
  `references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md`.

- **Source**: `.claude/settings.json` (verbatim, iter-2 re-read) + `.claude/hooks/*.sh`.
  **Insight**: gobbi registers **2 hook SCRIPTS across 3 EVENT registrations** — `SessionStart`
  (matcher `startup|resume|clear|compact`) → `session-start.sh`; `PostToolUse` (matcher `Task|Agent`) AND
  `PostToolUseFailure` (matcher `Task|Agent`) BOTH → `post-tool-use-agents.sh`. `permissions.allow` lists 16
  `Skill(...)` + 5 `Agent(...)` entries (unnamespaced) + `WebSearch`. No `.claude/commands/`, no `.mcp.json`.
  Both hook scripts resolve work targets from RUNTIME inputs (`$CLAUDE_ENV_FILE`, payload `cwd`), not their
  own path — so they are relocation-safe; only registration + bundled location move.
  **Why**: corrects iter-1's "two registrations" (F-C1) → **2 scripts / 3 event registrations**; the
  `hooks/hooks.json` must reproduce all three blocks (not drop `PostToolUseFailure`), and the
  replace-vs-coexist double-fire question (R2) must be a Planning blocker (DD-8). The 16+5 permissions are the
  U2 disposition surface.

### External insights (authoritative Claude Code docs) — all staged as references
- `references/claude-code-plugin-manifest-schema.md` (CORRECTED) — schema; `name`-only-required; `skills`
  ADDS-to (dir pointer ok); `agents` = file-path ARRAY (REPLACES); `hooks` = hooks.json FILE; wrong-type +
  `--strict` failures; `${CLAUDE_PLUGIN_ROOT}`. (https://code.claude.com/docs/en/plugins-reference)
- `references/plugin-cache-symlink-dereferencing-and-path-traversal.md` — install copies to cache; escaping
  symlinks skipped; no `../`. THE bounded-package-deciding constraint.
- `references/marketplace-json-schema-and-skills-dir-plugins.md` — marketplace.json schema (`name`/`owner`/
  `plugins[]`; entry `name`+`source`); relative-source resolution; `@skills-dir` in-place mode.
- `references/plugin-hooks-config-and-plugin-root-var.md` — plugin hooks ship as `hooks/hooks.json`, scripts
  via `"\"${CLAUDE_PLUGIN_ROOT}\"/..."`.
- `references/prior-gobbi-core-plugin-package-history.md` (NEW) — the wiped prior package + 5 proven lessons.
- `references/marketplace-relative-source-resolves-to-main-checkout-from-worktree.md` (NEW) — U1 worktree
  resolution footgun.

---

## Scenarios

- **Golden — install fresh (worktree-faithful)**: user installs the `gobbi` plugin via the chosen
  worktree-faithful path (DD-7). Skills appear namespaced `gobbi:<skill>`, the 5 agents appear, all three
  hook registrations fire on the next session, session-memory writes land in the user's project `.gobbi/`
  tree (NOT in the plugin).
- **Golden — author/update a plugin (skill consumer)**: a future session reads `claude-plugin/SKILL.md`,
  scaffolds/edits a manifest, knows schema/dirs/`${CLAUDE_PLUGIN_ROOT}`/the ADDS-to-vs-REPLACES asymmetry
  without re-researching, bumps `version` correctly, and re-syncs the package from the canonical tree
  (drift/sync) so the cache copy stays current.
- **Edge — cache-contents boundary (R1)**: after install, enumerate `~/.claude/plugins/cache/<id>/` and
  assert it contains ONLY skills/agents/hooks — no `sessions/`, no project memory, no repo content.
- **Edge — agents field shape (S1)**: `plugin.json` `agents` is the 5-`.md` array; the 5 `.toml` Codex
  wrappers are NOT present in the package and NOT referenced. Validate passes; all 5 agents invocable.
- **Edge — version/update cadence**: with `version` set, pushing commits without a bump → "already latest";
  with `version` omitted, every commit is a new version. Skill teaches this footgun.
- **Edge — drift/sync (DD-2a)**: a canonical skill/agent edit that is NOT re-synced into the package leaves
  the installed cache stale. Skill documents the keep-in-sync obligation (and the re-sync trigger).
- **Failure — escaping symlink (proven #251)**: if the package used symlinks into `.gobbi/`, the copy SKIPS
  them → empty plugin. Prevented by DD-2a (materialized real files).
- **Failure — directory `agents`/`hooks` (proven ba8aa42)**: a directory-valued `agents` or `hooks` is the
  wrong shape (and historically failed validation). Prevented by the file-array `agents` + `hooks.json` file.
- **Failure — too-narrow hook matcher (proven #256)** / **double-fire (R2)**: a matcher that misses an event
  source silently drops a hook; conversely, if BOTH the plugin `hooks/hooks.json` and the project-local
  `.claude/settings.json` register the same hook, it double-fires. DD-8 decides the steady state + requires a
  fire-exactly-once validation across all THREE registrations.
- **Failure — worktree tests wrong checkout (U1)**: `/plugin marketplace add ./` from the worktree may load
  main-checkout content. Prevented by DD-7's worktree-faithful path + a worktree-sentinel assertion.
- **Permissions (U2)**: after install, confirm namespaced `gobbi:<skill>` skills + the 5 agents are invocable
  under the intended permission mode; state explicitly which (if any) project-local `.claude/settings.json`
  `Skill()`/`Agent()` entries remain required.
- **Uninstall**: `claude plugin uninstall` removes the cached copy + data dir; the user's project `.gobbi/`
  memory is untouched. Verify no project-memory loss.

## Implementation Checklist
*(directional; each item anchored to an insight — Execution refines mechanism)*

- [ ] Lay out the bounded package dir = `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`,
      nothing else — anchored to DD-2 (iter-2 user decision) + cache-symlink + R1.
- [ ] Materialize REAL copies of the current skills + the 5 role `.md` agents + the 2 hook scripts into the
      package (mechanism — build script vs manual — is Execution's) — anchored to prior-art #251 + cache-symlink.
- [ ] Author `plugin.json`: `name: gobbi`, metadata, `skills` (dir pointer / ADDS-to), `agents` = ARRAY of
      the 5 `.md` file paths (exclude `.toml`), `hooks` → `./hooks/hooks.json` — anchored to manifest-schema
      (S1) + prior-art ba8aa42/last-live.
- [ ] Author `hooks/hooks.json` reproducing ALL THREE event registrations (SessionStart + PostToolUse +
      PostToolUseFailure, the latter two → the same script) with `${CLAUDE_PLUGIN_ROOT}` command paths;
      bodies unchanged — anchored to settings.json insight (F-C1 correction) + hooks reference + #256 matcher
      lesson.
- [ ] DECIDE hook double-registration steady state (DD-8 — Planning blocker) + a fire-exactly-once
      validation — anchored to R2 + settings.json + #256.
- [ ] DECIDE permissions disposition (DD-9 / U2): ship vs project-local; make it user-operable with an
      invocability check — anchored to settings.json (16 Skill + 5 Agent) + U2.
- [ ] Author Claude-schema `.claude-plugin/marketplace.json` (`name`/`owner`/`plugins[]` with `name`+`source`)
      — anchored to marketplace-schema reference.
- [ ] DECIDE + document the worktree-faithful install/test path (DD-7 / U1) with a worktree-sentinel
      assertion — anchored to the worktree-resolution reference.
- [ ] Add the post-install cache-contents gate (R1) — anchored to cache-symlink + R1.
- [ ] Author `claude-plugin/SKILL.md` (general guide + layered gobbi section incl. drift/sync DD-2a +
      ADDS-to-vs-REPLACES footgun) at the canonical path + create the `.claude/skills/claude-plugin/SKILL.md`
      symlink — anchored to `skills-mirror-symlinks-not-copies` mistake + DD-6.
- [ ] Verify: `claude plugin validate --strict`; worktree-faithful install; cache-contents gate;
      fire-once observation; `readlink` on the new skill symlink + section-presence.

## Design

> Detailed mechanism deferred to Execution. These are DIRECTIONAL choices. DD-1/DD-3/DD-4/DD-5/DD-6 retained
> from iter-1 (RATIFIED). DD-2 REPLACED by the iter-2 user decision. DD-2a/DD-7/DD-8/DD-9 are new/elevated.

### DD-1 — Plugin breadth: full (skills + agents + hooks) *(RATIFIED iter-1, retained)*
gobbi is non-functional without its 5-role agent taxonomy AND the two runtime hooks. The manifest fully
expresses all three. Validation: `claude plugin validate`; post-install session where all hooks fire and an
agent is invocable.

### DD-2 (REPLACED) — Bounded self-contained package: ONLY skills + agents + hooks
**Decision (iter-2 user-ratified):** the plugin root is a dedicated package dir whose contents are EXACTLY
`.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`. Install copies ONLY those three component
types — no session memory, no `.gobbi/` tree, no repo content, no README/settings.json.
**Rationale:** the iter-1 "root at repo root, point at canonical `.gobbi`" decision would copy the 77M
`.gobbi/.../sessions` tree + all project memory into the global plugin cache (R1, High). A bounded package
removes that payload entirely AND matches the proven `plugins/gobbi-core` subtree shape (62b95a0). Anchored:
iter-2 discussion-log; `plugin-cache-symlink...`; `prior-gobbi-core-plugin-package-history`.
**Validation:** the post-install cache-contents gate (allow-set = skills/agents/hooks only).

### DD-2a — Component files MATERIALIZED as real copies inside the package *(new)*
**Direction:** the package's `skills/`, `agents/`, `hooks/` hold REAL file copies (not symlinks escaping into
`.gobbi/`). Mechanism (build/sync script vs manual copy) is Execution's. Alternative considered and rejected
as primary: in-package symlinks — viable ONLY if target resolves within the package dir, and the docs confirm
escaping symlinks are skipped on copy (and for `--plugin-dir`/local installs only within-dir symlinks survive).
**Rationale:** prior art #251 proved escaping symlinks produced EMPTY published installs; real files survive
the fetch/copy. This is the boring, proven path. **Trade-off (named):** a canonical-tree↔package-copy
drift/sync surface — the `claude-plugin` skill MUST document the keep-in-sync obligation (the exact trade-off
#251 recorded). Anchored: `prior-gobbi-core-plugin-package-history` (#251); `plugin-cache-symlink...`.
**Validation:** cache-contents gate confirms real files present; drift-doc section-presence in the skill.

### DD-3 — Hook portability: bundle scripts + `hooks/hooks.json` *(RATIFIED iter-1; shape reconfirmed iter-2)*
**Direction:** ship both hook scripts under the package `hooks/` and register them in `hooks/hooks.json`
with `"\"${CLAUDE_PLUGIN_ROOT}\"/hooks/<script>.sh"`; bodies unchanged. The `hooks.json` reproduces ALL
THREE event registrations: `SessionStart` (`startup|resume|clear|compact`) → `session-start.sh`;
`PostToolUse` (`Task|Agent`) AND `PostToolUseFailure` (`Task|Agent`) → `post-tool-use-agents.sh`.
**Rationale:** bodies resolve work targets from runtime cwd/`$CLAUDE_ENV_FILE` (relocation-safe); the
hooks-as-FILE shape is doc-confirmed and prior-art-confirmed (ba8aa42: directory `hooks` failed validation).
Apply the #256 lesson: do NOT over-narrow matchers (keep `Task|Agent` as in settings.json; do not drop the
failure-path block). Anchored: `plugin-hooks-config...`; settings.json insight (F-C1); prior-art ba8aa42/#256.
**Validation:** post-install, each of the 3 registrations fires exactly once (DD-8 gate).

### DD-4 — Install path: in-repo marketplace + local install *(RATIFIED iter-1, retained)*
**Direction:** in-repo Claude-schema `marketplace.json` + `/plugin marketplace add` + `/plugin install`,
combined with DD-7's worktree-faithful test path. **Rationale:** real install/update/uninstall lifecycle;
matches the prior marketplace approach. Anchored: `marketplace-json-schema...`. **Validation:** add + install
dry-run + the worktree-sentinel assertion.

### DD-5 — `marketplace.json` in scope *(RATIFIED iter-1, retained)*
Author the Claude-schema `marketplace.json` (`name`/`owner`/`plugins[]`; the `gobbi` entry `name`+relative
`source`), distinct from the Codex `.agents/plugins/marketplace.json`. Validation: schema-validate JSON.

### DD-6 — `claude-plugin` skill structure *(RATIFIED iter-1; gobbi section expanded iter-2)*
**Direction:** general Claude-Code-plugin authoring/update guide (schema, component dirs,
`${CLAUDE_PLUGIN_ROOT}`, version cadence, the **ADDS-to (`skills`) vs REPLACES (`agents`/`commands`)
asymmetry footgun**, symlink/path-traversal/cache footguns, validate/install/update CLI) + a layered
gobbi-specific section (our bounded package layout, the 5-`.md`-agents enumeration, the
materialize/drift-sync surface DD-2a, the 3-registration hook story, our install path + worktree caveat,
relationship to `.codex-plugin` + the #258 drift-detector, and the manifest-as-authority reframe as a noted
direction). Anchored: all references + `skills-mirror-symlinks-not-copies` mistake. **Validation:**
section-presence + `readlink` on the symlink.

### DD-7 — Worktree-faithful install/test path *(new — U1 Planning input)*
**Decision needed at Planning:** because a relative local marketplace source resolves to the MAIN checkout
(doc-confirmed), Execution must pick a test path that PROVES the installed cache came from the current
worktree — options: (a) commit/push the worktree branch + add the marketplace from that git ref; (b) point
`source` at an absolute worktree path / a fetch mode that captures the exact tree; (c) merge to main then
install. Whichever is chosen, assert a worktree-only sentinel file is present in the installed cache.
Anchored: `marketplace-relative-source-resolves-to-main-checkout-from-worktree`. **Validation:** sentinel
assertion in the install scenario.

### DD-8 — Hook double-registration steady state *(PLANNING BLOCKER — R2)*
**This is a Planning-blocking decision with options (NOT a loose residual):**
- **Option A — Plugin REPLACES project-local:** remove the 3 hook blocks from `.claude/settings.json`; the
  plugin's `hooks/hooks.json` is the sole registration. Risk: non-plugin/dev sessions lose hook behavior
  until the plugin is installed.
- **Option B — Coexist (NOT recommended):** both register → duplicate env exports + competing `session.json`
  upserts (double-fire). Rejected unless a dedup guard is proven.
- **Option C — Conditional/dev-vs-installed split:** project-local stays for the gobbi-dev workflow; the
  plugin registration is for end-user installs; document the boundary so they never both fire in one session.
**Required regardless of choice:** a validation that each of the 3 registrations fires EXACTLY ONCE after
install. Recommended direction: **Option A** (single source of truth; matches the bounded-package intent),
pending the user's call at Planning. Anchored: R2 + settings.json insight + #256 matcher lesson.
**Validation:** instrument/observe one fire per registration post-install.

### DD-9 — Permissions disposition *(elevated — U2)*
**Decision needed:** whether the 16 `Skill()` + 5 `Agent()` `permissions.allow` entries ship with the plugin
(if the schema/runtime auto-grants invocability for plugin-provided components) or stay project-local. Make
it user-operable: after install, confirm namespaced `gobbi:<skill>` skills + the 5 agents are invocable under
the intended permission mode, and STATE which project-local entries (if any) remain required. Anchored: U2 +
settings.json permissions insight. **Validation:** post-install invocability check of a skill + an agent.

## Decisions Log

| # | Topic | Outcome | Source | Finding addressed |
|---|---|---|---|---|
| A1 | Root cause | Canonical tree, no Claude-plugin manifest; prior package wiped at e083fad — NOT first attempt | git 62b95a0/e083fad, MEMORY pr257, #258 | P1 |
| A2 | Prior attempts (CORRECTED) | Full prior `gobbi-core` package existed (62b95a0); ba8aa42 dir-field reject; #251 materialize; #256 matcher; last-live 5-md-array | git shas; new prior-art reference | P1 (was the false claim) |
| A3 | Counterfactual | Steel-man → defer public marketplace; +new: wiped package means fresh build genuinely needed | feedback_solo_user_context; discussion-log | — |
| A4 | Re-framing | Manifest as single source of truth (DD-6 noted, not built) | discussion-log iter-1 | — |
| B1 | Scope triplet | gobbi / install-runtime / two coupled deliverables (bounded plugin + skill) | discussion-log | — |
| B2 | Deferred candidates | public-marketplace publish; codex/claude reconciliation → 2 feature backlogs (retained) | staged backlogs | — |
| C1 | External schema | 6 references staged (4 retained, 1 corrected, 2 new); all schema/prior-art claims doc/sha-cited | references/ | P1, S1, U1, F-C1 |
| C2 | Internal topology | skills/agents canonical real files; agents dir mixes .md+.toml; 2 hook scripts / 3 event registrations | ls/cat/git verified iter-2 | S1, F-C1 |
| D1 | DD-1 breadth | RATIFIED iter-1 (retained): skills+agents+hooks | AskUserQuestion 2026-05-30 | — |
| D2 | DD-2 layout (REPLACED) | iter-2 RATIFIED: bounded package, ONLY skills+agents+hooks (overturns iter-1 repo-root) | AskUserQuestion 2026-05-30 (log L34-35) | R1, S1 |
| D2a | DD-2a materialization | Direction: materialize real copies (not escaping symlinks); name drift/sync surface | prior-art #251; cache-symlink ref | R1, materialize-vs-symlink |
| D3 | DD-3 hooks | RATIFIED iter-1; iter-2 reconfirms hooks-as-hooks.json-FILE + 3 registrations + #256 matcher caution | AskUserQuestion; ba8aa42; settings.json | F-C1, hooks shape |
| D4 | DD-4 install path | RATIFIED iter-1 (retained): in-repo marketplace + local install + DD-7 worktree path | AskUserQuestion 2026-05-30 | U1 |
| D5 | DD-5 marketplace scope | RATIFIED iter-1 (retained): in scope | AskUserQuestion 2026-05-30 | — |
| D6 | DD-6 skill structure | RATIFIED iter-1; gobbi section expanded with drift/sync + ADDS-vs-REPLACES footgun | AskUserQuestion 2026-05-30 | F-C1, S1 |
| D7 | DD-7 worktree test | NEW Planning input: prove cache came from worktree (sentinel) | worktree-resolution ref | U1 |
| D8 | DD-8 double-registration | PLANNING BLOCKER w/ options A/B/C; rec A; fire-exactly-once validation required | R2; settings.json; #256 | R2 |
| D9 | DD-9 permissions | ELEVATED: ship-vs-project-local decision + post-install invocability check | U2; settings.json | U2 |

**Finding-resolution summary (iter-1 → iter-2):**
- **P1 (prior-art, High/100)** — ADDRESSED. False "no prior attempt" replaced with the full git-sha-cited
  history + 5 proven lessons (new reference); fresh-build rationale stated.
- **R1 (cache payload, High/75)** — ADDRESSED by DD-2 (bounded package) + cache-contents success gate.
- **S1 (agents field, High/75)** — ADDRESSED: `agents` = ARRAY of the 5 `.md` files (doc-confirmed shape),
  `.toml` excluded; reference corrected.
- **R2 (double-registration, Medium/75)** — ADDRESSED as DD-8 Planning blocker with options A/B/C +
  fire-exactly-once validation requirement.
- **U1 (worktree install, High/75)** — ADDRESSED by DD-7 + worktree-sentinel scenario + new reference.
- **U2 (permissions, Medium/75)** — ADDRESSED by DD-9 (user-operable disposition + invocability check) +
  promoted to a scenario + a success-criterion-adjacent check.
- **F-C1 / F-A1 (hook count, Low/75)** — ADDRESSED: corrected to **2 scripts / 3 event registrations**
  throughout; `hooks.json` must keep the `PostToolUseFailure` block; ADDS-to-vs-REPLACES footgun added to DD-6.

**Reference promotion log:** 6 external references staged (4 retained: manifest-schema [corrected],
cache-symlink, marketplace-schema, hooks; 2 NEW: prior-gobbi-core-plugin-package-history,
marketplace-relative-source-resolves-to-main-checkout-from-worktree). 0 skipped.
**Backlog log:** 2 retained → `staging/backlogs/feature/` (public-marketplace; codex/claude reconciliation).

**Preserve list honored (from Claude eval):** external-schema grounding (all claims re-verified iter-2);
steel-man counterfactual (retained + strengthened); backlog discipline (2 backlogs retained); feature-reuse
correctness (install-runtime retained); mistake anchoring (`skills-mirror-symlinks-not-copies` cited for the
new skill symlink). The one iter-1 layout decision Claude preserved (DD-2 repo-root reasoning) is
intentionally OVERTURNED per the explicit iter-2 user decision — documented as REPLACED, not silently dropped.
