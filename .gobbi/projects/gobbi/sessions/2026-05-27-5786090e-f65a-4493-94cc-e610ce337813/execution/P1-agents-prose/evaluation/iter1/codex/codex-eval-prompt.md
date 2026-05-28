# Codex evaluator — P1 prose wave (features/agents)

You are an independent adversarial evaluator in a dual-system gobbi evaluation. A Claude executor reshaped 14 docs under `.gobbi/projects/gobbi/features/agents/` to the §4 dev-document quality standard. Your job is to find what it got wrong. DO NOT trust the executor's summary — diff the commit and read the resulting files yourself.

## The spec being evaluated against (§4 of `.gobbi/projects/gobbi/skills/memorization/rules.md`)
- §4.1 positive bar: every doc must be understandable end-to-end by a zero-context reader (no access to the originating session).
- §4.1.1 type-purity: one doc, one type's job (a decision is not also a journal).
- §4.2 per-type section contract (the body `##` sections must match the type):
  - decisions/design → ADR: `## Context` → `## Decision`/`## Approach` → `## Rationale` → `## Alternatives considered` → `## Consequences`.
  - mistakes → What happened / Why it happens / Correct approach / How to detect.
  - learnings → Insight / Context / Why it matters / How to apply / Counter-cases.
  - notes → journal shape.
  - other types (features/README, references, backlogs, changelogs, discussions, scenarios, checklists) → their template shape under `.gobbi/projects/gobbi/skills/memorization/templates/{type}.md`.
- §4.3 self-contained prose: NO load-bearing session-only coordinates (task codes Tn, iter markers, finding IDs, table coords) where resolving them is REQUIRED to understand the doc. Provenance belongs in frontmatter + an optional `## Source` footer. Narrative is NEVER deleted — it is reclassified to `notes/`.
- §4.4 KEEP-list: base 9 keys + cross-ref/provenance/per-type-lifecycle keys are NEVER stripped.

## The change under review
- Commit: `999a403` on branch `chore/session-2026-05-25-a10c82d6` (this worktree HEAD).
- 11 files changed (+146/-94) under `features/agents/`.

## Your procedure (evidence-based — this is mandatory)
1. Run `git show 999a403 --stat` and `git show 999a403 -- <each changed file>` to see EXACTLY what changed. Do not reason about what the executor "should" have done — read what it DID.
2. For EVERY claim that content was "preserved / relocated / not lost", confirm it against the diff. If a narrative line was deleted with no replacement (no `## Source`, no `notes/` destination), that is a content-loss finding (severity High). This is the #1 thing to check — a prior evaluator false-PASSed by asserting relocation without diffing.
3. For each changed doc, judge whether its `##` sections now match its type's §4.2 contract. Flag deviations.
4. Run the D5 scan and confirm any surviving hit is genuinely legitimate (a literal file path, a quote, or a `## Source` line) — not a real load-bearing leak:
   `grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]' .gobbi/projects/gobbi/features/agents/ --include='*.md' | grep -vE '/archive/'`
5. Run the §4.5 leak gate and confirm 0:
   `find .gobbi/projects/gobbi/features/agents -name '*.md' -not -path '*/archive/*' -print0 | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|sub[-_]step|session[-_]id):'`
6. Confirm scope: `git show 999a403 --stat` touches ONLY `features/agents/` paths, no `archive/`.
7. Specifically assess the executor's 3 self-flagged concerns: (a) it edited the `description:` frontmatter VALUE on 5 docs to de-crypt task codes — is that acceptable under §4.3 or a frontmatter-scope violation? (b) it created NO `notes/` reclassification file, claiming no misclassified narrative existed — verify by checking whether any reshaped doc actually had a session-journal narrative that got compressed/dropped instead of relocated. (c) the 4 `references/` docs carry `related:` in frontmatter but no body `## Related` section — is that a §4.2 gap given the references template?

## Output (write this file, workspace-write)
Write your findings to: `.gobbi/projects/gobbi/sessions/2026-05-27-5786090e-f65a-4493-94cc-e610ce337813/execution/P1-agents-prose/evaluation/iter1/codex/findings.md`

Format:
```
VERDICT: <PASS|REVISE|FAIL>

## Summary
<2-3 sentences>

## Findings
- [<type: design_flaw|assumption_risk|scenario_gap|checklist_gap|general>] [severity: High|Med|Low] [confidence: 0-100] <finding with the file:line evidence you verified>
...

## Concern assessments
(a) description de-crypt: <verdict + reason>
(b) no notes/ file: <verdict + reason, with evidence you checked>
(c) references ## Related: <verdict + reason>

## Verification outputs
<paste the D5 scan + leak gate + git stat outputs you ran>
```
Use type vocabulary: scenario_gap, checklist_gap, design_flaw, assumption_risk, general. A finding needs verified file evidence for confidence ≥ 75. If you find no real problems, PASS is the honest verdict — do not invent findings, but do not rubber-stamp either.
