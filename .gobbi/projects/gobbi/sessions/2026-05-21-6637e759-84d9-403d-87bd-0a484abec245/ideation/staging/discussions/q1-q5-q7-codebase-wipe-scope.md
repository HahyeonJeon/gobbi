---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
feature: repo-reset
topic: codebase-wipe-scope
rounds: [1, 2]
locks: [Q1, Q5, Q6, Q7]
---

# Codebase Wipe Scope: What Goes Entirely vs. What Survives

## Discussion Summary

Rounds 1 and 2 established the full codebase wipe scope across four decisions.

**Q1 — packages/ depth (Round 1)**

User requested clean-up of the codebase for a bottom-up rebuild. Manager asked whether `packages/cli/` should be wiped to the dir skeleton or wiped entirely. User chose: wipe `packages/` entirely — leave only root. All of `packages/cli/` (src, manifest, tsconfig, scripts, bin, dist) goes. Rebuild authors a new package shape from scratch.

**Q5 — Root-level manifests (Round 2)**

With `packages/` gone, the root `package.json`, `bun.lock`, `package-lock.json`, and `node_modules/` (66 MB) become orphaned. Manager recommended deleting all four. User confirmed: delete all four. Rebuild authors a fresh root manifest.

**Q6 — `plugins/gobbi/` and `test/gitignore.test.sh` (Round 2)**

`plugins/gobbi/` is mostly symlinks into `.claude/`. `test/gitignore.test.sh` is a workspace-level shell test. Manager recommended deleting both. User confirmed. Note: `/gobbi:*` slash commands will be unavailable until the rebuild restores the plugin.

**Q7 — Root docs (Round 2)**

User specified (free-text): keep `LICENSE`, `CHANGELOG.md`, `README.md`; delete `MIGRATION.md` and `AGENTS.md`. Note: `README.md` will need a stub rewrite pointing to the in-progress rebuild rather than the old v0.5.0 content.

## Locked Decisions

| Lock | Decision |
|------|----------|
| Q1 | Wipe `packages/` entirely |
| Q5 | Delete root `package.json` + `bun.lock` + `package-lock.json` + `node_modules/` |
| Q6 | Delete `plugins/gobbi/` + `test/gitignore.test.sh` |
| Q7 | Keep `LICENSE` + `CHANGELOG.md` + `README.md`; delete `MIGRATION.md` + `AGENTS.md` |

## Related

- `ideation/artifacts/scope-contract.md` § In-Scope items 1, 6, 8
- `ideation/rawdata/discussion-log.md` § Rounds 1-2
