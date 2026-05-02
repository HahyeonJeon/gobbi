---
name: _research-evaluation
description: Stage-specific evaluation criteria for research output. MUST load when evaluating research results.
allowed-tools: Read, Grep, Glob, Bash
---

# Research Evaluation

Stage-specific evaluation criteria for research output. Load this skill alongside _evaluation when evaluating the result of a research step.

Research output consists of: `innovative.md` (innovative researcher findings), `best.md` (best-practice researcher findings), `research.md` (orchestrator synthesis), and `results/` (detailed artifacts). Evaluate the synthesis primarily, but check that individual stance notes contribute meaningfully.



---

## What You're Evaluating

The research step produces stance-based notes and an orchestrator synthesis. The innovative researcher explores unconventional approaches and emerging patterns. The best-practice researcher grounds recommendations in established patterns and proven solutions. The orchestrator synthesizes both into a unified research document mapping findings to plan tasks.

Evaluate the synthesis as the primary artifact — it is what executors will read. Then verify that both stance notes exist, are substantive, and that the synthesis accurately represents their contributions without losing important nuance from either stance.

---

## Evaluation Criteria

### Completeness

- **All plan tasks covered?** — Does the research address every task in the approved plan? Compare the research synthesis against the plan task list point by point. A plan task with no corresponding research means the executor will have to research from scratch — defeating the purpose of this step.
- **Both stances represented?** — Are both innovative and best-practice perspectives present for each major topic? If one stance is missing or trivially short, the synthesis lacks the tension that produces strong recommendations.
- **Synthesis complete?** — Does `research.md` cover all findings from both stance notes? Are there substantive points in `innovative.md` or `best.md` that the synthesis dropped without justification?
- **Artifacts present?** — Does the `results/` directory contain the expected detailed artifacts? Are they referenced from the synthesis?

### Depth

- **Implementation paths concrete?** — Can an executor read a recommendation and know exactly what to implement? "Use a middleware pattern" fails. "Add a middleware function in `src/middleware/auth.ts` that intercepts requests before route handlers, checking the JWT token from the Authorization header" passes.
- **Codebase references accurate?** — Are file paths, function names, and patterns mentioned in the research real? Use `Read` and `Grep` to verify. A research note citing `src/utils/helpers.ts` when that file doesn't exist is worse than no reference at all.
- **External sources cited?** — When recommending external libraries, patterns, or best practices, are sources identified? Are version constraints or compatibility notes included where relevant?
- **Trade-offs explored?** — For each recommendation, are the costs and benefits stated? An approach presented without trade-offs is either shallow or hiding something.

### Accuracy

- **Codebase claims verifiable?** — Use `Grep` and `Read` to spot-check file paths, function signatures, and pattern claims. Research that references the codebase must be grounded in what actually exists, not what the researcher assumed.
- **External claims correct?** — Are library capabilities, API behaviors, and best-practice descriptions accurate? Flag anything that sounds plausible but unverified.
- **No hallucinated patterns?** — Does the research describe patterns or structures that don't exist in the codebase? Check any claim about "the existing pattern in X" by reading X.
- **Version and compatibility correct?** — If the research recommends specific library versions or framework features, are those recommendations compatible with the project's current stack?

### Practical Utility

- **Executor-ready?** — Would an executor reading this research know exactly what to implement and how, without needing to do additional research? If the executor has to open a browser or grep the codebase to fill gaps, the research is incomplete.
- **Clear recommendations per task?** — For each plan task, is there a clear recommendation with rationale? Research that presents options without recommending one forces the executor to make design decisions outside their role.
- **Synthesis adds value?** — Does the synthesis do more than concatenate the two stance notes? It should resolve conflicts between stances, identify where they agree, and produce a unified recommendation that is stronger than either stance alone.
- **Actionable structure?** — Is the research organized so that an executor working on Task 3 can find Task 3's research quickly without reading the entire document?

---

## Perspective-Specific Focus

| Perspective | Primary Focus |
|---|---|
| Project | Does the research address the right problem? Does it fit project constraints and goals? |
| Architecture | Are proposed patterns structurally sound? Do they fit the existing architecture? |
| Performance | Are efficiency implications of proposed approaches considered? |
| Aesthetics | Is the research well-organized, readable, and navigable for executors? |
| Overall | What gaps fall between perspectives? What works well and must be preserved? |
| User | Does the research lead to an implementation that serves end users? |

---

## Scoring Guidance

Research is more verifiable than ideation — codebase references can be checked with `Grep` and `Read`, external claims can be verified with WebSearch, and completeness can be measured against the plan task list. This means confidence scores for research findings should generally be higher than ideation findings.

Expect confidence scores of 75+ when findings are based on tool verification. A finding like "research claims `src/auth/middleware.ts` uses a decorator pattern but the file uses plain functions" should score confidence 90+ because the evaluator verified it with `Read`. A finding like "the innovative stance note is too shallow on error handling" involves more judgment and would naturally score lower, perhaps 65-70.

When evaluating research, actively use tools. Read the files that the research references. Grep for the patterns it claims exist. Verify completeness by comparing against the plan task list. Tool-verified findings are the highest-value output of research evaluation — they catch errors that would otherwise propagate into execution.
