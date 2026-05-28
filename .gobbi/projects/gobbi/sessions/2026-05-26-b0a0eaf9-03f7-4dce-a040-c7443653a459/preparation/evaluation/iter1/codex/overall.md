## Findings

### C-PREP-001 — Deferred backlog cites the entrypoint doc with an imprecise path

**Type:** `general`

**Severity:** Low

**Confidence:** 90

**Evidence:** The Preparation draft identifies the dangling `claude` skill link as `CLAUDE.md:60` in the summary, execution-skills table, out-of-scope gap, and decisions log (`.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/rawdata/draft-iter1.md:15`, `:87`, `:113`, `:127`). The staged backlog repeats the same path (`.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md:3`, `:21`, `:56`). Repository verification shows there is no root `CLAUDE.md`; the actual file is `.claude/CLAUDE.md`, and line 60 contains `[claude skill](skills/claude/SKILL.md)`. Both target skill files are absent: `.claude/skills/claude/SKILL.md` and `.gobbi/projects/gobbi/skills/claude/SKILL.md`.

**Recommended fix:** Before Wrap-up promotes the backlog, change the evidence pointer in the Preparation draft/backlog from `CLAUDE.md:60` to `.claude/CLAUDE.md:60`. This is a traceability fix only; it does not change the readiness verdict or require generating a `claude` skill in this loop.

No blocking findings. I re-derived the readiness surface from the locked Ideation artifacts and reproduced the load-bearing repository checks at HEAD `d2b5b37`: canonical `memorization/rules.md` is a real file, `.claude/skills/memorization/rules.md` resolves to it, `rules.md` contains the Naming / Frontmatter / Structure sections and the backlog `disposition: open|deferred` rule at line 110, 17 memorization templates exist, `P_live_all=208`, `README=17`, `content=191`, base-frontmatter conformance is `50/208`, and the type-aware FIX-1 leak baseline is `59` files. The deferred dangling `.claude` doc-authoring link is safe to backlog because the memory-doc retrofit depends on `memorization/rules.md`, `memory-map.md`, `templates/*`, Principle 13, and the existing worktree/symlink/context-budget mistakes, not on a separate `.claude` authoring skill. Planning can proceed.

VERDICT: PASS
