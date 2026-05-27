---
name: edit-contract-addition
description: User decided to add symlink-preservation edit contract as H2 in the mirror-canonical decision file; CI guard deferred to backlog.
type: discussions
scope: feature
feature: install-runtime
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [symlinks, edit-contract, mirror-policy]
topic: Symlink-preservation edit contract — iter3 surgical addition
outcome: "Add edit contract H2 to mirror-canonical decision file; deferred CI backlog judged necessary"
---

# Symlink-preservation edit contract — where to document it

## Context

During the Preparation loop's second evaluation iteration, Codex reached REVISE (while Claude reached PASS) because 5 convergent Codex findings across the structure/usage/consistency/risk/overall perspectives all shared one root cause: the "editing either path edits the same physical file" claim was unguarded against rewrite-by-rename edit tools (`sed -i`, `perl -i`, `awk`-redirect, formatter-backup-mode). These tools silently convert a workspace symlink into a regular file while leaving the canonical mirror unchanged — breaking the workspace→canonical symlink layer. This was empirically reproduced: `sed -i` against a `/tmp` symlink turned the symlink into a regular file, with the canonical target unchanged.

The final evaluation iteration's brief specified a surgical addition: add an edit contract to address the 5 convergent findings. The open question was where to put it and whether to also build a CI guard.

## Question

Should the edit contract be: (a) a new H2 section in the existing mirror-canonical decision file, or (b) a separate standalone document? And should a CI guard be staged immediately or deferred?

## Options considered

1. New H2 in existing decision file (in-place addition between Consequences and Empirical reference) — keeps all mirror-policy discipline in one file; consumers need only read one document.
2. Separate decision file — cleaner separation but forces Planning briefs to cite two files.
3. CI symlink-integrity check: generate-now or defer. Zero current witnesses → Principle 10 requires deferral unless the risk is critical-path.

## User decision

(a) New H2 "## Symlink-preservation edit contract" added to `mirror-propagation-policy-mirror-canonical-symlinks.md` between existing H2 sections "## Consequences" and "## Empirical reference". Empirical witness anchored inline (git ls-files -s modes + /tmp sed -i reproduction).

(b) CI backlog deferred (Fix 3 judged necessary by the leader; Principle 10 rationale: zero current witnesses). Staged at `staging/backlogs/project/ci-symlink-integrity-check.md` with 3 pick-up triggers.

Edit contract content: safety table (10 rows, YES/NO/verify per edit method), 4-point discipline list (prefer Edit tool; canonical mirror path for bulk rewrites; `test -L` post-edit verification gate with `rm + ln -sfn` restore; CI hook deferred), empirical witness.

## Implication

- Planning briefs for the skill-editing executor tasks MUST cite the Edit tool as the default edit method.
- For bulk rewrites, executors MUST use the canonical mirror path (`.gobbi/projects/gobbi/skills/...`), never `sed -i` against `.claude/skills/...`.
- After any non-Edit-tool modification, executors MUST run `test -L .claude/skills/<path>` and restore if broken.
- The 5 Codex REVISE findings from the second evaluation iteration are closed at root cause.
- Both Claude and Codex converged at PASS on the final iteration.

## Related

- `decisions/2026-05-24-mirror-propagation-policy-mirror-canonical-symlinks.md` — the decision file the edit contract was added to as an in-place H2 section.
- Backlog [`../../../backlogs/ci-symlink-integrity-check.md`](../../../backlogs/ci-symlink-integrity-check.md) — the deferred CI guard.
- The 5 Codex Preparation-loop evaluation findings (structure / usage / consistency / risk / overall) that drove the edit contract — preserved in the session's evaluation artifacts.
