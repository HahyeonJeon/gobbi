# Evaluation

## Three-Stance Model

Evaluation in gobbi uses 3 independent evaluator agents, each with a different stance:

| Stance | Agent | Focus |
|--------|-------|-------|
| Positive | `gobbi-evaluator-positive` | Finds strengths, validates what works, identifies what must survive revision |
| Moderate | `gobbi-evaluator-moderate` | Balanced assessment — completeness, proportionality, feasibility |
| Critical | `gobbi-evaluator-critical` | Adversarial — stress-tests assumptions, finds missing edge cases, hidden risks |

All three are spawned for every evaluation. They work independently and don't see each other's results. This ensures nothing is missed: strengths are preserved during revision, completeness is checked, and hidden flaws are found.

## Dual Purpose

1. **Quality Gate (real-time):** Is this output good enough to proceed?
2. **Learning (accumulated):** What patterns emerge? → Convert to gotchas.

## Quality Gate Flow

```
[Stage output]
      │
      ▼
[3 evaluator agents — positive, moderate, critical]
      │
      ├── All PASS → proceed to next stage
      │
      ├── Any REVISE → send back with combined feedback
      │   (positive's "must preserve" list protects good work)
      │   (max 3 revision cycles, then escalate)
      │
      ├── Any ESCALATE → surface to user for decision
      │
      └── Stances disagree → surface tension as valuable signal
```

## Stage-Specific Evaluation Skills

Each stage has a paired evaluation skill with specific criteria:

| Stage | Evaluation Skill | What It Evaluates |
|-------|-----------------|-------------------|
| Ideation | `gobbi-ideation-evaluation` | Root problem identified? Approach concrete? Trade-offs explicit? Risks named? |
| Planning | `gobbi-plan-evaluation` | Tasks specific? Dependencies ordered? Scope complete? Agents assigned? |
| Execution | `gobbi-execution-evaluation` | Spec matched? Tests pass? Secure? Scope disciplined? Patterns followed? |

## Learning Loop

Evaluation findings that reveal patterns become gotchas:
- **First occurrence** → just feedback to the creator
- **Second occurrence** → candidate gotcha
- **Recurring pattern** → write gotcha immediately

No separate evaluation memory store. The gotcha system IS the learning mechanism.

## Key Design Decision: Why Three Stances?

A single critical evaluator finds problems but risks losing good work during revision. A single positive evaluator confirms quality but misses flaws. A single moderate evaluator checks completeness but may not dig deep enough in either direction.

Three stances together ensure:
- Good work is explicitly identified and protected during revision (positive)
- Coverage is complete and proportional (moderate)
- Hidden assumptions and risks are found (critical)
- Disagreements between stances reveal where the output is borderline
