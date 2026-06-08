# Consistency — Preparation readiness report eval (iter1, claude)

The core question: do the report's claims match the live files? I re-verified every anchor independently.

## Anchor re-verification (live files, NOW)

| Report claim | Live file | Verdict |
|---|---|---|
| auto-mode.md line 78 = EVALUATION row-3 cell | line 78 IS the row-3 EVALUATION cell | MATCH |
| auto-mode.md line 208 = evaluate.mode lock | line 208 IS the `"always"` defaults row | MATCH |
| auto-mode.md §6 header line 251 | line 251 = `## §6 — maxIterations exhaustion` | MATCH |
| auto-mode.md `## Cross-references` line 271 | line 271 = `## Cross-references` | MATCH |
| auto-mode.md total 292 lines | `wc -l` = 292 | MATCH |
| evaluation.md manager-job = line 5 (NOT 4) | line 4 blank; line 5 = "…not to do the evaluation itself" | MATCH (G2 correction is right) |
| evaluation.md line 119 = Major divergence | line 119 = Major `PASS↔FAIL / REVISE↔FAIL` row | MATCH |
| evaluation.md 188-199 = Degraded-mode | header 188, both-fail 196, close 199 | MATCH |
| evaluation.md line 239 = Regression AskUserQuestion | line 239 = regression AskUserQuestion (header is 234) | MATCH (content line) |
| evaluation.md 242-249 = Stuck detection | header 241, body 242-249 | MATCH (content lines) |
| evaluation.md 253-258 = Iteration Caps | header 253 | MATCH |
| CLAUDE.md line 27 = Evaluation blockquote | line 27 = exact target text | MATCH (worktree byte-identical to develop) |
| SKILL.md:247 = §3/§6 pointer | line 247 = "auto-mode.md §3 … §6" | MATCH; trailing-append leaves it valid |
| chat-mode.md 154/237 = Iteration-caps parallel | 154 + 237 = "Budget exhausted → escalate to user" | MATCH |
| chat-mode.md silent on Stuck/Regression | only line 563 "silent regression" (unrelated) | MATCH |

**14 of 15 anchor claims verified MATCH. The G2 off-by-one correction is CORRECT.**

## Finding F-C1 — G1 drift evidence is factually inverted and partly fabricated (High)
- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Item 1b (line 47): "The **main-tree** `.claude/CLAUDE.md` has been edited concurrently: it now carries a 'Continue vs Fresh' sentence … plus a new '[claude skill]' row in the navigate table. The **worktree** copy is CLEAN." Live verification: `git diff origin/develop -- .claude/CLAUDE.md` shows the worktree is 1 commit BEHIND develop (commit `c8a8654 #295`). The Continue-vs-Fresh sentence was ADDED on develop's principle-intro paragraph (line 31); the WORKTREE is the copy that LACKS it. The drift direction is inverted. Additionally, the `[claude skill]` nav row is present in BOTH the worktree (line 57) AND develop — it is NOT a develop-only drift item; that part of the claim is fabricated.
- **Why it matters:** The report's central readiness gap is described with a wrong causal model. It tells the reader the worktree is current and develop drifted, when the truth is the worktree is stale and must be rebased to pick up #295. A downstream agent trusting this will mis-handle the merge. The grep `"Continue vs Fresh" = 0` cited as proof of "clean" is true but means the OPPOSITE of what the report concludes (it means the worktree is missing develop's content, i.e., behind).
- **Why NOT Critical:** The edit-target Evaluation blockquote (line 27) IS byte-identical between worktree and develop (verified). So the operative conclusion — no content collision on the actual edit target; defer the merge to Wrap-up — survives. The damage is to the rationale and to the Wrap-up instruction, not to the Planning/Execution edit.
- **Suggested direction:** Re-state G1 as "worktree is behind origin/develop by #295; rebase before PR; line 27 is byte-identical so no edit-target collision." Drop the fabricated nav-row drift. Manager + user decide.

## Other consistency checks
- §7 trailing-append renumbers nothing → all internal `(§3)`/`(§6)` anchors in auto-mode.md stay valid, and SKILL.md:247 stays valid. CONFIRMED — report correct.
- Report Item 5 cites `preparation/SKILL.md:4 allowed-tools` to prove the role has Edit. Live: line 4 = `allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion`. Edit present. MATCH (minor: this is the preparation-skill role surface, which is the role doing prep, not the separate executor agent spec — but Edit is present where prep edits happen).
