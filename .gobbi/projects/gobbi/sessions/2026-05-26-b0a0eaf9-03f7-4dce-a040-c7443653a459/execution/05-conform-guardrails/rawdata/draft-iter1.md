# T5 Conform Guardrails — Draft Iter 1

## Pre-change audit

10 docs under `features/guardrails/` (archive-safe). changelogs/2026-05-26-bundle-b-rehome.md is already fully conformant (all 9 base keys present).

### Leak gate baseline (before)

5 files flagged:
- backlogs/goodhart-factor-when-demanded-deferred.md (finding-id, confidence, severity)
- backlogs/hook-event-count-31-vs-29-docs-sync.md (finding-id, confidence, severity)
- backlogs/posttooluse-failure-webfetch-verification-gap.md (finding-id, confidence, severity)
- checklists/cross-layer-drift-gate.md (finding-id, confidence, severity)
- checklists/hook-event-count-31-vs-29-docs-sync.md (finding-id, confidence, severity)

### Base-key audit (before)

README.md: missing name, description, type, session, tags; extra non-standard keys: project, last_updated
backlogs/goodhart-factor-when-demanded-deferred.md: missing name, description, created; has type=assumption_risk (wrong — should be backlogs), date (not created)
backlogs/hook-event-count-31-vs-29-docs-sync.md: missing name, description, created; has date (not created)
backlogs/posttooluse-failure-webfetch-verification-gap.md: missing name, description, created; has date (not created)
changelogs/2026-05-26-bundle-b-rehome.md: FULLY CONFORMANT — no changes needed
checklists/cross-layer-drift-gate.md: missing name, description, created; has date (not created); type=checklist_gap (wrong — should be checklists)
checklists/hook-event-count-31-vs-29-docs-sync.md: missing name, description, created; has date (not created)
discussions/2026-05-24-mistake-bundle-extension-to-t3.md: missing name, description, type, status, created; has loop, topic, outcome (loop+outcome are legitimate per discussions template)
references/claude-code-hooks-12-lifecycle-events.md: missing name, description, status, created; has type=blog (wrong — should be references; blog → ref_type extension)
references/claude-code-posttooluse-hook-schema.md: missing name, description, status, created; has type=docs (wrong — should be references; docs → ref_type extension)

### De-crypt body refs

Scanned all 10 docs for load-bearing session-internal refs (T01, iter2, draft-iter3, row-5-5, etc.):
- backlogs/goodhart-factor-when-demanded-deferred.md: body mentions "T3", "iter1" in context (eval finding citation in ## Related — these are legitimately preserved as provenance in ## Related section, not load-bearing in body prose)
- backlogs/hook-event-count-31-vs-29-docs-sync.md: mentions "T3-E-5, D-3-3, F-Fix-B" in ## Decision (body prose instructs future executor via session coords — these are load-bearing in the decision body); mentions "draft-iter3.md" in ## Context (session coord)
- backlogs/posttooluse-failure-webfetch-verification-gap.md: mentions "iter3 leader", "iter2/iter3", "staging/references/..." (session staging path), "rawdata/draft-iter3.md T3-E-5, D-3-3" in ## Related
- checklists/cross-layer-drift-gate.md: mentions "iter2/iter3 Codex Risk finding", "draft-iter3.md:437" in ## Context
- checklists/hook-event-count-31-vs-29-docs-sync.md: mentions "draft-iter3.md" and "T3-E-5", "D-3-3", "F-Fix-B" in ## Checklist item body (instruction to executor — these are load-bearing session coords in prose)
- discussions/2026-05-24-mistake-bundle-extension-to-t3.md: mentions "T3", "T1", "D-3", "T3 tasks (07-10)", etc. — these are decision rationale referencing task codes; the ## Related also references draft-iter2.md line number
- references: no load-bearing session coords in body prose (they use "T3" as labels for design rationale but the meaning is carried by surrounding prose)

### De-crypt approach

Per §4.3: strip load-bearing session coords from evergreen-type bodies; NEVER delete narrative. For backlogs and decisions (evergreen types), "T3-E-5, D-3-3, F-Fix-B" in ## Decision/## Consequences is load-bearing (reader cannot act without knowing what these refer to). Fix: expand inline or wrap in natural prose so meaning is self-contained.

Specific expansions:
- "T3-E-5 / D-3-3 / F-Fix-B" → expand to the actual thing: "the hook event count references in the draft plan" or similar
- "draft-iter3.md" in ## Context → describe what the draft was (the planning artifact for T3 session work)
- "staging/references/..." → just "the staged reference file" or the feature path it was re-homed to
- "rawdata/draft-iter3.md:437" → describe the cross-cutting validation note location without the session coordinate

Note: ## Related sections are provenance/navigation — session coordinates there are acceptable as cross-references (§4.3 says "a single ## Source footer pointing at the canonical session artifact"). These are NOT stripped.

## Changes plan (per-doc)

### README.md
ADD: name: guardrails, description: (from value_proposition), type: features, session: a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7, tags: [iron-laws, mistake-capture, behavioral-floor]
STRIP: project (not in base schema or features extensions), last_updated (not in base schema or features extensions)
PRESERVE: value_proposition, subsystems (features-type extensions per §2.2)

### backlogs/goodhart-factor-when-demanded-deferred.md
ADD: name, description, created (derive from date: 2026-05-23)
FIX: type: assumption_risk → type: backlogs
STRIP: finding-id, confidence, severity (all in S per §4.4)
PRESERVE: disposition: deferred (legitimate backlogs extension)
STRIP: date (rename to created), domain (not in base or backlogs extension schema)
STRIP: supersedes/superseded_by (not backlogs extensions; backlogs has priority/disposition/project-scope/shipped_in)
ADD: priority: medium, project-scope: false, shipped_in: null (optional but complete)
DE-CRYPT: "T3" in body — expand to "the hook + reconstructor task (T3)" or leave if context is clear enough; "iter1 Claude Risk finding R3" in ## Context → this is in the session staging context that is now surfaced as provenance; leave as provenance in ## Related

### backlogs/hook-event-count-31-vs-29-docs-sync.md
ADD: name, description, created (derive from date: 2026-05-23)  
FIX: type: general → type: backlogs
STRIP: finding-id, confidence, severity, domain
PRESERVE: disposition: open
STRIP: date → rename to created; supersedes/superseded_by
DE-CRYPT: "draft-iter3.md" in ## Context → "the session planning draft for T3" or "(the T3 session planning artifact)"; "T3-E-5, D-3-3, F-Fix-B" in ## Decision → expand to "the hook event count references in the draft plan (T3-E-5, D-3-3, F-Fix-B)" — note these are load-bearing instructions

### backlogs/posttooluse-failure-webfetch-verification-gap.md
ADD: name, description, created (derive from date: 2026-05-23)
FIX: type: assumption_risk → type: backlogs
STRIP: finding-id, confidence, severity, domain, date → rename to created; supersedes/superseded_by
PRESERVE: disposition: open
DE-CRYPT: "iter3 leader" → "the session leader"; "staging/references/..." → feature memory path; "rawdata/draft-iter3.md T3-E-5" → expand in ## Related

### checklists/cross-layer-drift-gate.md
ADD: name, description, created (derive from date: 2026-05-23)
FIX: type: checklist_gap → type: checklists
STRIP: finding-id, confidence, severity, domain, date → rename to created
STRIP: disposition: open (checklists/ is NOT backlogs/ — disposition is illegitimate here)
DE-CRYPT: "iter2/iter3 Codex Risk finding COD-RISK-004" → "Codex evaluator Risk finding COD-RISK-004"; "draft-iter3.md:437" → describe the cross-cutting note without the session coord

### checklists/hook-event-count-31-vs-29-docs-sync.md
ADD: name, description, created (derive from date: 2026-05-23)
FIX: type: general → type: checklists
STRIP: finding-id, confidence, severity, domain (wait — this file has no domain key; check actual keys)
STRIP: disposition: open (not under backlogs/)
STRIP: date → rename to created
DE-CRYPT: "draft-iter3.md" and "T3-E-5, D-3-3, F-Fix-B" in ## Checklist item → expand to self-contained meaning

### discussions/2026-05-24-mistake-bundle-extension-to-t3.md
ADD: name, description, type: discussions, status: active, created (from date: 2026-05-24)
PRESERVE: loop, outcome (legitimate discussions template extensions per the template)
STRIP: topic (not in template — discussions template has outcome but not topic; the topic is the name/description)
STRIP: date → rename to created
DE-CRYPT: "T3 tasks (07-10)", "T1 tasks", "D-3" in body — these are load-bearing decision rationale; expand or leave with surrounding prose that makes meaning clear. "draft-iter2.md:431-443" in ## Related → this is provenance pointer, acceptable.

### references/claude-code-hooks-12-lifecycle-events.md
ADD: name, description, status: active, created (from accessed: 2026-05-23; session session-id date)
FIX: type: blog → type: references; add ref_type: blog
PRESERVE: title, source, accessed, tags, related (references extensions)
STRIP: none of the staging keys appear here

### references/claude-code-posttooluse-hook-schema.md
ADD: name, description, status: active, created (from accessed: 2026-05-23)
FIX: type: docs → type: references; add ref_type: docs
PRESERVE: title, source, accessed, tags, related (references extensions)
STRIP: none of the staging keys appear here

## Out-of-scope observations

1. backlogs/goodhart-factor-when-demanded-deferred.md body is formatted as a decision (ADR shape with ## Decision, ## Rationale, ## Alternatives considered, ## Consequences) rather than a backlogs format (## Context, ## Why deferred, ## When to pick up). This is a type-purity issue (§4.1.1) — the body format doesn't match the `type: backlogs`. Per scope constraints, this is noted but NOT reformed (prose-quality rewrite is out of scope for T5; mechanical conformance only).

2. backlogs/hook-event-count-31-vs-29-docs-sync.md same type-purity issue (decision body in a backlog file).

3. backlogs/posttooluse-failure-webfetch-verification-gap.md same.

4. discussions/2026-05-24-mistake-bundle-extension-to-t3.md: "T3" throughout refers to specific task numbering from the planning phase. Expanding all would be a significant prose rewrite. This task's de-crypt scope is: fix load-bearing refs where meaning is fully trapped (reader cannot follow without the session). The "T3" here is explained in surrounding prose ("the hook + reconstructor"), so it meets the 'not purely load-bearing' bar. The ## Related line "draft-iter2.md:431-443" is a provenance cross-reference which §4.3 allows in ## Source/## Related.

5. references files have a `related` key in frontmatter — the references template shows ## Related as body section, not frontmatter. The `related` key in frontmatter is non-standard. Per scope: noted here, not reformed (would change frontmatter structure beyond the base-key addition).
