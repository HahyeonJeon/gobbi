VERDICT: PASS

## Artifact Summary + Memory reads
The artifact organizes the redesign as two new mode sub-documents, a bounded amendment to `orchestration/SKILL.md`, two mode-specific default sets, additive `workflow.chat.tasks[]` state/session metadata, and standard backlog archival. The Structure lens checks whether that decomposition is maintainable, testable, and grounded in actual worktree file state.

### Memory reads
- Target draft: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter2.md`
- Prior Codex file: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/codex/structure.md`
- Worktree file checks: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/{chat-mode.md,auto-mode.md}` and `.claude/skills/orchestration/{chat-mode.md,auto-mode.md}`.
- Schema reference: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json`
- Applicable mistakes: `skills-mirror-symlinks-not-copies.md`, `design-literal-retire-instruction-without-replacement.md`, `subagent-relative-path-write-strays-to-main-tree.md`.

## Locked Frame (Stage 1)
Scenario 1: The create/update decomposition matches actual worktree state.
- Check: placeholder mode files exist in the worktree.
- Check: `.claude` mode-doc symlinks resolve to canonical worktree files.
- Check: the draft acknowledges the main-tree false-positive and tells Planning to pre-flight in the worktree.

Scenario 2: Settings/state/session schema changes are represented as explicit structural edits.
- Check: R1's `maxIterations: 0 -> Skipped` behavior is represented at the state-machine layer.
- Check: R2/R3 add `workflow.chat.tasks[]` to both `session.json` and `state.json` shapes.
- Check: template update rows include `state.template.json` and `session.template.json`.

Scenario 3 (adversarial): A Planner follows the CRUD section literally and misses a hidden template or resolver dependency.
- Check: residual settings-cascade uncertainty is not hidden as solved.
- Check: deferred layout choices are routed to Planning rather than left implicit.
- Check: no structural edit depends on changing cross-skill docs outside scope.

Inherited iter1 seed findings:
- `codex-struct-2e4a90bc` - central mode-doc placeholder claim appeared false from the main tree.
- `codex-struct-91cf42d0` - same-schema divergent defaults lacked a bootstrap selection step.
- `codex-struct-6f11d0e9` - template edits for per-task Chat state were missing.

## Per-scenario per-check results
Scenario 1:
- Placeholder files exist in worktree: yes. Tool evidence: `ls -l` confirmed canonical `chat-mode.md` (598 bytes) and `auto-mode.md` (636 bytes) under the absolute worktree path.
- `.claude` symlinks resolve: yes. Tool evidence: `readlink` returned `../../../.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` and `../../../.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`.
- False-positive acknowledged: yes. Evidence: `draft-iter2.md:462-465` explains the worktree/main-tree distinction and requires a Planning pre-flight check.

Scenario 2:
- R1 represented structurally: yes. Evidence: `draft-iter2.md:170-175`, `:338-339`, and `:366-370`.
- R2/R3 represented structurally: yes. Evidence: schema block at `draft-iter2.md:415-449`.
- Template rows included: yes. Evidence: `draft-iter2.md:505-506`.

Scenario 3:
- Settings-cascade uncertainty surfaced: yes. Evidence: `draft-iter2.md:130`, `:504`, and `:564` route resolver behavior to Planning if JSON packaging is insufficient.
- Layout choices deferred explicitly: yes. Evidence: `draft-iter2.md:541` and `:588`.
- Cross-skill edits bounded: yes. Evidence: `draft-iter2.md:77-79` keeps memorization/discussion/wrap-up reads out of this Ideation scope, with Wrap-up extension deferred.

## Typed findings
- finding-id: codex-struct-2e4a90bc
- Type: design_flaw
- Domain: docs-sync
- Disposition: addressed
- Confidence: 100
- Severity: High
- Evidence: Worktree `ls -l` confirmed the two canonical placeholder files and matching `.claude` symlinks; `draft-iter2.md:462-465` records the worktree/main-tree distinction.
  Finding: The iter1 file-existence finding was a worktree false-positive for this branch; the process lesson is captured in the iter2 brief and draft.

- finding-id: codex-struct-91cf42d0
- Type: checklist_gap
- Domain: process
- Disposition: addressed
- Confidence: 75
- Severity: High
- Evidence: `draft-iter2.md:338-342`, `:366-370`, and `:504` place mode dispatch after Step 1 resolves mode and explicitly defer any resolver implementation question to Planning.
  Finding: The bootstrap-selection concern is sufficiently resolved at Ideation level: the structural branch is named, and implementation packaging is scoped to Planning.

- finding-id: codex-struct-6f11d0e9
- Type: scenario_gap
- Domain: process
- Disposition: addressed
- Confidence: 100
- Severity: Medium
- Evidence: `draft-iter2.md:448` states both templates gain `workflow.chat: { tasks: [] }`; `draft-iter2.md:505-506` adds both template update rows.
  Finding: The missing schema-template CRUD coverage is addressed.

## Low-confidence appendix
- finding-id: codex-struct-low-1
- Disposition: addressed
- Confidence: 25
- Severity: Low
- Evidence: The optional separate `workflow.modeDispatch` observability field is not required because `workflow.chat.tasks[]` and the status display update carry the necessary projection.
  Finding: Suppressed; not needed for PASS.
