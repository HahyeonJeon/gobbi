# Discussion

## Intent

Discussion is an operation skill. Its SOP is understand the task, study options with independent
participants, then decide with the user. The runtime structured-input tool is the ask. There is no
Question card.

## Procedure

- Understand the intended result and close a gap in intent or context before dependent work only when a wrong
  guess is costly to undo. Otherwise state the assumption and continue.
- Study evidence. For a decision that is hard to reverse or that the user owns, gather separate subagent or
  Partner suggestions and critique, scaled to the stakes, then synthesize two or three options and a
  recommendation that names what would change it.
- Explain structural choices with a schema, diagram, or generated image when text alone is hard to
  compare.
- Call `AskUserQuestion`, `request_user_input`, or `ask_user_question` with the recommended option
  first. A delegated agent sends the question to the user-facing manager and does not call those tools.
- Record the user's choice until the user explicitly changes it. Keep the stated and inferred marks and every
  participant's Limits that Delegation's study return carries.

Discussion stays usable without Workflow. It does not name Workflow or a Workflow Phase 1 user-decision
window.

## Standing preferences

- Recommend the best option even when it conflicts with the user's request or wording, with the evidence, and the
  user decides (the third bullet of Principle 4).
- Use a card only for a genuine fork, and give each option explicit `Pros:` and `Cons:` lines. Apply a clear
  directive and show the result instead of asking.
- The user talks in Korean with English terms. Every work product, including skills, docs, and Memory, is
  written in English.

## Ownership

The canonical [Discussion](../../../skills/discussion/SKILL.md) skill owns this contract. The generated plugin
copy must stay byte-equal.
