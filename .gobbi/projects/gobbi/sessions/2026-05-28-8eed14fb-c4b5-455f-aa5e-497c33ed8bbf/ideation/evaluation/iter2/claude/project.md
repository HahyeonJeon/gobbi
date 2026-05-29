# Evaluation — Project (Claude · ideation iter2)

**Verdict: PASS**

## Artifact Summary + W/W/H

iter2 draft (640 lines) of the Chat Mode + Auto Mode redesign Idea doc. Section numbering inherited from iter1; surgical edits target Bucket A (Findings #1 / #2 / #3 — Chat MEMORIZATION canonical statement, Scope Contract schema conformance, promote R1 / R2+R3 / R5). Bucket B/C/D findings deferred to Planning. WHAT (canonical chat-mode.md + auto-mode.md + SKILL.md ADR-style amendment + cascading edits), WHY (two open backlogs + SKILL.md 241-242 lock structurally incompatible), HOW (sub-document the two modes, supersede the global lock, encode mode-dispatched state machine, codify mini Plan/Exec, Always-Ask codification, per-task task-record, discuss-first) — all preserved from iter1, refined per user-locked R1/R2/R3/R5.

W/W/H clarity: present, refined, no Stage-0 gate finding.

## Locked Frame (Stage 1)

Inherited iter1 Project findings (Claude + Codex):

| # | iter1 ID | Sev/Conf (iter1) | Iter2 disposition prediction |
|---|---|---|---|
| 1 | F-P1 (over-spec of Execution prose in §6.1/§6.6) | Med/75 | Likely `addressed` |
| 2 | F-P2 (counterfactual not steel-manned) | Med/75 | Likely `disputed` (brief-lock) |
| 3 | F-P3 (success criteria not observable) | Med/75 | Likely `addressed` |
| 4 | F-P4 (re-framing check unrecorded) | Low/50 | `noted` |
| 5 | F-P5 (Superpowers/GSD reference paths) | Low/50 | `noted` |
| 6 | codex-proj-a13f0c91 (Scope Contract schema absent) | High/75 | Likely `addressed` (Bucket A #2) |
| 7 | codex-proj-b4709e42 (open-vs-closed backlog drift) | Med/75 | Likely `addressed` |

Frame scenarios (inherited + new): P1 root cause; P2 Scope Contract sharpness; P3 trigger concreteness; P4 counterfactual steel-man; P5 re-framing; P8 testability; P10 scope drift; **P11 (new)** — Bucket A claims are evidenced in body, not just in §8 disposition table.

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| P1.1 (two backlogs frame the problem cited) | YES | §1 WHY links both, `status: active` / `disposition: open` (matches on-disk). |
| P1.2 (SKILL 241-242 lock verified) | YES | I re-verified worktree SKILL.md:241 reads the exact text iter2 §6.1 cites. |
| P2.1 (deliverable matches In-Scope) | YES | §2 In-Scope explicitly says "produce this Idea doc" only. §6 hoisted to shape-only per F-P1; verified §6.1 says "Strike through… Append ADR-style CORRECTION annotation… The annotation must convey four facts: …" — these are shape items, not prose. §6.6 says "iter1's §6.6 verbatim blockquote is illustrative; Execution authors the final prose." |
| P2.2 (Out-of-Scope enumerated, not "etc.") | YES | §2 Out-of-Scope explicitly lists 6 items including the prose boundary clarification. |
| P2.3 (9 decisions restated, no re-litigation; R1/R2/R3/R5 promoted) | YES | §2 Decisions Locked has both tables — original 9 plus R1/R2/R3/R5 with body-location pointers. |
| P3.1 (backlogs dated, anchored) | YES | §1 WHY now states "created 2026-05-23, currently status: active / disposition: open" — codex-cons-8d66ab12 / codex-aes-3d91be4a both `addressed`. |
| P3.2 (line-241 lock concretely incompatible) | YES | §1 WHY argues "Chat Mode now skips Preparation by default and reshapes Planning + Execution into mini-loops per-task — that IS the workflow shape changing." |
| P4.1 (counterfactual steel-manned) | NO | §8.3 F-P2 disposition `disputed` with rationale "brief locked the direction; the user-decided counterfactual choice is captured in the brief, not re-derivable here." This is a fair `disputed` — the user explicitly told iter2 not to re-litigate. Acceptable but the residual gap survives as a disposition, not a fix. |
| P4.2 (no straw counterfactual) | YES |  |
| P5.1 (re-framing check) | NO | §8.3 F-P4 `noted`. Same rationale as P4.1. |
| P8.1 (observable success criteria) | YES | §2 Success Criteria — 7 numbered items, items 1, 2, 4, 5, 6 are concrete shell commands (`find -L`, `grep -n`, `jq`, file-presence). Item 7 is a falsifier ("if a fresh reader cannot describe the per-task slice shape from chat-mode.md alone, the redesign failed"). |
| P8.2 (falsifying signal) | YES | Item 7. |
| P10.1 (no writes to SKILL.md / mode files / settings JSON in this loop) | YES | §2 Out-of-Scope row "Editing orchestration/SKILL.md directly during this loop." |
| P10.2 (no verbatim Execution-stage prose for the SKILL amendment) | YES | §6.1 retitled "shape only"; the four-fact bullet list specifies the annotation's structural intent without verbatim wording. §6.6 explicitly says "Execution authors the final prose." |
| P11 (Bucket A claims evidenced in body) | YES | Verified §3.3 has the single canonical MEMORIZATION statement (R5 promoted); §3.2 diagram + §5 + §6.2 carry R1 `0 → Skipped` (state-machine layer; no new field); §5 + §6.7 + §7.3 enumerate `workflow.chat.tasks[]` array-of-slices schema with template updates. |

## Typed findings

### F-P-new-1 — §6.1 "Strike through… Append CORRECTION annotation" instruction may still be too prescriptive
- **Type:** `general`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 25
- **Severity:** Low
- **Evidence:** §6.1 says "Strike through the second sentence… Append an ADR-style CORRECTION annotation immediately after the strikethrough." This is editorial direction ("strike through", "append"); arguably borderline-prescriptive even though no verbatim wording is given. The four facts the annotation must convey are listed, but the rendering medium (markdown strikethrough syntax, exact wording of the strikethrough markers) is implicit. This is mild residual over-spec at the Markdown-mechanics layer; Execution may want freedom to use a different annotation style.
- **Why it matters:** Boundary cleanup. Acceptable in iter2 as "shape" but Planning's evaluator should re-confirm the boundary is right.

## Inherited-finding dispositions

| iter1 finding | iter2 disposition | Verified |
|---|---|---|
| F-P1 (over-spec) | addressed | YES — §6 reframed shape-only |
| F-P2 (counterfactual) | disputed | YES — brief lock |
| F-P3 (success criteria) | addressed | YES — §2 Success Criteria |
| F-P4 (re-framing) | noted | YES — out of scope per brief |
| F-P5 (Superpowers/GSD paths) | noted | YES — deferred |
| codex-proj-a13f0c91 (canonical schema) | addressed | YES — §2 five required body sections present (`### In-Scope/Out-of-Scope/Decisions Locked/Success Criteria/Deferred`); frontmatter has artifact_type/feature/goal/created-by/created-at |
| codex-proj-b4709e42 (open-vs-closed drift) | addressed | YES — §1 WHY clarified |

## Per-perspective verdict

**PASS.** All Bucket A High-severity Project findings (`codex-proj-a13f0c91`, F-P3) are evidenced as addressed in body. F-P1's "over-spec of Execution prose" gap is genuinely closed at §6.1 + §6.6 (verbatim wording moved to "shape only" with explicit "Execution authors the final prose" disclaimer). F-P2 / F-P4 / F-P5 disposition as `disputed` / `noted` is defensible — the brief locked the direction and disallowed re-litigation. One Low Confidence-25 residual (F-P-new-1) but does not move verdict.

## Low-confidence appendix

- **L-P-1:** §2 frontmatter lacks the leading `---` / `---` YAML fence (the schema example in evaluation/SKILL.md uses fenced YAML). iter2 §2 uses a fenced code block (` ```yaml ... ``` `) which is functionally equivalent for an Idea-doc rawdata context but technically the canonical schema is "Artifact frontmatter (required)" — not a code block. Confidence 25; pedantic.
- **L-P-2:** §2 uses `### In-Scope` (H3) because §2 itself is H2. The schema example shows `## In-Scope` (H2). Defensible interpretation; confidence 25.
