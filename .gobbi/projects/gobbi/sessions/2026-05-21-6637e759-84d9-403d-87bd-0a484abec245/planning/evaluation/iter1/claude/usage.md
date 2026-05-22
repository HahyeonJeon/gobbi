# Planning iter1 — Usage perspective (Claude)

## Artifact Summary + Memory reads (Stage 0)

**Target**: Can a fresh executor use the Plan without coming back to the leader or user?

**Memory reads**: `principles` (Iron Law 4, 12), `skills/planning/evaluation.md` § Usage, `skills/execution/SKILL.md` § scope discipline.

## Locked Frame (Stage 1)

Scenarios:
1. Fresh executor given a single task in isolation can begin work from inputs/outputs/verifies.
2. The executor knows which file(s) to open and which test(s) to run.
3. Known failure modes are listed; no surprise dependencies.
4. Inter-task hand-off uses identical names across producing + consuming tasks.
5. (Adversarial) Executor needs to ask "what does X mean here?"

## Per-scenario per-check results

**S1 — fresh executor begins from inputs/outputs/verifies**

Task 01: `inputs: []`, `outputs: [tag-pre-reset-2026-05-21-local, tag-pre-reset-2026-05-21-origin]`, `verifies: git rev-parse ... and git ls-remote ...`. Concrete enough. PASS.

Task 02: `inputs: [tag-pre-reset-2026-05-21-local, tag-pre-reset-2026-05-21-origin, <sweep-branch>-name, <worktree-absolute-path>]`. The first two are emitted by Task 01; the last two are manager-fill-at-delegation. PASS — though see F-CL-U-01 below on `inputs:` semantics.

**S2 — knows which files**

Task 02 `files:` is a long but explicit list — every tracked file is named; the 49 historical bare-UUID dirs are by predicate ("listed by predicate, not by name") with the predicate spelled out in the File map (`find … -maxdepth 1 -mindepth 1 -type d ! -name '...' ! -name '...' -print0 | xargs -0 rm -rf`). PASS.

**S3 — known failure modes**

Stage E.2 gate is documented with the NEEDS_CONTEXT fall-through (line 113 in main.md, line 277-278 in draft-iter1.md). The 3 named mistakes are cited and inlined into specific gates. Manager-side NEEDS_CONTEXT is also documented (line 587). PASS.

**S4 — inter-task handoff naming**

Task 01 `outputs:` includes `tag-pre-reset-2026-05-21-local` and `tag-pre-reset-2026-05-21-origin`. Task 02 `inputs:` includes both literal strings. PASS (verbatim match).

**S5 — adversarial: "what does X mean here"**

I read Task 02 in isolation, simulating a fresh executor. Items that would prompt a clarifying question:

1. **`<sweep-branch>` placeholder** — defined by the manager at delegation; OK insofar as the manager fills it. The Plan documents this expectation (line 583: "Suggested branch name … `chore/<issue-num>-repo-reset`"). PASS — but the executor needs to receive the actual name in the delegation prompt; that's a manager responsibility.

2. **Stage E.1 commit boundary** — see F-CL-S-01 (Structure perspective). Fresh executor reading just Task 02 cannot tell whether E.1 makes its own commit or extends D's commit. The verifies block C says "≥4 commits" without saying which Stages map to which. **This is a Usage gap (would require asking).**

3. **The 13 placeholder subdirs** — Task 02 `files:` enumerates them with `op: modify`, not `op: delete + create`. A fresh executor reading `{ path: ".gobbi/projects/gobbi/archive/", op: modify }` would need to consult main.md / File map prose to learn that "modify" here means "git rm -r <subdir>/* + write README.md + git add". The op-keyword does not carry the semantics.

4. **"Stage B/C/D+E.1/F labels per Implementation Checklist"** (verifies block C) — the executor must read the Implementation Checklist to know the commit labels. The Plan does cite the path: `ideation/artifacts/implementation-checklist.md`. PASS conditional on the executor delegation prompt loading the checklist as a Required Input.

## Typed findings

### F-CL-U-01 — `inputs:` for Task 02 uses identifier strings without explicit "carrier" semantics
- **Type**: assumption_risk
- **Domain**: process
- **Disposition**: open
- **Confidence**: 50
- **Severity**: Low
- **Evidence**: Task 02 `inputs: [tag-pre-reset-2026-05-21-local, tag-pre-reset-2026-05-21-origin, <sweep-branch>-name, <worktree-absolute-path>]`. The first two are abstract identifiers from Task 01's outputs — they don't carry actual values. The executor checks them via `git rev-parse pre-reset-2026-05-21` (which it must infer is the right verification). The last two are concrete strings the manager must fill.
- **Why it matters**: A fresh executor sees four input names and must figure out for itself: (i) which are "things to be passed by string value at delegation time" vs (ii) which are "things that should exist at session start that I should verify". The Plan does not explicitly classify them.
- **Suggested direction**: Add a one-line per-input note ("verify-by: `git rev-parse pre-reset-2026-05-21`" for the tag inputs; "manager-fill" for `<sweep-branch>-name` and `<worktree-absolute-path>`). Or move to a `requires:` shape consistent with other plans.

### F-CL-U-02 — Stage C `op: modify` semantic is overloaded ("delete contents + write stub README")
- **Type**: checklist_gap
- **Domain**: docs-sync
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Task 02 `files:` for the 13 placeholder subdirs all use `op: modify` (draft-iter1.md lines 204-217). The File map prose at lines 81-83 ("Per subdir: `git rm -r <subdir>/*` (tracked content) + `rm -rf <subdir>/*` (untracked stragglers), then write one-line stub `<subdir>/README.md`") is the actual semantics. A fresh executor reading the YAML `op: modify` may interpret it as "edit some file" rather than "wipe contents + write stub README." The keyword discrepancy is real for executor cognition.
- **Why it matters**: This is the exact `executor-boundary-extension-without-asking` adjacency — the executor's interpretation of a vague `op` could either narrow ("modify means a single-file edit, so skip") or broaden ("modify means I can do anything"). Plan needs the per-op semantics declared.
- **Suggested direction**: Either split into separate `{op: delete-contents}` + `{op: create, path: <subdir>/README.md}` entries OR add a `## File ops semantics` section to the Plan that defines `op:` values (`delete | modify | create`) and what each entails.

### F-CL-U-03 — Plan claims "≥4 commits" on sweep branch but commit boundaries are ambiguous (cross-ref F-CL-S-01)
- **Type**: checklist_gap
- **Domain**: process
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Task 02 `verifies:` block C: "`git log --oneline develop..<sweep-branch>  → ≥4 commits (Stage B/C/D+E.1/F labels per Implementation Checklist)`." The bracketed annotation groups "D+E.1" into one commit, but Implementation Checklist line 61 says Stage D commits FIRST, then Stage E.1's `git add` runs — leaving "D+E.1 as one commit" requiring either an amend (risky) or an interpretation that E.1's `git add` joins a later commit (not specified).
- **Why it matters**: If the executor commits E.1 separately, the count is 5, not 4 — `≥4` still passes, but the bisect-safety the Implementation Checklist promised (per M-1) is now different from what the Plan documented. If the executor amends Stage D's commit, that's a `git commit --amend` operation the Plan does not explicitly authorize (it's allowed on non-pushed branches, but the Plan does not say so).
- **Suggested direction**: Identical to F-CL-S-01 — add an explicit Stage E.1 commit-or-amend instruction.

## Low-confidence appendix

- "Manager-fill at delegation time" for `<sweep-branch>` — the Plan documents this expectation at lines 582-583, which is at the very end of the rawdata. If the executor delegation prompt template doesn't surface this, the executor would see `<sweep-branch>` as a literal angle-bracketed token and might emit NEEDS_CONTEXT. Confidence 25 because the manager owns prompt construction; this is a process risk, not a Plan defect.

## Must-preserve list

- The Manager-ops §1-12 explicit sequence (executor doesn't need to do these; manager owns them).
- The 14 Success Criteria coverage matrix with per-criterion ownership.
- Explicit citation of Implementation Checklist path so the executor can load it.

## Verdict: REVISE

F-CL-U-02 (Medium/75) + F-CL-U-03 (Medium/75) together push verdict to REVISE. Both are ambiguities a fresh executor would have to resolve via NEEDS_CONTEXT — exactly what the Plan is supposed to prevent.
