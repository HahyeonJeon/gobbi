# Evaluation — Structure (Claude · ideation iter2)

**Verdict: PASS**

## Artifact Summary + W/W/H

Same artifact as project.md. Structure focus: sub-doc decomposition coherence; mode-dispatch branch placement; mini-loop reduction precision; per-task state-table presence; per-task layout vs Execution quartet collision; smoke-test gate.

## Locked Frame (Stage 1)

Inherited iter1 Structure findings:

| iter1 ID | Sev/Conf | Iter2 disposition prediction |
|---|---|---|
| F-S1 (auth-direction rule) | Med/50 | likely `deferred` to Planning |
| F-S2 (per-task state-transition table) | Med/75 | partial-addressed (deferred-to-chat-mode.md authoring) |
| F-S3 (Chat per-task layout vs Execution quartet) | High/75 | likely `deferred` (Bucket B #7) |
| F-S4 (smoke-test gate) | Med/50 | likely `addressed` |
| codex-struct-2e4a90bc (placeholders/symlinks don't exist) | High/100 | `disputed (false positive)` — verified worktree-only |
| codex-struct-91cf42d0 (default-set bootstrap path) | High/75 | addressed (§6.2 — dispatch at Step-1 completion, after mode question) |
| codex-struct-6f11d0e9 (template edits absent from CRUD) | Med/75 | `addressed` (§6.7 + §7.3 enumerate templates) |
| L-S1 (two bundled default sets vs companion file) | Low/25 | `partially addressed` |

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| S1.1 (single-concern ownership) | YES | §1 WHAT.1 / WHAT.2 — sub-docs own per-mode spec; SKILL.md stays governor. |
| S1.2 (unidirectional coupling) | PARTIAL | F-S1 still open. §8.3 disposition `deferred` to Planning with suggested rule "SKILL authoritative on workflow contracts; mode docs authoritative on per-mode specs; conflicts resolve in favor of the more specific doc." Fair deferral, but the rule itself is not yet locked in iter2. |
| S2.1 (single branch point at Step-1 completion) | YES | §6.2 explicit; addresses codex-struct-91cf42d0. |
| S2.2 (declared in SKILL.md, specified in sub-docs) | YES | §6.2 final line. |
| S3.1 (mini defined narrowly) | YES | §1 HOW.4 + §3.4 + §6 unchanged from iter1. |
| S3.2 (no rigor reduction) | YES | §3.3 R5 canonical statement: "every loop's MEMORIZATION runs after every EVALUATION verdict; it is never skipped." |
| S3.3 (per-task slice state-transition table locatable) | PARTIAL | §8.3 F-S2 disposition `addressed (deferred to chat-mode.md authoring)`. iter2 §6.3 ends with "chat-mode.md owns the full Chat rendering spec including at least one worked example…" The state-table itself is not in the Idea doc; it is mandated for chat-mode.md. This is a fair Ideation→Execution boundary handling but Planning must enforce. |
| S4.2 (Chat per-task layout vs Execution quartet) | NO | F-S3 disposition `deferred` to Planning (Bucket B Finding #7). The collision still survives. Per user-locked Bucket A scope, this is correctly deferred — verified deferred-not-dropped. |
| S5.1 (sub-doc pattern parallel) | YES | §1 HOW.1 unchanged from iter1. |
| S5.2 (ADR CORRECTION matches precedent) | YES | §1 HOW.2 + §6.1 cite the precedent mistake. |
| S6.1 (two-week smell test) | YES | §2 Success Criteria #7 is the falsifying observation — addresses the smell-test gap. |
| S7.1 (smoke-test gate present) | YES | §2 Success Criteria items 1-5 give concrete verifiable gates: `find -L`, `grep -n CORRECTION`, `jq '.workflow.chat.tasks | length'`, post-merge task-record presence, FAIL-noise check. Addresses F-S4. |
| S9.1 (per-task layout collision resolved) | NO | F-S3 deferred. |
| S9.2 (ordinal depth) | YES | R4 / §8.4 documented. |
| New: workflow.chat.tasks[] schema additivity | YES | §6.7 explicit: existing `workflow.{loop}` shape stays unchanged for Auto; `workflow.chat.tasks[]` is additive. Schema spelled out with sub-records and template-update rows in §7.3. |

## Typed findings

### F-S-new-1 — §6.3 Chat rendering "Step {step-in-slice} of 4" definition tension
- **Type:** `design_flaw`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Medium
- **Evidence:** §6.3 header form "Workflow Status — Mode: chat — Active: Task {NN} — {step-in-slice} of 4 (where 4 is the per-task slice's structural length: Step 2 + Step 4 + Step 5 + task-record; Step 3 renders as `⊘ Skipped` when default)." Step 3 (Preparation) is structurally part of the slice per §3.2 diagram (the diagram shows Step 2 → Step 3 → Step 4 → Step 5 with Step 3 as Skipped). The "of 4" count silently excludes Step 3, but the per-task tier sub-table in body form is described as "Step 2 / Step 3 / Step 4 / Step 5 / task-record" — that's 5 rows. Either the denominator is wrong (should be 5, with Step 3 Skipped counted toward the total) or the sub-table is wrong (should show 4 rows when Skipped). The reader can disambiguate but a downstream chat-mode.md author may pick the wrong shape.
- **Why it matters:** Display contract ambiguity; planning + execution author need to lock the denominator semantics. Inherited-but-refined F-U4 / R3 territory.

### F-S-new-2 — Schema additivity: `workflow.chat` field exists in templates regardless of mode
- **Type:** `assumption_risk`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 25
- **Severity:** Low
- **Evidence:** §6.7 says "Both Chat and Auto sessions ship the same templates; an Auto session leaves `workflow.chat.tasks: []` empty." Empty-array vs absent-key conventions are not universal — some consumers may treat empty array as a Chat-session signal. This is a minor schema-shape concern; iter2's choice is defensible but worth flagging.

## Inherited-finding dispositions

| iter1 | iter2 disp | Verified |
|---|---|---|
| F-S1 | deferred | YES — §8.3 explicit |
| F-S2 | addressed (chat-mode.md authoring mandate) | YES — §6.3 + §7.3 row for chat-mode.md require state-table + worked example |
| F-S3 | deferred (Bucket B #7) | YES — §8.2 row 7 |
| F-S4 | addressed | YES — §2 Success Criteria smoke-test gates |
| codex-struct-2e4a90bc | disputed | YES — I re-ran `ls -la`; both placeholders + symlinks present in worktree |
| codex-struct-91cf42d0 | addressed | YES — §6.2 single Step-1-completion branch |
| codex-struct-6f11d0e9 | addressed | YES — §7.3 has rows for state.template.json + session.template.json |
| L-S1 | partially addressed | YES — §1 HOW.5 + §6.2 lock "two bundled default sets, mode-keyed selection at Step-1 completion"; on-disk packaging still a Planning tactical decision |

## Per-perspective verdict

**PASS.** All Bucket A Structure-relevant claims evidenced. F-S3 (High) is the only deferred-to-Planning Bucket B item that is genuinely structural rather than tactical — but the user explicitly deferred it, so disposition `deferred` is the right answer here. F-S-new-1 is Medium/50 but does not meet the REVISE threshold (no Critical-100; no High-50+). PASS.

## Low-confidence appendix

- **L-S-new-1:** The §6.7 schema example uses `taskRecord: { path, writtenAt }` but the §3.5 spec uses `Path` and `Writer` fields without a `writtenAt` analog. Minor field-naming inconsistency; confidence 25.
