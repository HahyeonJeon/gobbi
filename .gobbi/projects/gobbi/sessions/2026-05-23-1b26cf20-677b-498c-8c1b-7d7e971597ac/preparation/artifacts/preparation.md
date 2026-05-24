---
loop: preparation
iter: 3
artifact_type: preparation
feature: session-foundations-bundle-b
goal: "Verify readiness for T1+T3 + lock mirror policy on corrected empirical evidence + add symlink-preservation edit contract"
created-by: 1b26cf20-677b-498c-8c1b-7d7e971597ac
created-at: 2026-05-24
status: final
supersedes: []
related:
  - preparation/rawdata/draft-iter3.md
  - preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md
  - preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md
  - preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md
  - ideation/artifacts/bundle-b-ideation-pass.md
---

# Preparation — Bundle B (session-foundations-bundle-b) — PASS iter3

## Bundle scope

- **T1** — Worktree-first session architecture with NEW absorbed (generate-now commit-on-worktree-branch as a 2-line `chore/session-{date}-{ssid-short}` commit).
- **T3** — `session.json.agents[]` PostToolUse hook + shell-script reconstructor.
- **T2** — Deferred mid-Ideation (skill-loading-discipline matrix + Load-Directives validator); see backlog.

Canonical Ideation output: `sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/ideation/artifacts/bundle-b-ideation-pass.md`.

---

## Readiness verdict

**PASS.** All 9 sub-step gaps resolved. 3 iterations required (iter1 FAIL on false mirror-policy empirical premise; iter2 REVISE on missing symlink-preservation edit contract; iter3 PASS after surgical addition of the edit contract).

---

## Gap-resolution map

| Gap | Resolution | Outcome |
|---|---|---|
| D-1 — feature dir pre-create | Skip | Wrap-up bootstraps `features/session-foundations-bundle-b/` at promotion time |
| D-2 — hooks-domain mistakes | Defer to backlog | Capture mid-Execution; staged at `staging/backlogs/project/hooks-domain-mistakes-watchlist.md` |
| D-3 — Planning brief mistake-load-directives | Generate-now | Decision staged at `staging/decisions/planning-brief-mistake-load-directives-for-t1.md` — Planning MUST cite 3 specific mistakes in every T1 task brief |
| D-4 — workflow phase doc set for T1-I-T1.f | Generate-now | Design staged at `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` — 5 targeted loop docs + "Excluded files + rationale" section (eval.md + mem.md excluded) |
| D-5 — `.claude/scripts/` dir pre-create | Skip | Executor `mkdir -p` at T3-I-T3.b |
| D-6 — aggregated session-lifecycle design doc | Defer to backlog | `staging/backlogs/project/session-lifecycle-worktree-boundaries-design-doc.md` |
| D-7 — `gobbi-hook-authoring` project skill | Defer to backlog | `staging/backlogs/project/gobbi-hook-authoring-skill.md` — pick up at N=2 hooks |
| D-8 — separate `gobbi-session-architecture` skill | Skip | T1 edits ARE the codification; separate skill would duplicate |
| D-9 — `gobbi-shell-script-conventions` skill | Skip | N=1 trap; re-evaluate at N≥2 |
| Mirror-policy lock (iter2) | Corrected from iter1 false premise | Mirror canonical, workspace is symlink runtime layer; 53 file-level symlinks; `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` |
| Symlink-preservation edit contract (iter3) | Added | New H2 in mirror-canonical decision file; `staging/backlogs/project/ci-symlink-integrity-check.md` deferred |

---

## Mirror propagation policy (FINAL — iter3)

**Lock (user re-locked iter2, iter3 adds edit contract):** `.gobbi/projects/gobbi/skills/` is canonical; `.claude/skills/` is the symlink runtime layer. 53 file-level symlinks verified. Both paths resolve to the same physical file **only for inode-preserving edit methods** (`Edit` tool, `Write`, `vim`, `nano`). Methods that rewrite-by-rename (`sed -i`, `perl -i`, `awk`-redirect, formatter-backup-mode) silently convert the workspace symlink to a regular file while leaving the canonical mirror unchanged.

**Symlink-preservation edit contract (iter3 addition):**
1. Prefer the `Edit` tool (inode-preserving; always safe against workspace paths).
2. For bulk rewrites, use the canonical mirror path (`.gobbi/projects/gobbi/skills/...`) directly — never `sed -i` against `.claude/skills/...`.
3. After any non-Edit-tool modification touching a workspace path: `test -L .claude/skills/<path>` (exit 0 = intact). Restore with `rm .claude/skills/<path> && ln -sfn ../../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path>`.
4. Deferred CI / pre-commit guard: `staging/backlogs/project/ci-symlink-integrity-check.md` (zero current witnesses; pick up at first real defect or N≥2 future bundles).

Decision file: `staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` (`status: accepted`, `supersedes: mirror-propagation-policy-workspace-canonical.md`).

---

## Notes for Planning intake

- **Path correction**: `session.template.json` is at `.claude/skills/orchestration/templates/session.template.json` (NOT `.claude/templates/...`).
- **Edit-method discipline**: Planning task briefs MUST cite the `Edit` tool as the default edit method for any skill file modification. For bulk rewrites, cite the canonical mirror path.
- **T1 Load Directives tier 4**: cite 3 specific mistakes per `staging/decisions/planning-brief-mistake-load-directives-for-t1.md`:
  - `codex-eval-session-write-path-nested-in-worktree.md`
  - `manager-rm-rf-without-investigating-tracked-files.md`
  - `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- **D-4 verification gate**: Planning's T1-I-T1.f brief should include the dual grep gate from `staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` — expect 5 matches in the 5 loop docs, 0 in `evaluation.md`/`memorization.md`.
- **Iron Law 7**: Manager constructing Planning briefs MUST `Read` the Ideation artifact freshly when authoring "verbatim" instructions.
- **Bundle A handoff anchor**: `notes/2026-05-23-orch-workflow-improvements.md` "Open items carried" explicitly cites this bundle's items.

---

## Staged artifacts (this loop)

| Path | Type | Status |
|---|---|---|
| `preparation/staging/decisions/planning-brief-mistake-load-directives-for-t1.md` | decision | accepted (iter1) |
| `preparation/staging/decisions/mirror-propagation-policy-mirror-canonical-symlinks.md` | decision | accepted (iter2 + iter3 in-place edit-contract addition) |
| `preparation/staging/decisions/mirror-propagation-policy-workspace-canonical.md` | decision | superseded (iter2) |
| `preparation/staging/design/workflow-phase-doc-set-for-per-iter-cadence.md` | design | updated-iter2 |
| `preparation/staging/backlogs/project/hooks-domain-mistakes-watchlist.md` | backlog (project) | deferred |
| `preparation/staging/backlogs/project/session-lifecycle-worktree-boundaries-design-doc.md` | backlog (project) | deferred |
| `preparation/staging/backlogs/project/gobbi-hook-authoring-skill.md` | backlog (project) | deferred |
| `preparation/staging/backlogs/project/workspace-to-mirror-sync-mechanism.md` | backlog (project) | superseded as moot (iter2) |
| `preparation/staging/backlogs/project/ci-symlink-integrity-check.md` | backlog (project) | deferred (iter3 new) |

---

## Evaluation Summary

### Iteration history

| Iter | Verdict | System verdicts | Key blocker |
|---|---|---|---|
| 1 | **FAIL** | Claude: FAIL; Codex: FAIL | Mirror-policy lock was empirically false — workspace-canonical claim based on directory-level scan only; missed 53 file-level symlinks. Both systems independently raised Critical severity. |
| 2 | **REVISE** | Claude: PASS; Codex: REVISE | Codex identified 5 convergent findings (COD-STRUCT/USAGE/CONS/RISK/OVERALL-PREP2-001) at shared root cause: iter2 "editing either path edits the same physical file" claim unguarded against rewrite-by-rename edit tools. Claude iter2 independently reached PASS — cross-system divergence (Claude PASS, Codex REVISE). |
| 3 | **PASS** | Claude: PASS (all 8 perspectives); Codex: PASS (all 8 perspectives) | All 5 Codex iter2 REVISE findings addressed by symlink-preservation edit contract addition. Residual Low findings (Consequences section unqualified wording, deferred CI pseudocode) non-blocking per verdict threshold rule. |

### Cross-system divergence (iter2 REVISE — the key divergence point)

Claude iter2 reached PASS because it judged the iter2 corrected mirror policy + 53-symlink empirical evidence sufficient for Planning. Codex iter2 reached REVISE because it additionally identified that the broad claim "editing either path edits the same physical file" was unguarded against `sed -i`-style rewrite-by-rename tools — a failure mode empirically verifiable on the filesystem. The divergence was legitimate (not FP): both evaluators ran empirical checks; Codex went one step further by testing edit tool behavior rather than just topology. Iter3 surgical fix (symlink-preservation edit contract) addressed the Codex root cause and both systems converged at PASS.

### Iter3 residuals (open, non-blocking)

- **CL-CONS-PREP3-001 / CL-STRUCT-PREP3-001 / CL-PROJ-PREP3-001** (Severity Low, Confidence 50-75): decision file's "## Consequences" section still contains the unqualified "editing either path edits the same physical file" statement. The new H2 #6 immediately follows and qualifies it. Non-blocking because the operational consumer path (Planning brief → new H2) does not route through Consequences.
- **CL-RISK-PREP3-001** (Severity Low, Confidence 25): deferred CI backlog pseudocode uses `git ls-files -s` for both old and staged modes (should use `git diff --cached --raw` for old mode). Backlog is deferred; future pick-up will fix. Does not affect iter3 deliverable.
- **CL-AESTH-PREP3-001** (Severity Low, Confidence 25): Decisions log row 20 is the densest row in the table — by necessity.
