# Usage Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

Consumers: (a) the manager agent reading orchestration/SKILL.md and spawning subagents, (b) the leader/executor/evaluator/assistant subagents reading their templates+phase docs, (c) future-self maintainer at 3am. W/W/H clear.

## Stage 1 — Locked Frame

**S1. A fresh manager can run a session end-to-end from orchestration/SKILL.md alone (with linked deeper docs)**
- [ ] Step 1 Configuration procedure is complete
- [ ] Steps 2-6 loops have unambiguous spawn / collect / verdict / iter logic
- [ ] Cross-system reconciliation has a clear playbook

**S2. A fresh evaluator subagent can produce 8 files from evaluator template + evaluation/SKILL.md + phase child doc**
- [ ] Output paths unambiguous
- [ ] Frame-build vs Stage 2 measure are clearly distinct
- [ ] Verdict computation rules deterministic

**S3. An assistant doing MEMORIZATION knows what to write and where**
- [ ] memory-map.md tells them per-loop staging paths
- [ ] Templates exist for every staging subdir
- [ ] Idempotency contract clear

**S4. (adversarial) A 3am reader of any single SKILL.md page can answer "what do I do next?"**
- [ ] Each procedure table has clear `# / Action / Output / Agent` columns
- [ ] No "see below" without a clear forward pointer
- [ ] Exit checklists exist where procedures branch on verdict

**S5. (adversarial) Failure modes (broken file, missing draft, dual-system divergence) have explicit recovery procedures**
- [ ] Memorization validation gates 1-7 fail-closed with stop-the-line option
- [ ] Evaluator retry+degraded-mode policy documented
- [ ] Re-Ideate routing from Preparation handled

## Stage 2 — Findings

### F-U-01 — Manager has no entry-level "how to start a session" SOP

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: A fresh manager loading `orchestration/SKILL.md` finds:
1. "You Are the Manager" (lines 13-37) — role definition
2. "Orchestration Mode" (lines 41-56) — Chat/Auto framing
3. "Workflow" (lines 59-183) — 6-step SOP

But there's no answer to "the user just typed `/gobbi` — what do I do FIRST?" Step 1 procedure starts at "Read the default settings template" — but there's no entry point document that says "this is what `/gobbi` invokes". The `gobbi/SKILL.md` (out of scope for this batch but referenced in CLAUDE.md) presumably owns this — but not cited from orchestration.

**Why it matters**: The first session of a fresh agent has no breadcrumb. Mitigations exist (CLAUDE.md mandates loading `/gobbi` skill) but orchestration/SKILL.md is the canonical orchestration doc and should clarify its own entry point.

### F-U-02 — Subagent emit-protocol for "user-question" inside NEEDS_CONTEXT is referenced but not formally schema'd

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**:
- `discussion/SKILL.md:11`: "Spawned agents that need user input emit `NEEDS_CONTEXT` and route back through the manager."
- `principles/SKILL.md:153`: "Subagents that encounter an unresolvable decision return `NEEDS_CONTEXT` with a `user-question:` block — the manager presents it to the user."
- `principles/SKILL.md:289`: same
- `delegation/SKILL.md:124`: NEEDS_CONTEXT status → "Identify the missing input; either ask user, fetch from another source, or re-delegate"

The `user-question:` block schema is never defined anywhere in scope. Where does it live in the response? What fields does it carry? How does the manager parse it? Without a schema, the subagent will improvise — and the manager's "parse the status line first" deterministic dispatch (`delegation/SKILL.md:118`) can't apply.

**Why it matters**: This is the single most-important communication channel between subagent and manager in the new manager-only AskUserQuestion design. An undefined schema means every spawn produces a different shape, breaking deterministic routing.

### F-U-03 — Configuration Step 1 row 6 stamps `feature` "during Ideation" — but mechanism unclear

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `orchestration/SKILL.md:82`: "leave `feature` as `null` if not yet clear and stamp later, typically during Ideation". `orchestration/workflow/ideation.md:48` says manager stamps after Sub-step B. But the user-facing surface (Chat Mode AskUserQuestion gate after DISCUSSION per `orchestration/SKILL.md:289`) doesn't show "What feature does this session belong to?" as a question. Where does the feature decision actually happen?

### F-U-04 — Re-Ideate verdict from Preparation has no explicit ITER counter semantic

**Type**: `general` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: `orchestration/workflow/preparation.md:58`: "This is **not** a Preparation `REVISE` — it's an upstream loop re-entry. Preparation's own iteration counter does not increment." OK. But what about Ideation's iter counter? Does the re-entry start at iter 1 (fresh) or pick up where Ideation last left off? `orchestration/SKILL.md:118` Step 3 row 5 says "Re-enter Ideation Loop" with no detail. The user is going to be surprised by the answer.

### F-U-05 — `mistake` skill is mandatory load but no template doc shown in scope

**Type**: `general` / **Domain**: `docs-sync` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: Inherited; same as F-S-03.

## Stage 2 Verdict

**REVISE** — F-U-01 + F-U-02 both High at conf 75. The user-question schema gap (F-U-02) is the more serious — it's a deterministic-routing breaker that the whole spawn topology rests on.

## Low-confidence appendix

- LC-U-1 (conf 25, Low): `interview/SKILL.md` waves 1-5 could include explicit time estimates so a user knows what they're committing to. Defer.
