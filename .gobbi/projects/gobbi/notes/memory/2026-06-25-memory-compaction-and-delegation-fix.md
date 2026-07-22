---
name: memory-compaction-and-delegation-fix
description: Built gobbi's memory-compaction mechanism (Wrap-up Stage-2c, dormant) and fixed the subagent skill-loading delegation gap.
type: notes
scope: project
feature: null
status: active
created: 2026-06-25
session: 463a1c96-f75c-4a14-80b4-f4d6815679cd
tags: [memory, design]
keywords: [compaction, stage-2c, delegation, skill-loading, dual-system-eval]
author: claude
features_touched: [memory]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [subagents-skip-load-directives-no-enforcement, claude-skills-mirror-is-symlink-not-copy, compaction-cap-tuning, dual-system-eval-catches-defects, agent-memory-consolidation-governed, lsm-compaction-threshold-merge-similar, sleep-consolidation-push-pull, zettelkasten-map-of-content-atomicity]
---

# Memory compaction mechanism + delegation skill-loading fix

## What happened
The session designed and shipped gobbi's **memory-compaction mechanism** — Wrap-up
Stage-2c, which holds each over-cap `{type}/{area}/` area under a cap by folding related
records losslessly into one Map-of-Content file and `git mv`-ing the originals to
`archive/`. Design took 3 Ideation iterations and 2 Planning iterations; dual-system
(Claude + Codex) evaluation ran each round. Mid-session, on user request, the work also
fixed a **delegation skill-loading gap**: spawned subagents have no `Skill` tool, so a
briefing that said "load skill X" mapped to no action. Execution ran 10 tasks; the
mechanism ships **dormant** (`settings.compaction.enabled: false`). 11 commits landed
(10 feature/fix + the Wrap-up promotion commit `e98fc3d4`).

## What shipped
Durable memory writes this session:
- 2 project mistakes — `mistakes/verification/subagents-skip-load-directives-no-enforcement.md`,
  `mistakes/docs-sync/claude-skills-mirror-is-symlink-not-copy.md`.
- 4 references — `features/memory/references/memory/{agent-memory-consolidation-governed,
  lsm-compaction-threshold-merge-similar, sleep-consolidation-push-pull,
  zettelkasten-map-of-content-atomicity}.md`.
- 1 project backlog — `archive/backlogs/memory/2026-07-20-compaction-cap-tuning.md`.
- 1 cross-feature learning — `learnings/evaluation/dual-system-eval-catches-defects.md`.

Code/standard (committed, develop..HEAD): compaction caps + dormant settings knobs;
`validate-frontmatter.sh` accepts the `supersedes` list form; the
`check-merge-ref-integrity.sh` two-family gate; compaction semantics in `memory/rules.md`
§5 + the archive template; Stage-2c wired into `wrap-up/SKILL.md`; the delegation
skill-loading fix (`519c8ba1` + `b09bef24`).

## What got stuck
The first Wrap-up RECORD landed an incomplete record: the 3 canonical audit artifacts
(`pre-wrap-up-snapshot.txt` / `staging-inventory.md` / `promotion-manifest.md`) were not
written, the handoff under-counted commits (10 vs 11) and omitted the promotion commit,
the learning was filed under the wrong area (`process` instead of the deterministic
`evaluation`), and this journal note was missing. The dual-system Wrap-up eval REVISE'd
the record (the promotion content itself was sound). The REVISE fix completed all of it.

## What shifted
- The compaction design dropped a per-type `mode` field in favor of ONE uniform
  merge-primary strategy; `mistakes`/`rules` merges became Always-Ask (a hard rule, not a
  config knob).
- A planned `.claude/skills` "edit both + diff-parity" guard was found vacuous —
  `.claude/skills` is a git **symlink** mirror, not a byte-copy — and was dropped.
- The Stage-2c capstone moved from a standalone gate to running INSIDE the non-skippable
  Stage-3 dual-system validation gate, so its writes are always validated.

## Decisions to respect
- **Compaction ships dormant.** Do not flip `settings.compaction.enabled: true` without one
  validated live run (an over-cap area merged, all three guards green).
- **Uniform merge strategy, no per-type `mode`.** `mistakes`/`rules` merges are Always-Ask.
- **Lossless, never delete.** Merge → consolidated MoC file + `git mv` originals to
  `archive/` with `archive_reason: merged`.
- **`.claude/skills` is a git symlink mirror.** Edit canonical `.gobbi/projects/gobbi/skills/...`
  only; never `Write` to a `.claude/...` path. See `mistakes/docs-sync/claude-skills-mirror-is-symlink-not-copy.md`.
- **Subagents must Read their Load-Directives files and report a `SKILLS LOADED` checklist;
  the manager grep-verifies.** See `mistakes/verification/subagents-skip-load-directives-no-enforcement.md`.

## Next session
Run a Wrap-up with `settings.compaction.enabled: true` to validate Stage-2c against the
over-cap `mistakes/verification` area (15 files, over softCap 12), then enable it for good.
Layer-2 promotion of the recurring worktree-path mistake is still pending — confirm
generalizability in DISCUSSION, then promote. Cap-tuning waits for ~5+ real compaction runs.

## Related

- [[dual-system-eval-catches-defects]] — the cross-system evaluation learning this session produced
- [[compaction-cap-tuning]] — the deferred per-type cap-tuning backlog
- [[subagents-skip-load-directives-no-enforcement]] — the delegation gap fixed this session
- [[claude-skills-mirror-is-symlink-not-copy]] — the symlink-mirror trap recorded this session
