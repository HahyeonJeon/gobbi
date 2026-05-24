# Usage — iter1 Claude

## Stage 0 — Artifact Summary
See `project.md` § Stage 0. Consumers = Planner (decomposes into tasks), Executor (file-by-file edits + 2 new shell scripts), future-self maintaining the workflow.

### Memory reads — see `project.md`.

## Stage 1 — Locked Frame

### Scenarios (Usage)

**S-U-1: Planner produces task list without going back to user with clarifying questions** (seed)
- [a] Every directional design decision has enough specificity to start implementation
- [b] Scenarios are concrete enough to map to tasks 1:1

**S-U-2: Executor reads each scenario and knows what file / module / function to change** (seed)
- [a] Every research insight has a path / URL / reference
- [b] Component / function / path names are stable across document

**S-U-3: 3am-maintainer test** (seed)
- [a] Artifact names its consumers (Planner / Executor / future-self) and confirms each can use it
- [b] Glossary terms defined inline or by reference

**S-U-4: Failure modes communicated match implementation behavior** (seed)
- [a] Each named failure mode has corresponding implementation expectation
- [b] No promised behavior the design cannot deliver

**S-U-5: Consumer forms wrong mental model** (seed, adversarial)
- [a] Borrowed terms used with same meaning as in project vocabulary
- [b] Overloaded terms have local meaning stated

**S-U-6: Accessibility / I18n awareness** (Coverage Matrix)
- not-applicable: this is an internal docs + shell-script change with no user-facing UI or strings

**S-U-7: Observability / diagnosable-at-3am** (Coverage Matrix)
- [a] Design names what would log / what would alert when something goes wrong
- [b] Maintainer at 3am has logs / metrics / paths to identify failing component

## Stage 2 — Findings

### S-U-1 results
- [a] PASS — D-1 → D-5 + D-3-1 → D-3-4 each have *Trade-off considered* + *Anchored insights* + *Validation method*. Planner can lift each into a task spec.
- [b] PASS — Scenarios (G-1, G-2, E-1..E-4, F-1..F-3) map to checklist items 1–10 (T1) + 1–8 (T3). Ordering recommendation at lines 327–341 supplies 9 tasks directly.

### S-U-2 results
- [a] PASS — Every cited file/line is concrete: `git/SKILL.md:33`, `preparation/SKILL.md:62`, `orchestration/SKILL.md:103`, etc. All verified to resolve.
- [b] PASS — Path names stable: `.claude/hooks/post-tool-use-agents.sh`, `.claude/scripts/reconstruct-agents.sh` appear consistently.

### S-U-3 results
- [a] PARTIAL — Consumers are named in the meta-prose ("This artifact is consumed at Sub-step D 6b") and in § Ordering recommendation ("Planning Loop should decompose..."), but the document does not have a single "How to consume this artifact" landing section that says "Planner: read §A; Executor: read §B; Maintainer: read §C." This is implicit.
- [b] PASS — Internal terms (CP-X-Y, T1-I-N, T1-DQ-N) are defined where they appear; Glossary terms used (Iter, Phase, Loop, Sub-step) are project-canonical and defined in `gobbi/SKILL.md`.

### S-U-4 results
- [a] PASS — F-1 (re-routing inversion) → D-2 mitigation (qualified rule); F-2 (symlink on main tree) → D-3 mitigation (`git -C "$worktreePath"`); F-3 (worktree creation fails) → P6 recovery; F-1 (T3 hook crash) → F-2/D-3-1 (defensive jq) and reconstructor backstop. Each failure has a corresponding design hook.
- [b] PARTIAL — One promised behavior the design may not deliver: D-3-3's "Failed-spawn entries get `status: \"failed\"` and synthetic `id` (= `tool_use_id`) when `agentId` is null." But `session.template.json` does NOT have a `status` field (verified at lines 28–48 of the template). The draft acknowledges this (line 32 + backlog item schema-extension-agents-status-field.md) and proceeds with "extra-property" write. **However: if a strict JSON schema validator runs against `session.json`, the extra `status` field would fail. The draft assumes the runtime merge is permissive — which it is today but is not contractually guaranteed by the template.** This is documented (E-1 + backlog) but the gap between "writes status" and "template formally accepts status" is a real Usage failure for a downstream consumer who reads the template as the source of truth.

### S-U-5 results (adversarial)
- [a] PASS — Terms like "worktree", "manager", "executor", "evaluator", "subagent" used in same sense as project canon.
- [b] PASS — Overloaded terms (e.g., "iter" — iteration of an Ideation loop AND `agents[].iter`) are disambiguated by context.

### S-U-6 results — not-applicable per Frame declaration.

### S-U-7 results
- [a] PARTIAL — Hook failure mode says "exits non-zero on guard failures (logged to stderr) but never blocks" (line 218). That's the only logging spec. No mention of *where stderr goes* in Claude Code's hook context, whether there's any session-level log file, whether the failure is observable to the manager mid-session.
- [b] FAIL — A 3am maintainer asked "why is `agents[]` length still 1 in session XYZ" has no documented diagnostic procedure. They could run the reconstructor and see the orphan-report, but the hook-failure case (hook silently writes nothing) is not directly diagnosable without comparing transcript spawn count to `agents[]` length manually. **No "how to diagnose" sub-section.**

### Typed findings

```yaml
finding-id: U1-iter1
type: design_flaw
domain: process
disposition: open
confidence: 75
severity: Medium
surfaced-by: claude
```
**U1 — `status: "failed"` is written by the hook as an extra-property despite `session.template.json` not declaring it; downstream consumers reading the template as schema-of-record won't expect it.** Sub-step D acknowledges this and defers the template bump to backlog (schema-extension-agents-status-field.md). But "extra-property write" is a contract violation against the documented template, masked by "the runtime JSON merging is permissive." If a future Validation script (e.g., `verify-state-projections` from prior session work) loads session.json against the template schema, the `status` field would be either silently ignored or rejected depending on validator strictness. Evidence: draft line 32, line 45, line 254; `session.template.json:28-48` (no `status`). Suggested direction: either (i) bump the template this session (CP-D-1 third option, which user explicitly rejected) — not recommended; OR (ii) document the extra-property write inside the template comment or in `orchestration/SKILL.md` Workflow Metadata as a temporary contract, so future consumers know the schema is intentionally "open until next bump."

```yaml
finding-id: U2-iter1
type: design_flaw
domain: observability
disposition: open
confidence: 50
severity: Medium
surfaced-by: claude
```
**U2 — No documented diagnostic procedure for "hook silently wrote nothing" failure mode (the exact failure shape T3 exists to fix).** If the new hook fails silently (PostToolUse fires, jq parse error, hook exits non-zero, stderr disappears), `agents[]` stays at the old (length-1) state — the literal symptom T3 prevents. A 3am maintainer needs a procedure: (1) run reconstructor; (2) check transcript-line count vs agents[]-length delta; (3) read hook stderr from somewhere. Step 3 is not documented (where does Claude Code surface hook stderr?). Evidence: draft F-1 mitigation (line 224); no diagnostic sub-section. Suggested direction: add a "How to diagnose hook silence" sub-section to the T3 design OR explicitly defer to a follow-up backlog item.

```yaml
finding-id: U3-iter1
type: scenario_gap
domain: process
disposition: open
confidence: 50
severity: Low
surfaced-by: claude
```
**U3 — No explicit "how to consume this artifact" landing section for the three consumer types.** The draft is well-organized but a Planner / Executor / maintainer reading top-down has to infer their entry point. The § Ordering recommendation block (line 327) addresses Planning but not the other two. Evidence: draft does not have a "Consumers" subsection. Suggested direction: add one closing sub-section in § Cross-task observations / Ordering that says "Planner: pick up at § Ordering recommendation; Executor: read § Implementation Checklist + § Design; future-self: read § Framed Problem + § Scope Contract." Low-severity polish.

### Low-confidence appendix
- (none above 25)

## Verdict
**PASS** — Usage is acceptable. Planner can decompose, Executor can implement, consumers are inferable. U1 (status extra-property contract gap) and U2 (no hook-silence diagnostic) are Medium recommendations; U3 (no landing section) is Low. None block Planning.
