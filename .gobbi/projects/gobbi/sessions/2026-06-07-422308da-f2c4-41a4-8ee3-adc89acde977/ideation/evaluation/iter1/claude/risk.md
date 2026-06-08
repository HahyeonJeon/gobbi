# Risk — Ideation Idea: Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads
(See project.md for Stage-0 summary + memory reads.)

## Locked Frame (Stage 1)

**S1 — Blast radius of the docs change is bounded to the 3-file scope**
- [ ] No edit reaches a file outside the contract
- [ ] Downstream pointers into the edited sections are accounted for

**S2 — The CLAUDE.md edit does not silently weaken a behavioral safeguard**
- [ ] "Never auto-apply" decision-class protection survives
- [ ] No Auto-mode interrupt for Always-Ask findings is lost

**S3 — Rollback is trivial (docs revert)**
- [ ] Change is reversible without coordination

**S4 (adversarial) — "It's just a docs change" hides blast radius through MUST-load directives**
- [ ] CLAUDE.md is a session-start MUST-load; a wording change propagates to every future session/agent
- [ ] The change does not introduce an over-broad prohibition that mis-fires in a legitimate case

**S5 (adversarial) — The new prohibition forbids the legitimate post-failure "claude-only" fallback**
- [ ] §X.1 forbids only the PRE-evaluation question, not the degraded-mode fallback

## Per-scenario per-check results

**S1** — REVISE (see cross-ref F2). Blast radius is bounded ONLY if trailing-append is chosen. The primary design (§4-insert + renumber) reaches OUT to `orchestration/SKILL.md:266` (the §3/§6 pointer) — i.e., the design body's chosen path exceeds the 3-file scope. The locked option keeps blast radius inside the 3 files. The risk is that the design carries the over-reaching option as primary.

**S2** — PASS. The CLAUDE.md mode-split preserves the "never auto-apply" decision-class safeguard and preserves Auto's Always-Ask interrupt (§X.3 line 103: "only Always-Ask findings interrupt mid-loop"). No safeguard lost. The degraded-mode fallback is preserved. (verified against lines 103, 143, 187)

**S3** — PASS. Pure docs change; rollback is a git revert with no coordination, no data migration, no irreversible step. (verified)

**S4** — PASS with note. The design correctly anticipates the "it's just docs" trap: CLAUDE.md is a session-start MUST-load (CLAUDE.md line 5), so the Evaluation-blockquote edit propagates to every future Auto AND Chat session. The mode-split is the right shape because it scopes each behavior to its mode rather than issuing one over-broad rule. I checked for over-broad mis-fire: §X.1's "MUST NOT ask whether to evaluate" is correctly carved to exclude the degraded-mode fallback (see S5). No mis-fire found. (verified)

**S5** — PASS. §X.1 (line 97) forbids the PRE-evaluation "dual-system/claude-only/skip" question and explicitly preserves "claude-only" as the post-failure degraded-mode fallback in `workflow/evaluation.md § Degraded-mode policy` (I verified that policy at evaluation.md:188-199: reached only after a system fails + retry fails, gated by its own stop-the-line AskUserQuestion). The carve-out is precise. The Idea's File-2 U edit (line 131) reinforces it at the source. Good. (verified)

## Typed findings

### F10 — Primary design path exceeds the 3-file blast radius (scope-breach risk via renumber)
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** Idea line 92 chooses §4-insert+renumber as primary; line 173 documents this "forces an out-of-scope edit to `orchestration/SKILL.md`." Verified the live pointer at SKILL.md:266. Per the brief, a design that forces editing another file is a scope-breach.
- **Why it matters:** Risk/blast-radius: the design-of-record path reaches outside the contract. While F1/F6/F9 frame this as a locked-decision and consistency problem, the Risk lens records it as a blast-radius breach: the chosen path mutates a 4th file. Distinct remediation framing (bound the blast radius) vs F1 (honor the lock) — but same underlying defect; severity Medium here since the design also flags it and the safe option exists.
- **Suggested direction:** Adopt trailing-append; blast radius then = 3 files exactly, zero downstream pointer edits.

## Low-confidence appendix
(none)

## Verdict: PASS
