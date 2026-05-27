---
name: mirror-policy-workspace-canonical-false-premise
description: Scenario — verifying file-level symlink topology before locking mirror-canonical policy
type: scenarios
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
last_updated: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [mirror-policy, symlink, topology, false-premise, scenario]
---

# Mirror-policy workspace-canonical false premise — scenario gap

**Category:** failure-mode
**Coverage:** covered

## Situation

A session is about to lock the mirror-canonical policy — the rule that the mirror file is canonical and the `.claude/` workspace is a symlink runtime layer — based on a topology assumption. The risk: an earlier empirical scan of `.claude/skills/` had been run at directory level only, which misses file-level symlinks. Locking a policy on a topology that was never verified at the file level is a false premise — the policy could assert a symlink layer that the actual files do not match.

## Inputs

- A pending lock on the mirror/workspace topology (which side is canonical, which is the runtime symlink layer).
- The actual `.claude/skills/` tree, whose symlinks exist at the file level (53 of them), not just at the directory level.

## Expected behavior

Any lock on the mirror/workspace topology must be preceded by a file-level (`-type l`) symlink scan, not a directory-level one, so the policy is grounded in the real topology. Once verified, the lock states that the mirror IS canonical and the workspace is the symlink runtime layer, and a symlink-preservation edit contract must guard against rewrite-by-rename edit methods that would break the symlink layer.

## Verification

- File-level scan: `find .claude/skills/ -type l -name "*.md" | wc -l` returns 53.
- Sample resolution: `ls -la .claude/skills/orchestration/SKILL.md` shows a symlink to `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`.
- The lock is recorded in the mirror-canonical decision file with `decision_status: accepted`, and that file carries the `## Symlink-preservation edit contract` section guarding against rewrite-by-rename methods.

## Related

- [`../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md`](../decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md) — the decision this scenario gates; holds the accepted mirror-canonical lock and the edit contract
- [`consumer-mental-model-symlink-topology.md`](consumer-mental-model-symlink-topology.md) — the companion scenario for the executor mental model that depends on this verified topology
- [`../checklists/mirror-policy-empirical-verification.md`](../checklists/mirror-policy-empirical-verification.md) — the checklist enumerating the empirical checks (including the file-level scan) that must pass before the lock
