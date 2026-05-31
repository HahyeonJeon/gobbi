# Evaluation — Risk perspective (Claude, iter1)

**Verdict:** PASS

## Stranded inbound references (live docs only; sessions/ and archive/ excluded)
Grepped `.claude`, `skills/`, `.gobbi/projects/gobbi/skills`, `.gobbi/projects/gobbi/rules`, `.gobbi/projects/gobbi/backlogs`, `agents/` for every old token:
- `Specificity Is the Only Currency` — 0 hits ✓
- `REFUSE TO TRANSACT IN VAGUENESS` — 0 hits ✓
- `Witness-bound` (title) — 0 hits ✓
- `NO CHANGE WITHOUT A REAL MOTIVATOR` — 0 hits ✓
- `Metrics Are Signals, Not Targets` — 0 hits ✓
- `Iron Law Index` (deleted section) — 0 hits ✓
No stranded title/Iron-Law/index reference in any LIVE doc.

## Residual "witness" usage (informational, NOT a defect)
The word `witness` still appears in two live backlogs and one P14 example, but each is legitimate, not a stranded P10 title reference:
- principles/SKILL.md:390 — the INTENTIONAL `"a witness"` counter-example inside P14 (user-locked). ✓
- backlogs/ci-symlink-integrity-check.md:29 and backlogs/evaluation-perspective-for-dev-doc-quality.md:27 — use "witness" as a generic English noun ("witness count", "a witness that...") and one parenthetical "(per Principle 10, witness-bound work)". These were OUT OF SCOPE for this surgical pass (commit standardized only P10, the P12 cross-ref, and the hooks watchlist). The ci-symlink backlog's "(per Principle 10, witness-bound work)" is now a soft drift (concept word no longer matches P10's title) but is a deferred-backlog file, low blast radius, and arguably out of the locked scope. See R-1.

## Cross-reference integrity
- P12's cross-ref (SKILL.md:285) reads "link back to Principle 10's trigger rule" — was "witness rule". The referent concept ("trigger") exists in P10. NO broken cross-reference. ✓
- orchestration:44 and backlog:29 point to the new P6/P10 titles correctly. ✓

## Behavioral regression
None. Each rewritten principle preserves its behavioral requirement (verified OLD vs NEW). No discipline weakened or removed.

## P14 reach vs discussion skill
P14 governs "all agent-authored text" (382, 386). The `discussion` skill exists (`.gobbi/projects/gobbi/skills/discussion/SKILL.md`). P14's Mechanism (400) explicitly delineates: "The `discussion` skill's anti-sycophancy rules cover a different defect ... — empty or hedging phrasing — and are complementary to this principle." No contradiction with the discussion skill's remit. ✓

## FINDINGS

### R-1 — Residual "witness-bound work" concept-word in a deferred backlog (soft drift)
- **Type:** assumption_risk / **Domain:** docs-sync / **Disposition:** open
- **Severity:** Low / **Confidence:** 75
- **Evidence:** `.gobbi/projects/gobbi/backlogs/ci-symlink-integrity-check.md:29` — "Per Principle 10 (witness-bound work), a CI guard for a zero-witness pattern is defensible only as a deferred item." The parenthetical still uses the retired concept word "witness-bound work" as a gloss for P10.
- **Why it matters:** after standardizing P10 to "trigger", a reader who greps P10's current title will not find "witness-bound work"; the gloss now mislabels the principle. Low impact (deferred backlog, not an instruction doc), and the commit deliberately scoped concept-word standardization to the hooks watchlist only — so this may be an intentional scope boundary rather than a miss.
- **Suggested direction:** decide whether P10 concept-word standardization extends to all live backlogs or stops at the locked scope (P10 body + P12 xref + hooks watchlist). User's call.

## Must-preserve
- The intentional `"a witness"` example at P14:390 (locked) — do not "fix" it.
- Zero stranded title/Iron-Law references — the surgical rename is clean on the in-scope surface.
