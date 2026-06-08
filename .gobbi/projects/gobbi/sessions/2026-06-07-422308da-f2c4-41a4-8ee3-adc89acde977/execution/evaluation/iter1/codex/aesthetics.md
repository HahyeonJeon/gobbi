## Artifact Summary + Memory reads

Artifact: docs-only diff `HEAD~3..HEAD`.

What / Why / How: same as `project.md`; this perspective checks plainness, scannability, and local writing conventions.

Memory reads: Plan, Idea, `principles/SKILL.md` Principle 7, `mistakes/principle-text-lead-with-imperative-not-agent-psychology.md`, full changed files with line numbers.

## Locked Frame (Stage 1)

Scenario: new rule text is scannable and direct.
- Check: section 7 has clear subheaders and a quick-guard table.
- Check: the text states concrete MUST/MUST NOT rules instead of vague guidance.

Scenario: prose does not hide the imperative behind agent psychology.
- Check: new section 7 avoids relying on manager mental-state language.

Adversarial scenario: a polished-looking section weakens the rule through indirect phrasing.
- Check: the operative sentences still carry explicit commands.

## Per-scenario per-check results

Scannability: PASS. `auto-mode.md:281-339` has four clear sub-sections and a `manager NEVER` table. The operative rules use explicit `MUST NOT`, `DOES interrupt`, and `does NOT interrupt` language.

Imperative style: PASS with one Low finding. The operative rules are strong. One introductory sentence uses weaker mental-state phrasing, but it does not affect behavior because the following subsections carry the actual rules.

Indirect phrasing: PASS. The behavior-changing language is explicit at `auto-mode.md:283-289`, `291-299`, `303-313`, and `315-324`.

## Typed findings

Type: general / Domain: docs-sync / Disposition: open / Confidence: 75 / Severity: Low / Evidence: `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md:277-279` says the section states the contract "so the manager cannot rationalize past it." / Why-it-matters: This is mild agent-psychology wording in the new prose. It is below the revision threshold because the surrounding rule text is direct and imperative. / Suggested-direction: In a future prose cleanup, replace that clause with a literal statement such as "This section states the binding Auto-mode evaluation contract."

## Low-confidence appendix

None.

Verdict: PASS
