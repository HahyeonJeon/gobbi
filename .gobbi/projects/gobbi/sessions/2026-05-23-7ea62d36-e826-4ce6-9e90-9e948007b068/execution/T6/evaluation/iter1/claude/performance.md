# Performance — T06 codex skill content

## Artifact Summary
Same as project.md.

## Locked Frame (Stage 1)

Performance lens — for a docs artifact, "performance" reduces to: agent-cost-to-load (length / token budget), agent-cost-to-act (Section 7 cost guidance), and hot-path token discipline.

- **S-Pf-1** Length is within the cost envelope brief contracted (300-500 LoC).
- **S-Pf-2** Section 7 (Cost + sandbox budget awareness) actually addresses cost — effort multiplier, model selection default, timeout bound for runaway prevention.
- **S-Pf-3 (adversarial)** Repetition / token padding — does the skill restate the same idea N times without value-add?
- **S-Pf-4** Hot-path verification commands (post-eval find, file-existence checks) are concrete and runnable.

## Stage 2 — Per-check evidence

- S-Pf-1 ✓ 386 lines, within 350-450 target plus 50-line tolerance the verifies clause allowed (300-500).
- S-Pf-2 ✓ Section 7 covers all four cost vectors: effort multiplier (line 327), model default (331), sandbox blast radius (336), timeout bound (342). The "When to use codex vs claude" table (320-324) is a separate cost-direction signal — also relevant.
- S-Pf-3 Mild repetition between Section 2(d) (notification timing prose) and Section 5 (foreground/background table). See structure F-S-01. Other than that, each section earns its tokens.
- S-Pf-4 ✓ Section 4 post-eval find command (lines 175-177) + Section 5 file-existence + grep block (lines 234-237) are concrete commands a reader can copy-paste.

## New findings

### F-Pf-01 — Repetition across Section 2(d) and Section 5 on the same notification-timing concept
- Type: `general` | Domain: `cost` | Disposition: `open` | Confidence: 50 | Severity: Low
- Evidence: Section 2(d) lines 70-72 + Section 5 lines 202-215 both narrate the harness lazy-notification behavior. Skills are loaded into agent context — every duplicate paragraph is a token-cost multiplier across every load. ~25-line overlap.
- Why it matters: Cost discipline at load-time. Not blocking; small.
- Suggested direction: Consolidate the narrative into Section 5 and have Section 2(d) link to it rather than re-narrate.

## Verdict
- Critical/≥75: 0; High/≥50: 0
- **Performance verdict: PASS.**
