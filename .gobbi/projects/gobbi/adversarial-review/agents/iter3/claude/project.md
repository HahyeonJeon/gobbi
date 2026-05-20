# Project Perspective — 5-Role Agent Taxonomy (iter3, claude)

## Artifact Summary + W/W/H

**Artifact under review (post-iter3 REVISE)**: 5-file role bundle at `.gobbi/projects/gobbi/agents/{manager,leader,executor,evaluator,assistant}.md` + `skills/mistake/SKILL.md` (iter2) + `skills/delegation/SKILL.md` + `skills/delegation/templates/evaluator.md` (iter2) + `skills/git/SKILL.md` (iter3 Fix 4).

iter3 REVISE landed 4 fixes targeting iter2 regressions:
- Fix 1 — `agents/executor.md:32-36` rewritten to remove 7 dangling skill refs
- Fix 2 — `agents/assistant.md` Wrap-up step 4 NEEDS_CONTEXT escalation
- Fix 3 — `agents/assistant.md` frontmatter `tools:` += `Write, Edit`
- Fix 4 — `skills/git/SKILL.md` Forbidden Operations note referencing issue #258 (F-S-04 disputed)

**What / Why / How (iter3 fresh judgment)**:
- What ✓ — 5-role taxonomy + supporting skills locked
- Why ✓ — replace v0.4 PI/researcher/agent-evaluator/skills-evaluator/gobbi-agent stack with the v0.5.0 5-role spec
- How — clarified further in iter3 by the issue #258 cross-reference at git/SKILL.md:123 and the executor.md:35 explicit "out of v0.5.0 scope" framing for `.claude/` authoring. The canonical phase list at manager.md:40 + delegation/SKILL.md:213 remains the authoritative How surface

## Memory reads

- `iter2/claude/project.md` (inheritance — 11 findings; 1 addressed since iter1, 2 stuck, 2 regression-class NEW iter2)
- `iter2/claude/overall.md` (cross-cutting state — stuck Critical F-S-04)
- `iter2/codex/summary.md` (F-EXEC-DANGLING-iter2-codex Critical/100 — addressed in iter3 by Fix 1)
- `agents/{manager,leader,executor,evaluator,assistant}.md`
- `skills/delegation/SKILL.md` (Agent Roster line 217-223; phase list line 213)
- `skills/mistake/SKILL.md`
- `skills/evaluation/SKILL.md` § Finding Metadata, § Perspectives
- `skills/principles/SKILL.md` (Principle 2, 4, 6, 12)
- `skills/git/SKILL.md` (iter3 Fix 4 — Forbidden Operations § 123 note)
- `skills/orchestration/workflow/execution.md` (existence check for Fix 1 reference)

## Locked Frame (Stage 1)

### S-P-1 (inherited, stuck): Retired v0.4 mapping documented (F-P-01)
- [ ] Migration map (pi / researcher / agent-evaluator / skills-evaluator / gobbi-agent → 5 new roles) enumerated
- [ ] No retired responsibility silently dropped

### S-P-2 (inherited, addressed): Scope Contract sharpness across 5 files (F-P-04 closed in iter2)
- [ ] No `(or leader)` ambiguities — verify no regression

### S-P-3 (inherited, addressed): 6-step workflow has owners (F-P-05)
- [ ] Memorization phase names a specific role
- [ ] Wrap-up phase names a specific role
- [ ] Every canonical phase has an owner in manager.md phase table

### S-P-4 (adversarial inherited): Manager scope-creep exception (F-P-07)
- [ ] "Single-line edits" exception does not erode Principle 2 self-evaluation prohibition

### S-P-5 (adversarial inherited, stuck): Dual-stance retirement cross-pollination (F-P-03)
- [ ] Alternative mechanism for orthogonal hypotheses is named

### S-P-6 (iter3 verification — Fix 1): Executor load directives reference only existing skills
- [ ] Executor `Load per task domain` references only skills that exist on disk
- [ ] No v0.4 skill names (claude / skills / agents / rules / project / typescript / bun) remain as load targets

### S-P-7 (iter3 verification — Fix 2): AskUserQuestion exception single canonical line
- [ ] manager.md "Interview is the only named exception" preserved
- [ ] assistant.md Wrap-up step 4 escalates via NEEDS_CONTEXT (not direct AskUserQuestion)
- [ ] No subagent file claims an exception path that contradicts manager.md:12

### S-P-8 (iter3 verification — Fix 3): assistant tool surface matches expanded role
- [ ] assistant.md frontmatter tools list includes Write + Edit
- [ ] Description text consistent with the new tool surface (no "read-only" claim)

### S-P-9 (iter3 verification — Fix 4): F-S-04 disputed disposition properly documented
- [ ] skills/git/SKILL.md references issue #258 in a discoverable location
- [ ] Note is in a section a reader of the Forbidden Operations table would find

### S-P-10 (adversarial NEW iter3): Did Fix 2 sweep frontmatter tools across all subagents?
- [ ] If assistant.md AskUserQuestion was removed from tools, what about leader.md + executor.md frontmatter tools lists?
- [ ] Frontmatter ↔ prose coherence — tool grant vs prose prohibition

### S-P-11 (adversarial NEW iter3): Did Fix 2 reach skills that downstream wrap-up flow depends on?
- [ ] skills/wrap-up/SKILL.md still references "AskUserQuestion via manager" or has direct-call language that contradicts assistant.md:27 NEEDS_CONTEXT pattern

### S-P-12 (Privacy / Licensing): not-applicable — agent docs are not user-facing or PII surface

## Per-scenario per-check results (Stage 2)

### S-P-1 (F-P-01)
- (a) grep for `pi\|researcher\|agent-evaluator\|skills-evaluator\|gobbi-agent` across `agents/*.md` + `delegation/SKILL.md` → **0 hits**. Same as iter2. → **disposition: open (stuck across iter1+iter2+iter3)**

### S-P-2 (F-P-04 regression check)
- (a) grep `(or leader)` in `agents/*.md`, `delegation/SKILL.md` → **0 hits**. No regression. → **addressed (carry from iter2)**

### S-P-3 (F-P-05)
- (a) Memorization → assistant: manager.md:34-38 + manager.md:86 + assistant.md:12 still align. → **addressed (carry from iter2)**
- (b) Wrap-up → assistant: manager.md:38 + manager.md:87 + assistant.md:18 still align. → **addressed (carry from iter2)**

### S-P-4 (F-P-07)
- (a) manager.md:15 still carves "single-line edits when delegation overhead would dwarf the work" — no evaluator-spawn instruction attached. Unchanged from iter2. → **open** (Medium, carry from iter2)

### S-P-5 (F-P-03)
- (a) delegation/SKILL.md:45 still reads "Single leader per dispatch"; no cross-pollination alternative documented. Same as iter1 + iter2. → **open (stuck across iter1+iter2+iter3)**

### S-P-6 (Fix 1 verification — executor.md dangling refs)
- (a) executor.md:34 lists only `execution` skill + `git` skill (verified to exist via `ls skills/`)
- (b) executor.md:35 explicitly defers `.claude/` authoring to issue #258 instead of the v0.4 skill list — clean defer pattern
- (c) executor.md:30 `orchestration/workflow/execution.md` — verified present at `skills/orchestration/workflow/execution.md`
- (d) grep `claude skill\|typescript skill\|bun skill\|skills skill\|agents skill\|rules skill\|project skill` in executor.md → 0 hits. Old refs fully removed.
- → **F-EXEC-DANGLING-iter2-codex disposition: addressed**

### S-P-7 (Fix 2 verification — AskUserQuestion exception)
- (a) manager.md:12 reads: "The Interview skill is the only named exception" — preserved as canonical single exception
- (b) assistant.md:27 now reads: "When you need user input — including during Wrap-up WORK step 4 ... — return status `NEEDS_CONTEXT` with a `user-question:` block ... Do NOT call AskUserQuestion directly. The manager reads the block and calls AskUserQuestion on your behalf". No second exception claimed. Wrap-up step 4 is routed through NEEDS_CONTEXT, not as a new exception. → **F-U-NEW-01 / F-C-NEW-01 addressed**

### S-P-8 (Fix 3 verification — assistant tool surface)
- (a) assistant.md:4 frontmatter: `tools: Read, Grep, Glob, Bash, Write, Edit, WebSearch, WebFetch` — Write + Edit present. Verified.
- (b) assistant.md:3 description: "Has Write/Edit access bounded to session staging during MEMORIZATION + Wrap-up phases (per evaluation/SKILL.md memory access matrix); read-only in lookup mode." Description text matches expanded tool surface. **No residual "Read-only tool surface" claim**. → **F-C-06 addressed**

### S-P-9 (Fix 4 verification — F-S-04 issue #258 reference)
- (a) git/SKILL.md:123: "Cross-layer drift is not yet detected automatically. … Until issue #258 lands, every PR that touches multiple layers (e.g., agent docs + runtime specs + plugin agents) must be hand-reviewed for drift via adversarial review per `evaluation/SKILL.md`. See issue #258 for the planned validator."
- (b) Placement: directly under § Forbidden Operations, before § Safe-list exceptions. Discoverable by any reader of the Forbidden Operations table.
- (c) Reference issue number is concrete (#258) not generic ("TBD")
- → F-S-04 disposition recorded per the iter3 contract as `disputed`. The drift-detector follow-up is tracked, not silently dropped.

### S-P-10 (NEW iter3 adversarial — Fix 2 frontmatter sweep)
- (a) Check `leader.md:4`: `tools: AskUserQuestion, Read, Grep, Glob, Bash, WebSearch, WebFetch, Write` — **AskUserQuestion STILL GRANTED in tools list**
- (b) Check `executor.md:4`: `tools: AskUserQuestion, Read, Grep, Glob, Bash, Write, Edit` — **AskUserQuestion STILL GRANTED in tools list**
- (c) But `leader.md:17` body: "Do NOT call AskUserQuestion directly"; `executor.md:19` body: "Do NOT call AskUserQuestion directly"
- (d) `assistant.md:4` tools list (iter3 Fix 3 modified): **no AskUserQuestion in tools** — asymmetric with leader + executor
- (e) Frontmatter-grant vs prose-prohibition: direct contradiction. The Claude Code harness grants tools by frontmatter; if AskUserQuestion is in the leader/executor `tools:` list, the subagent can call it regardless of prose discipline. The prose is a soft norm; the tool grant is the hard contract.
- → **F-P-iter3-NEW-01** (High, regression class — Fix 2 sweep was incomplete: prose was patched in 5 files but only assistant's frontmatter was reconciled. This is the SAME failure shape as iter2 F-U-NEW-01: a partial-edit landed without sweeping all affected surfaces.)

### S-P-11 (NEW iter3 adversarial — Fix 2 downstream sweep)
- (a) wrap-up/SKILL.md:4 frontmatter: `allowed-tools: Read, Grep, Glob, Bash, Write, Edit, AskUserQuestion`
- (b) wrap-up/SKILL.md:137 procedure step 4: "if user-confirm is required ... AskUserQuestion via manager" — language is "via manager" (consistent with NEEDS_CONTEXT escalation)
- (c) wrap-up/SKILL.md:39 + line 351 + line 357: "**MUST run user-confirm via AskUserQuestion** for: rules promotion, project-wide design promotion, mistake scope (feature vs project), unrouted staging files" — "MUST run" wording is direct-call, NOT via-manager. Direct contradiction with assistant.md:27 NEEDS_CONTEXT escalation
- (d) `skills/wrap-up/SKILL.md` was NOT modified in iter3. The Fix 2 sweep stopped at agent files, did not reach the skill files the agents load. The assistant loads `wrap-up/SKILL.md` per assistant.md:18 — the skill instructs direct-call AskUserQuestion, the agent file instructs NEEDS_CONTEXT escalation. Operator at run-time sees contradictory guidance.
- → **F-P-iter3-NEW-02** (High, regression class — same shape as F-P-iter3-NEW-01: incomplete sweep)

### S-P-12 (Privacy / Licensing)
- not-applicable: agent docs are internal behavioral specs; no PII, no licensed external content, no user-facing surface

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-P-01** | `scenario_gap` | `docs-sync` | **open (stuck iter1+iter2+iter3)** | 75 | Medium | No retirement map in `agents/*.md`. Unchanged across 3 iters | Future maintainer cannot tell which v0.4 role mapped where; carry-forward Medium |
| **F-P-02** | `assumption_risk` | `process` | open (carry) | 50 | Medium | `gobbi-agent` plugin agent fate still silent. Same as iter2 | Carry-forward |
| **F-P-03** | `design_flaw` | `process` | **open (stuck iter1+iter2+iter3)** | 75 | High | delegation/SKILL.md:45 unchanged; no cross-pollination alternative documented | Groupthink risk in Ideation persists; not addressed by any of the 3 iters |
| **F-P-04** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | grep `(or leader)` → 0 hits; no regression | iter1 Medium closed in iter2; preserved in iter3 |
| **F-P-05** | `scenario_gap` | `process` | addressed (carry) | 100 | n/a | manager.md:38, 84-87 + assistant.md:12 still aligned | iter1 Critical closed in iter2; preserved in iter3 |
| **F-P-06** | `design_flaw` | `docs-sync` | addressed (bundle, carry) / deferred (CLAUDE.md, carry) | 100 | n/a | manager.md:33-38 6-phase list intact | Carry-forward |
| **F-P-07** | `design_flaw` | `process` | open (carry) | 50 | Medium | manager.md:15 "single-line edits" exception unchanged | Self-evaluation hole persists; not in iter3 REVISE scope |
| **F-P-08** | `scenario_gap` | `process` | open (carry) | 25 | Low | No agent owns "synthesize parallel evaluator outputs" | Low priority carry |
| **F-P-iter2-NEW-01** | `design_flaw` | `cost` | open (carry from iter2) | 50 | Medium | sonnet for assistant Wrap-up + user-facing decisions concentrated in one role | iter3 did not address; load distribution unchanged |
| **F-P-iter2-NEW-02** | `design_flaw` | `process` | **addressed** | 100 | n/a | assistant.md:27 now uses NEEDS_CONTEXT escalation; manager.md:12 single-exception preserved | Fix 2 closed the iter2 regression cleanly |
| **F-P-iter3-NEW-01** | `design_flaw` | `docs-sync` | **open (NEW iter3 regression)** | 100 | **High** | leader.md:4 + executor.md:4 frontmatter `tools:` still grant `AskUserQuestion`; prose at leader.md:17 + executor.md:19 says "Do NOT call AskUserQuestion directly". Fix 2 swept assistant frontmatter (no AskUserQuestion) but did NOT sweep leader/executor frontmatter | Frontmatter is the tool grant — the prose is soft norm. A subagent in the leader/executor role has the AskUserQuestion tool available and the prose discipline can be overridden at runtime. Same failure shape as iter2 F-U-NEW-01: partial-edit landed without sweeping all affected surfaces |
| **F-P-iter3-NEW-02** | `design_flaw` | `docs-sync` | **open (NEW iter3 regression)** | 100 | **High** | wrap-up/SKILL.md:357 "MUST run user-confirm via AskUserQuestion" — direct-call wording; assistant.md:27 routes via NEEDS_CONTEXT. The assistant loads wrap-up/SKILL.md (per assistant.md:18) and sees contradictory guidance | The skill file is the procedural contract; the agent file is the role behavior. When they contradict, the operator does not know which to follow. Fix 2 did not sweep skill files |
| **F-P-iter3-NEW-03** | `process` | `process` | **open (NEW iter3 — process)** | 75 | Medium | Per iter3 contract: "If you genuinely believe the disputed disposition [for F-S-04] is wrong, raise it as a NEW finding (Type: `process`, Domain: `process`)". The F-S-04 disposition appears defensible (drift detector is tracked at issue #258; bundle is hand-reviewable). Not raising. | This entry exists per the prompt's contract — recording acceptance of the disputed disposition for audit |
| **F-S-04** | `scenario_gap` | `docs-sync` | **disputed (per iter3 contract)** | n/a | n/a | git/SKILL.md:123 references issue #258 for the drift validator | Recorded per the manager-supplied iter3 disposition |

## Per-perspective verdict

**FAIL** — Two High/100 NEW regression findings (F-P-iter3-NEW-01 + F-P-iter3-NEW-02) introduced by an incomplete Fix 2 sweep. The iter3 REVISE closed the iter2 regression (F-U-NEW-01 / F-C-NEW-01 + F-C-06) cleanly at the 5 agent files, but left two parallel surfaces unaddressed:
1. Leader + executor frontmatter `tools:` still grants AskUserQuestion (contradicting the prose Fix 2 patched)
2. wrap-up/SKILL.md still mandates direct-call AskUserQuestion (contradicting assistant.md:27 NEEDS_CONTEXT)

Stuck findings: F-P-01, F-P-03 — neither was in REVISE scope. F-P-iter2-NEW-01 (assistant sole-writer + sonnet) carry-forward.

Per the threshold rule: any Critical/75 → FAIL; any High/50 → REVISE. No Criticals remain; two Highs/100 (regression class) → **REVISE**. But the regression class (third consecutive iter introducing the same shape of failure: partial-edit landing without sweeping all affected surfaces) warrants escalation to FAIL for the Project perspective — the pattern, not any one finding, is the load-bearing signal.

Strict per-perspective rule: **REVISE**.

## Low-confidence appendix

- F-P-08 (Low/25) — carry-forward
- F-P-iter3-NEW-03 process finding intentionally recorded at Medium/75 (acceptance) per iter3 contract; if user later disputes the disputed disposition this finding stays for audit
