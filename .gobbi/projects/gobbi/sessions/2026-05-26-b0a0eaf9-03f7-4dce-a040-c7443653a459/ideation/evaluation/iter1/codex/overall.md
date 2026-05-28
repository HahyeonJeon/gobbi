# Codex Overall Evaluation — Ideation iter1

The artifact is a strong basis for the standard-and-retrofit direction: it faithfully carries the main user decisions from `discussion-log.md`, keeps PR #272's 7-feature structure out of re-litigation, and proposes a sensible wave order: standard first, mechanical conformance first, prose-quality second. Several factual checks also hold: the cryptic body-reference example exists in `.gobbi/projects/gobbi/features/git-workflow/design/worktree-create-before-session-stamp.md:31-33` and `:49-51`; the existing backlog is real and bounded at `.gobbi/projects/gobbi/backlogs/feature-dir-frontmatter-full-normalization.md:41-48`; and the proposed standard extends the existing rules rather than replacing the naming/frontmatter baseline in `.claude/skills/memorization/rules.md:80-95`.

The blocking issue is that the conformance wave is not yet type-aware enough. If Planning follows the current wording literally, it can strip valid lifecycle fields from backlog files.

## Findings

### F1 — Conformance wave misclassifies `disposition` as a staging-only leak

**Type:** design_flaw
**Severity:** High
**Confidence:** 95

The draft says 64 files leak staging-only keys, including `disposition`, and then scopes wave 1 to "strip the 64 staging-key leaks" (`draft-iter1.md:21`, `draft-iter1.md:54`, `draft-iter1.md:103`). That is unsafe as written. The existing memory standard explicitly allows `disposition: open|deferred` as a backlog extension in `.claude/skills/memorization/rules.md:110`, while the stripping rule qualifies `disposition` as staging-only only "when used purely as eval routing" in `.claude/skills/memorization/rules.md:122`.

Repository spot-check: a narrowed live-doc scan excluding `README.md`, `changelogs/`, `discussions/`, and `references/` yields 141 docs and 64 files matching `^(finding-id|disposition|confidence|severity|surfaced-by):`, but many of those are valid backlog files such as `.gobbi/projects/gobbi/backlogs/feature-dir-frontmatter-full-normalization.md:12`. A naive grep-strip would corrupt backlog lifecycle semantics.

Recommended fix: rewrite the conformance wave as a type-aware frontmatter allowlist. Preserve base fields plus each type's declared extensions; strip `disposition` only when the file is not a backlog or when the field is evaluation-routing metadata. Include the exact verification command and file-selection predicate in the Scope Contract or Implementation Checklist.

### F2 — Numeric evidence is not reproducible as stated

**Type:** general
**Severity:** Medium
**Confidence:** 90

The draft claims "~147 feature+project content docs" and base-frontmatter presence on only "~14-25 files" (`draft-iter1.md:54`, `draft-iter1.md:62`). I could reproduce the general direction but not those exact numbers against the current tree. For the closest apparent live-doc scope (feature + project memory docs, excluding `README.md`, `archive/`, `changelogs/`, `discussions/`, and feature references), I counted 141 files; key presence was `name:` 46, `description:` 46, `type:` 92, `scope:` 127, `feature:` 141, `status:` 123, `created:` 65, `session:` 109, `tags:` 54. On a broader no-README scope, the count is 204 files with `name:`/`description:` 55 and `created:`/`tags:` 75.

The evidence still supports a conformance pass, but the artifact should not carry stale or scope-ambiguous counts into Planning. A planner needs a reproducible baseline, not approximate evidence whose selection predicate is implicit.

Recommended fix: add the exact `find`/`rg` predicates used for the baseline, recompute the counts at the current commit, and phrase the success target independently from the old estimate: "100% base+extension allowlist conformance for the selected live-doc set; 0 invalid staging-only keys outside archive."

### F3 — User-ratified tier-2/tier-3 scope is not clearly in scope, out of scope, or deferred

**Type:** scenario_gap
**Severity:** Medium
**Confidence:** 85

The discussion log records the user's Q4 answer as "Cover all three" with priority order: standard/content rewrite primary, skills/principles optional, organization/navigation third (`discussion-log.md:20-23`). The Scope Contract's In-Scope list only enumerates the standard, conformance wave, prose wave, and minimal grep gate (`draft-iter1.md:19-24`). The Backlog promotion log then says the non-picked tiers were "folded into the in-scope waves / the minimal-grep decision" rather than deferred (`draft-iter1.md:151`), but the artifact does not state what organization/navigation work was folded in. It only notes that the index/navigation layer is a tertiary missing piece in `draft-iter1.md:90`.

This can make Planning silently drop a user-ratified scope tier. The omission is fixable, but it should be explicit before task decomposition.

Recommended fix: add one Scope Contract line for each lower-priority tier. For example: "skills/principles: limited to the new `memorization/rules.md` section and no Principle 13 surgery unless trivially needed" and "organization/navigation: deferred to backlog or limited to examples/index links touched by the prose wave." If the intended decision is "not this session," say that directly.

### F4 — 12-vs-13 principle drift is a known missing consideration and remains unaddressed

**Type:** checklist_gap
**Severity:** Medium
**Confidence:** 100

The prompt explicitly asks whether the artifact handles "the 12-vs-13 principle drift." The tree currently has drift: `AGENTS.md:63-78` and `.codex/AGENTS.md:63-78` still say "The 12 principles below" and stop at Principle 12, while `.claude/CLAUDE.md:31-47` says 13 and includes Principle 13. The draft defers Principle-13 surgery and new evaluation-perspective work (`draft-iter1.md:28`, `draft-iter1.md:35`, `draft-iter1.md:121`), but it does not mention this already-existing entrypoint drift.

This does not invalidate the memory-doc standard, but it affects Codex/agent readers who enter through `AGENTS.md` or `.codex/AGENTS.md` and may miss the doc-work principle the new standard relies on.

Recommended fix: either add a narrow conformance checklist item to resolve the existing 12-vs-13 entrypoint drift, or explicitly defer it to a named backlog with rationale. Do not hide it under the broader "no Principle-13 surgery" decision, because this is an existing cross-entrypoint consistency defect, not a new principle design.

### F5 — Standard-home path should distinguish user-facing symlink from physical edit target

**Type:** checklist_gap
**Severity:** Low
**Confidence:** 100

The artifact repeatedly names `.claude/skills/memorization/rules.md` as the standard's home (`draft-iter1.md:20`, `draft-iter1.md:36`, `draft-iter1.md:99`, `draft-iter1.md:115`). That is a valid read path, but it is a symlink to `.gobbi/projects/gobbi/skills/memorization/rules.md`. The project has two active mistakes on this exact class: `.gobbi/projects/gobbi/mistakes/edit-tool-refuses-symlink-paths.md:35-39` says Edit operations must use the canonical `.gobbi/projects/{project-name}/skills/...` path, and `.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md:23-29` says `.claude/skills/` is only a symlink mirror.

Recommended fix: keep `.claude/skills/memorization/rules.md` as the user-facing locator if desired, but add an execution note: physically edit the worktree-absolute canonical file `.gobbi/projects/gobbi/skills/memorization/rules.md` and verify the `.claude/skills/...` symlink reflects it.

## Overall

The idea is directionally sound and the user decisions are mostly encoded, but the conformance wave needs a type-aware allowlist before Planning. The current "strip 64 staging-key leaks" wording is too blunt because one counted key is valid for backlogs. Fixing F1 and clarifying the scope/evidence items should be enough for a PASS on the next iteration.

VERDICT: REVISE
