# Usage — T03 (commit 0632ad8)

## Artifact Summary + Memory reads
See project.md. Consumer = a fresh agent (any role) loading `mistake/SKILL.md` at session start, plus the future session that picks up the backlog. "Usage" = will the next consumer operate correctly from this doc alone?

## Locked Frame (Stage 1)

**S1 — a working-loop agent reading this knows exactly where to write and where NOT to write**
- [ ] Write surface (session staging) is unambiguous
- [ ] The non-write rule (project memory) is unambiguous, with the exception clearly bounded

**S2 — an agent constructing the staging path resolves `{session-id}` correctly**
- [ ] M2 row tells the agent the value comes from the delegation `session-id:` field
- [ ] M2 row tells the agent NOT to read `$CLAUDE_CODE_SESSION_ID`
- [ ] M2 row explains WHY (env var = subagent's own UUID, not parent's)

**S3 — the backlog reader knows the pickup triggers and the perpetual nature**
- [ ] `in-progress` status communicates "live, ongoing"
- [ ] N≥2 extraction trigger is concrete and actionable
- [ ] Perpetual-capture intent is explicit

**S4 (adversarial) — a tired agent at 3am follows the doc and writes to the wrong place**
- [ ] No path in the doc could lead a working-loop agent to write directly to `mistakes/`
- [ ] The Wrap-up exception cannot be misread as "any agent during Wrap-up may write"

## Per-scenario per-check results
- S1.1 YES — Matrix Session-staging row gives exact path + "the only surface agents write to" (line 23).
- S1.2 YES — every project/feature mistakes row + Constraints says READ-ONLY for working-loop agents, exception bounded to the Wrap-up assistant.
- S2.1 YES — "supplied by the delegation prompt's `session-id:` header field (the parent session's id)".
- S2.2 YES — "Do NOT read `$CLAUDE_CODE_SESSION_ID` for this value".
- S2.3 YES — "in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's." This is the correct causal explanation and matches the locked M2 intent (the contract's clause-3 phrasing "subagent's own UUID, not the parent's" describes the env-var's content, which the doc correctly attributes to the env var, not to the value to use).
- S3.1 YES — `status: in-progress`.
- S3.2 YES — "when ≥2 hooks-domain mistakes accumulate … extract a `gobbi-hook-authoring` project skill" — concrete and checkable.
- S3.3 YES — "This backlog is a **perpetual capture reminder**: it remains `in-progress` until the N≥2 extraction trigger fires or the domain is subsumed by a dedicated skill."
- S4.1 YES — no instruction permits a working-loop agent to write to `mistakes/`.
- S4.2 YES — exception is scoped to "the Wrap-up assistant" performing "promotion", not to any agent active during Wrap-up. Consistent with wrap-up/SKILL.md ("Wrap-up's WORK is the sole writer to project memory").

## Typed findings
(none at or above threshold)

## Verdict: PASS
The doc is operable by a fresh agent: write surface, non-write rule, the M2 path-resolution gotcha (with WHY), and the backlog pickup triggers are all unambiguous. Accessibility (scannable headings/tables) preserved.

## Low-confidence appendix
- US-LC-1 (Confidence 25, Low) — Type: general | Domain: docs-sync — The contract's clause-3 wording ("subagent's own UUID, not the parent session's") could be misread as "use the subagent's UUID". The doc resolves this correctly (env var = subagent UUID = the thing NOT to use). No defect; noting only that the contract phrasing itself is the ambiguous part, not the doc. Suppressed.
