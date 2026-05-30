# Evaluation — Project (Claude · ideation iter1)

**Verdict: REVISE**

## Artifact Summary + Memory reads

**Artifact under evaluation:** `sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md` — an Idea doc for redesigning Chat Mode + adjusting Auto Mode in the gobbi `orchestration` skill.

- **What:** specification (memo) for three artifacts — `orchestration/chat-mode.md`, `orchestration/auto-mode.md`, and an amendment delta to `orchestration/SKILL.md` — plus cascading edits. Authoring deferred to Execution.
- **Why:** two open backlogs (`chat-mode-tiki-taka-redesign.md`, `auto-mode-silence-vs-always-ask.md`) name the friction; the SKILL.md global lock at ~line 241 is structurally incompatible with the user-ratified mode-dispatched workflow.
- **How:** sub-document each mode; replace the global lock with a documented supersession; encode mode-dispatched state machine; define mini Planning/Execution loops; same settings schema with divergent defaults; codify Always-Ask in Auto; per-task `task-record.md`; explicit Wrap-up trigger in Chat.

**Scope Contract source:** §2 of the artifact itself (this is an Ideation iter1).

**Memory reads (Stage 0 / Stage 1):**
- `/playinganalytics/git/gobbi/.claude/skills/evaluation/SKILL.md` (perspectives, scoring, schema)
- `/playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/ideation.md` (phase contract for the loop being evaluated)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/ideation/evaluation.md` (Project perspective seed scenarios)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (target of amendment — lines 60-90, 230-292, 380-420)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/templates/{settings.default.json,session.template.json,state.template.json}` (defaults + state shape verification)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/{chat-mode.md,auto-mode.md}` (placeholder files exist in worktree, NOT in main project skills dir)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/discussion/SKILL.md` (Decision Classification §125+, Always-Ask §140+)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/memorization/rules.md` (§1.3 slug naming — task-01 is anti-pattern)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/backlogs/{chat-mode-tiki-taka-redesign.md,auto-mode-silence-vs-always-ask.md}` (real, both `status: active`, `disposition: open`)
- Project mistakes scanned: `design-literal-retire-instruction-without-replacement.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`

W/W/H clarity verdict: **What / Why / How all clearly stated** — no Stage-0 W/W/H gate finding.

## Locked Frame (Stage 1)

**Scenario P1 — The root cause the artifact claims to address is the actual root cause, not a symptom**
- P1.1 Both backlog witnesses (chat-mode-tiki-taka, auto-mode-silence) actually exist and frame the problem the artifact claims they frame
- P1.2 The SKILL.md line-241 "Mode controls user gates; it does not relax the workflow" claim is verifiable at the cited lines
- P1.3 The artifact does not solve a different problem than the two backlogs surface

**Scenario P2 — Scope Contract sharp enough that an Executor can refuse out-of-scope tasks**
- P2.1 §2 "In-scope artifact: this Idea doc only" matches the actual deliverable (no other files written)
- P2.2 Out-of-Scope items in §2 are enumerated, not "etc."
- P2.3 The 9 pre-resolved decisions are listed without re-litigation

**Scenario P3 — The "Why now?" trigger is concrete**
- P3.1 The two backlogs are dated and have anchor sessions
- P3.2 The line-241 lock is presented as concretely incompatible with the user-ratified Chat shape (not "feels wrong")

**Scenario P4 — Counterfactual (steel-man for not doing this) is taken seriously (adversarial)**
- P4.1 The artifact considers "leave SKILL.md lock in place" (the do-nothing option) and gives a reason it fails
- P4.2 No straw counterfactual

**Scenario P5 — Re-framing check produced a confirmed re-frame OR defensible "no change"**
- P5.1 The re-framing check outcome is stated
- P5.2 Re-framing rationale is defensible

**Scenario P6 — An adjacent feature/scope absorbs this idea quietly (adversarial)**
- P6.1 The work checks against existing `orchestration/` workflow sub-docs (Ideation, Preparation, …) — no silent overlap
- P6.2 If overlap exists, the scope split/merge is explicit

**Scenario P7 — Risky premises have assumption-ledger entries**
- P7.1 The Chat-Mode shape (skip Preparation, mini Plan, mini Execution) names load-bearing assumptions
- P7.2 Each assumption either cites evidence or is flagged `assumption_risk`

**Scenario P8 — Hypothesis / testability criteria are stated**
- P8.1 The artifact names observable signals that would confirm the Chat redesign worked
- P8.2 Falsifying signals are named

**Scenario P9 — Prior-art search was real, not nominal**
- P9.1 The artifact cites internal prior art (the existing `workflow/*.md` sub-docs)
- P9.2 External prior art (Superpowers, GSD-borrow) is named — pattern borrowing is identified

**Scenario P10 — Scope drift (adversarial) — does the deliverable stay within the In-scope axis ("this Idea doc only")?**
- P10.1 The artifact does not write to `orchestration/SKILL.md`, `chat-mode.md`, `auto-mode.md`, or settings files during this loop
- P10.2 The artifact does not pre-author Execution-stage prose for the cascading edits

## Per-scenario per-check results

| Check | Result | Evidence |
|---|---|---|
| P1.1 | YES | Read `backlogs/chat-mode-tiki-taka-redesign.md` (`status: active`, framed as needing "many discussions") and `backlogs/auto-mode-silence-vs-always-ask.md` (`status: active`, framed as "Always-Ask categories MUST trigger AskUserQuestion regardless of Auto Mode") — both exist with the framings the artifact cites. |
| P1.2 | YES | Worktree SKILL.md line 241 reads exactly: "In both modes, the manager NEVER skips `EVALUATION` (unless `evaluate.mode == 'skip'`) or `MEMORIZATION`. Mode controls user gates; it does not relax the workflow." The artifact's §6.1 quotes the second clause correctly. |
| P1.3 | YES | The artifact addresses exactly the two backlog frictions; no scope drift to unrelated topics. |
| P2.1 | PARTIAL | §2 says "In-scope artifact: this Idea doc only" and §1 WHAT lists "the deliverable is the specification. Final prose authoring lives in Execution." But §6 contains **prescriptive, near-final prose** for the CORRECTION block (§6.6, codeblock) and an amended sentence (§6.1, fully worded). This is on the boundary between specifying-what-to-write and pre-writing-the-Execution-output. Recorded as a Medium finding (FP1 below). |
| P2.2 | YES | §2 Out-of-Scope row enumerates: writing final prose, editing SKILL.md directly, changing defaults JSON, cross-skill edits beyond what mode-dispatch requires. |
| P2.3 | YES | The 9 decisions are restated in §2 table without re-litigation; §3-§5 elaborate consistent with them. |
| P3.1 | YES | Both backlogs carry `created: 2026-05-23` and `anchor_session` fields. |
| P3.2 | YES | §6.1 quotes the exact line-241 sentence and frames its incompatibility (Chat now skips Preparation + reshapes Plan/Execute → that is the workflow shape changing). Concrete, not vague. |
| P4.1 | PARTIAL | §1 WHY frames "leaving the lock in place produces design-instruction conflict the next time the SKILL is read end-to-end" — but this is a "leave-it-alone fails because A" framing, not a real steel-man of "the existing 6-step shape with explicit per-step asks is actually adequate for Chat." A maximally strong counterfactual would explore "what if Chat just adds three more AskUserQuestion gates inside the existing 6-step shape, without reshaping per-task." That alternative is not engaged. Recorded as Medium finding. |
| P4.2 | NO | The counterfactual is not explicitly modeled — see P4.1. |
| P5.1 | NO | The artifact does not record an explicit re-framing check outcome. The 9 pre-resolved decisions are accepted as locked but no Sub-step A six-forcing-questions trace is documented. The leader's brief said "no re-litigation"; that is acceptable, but the re-framing-check absence is still a gap relative to the ideation phase contract. Recorded as Low finding. |
| P5.2 | n/a |  |
| P6.1 | PARTIAL | §1 HOW cites the existing `workflow/*.md` sub-docs as the pattern being slotted into, but it does not check whether `chat-mode.md` / `auto-mode.md` as **mode** sub-docs (peers to `workflow/`) is the right home vs `workflow/modes/{chat,auto}.md` (sibling to the phase sub-docs). The current placeholders are at the skill root, not under `workflow/`. Recorded as Low. |
| P6.2 | YES | Where overlap exists with `discussion/SKILL.md § Decision Classification`, the artifact explicitly references-and-restates rather than duplicates. |
| P7.1 | YES | §8 lists 13 risks/assumptions, several of which are load-bearing (R1 `maxIterations:0`, R2/R3 session.json/state.json shape, R5 MEMORIZATION-narrowed contract). |
| P7.2 | PARTIAL | Most are flagged with "Planning verifies" — handling is "flag for Planning" rather than `assumption_risk` recorded at this loop. The handling is fine but the artifact does not explicitly tag them as Type=`assumption_risk` for downstream MEMORIZATION staging. Already-locked-by-decision risks (Chat user-friction at cap=2 = R7) are stylistically appropriate. |
| P8.1 | NO | The artifact does not state an observable signal that would confirm the Chat redesign worked (e.g., "next-session Chat user produces ≥3 per-task slices without re-asking for setup", or "mistake rate per loop drops vs current Chat sessions"). The success criteria are descriptive ("user gets a loop that matches how they work") not measurable. Recorded as Medium finding. |
| P8.2 | NO | No falsifying signal stated. Same finding as P8.1. |
| P9.1 | YES | The artifact identifies the existing `workflow/*.md` sub-docs as the parallel pattern (§1 HOW.1). |
| P9.2 | PARTIAL | "Superpowers-borrow" (discuss-first) and "GSD-borrow" (task-record) are named — but neither has a path/URL/reference an Executor can lift. Recorded as Low. |
| P10.1 | YES | I verified no writes to `orchestration/SKILL.md`, mode files, or settings JSON in this loop. |
| P10.2 | PARTIAL | The CORRECTION block in §6.6 is **fully-worded prose** that an Executor could `git mv` directly into SKILL.md. Same boundary issue as P2.1. |

## Typed findings

### F-P1 — Pre-resolved decision "no re-litigation" + "this Idea doc only" tension with §6 fully-worded prose

- **Type:** `design_flaw`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** §1 WHAT.1 "The deliverable is the **specification**. Final prose authoring lives in Execution." §6.1 then writes the proposed amended text verbatim ("~~Mode controls user gates...~~ **CORRECTION (2026-05-28...)** mode **dispatches the per-user-typed-task workflow shape**. Auto Mode runs the linear 6-step state machine...."). §6.6 writes the full CORRECTION blockquote verbatim. This is Execution-stage prose, not a specification. The risk is twofold: (a) downstream Execution loop has nothing to do — it copy-pastes, which trivialises evaluation of the actual prose-authoring step; (b) the Ideation evaluator (this loop) is being asked to grade prose quality that should be Execution-eval territory.
- **Why it matters:** Conflates the Ideation-vs-Execution split. The §2 Scope Contract explicitly excludes "writing final `chat-mode.md` / `auto-mode.md` prose; editing `orchestration/SKILL.md` directly." The §6 fully-worded amended text crosses this line for `orchestration/SKILL.md`. Either (a) it is Execution-stage prose that escaped the scope contract — drop confidence, leave Ideation with the **structural shape** of the amendment only — or (b) the artifact's intent was "specify exactly what to write," in which case the §2 Out-of-Scope phrasing should be revised. The current wording lets both readings pass, which is the ambiguity.

### F-P2 — Counterfactual is not steel-manned

- **Type:** `design_flaw`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** §1 WHY argues "leaving the lock in place produces design-instruction conflict the next time the SKILL is read end-to-end" — but the strongest counterfactual is not "leave the SKILL unchanged" — it is "keep the 6-step shape and lock; add three per-step AskUserQuestion gates inside it for Chat; codify Always-Ask in Auto via a single new paragraph; ship the same UX without the structural supersession." That alternative would satisfy both backlogs without amending the line-241 lock at all. The artifact does not engage this. The §1 framing treats user-ratification of the 9 decisions as the steel-man defeater, but a steel-man should be derived from the engineering counterfactual, not the user's prior consent — see Project perspective seed P4.
- **Why it matters:** Per `ideation/evaluation.md` Project seed P4: "Counterfactual that the creator already won → Steel-man failed. Re-derive counterfactual with the strongest possible 'do nothing' argument." The 9 decisions are user-ratified — that is sufficient authority to proceed, but it does not exempt the Ideation doc from engaging the steel-man as part of the rationale chain. The deferred-to-Planning audit trail loses the engineering-merit reasoning otherwise.

### F-P3 — Success criteria are not observable; falsification signal absent

- **Type:** `checklist_gap`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** §1 WHY closes with "User-value: the Chat-Mode user gets a conversational loop that matches how they actually work…" — value-prose, not a measurable signal. §2 Scope Contract does not state success criteria. No falsifying observation is named. Per Project seed P8: "Hypothesis / testability criteria are stated… 'Success' criteria are observation-level, not vibe-level."
- **Why it matters:** A future session cannot tell whether the redesign succeeded if the criterion is "feels right." This is the gap §1.3 (slug naming) of `memorization/rules.md` calls out as a smell pattern (`-vibe`-flavored). Planning should be able to derive a measurable acceptance criterion from this Idea; without one, Planning has to invent it (scope leak).

### F-P4 — Re-framing check (Ideation Sub-step A, question 6) outcome not recorded

- **Type:** `checklist_gap`
- **Domain:** `process`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Per `orchestration/workflow/ideation.md` § Sub-step A: "Sub-step A — Frame What and Why … re-framing check (6th forcing question)." The artifact's §1 WHY does not record the re-framing check outcome (e.g., "re-framing considered: framing the redesign as a settings-only change vs a state-machine change; chose state-machine because the line-241 lock is the structural blocker"). The 9 pre-resolved decisions arrive as input but the in-loop re-framing check is undocumented.
- **Why it matters:** Audit trail loss. A future session reading this Idea doc cannot tell whether the 6-forcing-questions Sub-step A discipline was run or implicitly skipped because "the user ratified before this loop." Either is fine, but recording the trace is the contract.

### F-P5 — "Superpowers-borrow" and "GSD-borrow" lack reference paths

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** `open`
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** §1 HOW.7 cites "GSD-borrow" for per-task `task-record.md`; §1 HOW.9 cites "Superpowers-borrow" for discuss-first. No path / URL / commit / repo reference is given for either. Per Project seed P9.2: "Negative results are recorded… Top 3 closest prior arts are characterized."
- **Why it matters:** Borrowing patterns without citation invites silent drift — what the future implementer thinks "GSD-borrow" means may not be what this Idea meant. The reference cost is low; the audit cost of NOT recording is unbounded.

## Per-perspective verdict

**REVISE.**

Findings F-P1 and F-P2 are both Medium · 75-confidence and meet the bar for a `REVISE` per Stage 2's rule ("any High with confidence ≥ 50 → REVISE; otherwise → PASS"). Neither is High in isolation, but their combination — scope-vs-deliverable boundary blur plus missing steel-man — undercuts the Idea's evaluability. Filing as **REVISE-with-Mediums** because the gaps are repairable in one round (rewrite §6.1/§6.6 to specify shape rather than verbatim text; add a steel-man paragraph; add 2-3 sentences of observable success criteria; record the re-framing check outcome). The 9 pre-resolved decisions are not contested.

## Low-confidence appendix

- **L-P1:** §1 HOW.8 "Fresh subagent context per task slice" cites Principle 4. Principle 4 in CLAUDE.md is "SCOPE IS BOUNDED BY THE CONTRACT WITH THE USER." That is not the inline-paste-rule principle — the inline-paste discipline is closer to delegation/SKILL.md §251. The citation is likely a wrong-number reference. Confidence 25 because the artifact does cite `delegation/SKILL.md § Inline-Paste Rule` alongside, so the Principle 4 reference may be a typo for a different principle number. Worth verifying in Planning.
