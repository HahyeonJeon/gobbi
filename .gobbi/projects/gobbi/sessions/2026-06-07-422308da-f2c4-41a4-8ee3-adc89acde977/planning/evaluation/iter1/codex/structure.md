## Artifact Summary + Memory reads

Planning artifact evaluated: `planning/rawdata/draft-iter1.md`. The plan uses a hybrid sequential shape: T1 edits `workflow/evaluation.md`, T2 edits `auto-mode.md`, T3 edits `.claude/CLAUDE.md`, and T4 performs read-only cross-file verification. The scope is docs-only and limited to three edit files.

Memory reads: plan, locked Idea, readiness report, three target files, read-only `orchestration/SKILL.md` and `chat-mode.md`, planning evaluation frame, and relevant project mistakes about citation fidelity and section order.

## Locked Frame (Stage 1)

Scenario S1: dependency order makes citation targets final before citers.
- Check: T1 does not rename evaluation.md headers T2 cites.
- Check: T2 does not require final content from a later task for its own verification.
- Check: T3 only cites already-existing targets.

Scenario S2: each task is independently verifiable.
- Check: each `verifies:` item can pass immediately after that task, without relying on later edits.
- Check: cross-file final-state checks are reserved for T4.

Scenario S3 (adversarial): a mutual cross-reference creates a hidden forward dependency.
- Check: any auto-mode Cross-references row to the "reconciled CLAUDE.md line" is either sequenced after T3 or explicitly deferred to T4.

## Per-scenario per-check results

S1: PARTIAL. T1 protects evaluation.md headers, and T3 cites auto-mode after T2. T2 has a hidden forward-reference to the CLAUDE.md paragraph that T3 edits later.

S2: PARTIAL. T1, T3, and T4 are mostly independently verifiable. T2 includes a verification claim about a "reconciled CLAUDE.md line" before the CLAUDE.md reconciliation task runs.

S3: FAIL. The plan's citation graph description omits the auto-mode -> CLAUDE.md Cross-references edge.

## Typed findings

### COD-STRUCT-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `dependency-order` / `75` / `Medium` / The plan's sequencing rationale says citation targets are edited before citers and names only `auto-mode.md §7` citing evaluation.md plus CLAUDE.md citing auto-mode/chat-mode (`planning/rawdata/draft-iter1.md:33`-`39`). But T2 also requires the auto-mode Cross-references block to gain a row to the "reconciled CLAUDE.md line" (`planning/rawdata/draft-iter1.md:92`), while T3 performs that reconciliation later (`planning/rawdata/draft-iter1.md:98`-`111`). / T2 cannot independently verify a row to the reconciled CLAUDE.md paragraph before the paragraph is reconciled. This is a hidden forward dependency and weakens the claimed cite-target-before-citer discipline. / Either defer the auto-mode -> CLAUDE.md Cross-references row to a later task, or change T2 to add only a stable generic CLAUDE.md pointer and make T4 verify the final reciprocal reference after T3.

### COD-STRUCT-002

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`design_flaw` / `citation-fidelity` / `100` / `High` / The plan repeatedly anchors the verify-only `orchestration/SKILL.md` pointer at line 247 (`planning/rawdata/draft-iter1.md:24`, `planning/rawdata/draft-iter1.md:135`, `planning/rawdata/draft-iter1.md:186`, `planning/rawdata/draft-iter1.md:200`). The readiness report explicitly says that post-#295 the actual pointer is line 266 and line 247 is a table separator (`preparation/artifacts/readiness.md:164`-`171`). The live file confirms line 247 is `|---|---|`, while the Auto Mode pointer is line 266 (`.gobbi/projects/gobbi/skills/orchestration/SKILL.md:246`-`266`). / T4 contains a false base-state assertion. An executor following it will fail a valid plan or be tempted to edit an out-of-scope file to make the wrong line true. / Replace every `orchestration/SKILL.md:247` reference with line 266 or a section-level anchor, and keep the file read-only.

## Low-confidence appendix

No low-confidence structure findings.
