# Overall — T06 codex skill content

## Artifact Summary

- **What**: Content-complete fill of `.gobbi/projects/gobbi/skills/codex/SKILL.md` (386 lines, 8 H2 sections preserved, Constraints body block expanded) + Skill Map row in `gobbi/SKILL.md` cross-cutting table. Commit `bcfaab2`, 2 files / +387 lines.
- **Why**: Close Idea Design A for gobbi-orchestration-workflow-improvements — every agent that touches Codex now has a single load-target.
- **How**: Author each H2 body following the pre-stubbed structure; preserve the locked 8-H2 contract; cite the decision-record's assistant-wrapper requirements; cite the recorded mistake verbatim.

## Per-perspective verdict summary

| Perspective | Verdict | High findings |
|---|---|---|
| Project | REVISE | 2 (F-P-01, F-P-02) |
| Structure | PASS | 0 |
| Performance | PASS | 0 |
| Aesthetics | PASS | 0 |
| Usage | PASS | 0 |
| Consistency | PASS | 0 |
| Risk | PASS | 0 |

## Stage 3 — Cross-perspective tensions

- **Project says REVISE; all 6 other perspectives say PASS.** The two High findings (F-P-01 missing-symlink anti-pattern, F-P-02 git/SKILL.md cross-link unwired) are both brief-traceable scope gaps — failures to land items the contract explicitly required. Other perspectives passed because the **content the executor did write** is correct on its own terms; the failure is in **content NOT written that the brief required**.
- This is the canonical Project-vs-Structure tension: Structure looks at what is there and grades organization; Project looks at the contract and grades coverage. Both signals are valid.

## Karpathy failure modes

1. **Wrong assumptions** — none observed. The executor used the empirical tool-surface table; the mistake-quote is verbatim; the assistant-wrapper pattern is faithful to the decision-record.
2. **Overcomplexity** — none. 386 lines is at the lower end of the 350-450 brief target. Concrete examples are short. Tables used appropriately.
3. **Orthogonal edits** — none. Commit touches only 2 files, both contractually scoped.
4. **Imperative-over-declarative** — partial concern. The Constraints body block (14 MUST/NEVER/ALWAYS bullets) is appropriately declarative. The body sections sometimes prescribe mechanism more than goal (e.g., `timeout 600` as a hard number rather than "an explicitly bounded timeout"). The skill addresses this directly in line 199 by stating "600 seconds is a reasonable upper bound … Adjust for known-heavy tasks, but always set a bound" — escape hatch present.

## Preserve list (do NOT touch on REVISE)

- The 8 H2 contract — section names verbatim and the section count of exactly 8 (Idea Design A locked).
- Section 3 tool-surface table (lines 99-105) — empirically verified against `.claude/agents/*.md`. Do not edit numbers.
- Section 4 quote from the recorded mistake (lines 149-155) — verbatim quote must remain verbatim.
- Section 6(a) Worked example delegation prompt sketch (lines 256-281) — concrete enough to use; preserve.
- Section 2(d) assistant-wrapper subsection — decision-record requirements 1-7 all wired; do not remove.
- The frontmatter shape (`name`, `description`, `allowed-tools`; no `when-to-load:`) — Iron Law floor.

## Overall findings (cross-cutting only — Project findings not duplicated)

### F-O-01 — Brief discipline item 3 (5-Type vocab re-statement) was specifically added to defeat vocabulary drift; silent omission re-introduces the failure mode it guarded against
- Type: `design_flaw` | Domain: `process` | Disposition: `open` | Confidence: 75 | Severity: Medium
- Evidence: plan.md:401 brief discipline item 3 — explicit ask. SKILL.md grep returns 0 hits for any of the 5 Types. Project F-P-04 also flagged this; recording at Overall as the meta-failure mode (a brief that explicitly anticipated a drift was not followed).
- Why it matters: The brief contained an explicit guardrail against the exact failure history this campaign has. Dropping it is a process-discipline issue, not just a docs gap. Iron Law 11 (no improvement that games the tool) — the verifies block checks for ≥1 mention of "anti-pattern" but does NOT check for the Type vocab itself; the executor satisfied the machine-checks but missed the substantive brief item.
- Suggested direction: Add explicit Type re-statement, AND consider stronger verifies clauses in future briefs (grep for each of the 5 Types).

### F-O-02 — Stage-1 process check: verifies block in plan.md does not encode the missing-symlink anti-pattern requirement OR the git/SKILL.md cross-link
- Type: `process` | Domain: `process` | Disposition: `open` | Confidence: 75 | Severity: Medium
- Evidence: plan.md:368-388 verifies block checks: 8 H2 names, frontmatter shape, length, anti-pattern count ≥ 8, mistake citation count ≥ 1, absolute-path count ≥ 2, Skill Map row. It does NOT check for `'symlink'` count ≥ 1 (would catch F-P-01) or `'git/SKILL.md'` count ≥ 1 (would catch F-P-02). The executor satisfied all `verifies:` gates but the verifies block was incomplete.
- Why it matters: Recurring pattern — the verifies block is the only objective gate the executor cross-checks against. If items are listed in the prose brief but not the verifies block, they get dropped. Promote as a session mistake for project memory: **"Brief verifies block must encode every brief-prose 'MUST'."**
- Suggested direction: Promote to project mistake at Wrap-up. (Domain `process`; `mistake-candidate: true`.)

## Overall verdict

- Critical/≥75: 0; High/≥50: 2 (F-P-01, F-P-02 — both attributed to Project)
- Threshold: any High ≥50 → REVISE
- **Overall verdict: REVISE.**

### REVISE direction (for manager + user discussion)

Two surgical edits close both High findings:

1. Add Anti-pattern #9 (Section 8) — "Codex skill ships only `.claude/skills/codex/SKILL.md` and forgets `.agents/skills/codex` directory symlink. Both symlinks MUST exist — dogfood requires codex to load its own skill via `.agents/skills/codex`. Verify via `test -L .claude/skills/codex/SKILL.md && test -L .agents/skills/codex` after ship."
2. Add explicit cross-link in Section 5 — "See `git/SKILL.md` § background-mode for the canonical background-job pattern reused here." (Per Cross-Link Manifest #9.)

Optional Medium follow-ups: add 5-Type vocab re-statement (F-P-04 / F-O-01); add I*/E* witness IDs inline (F-P-03); add note on detecting codex installation status (F-U-02).
