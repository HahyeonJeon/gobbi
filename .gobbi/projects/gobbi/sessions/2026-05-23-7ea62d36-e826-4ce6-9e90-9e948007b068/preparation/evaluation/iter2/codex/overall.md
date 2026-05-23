# Overall Evaluation

## Artifact Summary + Memory reads

The iter2 Preparation draft and staged `codex` stub were re-evaluated after iter1 REVISE. The intended What is a surgical repair: make the generated `codex` skill stub match locked Design A and fix citation/frontmatter issues before Planning. The Why is valid: Planning needs a stable pre-promoted skill target. The How is flawed: the repair followed a wrong manager brief instead of the locked Idea Design A and empirical project skill frontmatter convention.

Memory reads:
- All seven iter2 Codex perspective files in this directory.
- Target stub, `draft-iter2.md`, and `rawdata/skill-stub-iter1.md`.
- Design A locked H2 artifact lines 15-23.
- `memorization/SKILL.md` lines 220-228.
- All iter1 Codex evaluation files.
- Existing project skill frontmatter baseline across 16 `SKILL.md` files.
- Project mistakes and rule listed in per-perspective memory reads.
- No `session.json` read.

## Cross-perspective synthesis

- Project, Structure, Performance, Aesthetics, Usage, Consistency, and Risk all converge on REVISE.
- The stub now has exactly 8 H2s, so the iter1 count defect is addressed.
- The actual 8 H2s are still wrong. The locked list requires #7 `Cost + sandbox budget awareness` and #8 `Anti-patterns`; the iter2 stub has #7 `Anti-patterns` and #8 `Constraints`.
- The frontmatter repair is inverted. The existing 16 project skills all use `allowed-tools`; none use `when-to-load`. The iter2 stub removes `allowed-tools` and adds `when-to-load`.
- The Path conventions citation is fixed: `memorization/SKILL.md` has `**Path conventions**` at line 224, and draft iter2 cites line 224 with lowercase `c`.
- The iter1 stub audit copy exists and preserves the old state, including `Cost + sandbox budget awareness` at line 70 and `STUB metadata` at line 107.
- Concern #4 was correctly reclassified from Planning to Preparation in principle, but it was incorrectly marked resolved because the replacement stub remains invalid.

## Per-readiness-grade verification

- Item A/codex stub: REVISE. Count is 8, but H2 names/order and frontmatter fail.
- Citation correction: PASS. Line 224 lowercase `c` is correct.
- Iter1 audit preservation: PASS. `rawdata/skill-stub-iter1.md` exists and captures the prior 10-H2 stub.
- Concern #4 classification: PARTIAL. Planning -> Preparation reclassification is correct; "resolved" status is false.
- No premature project-memory write: PASS. `.gobbi/projects/gobbi/skills/codex` does not exist yet.
- Main-tree absolute write path: PASS. Iter2 Codex evaluation artifacts are written under the requested absolute main-tree session path.

## Prior iter finding resolution

- `COD-PREP-PROJ-001`: superseded. Old evidence was 10 H2s and missing `when-to-load`; new evidence is wrong 8-H2 identity/order plus missing `allowed-tools`.
- `COD-PREP-PROJ-002`: addressed for classification, not for outcome. Concern #4 moved to Preparation but the fix did not satisfy the contract.
- `COD-PREP-STRUCT-001`: addressed. Path conventions line drift and H2 count drift were corrected.
- `COD-PREP-STRUCT-002`: superseded. Report-vs-actual count drift was fixed; actual-vs-Design-A and frontmatter drift remain.
- `COD-PREP-AESTH-001`: superseded. `STUB metadata` was removed, but `Constraints` is still an unauthorized H2 and the cost/budget H2 is missing.
- `COD-PREP-USAGE-001`: open with changed evidence. The staged skill is still unsafe to promote.
- `COD-PREP-CONS-001`: addressed. Current draft uses line 224 lowercase `c`.
- `COD-PREP-CONS-002`: superseded. Count contradiction is fixed; Design A/frontmatter contradictions remain.
- `COD-PREP-RISK-001`: open with changed evidence. No premature write occurred, but PASS would still promote an invalid stub.
- `COD-PREP-OVERALL-001`: superseded. The old compound finding is replaced by the more precise H2-identity and frontmatter findings below.
- `COD-PREP-OVERALL-002`: addressed. Citation drift and stale count claims were corrected.

## Findings

### COD-PREP2-OVERALL-001

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Design A lines 15-23 lock the H2 list. Actual iter2 stub H2s are `When to load`, `Invocation patterns`, `Why subagents must use `codex exec``, `Sandbox + CWD discipline`, `Hang + timeout discipline`, `Use cases`, `Anti-patterns`, `Constraints`. H2 #7/#8 mismatch the locked list, and `Cost + sandbox budget awareness` is missing.
- FP-check: user explicitly required any H2 mismatch against the locked list to be High.

### COD-PREP2-OVERALL-002

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: the iter2 stub frontmatter has `name`, `description`, and `when-to-load`, but no `allowed-tools`. Grep confirmed all 16 existing project skills have `allowed-tools`; grep found no existing project skills with `when-to-load`.
- FP-check: not a novel skill-design preference. The user supplied this as the empirical convention to verify, and the repo confirms it.

### COD-PREP2-OVERALL-003

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: draft line 169 says all gates PASS and the stub has correct frontmatter, but the two authoritative checks above fail. Advancing would promote a manager-induced brief error into Planning.
- FP-check: this is not blame assignment; it is a process risk rooted in following the wrong brief over locked artifacts.

## Karpathy failure modes

- Wrong assumptions: present. Iter2 assumes the manager brief can replace locked Design A and empirical frontmatter convention.
- Overcomplexity: mild. Adding `Constraints` as a peer H2 creates an extra section where the locked design already had anti-pattern and discipline sections.
- Orthogonal edits: not material; the changes are in scope, just wrong.
- Imperative-over-declarative: present in the process. The draft treats "make count 8" as sufficient and loses the declarative contract: exact names and order.

## Preserve list

- Preserve the 8-H2 count.
- Preserve the corrected `Path conventions` citation at line 224 lowercase `c`.
- Preserve the iter1 audit copy.
- Preserve the reclassification of Concern #4 as Preparation-owned, but change its status back to unresolved until the stub is fixed.
- Preserve the no-premature-project-memory-write state and main-tree absolute write discipline.

## Verdict

REVISE. Threshold reason: multiple High findings at confidence 100. No Critical findings were found, so this is not FAIL.

## Low-confidence appendix

No low-confidence findings.
