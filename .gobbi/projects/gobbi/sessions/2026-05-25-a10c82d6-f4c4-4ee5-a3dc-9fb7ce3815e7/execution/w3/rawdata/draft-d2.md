---
loop: execution
iter: 1
artifact_type: w3-dispatch-2-draft
created_at: 2026-05-26
status: draft
---

# W3 dispatch-2 executor draft — §8 cat A Bundle B re-homing (W3-T3)

## Task
Re-home `features/session-foundations-bundle-b/` 100 cluster md (README deferred to W3-T5) into the 7 capability value-features. Primary = `git-workflow`; route per content (design §1.3 row 3 + §8 LOW-16 heuristic). Split into 6 subdir-cluster committable batches + a recovery manifest.

## Commits (6 cluster commits, branch `chore/session-2026-05-25-a10c82d6`, not pushed)
- (a) `f3f3e8b` — decisions 6 + scenarios 6 + plans 1 + changelogs 1 = 14
- (b) `b43b7cf` — design 16
- (c) `739d166` — checklists 15
- (d) `947ec9f` — backlogs 15
- (e) `2db6669` — references 12
- (f) `50c911b` — discussions 28

Total: 100 renames. AI-Provenance-Record trailer on all six.

## Recovery manifest
`sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/execution/w3/staging/w3t3-cluster-manifest.md` — all 6 boxes `[x]` with SHAs; per-cluster routing log + ambiguous-routing notes.

## Destination breakdown (100 files)
| Feature | a | b | c | d | e | f | total |
|---|---|---|---|---|---|---|---|
| git-workflow | 7 | 7 | 6 | 3 | 5 | 11 | 39 |
| install-runtime | 4 | 6 | 3 | 7 | 1 | 8 | 29 |
| workflow | 2 | 3 | 4 | 1 | 0 | 4 | 14 |
| agents | 1 | 0 | 1 | 1 | 4 | 2 | 9 |
| guardrails | 0 | 0 | 2 | 3 | 2 | 1 | 8 |
| evaluation | 0 | 0 | 0 | 0 | 0 | 3 | 3 |
| project-memory | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| **total** | 14 | 16 | 15 | 15 | 12 | 28 | **100** |

`project-memory` received zero Bundle B files (Bundle B is the worktree/runtime/hook/eval sprint; no memory-system-design content). This is correct per §1.3 row 3 (project-memory is not even a Bundle B secondary).

## Re-home changelogs added (6 — one per touched feature)
git-workflow, workflow, install-runtime, agents (cluster a); guardrails (cluster c); evaluation (cluster f). All `2026-05-26-bundle-b-rehome.md`.

## Routing rationale highlights
- **D-3-1..D-3-6 hook family → install-runtime** (not agents/guardrails). The PostToolUse/PostToolUseFailure hook that captures subagent metadata into `session.json agents[]` is the session-runtime contract; §1.3 row 3 maps "T3 subagent metadata → install-runtime". General hook *reference/docs* (lifecycle events, PostToolUse schema, hook-event-count, hook verification) → **guardrails** (hooks-domain ownership). The agents[]-implementation-specific empirical/SDK material → install-runtime.
- **Delegation-brief content → agents** (execution-intake-notes, shared-executor 07+08, delegation-contract verifier, d-ref-codes for executors, agent-SDK TaskOutput, role skill-catalog, RBAC matrix, agent-output schema-validation).
- **Eval-result/eval-dispatch discussions → evaluation** (3 files).
- **Mistakes bundle / Goodhart / drift-gate → guardrails.**
- **Mirror/symlink topology → install-runtime** (mirror-canonical policy, symlink edit contract, CI symlink check).

## Ambiguous routings (defaulted per §8 rule 2 / dominant-noun)
- `bundle-scope-confirmation`, `gap-resolutions-9-batch` → git-workflow (sprint-scope / spans D-1..D-9; primary).
- `privacy-retention-agents-metadata-deferred` → agents (two non-primary candidates agents/guardrails; dominant noun = agents[] metadata).
- `autogen-pydantic-tool-schema-validation` → agents (validation prior art; pairs w/ commitlint but subject is agent-output validation).
All recorded in the manifest's ambiguous-routing notes.

## Verification (fresh)
- `find features/session-foundations-bundle-b -name '*.md' ! -name README.md | wc -l` → **0**.
- Only `README.md` remains in Bundle B (deferred to W3-T5).
- 6 commits: R counts 14/16/15/15/12/28 = **100**; A = changelogs+manifest only; **D = 0** on every commit.
- `develop` tip unchanged (`82a5137`) — main tree untouched.

## Scope / out-of-scope respected
- Did NOT touch env-var-audit (W3-T1), Bundle A (W3-T2), or Bundle C (next dispatch).
- Did NOT touch Bundle B `README.md` (W3-T5).
- Left prior session memory (`rawdata/draft-d1.md`) and `state.json.bak` untouched.
- `skill-md-commit-type-feat-vs-docs.md` (checklists) + all 12 reference files had no `feature:` key → none added (body+frontmatter unchanged; frontmatter normalization is category C, not this task).
