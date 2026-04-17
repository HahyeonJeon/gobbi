/**
 * Lazy event schema migration pipeline.
 *
 * Events are stored with a schema_version. When the application's
 * CURRENT_SCHEMA_VERSION advances, older events are migrated on read
 * by walking the migration chain from their stored version to the target.
 *
 * ## Version history
 *
 * - v1 — initial release (PR A).
 * - v2 — adds `guard.warn` event type and the state fields
 *   `lastVerdictOutcome` + `GuardViolationRecord.severity`. Event *data*
 *   shape is identical across v1→v2, so the registered v1 migration is an
 *   identity. New v2-only fields on state are normalised on read, not
 *   written retroactively (Greg Young discipline — see `v050-session.md`).
 * - v3 — PR D. Adds `workflow.invalid_transition` event type and the
 *   optional `EvalSkipData.priorError` field (CP11 reversibility — carries
 *   a full `ErrorPathway` snapshot on `resume --force-memorization` skip
 *   events). Event *data* payloads are wire-compatible across v2→v3: the
 *   new `priorError` field is strictly additive and optional, so existing
 *   v2 events parse cleanly under v3 and a v3 event without `priorError`
 *   is indistinguishable from a v2 one. The registered v2 migration is an
 *   identity on event data; `initialState().schemaVersion` bumps 2→3 in
 *   lockstep so newly-initialised sessions advertise v3.
 */

// ---------------------------------------------------------------------------
// Row type — must match the SQLite row shape from EventStore
// ---------------------------------------------------------------------------

export interface EventRow {
  readonly seq: number;
  readonly ts: string;
  readonly schema_version: number;
  readonly type: string;
  readonly step: string | null;
  readonly data: string;
  readonly actor: string;
  readonly parent_seq: number | null;
  readonly idempotency_key: string;
}

// ---------------------------------------------------------------------------
// Schema version tracking
// ---------------------------------------------------------------------------

export const CURRENT_SCHEMA_VERSION = 3;

// ---------------------------------------------------------------------------
// Migration registry
// ---------------------------------------------------------------------------

type MigrationFn = (eventData: unknown) => unknown;

/**
 * Maps schema_version N to the function that transforms event data
 * from version N to version N+1.
 *
 * Both registered hops are explicit identities:
 *
 * - v1→v2: new event types (`guard.warn`) + new state fields, not payload
 *   transforms.
 * - v2→v3 (PR D): adds `workflow.invalid_transition` event type + an
 *   optional `EvalSkipData.priorError` field. `priorError` is strictly
 *   additive on the existing `eval.skip` payload, so an absent field on a
 *   v2 row is indistinguishable from a v3 row that happens not to carry
 *   a snapshot. No payload transform.
 *
 * Declaring each identity registers the hop so the composition walks the
 * full chain (v1→v2→v3) rather than short-circuiting — the walk path is
 * what a future v4 migration will extend.
 */
const migrations: Readonly<Record<number, MigrationFn>> = {
  1: (data) => data,
  2: (data) => data,
};

// ---------------------------------------------------------------------------
// Migration function
// ---------------------------------------------------------------------------

/**
 * Migrate an event row from its stored schema_version to the target version.
 *
 * Returns the original row unchanged if already at target version.
 * Throws if a migration step is missing in the chain.
 */
export function migrateEvent(
  event: EventRow,
  targetVersion: number = CURRENT_SCHEMA_VERSION,
): EventRow {
  let { schema_version } = event;

  if (schema_version === targetVersion) {
    return event;
  }

  if (schema_version > targetVersion) {
    throw new Error(
      `Event schema_version ${schema_version} is newer than target ${targetVersion} — downgrade migrations are not supported`,
    );
  }

  let parsedData: unknown = JSON.parse(event.data);

  while (schema_version < targetVersion) {
    const migrator = migrations[schema_version];
    if (migrator === undefined) {
      throw new Error(
        `No migration from schema v${schema_version} to v${schema_version + 1}`,
      );
    }
    parsedData = migrator(parsedData);
    schema_version++;
  }

  return { ...event, schema_version, data: JSON.stringify(parsedData) };
}
