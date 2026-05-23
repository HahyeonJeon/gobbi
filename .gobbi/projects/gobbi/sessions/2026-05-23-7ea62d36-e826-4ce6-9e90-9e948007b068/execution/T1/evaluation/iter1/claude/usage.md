# Usage Evaluator — Claude — iter1 — T1

**Perspective:** usage (how a new session manager reads + executes this)
**Verdict:** PASS

## Stage 0 — Target Understanding

The manager loads gobbi/SKILL.md at every session start. The Session Bootstrap Order is the operational checklist. Step 4 is the user-facing setup conversation.

## Stage 1 — Frame

Scenarios:
1. Fresh session manager reads Step 4 — does it know exactly what to ask?
2. User picks `auto`, declines customize — does the manager have unambiguous defaults?
3. User picks `chat`, wants to customize — does the manager have a clear pointer?
4. Old sessions resuming will see Step 4 changed — is there a regression risk for already-persisted settings.json files?

## Stage 2 — Evidence

S1: The Step 4 prose names one AskUserQuestion question, lists 2 options (Auto/Chat) with Recommended on Auto, then a single follow-up customize question. Unambiguous.

S2: Default path → `settings.json` gets `.mode = "auto"`; other fields fall back to settings.default.json. Verified `.mode == "auto" and .git.pr.open == false and .git.pr.draft == false` via jq. PASS.

S3: Customize gate → manager opens `orchestration/SKILL.md § Step 1 rows 1-2`. Step 4 explicitly says "rows 1-2", which is precise.

S4: Resumed sessions — Step 3 reads existing settings.json. Any session whose settings.json already has `git.workflow.mode` or `workflow.{phase}.evaluate.mode` will continue to work (the schema didn't change, only the prompt did). No regression — Plan task 13 deliberately verified settings.default.json is unchanged.

## Findings

None.

## Must-Preserve

- The phrase "rows 1-2" (precise rather than "see § Step 1") so the manager knows what to walk through.
- Step 4 keeps a single AskUserQuestion call as the primary turn, then a second AskUserQuestion for the customize gate — preserving the AskUserQuestion-for-decisions rule.

## Verdict

PASS.
