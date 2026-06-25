---
name: post-research-design-decisions
description: Post-research D1-D4 scope/design locks + REVISE handling decision (iter1 dual-system REVISE; iter2 manager-verified PASS)
type: discussions
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [design, hooks]
keywords: [scope, revise-handling, dual-runtime, probe-script, merge-conflict]
author: claude
outcome: D1-D4 locked; REVISE via iter2 leader remediation + manager spot-verify; no 2nd full eval
---

# Post-research discussion — D1–D4 locks + REVISE handling

## Context

After the research package (`draft-iter1.md`, leader `a39744c1d2a51774b`) was reviewed, the
manager surfaced four open questions requiring user decisions before locking the ideation artifact.
Core finding: the git skill is single-runtime-in-disguise with 0 coverage of Codex
sandbox/approval/network constraints. Gap = 11 MISSING / 4 PARTIAL / 1 INCORRECT among dual-runtime
items.

## Decisions locked (2026-06-14T06:15:07Z)

### D1 — Hooks scope correction (OQ-2)

Manager recommendation: re-point hooks to exclude git-lifecycle scope (current hooks are token
reconcilers, not git-metadata, per INT-4).

User override: keep hooks in scope as an additive opportunity (git-lifecycle telemetry if warranted;
concrete change deferred to Planning per PIN-2). Premise correction preserved: existing
token-reconciler behavior is NOT changed.

**Decision class:** ask:scope. Scope = git docs + `.codex/config.toml` + `.codex/agents/*.toml` +
`agents/{manager,executor}.md` + hooks (additive git-lifecycle telemetry) + new probe script.

### D2 — Blocked-op handling model (OQ-3)

Manager asked: safe-default deferral or allow sandbox loosening?

User decision: safe-default + generalized deferral + remediation menu. Widen the PR-deferred
trigger set from {gh-missing, unauth, no-remote} to also include {network-blocked,
approval-not-granted}. Manager surfaces per-runtime remediation menu before deferring. No
sandbox-loosening by default.

**Decision class:** ask:design. Anchors DD-2 (five-trigger PR-deferred model).

### D3 — Runtime-posture probe script (OQ-4)

Manager asked: add a read-only probe or defer?

User decision: YES — add a probe that reports sandbox/network/approval posture. Design narrowed in
iter2: network field = reliable via `CODEX_SANDBOX_NETWORK_DISABLED=1` env; sandbox-mode and
approval-policy = best-effort with explicit "unknown" states. Concrete implementation is a Planning
prerequisite (PIN-1).

**Decision class:** ask:design/scope. Anchors DD-3.

### D4 — Merge-conflict handling (OQ-6)

Manager asked: in scope or deferred?

User decision: in scope. Add base-sync conflict recovery (during P2 `git pull --ff-only` step) and
PR-branch conflict recovery (P5 pre-merge gate / P7 CI-driven path).

**Decision class:** ask:scope. Anchors DD-4.

### Deferred to Planning

OQ-1 (doc structure: section-vs-tags), OQ-5 (read-only Codex policy), OQ-7 (naming). Manager
brings recommendations at Planning start.

### Side note captured

Manager had propagated an imprecise premise ("git-metadata hooks") into the locked scope question.
INT-4 caught it. The discussion-log flagged this as mistake-candidate territory: verify that a
named change-target exists and does what you expect before locking it into a scope question.

---

## REVISE handling (2026-06-14T06:37:17Z)

### iter1 evaluation result

Dual-system evaluation on `draft-iter1.md`: BOTH Claude and Codex returned REVISE (no Critical or
FAIL). Convergent root: `codex/SKILL.md` prior-art gap — neither system was engaged before writing
the artifact (both rated High; Codex rated 100/100 severity).

Pessimistic union of findings:
- R1: engage and align with `codex/SKILL.md` (root — design_flaw/docs-sync)
- R2: probe data-source — narrow to reliable fields only (network=reliable; mode/approval=best-effort)
- R3: ask-only remediation guard — all sandbox/network changes are user-owned (security gap)
- R4: INT-6 wrong — `leader.md` DOES have `git -C` discipline; manager.md scope precision
- R5: line-counts off-by-one + `features/git-workflow/` readiness check needed

Manager re-verified R1/R4/R5 and the dangling `codex/SKILL.md:254` link directly — all confirmed.

### How to handle REVISE (user decision)

Q: Full second evaluation or leader iter2 + manager spot-verify?

User decision: leader iter2 applies R1–R5 → `draft-iter2.md`; manager spot-verifies fixes; NO 2nd
full dual-system eval (corrections, not new design). Verdict logged in `session.json` iter2 as
`pass` with note "iter2 remediation manager-verified (no 2nd full eval per user)".

**Decision class:** ask:process.

## Related

- `working/discussion-log.md` — 2026-06-14T06:15:07Z + 2026-06-14T06:37:17Z entries
- DD-2 (five-trigger model), DD-3 (probe script), DD-4 (merge-conflict), DD-6 (hooks additive)
- `staging/decisions/codex-skill-prior-art-not-engaged.md` — root defect (addressed in iter2)
