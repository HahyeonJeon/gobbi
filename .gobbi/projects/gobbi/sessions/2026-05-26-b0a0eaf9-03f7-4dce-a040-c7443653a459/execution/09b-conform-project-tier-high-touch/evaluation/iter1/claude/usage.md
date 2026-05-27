# Usage Perspective — T9b conformance (commit 2e24dfe)

Focus: a future agent/user retrieving and acting on these docs.

## Results
- **Retrieval by frontmatter**: tools reading `type`/`scope`/`status`/`disposition` now get uniform, valid values across all 35 docs — backlog triage (`disposition: open|deferred`) is queryable, type filters work (no more `journal`/`general` off-enum values). Strong usability win.
- **§4.5 gate clean**: a future conformance sweep over these 5 dirs prints nothing — no false alarms, no residue to chase.

## Findings

### USAGE-1 — Coordinate-first titles degrade scan/search for the backlog reader
- **Type:** general · **Domain:** docs-quality · **Severity:** Medium · **Confidence:** 100 · **Disposition:** open
- **Evidence:** The 5 `# Item N-N …` H1 titles (see AES-1) mean a user scanning the rendered backlog index or grepping titles sees "Item 1-3", "Item 1-2", "Item 2-1" as the lead token. Two docs share `Item 1-3` and two share `Item 1-2` as their lead — so an alphabetical/lead-token sort collides and buries the actual subject.
- **Why it matters:** the user's mental model is "what is this backlog about," not "which plan row produced it." Leading with the row forces a second read to reach the subject; the duplicate `Item 1-X` leads actively impair disambiguation. Lower severity than the false-claim aspect (Project PROJ-1) because the subject is recoverable mid-line.
- **Suggested direction:** subject-first rewrite (same as AES-1).

## Must-preserve
- Uniform queryable backlog `disposition` and valid `type` enum across the set.

VERDICT: REVISE
