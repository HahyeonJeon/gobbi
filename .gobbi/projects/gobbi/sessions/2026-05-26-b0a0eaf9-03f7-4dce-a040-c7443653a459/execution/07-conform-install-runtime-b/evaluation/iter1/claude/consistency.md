# Consistency — T7 conform install-runtime-b (commit 6f9dbf9)

## Artifact Summary + Memory reads
See project.md. Everything-that-changes-together check + no body reshaping (Iron Law 4) + no narrative deletion (design-literal-retire mistake).
Memory reads: as project.md; design-literal-retire mistake; memorization/rules.md §2.3/§4.3/§4.4.

## Locked Frame (Stage 1)
**No body section reshaping — only frontmatter + inline-coord + heading-line changes (Iron Law 4)**
- [ ] No paragraphs reordered/split/merged across sections
- [ ] Tables preserved in shape (rows/columns), only cryptic cell tokens de-crypted
- [ ] Section set changes limited to relocating provenance to `## Source`
**No narrative deleted; no non-S frontmatter key dropped**
- [ ] Every removed body line carried a session-coordinate or was reworded (matched addition); no evergreen knowledge lost
- [ ] `related`/legit extensions kept
**Frontmatter internally consistent (status vs disposition; session/created align) (adversarial: de-crypt creates a contradiction)**
- [ ] base `status` does not contradict backlog `disposition`
- [ ] `session`/`created` values are well-formed

## Per-scenario per-check results
- no section reshaping: YES — diff inspection of hook-latency, dot-gobbi, ci-symlink, mirror-policy, README, changelog-ref shows section bodies preserved; `## Context` narratives reworded in place; no reorder.
- tables preserved: YES — mirror-policy 4-row table identical shape (only Anchor-column tokens de-crypted + "(iter2)" removed); README Recent-activity + Subdirectories tables intact.
- section changes = provenance relocation: YES — removed sections (`## Anchor`, `## Addressed by`, `## Related`-with-eval-paths) contained ONLY load-bearing coords; replaced by `## Source` per §4.3. `## Rationale`→`## Why deferred` is a heading rename, content preserved.
- no narrative deleted: YES — every removed body prose line carries a coord (T3/D-3-3/iter<n>/COD-/CP-D-1/FIX/finding-id) or is reworded with a matching addition; the evergreen facts (resolver steps, race-condition analysis, jq-sync warning, v2.1.132) all survive in the additions.
- legit extensions kept: YES — references title/source/accessed/ref_type, README value_proposition, backlog disposition all preserved.
- status vs disposition no contradiction: backlogs carry base `status: active` + `disposition: open|deferred` — consistent with §2.2 (disposition narrows base status). YES.
- session/created well-formed: MOSTLY — see finding C1 (README malformed session id) + C2 (session-id format variance).

## Typed findings
- **Finding C1** — Type: general / Domain: docs-sync / Disposition: open / Confidence: 100 / Severity: Low. README frontmatter `session: a10c82d6-03f7-4dce-a040-c7443653a459` is malformed: it splices the worktree-branch token `a10c82d6` (branch session-2026-05-25-a10c82d6) onto the current task-session suffix `03f7-4dce-a040-c7443653a459`. The correct current session id is `b0a0eaf9-03f7-4dce-a040-c7443653a459`. This is newly authored by THIS commit (the diff adds the line). Evidence: `git show 6f9dbf9 -- README.md` adds `+session: a10c82d6-03f7-4dce-a040-c7443653a459`; task session dir is `2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459`. Why it matters: provenance is wrong; a tool keying on `session` to find the originating session dir would fail to resolve. FP-check: not pre-existing (commit-introduced), not style — a factual wrong value. Severity Low because §2.1 `session` is provenance metadata, no gate or runtime depends on it; but Confidence 100 (verified).
- **Finding C2** — Type: general / Domain: docs-sync / Disposition: open / Confidence: 100 / Severity: Low. `session:` value format is inconsistent across the 20: bare UUID (`1b26cf20-...`, `45388fa9-...`) vs date-prefixed (`2026-05-22-bac669ad-...`, `2026-05-23-1b26cf20-...`). §2.1 specifies `session: {session-id that created this}` without mandating the date prefix, so neither form strictly violates the schema, but the mix is a within-feature inconsistency. FP-check: largely Pre-existing (carried from source frontmatter) — capped Low.

## Low-confidence appendix
None.

VERDICT: PASS
