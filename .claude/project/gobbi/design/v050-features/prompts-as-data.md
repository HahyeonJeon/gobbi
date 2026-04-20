# Prompts as Data

Feature description for gobbi's step-spec model. Read this to understand why workflow prompts are structured data rather than authored text, and what that makes possible.

---

> **The prompt for every workflow step is a spec file, not a template someone wrote. It is versioned, testable, and generated.**

In v0.4.x, orchestration is driven by skills the orchestrator reads and interprets. The prompt content is prose — instructions an LLM reads and follows as best it can. Changing the workflow means changing the prose and hoping the interpretation tracks.

V0.5.0 moves workflow prompts to data. Each step is defined by a `spec.json` file under `packages/cli/src/specs/`. The spec declares the step's metadata, valid exit transitions with predicate references, delegation topology (which agents, which stances, which artifacts they write), token budget allocation, and the static instructional blocks. The CLI reads the spec and generates the prompt programmatically; all dynamic data — session state, inlined artifacts, skill materials — is added in TypeScript. The spec describes what the step does; the CLI decides what data to supply.

This separation produces several concrete properties. Guards and static analysis tools can validate structured delegation data without parsing prose. The SubagentStop hook knows the expected artifacts from the spec's delegation config without inspecting the conversation. `gobbi workflow validate` performs static analysis at build time — it checks that every predicate name referenced in a spec has a registered TypeScript implementation, catches dead steps and broken references, and validates the full workflow graph before a session begins.

The predicate registry is the key mechanism: transition conditions and guard conditions in specs are predicate names (strings in JSON), not inline logic. The CLI resolves predicate names to TypeScript functions. Adding a new workflow condition means adding a function to the registry and referencing its name — not modifying an expression parser or writing custom operator logic.

Snapshot testing closes the loop: each step spec compiled against a representative state set produces a committed snapshot. CI fails when a compiled prompt changes unexpectedly. Workflow regressions are caught before they reach users.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `../v050-prompts.md` | Step spec schema, substate overlays, shared blocks, schema versioning, compilation pipeline |
| `../v050-state-machine.md` | Predicate registry, typed reducer, transition table as both documentation and enforcement |
