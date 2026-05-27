# Consistency — T4 conform git-workflow (commit 33340be)

## Artifact Summary + Memory reads
See project.md. Consistency lens (the load-bearing perspective here): did the cumulative §4.5 gate reach 0 over ALL 41 docs; do all 41 carry base keys; is disposition preserved exactly on backlogs and absent elsewhere; does the commit message match the diff?
Memory reads: skills/memorization/rules.md §4.4 (S-set, conditional disposition) + §4.5 (gate); skills/execution/evaluation.md Consistency seeds.

## Locked Frame (Stage 1)
- **S1 cumulative leak gate = 0**: §4.5 archive-safe + hyphen/underscore-aware gate over all 41 git-workflow docs prints nothing.
- **S2 base-keys cumulative**: all 41 (not just T4's 21) carry the 9 base keys.
- **S3 disposition conditional**: disposition preserved on exactly the 3 backlogs; 0 non-backlog files carry disposition.
- **S4 commit-msg ↔ diff**: commit body claims (21 docs, S-set strip, disposition preserved, gate 0) match the actual diff.
- **S5 (adversarial) underscore-spelling leak**: an underscore-spelled S-set key (source_iter/source_system/source_file) survives the strip and the gate misses it.
- **S6 (adversarial) over-strip safety-invariant violation**: a legitimate key (disposition on backlogs, or a base key) gets stripped.

## Per-scenario per-check results
- S1: YES (TOOL-VERIFIED). Ran the §4.5 gate regex `^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by):` via `find features/git-workflow -name '*.md' -not -path '*/archive/*' | xargs grep -lE` → 0 files. 41 docs scanned, no archive subdir exists under git-workflow.
- S2: YES (TOOL-VERIFIED). Scripted base-key check over all 41 → 0 missing.
- S3: YES (TOOL-VERIFIED). `find ... -not -path '*/backlogs/*' | xargs grep -lE '^disposition:'` → 0. The 3 backlogs carry disposition deferred/open/open respectively, matching the draft's stated values.
- S4: YES. Commit body says 21 docs + 9 base keys + S-set strip + disposition on 3 backlogs + gate 0 + disposition gate 0; `git show --numstat` confirms 21 git-workflow docs + README + 1 rawdata; all claims reproduce.
- S5: YES — underscore variants caught. The scenarios/checklists that previously carried source_iter/source_system/source_file (per draft) now show 0 hits in the underscore-aware gate; verified those keys are gone (e.g., ssid-env-var-absent-fallback diff strips source_iter/source_system/source_file).
- S6: NO violation. disposition retained on all 3 backlogs (safety invariant honored); no base key stripped (S2 = 0 missing). The `category`/`related`/`ref_type`/`task_count`/`priority`/`domain` legitimate keys all preserved.

## Typed findings
None at Critical/High. The cumulative gate is genuinely 0, base-keys complete, disposition conditional honored both directions, commit-msg faithful. This is the contract and it is met.

## Low-confidence appendix
- (Low/25) `general`/`docs-sync`: README's `created: 2026-05-26` + `session: a10c82d6...` reflects the conform session, while the doc describes a feature whose content predates it; consistent with the standard (created/session = when the file was authored/conformed). Not a defect.

VERDICT: PASS
