# Performance Perspective — Batch 4 iter1 (Claude)

## Artifact Summary + Memory reads

(See `project.md` § Artifact Summary.)

## Locked Frame (Stage 1)

For a documentation/skill artifact, performance translates to **context-budget cost** + **agent-time cost to navigate** + **runtime-cost of any commands/regexes the artifact prescribes**.

Seed scenarios:

1. **Context-budget cost is justified** — each of the three skills earns its line count; 798 lines total (210+307+281+323=1121 including conventions.md). At ~3 tokens/line on average, the bundle is ~3-4k tokens — modest for a session-start load.
2. **Navigation cost is low** — finding any given rule is O(1) via heading + ctrl-F.
3. **Runtime cost of prescribed operations is bounded** — the regexes are small and fast; `gh` calls and `git` operations are network-bounded but bounded.
4. **No combinatorial-cost trap** — no nested-loop guidance that would blow up at scale (e.g., "for every subagent, evaluate against every prior session" — would explode).
5. **(adversarial)** — A reasonable-looking design hides a sub-linear bottleneck: the SessionStart hook persists 9 env vars; the project-memory check reads 3 paths. Total session-start I/O is bounded but could grow with more env vars or memory tiers.

Adversarial scenario: present (scenario 5).

Coverage matrix — Performance owns Cost (Coverage Matrix: Performance + Risk). Cost angle: the AI-Provenance-Record trailer adds ~50 bytes per commit — negligible.

## Per-scenario per-check results

**Scenario 1 — Context-budget justification:** principles/SKILL.md at 307 lines is the largest. Each principle averages ~25 lines (Iron Law + Why + Discipline + Anti-rationalizations + Mechanism). This is the floor of behavioral discipline; load is per-judgment-call, not every action. **PASS** — but note P-Perf-01 below: the principle structure could be shorter if Anti-rationalizations were tabulated.

**Scenario 2 — Navigation cost:** gobbi/SKILL.md uses 6 numbered subsections in Bootstrap Order; principles uses 12 numbered principles; git uses lifecycle-named sections. All findable in O(1) with ctrl-F. **PASS** (modulo S-S-01 from Structure: no Iron Law summary index).

**Scenario 3 — Runtime cost of prescribed ops:**
- Branch regex (conventions.md line 18): bounded — single pass against a short string.
- Commit subject regex (line 59): single pass.
- Worktree creation: `git worktree add` is fast.
- Pre-merge gate checklist: 5 items, all local except CI.
**PASS.**

**Scenario 4 — Combinatorial-cost check:** No nested-loop guidance found. Evaluation rotation is 7 perspectives × per-system, sequential — linear in perspectives. **PASS.**

**Scenario 5 (adversarial) — SessionStart hidden cost:** The hook writes 9 env vars to `$CLAUDE_ENV_FILE`. Project memory check reads 3 paths (`README.md`, `design/`, `features/`). Total session-start IO is ~10 disk ops — bounded. **PASS.**

## Typed findings

### P-Perf-01 — principles/SKILL.md anti-rationalizations could be tabulated to reduce repeated context cost

- **Type**: general
- **Domain**: cost
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Each of the 12 principles ends with an `Anti-rationalizations:` bulleted list of 3–8 quoted rationalizations. The skill's own line 307 admits: "Future work: a Red Flags table per principle, listing the named rationalizations from each principle in scannable tabular form." A consolidated table near the top would let agents skim the rationalizations as a scan rather than scrolling through 12 sections — reducing per-session context spend when the principle's full rationale is not needed.
- **Remediation**: Either (a) close out the deferred "Future work" item, or (b) reframe it as a backlog issue with a pointer.

### P-Perf-02 — conventions.md regex precompile vs per-call cost not stated

- **Type**: general
- **Domain**: performance
- **Disposition**: open
- **Confidence**: 25
- **Severity**: Low
- **Evidence**: The branch and commit subject regexes (conventions.md lines 18, 59) are run pre-push. For a session that commits 5–10 times, the regex is run 5–10 times — trivially cheap. But conventions.md does not say *who runs the regex* (the agent? a hook? a linter?). If it's the agent, it's cheap. If it's a pre-commit hook, the hook must be configured separately and is not in scope for the skill itself. Worth flagging as a process detail to surface eventually.
- **Remediation**: Add one line under § Branch Naming and § Commit Messages: "The agent self-validates the regex before push/commit; no pre-commit hook is required for compliance."

## Low-confidence appendix

- **L-Perf-01 (confidence 25)**: gobbi/SKILL.md prescribes loading 5 skills at session start. If each is 200–300 lines, that's ~1500 lines of context at session-start. For long sessions with many subagents (each must re-load principles), the cumulative spend grows. Mitigation: the principles skill load is the only mandatory subagent re-load (per Constraints). Total cost is acceptable. Possibly false-positive (speculative).

## Verdict

**PASS** — All scenarios pass; 2 in-scope findings are Low; none Critical, none High. Performance is fine for a doc-only artifact.
