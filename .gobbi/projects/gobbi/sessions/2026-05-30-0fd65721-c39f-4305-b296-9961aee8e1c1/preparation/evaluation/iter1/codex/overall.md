# Overall

## COD-OVERALL-001 - READY is not sound until readiness accounting is reconciled

Type: general  
Severity: High  
Confidence: 100  
Evidence: Cross-perspective findings show three concrete contradictions: a claimed-present `claude` skill is absent; "Generated this loop: None" conflicts with five preparation staging files; user-ratified permissions and 18-skill decisions still appear as proposed/open in parts of rawdata and staging.  
Why-it-matters: The five resolved design recommendations are mostly directionally correct, and the mechanical inventory claims about 18 skills, 5 `.md` agents plus 5 `.toml` wrappers, current 3 hook blocks, and `source: "./plugins/gobbi"` checked out. The problem is that the READY verdict is stronger than the artifact's internal consistency supports. Planning can proceed after a targeted Preparation revision; it should not inherit stale state labels and false workspace-skill readiness.  
Suggested-direction: Revise the Preparation artifact before Planning: correct the missing `claude` skill row, list the five staged artifacts, align ratified decision statuses/text, and add an installed-only fixture to the Option C fire-once validation.

## COD-OVERALL-002 - Verified claims that should be preserved

Type: general  
Severity: Low  
Confidence: 100  
Evidence: Local checks confirmed: canonical skill count is 18 and `gobbi-hook-authoring` is the unmirrored 18th; `.gobbi/projects/gobbi/agents/` has exactly 5 `.md` and 5 `.toml`; `.claude/settings.json` has the expected SessionStart/PostToolUse/PostToolUseFailure hook blocks and matchers; `git show e083fad^:.claude-plugin/marketplace.json` uses `source: "./plugins/gobbi"`; current official Claude docs confirm relative `./plugins/my-plugin` source paths resolve from marketplace root and plugin components live under the plugin root with `.claude-plugin/plugin.json` as the manifest.
Why-it-matters: These are the high-value parts of the Preparation report. Revision should not reopen them without new evidence.  
Suggested-direction: Preserve the package root, 18-skill package inventory, 5-agent `.md` enumeration, current 2-script/3-registration hook shape, and real-copy materialization direction while fixing the readiness-accounting gaps.

VERDICT: REVISE
