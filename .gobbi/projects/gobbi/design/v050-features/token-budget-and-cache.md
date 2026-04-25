# Token Budget & Prompt Cache Strategy

Feature description for gobbi's cost efficiency mechanisms. Read this to understand how prompts are ordered to maximize cache hits and how the CLI prevents context window overflow before it happens.

---

> **Static content first, always. Cache prefix stability is not a preference — it is an invariant the spec model enforces.**

Long workflows are expensive. Every evaluation loop, every feedback round, every subagent delegation is a fresh API call. Gobbi addresses this at two levels: cache-aware prompt ordering that maximizes the prefix shared across calls, and token budget allocation that prevents overflow rather than discovering it at runtime.

The three-section prompt layout is the mechanism. The **static prefix** holds content identical across every invocation of a given step type: system prompt, project rules, CLAUDE.md content, and skill materials that do not vary by session state. This section is the same whether the workflow is on its first run or its fourth feedback round. Anthropic's 5-minute prompt cache fires here — the same prefix submitted within the cache window is served at cache hit cost rather than full recompute cost.

The **session section** holds content stable within a session but not across sessions: workflow state, per-loop `eval_enabled` and `max_iterations` settings, completed steps, session ID. Partial cache hits are possible when re-entering a step within the same session.

The **dynamic section** holds per-invocation content: step-specific instructions, inlined prior step output, delegation targets, timestamps. No cache benefit is expected here.

The ordering is not configurable by accident. The spec model enforces that `static` blocks always precede `conditional` blocks, which always precede `delegation` blocks. No spec can place a dynamic or conditional block before the static prefix — the constraint is structural, not advisory. Placing dynamic content before static content destroys prefix stability and turns every call into a full-cost computation.

Allocation priority is a separate lens from the physical three-section ordering: sections are laid out `static → session → dynamic` for cache stability, while truncation priority (below) decides what gets kept when the budget is tight.

Token budget allocation runs before rendering. The CLI knows the configured model's context window, allocates tokens across sections in priority order (static prefix → gotchas → step instructions → inlined artifacts → supplementary materials), and truncates at section boundaries — an artifact is included in full or excluded entirely. If the sum of section minimums exceeds the context window, the CLI emits a descriptive error identifying which sections contribute to the overflow.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `prompts-as-data.md` | The step-spec schema that enforces static-before-conditional-before-delegation section ordering |
| `just-in-time-prompt-injection.md` | How compiled prompts are emitted at the moment of need rather than pre-loaded |
| `deterministic-orchestration.md` | The state machine that drives prompt compilation and step sequencing |
