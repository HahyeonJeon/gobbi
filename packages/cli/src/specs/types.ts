/**
 * `StepSpec` — the TypeScript shape of a workflow step's `spec.json` file.
 *
 * This module defines the schema that every per-step `spec.json` conforms to
 * (Ideation in A.7; Plan, Execution, Evaluation, Memorization in PR B). It
 * also defines the type that A.6's JSON Schema binds via
 * `JSONSchemaType<StepSpec>` — keeping the TypeScript interface and the
 * JSON Schema in lockstep so drift is caught at compile time.
 *
 * Authoritative spec source: `.claude/project/gobbi/design/v050-prompts.md`
 * §Spec Schema. Cross-references:
 *
 * - §Cache-Aware Prompt Ordering — motivates `tokenBudget` five-section model
 * - `v050-state-machine.md` §Predicate Registry — motivates the `condition`
 *   string field on `StepTransition` (a predicate name, resolved to a
 *   TypeScript function at compile time; B.3's codegen will later narrow
 *   this from `string` to a branded `PredicateName` type)
 * - `v050-hooks.md` — motivates `completionSignal` referencing hook event
 *   names like `SubagentStop` and `Stop`
 * - `v050-session.md` — motivates `expectedArtifacts` as filenames the
 *   session directory captures per step
 *
 * Design philosophy:
 *
 * - Every field is `readonly`. A loaded spec is an immutable record.
 * - Collections use `readonly` tuple/array markers so callers cannot mutate.
 * - Dictionaries that key into other parts of the spec (e.g.
 *   `blocks.delegation` keyed by `AgentConfig.blockRef`) use
 *   `Readonly<Record<string, ...>>`.
 * - String fields that will later become branded types (predicate names,
 *   skill IDs, artifact filenames) are left as `string` in A.3b and will
 *   be narrowed by downstream codegen (B.3 for predicate names; A.6 can
 *   choose JSON Schema `pattern` constraints where useful).
 *
 * Runtime-only invariants that live outside the type system:
 *
 * - `tokenBudget.{staticPrefix,session,instructions,artifacts,materials}`
 *   must sum to `1.0` (each ≥ 0). See `TokenBudget`. A.5 enforces at
 *   allocation time; A.6's JSON Schema will need a custom keyword.
 * - Every `StepTransition.condition` must name a predicate registered in
 *   `workflow/predicates.ts`. `gobbi workflow validate` enforces this at
 *   validation time; B.3's codegen will make it a compile-time constraint.
 * - Every `AgentConfig.blockRef` must be a key of `blocks.delegation`.
 *   `gobbi workflow validate` enforces this structurally.
 */

// ---------------------------------------------------------------------------
// Model tiers and effort levels — closed literal unions
//
// Mirrors the agent files in `.claude/agents/` (opus for PI/executor,
// sonnet for evaluators/docs, haiku reserved for future lightweight roles).
// All workflow agents run at max effort per `_gobbi-rule` Model Selection.
// ---------------------------------------------------------------------------

/**
 * Anthropic model tier assigned to a delegated agent. Matches the `model:`
 * front-matter values used in `.claude/agents/*.md`.
 */
export type ModelTier = 'opus' | 'sonnet' | 'haiku';

/**
 * Effort level for the delegated agent. `max` is the only value used by
 * the workflow today — the field exists so downstream specs can opt into
 * lower effort if that becomes useful. `_gobbi-rule.md` currently mandates
 * max effort for all workflow agents.
 */
export type EffortLevel = 'max' | 'high' | 'medium';

// ---------------------------------------------------------------------------
// Meta — step-level configuration that does not vary per prompt compile
// ---------------------------------------------------------------------------

/**
 * Step-level metadata, independent of any single compile. Matches the
 * `meta` subsection in `v050-prompts.md` §Spec Schema.
 *
 * `completionSignal` names a hook event (e.g. `'SubagentStop'`, `'Stop'`,
 * or a bespoke CLI signal) that tells the CLI this step is done.
 *
 * `timeout` is optional; when absent the CLI's default step timeout applies
 * per `v050-state-machine.md` §Step Timeouts.
 */
export interface StepMeta {
  /** Short human-readable description of what this step does. */
  readonly description: string;

  /**
   * Valid substate identifiers for this step, if any. Ideation has
   * `['discussing', 'researching']`; leaf steps with no substates omit
   * the field. When present, the CLI applies the substate overlay before
   * assembling the prompt.
   */
  readonly substates?: readonly string[];

  /**
   * Subagent types this step is allowed to spawn. The CLI enforces this
   * against the delegation configuration and against the Agent tool guard.
   * Example: `['__pi', '__researcher']` for the Ideation step.
   */
  readonly allowedAgentTypes: readonly string[];

  /**
   * Maximum number of subagents that may run in parallel during this step.
   * The delegation guard denies spawns beyond this cap.
   */
  readonly maxParallelAgents: number;

  /**
   * Skills whose materials MUST be injected into this step's prompt.
   * Identifiers are relative skill names like `_gotcha`, `_claude`.
   */
  readonly requiredSkills: readonly string[];

  /**
   * Skills whose materials SHOULD be injected when present but whose
   * absence is not an error.
   */
  readonly optionalSkills: readonly string[];

  /**
   * Artifact filenames this step is expected to produce (without round
   * suffixes — `workflow/artifacts.ts` applies rounds at write time).
   * The SubagentStop hook uses this list to validate captured artifacts.
   */
  readonly expectedArtifacts: readonly string[];

  /**
   * Hook event name the CLI watches for to decide this step has completed.
   * Typically `'SubagentStop'` for delegation-heavy steps and `'Stop'` for
   * orchestrator-only steps. See `v050-hooks.md`.
   */
  readonly completionSignal: string;

  /**
   * Optional step timeout in milliseconds. When the Stop hook observes the
   * elapsed step time exceeds this value, it writes a
   * `workflow.step.timeout` event. Absent → CLI default applies.
   */
  readonly timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// Transitions — declarative exit edges from this step, each gated by a
// predicate name resolved from the registry
// ---------------------------------------------------------------------------

/**
 * One exit transition from the current step.
 *
 * `condition` names a predicate from the CLI's predicate registry —
 * examples: `'evalEnabled.ideation'`, `'feedbackCapReached'`. B.3 will
 * generate a `PredicateName` branded string type from the registry; once
 * that lands, this field will narrow to the branded type without a schema
 * change.
 *
 * @see workflow/predicates.ts — predicate registry
 * @see `.claude/project/gobbi/design/v050-state-machine.md` §Predicate Registry
 */
export interface StepTransition {
  /** Target step identifier — must be a step defined in `specs/index.json`. */
  readonly to: string;

  /**
   * Predicate name from the registry. Plain `string` in A.3b; B.3's codegen
   * will emit a branded `PredicateName` type and this field narrows to it.
   *
   * @see predicate registry
   */
  readonly condition: string;

  /** Optional human-readable label for reporting and debug output. */
  readonly label?: string;
}

// ---------------------------------------------------------------------------
// Delegation — per-agent topology for this step
// ---------------------------------------------------------------------------

/**
 * Per-agent delegation configuration. Each entry describes one subagent
 * spawn: the role, stance, model, effort, skills to inject, artifact target,
 * and a reference to the delegation block that contains the subagent's
 * prompt content (`blocks.delegation[blockRef]`).
 */
export interface AgentConfig {
  /** Logical role of the agent in this step (`'innovative'`, `'researcher'`, etc.). */
  readonly role: string;

  /**
   * Stance name. For Ideation/Research steps: `'innovative'` or
   * `'best-practice'`. For Evaluation steps: a perspective identifier
   * (`'project'`, `'overall'`, ...). Steps with no stance concept may omit.
   */
  readonly stance?: string;

  /** Anthropic model tier the orchestrator should use when spawning this agent. */
  readonly modelTier: ModelTier;

  /** Effort level — typically `'max'`. */
  readonly effort: EffortLevel;

  /**
   * Skills whose materials are injected into THIS agent's prompt (on top
   * of the step's `meta.requiredSkills`/`optionalSkills`). Useful for
   * stance-specific materials.
   */
  readonly skills: readonly string[];

  /**
   * Artifact filename this agent writes its output to, relative to the
   * step directory (e.g. `'innovative.md'`, `'research-synthesis.md'`).
   */
  readonly artifactTarget: string;

  /**
   * Key into `blocks.delegation` — the delegation block that holds the
   * prompt content for this agent.
   */
  readonly blockRef: string;
}

/**
 * Full delegation topology for this step. `agents` may be empty for steps
 * that the orchestrator handles alone.
 */
export interface StepDelegation {
  readonly agents: readonly AgentConfig[];
}

// ---------------------------------------------------------------------------
// Token budget — five-section proportional allocation
// ---------------------------------------------------------------------------

/**
 * Allocation proportions across the five prompt sections. Each value is
 * in the closed interval `[0, 1]` and the sum of all five must equal `1.0`.
 *
 * These invariants are enforced at runtime by A.5's budget allocator and
 * by A.6's JSON Schema custom keyword — NOT by the TypeScript type system.
 * Authors of `spec.json` files must verify the sum manually.
 *
 * Section mapping:
 *
 * - `staticPrefix` — `blocks.static` + injected static skill materials
 * - `session` — session state, completed steps, eval config
 * - `instructions` — `blocks.conditional` (filtered) + `blocks.synthesis`
 *   + `blocks.completion`
 * - `artifacts` — inlined prior-step artifacts selected by A.9
 * - `materials` — non-skill supplementary materials (gotcha guards, etc.)
 *
 * Defaults shift per step: Evaluation steps raise `artifacts`; Delegation
 * steps raise `instructions`. See `v050-prompts.md` §Token Budget Awareness.
 *
 * @remarks runtime invariant: `staticPrefix + session + instructions +
 *   artifacts + materials === 1.0` and each value `>= 0`.
 */
export interface TokenBudget {
  readonly staticPrefix: number;
  readonly session: number;
  readonly instructions: number;
  readonly artifacts: number;
  readonly materials: number;
}

// ---------------------------------------------------------------------------
// Blocks — the static instructional content that A.4 assembles into the
// final compiled prompt (alongside CLI-injected session/dynamic content)
// ---------------------------------------------------------------------------

/**
 * A reusable unit of block content. Appears in every `blocks.*` subsection.
 *
 * `refs` is an ordered list of shared-block IDs under `specs/_shared/`
 * whose content should be inlined at compile time before `content`. A.4
 * resolves these references; `gobbi workflow validate` checks every ref
 * resolves to an existing shared block.
 *
 * @see `v050-prompts.md` §Shared Blocks
 */
export interface BlockContent {
  /** Unique identifier for this block within the spec. */
  readonly id: string;

  /** Literal block text. No template engine; variables are NOT interpolated. */
  readonly content: string;

  /** Shared-block IDs (keys under `specs/_shared/`) to inline before `content`. */
  readonly refs?: readonly string[];
}

/**
 * A conditional block — included or excluded by the CLI based on predicate
 * evaluation at compile time.
 *
 * `when` names a predicate from the registry (same set as
 * `StepTransition.condition`); the predicate runs against the current
 * workflow state. The CLI evaluates conditionals in TypeScript, not in
 * JSON — `v050-prompts.md` §Spec Schema emphasizes that specs only carry
 * the predicate name, not inline logic.
 */
export interface ConditionalBlock extends BlockContent {
  /**
   * Predicate name gating inclusion of this block. Plain `string` in A.3b;
   * B.3's codegen narrows to the branded `PredicateName` type later.
   *
   * @see predicate registry
   */
  readonly when: string;
}

/**
 * Completion instructions for the orchestrator. The `instruction` is a
 * single authoritative directive; `criteria` is a human-readable list of
 * acceptance conditions the orchestrator must satisfy before emitting the
 * step's completion signal.
 */
export interface StepCompletion {
  readonly instruction: string;
  readonly criteria: readonly string[];
}

/**
 * All block content for this step, organized per `v050-prompts.md`
 * §Spec Schema. The CLI assembles the compiled prompt from these blocks in
 * the cache-stable order described in §Cache-Aware Prompt Ordering.
 */
export interface StepBlocks {
  /**
   * Blocks that are always included in the compiled prompt. Part of the
   * static cache prefix (see `sections.ts` `StaticSection`).
   */
  readonly static: readonly BlockContent[];

  /**
   * Blocks whose inclusion depends on a predicate. Resolved at compile
   * time — excluded blocks contribute no bytes.
   */
  readonly conditional: readonly ConditionalBlock[];

  /**
   * Per-agent delegation prompt content, keyed by `AgentConfig.blockRef`.
   * Each entry is the full prompt text handed to that agent.
   */
  readonly delegation: Readonly<Record<string, BlockContent>>;

  /**
   * Post-delegation synthesis instructions for the orchestrator. Applied
   * after all delegated agents complete.
   */
  readonly synthesis: readonly BlockContent[];

  /** Completion instruction and acceptance criteria for the step. */
  readonly completion: StepCompletion;

  /**
   * Step-completion protocol footer — the JIT prose that names the exact
   * `gobbi workflow transition <VERB>` invocation the agent must run as its
   * terminal action. Rendered as a static section between
   * `blocks.completion` and `session.state` (see `assembly.ts::renderSpec`),
   * so its bytes are part of the cache prefix and remain stable across
   * invocations of the same step on the same codebase revision.
   *
   * Required, `minLength: 1` (see `_schema/v1.ts::StepBlocksSchema`). Each
   * spec carries its own complete footer text; productive steps name
   * `COMPLETE`, evaluation steps name `PASS` / `REVISE` / `ESCALATE`.
   * Operator-only verbs (SKIP / TIMEOUT / FINISH / ABORT / RESUME) are
   * excluded by convention, enforced by the verb-partition assertions in
   * `__tests__/footer.snap.test.ts`.
   */
  readonly footer: string;
}

// ---------------------------------------------------------------------------
// Compile outputs + budget allocator contract
//
// These live here (alongside `StepSpec`) rather than in `assembly.ts` so both
// `assembly.ts` (A.4 — producer) and `budget.ts` (A.5 — consumer) can import
// them without a circular edge between the two modules.
// ---------------------------------------------------------------------------

/**
 * A single section's summary in a `CompiledPrompt`. One entry per included
 * section (dropped sections do not appear — see `AllocationResult`).
 *
 * `byteLength` is the UTF-8 byte length of `content`; downstream budget
 * reporting (E.3 `gobbi workflow status`) consumes this without re-running a
 * tokenizer over the final text.
 */
export interface CompiledSectionSummary {
  readonly id: string;
  readonly kind: 'static' | 'session' | 'dynamic';
  readonly byteLength: number;
  readonly contentHash: string;
}

/**
 * `CompiledPrompt` — the object `compile()` emits.
 *
 * - `text` is the concatenated section content separated by a double newline
 *   (see `assembly.ts::SECTION_SEPARATOR`). This is what the CLI sends to the
 *   model as the user prompt.
 * - `sections` is a read-only list of per-section summaries in emission order.
 * - `contentHash` is sha256 over `text` — a single aggregate suitable for
 *   cache-hit reporting in `gobbi workflow status`.
 * - `staticPrefixHash` is sha256 over the concatenation of ONLY the
 *   `StaticSection.contentHash` values (in order). This is the byte-level
 *   cache-prefix signature operators use to verify the static prefix is
 *   stable across invocations; drift here means a cache miss on Anthropic.
 */
export interface CompiledPrompt {
  readonly text: string;
  readonly sections: readonly CompiledSectionSummary[];
  readonly contentHash: string;
  readonly staticPrefixHash: string;
}

/**
 * Minimal structural shape the budget allocator sees — scoped to the fields
 * the allocation logic needs. Both `StaticSection`, `SessionSection`, and
 * `DynamicSection` satisfy this (the branded fields are ignored). Keeping
 * this here (rather than importing the branded types from `sections.ts`)
 * lets `types.ts` stay free of compile dependencies on `sections.ts`.
 */
export interface CompiledSectionLike {
  readonly id: string;
  readonly content: string;
  readonly contentHash: string;
  readonly minTokens?: number;
}

/**
 * Allocator result — which sections survived and which were dropped.
 *
 * `compile()` feeds its ordered section list through the allocator before
 * emission. The default no-op allocator in `assembly.ts` returns
 * `included = sections` and an empty `dropped`. A.5 replaces this with the
 * real two-pass floor-then-proportional allocator.
 */
export interface AllocationResult {
  readonly included: readonly CompiledSectionLike[];
  readonly dropped: readonly CompiledSectionLike[];
}

/**
 * `BudgetAllocator` — the interface A.5 implements. A.4 wires this in as an
 * optional `compile()` argument; when omitted, `compile()` uses a no-op
 * allocator that keeps every section (lets tests and Phase-1-style pipelines
 * run without the allocator implementation).
 *
 * Whole-section semantics: dropped sections vanish from `included` entirely
 * — never mid-section truncation. Matches `v050-prompts.md` §Section
 * Minimums: "An artifact is included in full or excluded entirely."
 */
export interface BudgetAllocator {
  allocate(
    sections: readonly CompiledSectionLike[],
    contextWindowTokens: number,
    proportions: TokenBudget,
  ): AllocationResult;
}

// ---------------------------------------------------------------------------
// Top-level spec shape
// ---------------------------------------------------------------------------

/**
 * Current schema version. Every spec file declares `version: 1` today; the
 * migration chain (v050-prompts.md §Schema Versioning) applies when the
 * loaded version is below this constant.
 */
export type StepSpecVersion = 1;

/**
 * The shape of every per-step `spec.json` under `packages/cli/src/specs/`.
 *
 * Load path (A.6 + A.4):
 *
 * 1. Read `spec.json` as untyped JSON.
 * 2. Validate via ajv bound to `JSONSchemaType<StepSpec>`.
 * 3. Apply any migration chain entries if `version` < current.
 * 4. Hand the typed `StepSpec` to the assembler.
 *
 * @see `.claude/project/gobbi/design/v050-prompts.md` §Spec Schema
 */
export interface StepSpec {
  /**
   * JSON Schema URI — binds this file to a specific schema version for
   * external tooling. Conventional value: `'https://gobbi.dev/schemas/step-spec/v1'`.
   */
  readonly $schema: string;

  /** Literal schema version. Bumped in lockstep with the migration chain. */
  readonly version: StepSpecVersion;

  readonly meta: StepMeta;
  readonly transitions: readonly StepTransition[];
  readonly delegation: StepDelegation;
  readonly tokenBudget: TokenBudget;
  readonly blocks: StepBlocks;
}
