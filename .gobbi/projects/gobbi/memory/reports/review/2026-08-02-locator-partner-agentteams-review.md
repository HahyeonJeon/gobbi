# Locator, partner, and Agent Teams — dual-system review

Review of the session that fixed all four failures a user reported after installing `plugins/gobbi/` into an
external project — skills unreachable, the Claude-and-Codex system inoperative, Agent Teams inoperative, and
neither working in Cowork — plus a fifth found during the work (the materialized Codex package delivering
almost nothing). Branch `claude-2026-08-01-a84c8507-2415-4d93-94f6-a0ced3e7f7d0`, base `968edb02`, head
`f5f54a74`, 32 commits, 208 files, +29,460/−681.

## Scope and criteria

Independent Claude evaluation against the locator conversion (`968edb02..cfdaeb18`), manager reproduction of
every High and several Medium findings against the filesystem rather than accepting the evaluator's claim, and
three external validation probes against fresh consumer fixtures on both runtimes — the environment that
actually produced the user's original failure, not this repository's own checkout.

## Evaluation verdict — REVISE, then closed

Claude evaluator `cowork-eval-01-claude`: REVISE, three High problems, no Critical.

| # | Problem | Manager verification | Disposition |
|---|---|---|---|
| P1 | Frozen line pins already stale — later commits shifted the lines a follow-on task was pinned against | Not re-verified; mechanism obvious from the two commits | Structural risk, avoided by re-deriving pins per task afterward |
| P2 | The materialized `plugins/gobbi/` package (~180 files, replacing two tracked symlinks) had no owning task | — | Closed: package materialized at version `1.0.1` behind a generator and byte-equality guard |
| P3 | Step 1.1 hard-stopped Codex in this repository — `.agents/` has no `agents/` sibling under the logical-path reading | **CONFIRMED** — `.agents/agents/manager.md` missing | Closed by `T01-FIX`: acquisition step now takes the entrypoint's reported location instead of assuming a fixed layout |

Medium, all independently confirmed by the manager: `AGENTS.md` is a symlink, so the true reference count is
31 across 13 files, not 33/14; four `memory/`-named occurrences fell outside both the rename and exclusion
inventories; a recorded justification for half of an earlier commit was **false** — the old relative links it
said were broken actually resolved in the installed cache; a two-child skill needed a heading shape the
Codex-side study's own foundation-first sequencing recommendation was neither adopted nor recorded as
rejected until this session revisited it.

**Strengths preserved through the fix:** one-task-one-commit-one-trailer discipline; all 22 placeholder
targets resolved; the no-brief fallback proved topologically correct across all three real agent-root layouts
it can reach; the naming exclusion list verified verbatim in both directions.

## External validation — three probes, fresh consumer fixtures

1. **Claude, restricted tools.** Proved the sibling-derivation rule correct and that no
   `${CLAUDE_PLUGIN_ROOT}` or equivalent exists (full `env` dump). A probe design flaw — no `Skill` tool in
   the restricted toolset — left the bare-vs-namespaced identifier question unanswered.
2. **Claude, `Skill` tool available — decisive.** The `Skill` tool's own result states the base directory as
   its first line. This is the acquisition mechanism both the evaluator and the Codex study had asked for.
   Namespacing confirmed: a consumer project offers only `gobbi:<name>`, never the bare form.
3. **Codex CLI, real `~/.codex`, materialized package installed.** Confirms the same on the second runtime:
   identical `gobbi:principles` identifier, the reported location names the skills root directly (not the
   skill's own directory — the shape difference the two-candidate design exists to resolve), the `agents/`
   sibling exists and is readable, no plugin-root environment variable.

Full mechanism and measured facts recorded in
[`design/architecture/plugin-skill-locator.md`](../../design/architecture/plugin-skill-locator.md).

## G9 — the Agent Teams locator gap, dispositioned by the user

`T23`'s test initially ran against a stale pre-`G1` plugin cache (`installed_plugins.json` pinned `1.0.0`,
strictly older than this session's work); rebuilt against an isolated `1.0.1` fixture where the locator
genuinely ran, and the user accepted that evidence. A second claim — "seven roots satisfy the sentinels" — was
overstated: the entry builds exactly two candidates and never scans the filesystem; the sentinel-satisfying
roots elsewhere on the test machine are irrelevant to the primary path. The real finding: a spawned specialist
has no `Skill` tool, so it cannot run the locator's acquisition step itself; all three spawned test runs found
the root by filesystem search and `PATH` inspection instead, and one run's justification was confabulated.
**User decision: record it, not fixed** — the manager always supplies both roots in the brief, so the
fallback path this gap affects is not exercised in the design as built.

## Final verification suite — all green

`sync-plugin-package.sh --check` · `test-sync-plugin-package.sh` · `check-codex-plugin-smoke.sh` ·
`check-markdown-links.sh` (744 paths, 88 anchors, 179 files). The materialized package is byte-equal to its
canonical source for both skills and agents.

## Limits

- **Four role-contract gaps have no owning task and were not dispositioned by session end**, confirmed still
  present in the final tree: `plugins/gobbi/` cited as a Codex runtime surface in four files though it does
  not exist in a consumer project (same defect class as the reviewed cause); `executor.md` cites the user's
  own auto-memory file as a memory rule, unreachable from a consumer project; `assistant.md` names a
  "Project skill" that does not exist in the tree; `assistant.md`'s frontmatter description still names
  `record/SKILL.md` and `wrap-up/SKILL.md Phase 2.1` by old convention. Recorded in
  [`backlogs/project.md`](../../backlogs/project.md).
- `check-markdown-links.sh`'s file discovery (`find -type f`) never inspects the 159 symlink `.md` leaves
  under `.claude/skills/`, so it has never actually verified a mirrored document as such. Not currently
  unsafe — every mirror leaf points at a canonical file the checker does check directly — but a future task
  that points the checker at the mirror itself would get a false pass. Fix and its cost are recorded in
  [`backlogs/project.md`](../../backlogs/project.md).
- No further independent dual-system evaluation ran over the session's later tasks (partner, Agent Teams,
  Cowork wiring, materialization); the Claude evaluation above covers only the locator-conversion slice.
