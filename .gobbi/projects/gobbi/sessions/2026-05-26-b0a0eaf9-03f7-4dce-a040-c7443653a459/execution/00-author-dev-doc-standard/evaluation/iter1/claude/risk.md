# Risk perspective — T0 §4 (iter1, claude)

**Lens:** Failure modes, corruption paths, false-positives/negatives, gaming, downstream blast radius.

## FIX-1 safety analysis (the highest-risk surface)
The predicate's danger is a STRIP that destroys a legitimate key. I traced both directions:

- **Corruption path (strip legit key)?** The only conditional key is `disposition`. Predicate strips `disposition` ONLY when NOT under backlogs/. I verified: 41 backlog files carry `disposition` and the gate/predicate leave all 41 alone. Safety invariant holds. The base-key + per-type-extension allowlist (§4.4 final para) explicitly lists name/description/type/scope/feature/status/created/session/tags + verdict/review_kind/subject/priority/domain — none can be stripped. No corruption path found.
- **Miss path (legit-looking leak survives)?** The gate matches `^key:` anchored at line start — frontmatter keys are line-anchored, so it won't miss a real key nor match an in-body mention. Both spellings covered via `[-_]`. The ONE residual miss: `addressed-by` (4 files) is not in S, so it survives (see PR-1 in project.md). Confirmed it is a real provenance leak that the gate ignores.

## Other risks
- **Append safety:** pure append, 0 deletions — zero risk to §1-3.
- **Gaming (Iron Law 11):** §4 is a quality bar, not a metric an executor games. The gate counts leak FILES; an executor cannot "pass" by gaming wording — they must actually strip keys. No Goodhart surface introduced.
- **Archive blast radius:** §4.6 + every command's `-not -path '*/archive/*'` means a future retrofit sweep cannot mutate frozen history. Verified the gate excludes archive. Good containment.
- **Downstream:** T0 is the foundation 24 tasks verify against. A wrong S-set or a corrupting predicate would propagate. The predicate is non-corrupting; the only propagating gap is the `addressed-by` omission (Low).

## Findings
**RK-1 — `addressed-by`/`addressed_by` leak survives the gate (Type: scenario_gap; Domain: process; Disposition: open; Confidence: 75; Severity: Low)**
- Evidence: census `addressed-by:` ×4; not in S; gate regex omits it. Downstream conformance waves built on this S will leave these 4 files non-conformant.
- Why it matters: foundation completeness — but Low because it is 4 files of a provenance key, non-corrupting, and the gap is inherited from the locked design (not introduced by the executor).
- Suggested direction: manager decides design amendment vs backlog defer.

## Verdict
PASS — no corruption path, no miss of corruption, archive contained, no gaming surface; one Low survivor-leak inherited from the design.
