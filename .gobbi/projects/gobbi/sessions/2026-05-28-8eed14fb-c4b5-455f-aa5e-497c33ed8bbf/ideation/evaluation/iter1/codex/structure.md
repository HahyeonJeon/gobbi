VERDICT: REVISE

## Artifact Summary + Memory reads
The artifact proposes splitting Chat Mode and Auto Mode into two orchestration sub-documents, keeping `orchestration/SKILL.md` as governor, and dispatching workflow shape by mode. The downstream structural consumers are Planning and Execution, which must know whether they are creating files, updating placeholders, adding symlinks, changing schemas, or only amending prose.

### Memory reads
- Target draft read in full.
- Current `orchestration/SKILL.md` lines 62-82, 234-241, 245-290, 338-405, and 455-456 read for existing state-machine, display, and session schema.
- `settings.default.json`, `state.template.json`, and `session.template.json` read for schema shape.
- File-existence checks run for `.gobbi/projects/gobbi/skills/orchestration/{chat,auto}-mode.md`, `.claude/skills/orchestration/{chat,auto}-mode.md`, and `.agents/skills/orchestration`.
- Applicable mistakes: `skills-mirror-symlinks-not-copies.md`, `design-literal-retire-instruction-without-replacement.md`, `memorization-delegation-prompts-must-load-memorization-skill.md`.

## Locked Frame (Stage 1)
Scenario 1: The decomposition into `SKILL.md` plus two mode sub-documents matches actual files.
- Check: Each claimed placeholder exists if the plan says "replace".
- Check: Mirror behavior is correctly described for `.claude/skills` and `.agents/skills`.
- Check: The CRUD table distinguishes Create from Update.

Scenario 2: Settings and state schemas can represent two mode-dispatched shapes.
- Check: The default-setting selection has a bootstrap path before `settings.mode` exists.
- Check: `state.json` and `session.json` can represent repeated Chat task slices without overwriting single-instance step keys.
- Check: The design identifies exact structural edits in templates when adding Chat task arrays.

Scenario 3 (adversarial): A downstream executor follows the CRUD table literally and either updates missing files or omits new symlinks.
- Check: Execution can implement every CRUD row without first rediscovering file existence.
- Check: Missing placeholders become explicit creation tasks.
- Check: New `.claude` symlinks are either created or declared not needed.

Coverage notes:
- Dependency supply chain: not applicable; no third-party dependency is introduced.
- Observability: applies as state/session schema visibility; covered in Scenario 2.
- Applicable mistake `skills-mirror-symlinks-not-copies.md` becomes Scenario 1.

## Per-scenario per-check results
Scenario 1:
- Claimed placeholders exist: no. Evidence: `ls` returned "No such file or directory" for all four claimed mode doc paths.
- Mirror behavior described correctly: no. Evidence: `.agents/skills/orchestration` is a directory symlink to the canonical orchestration directory, but `.claude/skills/orchestration` currently contains only a per-file `SKILL.md` symlink; no `chat-mode.md` or `auto-mode.md` symlinks exist.
- CRUD table distinguishes Create from Update: no. Evidence: `draft-iter1.md:357-364` lists these under Create but the notes say "Replace the existing placeholder"; `:398-399` then says "currently a placeholder."

Scenario 2:
- Bootstrap path for divergent defaults: partial/no. Evidence: `draft-iter1.md:39` says use existing shape and ship two default sets, but current `orchestration/SKILL.md:98` reads the default template before settings are written and current `settings.default.json` has `"mode": "auto"`.
- Repeated Chat task state representable: no, acknowledged but not resolved. Evidence: `draft-iter1.md:416-417` flags `session.json` and `state.json` single-instance shapes, while `session.template.json` and `state.template.json` have only one entry per workflow step.
- Exact template edits identified: no. Evidence: section 7 lists `settings.default.json`, but not `state.template.json` or `session.template.json` under Update.

Scenario 3:
- Execution can implement without rediscovery: no. The false placeholder claim must be corrected before Planning can decompose.
- Missing placeholders explicit: no. They are described as existing placeholders and mirror symlinks.
- `.claude` symlink handling explicit: no. The draft says the symlinks already exist, which is false.

## Typed findings
- finding-id: codex-struct-2e4a90bc
- Type: design_flaw
- Domain: docs-sync
- Disposition: open
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:361-362`, `:398-399`, and `:426` claim existing placeholders and `.claude` mirror symlinks. Fresh `ls` on `.gobbi/.../orchestration/{chat,auto}-mode.md` and `.claude/.../{chat,auto}-mode.md` returned "No such file or directory" for all four paths. `find` showed `.agents/skills/orchestration` is a directory symlink, while `.claude/skills/orchestration` currently has only `SKILL.md`.
  Finding: The CRUD plan is structurally wrong for the two central deliverables. Planning must change these from "replace placeholder" to "create canonical files"; it must also decide whether to create `.claude` per-file symlinks or stop claiming a `.claude` mirror exists for the new docs.

- finding-id: codex-struct-91cf42d0
- Type: checklist_gap
- Domain: process
- Disposition: open
- Confidence: 75
- Severity: High
- Evidence: `draft-iter1.md:39` and `:397` defer the default-set resolver choice, but current `orchestration/SKILL.md:98-100` reads and writes one default template before `settings.json` exists; current `settings.default.json` has `"mode": "auto"`.
  Finding: The "same schema, divergent defaults" design lacks the structural bootstrap step that selects Chat defaults before there is a resolved `settings.mode`. This is not just an Execution detail; it determines how Step 1 asks the mode question and which default file is read.

- finding-id: codex-struct-6f11d0e9
- Type: scenario_gap
- Domain: process
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: `draft-iter1.md:416-417` self-flags `session.json` and `state.json` single-instance workflow shapes, but section 7 Update table omits `templates/session.template.json` and `templates/state.template.json`; current templates only contain one `workflow.{loop}` record per step.
  Finding: The CRUD table under-specifies schema-template edits required by the per-task Chat state model. Planning needs tasks for the templates, not only prose.

## Low-confidence appendix
- finding-id: codex-struct-low-1
- Suppressed at confidence 25: The branch point "at Step-1 completion" may need a separate `workflow.modeDispatch` field for observability. This is plausible but not required if `settings.mode` and state display are updated cleanly.
