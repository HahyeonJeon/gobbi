# Risk Perspective — Cross-cutting Batch (iter1, claude)

## Stage 0 — Target Understanding

Lens: blast radius, reversibility, security surface, rollback, irreversible operations. For doc artifacts, primary risks are: silent contract drift causing downstream agents to misbehave; data corruption (project memory writes by wrong actor); cost runaway; rollback difficulty. W/W/H clear.

## Stage 1 — Locked Frame

**S1. Sole-writer-to-project-memory is enforced by validation gates, not just contract docs**
- [ ] Memorization workflow gate 5 (project-memory untouched) is mechanical
- [ ] Wrap-up's exemption is explicit and gated
- [ ] Interview's exemption is gated

**S2. Destructive operations (rm, force-push, schema migration) are user-gated everywhere**
- [ ] discussion/SKILL.md Always-Ask Destructive category covers these
- [ ] Subagents cannot initiate user dialogue (NEEDS_CONTEXT route only)
- [ ] No skill grants WRITE access to feature/project memory to a non-Wrap-up loop

**S3. Rollback path exists for ill-formed PASS staging**
- [ ] Disposition: superseded preserves audit trail; no deletion
- [ ] Cumulative staging means a wrongly-staged finding can be carried forward then explicitly addressed
- [ ] Idempotent CREATE/UPSERT means re-running MEMORIZATION is safe

**S4. (adversarial) Blast radius of the contract contradiction in F-S-02**
- [ ] If a manager spawns 8 evaluators per system instead of 1, what's the cost?
- [ ] Can the wrong topology corrupt outputs?

**S5. Security surface — no new untrusted-input paths**
- [ ] Templates don't accept arbitrary user input into shell commands
- [ ] Path conventions use $CLAUDE_SESSION_ID + dates — no path injection
- [ ] `allowed-tools` frontmatter scopes tool access per skill

**S6. (adversarial) Concurrent-session risk**
- [ ] Idempotent UPSERT on session.json
- [ ] But what if two sessions write to the same project memory simultaneously?

## Stage 2 — Findings

### F-R-01 — Contract contradiction (F-S-02) blast radius includes silently wrong outputs

**Type**: `design_flaw` / **Domain**: `process` / **Confidence**: 75 / **Severity**: Critical / **Disposition**: open

**Evidence**: The 1-perspective-per-agent topology (literal reading of `delegation/SKILL.md:47,225` + `templates/evaluator.md:8`) is structurally incompatible with `evaluation/SKILL.md:9` Stage 3 Overall, which requires "all seven per-perspective passes" be visible to ONE agent for cross-perspective synthesis (Stage 3 inputs `evaluation/SKILL.md:266` = "All seven per-perspective verdicts and findings"). If a manager spawns 8 separate agents, **no single agent can run Stage 3**; the Overall pass either runs in a 9th agent (which doesn't see source frames), or the manager runs it (violating "creator never evaluates"), or the contract is silently broken and Stage 3 is skipped.

**Why it matters**: Risk is not just cost (F-Pe-01). The wrong topology breaks Stage 3 — and Stage 3 is the ONLY stage that catches Karpathy-4 failure modes, which the workflow design treats as a load-bearing review surface (`evaluation/SKILL.md:276`). Blast radius: every evaluation phase in every loop ships without Karpathy coverage if the wrong topology is followed.

### F-R-02 — Interview bypasses memorization gate 5 — risk of silent project-memory corruption

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: Inherited from F-C-03. The Interview's WRITE authority to 11 project-memory paths bypasses the canonical sole-writer contract. The validation gate `workflow/memorization.md:188-198` "Project-memory untouched (system-wide invariant — applies only when `loop ∈ {preparation, ideation, planning, execution}`)" explicitly excludes interview. There's no equivalent validation gate for Interview's writes — meaning Interview can write **anywhere** with no mechanical check.

The assumption: "Interview captures user-confirmed facts via AskUserQuestion exchanges. Each output is gated by user confirmation at the wave's intermediate summary." (`interview/SKILL.md:34`). This is gated by intent only, not by the mechanical write-log + git-diff dual check.

**Why it matters**: If Interview has a bug (wrong feature-name slug, wrong template-stamp, accidental overwrite of an existing `README.md`), there's no validation gate to catch it. Compare to Wrap-up which DOES have a routing-table-back-trace check (`workflow/memorization.md:198`).

### F-R-03 — Concurrent-session risk on project memory unaddressed

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 50 / **Severity**: Medium / **Disposition**: open

**Evidence**: Wrap-up is the sole writer per `memorization/SKILL.md:45` — but if two sessions both reach Wrap-up roughly simultaneously, who wins? `memory-map.md:5` notes "no per-project summary JSON ... session.json is the only JSON" — no lock file mentioned. The `backlogs/concurrent-init-lock.md` (per gitStatus) suggests this risk is already on the radar for Configuration init, but Wrap-up's concurrent write to e.g. `features/{feature-name}/README.md` recent-activity table (`memorization/memory-map.md:83` "cap 20 entries") is unprotected.

### F-R-04 — Subagent-emitted `user-question:` block has no schema (inherited from F-U-02)

**Type**: `assumption_risk` / **Domain**: `process` / **Confidence**: 75 / **Severity**: High / **Disposition**: open

**Evidence**: F-U-02 root. Risk angle: subagents will emit free-form prose under "NEEDS_CONTEXT". The manager's deterministic parsing (`delegation/SKILL.md:118`: "The manager parses the status line first and dispatches its next action deterministically") will fail if the user-question block isn't shaped right. Failure mode = manager either ignores the user-question (and the user never sees the subagent's blocked question) or surfaces a malformed AskUserQuestion to the user.

### F-R-05 — Security surface: `evaluation/SKILL.md` Verification preflight is unambiguous and well-gated

Verified: `evaluation/SKILL.md:443-457` Verification preflight table is comprehensive (in-memory / workspace-write / db-write / network / cost-bearing). Side-effectful tool runs are correctly gated. **Not a finding.**

### F-R-06 — Rollback path: superseded preserves history; no deletes anywhere

Verified across all 7 skills: every "MUST never delete" + "supersession via frontmatter" constraint is present. Memorization/SKILL.md:297, evaluation/SKILL.md:548, interview/SKILL.md:331. **Not a finding.**

## Stage 2 Verdict

**FAIL** — F-R-01 (Critical conf 75) — the contract contradiction has Critical blast radius beyond cost: it breaks Stage 3 Karpathy coverage, which is the workflow's only cross-perspective gate. F-R-02 (High conf 75) layered.

## Low-confidence appendix

- LC-R-1 (conf 25, Low): No automated lint to detect "agent declared mistake-candidate: true frontmatter but Wrap-up promotion routing didn't fire" — would require runtime instrumentation, defer.
