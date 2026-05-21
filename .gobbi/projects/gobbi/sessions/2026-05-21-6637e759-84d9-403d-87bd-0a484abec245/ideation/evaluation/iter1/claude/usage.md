# Ideation iter1 — Usage perspective (claude)

## Artifact Summary + Memory reads

See `project.md`. Usage consumer = the Planning loop + the Execution loop's executor + the future-self reading this in 2 weeks.

## Locked Frame (Stage 1)

Seed scenarios from `ideation/evaluation.md` § Usage. Updates:

- **scenario_gap S-USE-NEW-1**: "Executor reading Stage E can determine without ambiguity which bullets enter the commit vs which are FS-only operations." (Same risk surface as F-S-01 from a different angle.)
- **scenario_gap S-USE-NEW-2**: "Planner reading Stage F can correctly distinguish `-d` vs `-D` per branch without re-deriving ancestry." Verified YES — artifact lines 258–261 name each branch with the `-d`/`-D` flag.

Cross-cutting: Observability `not-applicable` (no runtime logging surface in the artifact); Accessibility `not-applicable` (no UI).

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Planner produces task list without re-asking user | Each decision specific enough | YES | 15 locks; each maps to a Stage bullet |
| Executor knows which file/module to change | Paths + commands | YES | Every bullet names absolute path + git/fs command |
| Maintainer at 3am understands what + why | Self-evident | YES | Top summary + Framed Problem + Decisions Log |
| Failure modes communicated | Each named failure has expected impl response | PARTIAL — see F-U-01 |
| Wrong mental model risk | Vocab consistent | YES | "bare-UUID" / "date-prefixed" / "sweep commit" used consistently |
| **S-USE-NEW-1 Stage E commit-vs-FS clarity** | Executor distinguishes | PARTIAL — see F-U-01 (same root as F-S-01) |

## Typed findings

### F-U-01 — Executor consuming Stage E cannot determine the verification gate for the bare-UUID "LAST" delete

- **Type**: `design_flaw`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: High
- **Evidence**: Stage E line 251 ("`rm -rf .gobbi/projects/gobbi/sessions/6637e759-...` — runs AFTER the workflow's writes are committed") is the only place this ordering is specified. But "the workflow's writes are committed" is ambiguous:
  - Does it mean "Stage D + Stage E's `git add` is committed (sweep commit 3)"? 
  - Or does it mean "the full sweep PR is merged into `develop`"?
  - Or "all Memorization + Wrap-up writes for THIS session are committed"?
  
  These three interpretations have very different timing. The artifact's D9 (line 343) says "the LAST step in Stage E, after all THIS-workflow session-memory writes are committed" — implying interpretation 1 (mid-sweep). But the artifact's Stage F (worktree+branch cleanup) and Stage G (PR open) come AFTER Stage E, meaning Wrap-up's outputs (which include the Memorization staging files for the session) are written *after* this delete. Yet the staged backlog at `staging/backlogs/project/cli-regenerates-gobbi-gitignore.md` (already on disk) lives under THIS session's dir which IS being preserved — so that one is fine. The ambiguity bites Wrap-up's later writes.
- **Why it matters**: Per `principles` Principle 6 (refuse vagueness), the executor cannot defensibly run this bullet without picking one interpretation. Per `executor-rationalized-failing-verification-gate.md`, the executor must not rationalize ambiguity — they should NEEDS_CONTEXT. This is exactly the kind of spec gap that triggers a mid-execution interrupt.
- **Suggested direction**: name the precise gate, e.g., "after `git add .gobbi/projects/gobbi/sessions/2026-05-21-6637e759-...` is staged AND `git commit -m '<sweep msg>'` has run AND that commit's SHA is recorded in this session's session.json, the bare-UUID `rm -rf` runs as the next operation. Wrap-up writes that happen AFTER this delete go into the date-prefixed dir, which is preserved."

### F-U-02 — Stub README format reference points at `rules/stub-redirect-format.md` with explicit "without the supersession banner" carveout, but the rule doc itself doesn't describe placeholder stubs

- **Type**: `assumption_risk`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Medium
- **Evidence**: Artifact line 234 says "per `rules/stub-redirect-format.md`, but without the supersession banner — these are placeholders, not stubs for moved content." Verified `.gobbi/projects/gobbi/rules/stub-redirect-format.md` describes ONLY supersession stubs (lines 9: "A documentation file's content has been moved or absorbed into another file"). The rule explicitly excludes the "delete instead" case ("file has zero incoming links… retention has no historical-context value"). The placeholder stubs in this artifact aren't supersession stubs (no successor file to point to) and aren't deletion candidates (Q2 mandates keeping the dir + a README). So the artifact is citing a rule that *doesn't apply*.
- **Why it matters**: The executor reading Stage C bullet 4 will be confused: the cited rule has two variants (A: mapping table, B: narrative). Neither variant fits "one-line stub describing the dir's purpose". The rule's required structure (title with "— superseded" suffix, banner blockquote, etc.) is explicitly NOT what the artifact wants. The carveout "without the supersession banner" leaves the executor with ~3 of the rule's 6 required structural elements, and no positive guidance.
- **Suggested direction**: drop the rule citation; provide a 1-line concrete template inline in Stage C bullet 4 (which D4 already does at lines 316–317 — promote that template into Stage C itself). Or, file a follow-up: extend `stub-redirect-format.md` with a Variant C for "directory placeholder after content wipe".

## Low-confidence appendix

(none)

## Must-preserve list

- The Planner-friendly Implementation Checklist with per-stage labels and explicit critical-ordering invariants.
- D4's concrete stub template (lines 316–317) is the right level of specificity — promote it into the checklist itself.

## Verdict

REVISE — F-U-01 (High/75) triggers High≥50 → REVISE.
