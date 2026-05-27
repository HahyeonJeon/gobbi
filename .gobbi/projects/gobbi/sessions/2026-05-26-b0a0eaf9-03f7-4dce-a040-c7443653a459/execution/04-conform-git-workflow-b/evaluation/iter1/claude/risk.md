# Risk — T4 conform git-workflow (commit 33340be)

## Artifact Summary + Memory reads
See project.md. Risk lens: blast radius of the conform pass; irreversibility; the design-literal-retire and executor-main-tree-edit mistake classes; narrative-loss risk.
Memory reads: mistakes/{design-literal-retire-instruction-without-replacement, executor-main-tree-edit-near-miss, naming-standard-needs-positive-guidance}; rules.md §4.3 (never delete narrative); skills/execution/evaluation.md Risk seeds.

## Locked Frame (Stage 1)
- **S1 narrative-loss (the 204-deletion risk)**: the -204 deletions are ONLY frontmatter keys + de-crypted cryptic-coords, NOT body narrative deleted into a vacuum (design-literal-retire mistake class).
- **S2 reversibility**: docs change, fully reversible via git revert; no migrations/DDL/one-way doors.
- **S3 main-tree-edit (executor mistake class)**: commit landed on the worktree branch, not main tree.
- **S4 blast radius**: edits confined to git-workflow; no skill/agent path referenced from elsewhere broken.
- **S5 (adversarial) silent over-strip**: a strip removes content that other docs/tools depend on (e.g., a base key, a backlog disposition a tracker reads).
- not-applicable: security surface, PII/privacy, license headers, concurrency, infra — a frontmatter/prose docs edit introduces none.

## Per-scenario per-check results
- S1: YES (TOOL-VERIFIED, the critical adversarial check). Classified all 204 deleted lines: 132 are frontmatter `key: value` deletions (staging-key strips + date→created moves). The remaining ~72 non-frontmatter deletions were inspected per-file via `git show 33340be -- <file>`: every one is either (a) a cryptic-coord body line REPLACED in the same hunk with a self-contained equivalent (e.g., "**Anchor reasoning**: iter1 P4 finding..." → "**Why this check matters**: The worktree-create design adds a first success criterion..."), or (b) a raw session-path line in `## Related` replaced with a descriptive provenance pointer, or (c) a table `Anchor` column (T1-I-T1.h codes) whose reasoning moved into prose. NO body narrative was deleted without replacement. The design-literal-retire vacuum is NOT present.
- S2: YES. Pure docs diff; `git revert 33340be` restores prior state. No irreversible operation.
- S3: YES. `git rev-parse HEAD` = 33340be on branch chore/session-2026-05-25-a10c82d6; `--show-toplevel` = worktree root. Main tree not touched (executor-main-tree-edit avoided).
- S4: YES. `git show --name-only` scoped to features/git-workflow + rawdata; no cross-feature, no skills/agents path edited, so no skill→agent path reference broken.
- S5: NO violation. Safety invariant verified from both directions: 0 base keys missing (nothing legit stripped); disposition retained on all 3 backlogs (the one tracker-relevant key preserved exactly).

## Typed findings
None at Critical/High. The single highest-risk axis for this task — narrative deletion (the explicit V5 contract concern) — is clean: deletions are frontmatter + de-crypt-with-replacement only, honoring the never-delete-narrative rule.

## Low-confidence appendix
- (Low/25) `general`/`docs-sync`: migration-smoke-test checklist dropped the table `Anchor` column entirely (a structural reduction). The anchor reasoning was relocated to per-item "Why this check matters" prose, so no information lost, but a reader comparing to sibling checklists in other features may notice column-shape divergence. Cosmetic.

VERDICT: PASS
