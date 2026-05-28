# Codex Adversarial Evaluation — Ideation Artifact (gobbi memory-doc refactor)

You are an independent adversarial evaluator. The agent that produced the artifact below CANNOT evaluate it — that is your job. You arrive with NO exposure to the producer's reasoning. Do NOT trust any claim in the artifact; verify against the actual repository files.

## What you are evaluating

The Ideation artifact (a research-backed design + scope proposal) for a session whose goal is to refactor gobbi **project memory docs** (`.gobbi/projects/gobbi/...`) to "development-document level," building on the already-completed structural redesign in PR #272 (7 capability features + naming standard — these are SETTLED, not under review).

Primary artifact (READ IN FULL):
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/rawdata/draft-iter1.md`

Supporting context:
- Decision log (what the user actually ratified): `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/rawdata/discussion-log.md`
- Staged references: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/staging/references/`
- The existing memory standard the proposal extends: `./.claude/skills/memorization/rules.md`
- Ground-truth docs the proposal makes claims about: `./.gobbi/projects/gobbi/features/`, `./.gobbi/projects/gobbi/mistakes/`, `./.gobbi/projects/gobbi/design/`

## What to check (adversarially)

1. **Faithfulness to user decisions** — does the artifact's Scope Contract + Design faithfully encode the 8 locked decisions in the discussion log, with NO open forks and NO content the user did not approve? Flag any drift.
2. **Evidence integrity** — the artifact makes quantitative claims (e.g., "~147 docs," "only ~14-25 carry base frontmatter," "64 files leak staging-only keys like finding-id/disposition/confidence/severity," "cryptic body refs like T1-I-2 / draft-iter3.md:308"). SPOT-CHECK these against the real files with your own grep/find. Are the numbers defensible? Over/understated?
3. **Scope coherence** — is In-Scope / Out-of-Scope / Deferred internally consistent and achievable as one session's work (standard + conformance wave + prose wave + minimal grep gate)? Is anything mis-scoped (too big, or smuggling implementation into Ideation)?
4. **Standard soundness** — is the proposed dev-doc standard (type-purity, per-type section contracts, self-contained prose, frontmatter conformance) sound, and does it genuinely EXTEND rather than CONTRADICT the existing rules.md / Principle 13? Any conflict?
5. **Success criteria** — are the 4 success criteria measurable and actually verifiable? Any vague/ungradeable criterion?
6. **Risk / counterfactual** — is the steel-man (churn risk on docs that change every session) adequately answered? Any unaddressed risk that should block or reshape the plan?
7. **Missing considerations** — anything important the artifact omits (e.g., how to handle the unmerged-#272 / develop-divergence; the 12-vs-13 principle drift; what happens to readers on develop who don't have P13)?

## Output (write exactly these files, paths relative to your CWD)

Write your full assessment to:
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/evaluation/iter1/codex/overall.md`

That file MUST contain, in this shape:
- A `## Findings` section. Each finding: a `**Type:**` chosen from EXACTLY this vocabulary — `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general` — plus `**Severity:**` (Low/Medium/High/Critical), `**Confidence:**` (0-100), a description with file-path evidence, and a recommended fix.
- A final line exactly: `VERDICT: PASS` or `VERDICT: REVISE` or `VERDICT: FAIL`.
  - PASS = artifact is a sound basis for Planning. REVISE = fixable gaps. FAIL = unevaluable / structurally wrong framing.

Be concrete and cite real file paths/line evidence. If a claim in the artifact checks out, say so briefly. If the artifact is solid, PASS is the correct verdict — do not manufacture findings.
