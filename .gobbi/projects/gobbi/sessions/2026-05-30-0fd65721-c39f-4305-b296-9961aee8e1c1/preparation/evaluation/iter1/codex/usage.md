# Usage Perspective

## COD-USAGE-001 - Option C fire-once validation omits the required installed-only test context

Type: scenario_gap  
Severity: Medium  
Confidence: 75  
Evidence: The hook decision says `.claude/settings.json` remains active for dev, plugin `hooks.json` serves installed users, and machines that both develop in-repo and install the plugin will double-fire (`preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md:25-37`; `preparation/rawdata/discussion-log.md:3-4`). The fire-exactly-once validation only says "installed case" and "trigger each event once post-install" (`preparation/rawdata/preparation.md:93-96`) but does not specify running in a clean fixture project or otherwise disabling the dev `.claude/settings.json` hook source. Official Claude docs warn migrated hooks can duplicate unless the original standalone files are removed after plugin migration: https://code.claude.com/docs/en/plugins.  
Why-it-matters: If Execution runs the fire-once test from this dev repo after installing the plugin, the accepted Option C caveat predicts two sources will fire. The test will fail for the wrong reason or, worse, normalize a double-fire result as installed-user behavior.  
Suggested-direction: Planning should define two separate validation scenarios: (1) installed-only, run from a clean fixture project with no gobbi `.claude/settings.json` hooks, expected exactly one marker per event; (2) dev-plus-installed caveat, run from this repo if desired, expected duplicate markers but no data corruption due to `flock` and upsert-by-id.

## COD-USAGE-002 - Missing `claude` skill creates a false consumer contract for the executor

Type: assumption_risk  
Severity: High  
Confidence: 100  
Evidence: The executor-skills table marks `claude` as present and needed for `.claude/` doc-authoring (`preparation/rawdata/preparation.md:64-69`), but the skill does not exist in `.gobbi/projects/gobbi/skills/`, `.agents/skills/`, or `.claude/skills/`.  
Why-it-matters: The next Planning leader may assign the documentation-heavy `claude-plugin` skill task with a nonexistent supporting skill in the load directives. That is a direct usability failure for the next consumer of the Preparation report.  
Suggested-direction: Replace the false contract with a real one: either add/generate the missing skill before Planning, or state that no such skill exists and give the executor the exact official docs/project files to use instead.
