/**
 * Shared diagnostic types — single source of truth for codes, severity, and
 * record shape emitted by every static and runtime diagnostic producer.
 *
 * ## Letter-prefixed family scheme
 *
 * Each `DiagnosticCode` begins with a single letter that encodes its family.
 * Downstream tooling discriminates families via `code.charAt(0)` without a
 * registry lookup. Prefixes are reserved as follows:
 *
 *   E### — static validation errors (`gobbi workflow validate`).
 *   W### — runtime warnings raised at hook-time (e.g. `guard.warn`).
 *   X### — runtime errors. Reserved for PR D+ (no codes currently).
 *   V### — verification results (reserved for PR E verification runner).
 *
 * TODO(PR E): E009 dead-predicate + E010 verdict-as-condition runtime
 * diagnostic join this family.
 *
 * Existing `E001_*` through `E008_*` codes predate this scheme and already
 * comply with it — the encoding is additive for new codes only. Wire format
 * (`{"code":"E001_..."}`) is preserved across the promotion.
 *
 * ## Consumers
 *
 *   - `commands/workflow/validate.ts` (static analysis — 8 codes today).
 *   - `workflow/reducer.ts` (runtime `guard.warn` records via `W###`).
 *   - Future: error compilers (PR D, `X###`), verification runner (PR E, `V###`).
 *
 * ## Location choice
 *
 * Lives under `workflow/` rather than `specs/` because the runtime `guard.warn`
 * reducer is a first-class consumer; keeping diagnostics alongside the runtime
 * avoids a `workflow → specs` import for a security-critical hot path.
 * Validate (a command) already imports from `workflow/`, so the direction
 * remains conventional.
 *
 * @see `.claude/project/gobbi/reference/validate-codes.md` — stable code docs
 */

/** Stable diagnostic code identifier. Adding a code is additive; renaming or
 *  removing one is a breaking change to the JSON wire format. */
export type DiagnosticCode =
  // E### — static validation (PR B, `gobbi workflow validate`).
  | 'E001_INVALID_SCHEMA'
  | 'E002_UNKNOWN_PREDICATE'
  | 'E003_INVALID_GRAPH'
  | 'E004_MISSING_SPEC'
  | 'E005_INVALID_OVERLAY'
  | 'E006_UNKNOWN_SUBSTATE'
  | 'E007_ORPHAN_SUBSTATE'
  | 'E008_DUPLICATE_REGISTRATION'
  // W### — runtime warnings (PR C, `guard.warn`).
  //
  // W001 is a generic placeholder so the `guard.warn` event's `code` field
  // has a valid member during PR C. Guard-spec-specific W### codes (e.g.
  // secret-pattern match, delegation size exceeded) land alongside their
  // guard implementations in later waves / PR F.
  | 'W001_GUARD_WARN_GENERIC';

/** Severity classification. `error`-severity diagnostics fail exit code 1;
 *  `warning`-severity are informational. */
export type DiagnosticSeverity = 'error' | 'warning';

/** Authoritative severity map — one entry per `DiagnosticCode`. Consumers
 *  that assign `d.severity` from the code must read this record, not
 *  hard-code severity at the call site. */
export const CODE_SEVERITY: Readonly<Record<DiagnosticCode, DiagnosticSeverity>> =
  {
    E001_INVALID_SCHEMA: 'error',
    E002_UNKNOWN_PREDICATE: 'error',
    E003_INVALID_GRAPH: 'error',
    E004_MISSING_SPEC: 'error',
    E005_INVALID_OVERLAY: 'error',
    E006_UNKNOWN_SUBSTATE: 'error',
    E007_ORPHAN_SUBSTATE: 'warning',
    E008_DUPLICATE_REGISTRATION: 'error',
    W001_GUARD_WARN_GENERIC: 'warning',
  };

/**
 * Pointer into a file where the diagnostic applies. `file` is the absolute
 * path; `pointer` is a JSON pointer into the file's JSON tree when the
 * violation has a precise location, or `null` when the violation is
 * file-scoped (e.g., missing spec).
 */
export interface DiagnosticLocation {
  readonly file: string;
  readonly pointer: string | null;
}

/**
 * One diagnostic record — emitted as JSON by every producer. Every field is
 * stable across versions; adding a field is backwards-compatible, renaming
 * or removing a field is a breaking change.
 */
export interface Diagnostic {
  readonly code: DiagnosticCode;
  readonly severity: DiagnosticSeverity;
  readonly message: string;
  readonly location: DiagnosticLocation;
}
