# Structure — T4 conform git-workflow (commit 33340be)

## Artifact Summary + Memory reads
See project.md. Structure lens: do the conformed frontmatter blocks + body edits follow the §2/§4 type-aware structure (base keys, per-type extensions, type=dir, section contracts)?
Memory reads: skills/memorization/rules.md §2.1/§2.2/§4; skills/execution/evaluation.md.

## Locked Frame (Stage 1)
- **S1 base-schema**: every doc carries all 9 base keys in valid YAML. Checklist: name/description/type/scope/feature/status/created/session/tags present.
- **S2 type=dir**: `type` value equals the directory name (feature-subdir types set own name; README=features).
- **S3 per-type extensions preserved**: references keep title/source/accessed/ref_type/related; plans keep task_count/supersedes; backlogs keep priority/disposition/domain.
- **S4 (adversarial) malformed YAML**: a moved/added key breaks frontmatter parse or duplicates a key.
- **S5 ref_type migration sound**: `type:docs/code/blog` (source type) → `ref_type`; `type` reset to `references`. Non-lossy.

## Per-scenario per-check results
- S1: YES. Scripted check over 41 files (zsh array `BASE=(name description type scope feature status created session tags)`, sed frontmatter extraction): 0 files missing any base key.
- S2: YES. type-vs-dir table: backlogs→backlogs, changelogs→changelogs, checklists→checklists, plans→plans, references→references, scenarios→scenarios, README→features. All match.
- S3: YES. All 5 references carry ref_type + related; plan carries task_count:10 + supersedes:null; 3 backlogs carry priority/domain/disposition.
- S4: NO defect found. All 41 parse (frontmatter extraction succeeded for every file); no duplicate keys observed in diffs.
- S5: YES. `type: blog`→`ref_type: blog`, `type: docs`→`ref_type: docs`, `type: code`→`ref_type: code`; `type: references` set on all 5. Source-type information preserved in ref_type, not lost. Migration is sensible (moves source-type from the overloaded `type` to the dedicated §2.2 extension).

## Typed findings
- (Medium/75) `general`/`docs-sync`: scenarios retain a non-standard `category:` key (edge-case/failure-mode) not enumerated in §2.2 for the scenarios type, and the plan retains `status: in-progress` which is outside the §2.2 plans status enum (active/superseded). Neither is in the illegitimate S-set, so neither trips the §4.5 gate, and the draft explicitly judged `category` acceptable. Impact: a future strict type-aware allowlist (§4.4 safety-invariant tooling) would need to decide whether `category` is a sanctioned scenarios extension; currently undocumented. Evidence: scenarios/*.md line 11 `category:`; plans/...bundle-b.md `status: in-progress`. Why it matters: documented-extension drift — the allowlist §2.2 does not list these, so they are ad-hoc. Not blocking (gate-clean, type-correct). Disposition: open. FP-check: not style-pref (it is a schema-surface question), not pre-existing-relevant (the conform pass is exactly where extension allowlists are decided).

## Low-confidence appendix
- (Low/25) `general`/`docs-sync`: `ref_type` allowed-value vocabulary (docs/code/blog) is not enumerated in §2.2; author-chosen. Consistent across refs; not a defect.

VERDICT: PASS
