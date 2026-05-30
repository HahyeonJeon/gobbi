# Perspective: Consistency

**Target:** T8 Workflow refactor across 3 docs

## Findings

### F-C1 — All claimed grep targets pass
- `^## §3 — Workflow` in chat: 1 hit at L59 ✓
- `Per-task slice workflow shape` in chat: 0 hits (term-lock changed to "Workflow") ✓
- `^## §2 — Workflow` in auto: 1 hit at L45 ✓
- `^## §3 — Always-Ask codification` in auto: 1 hit at L157 ✓
- `^## §7 — Settings defaults` in auto: 1 hit at L271 ✓
- `^### Step 1 — Workflow Configuration` in SKILL: 1 hit at L99 ✓
- `grep -cE '^### Step [2-6] —' SKILL`: 0 ✓
- `Definition.` count: chat=7 (≥6 ✓), auto=6 (≥6 ✓)
- `chat-mode.md|auto-mode.md` in SKILL: 8 hits (≥4 ✓) — pointers + state-machine cross-ref + correction block.

### F-C2 — `Per-task slice` term-lock preserved in chat-mode
- `grep -cE 'Per-task slice' chat-mode.md` = 1, at L70 (box header). The renamed section is "Workflow" but the term-lock for slice semantics is intact. ✓

### F-C3 — Auto-mode re-numbering chain is fully consistent
- All §2 → §3 renumbers traced: L34 ("see §3" = Always-Ask), L113 ("per §3"), L212/L213/L214 ("(§3)" in defaults table), L236 ("Always-Ask matrix (§3)"), L304 ("§3 of this doc"), L307 ("Referenced in §3.4"). All resolve to the new positions. ✓

### F-C4 — Broken downstream anchor `SKILL.md#iteration-caps` in both mode docs
- See F-U1 / F1 — consistency-level evidence: the same broken link appears in chat-mode L234 and auto-mode L153. The actual SKILL.md anchor is `#iteration-rule` (L297) or, for the no-anchor case, `#mode-specific-gates-within-a-loop`. **Cross-doc inconsistency:** the link text says "Iteration Caps" but no section by that name exists. Severity: Medium. Confidence: 100.

### F-C5 — SKILL.md CORRECTION block at L66 still cites "line 241"
- L66 says "The original lock at line 241 ('Mode controls user gates; it does not relax the workflow.') has been superseded..." — that lock was at line 241 of HEAD~3 (pre-refactor). Post-T8 deletion, it no longer sits at L241 (current L241 is canonical-tree text). The quoted phrase is verbatim so the reader can `grep`, but the "line 241" pointer is stale.
- Severity: Low. Confidence: 90 (file diff confirms).

### F-C6 — Inter-loop transition table deletion is clean
- The old "### Inter-loop transition" section (HEAD~3 lines 233-244) has been removed from SKILL.md. The 3-row mode-context table that was added in 6c72793 is now folded into the per-mode docs' Step rows (via "ITER / EXIT" verbiage). No orphan section in SKILL.md. ✓

### F-C7 — Mirror symlinks intact
- `.claude/skills/orchestration/{SKILL.md, chat-mode.md, auto-mode.md}` — all 3 symlink to `.gobbi/projects/gobbi/skills/orchestration/`. Verified via `ls -la`. ✓
- `plugins/gobbi/skills/orchestration/` does NOT exist — but the plugins directory itself does not exist at the worktree. Out of T8's scope; not a regression.

## Verdict
**REVISE.** F-C4 (`#iteration-caps` broken anchor) is a clear consistency defect that survives the refactor. F-C5 is a stale-line-number pointer that costs a reader 5 seconds. Other consistency checks PASS.

## Must-Preserve
- Re-numbering chain in auto-mode (5 internal refs).
- Per-task slice term-lock at chat L70.
- Mirror symlinks at `.claude/skills/orchestration/`.
