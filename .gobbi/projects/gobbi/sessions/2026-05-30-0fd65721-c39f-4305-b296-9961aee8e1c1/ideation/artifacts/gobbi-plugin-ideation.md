---
loop: ideation
iter: 2
artifact_type: scope-contract
created_at: 2026-05-30
status: final
supersedes: []
related:
  - ideation/rawdata/draft-iter2.md
  - ideation/evaluation/iter2/claude/overall.md
  - ideation/evaluation/iter2/codex/overall.md
  - ideation/staging/design/gobbi-plugin-bounded-package.md
  - ideation/staging/decisions/2026-05-30-bounded-package-layout.md
---

# Ideation Canonical Artifact — Gobbi Claude Code Plugin + `claude-plugin` Skill

**Feature:** install-runtime  
**Session:** 0fd65721-c39f-4305-b296-9961aee8e1c1  
**Verdict path:** iter-1 Claude=PASS / Codex=REVISE → reconciled REVISE → iter-2 both PASS

---

## Scope Contract

**Project:** gobbi · **Feature:** install-runtime

**Goal:** Package gobbi as a self-contained installable Claude Code plugin (skills + agents + hooks only) and codify plugin authoring as a reusable skill.

**Two coupled deliverables:**

1. A fresh, bounded `gobbi` Claude Code plugin package: `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`, nothing else; plus a Claude-schema `marketplace.json` cataloging it.
2. A `claude-plugin` skill (general Claude-Code-plugin authoring/update guide + a layered gobbi-specific section) at `.gobbi/projects/gobbi/skills/claude-plugin/SKILL.md` with a `.claude/skills/claude-plugin/` mirror symlink.

### In-Scope

- A fresh `gobbi` plugin laid out as a **dedicated, self-contained package directory** whose contents are EXACTLY: `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`. No session memory, no `.gobbi/` project tree, no repo content, no `README`/`design`/`settings.json`.
- A `.claude-plugin/plugin.json` manifest conformant to the current Claude schema: `name: gobbi` (only required field), metadata, `skills` (directory pointer / ADDS-to), `agents` (ARRAY of the 5 role `.md` file paths — NOT a directory; excludes the `.toml` Codex wrappers), `hooks` → `./hooks/hooks.json`.
- The 5 Claude role agents (`manager.md`, `leader.md`, `executor.md`, `evaluator.md`, `assistant.md`) and the current skills present as REAL files inside the package (materialized), so the marketplace/local copy does not skip escaping symlinks.
- The two hook scripts (`session-start.sh`, `post-tool-use-agents.sh`) shipped under the package `hooks/` and registered in `hooks/hooks.json` with `${CLAUDE_PLUGIN_ROOT}`-based command paths across ALL THREE event registrations: `SessionStart` (`startup|resume|clear|compact`) → `session-start.sh`; `PostToolUse` (`Task|Agent`) AND `PostToolUseFailure` (`Task|Agent`) → `post-tool-use-agents.sh`. Script bodies unchanged.
- A Claude-schema `.claude-plugin/marketplace.json` (distinct from the Codex `.agents/plugins/marketplace.json`) cataloging the `gobbi` plugin for local install.
- The `claude-plugin` skill (general guide + layered gobbi section) at the canonical path + `.claude/skills/` mirror symlink. The gobbi section MUST document the materialize-vs-canonical **drift/sync surface** the bounded-package model creates.

### Out-of-Scope

- Implementation itself (Execution owns it).
- Reviving / borrowing files from the wiped `gobbi-core` package (history is reference only; build is fresh on current v0.5 structure).
- Publishing/hosting gobbi on a public/hosted marketplace → backlog `publish-gobbi-to-public-marketplace.md`.
- Reconciling the Codex `.codex-plugin`/`.agents/plugins/marketplace.json` with the Claude side → backlog `reconcile-codex-plugin-and-claude-plugin-manifests.md`.
- MCP/LSP servers, monitors, themes, output-styles, `commands/`, `userConfig`.
- Any rewrite of hook script LOGIC (only registration + bundled location move).

### Success Criteria

1. `claude plugin validate ./<package>` (and `--strict`) passes: JSON-valid, `name` present, no wrong-TYPE fields, no unrecognized/misspelled keys.
2. **Post-install cache-contents gate (R1):** after a real install, the cached plugin dir contains ONLY skills/agents/hooks — NO `.gobbi/.../sessions` tree, NO project memory, NO repo content.
3. After install from the **worktree-faithful** path (U1), gobbi's skills are loadable (`gobbi:<skill>`), all 5 role agents are invocable, and **each hook fires exactly once** on `SessionStart` / `PostToolUse` / `PostToolUseFailure`.
4. The `claude-plugin` skill exists at the canonical path, the `.claude/skills/claude-plugin/SKILL.md` symlink resolves, and the skill contains BOTH a general authoring/update guide AND a layered gobbi section that documents the drift/sync surface (DD-2a) and the ADDS-to-vs-REPLACES footgun.
5. Every external manifest/marketplace/hook claim in both deliverables traces to the authoritative `code.claude.com` docs (no memory-sourced schema); every prior-art claim cites a git sha.

---

## Framed Problem

**Root cause:** gobbi's value (workflow skills, 5-role agent taxonomy, two runtime hooks) is currently installable only by manual `.claude/` mirror-sync — the same surface PR #261 had to hand-repair after PR #260 left broken symlinks (backlog #258 drift detector). gobbi DID ship a Claude Code plugin + marketplace through v0.4.x (`plugins/gobbi-core`, commit `62b95a0` PR #6), but that package was **wiped in the v0.5 reset** (`e083fad`, PR #264, refs #263). So today the v0.5 structure has a canonical component tree but **no Claude-plugin manifest declaring it**.

**Impact:** solo user (install/update friction, recurring manual symlink repair); any future adopter; every session that depends on the `.claude/` mirror being intact. Not a runtime blocker today but a recurring fragility + missing-capability gap.

**Prior attempts (corrected; iter-1 had a false "no prior attempt"):**

- **`plugins/gobbi-core` (62b95a0, PR #6)** — full prior Claude plugin in a dedicated bounded subtree, with `marketplace.json` (`name: gobbi`) + `plugin.json` (`name: gobbi-core`).
- **ba8aa42** — proved the old schema REJECTED directory-valued `agents` and `hooks`; kept only `"skills"`.
- **c79d28e (#251/#252)** — the load-bearing lesson: escaping symlinks in the package were DROPPED by the marketplace fetch → empty `agents/` and `skills/`; fix = materialize REAL files inside the package. Explicit recorded trade-off: "Editing on main now requires editing in two places."
- **#253–#256 hooks saga** — `metadata hook matcher missed sdk-cli source — drop matcher entirely` (#256): too-narrow `matcher` silently misses event sources.
- **Last-live state (e083fad^)** already used `"agents": [5 .md file paths]` + a full `hooks/hooks.json`.
- **`.codex-plugin/plugin.json` (159eb21, PR #265)** — the Codex analogue (skills-only directory pointer).

**Counterfactual (steel-manned):** "A plugin is unnecessary — gobbi works via the `.claude/` mirror, and gobbi is solo-user." Counter-evidence: (1) user's brief is a direct request (Iron Law 10 satisfied); (2) recurring mirror-repair (PR #260→#261, backlog #258) is a real cost even solo; (3) the manifest is the declarative source of truth the #258 drift-detector wants. The wiped package also means "it already exists" is false — a fresh build is genuinely needed.

---

## Locked Design Decisions

| # | Decision | Source | Status |
|---|---|---|---|
| DD-1 | Plugin breadth: full (skills + agents + hooks) | AskUserQuestion 2026-05-30 | RATIFIED iter-1, retained |
| DD-2 | Bounded self-contained package: ONLY skills + agents + hooks (overturns iter-1 repo-root decision) | AskUserQuestion 2026-05-30 (log L34-35) | RATIFIED iter-2 (REPLACED DD-2 iter-1) |
| DD-2a | Component files MATERIALIZED as real copies inside the package (not escaping symlinks) | Prior art #251; cache-symlink reference | Direction (mechanism = Execution's) |
| DD-3 | Hooks: bundle 2 scripts under package `hooks/`; register ALL THREE event blocks in `hooks/hooks.json` via `${CLAUDE_PLUGIN_ROOT}`; bodies unchanged | AskUserQuestion; ba8aa42; settings.json | RATIFIED iter-1; shape reconfirmed iter-2 |
| DD-4 | Install path: in-repo Claude-schema `marketplace.json` + `/plugin marketplace add` + local install | AskUserQuestion 2026-05-30 | RATIFIED iter-1, retained |
| DD-5 | `marketplace.json` in scope this session | AskUserQuestion 2026-05-30 | RATIFIED iter-1, retained |
| DD-6 | Skill = general authoring/update guide + layered gobbi-specific section; canonical path + mirror symlink | AskUserQuestion 2026-05-30 | RATIFIED iter-1; gobbi section expanded with drift/sync + ADDS-vs-REPLACES footgun (iter-2) |
| DD-7 | Worktree-faithful install/test path (relative marketplace source resolves to MAIN checkout from worktree) | worktree-resolution reference | NEW Planning input; no recommended default yet (F-U1 open) |
| DD-8 | Hook double-registration steady state | R2; settings.json; #256 | PLANNING BLOCKER; options A/B/C; recommended Option A (plugin replaces project-local) |
| DD-9 | Permissions disposition: ship-vs-project-local decision + post-install invocability check | U2; settings.json | User-operable; Planning decision |

**Key manifest shape facts (doc-confirmed):**
- `name` = only required field
- `skills` = `string|array`, ADDS-to the default `skills/` (directory pointer OK)
- `agents` = array of FILE PATHS, REPLACES default agents dir (NOT a directory pointer)
- `hooks` = points to `hooks/hooks.json` file (NOT a directory)
- Wrong-TYPE fields are load errors; `--strict` fails on unrecognized/misspelled keys
- Escaping symlinks SKIPPED on install-time copy (security rule)

---

## Open Issues for Planning

The following are open residuals from the PASS evaluation that Planning must resolve:

1. **F-S1 / CONS-1 (Medium) — Drift/sync re-sync trigger unnamed:** The materialized-copy creates a sync obligation ("editing in two places"). The draft names the obligation but does not specify WHAT triggers a re-sync (e.g., "any canonical skills/agents/hooks edit requires a package re-sync + version bump"). Planning should name the trigger or require a mechanical sync/diff gate. Both Claude and Codex flagged this (Claude F-S1, Codex CONS-1).
2. **STRUCT-1 (Medium) — Bounded package root path and marketplace `source` value not named:** The draft says "dedicated package directory" but never names the actual path (e.g., `plugins/gobbi/` or `.claude-plugin/`). Planning should fix the concrete root + the exact `marketplace.json` plugin `source` value to prevent inferring incorrectly and recreating the R1 cache-payload problem.
3. **F-U1 (Medium) — DD-7 worktree test path lacks a recommended default:** Unlike DD-8 (Option A recommended) and DD-9 (user decision), DD-7 leaves Planning 3 live options with no guidance. A recommended default should be added (option (a) commit/push + git-ref is the most worktree-faithful and matches the project's branch-per-session model).
4. **F-P1 (Low) — DD-9 permissions auto-grant premise untagged:** Whether the schema/runtime auto-grants invocability for plugin-provided components is an unverified load-bearing assumption. Tag as explicit assumption_risk to verify at Planning; the post-install invocability check is the falsifier.

---

## Evaluation Summary

### Iter-1 (Claude=PASS / Codex=REVISE → reconciled REVISE)

Codex caught four High findings Claude missed:
- **P1 (High/100):** False "no prior attempt" — a full `gobbi-core` plugin + marketplace existed and was wiped at `e083fad`; prior fixes #251/#256 are authoritative lessons.
- **R1 (High/75):** Repo-root plugin root would copy 77M `.gobbi/.../sessions` tree into global plugin cache.
- **S1 (High/75):** `agents` manifest key takes file paths, not a directory; canonical agents dir mixes `.md` + `.toml`.
- **U1 (High/75):** Worktree-local install scenario missing; relative marketplace source resolves to main checkout.

Additional Codex findings: R2 (double-registration, Medium), U2 (permissions, Medium), A1 (state-label conflict, Medium).

Claude also found: F-O1 (hook count underspecified: "2 hooks" not "2 scripts / 3 registrations"). Claude rated Overall PASS; Codex rated REVISE. Reconciled verdict: REVISE (pessimistic union).

**Divergence rationale:** Claude's perspectives (Aesthetics, Consistency, Usage, Risk) each noted the hooks/double-registration cluster as Medium/Low but not blocking. Codex's four High findings (P1/R1/S1/U1) each met the REVISE threshold independently. The manager verified P1 (git history confirmed), R1 (77M payload confirmed), S1 (agents dir mixes .md+.toml confirmed), and U1 (worktree-resolution doc confirmed). All were real gaps — Codex was correct.

### Iter-2 (Claude=PASS / Codex=PASS → reconciled PASS)

All iter-1 High findings resolved:
- **P1** — Full git-sha-cited history present; 5 proven lessons extracted from prior package.
- **R1** — DD-2 bounded package + post-install cache-contents gate.
- **S1** — `agents` = 5-`.md` array; `.toml` exclusion explicit; doc-confirmed REPLACES semantics.
- **U1** — DD-7 + worktree-sentinel scenario + new reference.
- **R2** — DD-8 Planning blocker with options A/B/C + fire-exactly-once validation.
- **U2** — DD-9 user-operable + invocability check.
- **A1 (Codex)** — State labels normalized; no stale PROPOSED/ratification labels.

Residuals (all Medium or lower, none blocking Planning):
- **F-S1 (Claude Medium) = CONS-1 (Codex Medium)** — drift trigger not named (same root, different perspectives).
- **STRUCT-1 (Codex Medium)** — package root path not named.
- **F-U1 (Claude Medium)** — DD-7 lacks recommended default.
- **F-P1 (Claude Low)** — permissions auto-grant premise untagged.

**Cross-system divergence at iter-2:** Both systems agreed on all High resolution claims. The Medium residuals were named by both systems (drift/sync) or only Codex (STRUCT-1). No perspective disagreement required tiebreaking.

---

## Implementation Checklist (directional)

- [ ] Lay out bounded package dir = `.claude-plugin/plugin.json` + `skills/` + `agents/` + `hooks/`, nothing else (DD-2 + cache-symlink R1)
- [ ] Materialize REAL copies of current skills + 5 role `.md` agents + 2 hook scripts into the package (mechanism = Execution's; DD-2a + prior-art #251)
- [ ] Author `plugin.json`: `name: gobbi`, metadata, `skills` dir pointer (ADDS-to), `agents` = ARRAY of 5 `.md` paths (exclude `.toml`), `hooks` → `./hooks/hooks.json` (DD-2 + manifest-schema + ba8aa42)
- [ ] Author `hooks/hooks.json` reproducing ALL THREE event registrations with `${CLAUDE_PLUGIN_ROOT}` paths; bodies unchanged; do NOT over-narrow matchers (#256 lesson) (DD-3 + settings.json)
- [ ] DECIDE hook double-registration steady state (DD-8 — Planning blocker) + fire-exactly-once validation (R2 + settings.json)
- [ ] DECIDE permissions disposition (DD-9 / U2): ship vs project-local; post-install invocability check
- [ ] Author Claude-schema `.claude-plugin/marketplace.json` (`name`/`owner`/`plugins[]` with `name`+`source`) (DD-5 + marketplace-schema reference) — **Planning must name the exact `source` value (STRUCT-1)**
- [ ] DECIDE + document worktree-faithful install/test path (DD-7 / U1) with worktree-sentinel assertion — **Planning should add recommended default (F-U1)**
- [ ] Add post-install cache-contents gate (R1) — allow-set = skills/agents/hooks only
- [ ] Author `claude-plugin/SKILL.md` (general guide + layered gobbi section incl. drift/sync DD-2a + ADDS-vs-REPLACES footgun + named re-sync trigger) + create `.claude/skills/claude-plugin/SKILL.md` symlink (DD-6 + F-S1/CONS-1)
- [ ] Verify: `claude plugin validate --strict`; worktree-faithful install; cache-contents gate; fire-once observation; `readlink` + section-presence

---

## Key Research References (all staged under `staging/references/`)

| Reference | Key insight |
|---|---|
| `claude-code-plugin-manifest-schema.md` | `name`-only-required; `agents` = file-path ARRAY (REPLACES); `skills` ADDS-to; `hooks` = hooks.json file; wrong-type + `--strict` failures; `${CLAUDE_PLUGIN_ROOT}` |
| `plugin-cache-symlink-dereferencing-and-path-traversal.md` | Install copies to cache; escaping symlinks skipped (security); no `../`; bounded-package + materialized files is the correct approach |
| `marketplace-json-schema-and-skills-dir-plugins.md` | `marketplace.json` schema (`name`/`owner`/`plugins[]`; entry `name`+`source`); relative-source resolution |
| `plugin-hooks-config-and-plugin-root-var.md` | Plugin hooks ship as `hooks/hooks.json`; scripts via `${CLAUDE_PLUGIN_ROOT}` |
| `prior-gobbi-core-plugin-package-history.md` | 5 proven lessons from wiped prior package: bounded subtree; materialize real files; agents as file-path array; hooks.json file not dir; matcher must not be too narrow |
| `marketplace-relative-source-resolves-to-main-checkout-from-worktree.md` | Relative plugin source resolves to MAIN checkout when Claude Code runs from a worktree — worktree-faithful test path must account for this |
