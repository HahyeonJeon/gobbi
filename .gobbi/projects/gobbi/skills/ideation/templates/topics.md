# {Title} - Topics

> **Role:** Discussion agenda<br>
> **Purpose:** Organize completed requirements and study into topics for discussion.

## Contents

- [Requirements](#requirements)
- [Study](#study)
- [Topics](#topics)
- [Discussion Order](#discussion-order)
- [Dependencies](#dependencies)
- [Coverage](#coverage)

## Requirements

{Restate the completed goal, supported problem, result, material requirements, scope statuses, and open questions completely enough to understand this document without opening `requirements.md`. Use exact descriptive requirement headings.}

## Study

### Internal Study

| Source | Location | Assessment | Lesson | Status |
|---|---|---|---|---|
| `{project document, code, configuration, history, decision, pattern, or counterexample}` | `{link or path}` | `{authority, relevance, currency, applicability, and license when reuse may be affected}` | `{lesson or negative result}` | `{Adopt, Reject, or Uncertain}` |

### External Study

| Source | Link | Assessment | Status |
|---|---|---|---|
| `{prior art, maintained standard, proven approach, alternative, or failure lesson}` | `{URL}` | `{authority, relevance, currency, applicability, and license}` | `{Adopt, Reject, or Uncertain}` |

### Lessons

{Synthesize the lessons that should shape the discussion hierarchy and explain how they affect the requirements.}

### Rejected

{Explain which attractive approaches do not fit and why.}

### Gaps and Conflicts

{Record conflicts between sources, unresolved evidence gaps, and questions that require further study.}

## Topics

```text
{Problem and Desired Outcome}
├── {Parent Topic}
│   ├── {Child Topic}
│   └── {Child Topic}
└── {Parent Topic}
    └── {Child Topic}
```

{The tree is generated from this idea's requirements and studied materials. Do not copy a fixed topic taxonomy.}

## Discussion Order

{Explain the parent-first order, dependencies between branches, and which conflicts must resolve before deeper discussion. This document is an agenda, not a live discussion tracker.}

## {Parent Topic}

> **Purpose:** {What this topic must decide or clarify.}<br>
> **Parent:** `{Root}`<br>
> **Depends On:** {Earlier topics or evidence this topic needs.}<br>
> **Requirements:** {Exact descriptive requirement headings.}<br>
> **Sources:** {Links or stable locations from the assessed source registers.}

### Context

{Summarize the evidence that frames this topic.}

### Questions

{List the material questions the discussion must resolve.}

### Options

{Name genuinely different, source-backed alternatives worth comparing.}

### Done When

{State what must be decided, evidenced, deferred, or excluded before this topic closes.}

### {Child Topic}

> **Purpose:** {What this child must decide or clarify.}<br>
> **Parent:** `{Parent Topic}`<br>
> **Depends On:** {Earlier topics or evidence this child needs.}<br>
> **Requirements:** {Exact descriptive requirement headings.}<br>
> **Sources:** {Links or stable locations from the assessed source registers.}

#### Context

{Summarize the evidence that frames this child topic.}

#### Questions

{List the material questions the discussion must resolve.}

#### Options

{Name genuinely different, source-backed alternatives worth comparing.}

#### Done When

{State what must be decided, evidenced, deferred, or excluded before this child closes.}

{Repeat matching level-two, level-three, or level-four topic sections for every node in the ASCII tree.}

## Dependencies

| Topic | Related Topic | Effect | Resolve When |
|---|---|---|---|
| `{Parent Topic > Child Topic}` | `{dependency or conflict heading}` | `{ordering or reopen effect}` | `{condition}` |

## Coverage

| Concern | Applies | Topic | Basis |
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
