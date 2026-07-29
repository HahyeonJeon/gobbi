# {Idea or Problem Name} — Study and Discussion Topics

> **Document role:** Supporting study and discussion agenda<br>
> **Purpose:** Turn completed requirements and progressive internal, external, and gap-driven topic refinement into a project-specific hierarchy for discussion.

## Contents

- [Requirements Snapshot](#requirements-snapshot)
- [Study Scope and Sources](#study-scope-and-sources)
- [Topic Tree](#topic-tree)
- [Discussion Path](#discussion-path)
- [Cross-Topic Dependencies and Conflicts](#cross-topic-dependencies-and-conflicts)
- [Completeness Audit](#completeness-audit)

## Requirements Snapshot

{Restate the completed goal, supported problem, result, material requirements, scope statuses, and open questions completely enough to understand this document without opening `requirements.md`. Use exact descriptive requirement headings.}

## Study Scope and Sources

### Internal Materials

| Material | Stable location | Authority, relevance, currency, and applicability | Licensing when reuse may be affected | Lesson or negative result | Disposition |
|---|---|---|---|---|---|
| `{project document, code, configuration, history, decision, pattern, or counterexample}` | `{link or path}` | `{assessment of every named property}` | `{license assessment or N/A with reason}` | `{finding}` | `{Adopt, Reject, or Uncertain}` |

### External Materials

| Material | Link | Authority, currency, and relevance | Applicability and license | Disposition |
|---|---|---|---|---|
| `{prior art, maintained standard, proven approach, alternative, or failure lesson}` | `{URL}` | `{assessment}` | `{fit and licensing}` | `{Adopt, Reject, or Uncertain}` |

### Adopted Lessons

{Synthesize the lessons that should shape the discussion hierarchy and explain their requirement connection.}

### Rejected or Inapplicable Lessons

{Explain which attractive approaches do not fit and why.}

### Contradictions, Uncertainty, and Gaps

{Record conflicts between sources, unresolved evidence gaps, and questions that require further study.}

## Topic Tree

```text
{Problem and Desired Outcome}
├── {Parent Topic}
│   ├── {Child Topic}
│   └── {Child Topic}
└── {Parent Topic}
    └── {Child Topic}
```

{The tree is generated from this idea's requirements and studied materials. Do not copy a fixed topic taxonomy.}

## Discussion Path

{Explain the parent-first order, dependencies between branches, and which conflicts must resolve before deeper discussion. This document is an agenda, not a live discussion tracker.}

## {Parent Topic}

> **Purpose:** {What this topic must decide or clarify.}<br>
> **Parent:** `{Root}`<br>
> **Dependencies:** {Earlier topics or evidence this topic needs.}<br>
> **Requirement connection:** {Exact descriptive requirement headings.}<br>
> **Source basis:** {Links or stable locations from the assessed source registers.}

### Evidence and Prior Art

{Summarize the evidence that frames this topic.}

### Questions and Decisions

{List the material questions the discussion must resolve.}

### Credible Alternatives

{Name genuinely different, source-backed alternatives worth comparing.}

### Completion Condition

{State what must be decided, evidenced, deferred, or excluded before this topic closes.}

### {Child Topic}

> **Purpose:** {What this child must decide or clarify.}<br>
> **Parent:** `{Parent Topic}`<br>
> **Dependencies:** {Earlier topics or evidence this child needs.}<br>
> **Requirement connection:** {Exact descriptive requirement headings.}<br>
> **Source basis:** {Links or stable locations from the assessed source registers.}

#### Evidence and Prior Art

{Summarize the evidence that frames this child topic.}

#### Questions and Decisions

{List the material questions the discussion must resolve.}

#### Credible Alternatives

{Name genuinely different, source-backed alternatives worth comparing.}

#### Completion Condition

{State what must be decided, evidenced, deferred, or excluded before this child closes.}

{Repeat matching level-two, level-three, or level-four topic sections for every node in the ASCII tree.}

## Cross-Topic Dependencies and Conflicts

| Topic heading path | Depends on or conflicts with | Effect on discussion order | Resolution condition |
|---|---|---|---|
| `{Parent Topic > Child Topic}` | `{heading path}` | `{ordering or reopen effect}` | `{condition}` |

## Completeness Audit

| Concern | Applicable or not applicable | Covered topic heading path | Evidence or inspected reason |
|---|---|---|---|
| Actors | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Boundaries and interfaces | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| State and data | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Resource use | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Failure and recovery | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Trust and governance | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Inclusion and locale | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Compatibility and reversal | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
| Evidence, risk, and validation | `{Applicable or N/A}` | `{heading path}` | `{evidence or reason}` |
