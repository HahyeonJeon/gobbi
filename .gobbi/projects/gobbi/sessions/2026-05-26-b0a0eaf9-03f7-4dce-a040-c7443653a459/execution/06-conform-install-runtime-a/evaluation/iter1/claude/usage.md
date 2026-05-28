# Usage perspective — T6 conform install-runtime

Lens: can a future agent / the user USE these conformed docs cold? Does the §4 standard's intended consumer benefit land?

## Checks
- **Frontmatter is tool-readable** — PASS. 9 base keys present on all 24, valid YAML, `type`/`scope`/`feature` consistent → tools that read base frontmatter (gobbi docs commands, drift detector) get a uniform surface.
- **Body is self-contained for a zero-context reader (the §4.1 goal)** — PARTIAL. Body PROSE reads cold (de-crypt strong). But the entry point — the H1 title — fails the cold-read test on 6 docs.
- **`## Source` footers point at resolvable artifacts** — PASS. The 10 design/discussion `## Source` footers cite `rawdata/draft-iter3.md:NNN` with descriptive labels — exactly the §4.3-sanctioned "single Source footer for a reader who wants full detail."

## Finding

### F-USAGE-1 — cold reader hits an unresolvable coordinate at the first line of 6 docs
- **Type:** assumption_risk · **Domain:** docs-quality · **Disposition:** open · **Confidence:** 85 · **Severity:** Medium
- **Evidence:** A future agent opening `session-start-hook-script-decisions.md` cold reads `# T1 Decisions Log` then `## Dual-system EVAL iter1` — `T1` and `iter1` reference a vanished session task graph the reader cannot resolve. Same for `# T04 —`, `# T3 dual hook registration`, `# T3 mechanism`, `# T3 schema gap check`, `# D-3-3 —`. The §4.1 deliverable promise ("zero-context reader understands end-to-end") is the whole point of the standard; a leading coordinate breaks it at the threshold.
- **Why it matters:** §4 exists precisely so a later session can reuse these decisions without the originating session. The body delivers that; the title undercuts it. Medium because the body recovers — a determined reader gets past the title.
- **Suggested direction:** confirm scope, then de-crypt titles to concept-first (e.g. `# T1 Decisions Log` → `# SessionStart hook script — decisions log`).

VERDICT: REVISE
