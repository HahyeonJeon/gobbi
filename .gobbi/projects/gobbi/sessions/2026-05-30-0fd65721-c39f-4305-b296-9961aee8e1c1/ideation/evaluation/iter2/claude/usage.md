# Usage Perspective — Claude Evaluation (iter 2)

## Artifact Summary + Memory reads
See project.md. Usage lens: can the Planner produce a task list without going back to the user; can the Executor know what to change; U1 (worktree-faithful install) and U2 (permissions) resolution.

**Memory reads:** as project.md; iter-1 codex `usage.md` (U1/U2); staged worktree-resolution reference.

## Locked Frame (Stage 1)
- **Planner produces a task list without re-asking the user** — every directional decision specific enough to start; scenarios map 1:1 to tasks.
- **Executor knows what file/module to change** — every research insight has a path/URL/sha; names stable.
- **3am maintainer understands what+why** — consumers named (Planner/Executor/future-self).
- **Failure modes communicated match implementation** — each named failure mode has an implementation expectation.
- **Consumer forms wrong mental model (adversarial)** — borrowed terms used with project meaning.
- **Worktree-faithful install testable (adversarial, U1)** — the install/test path PROVES worktree content was loaded, not the main checkout.
- **Accessibility/I18n** — not-applicable: deliverable is a plugin package + skill doc with no user-facing UI/strings beyond developer-facing markdown (scannable headings present).
- **Permissions user-operable (U2)** — post-install invocability is checkable and the project-local-vs-ship disposition is stated as a user decision.

## Per-scenario per-check results
- Planner no re-ask: MOSTLY YES. DD-1..DD-6 are concrete; DD-7/DD-8/DD-9 are explicitly Planning DECISIONS with options. This is correct ideation behavior (surface options, let Planning/user decide) — NOT a usage gap, because the options are enumerated with a recommendation. See F-U1 for the one place the Planner still lacks an input.
- Executor knows targets: YES. Canonical paths, agent `.md` names, hook script names, `hooks/hooks.json` event blocks all named; every insight has a sha/URL.
- 3am maintainer: YES. Consumers named; the framed problem + prior-art history is self-contained.
- Failure modes match impl: YES. Scenarios enumerate escaping-symlink (→empty plugin), directory-agents (→validation fail), too-narrow matcher (→silent drop), double-fire, worktree-wrong-checkout — each with a prevention anchored to a DD.
- Wrong mental model: NO. "materialize", "bounded package", "ADDS-to vs REPLACES" used precisely and consistently with the references.
- Worktree-faithful (U1): YES, RESOLVED. DD-7 names 3 options (commit/push+git-ref; absolute worktree path; merge-to-main) + a worktree-sentinel assertion. The new reference (relative source → main checkout) is the grounding. The test scenario PROVES worktree content was loaded.
- Accessibility/I18n: not-applicable (declared above).
- Permissions (U2): YES, RESOLVED as user-operable. DD-9 makes ship-vs-project-local a user decision with a post-install invocability check; the 16 Skill + 5 Agent surface is named (verified against settings.json).

## Typed findings

### F-U1 — DD-7 leaves the worktree-faithful path UNCHOSEN; Planner inherits 3 live options
- Type: scenario_gap · Domain: process · Disposition: open · Confidence: 50 · Severity: Medium
- Evidence: DD-7 (lines 361-368) presents options (a)/(b)/(c) but, unlike DD-8 (which gives a recommended Option A), DD-7 states "Execution must pick a test path" with no recommendation. The success criterion (line 84) and Golden scenario depend on "the chosen worktree-faithful path (DD-7)" being decided.
- Why it matters: the worktree-faithful install is the load-bearing verification for the ENTIRE deliverable (it is how every other success criterion gets observed). Leaving it fully open risks Planning either picking arbitrarily or bouncing back to the user. Unlike DD-8/DD-9 which carry recommendations, DD-7 does not — a mild Principle 6 (specificity) gap. Medium because it is genuinely a Planning input and the options are sound; it does not block ideation but should carry a recommended default like its siblings.
- Suggested direction: add a recommended default to DD-7 (e.g., option (a) commit/push + git-ref, which is the most worktree-faithful and matches the project's branch-per-session model), or explicitly mark it as a user-choice-at-Planning like DD-9.

## iter-1 finding dispositions (Usage-owned)
- **U1 (worktree install, High/75)** — RESOLVED/addressed by DD-7 + worktree-sentinel scenario + new reference. The residual is the unchosen default (F-U1, Medium), not the missing scenario. Confidence 100 on the scenario existing.
- **U2 (permissions, Medium/75)** — RESOLVED/addressed by DD-9 (user-operable disposition + invocability check) + promoted to scenario. Confidence 100.

## Per-perspective verdict: PASS
F-U1 is Medium; no open High/Critical. (Raise F-U1 with user before Planning.)

## Low-confidence appendix
None.
