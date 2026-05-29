VERDICT: REVISE

## Artifact Summary + Memory reads
The artifact is an Ideation iter1 rawdata draft for redesigning Gobbi's Chat Mode and Auto Mode. What: create canonical `orchestration/chat-mode.md` and `orchestration/auto-mode.md`, amend `orchestration/SKILL.md`, update mode defaults, and archive two mode-related backlogs. Why: the current mode lock treats Chat as the same six-step state machine with more user gates, while the user-ratified direction wants Chat to run per-user-typed task slices and Auto to codify Always-Ask gates. How: split mode specs into sub-documents, replace the global lock with a correction note, dispatch state-machine shape by resolved `settings.mode`, preserve evaluation and memorization rigor, and use task records as Chat Wrap-up inputs. Scope Contract source: `draft-iter1.md` section 2. Downstream consumers: Planning, Execution, Wrap-up MEMORIZATION, and future managers reading the orchestration skill.

### Memory reads
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter1.md`: target artifact, read in full.
- `.agents/skills/evaluation/SKILL.md`, `.agents/skills/ideation/evaluation.md`, `.agents/skills/orchestration/workflow/ideation.md`: evaluation procedure and Ideation frame.
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`: project rule, declared not applicable because no redirect stub is being created.
- `.gobbi/projects/gobbi/mistakes/*.md`: project mistakes read and filtered. Applicable here: `design-literal-retire-instruction-without-replacement.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `skills-mirror-symlinks-not-copies.md`, `prose-reclassification-target-is-project-level-notes.md`, `memorization-delegation-prompts-must-load-memorization-skill.md`, `wrap-up-promotion-must-strip-staging-frontmatter.md`. Worktree/path-only Codex mistakes are not applicable to the design content except for output write-path discipline.
- `.gobbi/projects/gobbi/backlogs/chat-mode-tiki-taka-redesign.md` and `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md`: backlog witness status.
- `.gobbi/projects/gobbi/skills/orchestration/SKILL.md`, `templates/settings.default.json`, `templates/state.template.json`, `templates/session.template.json`: current orchestration and state/settings schemas.

## Locked Frame (Stage 1)
Scenario 1: The draft solves the right problem inside the locked scope.
- Check: W/W/H is present and specific.
- Check: Scope Contract identifies project, feature, task, in-scope, out-of-scope, decisions, success criteria, and deferred work.
- Check: Design sections stay within "write the specification, final prose in Execution."

Scenario 2: The backlog witnesses are true and terminal-state handling is not prematurely claimed.
- Check: Backlog files cited as witnesses exist.
- Check: The artifact distinguishes "open witness backlog" from "will be closed when shipped."
- Check: Archive procedure is scoped to Wrap-up after implementation ships.

Scenario 3 (adversarial): A Planner treats the table in section 2 as a canonical Scope Contract and silently loses missing contract fields.
- Check: Section 2 satisfies the canonical Scope Contract schema from `evaluation/SKILL.md`.
- Check: Success criteria are observable by a downstream reviewer.
- Check: Deferred/backlog routing is explicit and does not depend on reading later prose.

Applicable mistake scenarios:
- `design-literal-retire-instruction-without-replacement.md`: preserve correction/supersession auditability, but verify the replacement target exists and owns the retired responsibility.
- `section-order-is-part-of-the-contract-not-just-the-set.md`: the new mode docs and correction blocks need ordered section contracts, not only topic lists.
- `skills-mirror-symlinks-not-copies.md`: mirror assumptions must be verified before Planning locks CRUD.

Coverage notes:
- Accessibility and i18n: not applicable to Project except as Usage-owned non-UI consumability.
- Privacy, licensing, supply chain, cost, observability, and error budget: owned by later perspectives.

## Per-scenario per-check results
Scenario 1:
- W/W/H present: yes. Evidence: `draft-iter1.md:15-20`, `:24-31`, and `:35-43`.
- Scope Contract complete: no. Evidence: `draft-iter1.md:47-57` is a table with Project/Feature/Task and out-of-scope rows, but no canonical frontmatter, `## In-Scope`, `## Out-of-Scope`, `## Decisions Locked`, `## Success Criteria`, or `## Deferred` sections.
- Scope bounded to specification: mostly yes. Evidence: `draft-iter1.md:20` says the deliverable is specification and final prose authoring is Execution; `:55-56` says only this Idea doc is in-scope for this loop.

Scenario 2:
- Backlog witnesses exist: yes. Both files exist under `.gobbi/projects/gobbi/backlogs/`.
- Terminal status accurately stated: no. Evidence: `draft-iter1.md:26` describes the two open backlogs as "closed 2026-05-23"; the files themselves have `status: active` and `disposition: open`.
- Archive scoped to post-ship Wrap-up: mixed. Evidence: `draft-iter1.md:431-443` says "when the redesign ships", but section 2 labels them "Backlogs closed by this work" at `:57`, which can be read as already terminal.

Scenario 3:
- Canonical schema satisfied: no. Evidence: current evaluation Scope Contract schema requires five body sections; section 2 has none of the five as headings.
- Observable success criteria: no. Evidence: the artifact has no explicit success criteria row or section; downstream pass/fail criteria must be inferred from the CRUD table and risks.
- Deferred routing explicit: partial. Evidence: `draft-iter1.md:56-57` and section 9 identify deferred-to-Execution and backlog archive handling, but not in canonical Scope Contract fields.

## Typed findings
- finding-id: codex-proj-a13f0c91
- Type: checklist_gap
- Domain: process
- Disposition: open
- Confidence: 75
- Severity: High
- Evidence: `draft-iter1.md:47-57` uses a compact table for the Scope Contract, while the evaluation skill's Scope Contract schema requires `## In-Scope`, `## Out-of-Scope`, `## Decisions Locked`, `## Success Criteria`, and `## Deferred`. There is no explicit Success Criteria section.
  Finding: The Scope Contract is not sharp enough for Planning to refuse out-of-scope work or verify completion without inference. The draft has strong W/W/H, but the downstream contract is missing the canonical shape and success criteria.

- finding-id: codex-proj-b4709e42
- Type: general
- Domain: docs-sync
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: `draft-iter1.md:26` calls the two witnesses "open backlogs" and also says they were "closed 2026-05-23"; both backlog files still show `status: active` and `disposition: open`.
  Finding: The witness status language is internally misleading. The backlogs are valid witnesses, but the artifact should say they are open and will close when this redesign ships, not that they were closed on May 23, 2026.

## Low-confidence appendix
- No suppressed Project findings above confidence 25. Possible concern below threshold: the Scope Contract's table form may have been intentionally compact for rawdata, but downstream Planning explicitly consumes canonical Scope Contract fields, so the scored finding stays above threshold.
