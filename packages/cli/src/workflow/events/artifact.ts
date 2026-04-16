/**
 * Artifact event category — 2 event types tracking writes to step directories.
 *
 * Events: write, overwrite
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const ARTIFACT_EVENTS = {
  WRITE: 'artifact.write',
  OVERWRITE: 'artifact.overwrite',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const ARTIFACT_EVENT_TYPES = new Set<string>(Object.values(ARTIFACT_EVENTS));

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type ArtifactEventType = typeof ARTIFACT_EVENTS[keyof typeof ARTIFACT_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

export interface ArtifactWriteData {
  readonly step: string;
  readonly filename: string;
  readonly artifactType: string;
}

export interface ArtifactOverwriteData {
  readonly step: string;
  readonly filename: string;
  readonly previousFilename?: string | undefined;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type ArtifactEvent =
  | { readonly type: typeof ARTIFACT_EVENTS.WRITE; readonly data: ArtifactWriteData }
  | { readonly type: typeof ARTIFACT_EVENTS.OVERWRITE; readonly data: ArtifactOverwriteData };

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isArtifactEvent(event: { type: string }): event is ArtifactEvent {
  return ARTIFACT_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createArtifactWrite(data: ArtifactWriteData): ArtifactEvent {
  return { type: ARTIFACT_EVENTS.WRITE, data };
}

export function createArtifactOverwrite(data: ArtifactOverwriteData): ArtifactEvent {
  return { type: ARTIFACT_EVENTS.OVERWRITE, data };
}
