# Consistency Perspective — Task 06 iter1 (CRITICAL perspective per manager brief)

**Target:** commit `32b9adc` — consistency of footnote + smoke-test with sibling docs.

## Smoke-test regex vs branch-naming convention

### Regex in question (orchestration/SKILL.md:126)
`^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`

### Branch convention shape regex (`git/conventions.md:22`)
`^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$`

### Length constraint (`git/conventions.md:64`)
Description slug must be 3-50 chars (post-`<type>/<issuenum>-`).

### Test: example branch `chore/session-2026-05-23-1b26cf20`
- Smoke-test regex: PASS (matches all 4 groups).
- Convention shape: slug-portion `session-2026-05-23-1b26cf20` matches `[a-z0-9]+(-[a-z0-9]+)*` — PASS.
- Length: 27 chars, within 3-50 — PASS.

Smoke-test regex is COMPATIBLE with the convention. No contradiction.

**However**: convention permits optional `(\d+-)?` issue prefix. Smoke-test regex assumes NO issue number. For session branches without an associated issue, this is fine (sessions don't anchor to issues). If a session is later anchored to an issue, would the branch shape change? Row 5.5 spec says no — branch shape is `chore/session-{date}-{ssid-short}` regardless of issue. Internally consistent.

## LOCK #5 enforcement — direct-mode opt-out home

Plan + LOCK #5: opt-out footnote home is orchestration/SKILL.md, NOT git/SKILL.md.

```
$ grep -nE 'opt-out|escape hatch|emergency hotfix|pure-read' .gobbi/projects/gobbi/skills/git/SKILL.md
(0 matches)
```

CONFIRMED. git/SKILL.md does NOT carry the opt-out documentation. Only legitimate cross-cutting `direct mode` mentions exist (write-path Memory Access Matrix at lines 31, 33, 246, 261, 278) — those are about write-root semantics, not the opt-out contract. LOCK #5 respected.

## Cross-link target verification

Footnote line 116: `[git/SKILL.md § Core Principles](../git/SKILL.md#core-principles)`.

- Anchor `#core-principles` resolves to `## Core Principles` at git/SKILL.md:39 — exists.
- Claim: "For the full definition of `direct` vs `worktree-pr` modes and their behavioral contracts".
- Reality (git/SKILL.md:39-62): Core Principles defines the worktree-isolation invariant ("Every task gets its own worktree"), manager/subagent lifecycle ownership, issue-anchoring, push semantics, and AI-provenance trailer. It does NOT contain explicit "direct" vs "worktree-pr" mode behavioral contracts. The two modes as named keys are NOT defined in Core Principles.

This is a real cross-link weakness. Searching whole git/SKILL.md for `"direct"` or `"worktree-pr"` quoted-key references returns zero matches — the **mode key system itself is not documented in git/SKILL.md**. The footnote's cross-link sends the reader to a section that does not deliver the promised definition.

## settings.git.workflow.mode key — schema reality check

```
$ grep -rnE 'git\.workflow|workflow\.mode|"direct"|"worktree-pr"' .gobbi/projects/gobbi/skills/
```
Only orchestration/SKILL.md (T01 + T06) references this key. `settings.default.json` schema has no `git.workflow.mode` field — only `git.repo`, `git.baseBranch`, `git.pr`, `git.issue`, `git.worktree`, `git.branch`.

**This is a pre-existing inconsistency from T01** (T01 introduced `settings.git.workflow.mode` references). T06's footnote inherits and amplifies the same unimplemented-key reference. T06 is consistent WITH T01, but both diverge from the template schema.

## Findings

- **C-01** — Type: `design_flaw` / Domain: `docs-sync` / Disposition: `open` / Confidence: `100` / Severity: `High`
  - The footnote's cross-link target (`git/SKILL.md § Core Principles`) does NOT contain the promised "full definition of `direct` vs `worktree-pr` modes and their behavioral contracts". Core Principles defines worktree isolation as an invariant but never enumerates the two named modes or distinguishes their behavioral semantics. A reader following the link will be confused.
  - Why it matters: the footnote's design decision is to **delegate detail to git/SKILL.md** while keeping the opt-out contract in orchestration. Delegation to a target that doesn't carry the promised content makes the cross-link a dead-end. Either the cross-link must point to a real definition (none exists today in git/SKILL.md) or git/SKILL.md must grow such a section.
  - Evidence: orchestration/SKILL.md:116 (link); git/SKILL.md:39-62 (target content — no mode definitions); whole-file grep of git/SKILL.md returns 0 matches for `"direct"` or `"worktree-pr"` as keys.

- **C-02** — Type: `assumption_risk` / Domain: `docs-sync` / Disposition: `open` / Confidence: `100` / Severity: `Medium`
  - `settings.git.workflow.mode` key is referenced in T01 (line 103) and T06 (lines 109, 116) but does NOT exist in `settings.default.json`. The schema has `git.repo / baseBranch / pr / issue / worktree / branch` only. No `workflow` sub-key under `git`.
  - Why it matters: the footnote describes behavior switching on a setting that is not in the schema. A future implementer wiring the manager to read this setting will find no key to read.
  - Evidence: settings.default.json:47-55 (full `git` block); orchestration/SKILL.md:103+109+116 (references).
  - **Note**: T06 inherits this from T01. It is not a NEW problem introduced by T06, but T06 amplifies the surface area.

- **C-03** — Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: `50` / Severity: `Low`
  - Term consistency: row 5.5 (T01) uses `{ssid-short} = first 8 chars of $CLAUDE_CODE_SESSION_ID` without specifying hex/case. Smoke-test regex asserts `[a-f0-9]{8}` (lowercase hex). UUIDs per RFC 4122 are lowercase hex, so the assumption is correct, but row 5.5 does not explicitly say so.
  - Why it matters: a future change to session ID format (e.g., switching from UUIDv4 to ULID or KSUID) would silently break the regex.
  - Evidence: orchestration/SKILL.md:103 (row 5.5) vs :126 (regex).

- **C-04** — Type: `general` / Domain: `docs-sync` / Disposition: `open` / Confidence: `100` / Severity: `Low`
  - Footnote uses `git.workflow.mode` (line 103) and `settings.git.workflow.mode` (lines 109, 116). Slight notational inconsistency between bare and `settings.`-prefixed forms.
  - Why it matters: cosmetic; both refer to the same key.
  - Evidence: orchestration/SKILL.md:103 ("resolved `git.workflow.mode`") vs :109 ("`settings.git.workflow.mode == \"direct\"`").

## Verdict (consistency perspective)

**REVISE.** C-01 (High, Confidence 100) is a design flaw introduced by T06 itself: the new cross-link sends readers to content that does not exist. C-02 (Medium, Confidence 100) is pre-existing from T01 but T06 makes the orphaned key more prominent.

## Preserve list

- The smoke-test regex shape (matches the branch convention).
- The clean LOCK #5 separation: orchestration owns opt-out; git/SKILL.md does not duplicate.
