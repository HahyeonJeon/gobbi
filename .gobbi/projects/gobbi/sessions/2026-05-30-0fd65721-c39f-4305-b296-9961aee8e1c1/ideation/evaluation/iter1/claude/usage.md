# Usage — Ideation eval iter1 (claude)

## Artifact Summary + Memory reads
(See project.md.) Usage lens: can the Planner decompose without re-asking the user; can the Executor know what to change; 3am-maintainer test.

## Locked Frame (Stage 1)
- **S1 Planner produces a task list without returning to the user.** (a) every DD specific enough to start; (b) scenarios map 1:1 to tasks.
- **S2 Executor knows which file/module to change per scenario.** (a) every cited insight has a followable path/URL; (b) component/path names stable across doc.
- **S3 3am maintainer understands what+why from artifact alone.** (a) consumers named + each confirmed usable; (b) glossary terms defined/referenced.
- **S4 Failure modes communicated match implementation.** (a) each failure mode has an implementation expectation.
- **S5 (adversarial) Consumer forms wrong mental model.** (a) borrowed project terms used with same meaning; (b) overloaded terms locally disambiguated.
- **S6 Accessibility/i18n** — not-applicable: scope excludes user-facing UI/strings (markdown + JSON manifest only).
- **S7 Observability/3am-diagnosable** — (a) the design names what verification surface exists post-install.

## Per-scenario per-check results
- **S1a** YES — DD-1..6 each carry a Recommendation + Rationale + Validation; no "we'll figure out the library later." **S1b** PARTIAL — Scenarios (Golden/Edge/Failure/Uninstall) map cleanly to checklist items; the one genuinely open item ("hooks.json replaces or coexists with settings.json — double-fire risk") is EXPLICITLY flagged "Open residual for Planning" (L51) — correctly handed off rather than silently dropped. This is the right Ideation behavior, but it IS a decision the Planner must resolve; see F-U1.
- **S2a** YES — every insight cites a file/`grep` command or a staged ref path; I followed and confirmed each. **S2b** PARTIAL — "two hooks" vs three registrations (see Aesthetics F-A1 / Consistency) is the one stability wrinkle.
- **S3a** YES — consumers named (solo user, future adopter, Planner, Executor). **S3b** PARTIAL — `${CLAUDE_PLUGIN_ROOT}`, `@skills-dir`, ADDS-to/REPLACE used without inline glossary but each traces to a staged ref a consumer can open.
- **S4a** YES — each Failure scenario (symlink-pointed-directly, components-in-.claude-plugin) has a prevention tied to a DD.
- **S5a** YES — "mirror", "canonical", "symlink" used consistent with skills-mirror-symlinks-not-copies mistake. **S5b** YES — "feature reuse" disambiguated (B1 note).
- **S7a** YES — post-install verification surface named (validate CLI, readlink, session.json env-var persistence, agents[] upsert).

## Typed findings
**F-U1** — Type: design_flaw · Domain: process · Disposition: open · Confidence: 50 · Severity: Medium
Evidence: The hook double-registration question (plugin `hooks/hooks.json` vs project-local `.claude/settings.json` — "double-fire risk", L51 + discussion-log L24-25) is deferred to Planning as an "Open residual." This is a genuine functional decision (if both fire, every subagent gets double-upserted into `session.json.agents[]`, and SessionStart env-vars get appended twice). Deferring it is defensible at Ideation, BUT the draft gives Planning no decision criteria or options to choose between — it just names the risk. Why it matters: Planning may re-litigate (back to the user) or pick blindly. Suggested direction: the artifact could sketch the 2-3 options (plugin replaces settings.json registration / coexist with dedup / settings.json stays project-local-only) so Planning decides rather than re-researches. Medium because it directly affects whether the installed plugin double-fires.

## Per-perspective verdict: PASS
