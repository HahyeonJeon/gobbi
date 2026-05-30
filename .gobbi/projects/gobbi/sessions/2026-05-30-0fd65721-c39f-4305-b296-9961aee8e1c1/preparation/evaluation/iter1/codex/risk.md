# Risk Perspective

## COD-RISK-001 - Option C validation can produce a false double-fire failure unless the test surface is isolated

Type: scenario_gap  
Severity: Medium  
Confidence: 75  
Evidence: Option C intentionally keeps `.claude/settings.json` hooks for development and plugin hooks for installed users (`preparation/staging/decisions/hook-double-registration-steady-state-dev-vs-installed-split.md:25-37`). The same decision accepts double-fire when both sources are active, but the fire-exactly-once test does not define an isolated installed-user fixture.  
Why-it-matters: A validation that runs in the current repo after plugin install is expected to double-fire, so it cannot prove installed-user fire-exactly-once. That creates a false failure path in Execution and can pressure the team to undo a user-ratified Option C decision.  
Suggested-direction: Add the isolated fixture requirement to Planning's verification criteria. Keep the dev-plus-installed double-fire case as a separate caveat check with different expectations.

## COD-RISK-002 - Missing `claude` skill may convert a preparation miss into execution-time improvisation

Type: assumption_risk  
Severity: High  
Confidence: 100  
Evidence: The report says the `claude` doc-authoring standard exists at canonical `skills/claude/SKILL.md` (`preparation/rawdata/preparation.md:68`), but local verification shows no such directory under `.gobbi/projects/gobbi/skills/`, `.agents/skills/`, or `.claude/skills/`.  
Why-it-matters: If Planning does not correct this, Execution must improvise the documentation-authoring basis for the new `claude-plugin` skill. That is exactly the kind of hidden readiness gap Preparation is supposed to surface before implementation.  
Suggested-direction: Resolve the missing standard explicitly: generate it, defer it with an impact note, or remove it from the required-skill list and provide the real evidence sources.
