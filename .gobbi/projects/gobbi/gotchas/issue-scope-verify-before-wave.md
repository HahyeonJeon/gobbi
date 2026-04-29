# Verify GitHub issue scope before assuming a wave closes it

A multi-session plan's "Wave N.M" name can collide with a pre-existing GitHub issue whose actual scope is different. Always read the issue title + body BEFORE writing `closes #N` in the plan or PR description.

---

priority: high
tech-stack: gobbi-cli, github
enforcement: advisory
---

**Priority:** High

**What happened:** Wave B.1 (session `dc016347-d795-4b0b-9439-7d5abe756b34`, 2026-04-26) was planned and ideated against Pass 4's "Wave B.1: orchestration materialization extras + JIT footer code (closes #148)" — the previous session's handoff cited #148 as the closing issue. Ideation, plan, plan-evaluation, and the worktree branch name were all built around `feat/148-jit-footer-data-driven`. Mid-execution, the orchestrator ran `gh issue view 148` as part of the pre-execution setup checklist and discovered #148's actual title and body covered an unrelated scope: "B.1: include 'handoff' in `step-readme-writer.PRODUCTIVE_STEPS` + `specs/artifact-selector.StepId` enum". The two scopes had collided on the "B.1" identifier across sessions. Filed a new issue (#153) for the JIT-footer scope; updated plan + branch + PR to reference #153; left #148 as a separate small follow-up.

**Why it happens:** Wave naming in the multi-session plan ("Wave A.1", "Wave B.1", etc.) lives in design docs. GitHub issue titles get filed at different times by different agents. A previous session's handoff cited an issue number that originally tracked a different scope. The `closes #N` mechanic in PR descriptions assumes the issue's actual scope matches the wave's actual scope — which is a runtime claim, not a structural invariant.

**User feedback:** Self-caught during Wave B.1 pre-execution setup (orchestrator running `gh issue view 148` as part of plan §4 step 5). The orchestrator paused, surfaced the discrepancy via AskUserQuestion, user chose "File a new issue for JIT footer; keep #148 separate (Recommended)". Filed #153, updated all references.

**Correct approach:**

1. **Pre-ideation check** — when a session's handoff cites `closes #N`, run `gh issue view N` BEFORE the ideation step starts. Confirm:
   - The issue title matches the wave's intended scope (semantic match, not just identifier).
   - The issue body describes the wave's deliverables.
   - The issue is OPEN.
   If any check fails, surface the discrepancy to the user via AskUserQuestion before any ideation work begins.

2. **Plan-step verification** — the planner's `§4 pre-execution setup` step "Verify GitHub issue #N exists" must include a scope-match assertion, not just an existence check. Add to the plan template: "Verify the issue's title and body describe THIS wave's scope; if not, ask the user whether to file a new issue, re-title #N, or pivot the wave to #N's actual scope."

3. **Mid-execution discovery** — if discovered after ideation/planning has already built around the wrong issue (this session's case), don't try to retroactively re-scope #N. File a fresh issue, update plan + branch + PR + memorization to reference the new issue, leave the original as-is.

**Refs:** Wave B.1 session `dc016347-d795-4b0b-9439-7d5abe756b34`; PR #154 closes #153 (filed this session); issue #148 remains for handoff-plumbing scope.
