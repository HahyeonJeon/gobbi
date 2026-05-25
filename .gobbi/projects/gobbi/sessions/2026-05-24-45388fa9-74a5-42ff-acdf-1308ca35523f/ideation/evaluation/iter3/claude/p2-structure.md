# Perspective 2 — Structure
**Evaluator**: claude (iter3)
**Phase**: ideation
**Artifact**: draft-iter3.md — Bundle C foundation follow-ups (iter3)

## Artifact Summary + Memory reads

Same artifact as p1-project. This perspective evaluates decomposition soundness, abstraction appropriateness, and dependency structure of the proposed deliverables.

**Memory reads**: same as p1-project.md plus ideation/evaluation.md Structure seed scenarios.

---

## Locked Frame (Stage 1)

**Scenario A — Each CL owns one concern, touches disjoint files**
- CL-1: 1 backlog file. CL-2: 1 skill + 1 backlog. CL-3: 1 skill file + 1 backlog. CL-4: 1 design doc + 1 backlog. CL-5: 11 skill files + 1 backlog. CL-6: 1 orchestration skill.
- Disjoint surface: confirmed. Per-Deliverable table Coordination Notes (line 192-195) explicitly cross-check the disjoint property.
- D-7 revised resolves the prior iter2 co-touch issue on mistake/SKILL.md: CL-3 owns it; CL-5 excludes it.

**Scenario B — Decomposition silently introduces circular dependency (adversarial)**
- CL-3 SHOULD precede CL-5 (CL-3 establishes canonical M2 wording for CL-5 to mirror). This is a soft dependency, not a file-lock. No circular dependency present.
- CL-2 SHOULD precede CL-4 (CL-4 may reference the gobbi-hook-authoring skill). Soft dependency; no circular dependency.
- CL-6 is fully independent.

**Scenario C — Boring-by-default: no novel pattern where existing one suffices**
- All CLs use existing patterns: backlog status flip (CL-1/2/4), skill promotion via preparation/SKILL.md narrow-exception (CL-2), docs sweep (CL-5), orchestration SKILL.md edit (CL-6).
- No innovation token spent.

**Scenario D — Two-week smell test: decomposition makes sense after two weeks**
- TL;DR lists all 6 CLs with one-line descriptions. Per-Deliverable table is comprehensive. DAG is explicit. Passes.

**Scenario E — SC-5 awk range terminator correctness (adversarial)**
- SC-5 uses `awk '/^\*\*Path conventions\*\*|^## Path conventions|^## Path Conventions/,/^\*\*[^P]|^## /' <F>` to extract the Path Conventions block.
- The closing pattern `/^\*\*[^P]/` matches any `**` bold line whose next char is not `P`. This correctly terminates on `**Core`, `**Delete semantics`, etc.
- BUT: `**Procedures**`, `**Purpose**`, `**Promotion**` all start with `P` — these would NOT terminate the range. If a skill has a `**Path conventions**` heading followed by `**Procedures**` (before the next non-P heading), the awk range would not close at `**Procedures**` and would over-capture content.
- Verification: checked mistake/SKILL.md — `**Path conventions**` at line 126 is followed by `- {date}` etc. and there is no `**P...` heading immediately after. The range would close at the next `**` non-P bold heading or `##` heading (end of file). Gobbi/SKILL.md uses `## ` headings, so awk range opens on `## Path conventions` and closes on the next `## `.
- Risk: LOW — in practice the skills use either `##` headings (where the range correctly closes) or have `**Path conventions**` with only bullet content following (not `**Procedures**` etc. at the same nesting level). But the awk pattern is subtly fragile for a skill that introduces a `**Procedures**` section adjacent to `**Path conventions**`.

---

## Per-scenario per-check results

1. **Scenario E**: SC-5 awk range closing pattern has a latent edge case — skills with `**P...` headings after `**Path conventions**` would not terminate the range. In the current 11 skill files this does not manifest, but the awk pattern is subtly fragile. Medium/Low risk for a docs artifact.

---

## Typed findings

### I3-P2-001 — SC-5 awk range closing delimiter subtly fragile for skills with **P... headings adjacent to **Path conventions**

- **id**: I3-P2-001
- **Type**: `assumption_risk`
- **Domain**: `test`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: SC-5 (line 143): `awk '/^\*\*Path conventions\*\*|.../,/^\*\*[^P]|^## /'`. The closing pattern `^\*\*[^P]` will NOT match `**Procedures**`, `**Purpose**`, `**Promotion**` (all start with P). If a skill file has these headings after `**Path conventions**`, the awk range over-captures. Cross-checked mistake/SKILL.md (line 126): `**Path conventions**` is followed by bullets, not a `**P` heading — so currently safe. But the pattern is fragile as skills evolve.
- **Why it matters**: SC-5 is the primary verification gate for the 11-file sweep (largest CL). A leaky awk range could produce false positives (the grep hits content outside the Path Conventions block and passes even when the M2 wording was not added to the right section). Would undermine Iron Law 7.
- **Suggested direction**: Replace the closing pattern with a more robust delimiter (e.g., `/^---$|^## |^\*\*[A-OQ-Z]/` to explicitly exclude only `**P` headings we know follow) or use a line-count-based approach. Alternative: name the end delimiter explicitly for each skill file in an inline comment.

---

## Per-perspective verdict

**PASS** — No Critical or High findings. Finding I3-P2-001 is Low severity. The decomposition is sound: 6 CLs with disjoint file surfaces, explicit sequencing, no circular dependencies. D-7 revised cleanly resolves the prior co-touch issue.

---

## Low-confidence appendix

None.
