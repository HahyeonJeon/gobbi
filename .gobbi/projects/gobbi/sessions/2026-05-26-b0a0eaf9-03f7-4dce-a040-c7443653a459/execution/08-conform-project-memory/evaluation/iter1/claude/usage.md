# Usage — T8 conform features/project-memory (iter1, claude)

## Artifact Summary + Memory reads
(See project.md.) Usage lens: can a zero-context future-session reader understand each doc standalone? Memory reads: memorization/rules.md §4.1 (positive bar), execution/evaluation.md Usage seeds.

## Locked Frame (Stage 1)
S1 each doc is self-contained for a zero-context reader — [c] no load-bearing unresolved coordinate.
S2 provenance recoverable from frontmatter — [c] session + created present on all 4.
S3 durable cross-refs still resolve — [c] PR #266/b9970dc, design §8 LOW-16, SKILL.md:224 retained.
S4 (adversarial) de-cryption removed a reference a reader actually needs — [c] check each removal.
not-applicable (a11y/i18n): pure server-side markdown memory docs; no UI strings, no locale-sensitive ops.

## Per-scenario per-check results
- S1: PASS. README, changelog, decision, design each read top-to-bottom without needing the originating session open. The decision states question→resolution→evidence→action; the design states direction→rationale→validation→cross-links.
- S2: PASS. `session` (7ea62d36 / a10c82d6) + `created` carry provenance per §4.3; git log carries the rest.
- S3: PASS. Durable references kept: "PR #266 (b9970dc)", "design doc §1.2/§1.3/§8 LOW-16", "memorization/SKILL.md:224", "session 2026-05-22-bac669ad" (witness pointer in design rationale). These are stable, resolvable anchors — correctly NOT de-crypted.
- S4: PASS. Removed items (I6, item B, Concern 2, Task 05) were session-internal coordinates with no resolvable meaning to a future reader; their removal improves usability. The substituted prose preserves the actual content (e.g., "project-memory secondary routing" preserves the §1.3 meaning that "T02/T04" obscured).

## Typed findings
None at PASS threshold. Each doc is usable standalone by a fresh reader.

## Low-confidence appendix
(none)

VERDICT: PASS
