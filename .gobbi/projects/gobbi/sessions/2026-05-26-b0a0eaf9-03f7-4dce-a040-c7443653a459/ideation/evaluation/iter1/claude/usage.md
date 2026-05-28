# Usage — Ideation eval (iter1, claude)

## Artifact Summary + Memory reads
(see project.md)

## Locked Frame (Stage 1)
**S1 — The Planner produces a task list without going back to the user.** Checks: every Design decision specific enough to start; scenarios map 1:1 to tasks.
**S2 — The Executor knows which file/section to change.** Checks: every cited insight has a path; names stable.
**S3 — A 3am maintainer understands what was built and why.** Checks: consumers named; terms defined or referenced.
**S4 — Failure modes the artifact names match what the work will exhibit.** Checks: each named failure mode has a corresponding expectation.
**S5 (adversarial) — A consumer forms the wrong mental model.** Checks: borrowed project vocabulary used with same meaning; overloaded terms disambiguated.
**S6 — Will the standard actually make docs better for the agent/human reader?** (user-perspective focus). Checks: the quality bar is objectively scorable (not vibes); the standard teaches GOOD (positive guidance), per mistake `naming-standard-needs-positive-guidance-not-just-blocklist`; the de-crypt rule produces self-contained bodies a zero-context reader can use.

## Per-scenario per-check results
- S1 YES — D1-D10 each give a chosen direction + validation; Scenarios (Golden/Edge/Failure, lines 94-96) map cleanly to Planning tasks. One residual the Planner must resolve: the exact per-type section contracts are listed in the Checklist (line 100) but their authoritative wording is deferred to Execution by design ("mechanism deferred to Execution", line 110) — acceptable for Ideation.
- S2 YES — every INT/EXT insight cites a path or URL; the cryptic-body example cites a real file (`features/git-workflow/design/worktree-create-before-session-stamp.md`) — I confirmed the file exists and the cited tokens (T1-I-2, COD-PROJ-001, draft-iter3.md:308) are present at lines 33/38/51. Evidence is followable.
- S3 YES — consumers named (line 60: "every future agent that reads project memory ... + the user"); terms anchored to rules.md + memory-map.
- S4 YES — failure scenario (no clear home → reclassify to notes/, never delete) matches mistake `design-literal-retire-instruction-without-replacement` and rules.md notes-type semantics.
- S5 YES — "13 types" matches `memory-map.md` line 73 ("the 13 project-memory types"); "base schema" matches rules.md §2.1; "staging-key" matches rules.md §2.3. Vocabulary is consistent with the project. NOTE: rules.md §2 frames the enum as "12 promotable + 4 feature-subdir-only", so "13" is the memory-map per-type-spec count, not the frontmatter-enum count — a reader could momentarily conflate the two counts (see C-2, owned by Consistency).
- S6 YES — Success Criterion 1 ("an evaluator can score a memory doc against [an] objective checklist, not vibes") + Criterion 3 (per-type section contract) + Criterion 4 (lead with positive guidance) directly answer "will this make docs better": the bar is scorable, teaches GOOD, and the self-contained-prose rule (D5) is the right consumer-facing win. The standard correctly applies the project's own naming-standard mistake to itself.

## Typed findings
(none rising to a usage-blocking level; C-2 below is owned by Consistency)

## Per-perspective verdict: PASS
The artifact is consumable by Planner and Executor; the standard is designed around the actual reader (zero-context next session) and scorability. Strong on the user-perspective focus the brief asked me to weight.

## Low-confidence appendix
(none)
