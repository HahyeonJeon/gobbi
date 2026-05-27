# T7 iter2 — Restore Lost Content from iter1 (6f9dbf9)

## Iteration status: DONE

## What iter1 broke

iter1 (commit 6f9dbf9) correctly applied conformance transformations (base keys, S-strip, concept-first titles) but:

1. **Deleted `## Anchor` in `dot-gobbi-project-json-bootstrap.md`** without relocating to `## Source` (§4.3 violation). 3 bullets including F-Fix-C provenance pointer vanished.
2. **Collapsed `## Related` in `dry-inline-jq-hook-script.md`** (5 bullets → `## When to pick up` 1 sentence). Also renamed `## Rationale` → dropped body provenance context.
3. **Dropped non-S frontmatter keys** across multiple files:
   - `supersedes: null` / `superseded_by: null` from 5 backlog files
   - `project: gobbi` from `README.md`, `dot-gobbi-project-json-bootstrap.md`, `schema-extension-agents-status-field.md`
   - `last_updated:` from `README.md`, `mirror-policy-empirical-verification.md`, `consumer-mental-model-symlink-topology.md`, `mirror-policy-workspace-canonical-false-premise.md`
   - `related: [...]` frontmatter key from `claude-code-transcript-tooluseresult-empirical.md`
   - `## Anchor` (5 bullets) from `schema-extension-agents-status-field.md`
   - `## Related` (2 original bullets) from `ci-symlink-backlog-pseudocode-plumbing.md` (replaced with generic parent ref)
   - `## Related` (4 bullets) from `sidecar-lock-refinement-deferred.md` (replaced with 1 design file ref)
   - `## Related` (3 bullets) from `hook-self-failure-budget-unstated.md` (replaced with 2 design file refs)
   - `## Related` (3 bullets) from `consequences-section-unqualified-claim.md` (replaced with 1 decision file ref)
4. **Malformed README session UUID**: `a10c82d6-03f7-4dce-a040-c7443653a459` was a splice of branch prefix `a10c82d6` + session tail. Correct UUID: `a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7` (session `2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7`).

## What iter2 fixed

### Files modified (12 of 20 T7 files needed changes):

1. **`README.md`**: Restored `project: gobbi`, `last_updated: 2026-05-26`. Fixed `session:` to valid UUID `a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7`.

2. **`backlogs/dot-gobbi-project-json-bootstrap.md`**: Added `project: gobbi`. Added `## Source` footer with 3 deleted anchor bullets (D-3-3-resolver step (i) dormant precondition note, empirical verification, F-Fix-C pointer).

3. **`backlogs/dry-inline-jq-hook-script.md`**: Restored `supersedes: null`, `superseded_by: null`. Restored original `## Rationale` body (iter2+iter3 reference). Added back `## Related` with all 5 original bullets after `## When to pick up`.

4. **`backlogs/ci-symlink-backlog-pseudocode-plumbing.md`**: Restored `supersedes: null`, `superseded_by: null`. Reverted `## Why deferred` rename back to `## Rationale` with original confidence-25 statement. Restored original 2-bullet `## Related` (replacing generic parent ref).

5. **`backlogs/consequences-section-unqualified-claim.md`**: Restored `supersedes: null`, `superseded_by: null`. Restored original 4-bullet `## Related` (3 eval paths + staging decision path).

6. **`backlogs/hook-self-failure-budget-unstated.md`**: Restored `supersedes: null`. Restored original 3-bullet `## Related` (draft-iter2.md ref, iter1 F-RISK-2, Task 08 ref).

7. **`backlogs/schema-extension-agents-status-field.md`**: Added `project: gobbi`. Added `## Source` footer with 5 deleted anchor bullets (D-3-3, T3 implementation checklist item 7, T3-DQ-3, E-1, CP-D-1).

8. **`backlogs/sidecar-lock-refinement-deferred.md`**: Restored `supersedes: null`, `superseded_by: null`. Restored original full `## Rationale` body (D-3-5 reference). Restored original 4-bullet `## Related` (eval paths + draft ref).

9. **`checklists/mirror-policy-empirical-verification.md`**: Restored `last_updated: 2026-05-24`.

10. **`references/claude-code-transcript-tooluseresult-empirical.md`**: Restored `related: [claude-code-posttooluse-hook-schema]` frontmatter key.

11. **`scenarios/consumer-mental-model-symlink-topology.md`**: Restored `last_updated: 2026-05-24`.

12. **`scenarios/mirror-policy-workspace-canonical-false-premise.md`**: Restored `last_updated: 2026-05-24`.

## Unchanged files (8 of 20 T7 files had no restorable losses)

- `backlogs/hook-latency-bounds.md` — no non-S keys dropped, no body sections deleted
- `checklists/hook-skill-exit-behavior-must-enumerate-all-fatal-paths.md` — no non-S keys dropped
- `checklists/skill-must-not-invent-json-field-paths-not-in-witnesses.md` — no non-S keys dropped
- `checklists/skill-registration-must-mirror-real-settings-shape.md` — no non-S keys dropped
- `checklists/smoke-test-payloads-must-include-all-required-env-vars.md` — no non-S keys dropped
- `checklists/structured-header-migration-behavior.md` — no non-S keys dropped
- `references/claude-code-changelog-ccsi-version.md` — no non-S keys dropped
- `references/claude-code-hooks-stdin-contract.md` — no non-S keys dropped

## Verification results

Gate 1 (S-set leak = 0 in T7 files): PASS
Gate 2 (9 base keys in 44/44 files): PASS
Gate 3 (disposition in 7 backlogs): PASS
Gate 4 (0 cryptic-led H1 titles in T7): PASS
Gate 5 (no net deletion of non-S frontmatter keys): PASS — all supersedes/superseded_by/project/last_updated/related restored
Gate 5b (body section no-loss): PASS — ## Anchor → ## Source in 2 files; ## Related restored in 4 files; ## Rationale body restored in 2 files
Gate 6 (README session is valid UUID): PASS — a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7
Gate 7 (only T7 paths in diff): PASS — 12 files, all under install-runtime/

## Decisions Log

- D-1: Restored `## Related` sections to original bullets (not `## Source`) because they are provenance pointers, not footnotes — consistent with brief guidance "restore the provenance (to ## Source if it's pointers, or keep the bullets)".
- D-2: Reverted `## Why deferred` → `## Rationale` in files where the rename changed section identity (ci-symlink-backlog-pseudocode-plumbing). Brief: "keep the original section shape".
- D-3: Did NOT restore S-set keys (`finding-id`, `confidence`, `severity`, `domain`, `loop`, `type: design_flaw`, etc.) — these are legitimate iter1 strips.
- D-4: README session: chose `a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7` (the actual 2026-05-25 session that created the feature dir per the README activity table), not the current session `b0a0eaf9-03f7-4dce-a040-c7443653a459`.
- D-5: Added `project: gobbi` to `dot-gobbi-project-json-bootstrap.md` and `schema-extension-agents-status-field.md` — both had it in 6f9dbf9^ (original titles used `project: gobbi`).
