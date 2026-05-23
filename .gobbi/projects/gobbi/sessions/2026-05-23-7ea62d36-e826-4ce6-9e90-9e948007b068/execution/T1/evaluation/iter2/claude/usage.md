# Usage — iter2 re-eval (T01)

**Verdict:** PASS
**Findings:** 0 Critical / 0 High / 0 Medium / 0 Low

## Gate-3 evidence (user-asking references)

```
$ grep -nE "(asks?|ask) the user" skills/gobbi/SKILL.md
11:`/gobbi` is the session-bootstrap front door. It loads core skills, checks
session settings, asks the user one setup question and an optional customize
gate if needed, and hands off to the workflow. ...
```

Only one `asks the user` reference remains in the entire file, and it correctly states the 1-question + optional customize-gate model. The Step 4 heading "Ask the user one setup question" (line 80) is the procedural anchor and uses the same model.

## Rationale

A new manager reading the file will get a consistent story: header (line 11) says "one setup question + customize gate"; Step 4 implements exactly that (mode question via Question Card, then a customize-gate AskUserQuestion); Step 3's "reuse" branch correctly skips "the setup question" (singular); Constraints section's "MUST run the session bootstrap sequence in order" reflects the same shape. No contradictory user-ask remains.
