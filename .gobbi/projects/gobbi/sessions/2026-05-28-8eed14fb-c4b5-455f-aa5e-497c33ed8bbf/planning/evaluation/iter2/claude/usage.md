# Usage — Planning iter2 (Claude)

**Verdict:** REVISE

## Artifact Summary
Consumers: executor agents (T1-T5, T7), wrap-up assistant (T6), manager during reconciliation. The acid test: a 3am executor pastes a verification command — does it run?

## Memory reads
- evaluation/SKILL.md
- iter1 claude usage.md (F-USAGE-1, F-USAGE-2, F-USAGE-3) and codex usage.md (codex-usage-001/002/003)
- planning/SKILL.md

## Locked Frame (Stage 1)

**S-U1 (inherited)** A 3am executor can run a task's verification commands without re-deriving paths.
**S-U2 (inherited)** Failure modes are communicated (FAIL_<reason> echo strings).
**S-U3 (inherited)** Cross-references resolve (Idea anchors, mistake paths, sub-doc filenames).
**S-U4 (adversarial, new)** F1's YAML-comment NOTE is read by a tired executor scanning the `required-skills:` block.
**S-U5 (adversarial, new)** Pasting a verification command into a shell as-is produces a meaningful result (no input-redirection trap).

## Per-scenario Findings

- **S-U1 ⚠** First verification command in each task uses a full path; subsequent commands shorten to `<chat-mode.md>` / `<settings.default.json>`. Mid-night executor pastes line 2-7 and gets shell parse errors (`<` is input redirection in shell). Iter1 F-USAGE-2 flagged this; iter2 F3 conversion did NOT address it. **Regression in promised guarantee** — the leader claimed §3 conversion to "binary assertions of the form `[ "$(...)" ... ] && echo OK || echo FAIL_<reason>`" but did not propagate the path-resolution discipline through. See F-USAGE2-1.
- **S-U2 ✓** Every `[ ... ] && echo OK_<x> || echo FAIL_<reason>` form names the failure reason. Good.
- **S-U3 ✓** Idea anchors §3.1-§3.6, §4.1-§4.4, §5, §6.1-§6.7, §7.3, §8 F-S2 cited consistently; mistake files at canonical paths.
- **S-U4 ⚠** F1's NOTE is a YAML comment immediately after `- execution`. A loader iterating the YAML list will NOT see it (comments are stripped at parse-time). The executor reading the doc *visually* will see it. So the comment IS for human consumption — fine in practice — but a future automation that programmatically loads `required-skills:` will silently drop the NOTE. Soft hazard; leader's flagged focus area (b) clears for human reading but doesn't survive automation.
- **S-U5 ✗** Per S-U1; see F-USAGE2-1.

## New typed findings

- **F-USAGE2-1 (Medium · Confidence 100 · `checklist_gap` · `process`)** — Iter2 verification commands across T1, T2, T3, T4, T5, T6, T7 use unresolved path placeholders (`<chat-mode.md>`, `<auto-mode.md>`, `<SKILL.md>`, `<settings.default.json>`, `<state.template.json>`, `<session.template.json>`, `<new-backlog.md>`, `<archived-chat-backlog>`, `<archived-auto-backlog>`). Counted ≥ 25 distinct occurrences. A 3am executor copy-pasting any of these as-is hits a shell parse error or unintended file redirect (e.g., `[ "$(grep -c X <chat-mode.md>)" ... ]` opens `chat-mode.md` in cwd as stdin to grep — wrong file in worktree root). Verified via grep at line 150-153 (T1), 211-214 (T2), 265-267 (T4), 313-318 (T5), 379-384 (T3), 431-434 (T7), 480-481 (T6). This is iter1 Claude F-USAGE-2 (Low/75) materially escalated by F3's "binary assertions" framing — the leader promised post-edit assertions while leaving placeholders unresolved. Confidence 100 (grep-verified).
- **F-USAGE2-2 (Low · Confidence 50 · `general` · `process`)** — F1 NOTE inside YAML comment is fine for humans but invisible to automation. If anything downstream programmatically loads `required-skills:` to verify skill availability, the FLAG-2 rationale is lost. Informational.

## Inherited dispositions
- F-USAGE-1 (slug-rule inline quote) → **addressed** (T7 lines 417-418 quote the rule inline; matches the leader's F8 disposition claim).
- F-USAGE-2 (path-placeholder substitution) → **open / regression** — leader did not address; F3 conversion missed it.
- F-USAGE-3 (front-link/back-link wording) → **open** — not in F1-F8; carried forward.
- codex-usage-001 (claude skill) → **addressed** via F1.
- codex-usage-002 (`<pre-T4-rev>` / `<pre-T5-rev>` baseline) → **addressed** via F3.
- codex-usage-003 (binary assertions) → **partially addressed** — F3 converted `# expect` comments to `[ ... ] && echo` form, but path placeholders within those assertions remain unresolved (see F-USAGE2-1).

## Verdict & Must-preserve

- **Verdict: REVISE.** F-USAGE2-1 (Medium / 100) — verifiable defect a 3am executor would hit. The bar `Medium ≥ 75 confidence` triggers REVISE under `evaluation/SKILL.md` thresholds.
- **Must-preserve:** F1 inline-rule quoting style (good); F3 echo OK/FAIL_<reason> idiom; the first-line full-path discipline (which IS correct in every task — only the subsequent lines drift).

## Low-confidence appendix
- F-USAGE2-2 — only Significant if automation arrives.
