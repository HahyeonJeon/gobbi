---
name: memory-template-redesign
description: Session 8bdd12ad — redesigned all 17 memory-skill templates to a 4-section skeleton + Authoring style guide + label renames + section diet; dual-system eval (Claude PASS, Codex REVISE on a slot drift, remediated).
type: notes
scope: project
feature: null
status: active
created: 2026-06-19
session: 8bdd12ad-9d28-4293-a38f-881db184c465
tags: [memory, docs-sync, refactor, rename-sweep, evaluation]
keywords: [templates, skeleton, authoring-style, section-diet, slot-drift, dual-system]
author: claude
features_touched: []
loops_completed: [execution, wrap-up]
shipped: [codex-exec-prompt-via-background-heredoc-hangs, pkill-f-pattern-matches-own-shell, executor-git-stash-in-worktree-during-verify, label-rename-missed-in-fence-and-cross-doc, feature-md-mark-skeleton-exception, references-author-comment-inconsistency]
---

# Memory template redesign

## What happened

A session focused on the `memory/templates/` set — the 17 per-type authoring
templates that govern how each memory file is staged and promoted. The work
standardized every template to one shared skeleton, added an Authoring style guide to
the memory skill, applied a set of label renames, and trimmed redundant sections. The
session opened by landing a held PR first, then did the redesign on top of the
freshly-integrated develop tip.

## What shipped

- **17 templates → 4-section skeleton.** Every memory template now follows the same
  shape: `Core principle` / `Write it` / `Frontmatter + body` / `Notes`.
- **Authoring style guide.** Added `## Authoring style` to `memory/SKILL.md`, with a
  `rules.md §4` pointer back to it.
- **Label renames** across the templates: `Why it applies` / `Why it matters` →
  `Reason`; `How to apply` → `How`; `Item template` → `Frontmatter + body`;
  `Distinguishing … from …` → `Vs other types`.
- **Section diet** — removed redundant sections across the set (~−377 lines net).
- 9 commits on branch `claude-2026-06-19-8bdd12ad-9d28-4293-a38f-881db184c465`.
- This Wrap-up promoted to durable memory: 4 mistakes
  (`codex-exec-prompt-via-background-heredoc-hangs`,
  `pkill-f-pattern-matches-own-shell`,
  `executor-git-stash-in-worktree-during-verify`,
  `label-rename-missed-in-fence-and-cross-doc`), this journal, and 2 backlogs
  (`feature-md-mark-skeleton-exception`, `references-author-comment-inconsistency`).

## What got stuck

The dual-system Execution evaluation hit a codex-exec failure: the codex prompt was
written via a heredoc inside the same backgrounded Bash command that ran codex, so the
prompt file never landed and codex hung on stdin until timeout. The cleanup attempt
then self-killed its own shell with `pkill -f 'codex exec'`. Both were recorded as
mistakes this session. Once codex ran correctly it returned a real REVISE.

## What shifted

- **Process correction landed first.** PR #305 (the P5 git-workflow change) was merged
  to develop at `e42de0e9` at the start of the session, its orphan worktree cleaned,
  and the template redesign was then built on top of the integrated tip — rather than
  redesigning against a stale base.
- **Codex caught a slot drift the Claude eval missed.** Codex's REVISE flagged a
  `{date}-{id}` → `{date}-{session-id}` slot drift across 14 templates' Write-it
  staging-path tables; remediated in the closing commit. This is exactly the
  cross-system divergence the dual-system gate exists to surface.

## Decisions to respect

- **The skeleton and the renames are user-locked.** The 4-section skeleton
  (`Core principle` / `Write it` / `Frontmatter + body` / `Notes`) and the four label
  renames are ratified — do not reopen or re-word them without cause.
- **Frontmatter is byte-identical and untouchable.** The frontmatter blocks are locked
  from PR #305; this redesign did not alter them and a future session must NOT either.
- **`reports.md` keeps `## Three report kinds`** — an intentional retained section, not
  a diet miss.
- **`archive.md` and `feature.md` are intentional structural outliers** — they document
  destinations / a directory, not a single item, so they deviate from the skeleton on
  purpose.
- **`design.md` has no `## Notes` by design** — there was nothing to fold into it; its
  absence is intentional, not an omission.
- **A memory-type's core principle is a documentation discipline, never an action
  principle.** It states what the doc must capture so a future reader is served — not how
  to do the activity the type is about. See the mistake
  `[[core-principle-framed-as-action-not-documentation]]`.

## Addendum — 2026-06-20: core-principle iteration on PR #306

After the initial wrap, the `## Core principle` work was iterated:

- **Reshaped to a directive blockquote.** The section moved to a `> **directive.**`
  blockquote + body, matching the shape used in `record/SKILL.md`.
- **Reframed action → documentation.** After the user's correction, every principle was
  rewritten from a principle for the underlying *activity* to a principle for the
  *documentation* of that type (see the new mistake below).
- **Deepened via a 5-leader parallel research pass.** Prior art surveyed: ADRs, blameless
  postmortems, keepachangelog, Gherkin / INVEST, lessons-learned registers, and archival
  integrity practice.

**Final state:**

- Section renamed `## Core principle` → `## Core principles` (plural).
- 24 documentation principles across 17 templates — 9 types ×1 and 7 types ×2 (design,
  references, learnings, reviews, reports, notes, archive).
- `SKILL.md` `## Authoring style` rule updated to require the documentation framing.
- Commits `15d87060` / `e2d1105a` / `27434c06` on PR #306.

The action-vs-documentation correction is recorded durably as the mistake
`[[core-principle-framed-as-action-not-documentation]]`.

## Next session

Review and merge this session's PR. Then consider the two deferred backlogs:
`feature-md-mark-skeleton-exception` (mark feature.md the allowed skeleton exception so
evaluators stop re-flagging it) and `references-author-comment-inconsistency` (normalize
the `references.md` `author:` comment as a PR #305 follow-up, frontmatter being locked).

## Related

- [[codex-exec-prompt-via-background-heredoc-hangs]] — codex-exec trap recorded this
  session
- [[pkill-f-pattern-matches-own-shell]] — process trap recorded this session
- [[executor-git-stash-in-worktree-during-verify]] — git trap recorded this session
- [[label-rename-missed-in-fence-and-cross-doc]] — docs-sync trap recorded this session
- [[feature-md-mark-skeleton-exception]] — backlog filed this session
- [[references-author-comment-inconsistency]] — backlog filed this session
- [[core-principle-framed-as-action-not-documentation]] — mistake recorded for the
  PR #306 core-principle iteration
