VERDICT: PASS

## Summary

P2 reshaped all 15 live docs under `features/evaluation/` to their §4.2 type
section contracts and de-crypted load-bearing session coordinates. I diffed
commit `5c36142` file-by-file, read every resulting post-image, verified every
required body-section list against the type templates, grepped key facts for
content preservation, and ran the D5 session-coord scan + §4.5 leak gate.

Result: clean. All 7 ADR docs (5 decisions + 2 design) carry the full
Context / Decision|Approach / Rationale / Alternatives considered /
Consequences / Related shape. All 4 discussions carry Context / Question /
Options considered / User decision / Implication / Related. The references doc
carries Insight / Related / Why-it-applies / Source / Excerpt / Usage history —
the body `## Related` between Insight and Why-it-applies is present, closing the
P1 references trap. Both changelogs gained a **Task:** line + Deferred + Related.
README gained ## Status + ## Open items.

Content preservation: no narrative deleted. The brittle line-number citations
(`evaluation/SKILL.md:385-393`, `:344-352`, `:98-110`, `idea.md:294-296`) were
correctly replaced with stable section-name references under `## Related` — this
is proper §4.3 de-cryption, not content loss. Draft B (the not-selected
alternative cell text) survives under `## Alternatives considered`. All
empirical evidence survives: codex-cli 0.133.0 + path, 6/6 sampled-skills grep
evidence, `_claude/SKILL.md`-does-not-exist finding, the 3 codex failure modes +
commit b9970dc, the 3 fixes A/B/C + PostToolUseFailure + project.json.

§4.5 leak gate: empty (clean). Scope: all 15 files under features/evaluation/,
no archive touched. The 2 executor-flagged items (README missing `subsystems:`
frontmatter key; bundle-a `status: shipped` vs template `active`) are real
deviations but are FRONTMATTER (§4.4) defects, out of P2 (prose/§4.2) scope —
correctly flagged, correctly deferred. Not P2 findings.

This task IS the prose wave, so §4.2 body-section restructuring is in-scope here
(unlike the conformance-wave mistake in
`conformance-executor-pre-executed-prose-wave-reshape.md`) — no scope overstep.

## Findings

No open findings against the P2 contract. The two items below are recorded as
out-of-scope deviations (not P2 defects) for the manager's awareness.

[general] [Low] [confidence 100] README frontmatter lacks the `subsystems:`
extension key required by feature-readme template line 40, though the body
carries a `## Subsystems` section.
Evidence: `features/evaluation/README.md` frontmatter (post-5c36142, lines 1-11)
has no `subsystems:` key; template `templates/feature-readme.md:40` lists
`subsystems: [...]` as a required features-type extension.
Why it matters: frontmatter conformance, not prose. §4.4 (type-aware allowlist)
governs frontmatter; P2's contract is §4.2 body sections + §4.3 prose. This is a
frontmatter-wave / conformance-wave obligation, not a P2 defect.
Suggested direction: route to the frontmatter/conformance pass, not a P2 re-do.

[general] [Low] [confidence 100] `changelogs/2026-05-26-bundle-a-rehome.md`
frontmatter `status: shipped` while the changelogs template specifies
`status: active`.
Evidence: post-5c36142 frontmatter line 7 `status: shipped`; template
`templates/changelogs.md:42` shows `status: active`. (Note: rules.md §2.2 lists
`shipped` as a valid coarse base-status value generally, so this is a
template-mismatch, not an invalid value — low severity.)
Why it matters: frontmatter (§4.4) scope, not §4.2 prose. Out of P2 contract.
Suggested direction: resolve in the frontmatter/conformance pass; confirm whether
changelogs should use `active` or whether `shipped` is acceptable for a
ship-record (the rules.md status model arguably permits `shipped`).

## Out-of-scope-flag assessment (subsystems key / status value)

Both executor-flagged items are REAL deviations and BOTH are FRONTMATTER, hence
OUT OF P2 (prose) SCOPE — the executor flagged them correctly.

- `subsystems:` key absence — frontmatter extension gap (§4.4 territory). The
  body `## Subsystems` section IS present and correct, so the §4.2 prose
  contract for README is satisfied. P2 touched body prose; frontmatter keys are
  the conformance wave's job. Correct to defer.
- bundle-a `status: shipped` vs template `active` — frontmatter value mismatch
  (§4.4 / §2.2 territory). rules.md §2.2's status model lists `shipped` among
  valid coarse base-status values, so this is a template-vs-rules nuance, not an
  invalid leak. Either way it is frontmatter, not prose. Correct to defer.

Neither blocks a P2 PASS. P2's contract is §4.2 body-section contracts + §4.3
self-contained prose; both items sit in §4.4 frontmatter conformance.

## Verification outputs

# git show 5c36142 --stat
15 files changed, 288 insertions(+), 127 deletions(-) — all under
.gobbi/projects/gobbi/features/evaluation/ ; no archive/ path touched.
(5 decisions, 2 design, 4 discussions, 1 references, 2 changelogs, 1 README)

# Scope check
git show 5c36142 --name-only | grep -v '^features/evaluation/' → all under
features/evaluation/ ; grep '/archive/' → none.

# §4.2 body-section contract per doc (grep '^## ' on post-image):
  7 ADR docs (5 decisions + 2 design):
    Context / Decision|Approach / Rationale / Alternatives considered /
    Consequences / Related  — ALL PRESENT on all 7.
    (constraints-...-deferred-to-planning additionally keeps a legit ## Source.)
  4 discussions: Context / Question / Options considered / User decision /
    Implication / Related — ALL PRESENT on all 4.
  references/five-type-vocabulary.md: Insight / Related / Why it applies /
    Source / Excerpt / Usage history — body ## Related present between Insight
    and Why-it-applies (P1 trap closed).
  changelogs (x2): **Task:** line + Summary / What changed / Verification /
    Deferred / Related — ALL PRESENT.
  README.md: Overview / Status / Subsystems / Subdirectories / Recent activity /
    Open items / Related — Status + Open items added per template.

# D5 session-coord scan
grep -rnE 'T[0-9]+-|iter[0-9]|draft-iter|COD-[0-9]|row-[0-9]'
  features/evaluation/ --include='*.md' | grep -vE '/archive/'
  → 3 hits, all LEGITIMATE survivors (none load-bearing in evergreen body prose):
    1. discussions/2026-05-24-...-aggregation.md:2  frontmatter name: slug
       (filename slug, not body coordinate)
    2. references/five-type-vocabulary.md:59  link to mistake file whose
       FILENAME contains 'iter2' (cross-ref, not a session coord)
    3. changelogs/2026-05-26-bundle-b-rehome.md:34  link to the date-prefixed
       discussion file (legit cross-ref)

# §4.5 leak gate (must be empty)
find features/evaluation -name '*.md' -not -path '*/archive/*' -print0
  | xargs -0 grep -lE '^(mistake[-_]candidate|finding[-_]id|confidence|
    severity|surfaced[-_]by|promoted[-_]from|promoted[-_]at|addressed[-_]by|
    task|loop|scenario|iter|slug|finding[-_]source|phase|loop[-_]iter|
    sub[-_]step|session[-_]id):'
  → EMPTY (clean, 0 leak files).

# Content-preservation greps (post-image, count of key facts retained):
  codex-cli 0.133.0 / nvm path .............. retained
  6/6 sampled-skills evidence ............... retained
  Draft A verbatim 5-type row ............... retained
  Draft B (not-selected alternative) ........ retained under Alternatives
  wrapper: 3 failure modes + commit b9970dc . retained (6 matches)
  eval-fail: Fix A/B/C + PostToolUseFailure + project.json . retained (4)
  Line-number citations → replaced by stable section-name refs (proper §4.3
  de-cryption; canonical sources still cited in ## Related).
