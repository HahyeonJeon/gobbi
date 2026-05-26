---
date: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
loop: preparation
scope: feature
feature: install-runtime
topic: Symlink-preservation edit contract — iter3 surgical addition
outcome: "Add edit contract H2 to mirror-canonical decision file; deferred CI backlog judged necessary"
---

# Symlink-preservation edit contract — iter3 lock

## Context

iter2 Codex reached REVISE (while Claude reached PASS) because 5 convergent Codex findings (COD-STRUCT/USAGE/CONS/RISK/OVERALL-PREP2-001) all shared one root cause: the iter2 "editing either path edits the same physical file" claim was unguarded against rewrite-by-rename edit tools (`sed -i`, `perl -i`, `awk`-redirect, formatter-backup-mode). These tools silently convert a workspace symlink into a regular file while leaving the canonical mirror unchanged — breaking the workspace→canonical symlink layer. This was empirically reproduced: `sed -i` against a `/tmp` symlink resulted in the symlink becoming a regular file, canonical unchanged.

iter3 was the final iteration (maxIterations=3). The iter3 brief specified a surgical addition: add the edit contract to address the 5 convergent findings.

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

- Planning briefs for T1+T3 executor tasks MUST cite the Edit tool as default edit method.
- For bulk rewrites, executors MUST use the canonical mirror path (`.gobbi/projects/gobbi/skills/...`), never `sed -i` against `.claude/skills/...`.
- After any non-Edit-tool modification, executors MUST run `test -L .claude/skills/<path>` and restore if broken.
- The 5 iter2 Codex REVISE findings are closed at root cause.
- Both Claude and Codex converged at PASS for iter3.

## Related

- `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` (H2 added in-place)
- `preparation/staging/backlogs/project/ci-symlink-integrity-check.md`
- `preparation/evaluation/iter2/codex/{structure,usage,consistency,risk,overall}.md` (the 5 addressed findings)
