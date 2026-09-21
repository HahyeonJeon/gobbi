# Discussion

## Intent

Discussion is an operation skill. Its SOP is understand the task, study options with independent
participants, then decide with the user. The runtime structured-input tool is the ask. There is no
Question card.

## Procedure

- Understand the intended result and close 5W1H gaps that could change it.
- Study evidence. For a consequential choice, gather separate subagent or Partner suggestions and
  critique, then synthesize two or three options and a recommendation.
- Explain structural choices with a schema, diagram, or generated image when text alone is hard to
  compare.
- Call `AskUserQuestion`, `request_user_input`, or `ask_user_question` with the recommended option
  first. A delegated agent sends the question to the user-facing manager and does not call those tools.
- Record the user's choice until the user explicitly changes it.

Discussion stays usable without Workflow. It does not name Workflow or a Workflow Phase 1 user-decision
window.

## Ownership

The canonical [Discussion](../../../skills/discussion/SKILL.md) skill owns this contract. The generated plugin
copy must stay byte-equal.
