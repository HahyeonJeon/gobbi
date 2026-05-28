# Codex Adversarial Evaluation — T0: dev-doc quality standard (§4 of rules.md)

You are an independent adversarial evaluator of a CODE/DOC change. Do NOT trust the executor's report; verify against the actual file + git diff at HEAD.

## What you are evaluating
T0 added a new §4 "Dev-document quality standard" to the canonical `.gobbi/projects/gobbi/skills/memorization/rules.md` (commit be43c43). It is the foundation 24 downstream retrofit tasks verify against.

The change: `git -C . show be43c43 -- .gobbi/projects/gobbi/skills/memorization/rules.md` (or `git diff` of that file). Read the FULL §4 in the file: `.gobbi/projects/gobbi/skills/memorization/rules.md`.
The locked design it must match: `.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/design-options.md` (D1-D10 + FIX-1).

## Check adversarially
1. **Scope discipline** — `git show --stat be43c43`: ONLY rules.md changed? §1-3 untouched (pure append, no renumber/rewrite)? Any out-of-scope edit?
2. **Design match** — does §4 faithfully encode D3 (positive quality bar), D4 (per-type section contracts), D5 (self-contained prose), D6 (FIX-1 type-aware predicate), D10 (archive exclusion)? Anything missing or invented beyond the locked design?
3. **FIX-1 correctness (the load-bearing part)** — the illegitimate-key-set S MUST list BOTH hyphen and underscore spellings (finding-id/finding_id, promoted-from/promoted_from, etc.); `disposition` must be in S ONLY when NOT under backlogs/ (legitimate on backlogs per §2.2 L110). Would following §4's predicate preserve legitimate disposition AND catch underscore leaks? Any way it corrupts legitimate frontmatter or misses a leak?
4. **Grep-gate safety** — does the §4.5 gate command carry `-not -path '*/archive/*'` (archive-safe) AND catch underscore spellings? Does it correctly AVOID false-positives on legitimate disposition-on-backlogs (i.e., does it omit disposition from the blanket gate, or scope it)? RUN the gate yourself — does it execute without error and skip archive/?
5. **Positive-guidance + examples** — does §4 LEAD with a positive definition + a real before/after table (per the naming-standard mistake)? Or is it prohibition-only?
6. **Self-containment / quality** — is §4 itself a good dev-doc (clear, scorable checklist an evaluator could apply to a doc)? Any vagueness that makes it un-scorable?

## Output (write exactly this file, relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/execution/00-author-dev-doc-standard/evaluation/iter1/codex/overall.md`
Shape: `## Findings` (each: `**Type:**` from {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + file/line evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = the standard is correct, complete vs locked design, and safe as the foundation. REVISE = fixable gaps. FAIL = the gate/predicate is wrong in a way that would corrupt docs downstream. If sound, PASS — don't manufacture findings.
