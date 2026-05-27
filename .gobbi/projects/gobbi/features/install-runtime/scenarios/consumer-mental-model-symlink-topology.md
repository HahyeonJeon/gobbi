---
name: consumer-mental-model-symlink-topology
description: Scenario — executor must understand workspace-is-symlink-layer to safely edit workspace paths
type: scenarios
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
last_updated: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [symlink, mental-model, executor, workspace, consumer]
---

# Consumer mental model — executor must understand workspace-is-symlink-layer topology

**Category:** failure-mode
**Coverage:** covered

## Situation

An executor (or the leader copying instructions into a Planning brief) is handed a task that edits a file under the `.claude/` workspace tree. The `.claude/` tree is not a set of independent files: most of its docs are symlinks pointing at canonical mirror files under `.gobbi/projects/gobbi/skills/...`. If the consumer carries the wrong mental model — believing a workspace path is a standalone regular file — they can pick a rewrite-by-rename edit method that silently replaces the symlink with a regular file, severing it from its canonical source while appearing to succeed.

## Inputs

- A task whose write target is a path under `.claude/` that is actually a symlink to a canonical mirror file.
- An executor choosing an edit method (inode-preserving `Edit` vs rewrite-by-rename tools such as `sed -i`).

## Expected behavior

The consumer must understand the workspace-is-symlink-layer topology before editing: the mirror file is canonical and the workspace path is a symlink runtime layer. Planning briefs must convey this mental model, name which edit methods are safe versus unsafe, and specify how to verify symlink integrity after an edit. The default edit method is the inode-preserving `Edit` tool; a rewrite-by-rename method must not be used on a workspace symlink.

## Verification

- The mirror-canonical decision file carries a symlink-preservation edit contract (a safety table of edit methods marked YES/NO/verify) that Planning briefs cite.
- Post-edit integrity is confirmed with a `test -L <path>` gate (the path must still be a symlink, not a regular file).

## Related

- [`../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`](../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md) — the decision file holding the symlink-preservation edit contract and the edit-method safety table this scenario depends on
- [`mirror-policy-workspace-canonical-false-premise.md`](mirror-policy-workspace-canonical-false-premise.md) — the companion scenario covering the file-level topology verification that grounds this mental model
