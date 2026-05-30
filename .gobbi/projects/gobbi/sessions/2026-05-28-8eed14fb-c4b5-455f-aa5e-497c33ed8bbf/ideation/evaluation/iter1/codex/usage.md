VERDICT: REVISE

## Artifact Summary + Memory reads
The draft's consumers are a Planner decomposing tasks, an Executor changing skill docs/templates, a Wrap-up assistant archiving/promoting memory, and future managers operating Chat/Auto Mode. Usage review asks whether those consumers can act without asking the user for missing semantics.

### Memory reads
- Target draft read in full, especially task-record, settings, and Wrap-up sections.
- `memorization/templates/notes.md`, `memorization/SKILL.md`, and `wrap-up/SKILL.md` read for task-record and promotion semantics.
- `discussion/SKILL.md` read for Always-Ask and User Challenge terms.
- Applicable mistakes: `prose-reclassification-target-is-project-level-notes.md`, `memorization-delegation-prompts-must-load-memorization-skill.md`, `wrap-up-promotion-must-strip-staging-frontmatter.md`.

## Locked Frame (Stage 1)
Scenario 1: Planner can decompose the design without clarifying mode-specific memory semantics.
- Check: "task-record" has a correct memory type and lifecycle.
- Check: Per-loop memorization scope is clear.
- Check: Wrap-up input sources are sufficient when per-loop staging is narrowed.

Scenario 2: Executor knows exactly which files to create/update.
- Check: Create/update rows match file existence.
- Check: Settings/state/session template updates are all listed.
- Check: Consumer-facing examples are complete enough to write final prose.

Scenario 3 (adversarial): A future assistant promotes per-task records as project notes and pollutes the journal.
- Check: `task-record.md` does not use durable `notes` frontmatter unless it is meant to become a project-level journal entry.
- Check: Multiple task records per session do not violate notes' "one journal per session" convention.
- Check: Wrap-up routing says whether task records remain session artifacts, become derivative notes, or both.

Coverage notes:
- Accessibility: applicable as reader/operator accessibility; headings and task-record fields are scannable.
- I18n: not applicable; no user-facing localized runtime strings are introduced.
- Observability: applicable as "diagnosable at 3am"; status display and task records partially cover this.

## Per-scenario per-check results
Scenario 1:
- Correct memory type/lifecycle for task-record: no. Evidence: `draft-iter1.md:153-157` puts `type: notes`, `scope: project`, `feature: null` on a session-local `chat/tasks/.../task-record.md`; `notes.md` says notes are project-level chronological work-log entries, normally one per session.
- Per-loop memorization scope clear: partial/no. Evidence: `draft-iter1.md:37` says per-loop MEMORIZATION is skipped; `:134` says it runs with a narrowed contract.
- Wrap-up input sources sufficient: partial. Evidence: `draft-iter1.md:120-126` says Wrap-up mines transcript and task records; R6 at `:420` admits Wrap-up must be extended.

Scenario 2:
- Create/update rows match existence: no. See Structure finding.
- Template updates listed: partial/no. `settings.default.json` is listed; `state.template.json` and `session.template.json` are not.
- Examples complete: partial. The task-record body is specified, but no template is provided and R10 leaves this as low severity despite being a recurring consumer artifact.

Scenario 3:
- Durable notes frontmatter safe: no.
- Multiple records per session align with notes convention: no. `notes.md` says one entry per session is the norm; a task record per Chat task is a different artifact type.
- Routing explicit: partial/no. The draft says Wrap-up "may also reclassify task-record bodies' narrative into project-level notes", which leaves the primary task-record lifecycle ambiguous.

## Typed findings
- finding-id: codex-usage-d44ce0b9
- Type: design_flaw
- Domain: process
- Disposition: open
- Confidence: 75
- Severity: High
- Evidence: `draft-iter1.md:153-157` gives task records `type: notes` frontmatter under `sessions/.../chat/tasks/...`; `memorization/templates/notes.md` defines `notes/` as project-level only and session-paced, with one journal entry per session as the norm.
  Finding: `task-record.md` is not a durable `notes` artifact as specified. It is a session-local per-task artifact that Wrap-up reads. Giving it `type: notes` and project-scope frontmatter risks incorrect promotion, multiple project notes per session, or frontmatter that violates the session artifact model. Define it as an artifact (`artifact_type: task-record`) or add a dedicated task-record template/lifecycle.

- finding-id: codex-usage-0fbc3d75
- Type: checklist_gap
- Domain: observability
- Disposition: open
- Confidence: 50
- Severity: Medium
- Evidence: `draft-iter1.md:299-302` proposes a Chat status display, but no examples show what a completed prior task, active task, or wrap-up-pending state looks like after several tasks.
  Finding: The proposed status display is directionally useful but under-specified for multi-task Chat sessions. A future manager needs one concrete completed-task plus active-task example to avoid presenting a confusing status table.

## Low-confidence appendix
- finding-id: codex-usage-low-1
- Suppressed at confidence 25: The phrase "explicit end-of-session message" may need command vocabulary beyond examples like "wrap up", but the current examples are likely sufficient for Ideation.
