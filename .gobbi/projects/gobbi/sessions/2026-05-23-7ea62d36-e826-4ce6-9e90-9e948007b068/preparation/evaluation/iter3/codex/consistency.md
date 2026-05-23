# Consistency Perspective

Verdict: PASS

## Artifact Summary + Memory reads

Stage 0 summary: this pass verifies synchronization across locked Idea Design A, the iter3 draft, staged stub, audit snapshot, and mistake-candidate. What: Preparation iter3 readiness artifact. Why: iter2 failed because draft claims, stub structure, and project conventions contradicted each other. How: cross-reference exact H2s, frontmatter, generated-file table, audit snapshot, and prior findings.

Memory reads:
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/preparation/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/staging/design/item-a-codex-skill-structure.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter3.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/skill-stub-iter2.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`
- Prior iter: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/evaluation/iter2/codex/consistency.md`

## Locked Frame (Stage 1)

Scenario 1: Draft H2 claims match the staged stub.
- Check: draft lists the same eight H2 names as the stub.
- Check: Design A lines 15-23 and the stub agree.

Scenario 2: Draft frontmatter claims match the staged stub and convention audit.
- Check: draft says `allowed-tools` present and `when-to-load` absent.
- Check: actual stub frontmatter matches.
- Check: existing project skills confirm the convention.

Scenario 3: Generated files listed in the draft exist on disk.
- Check: staged skill file exists.
- Check: iter2 audit copy exists.
- Check: mistake-candidate exists and has matching slug.

Scenario 4 (adversarial): A convention conflict is hidden by a "per standard" phrase.
- Check: `Constraints` body-block choice is cross-checked against sampled existing skills.
- Check: the ambiguity is preserved as a Planning DISCUSSION issue rather than treated as a new Preparation H2.

## Per-scenario per-check results

Scenario 1:
- Yes. `draft-iter3.md:18`, `draft-iter3.md:93`, and `draft-iter3.md:105` list the same eight H2s that `rg '^## '` returned from the stub.
- Yes. `item-a-codex-skill-structure.md:15-23` and the stub H2 scan are aligned.

Scenario 2:
- Yes. `draft-iter3.md:21` says the frontmatter is `name` + `description` + `allowed-tools`, with `when-to-load` absent.
- Yes. Frontmatter read returned exactly those three fields.
- Yes. Project convention audit returned 16/16 for `name`, `description`, and `allowed-tools`; 0/16 for `when-to-load`.

Scenario 3:
- Yes. `find .../preparation/staging` shows `staging/skills/codex/SKILL.md`.
- Yes. `ls -l .../rawdata/skill-stub-iter2.md` confirms the audit snapshot exists.
- Yes. The staged decision file's `slug:` matches `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck` and it has `mistake-candidate: true`.

Scenario 4:
- Yes. Three sampled existing project skills have `## Constraints`, while the iter3 stub has `**Constraints** ... NOT an H2 section`.
- Yes. This is recorded as Low/deferred in Structure and summarized in Overall; it does not contradict Design A's exact 8-H2 lock.

## Typed findings

Finding: ITER2-COD-CONS-H2-DRAFT-STUB-DRIFT
- Type: `general`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: iter2 Consistency found draft claims and stub H2s did not match Design A. Iter3 draft, stub, and Design A now agree on the 8-section sequence.
- FP-check: tool-verified.

Finding: ITER2-COD-CONS-FRONTMATTER-CONVENTION-DRIFT
- Type: `general`
- Domain: `docs-sync`
- Disposition: `addressed`
- Confidence: 100
- Severity: High
- Evidence: iter2 Consistency found the draft asserted the wrong frontmatter convention. Iter3 draft and stub match the empirical 16/16 `allowed-tools`, 0/16 `when-to-load` convention.
- FP-check: tool-verified.

Consistency verdict: PASS. The only residual convention ambiguity is Low and deferred, not a sync failure against the locked spec.

## Low-confidence appendix

None.
