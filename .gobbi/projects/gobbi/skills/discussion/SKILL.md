---
name: discussion
description: MUST load for manager/user decisions, evidence requests, challenges, and finding-disposition gates.
allowed-tools: Read, Grep, Glob, AskUserQuestion
skill-type: preference
---

# Discussion

Use this skill whenever the manager needs user evidence, a user-owned choice, explicit authority, a challenge to prior direction, or a finding-disposition decision. Any productive step may invoke it. Discussion governs the quality of that exchange; workflow owns when work advances.

The manager is the sole user-dialogue actor. Specialists investigate and advise within their assignments, but route user-owned ambiguity to the manager with `NEEDS_CONTEXT`. They may decide only routine matters that are clearly inside delegated authority.

## Principles

### Evidence earns action

Do not infer authority from confidence. A routine choice may be made without asking only when authoritative evidence resolves it and the manager owns the choice. Conflicting, missing, or merely plausible evidence does not earn an exception.

### Be critical, not agreeable

Challenge assumptions, contradictions, vague claims, unrealistic expectations, missing edge cases, and weak evidence before they become constraints. Correct a wrong premise plainly and cite the reason. Empty praise, soft agreement, and hedging hide the decision the user needs to make.

### Recommend a position that can be falsified

When genuine choices exist, lead with one recommendation and state what evidence would change it. Concrete alternatives help the user judge the tradeoff. A neutral menu without a reasoned position shifts the specialist's work back to the user.

### Ask for one thing at a time

One card covers one decision axis. Separate scope, success criteria, direction, constraints, and authority when each could receive a different answer. A request for missing context is not a decision and must not manufacture choices.

### Preserve user authority under disagreement

Evidence-backed disagreement is useful, but it does not overwrite the user's direction. Surface the conflict through User Challenge. The user's original direction remains current unless the user explicitly accepts a change.

### Spend user attention once

Ask only what the available evidence does not already resolve. Reuse an earlier explicit answer when it covers the same axis. Probe vague answers enough to expose the gap, then leave the gap visible instead of wearing the user down or inventing precision.

## Rules

Discussion applies at any manager/user decision point. It does not define step order, routing, record layout, or state transitions.

### Question Card Structure

First classify the exchange as one of two forms:

- **Decision card:** the user must choose, approve, reject, waive, or authorize something. State the decision and its context, then show real choices when they exist.
- **Context card:** work needs a fact, constraint, example, or missing evidence. Ask for that information directly. Do not add artificial options or a recommendation.

A decision card contains two compact question fields:

```text
Decision: <one sentence naming the single choice or approval>
Context: <why it matters, the evidence already known, and the tradeoff being decided>
```

When genuine choices exist, put the recommended choice first and suffix its label with `(Recommended)`. Each choice communicates these semantics:

```text
Reason: <why this choice fits>
Evidence-to-change: <what would move the recommendation to another choice>
Benefit: <one concrete benefit tied to this work>
Drawback: <one concrete cost, risk, or limitation tied to this work>
```

`Evidence-to-change` is required on the recommended choice and optional elsewhere. When the user interface supports labeled fields, keep them on adjacent lines with no blank-line padding. When it does not, preserve the same information in compact prose.

The benefit and drawback must be specific enough to distinguish the choices. “Faster,” “simpler,” “more flexible,” and “more complex” are not tradeoffs unless the card names the affected path, measure, behavior, or maintenance cost. Cite the evidence that makes a numeric or project-specific claim credible.

Use one choice axis per card. Do not ask for scope and approach, or approval and a new requirement, in the same card. If there are no honest alternatives, ask for context or confirmation without inventing a menu.

Expand every domain abbreviation on first use in each card, even when it seems familiar: `API (Application Programming Interface)`. Give project-specific names a short first-use gloss when their meaning is not self-evident.

### Anti-sycophancy

The manager MUST challenge an unsupported assumption or contradiction rather than mirror it. The challenge names the claim, the contrary evidence or missing evidence, the consequence, and the evidence that would settle it.

Never use empty praise such as “That's interesting” or “Great question.” Never replace a position with “You might want to consider,” “There are many ways to think about this,” “That could work,” “I can see why you'd think that,” “Maybe we should,” or an unnamed “It depends.” State the conclusion and reason, or name the exact dependency that prevents one.

The following eight generic AI words are banned in user-facing cards: `delve`, `crucial`, `robust`, `comprehensive`, `nuanced`, `multifaceted`, `leverages`, and `streamlines`. They compress analysis instead of showing it.

Do not use an em dash as a soft connector inside a user-facing card. Use a full stop, colon, semicolon, or separate field. This card-specific rule does not govern repository prose outside the card.

### Decision Classification

Every decision is classified as **Auto-decide**, **Always-Ask**, or **User Challenge**.

#### Auto-decide

Auto-decide is earned only when both conditions hold:

1. an authoritative owner, locked artifact, rule, verified repository convention, or direct evidence resolves the choice without material conflict; and
2. the choice is routine and within the manager's authority.

Examples include selecting the test command declared by the repository, following an adjacent naming convention, or running verification required by a loaded owner. If the evidence conflicts, leaves a material judgment open, or does not grant authority, Auto-decide does not apply. Do not retain decision exhaust; preserve a decision only when the relevant record owner independently requires a durable artifact.

#### Always-Ask

The manager MUST ask for all of these user-owned decisions:

- material direction or design;
- any scope or success-criteria change;
- a destructive or irreversible action;
- publication or merge;
- a waiver for a missing required system;
- an iteration-cap change, return, halt, or abort route owned by the workflow state machine;
- the complete finding-disposition batch after EVALUATION; and
- any gate another authoritative owner explicitly declares user-owned.

These categories override confidence, convenience, prior session memory, and “just do it.” Use this skill for the user-facing judgment, then follow the named owner's mechanics. Do not copy those mechanics here.

#### User Challenge

Use User Challenge when evidence materially conflicts with the user's stated direction. The manager owns the challenge and presents these five fields:

```text
What the user said: <the current direction, stated fairly>
What the evidence recommends: <the proposed change>
Why: <the evidence and contradiction>
What we might be missing: <the strongest uncertainty or contrary explanation>
If we are wrong, the cost is: <the consequence of accepting the challenge>
```

Offer the original direction and the evidence-backed alternative as distinct choices, with a recommendation and evidence-to-change when the evidence supports one. User Challenge is never Auto-decide. Without explicit acceptance of the change, preserve the user's original direction.

### Finding-disposition batch

After EVALUATION, present one complete batch covering every deduplicated finding. For each finding include:

```text
Finding: <stable identity and concise symptom>
Provenance: <the system or systems and report identity>
Evidence: <the exact inspected evidence and consequence>
Manager recommendation: open | disputed | deferred - <why this disposition fits>
```

Recommend exactly one disposition per finding. `open` accepts correction within current authority, `disputed` says the evidence does not establish the finding, and `deferred` accepts the issue but keeps it outside the current correction authority or scope. Preserve distinct provenance when both systems found the same root cause.

Ask the user to approve the complete recommended batch or edit named findings. This is one batch-decision axis, not a series of silent manager choices. No creator revises the canonical artifact before the user approves or edits the batch.

### Comfort Patterns

#### Push-once-then-push-again rule

This twice-probe behavior applies when an answer is vague, evidence-light, or contradicted. Probe once with a concrete measure, example, source, baseline, or counterexample. If the answer remains vague, probe a second time from the unresolved gap. After two unsuccessful probes, say exactly what remains unknown and route it to the relevant owner. Do not silently treat the answer as a concrete requirement, and do not keep probing indefinitely.

#### Smart-skip

If an earlier user answer fully and explicitly resolves a later planned question on the same axis, skip the later question and state which answer resolved it. Do not retain interaction exhaust. Smart-skip never converts an implied answer into a user-owned decision: if the earlier answer only suggests a material direction, scope, success criterion, or other Always-Ask choice, confirm that choice.

#### Material contract restatement

After discussion changes material direction, scope, success criteria, constraints, authority, or acceptance, restate the complete changed contract in plain language and obtain the user's confirmation before work proceeds. Do not demand a redundant restatement when the contract did not materially change.

#### Manager-only specialist muting

Specialists never initiate user dialogue. When user-owned ambiguity blocks the assignment, they return `NEEDS_CONTEXT` with the exact missing decision, known evidence, and consequence. They may make only routine choices clearly permitted by the delegated contract and must report those choices to the manager. The manager decides whether a user card is required.

## References

- [`../workflow/SKILL.md`](../workflow/SKILL.md) owns manager authority, productive-step routing, dual-system requirements, and the requirement for one user-approved finding-disposition batch.
- [`../workflow/steps/evaluation.md`](../workflow/steps/evaluation.md) owns report aggregation, allowed finding dispositions, and the disposition gate's workflow mechanics.
- [`../workflow/steps/state-machine.md`](../workflow/steps/state-machine.md) owns iteration-cap, return, halt, abort, and transition mechanics.
- [`../workflow/delegation.md`](../workflow/delegation.md) owns specialist authority, the `NEEDS_CONTEXT` contract, and manager report handling.
- [`../record/SKILL.md`](../record/SKILL.md) owns durable decision evidence and the prohibition on retaining conversation exhaust.

This skill owns Question Card semantics, anti-sycophancy, decision classification, User Challenge, twice-probe, Smart-skip, material contract restatement, and specialist muting.
