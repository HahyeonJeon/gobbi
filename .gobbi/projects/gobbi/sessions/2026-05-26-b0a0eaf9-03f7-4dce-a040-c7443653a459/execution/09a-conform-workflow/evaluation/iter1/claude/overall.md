# Overall — T9a conform features/workflow §4 (commit 1287e88), iter1, claude

Target: commit 1287e88, conform 26 non-archive features/workflow docs to dev-doc standard §4 (frontmatter §4.4 + title de-crypt), exclude archive. Diff-read, own commands, do-not-trust-report.

## Gate matrix
| Gate | Result |
|---|---|
| 1 — §4.5 full leak gate (archive-safe, all S keys both spellings, + non-backlog disposition) | **0** (was 19). PASS |
| 2 — 9 base keys on all 26 non-archive docs | PASS |
| 3 — disposition preserved on 1 backlog; non-backlog none | PASS |
| 4 — 0 cryptic-led titles/headings | **FAIL** — 2 H1 titles still LED by session coordinates |
| 5 — scope (only non-archive workflow paths; no archive doc; no other feature) | PASS |
| 6 — no body section (§4.2) reshaping; frontmatter + inline-coord + heading only | PASS (0 `##`/`###` churn) |
| 7 (CRITICAL diff-read) — no KEEP key stripped | **FAIL** — `project: gobbi` net-stripped from workflow README; `title` net-stripped from 1 decisions doc |

## Cross-perspective synthesis
Two real defects converge across Project / Consistency / Risk / Usage:

1. **KEEP-strip of `project: gobbi` on workflow README (High@100).** This is the brief's CRITICAL Gate 7 failure and — most damningly — a verbatim repeat of the defect the IMMEDIATELY PRECEDING same-session commit `dbe61c3` remediated ("restore KEEP keys project/last_updated over-stripped by T8"). dbe61c3 restored `project: gobbi` to the project-memory README citing §4.4 KEEP and consistency with 07c/07d; T9a then re-stripped it on the sibling workflow README, while inconsistently RETAINING `project: gobbi` on `decisions/wrap-up-step-2-5-anchor-placement.md`. Karpathy failure mode: a freshly-corrected mistake recurring one commit later. Standard tension noted: canonical §4.4 KEEP line (rules.md:231) does not itself name `project`; the KEEP status derives from dbe61c3 + brief Gate 7. Manager+user must confirm `project` is KEEP, but given dbe61c3 the operative answer is yes.

2. **Two cryptic-led H1 titles (Medium@75).** `# LOCK #2 Tasks 07+08 …` (only "(deferred)" trimmed) and `# T1→T3 wave ordering …` still lead with vanished-session coordinates, against §4.1 and brief Gate 4's "0 cryptic-led." Concept follows the coordinate so meaning degrades rather than vanishes.

Secondary: `title` net-removed from one decisions doc (Low@75; content folded into description+heading, and §2.2 makes `title` non-canonical on decisions — genuine brief-vs-standard tension).

## Must-preserve (remediation must not break)
- Gate 1 cleanliness: 19→0 S-key + non-backlog-disposition leaks. The strip logic is otherwise correct.
- All 26 docs' 9 base keys.
- Backlog `disposition: open` preservation.
- Zero body section reshaping (Gate 6) — do NOT start re-prosing §4.2 sections in remediation; this pass is frontmatter+title only.
- The 13 correctly de-crypted titles and the in-place (never-deleted) inline-coordinate body edits.
- The 2 already-conformant untouched docs.

## Verdict computation
Highest finding: F1 `project` KEEP-strip, Severity High, Confidence 100. No Critical@≥75 → not FAIL. High@≥50 present → REVISE. Gates 4 and 7 (CRITICAL) both miss. Net: REVISE — small, surgical remediation (restore `project: gobbi` on README; de-crypt 2 H1 titles; decide `title` rule), no architectural rework.

VERDICT: REVISE
