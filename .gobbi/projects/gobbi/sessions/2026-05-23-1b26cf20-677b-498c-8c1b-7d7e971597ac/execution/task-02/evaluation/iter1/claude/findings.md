# Findings — Task 02 Commit 97ae373 (Claude Iter1)

Perspective: overall (cross-perspective synthesis per delegation).

## Finding F-01 — P2 procedure body still framed as Execution-start (Medium / Confidence 75)

- **Type**: design_flaw
- **Domain**: docs-sync (skill internal consistency)
- **Disposition**: open

**Evidence.** git/SKILL.md lines 155-163. New invocation note (155) declares "P2 is invoked from Configuration row 5.5 … not from Execution start. The Execution-start invocation path is retired." But the immediately-following P2 body (line 157) begins with "**For each task entering Execution:**" and step 5 says "Pass the absolute worktree path to every delegation prompt that operates on this task" — both phrasings are per-task / Execution-time framings that contradict the once-per-session row-5.5 model the note just announced.

The session-foundations-bundle-b architecture (Ideation T1) replaces *per-task* worktree creation with *per-session* worktree creation at row 5.5. The added note announces the shift; the surrounding procedure body still describes the old per-task shape. A reader who follows the body literally will still create one worktree per task.

**Why it matters.** Inconsistency inside a single Procedure section trains agents to ignore the qualifier when it disagrees with surrounding steps. The whole point of T1-I-T1.c is to retire the Execution-start invocation; leaving the per-task language in place undermines that retirement and reopens the very class-of-bugs (multiple worktrees per session) the bundle is supposed to close.

**Suggested direction.** Either (a) reword P2 body's "For each task entering Execution" to "For the session entering Configuration row 5.5" + drop step 5's "every delegation prompt" framing (now once-per-session), or (b) split P2 into two named procedures (P2a once-per-session worktree create at Configuration, P2b per-task delegation passthrough). Either choice is the manager+user's call.

Note: this finding does not block the plan-spec verifies (which only test grep counts and symlink), but it does degrade the *substantive* contract Iron Law 8 demands (every implementation change reflected in documentation — coherently, not just literally).

## Finding F-02 — Memory Access Matrix row mixes "who writes" with implementation prescription (Low / Confidence 75)

- **Type**: scenario_gap
- **Domain**: docs-quality
- **Disposition**: open

**Evidence.** Line 31, the new "Session notes / mistakes" row now embeds:
> "Worktree-relative path construction via `git -C "$worktreePath" rev-parse --show-toplevel` for symlink + commit operations."

The Memory Access Matrix is a tier-boundary table (Reads / Writes columns describing *role permissions*). The new sentence is implementation guidance about how to compute paths — it belongs in P2 / P3 / Preparation `generate-now` body, not in a permissions matrix.

**Why it matters.** Matrix cells become difficult to scan when they smuggle procedure detail. Future readers patching the matrix have to disentangle "role rules" from "how-to" prose. Also: the rev-parse pattern is specifically called out in ideation for the **Preparation `generate-now`** path (sub-step-d-design-iter1.md line 61) — duplicating it in the git/SKILL.md matrix risks the two copies drifting out of sync when Task 03 lands.

**Suggested direction.** Trim the matrix cell to role+permission shape; move the rev-parse sentence into the Critical rule paragraph (line 33) where it's procedurally relevant, or into P3/preparation where the symlink-generation actually happens.

## Finding F-03 — Critical rule inverts prior contract; absent versioning context (Low / Confidence 50)

- **Type**: assumption_risk
- **Domain**: docs-sync
- **Disposition**: open

**Evidence.** Pre-existing rule (now removed): "session writes (notes, mistakes, project memory drafts) MUST use the main tree's absolute path, never the worktree's." New rule (line 33): "MUST use `session.json.git.worktreePath` as the absolute root when that field is set… fall back to the main tree's absolute path."

This is a substantive inversion of a previously-firm "never the worktree's" rule. The diff is faithful to ideation T1-I-T1.b. However, no mistake entry or rule-precedence note explains *why* the prior rule existed (audit-trail durability vs PR reviewability split — surfaced in ideation iter2 line 87) so a future reader hitting both the new rule and the old "1829fa3 witness" mistake context has no anchor explaining the shift.

**Why it matters.** Mistake skill discipline: when a previously-locked rule flips, the inversion should leave a breadcrumb. The commit message captures it; the skill body doesn't reference the prior rule's origin or what changed. Low severity because the new text is internally coherent, but a brief "Why this changed" note (or pointer to bundle-b ideation anchor) would harden the rule against accidental re-reversal.

**Suggested direction.** Optional one-line cross-reference to the ideation anchor in conventions.md or as a paragraph after line 33: "(Updated 2026-05-24: prior single-tree rule split into worktree-first + direct-mode fallback per session-foundations-bundle-b ideation T1-I-T1.b — see commit 1829fa3 for the failure mode this addresses.)" — manager + user decide.

## Must-preserve list (do not regress in remediation)

1. **All six plan-anchored verifies still pass** — keep grep count ≥ 2, keep symlink `-L` shape, keep single-file scope, keep AI-Provenance-Record trailer with exact session/task IDs.
2. **Transcript-in-home note** (line 31 trailing sentence) — this is the *correct* answer to "what about transcripts?" and was not in the prior text. Preserve it.
3. **Direct-mode fallback wording** ("when `worktreePath` is null (direct mode)") — preserves Iron Law 4 (scope-bounded) by not over-claiming worktree-first universally.
4. **Cite to orchestration/SKILL.md Step 1** (P2 note line 155) — keeps the cross-skill link tight so the row 5.5 home is unambiguous.
5. **Commit grammar + AI-Provenance trailer form** — both correct, both honor `git/conventions.md` and Principle 11 (no tool-gaming).

