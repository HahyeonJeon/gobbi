# Prompts as Data

Feature description for gobbi's step-spec model. Read this to understand why workflow prompts are structured data rather than authored text, and what that makes possible.

---

> **The prompt for every workflow step is a spec file, not a template someone wrote. It is structured, validated, and generated.**

In v0.4.x, orchestration is driven by skills the orchestrator reads and interprets. The prompt content is prose — instructions an LLM reads and follows as best it can. Changing the workflow means changing the prose and hoping the interpretation tracks.

V0.5.0 moves workflow prompts to data. Each step is defined by a `spec.json` file in the CLI's spec library. The spec declares the step's metadata, valid exit transitions with predicate references, delegation topology (which agents, which stances, which artifacts they write), token budget allocation, and the static instructional blocks. The CLI reads the spec and generates the prompt programmatically; all dynamic data — session state, inlined artifacts, skill materials — is added by the CLI's compilation logic. The spec describes what the step does; the CLI decides what data to supply. When a step becomes active, the CLI reads the spec, assembles the prompt following the section ordering described in `token-budget-and-cache.md`, and hands it off at the moment of need per `just-in-time-prompt-injection.md`.

This separation produces several concrete properties. Guards and static analysis tools can validate structured delegation data without parsing prose. The SubagentStop hook knows the expected artifacts from the spec's delegation config without inspecting the conversation. A static-analysis step (command name TBD — the CLI surface is being redesigned) performs this checking at build time: it verifies that every predicate name referenced in a spec has a registered implementation, catches dead steps and broken references, and validates the full workflow graph before a session begins.

The predicate registry is the key mechanism: transition conditions and guard conditions in specs are predicate names (strings in JSON), not inline logic. The CLI resolves predicate names to registered implementations. Adding a new workflow condition means adding an implementation to the registry and referencing its name — not modifying an expression parser or writing custom operator logic.

Each spec is validated against a JSON schema — the schema itself is a future deliverable, but it is the mechanism by which structural errors are caught before the workflow graph is built. Spec authors cannot write a spec that violates the schema; spec authors cannot reference a predicate name that is not registered.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | How step specs drive state transitions in the six-step workflow |
| `token-budget-and-cache.md` | How spec-driven compilation preserves cache-prefix stability |
| `just-in-time-prompt-injection.md` | How compiled prompts reach the orchestrator at the moment of need |
| `cli-as-runtime-api.md` | The CLI surface that reads specs and compiles them |
