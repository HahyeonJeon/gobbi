# T2 auto-mode.md — Usage Perspective (iter1, claude)

## Artifact Summary

(See `project.md`.)

## Memory reads

- Idea §4 / Plan T2
- `.claude/skills/discussion/SKILL.md`
- `.claude/skills/planning/SKILL.md`

## Locked Frame (Stage 1)

**Scenario U1.** A fresh Auto-mode manager at runtime can answer "do I ask the user now?" using just this doc.
- [x] §1 final paragraph: "if the decision is Auto-decide class, proceed" — explicit binary
- [x] §2.3 table gives one Auto example per category — recognizable patterns the manager will hit (mid-Planning library proposal / mid-Execution out-of-scope edit / mid-Wrap-up git reset)
- [x] §4 paragraph 2 codifies the decision sequence: "the first question is not 'should I ask?' but 'which class is this?'"

**Scenario U2.** Cross-skill navigation is unambiguous (path + section anchor on first mention).
- [x] §2.1: `discussion/SKILL.md § Always-Ask categories (override auto-decide; the user decides)` — both path and full section title
- [x] §2.4: `planning/SKILL.md § Core Principles § USER CHALLENGE` — path + nested-section anchor
- [x] §5: `orchestration/SKILL.md` line 405 contract — direct line reference (live: line 405 matches)
- [x] Cross-references foot section restates every referenced skill with the same anchors

**Scenario U3.** Defaults are operator-readable at 3 a.m.
- [x] §3 table has Setting / Auto default / Notes columns — every row independently parseable
- [x] Notes column explains semantically loaded values (e.g., "skip is a power-user per-session override")

**Scenario U4 (adversarial).** A manager reading the banner ("bias toward working without stopping") tries to rationalize past an Always-Ask category.
- [x] §4 explicitly anticipates this anti-pattern: "A manager reading the banner's 'keep going' language and using it to rationalize past an Always-Ask category is violating the Always-Ask contract, not following the banner."
- [x] §4 paragraph 2 gives the corrective ordering ("which class is this?" before "should I ask?")
- [x] §2.2 codifies the override of `discuss.mode: agent`: Always-Ask fires "regardless of any per-step `discuss.mode: agent` setting" — the exact rationalization vector is named and closed

## Stage 2 — Usage verdict

- **Verdict: PASS.**

## Findings

None at Conf ≥ 50.

## Low-confidence appendix

- (Conf 25) A "Decision-flow checklist" boxed sub-section at the foot (Auto-decide → Always-Ask → USER CHALLENGE) would compress the §1+§2+§4 algorithm into one scannable widget. Not a gap — §4 paragraph 2 already codifies it in prose — but operator-friendly.
