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

export const CURRENT_SCHEMA_VERSION = 2;

// ---------------------------------------------------------------------------
// Migration registry
// ---------------------------------------------------------------------------

type MigrationFn = (eventData: unknown) => unknown;

/**
 * Maps schema_version N to the function that transforms event data
 * from version N to version N+1.
 *
 * v1→v2 is an explicit identity: event *data* payloads are wire-compatible
 * across the bump (the v2 changes are new event types plus new state fields,
 * not payload transforms). Declaring the identity registers the hop so a
 * future v3 migration inherits a tested composition, rather than falling
 * through to the missing-step error.
 */
const migrations: Readonly<Record<number, MigrationFn>> = {
  1: (data) => data,
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
