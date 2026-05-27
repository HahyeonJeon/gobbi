# Evaluation — Usage Perspective (Claude)

## Frame
Can a future agent/user actually USE these conformed docs — find them, parse the frontmatter, and act on the body without the session?

## Verified
- **Machine-parse:** 9 base keys parse cleanly on all 15 (YAML well-formed; verified via python frontmatter split). Tools reading `type`/`status`/`session`/`feature` get valid values. PASS.
- **Findability:** slugs name subjects; type subdirs correct — an agent grepping by concept will land the right file. PASS.
- **Actionability:** decisions state conclusion+rationale; design docs state chosen direction; discussions state Q/answer/impact. A zero-context reader can act on each conclusion. PASS (with the minor footer-coord residue noted by aesthetics/risk).

## Findings
**F-USAGE-1 — out-of-scope observations correctly NOT treated as T2 defects** — Type: `general` · Domain: `process` · Severity: Low · Confidence: 75 · Disposition: deferred
Evidence: executor flagged (a) extra allowlist keys appearing on some docs and (b) near-duplicate decisions docs (`constraints-body-block-kept-per-h2-lock.md` vs `constraints-body-block-convention-deferred-to-planning.md` cover overlapping subject matter). Confirmed both are real observations but correctly OUT of T2 scope (T2 = frontmatter+de-crypt mechanical conformance). The near-duplicate pair is a latent atomicity/merge question for a future pass, not a conformance failure. Why it matters: tracked, not lost. Direction: defer to a content-curation pass; user decides.

## Must-preserve
- Clean machine-parseable frontmatter; subject-named findability.

VERDICT: PASS
