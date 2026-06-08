# Project (Stage 2) — iter3 — Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads
**What:** A docs-only Ideation Idea hardening Auto-mode evaluation discipline across exactly 3 files (auto-mode.md, workflow/evaluation.md, .claude/CLAUDE.md), removing three manager misbehaviors at root. **Why:** In Auto mode the manager invents an evaluate-mode question, self-evaluates, and idles asking "defer or not"; root causes are a missing prohibition, a guard in the wrong doc, and mode-agnostic routine-triage escalations. **How:** add auto-mode.md §7 (trailing append, no renumber); sharpen + mode-split evaluation.md routine-triage sections while preserving the dual-system safety gates; reconcile the CLAUDE.md Evaluation blockquote. Scope Contract at draft 15-26; consumers = Planner then Executor.

**Memory reads:** evaluation/SKILL.md; ideation/evaluation.md (child doc); workflow/evaluation.md (live target); auto-mode.md (live target); .claude/CLAUDE.md (live target); chat-mode.md + orchestration/SKILL.md (read-only consistency); mistakes/{manager-skipped-dual-system-eval, design-literal-retire-instruction-without-replacement, section-order-is-part-of-the-contract-not-just-the-set, principle-text-lead-with-imperative-not-agent-psychology, skills-mirror-symlinks-not-copies, edit-tool-refuses-symlink-paths}.md; iter2/claude/*.md.

## Locked Frame (Stage 1)
- **Right root cause, not symptom** — checklist: each of P1/P2/P3 terminates at a cause whose removal obviates the work; verified against live file contents (line citations).
- **Scope Contract sharp, enumerated, no "etc."** — 3 files named; out-of-scope files explicitly listed.
- **iter3 broadening solves the right problem** — the new mode-split of Stuck + Regression targets genuinely mode-agnostic sections, not invented ones.
- **(adversarial) Broadening does not silently expand scope** — no new 4th file pulled in by the Stuck/Regression split.
- **(adversarial) The routine-vs-safety classification names the right problem** — the carve-out exists because over-applying the no-interrupt rule would itself be a new failure.

## Per-scenario per-check results
- Root cause P3 CONFIRMED accurate: live `evaluation.md` has NO mode-awareness on Stuck (241-249) / Regression (234-239) / Iteration Caps (253-258) — verified by grep (zero mode tokens). The mode-split is a real fix, not a fabricated one. YES.
- All four P3 instances are in-scope files (CLAUDE.md + 3 evaluation.md sections). The Stuck instance (3c) was the Codex iter2 discovery; draft 52-59 + D3 correctly fold it in. YES.
- Scope stays 3 files; the broadening adds no out-of-scope edit. The safety-gate sections kept interrupting are also in evaluation.md (in-scope). YES.
- Routine-vs-safety classification (draft 67-79 table + §7.3 + §7.4 + File-2 framing sentence) names which section is which class; the carve-out's stated purpose is to prevent over-application. YES.

## Typed findings
None above Low. The idea solves the right problem; the iter3 broadening is correctly scoped and targets real mode-agnostic sections.

## Low-confidence appendix
None.

## Verdict: PASS
