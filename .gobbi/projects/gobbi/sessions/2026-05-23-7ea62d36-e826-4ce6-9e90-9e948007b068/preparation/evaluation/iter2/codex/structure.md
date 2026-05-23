# Structure Perspective

## Artifact Summary + Memory reads

What: evaluate whether the iter2 Preparation outputs are structurally compatible with downstream Planning and Wrap-up. Why: a staged skill stub is promoted before Planning, so its section hierarchy and frontmatter must match the project contract now. How: compare the stub structure against Design A and the existing 16-skill baseline, then disposition iter1 structure findings.

Memory reads:
- Target stub, draft iter2, iter1 stub audit copy.
- Design A locked H2 artifact.
- Existing project skill list and `allowed-tools` / `when-to-load` grep results.
- Prior iter `structure.md` and `overall.md`.
- Preparation evaluation child doc and project mistakes/rules listed in `project.md`.
- No `session.json` read.

## Locked Frame (Stage 1)

Scenario 1: The staged skill file uses the full project-skill template.
- Check: YAML frontmatter is present.
- Check: frontmatter includes `name`, `description`, `allowed-tools`.
- Check: no non-baseline frontmatter key replaces a required convention key.

Scenario 2: The staged skill file has exactly the locked H2 skeleton.
- Check: H2 count is exactly 8.
- Check: H2 names and order are exactly Design A lines 15-23.

Scenario 3 (adversarial): a downstream tool reads frontmatter mechanically.
- Check: the file can be treated like the 16 existing project skills.
- Check: metadata intended as prose guidance is not encoded as a novel schema field.

Coverage notes: dependency supply chain and observability are not applicable. Cost coverage is applicable structurally because the locked cost/budget section was removed as an H2.

## Per-scenario per-check results

Scenario 1:
- PASS: frontmatter delimiters are present at lines 1 and 5.
- PASS: `name: codex` and `description:` are present.
- FAIL: `allowed-tools` is absent.
- FAIL: `when-to-load` is present at line 4, but `rg -n '^when-to-load:' .gobbi/projects/gobbi/skills -g 'SKILL.md'` found zero existing project skills with that key.

Scenario 2:
- PASS: the stub now has 8 H2s.
- FAIL: the ordered list mismatches at positions 7 and 8. Design A locks #7 `Cost + sandbox budget awareness` and #8 `Anti-patterns`; actual #7 is `Anti-patterns`, actual #8 is `Constraints`.

Scenario 3:
- FAIL: a reader that expects the existing project-skill schema will not find `allowed-tools`.
- FAIL: load guidance belongs in the body or description under the current convention; encoding it as `when-to-load` invents a new frontmatter field for one skill.

## Typed findings

### COD-PREP2-STRUCT-001

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: all 16 existing project skills under `.gobbi/projects/gobbi/skills/*/SKILL.md` include `allowed-tools:` at frontmatter line 4. The iter2 stub has no `allowed-tools` and instead has `when-to-load` at line 4; no existing project skill has `when-to-load`.
- FP-check: not a future enhancement. The user supplied the frontmatter convention as a critical verification criterion, and grep confirmed it empirically.

### COD-PREP2-STRUCT-002

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Design A's locked H2 list differs from the actual stub at ordinals 7 and 8. The actual H2 list is 1 When to load, 2 Invocation patterns, 3 Why subagents must use `codex exec`, 4 Sandbox + CWD discipline, 5 Hang + timeout discipline, 6 Use cases, 7 Anti-patterns, 8 Constraints.
- FP-check: not a count-only pass; the locked design specifies section names, not merely cardinality.

### Inherited finding dispositions

- `COD-PREP-STRUCT-001`: addressed for the line-citation/count mismatch. `Path conventions` is now cited at line 224, and the stub count is now 8.
- `COD-PREP-STRUCT-002`: superseded by `COD-PREP2-STRUCT-001` and `COD-PREP2-STRUCT-002`. Report-vs-actual count drift was fixed, but the new actual shape still violates the source contract.

## Verdict

REVISE. The structure is closer than iter1, but the generated skill is still not structurally compatible with the locked H2 contract or the project skill frontmatter convention.

## Low-confidence appendix

No low-confidence findings.
