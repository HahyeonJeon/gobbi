# Planning iter2 — Usage perspective (Claude)

## Stage 0 — Artifact summary

Target: iter2 draft Plan. Perspective: would a fresh executor reading the contract literally know what to do, what to verify, and what NOT to do?

## Stage 1 — Locked frame

- S-U1 Each `files:` op is unambiguous (no overloaded verbs).
- S-U2 Commit count + boundary is unambiguous (D-PLAN-06).
- S-U3 The "do NOT" list for each task is explicit (Special discipline cells).
- S-U4 Mistake-load timing is explicit.
- S-U5 NEEDS_CONTEXT triggers are enumerated.

## Stage 2 — Findings against iter1 ledger

| iter1 ID | iter1 verdict | iter2 disposition | Confidence | Evidence |
|---|---|---|---|---|
| F-CL-U-01 (`inputs:` lacks carrier semantics, Low/50) | open | **partial** | 60 | iter2 `inputs:` lines 262-265 now carry inline `# verify-by:` comments. The "carrier semantic" gap remains conceptually (it's still a list of identifier strings), but each entry now has a verifier so the gap is functionally closed for an executor reading the contract. |
| F-CL-U-02 (Stage C `op: modify` overloaded, Medium/75) | open | **addressed** | 100 | Lines 220-247 now uniformly emit `op: delete-contents` + `op: create` pairs for each of the 13 subdirs and the root README. Self-review § 6 (lines 547-555) defines the op vocabulary explicitly: `create`, `modify`, `delete`, `delete-contents`. No more overload of `modify`. |
| F-CL-U-03 (commit count ambiguous, Medium/75) | open | **addressed** | 100 | `verifies:` block C line 280 now asserts `git rev-list --count develop..<sweep-branch>` == 3 (was "≥4"). D-PLAN-06 (lines 655-661) is the authoritative explanation. Special discipline (line 460(d)) reinforces: "No `git commit --amend`". The boundary is fully spelled out. |

**New iter2-only findings:**

### F-CL2-U-01 — Task 02 Special discipline (d) "No `git commit --amend`" must travel to the executor's delegation prompt

- Type: assumption_risk
- Domain: process
- Disposition: open
- Confidence: 60
- Severity: Low
- Evidence: The "no amend" rule is in Agent assignments § Task 02 Special discipline (d) (line 460), the Decisions Log D-PLAN-06 (line 659), and the main.md table (line 27). It is NOT in Task 02's `what:` body or the `verifies:` block. The Plan is correct, but the executor's effective contract is the YAML task block plus the delegation prompt — the Plan-author needs to ensure the orchestrator copies the "no amend" rule into the executor's prompt.
- Why it matters: A sonnet executor reading only the YAML task block sees `verifies:` "exactly 3 commits" but no instruction against amend. It MIGHT use amend as a way to "consolidate" if it accidentally makes 4 commits. The rule needs to be in the loadable contract, not just in the meta-cell.
- Suggested direction: copy the "No `git commit --amend`" rule into Task 02 `what:` under "Critical ordering invariants" (it currently has 5 invariants; add a 6th: "No `git commit --amend`").

### F-CL2-U-02 — Manager §5b uses `-D` on two branches; the AskUserQuestion that authorizes them is referenced but not re-shown

- Type: assumption_risk
- Domain: process / git-discipline
- Disposition: open
- Confidence: 50
- Severity: Low
- Evidence: Line 357: "`-D` use is pre-authorized by Scope Contract § Q-G (the user's explicit lock); per `git/SKILL.md` Forbidden Operations this satisfies the Always-Ask category."
- Why it matters: `git branch -D` is in the Forbidden Operations table; the user pre-authorized via Q-G during Ideation. The Plan correctly cites the pre-authorization but does NOT capture the specific user-utterance reference (which Q-G option, which iter). The manager running this step might pause to re-confirm if the citation feels thin.
- Suggested direction: in Manager §5b, add a 1-line citation back to `ideation/artifacts/scope-contract.md § Q-G` to make the pre-authorization audit-traceable.

## Stage 3 — Usage verdict

iter1 had 3 Usage findings (1 Low/50, 2 Medium/75). iter2 fully addresses both Mediums; the Low is partially addressed (carrier semantics conceptual gap remains but functionally closed). Two new Low-severity Usage gaps surface around delegation-prompt completeness and `-D` audit-trail citation. None are High or Critical. **PASS.**

Verdict: **PASS**

## Must-preserve list

- The `delete-contents` op verb and the Self-review § 6 schema legend.
- Verifies block C `rev-list --count == 3` assertion.
- Special discipline cells in both Task 01 and Task 02 Agent assignments.
- D-PLAN-06 + D-PLAN-07 entries in Decisions Log.

```
STATUS: DONE
VERDICT: PASS
```
