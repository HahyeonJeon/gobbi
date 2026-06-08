# Structure — Preparation readiness report eval (iter2, claude)

## Frame
Are the anchor claims structurally correct against the live post-rebase files? Every cited line re-verified independently.

## Independent re-verification (at HEAD = c8a8654, 0 behind / 0 ahead origin/develop)

In-scope anchors — all EXACT:
- auto-mode.md (292 lines): line 78 EVALUATION row ✓; line 208 evaluate.mode lock ✓; §4=196 ✓; §6=251 ✓; ## Cross-references=271 ✓; #295 touch at line 131 (§2 Step-5 Execution row) ✓.
- evaluation.md (307 lines, NOT touched by #295 ✓): manager-job at line 5, line 4 blank (G2 correct) ✓; support anchor "spawns exactly two evaluator agents" at line 42 ✓; § Severity-gated header 112 / Major row 119 ✓; § Dual-system failure 162 ✓; § Degraded-mode 188, content 188-199 ✓; § Regression marking 234 / escalation 239 ✓; § Stuck detection 241 / escalation 246 ✓; § Iteration Caps 253 / escalation 258 ✓.
- .claude/CLAUDE.md (58 lines): line 27 Evaluation blockquote ✓ (byte-identical, untouched by #295); line 31 #295 principles-intro touch ✓.

All in-scope anchors are correct. The G2 off-by-one (use line 5) is itself correct.

## Finding F-S1 — out-of-scope SKILL.md pointer anchor is stale; report claims it was re-verified

- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** Report line 104 (Decisions Item 2): "`orchestration/SKILL.md:247` references 'auto-mode.md §3 — Always-Ask codification' and '§6 — maxIterations exhaustion' (verified verbatim)." Anchors table line 132: `| orchestration/SKILL.md | §3/§6 pointer (OUT OF SCOPE — verify-only) | line 247 | line 247 | exact, unaffected by §7 append |`. Report headline (lines 19, 27): "All anchors below re-verified against the post-rebase files." LIVE: `sed -n '247p'` of SKILL.md = `|---|---|` (a verdict-aggregation table separator). The §3/§6 pointer is at **line 266**. Root cause: #295 modified SKILL.md (+73 lines, 315→384) shifting the pointer from 247 (pre-rebase base a79b231) to 266 (post-rebase c8a8654). `git show a79b231:...SKILL.md | grep -n` confirms the pointer was at 247 pre-rebase.
- **Why it matters:** The report's central iter2 claim is "all anchors re-verified at c8a8654." This one anchor was NOT re-verified — the stale pre-rebase value was carried forward and labeled "verified verbatim / exact." It is the exact defect class the iter2 correction existed to eliminate (stale claim presented as fresh verification), recurring on the one out-of-scope file #295 most heavily edited. Per mistake `leader-iter2-verification-claim-without-evidence` and `evaluator-false-pass-without-diffing`, a "verified" claim is only trustworthy if the value appears at the cited location; here it does not.
- **NOT blocking:** This is a verify-only OUT-OF-SCOPE pointer, not an edit target. Its substantive conclusion holds — the pointer uses stable section NAMES (§3 / §6 / Always-Ask codification / maxIterations exhaustion), so the §7 trailing-append does not break it, and no out-of-scope edit is required. Only the cited line number is wrong. Hence Medium, not High: Planning/Execution can proceed on the 3-file edit without harm; the report's blanket "all re-verified" credibility is the casualty.
- **Suggested direction:** Correct the SKILL.md pointer anchor to line 266 (or drop the line number and cite the section name only, since it is verify-only and name-stable), and narrow the headline claim to "all IN-SCOPE anchors re-verified post-rebase."

## Verdict: PASS (one Medium; no High/Critical)
