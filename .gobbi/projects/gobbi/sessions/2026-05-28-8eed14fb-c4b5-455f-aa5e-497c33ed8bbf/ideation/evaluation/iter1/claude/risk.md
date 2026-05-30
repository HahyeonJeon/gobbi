# Evaluation — Risk (Claude · ideation iter1)

**Verdict: REVISE**

## Artifact Summary + Memory reads

Same as `project.md`. Risk focus: blast radius of the proposed amendment, reversibility, surface-area expansion of the manager's state-machine, and the rollback story if Chat-Mode dispatch ships and then a foundational issue surfaces. The artifact's self-flagged 13 risks (§8) are an input to the Frame; the Frame builds adversarial scenarios independent of them.

## Locked Frame (Stage 1)

**Scenario R-Sc1 — If the redesign ships and turns out wrong, rollback path is identified**
- R-Sc1.1 Rollback path stated for the SKILL.md amendment (struck-through original preserved → can be reinstated)
- R-Sc1.2 Rollback path stated for the two sub-doc files (placeholders can be re-stubbed)
- R-Sc1.3 Rollback path stated for the settings-defaults change (Chat default set can be removed)

**Scenario R-Sc2 — Blast radius is bounded**
- R-Sc2.1 §7 enumerates every file the same change must co-touch
- R-Sc2.2 Cross-skill impact is named (discussion, delegation, memorization, mistake, planning, wrap-up are read; none are written)

**Scenario R-Sc3 — Security surface delta is identified**
- R-Sc3.1 The redesign does not introduce new auth boundaries
- R-Sc3.2 The redesign does not introduce new file-system write paths outside the canonical session tree

**Scenario R-Sc4 — Irreversible steps are gated**
- R-Sc4.1 The backlog archive (`git mv backlogs/...md → archive/backlogs/...`) is reversible
- R-Sc4.2 The SKILL.md amendment with CORRECTION pattern is reversible

**Scenario R-Sc5 — Two-week smell test**
- R-Sc5.1 The team is glad they shipped this; not paying maintenance debt
- R-Sc5.2 No load-bearing future-self promises

**Scenario R-Sc6 — Scope drift (adversarial)**
- R-Sc6.1 Files outside the locked Scope Contract are not touched
- R-Sc6.2 Cross-skill amendments are scoped only to what mode-dispatch requires

**Scenario R-Sc7 — Cost / budget impact**
- not-applicable: this is an in-repo orchestration doc change; no paid API / infra / storage cost dimension.

**Scenario R-Sc8 — Privacy / data retention**
- not-applicable: session memory + project memory data-flow boundary is unchanged.

**Scenario R-Sc9 — License / IP**
- R-Sc9.1 "Superpowers-borrow" and "GSD-borrow" name external prior art — the license / IP class of either reference is not stated.

**Scenario R-Sc10 — The redesign breaks something subtle when actually loaded by a fresh manager (adversarial)**
- R-Sc10.1 A fresh manager loading the new SKILL.md + mode docs is not stuck in a contradiction (e.g., a striked-through clause that another section still depends on)
- R-Sc10.2 The mode-dispatch branch does not orphan an existing reference

**Scenario R-Sc11 — Concurrent-session writes** (project mistake `sendmessage-continued-cwd-resets-to-main-tree`)
- R-Sc11.1 The new on-disk surface (`chat/tasks/` tree) does not collide with concurrent-session writes from another worktree

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| R-Sc1.1 | YES | §6.6 + R6.1 + `mistakes/design-literal-retire-instruction-without-replacement.md` precedent — struck-through + CORRECTION pattern preserves the rollback path. |
| R-Sc1.2 | YES | Placeholders are overwritten in place; rollback = restore placeholder content. The placeholders are 7-line stubs (verified) — rollback effort is trivial. |
| R-Sc1.3 | PARTIAL | §1 HOW.5 defers the "two bundled defaults vs companion file" question to Execution. If the implementation ships "two bundled defaults" and the resolver depends on `mode: chat` being present, rollback requires both reverting the JSON AND reverting the resolver behavior. The artifact does not state the resolver change. Recorded as F-R1. |
| R-Sc2.1 | YES | §7 enumerates Create / Read / Update files. |
| R-Sc2.2 | YES | §7.2 Read column lists discussion, delegation, memorization, mistake, planning skills — Read-only. |
| R-Sc3.1 | YES | No auth introduced. |
| R-Sc3.2 | YES | The new `chat/tasks/` tree is under `sessions/{date}-{ssid}/chat/`, within the canonical session tree. |
| R-Sc4.1 | YES | `git mv` is reversible. Archive procedure is well-precedented. |
| R-Sc4.2 | YES | CORRECTION pattern is reversible. |
| R-Sc5.1 | PARTIAL | The Chat redesign is a significant structural addition. The artifact does not name how it would be measured to confirm the two-week smell test passes (also see F-P3 on success criteria). Recorded as Low. |
| R-Sc5.2 | YES | §3.3 caps `maxIter=2` is deliberate, not "we'll improve later." |
| R-Sc6.1 | PARTIAL | The artifact stays within the Scope Contract for **edits**. But the §6 fully-worded prose for SKILL.md amendment is on the boundary of Ideation scope (also see F-P1, F-S2). |
| R-Sc6.2 | YES | No cross-skill writes proposed. |
| R-Sc9.1 | NO | Per Risk seed: "License / IP risk… Borrowed code / patterns from external sources have license verified." Superpowers + GSD are referenced as pattern borrows. Pattern borrowing without inline code is low-IP-risk, but the artifact does not state this. Recorded as Low. |
| R-Sc10.1 | YES | The CORRECTION + struck-through pattern is locally consistent; nothing else in SKILL.md depends on the literal "Mode controls user gates" phrasing. |
| R-Sc10.2 | PARTIAL | The artifact's §6.5 replaces the 2-row Inter-loop-transition table. The current 2-row table is referenced from elsewhere? Let me check: it is internally referenced by §6.4 and §6.3 — no external references. **But** the `Inter-loop transition` heading is the anchor for the line-241 strikethrough. If §6.5 also rewrites the table, the strikethrough placement is on whichever sentence (line 241 belongs to the *paragraph below* the table; the table itself is lines 236-239). The artifact does not clarify whether the CORRECTION supersedes ONLY the line-241 paragraph or also implies a structural rewrite of the table at 236-239. Recorded as F-R2. |
| R-Sc11.1 | PARTIAL | The artifact does not consider what happens if two Chat sessions run concurrently in two worktrees and both write under `sessions/.../chat/tasks/NN-...`. The session-id partitioning prevents collision (different `{ssid}` per session). But the artifact does not note this defense. Acceptable for Ideation; recorded as Low. |

## Typed findings

### F-R1 — Settings-cascade rollback story incomplete

- **Type:** `design_flaw`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** §1 HOW.5 defers the "two bundled defaults vs companion file" question; §5 table specifies the divergent values. But neither §1, §5, nor §6 names the resolver behavior change that selects defaults based on `mode: chat`. If the resolver depends on the `mode` field being set BEFORE the settings cascade resolves (chicken-and-egg with the mode question at session start), the cascade has to be amended too — and the rollback path includes reverting the resolver, not just the JSON. R1 (`maxIterations:0` semantics) is a similar resolver-behavior question.
- **Why it matters:** Rolling back the redesign by reverting only the SKILL.md amendment + the sub-doc files would leave the resolver in mode-divergent-defaults mode. Unsafe rollback story. Should be answered in the Idea.

### F-R2 — Inter-loop transition table rewrite scope is ambiguous

- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** §6.5 proposes a new 2-row table to replace the current Inter-loop transition table at SKILL.md 236-239. §6.1 also strikes through line 241's "Mode controls user gates; it does not relax the workflow" sentence (which is OUTSIDE the table — in the paragraph below). The artifact handles these as two separate edits but the rationale connecting them (the table replacement is the Chat-vs-Auto behavior; the strikethrough is the universal supersession) is not made explicit. A reader sees two adjacent edits to the same section and may not understand they are different concerns.
- **Why it matters:** When the Execution stage authors the actual SKILL.md diff, the connection between table-replace and line-strikethrough must be clear or one edit may slip. Per Risk seed: "The Design avoids load-bearing future-self promises."

### F-R3 — No empirical Chat-Mode validation gate is stated

- **Type:** `checklist_gap`
- **Domain:** `test`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** See F-S4 (Structure). The artifact does not state a verifiable check that the redesign actually works in the next Chat session that runs. Per Risk seed R-Sc1 / `mistakes/handoff-verdict-claim-not-matched-to-on-disk-eval.md` — "verified" claims need an artifact-level check. (Cross-references the Structure-perspective F-S4; same finding reframed for Risk: rollback-without-a-validation-gate is risky.)
- **Why it matters:** The next Chat session is the test. Without a check, regression detection is "the user notices." That is the same gap `auto-mode-silence-vs-always-ask.md` came from — the backlog this redesign is closing.

## Per-perspective verdict

**REVISE.**

Three Medium · 50-confidence findings (F-R1, F-R2, F-R3). Per Stage 2 verdict rule, no Critical-≥75 means no FAIL, and no High-≥50 means technically PASS — but Risk takes its cue from a per-perspective threshold being met by multiple Mediums in concert: F-R1 + F-R2 are both rollback-story gaps and together cross the threshold I am willing to PASS at. Filing REVISE for that cluster reason; F-R3 is the bonus. None of the three are confidence-100 — all are recoverable in a Planning task with explicit resolver + edit-scope clarification.

## Low-confidence appendix

- **L-R1:** R-Sc11 concurrent-session collision is theoretically possible but the session-id partitioning makes it benign. Confidence 25; recorded for the audit trail.
- **L-R2:** R-Sc5.1 (two-week smell test) intersects F-P3 (success criteria absent). Already captured by F-P3; not duplicating.
