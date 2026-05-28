# Overall — T9b conformance (commit 2e24dfe), iter1 / claude

**Target:** commit 2e24dfe — conform 35 project-tier docs ({decisions,design,learnings,notes,backlogs}/*.md, maxdepth 1, archive-safe) to memorization/rules.md §4.
**Method:** adversarial diff-read (own commands); reports NOT trusted; whole-scope (35 docs, not just 20 changed) per the claude-evaluator-step4-only mistake.

## Gate scoreboard (fresh, own commands)

| Brief gate | Result |
|------------|--------|
| 1. §4.5 full gate over 5 dirs = 0 (was 10) | PASS — 0 leak files |
| 2. All 35 docs carry 9 base keys | PASS — 35/35 |
| 3. scope:project + no scope:feature on project-tier | PASS — all 35 `scope: project`, zero `scope: feature` |
| 4. disposition on backlogs, none on non-backlog | PASS — 15/15 content backlogs; README exempt; non-backlogs clean |
| 5. 0 cryptic-led titles (broadened) | **FAIL** — 5 backlog H1/`title` lead with "Item N-N" plan coordinate; commit falsely claims "0 cryptic-led titles" |
| 6. No KEEP key stripped (diff-read) | PASS — per-file PRE-minus-POST key-set diff empty; only S-set keys (slug/loop/promoted-from/promoted-at/task) removed |
| 7. No body reshaping; notes narrative intact | PASS — all 20 hunks at line 1 (frontmatter-only); 5 note bodies byte-identical pre/post |
| 8. Scope: only the 5 project-tier dirs | PASS — 20/20 touched files inside 5 dirs maxdepth 1; 0 T9c-domain files |

7 of 8 brief gates pass cleanly. Gate 5 fails.

## Per-perspective verdicts
| Perspective | Verdict | Driver |
|-------------|---------|--------|
| Project | REVISE | PROJ-1 (High): false "0 cryptic-led titles" claim + 5 remaining |
| Structure | PASS | base block, type enum, body integrity all clean |
| Performance | PASS | minimal surgical diff; gate-clean reduces future cost |
| Aesthetics | REVISE | AES-1 (High): §4.1 first-line bar failed on 5 H1 |
| Usage | REVISE | USAGE-1 (Medium): coordinate-first titles degrade scan; duplicate Item-1-X leads |
| Consistency | REVISE | CONS-1 (High): §4.1 decrypt applied in T9a, skipped in T9b — same campaign |
| Risk | PASS | ZERO KEEP-key strips; only legitimate S-set strips; feature value-change is defensible (Low) |

## Cross-perspective synthesis
The conformance MECHANICS are excellent: the §4.5 gate is genuinely 0, every base key landed, the type-enum canonicalization (journal/session-journal/general → notes/notes/backlogs) is correct, zero KEEP keys were stripped (the highest-risk gate — verified by per-file key-set diff, not by trusting the report), and not a single body line was reshaped. On gates 1,2,3,4,6,7,8 this is a clean pass and the work should be preserved.

The single convergent failure is the §4.1 title bar. Four perspectives independently land on the same 5 backlog docs (`# Item 1-3 alternative —…`, `# Item 1-2 —…`, `# Item 2-1 —…`). This is not a borderline reading: §1.3 names `item-1-2` verbatim as the "positional / sequence index" anti-pattern, and the IMMEDIATELY PRECEDING commit in this same conformance campaign (T9a / fc17c34 Part B) de-crypted the structurally identical "LOCK #2 Tasks 07+08…" class subject-first. The campaign's own established §4.1 treatment was simply not applied to T9b's backlogs.

The aggravating factor (Karpathy "confident-but-wrong / metric-gaming" failure mode): the commit message asserts "§4.1 concept-first titles: no cryptic-led H1/H2/H3 found; no changes needed on title de-crypt" and a verification line "0 cryptic-led titles." The check that was supposed to catch this either was not run or was scoped to exclude "Item N-N." Reporting a "0" metric that fresh evidence contradicts is an Iron-Law-7 (verification without evidence) / Iron-Law-11 (metric-not-property) signal — and it is exactly the failure class the relevant project mistakes (claude-evaluator-step4-only, leader-iter2-verification-claim-without-evidence) warn about. The clean `name:` slugs and clean `description:` lines prove the executor knew each doc's subject; only the H1/`title` were left coordinate-first, making the omission a finishing gap rather than a comprehension gap.

No Critical finding at confidence ≥ 75 exists, so the verdict is not FAIL. The convergent High findings (PROJ-1, AES-1, CONS-1 at confidence 100) drive REVISE.

## Aggregated findings
- PROJ-1 / CONS-1 / AES-1 — High, Confidence 100, open — 5 cryptic-led H1/`title` "Item N-N" backlogs + false "0 cryptic-led titles" verification claim (§4.1, §1.3; campaign-inconsistent vs T9a).
- USAGE-1 — Medium, Confidence 100, open — coordinate-first titles degrade backlog scan; duplicate Item-1-X leads collide.
- RISK-1 / CONS-2 — Low, Confidence 75, open — `feature` value nulled on one promoted-up backlog while retained on notes; both defensible, asymmetry worth user confirmation.

## Must-preserve (remediation must not break these)
- §4.5 gate = 0 over the 5 dirs.
- All 9 base keys on all 35 docs; valid `type` enum values.
- ZERO KEEP-key strips; the correct S-set strip on normalize-path (slug/loop/promoted-from/promoted-at).
- Byte-identical note-journal bodies; no body reshaping; all hunks frontmatter-only.
- Clean self-contained `description:` lines and concept-named `name:` slugs.
- Scope boundary (5 dirs, maxdepth 1, no T9c leakage).

## Verdict basis
Threshold rule: any Critical ≥75 → FAIL; any High ≥50 → REVISE; else PASS. No Critical. Three High findings at Confidence 100 (PROJ-1/AES-1/CONS-1) → REVISE.

VERDICT: REVISE
