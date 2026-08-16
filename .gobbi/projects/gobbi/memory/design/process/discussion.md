# Discussion question flow

## Intent

Discussion shows the full Decision Question card in the conversation, then calls the runtime asking tool.
Discussion stays usable without Workflow. It does not name Workflow or a Workflow Phase 1 user-decision window.

## Delivery order

- Render the populated Question card first.
- Then call `AskUserQuestion`, `request_user_input`, or `ask_user_question`.
- A delegated agent sends the populated template to the user-facing manager. It does not call those tools.

Keep the Question card body. The required change is the render-then-tool order.

## Ownership

The canonical [Discussion](../../../skills/discussion/SKILL.md) skill owns this contract. The generated plugin
copy must stay byte-equal.
