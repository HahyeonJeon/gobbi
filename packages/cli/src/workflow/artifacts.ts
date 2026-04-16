/**
 * Artifact filename versioning based on feedback round.
 *
 * When the workflow loops back through execution via evaluation revise
 * verdicts, each round produces versioned artifact filenames to preserve
 * the history of prior attempts.
 *
 * Pure functions — no I/O. The caller provides file lists when needed.
 */

// ---------------------------------------------------------------------------
// Filename generation
// ---------------------------------------------------------------------------

/**
 * Generate an artifact filename with feedback round suffix.
 *
 * Round 0 (initial attempt): `{baseName}.{ext}`
 * Round 1+: `{baseName}-r{round}.{ext}`
 *
 * Examples:
 *   artifactFilename('research', 'md', 0) → 'research.md'
 *   artifactFilename('research', 'md', 1) → 'research-r1.md'
 *   artifactFilename('research', 'md', 3) → 'research-r3.md'
 */
export function artifactFilename(
  baseName: string,
  ext: string,
  feedbackRound: number,
): string {
  if (feedbackRound === 0) return `${baseName}.${ext}`;
  return `${baseName}-r${feedbackRound}.${ext}`;
}

/**
 * Generate a failure artifact filename.
 *
 * Failure artifacts are always suffixed with the next round number
 * (feedbackRound + 1) since they document the failure that triggers
 * the next attempt.
 *
 * Examples:
 *   failureFilename('delegation-fail', 'md', 0) → 'delegation-fail-r1.md'
 *   failureFilename('delegation-fail', 'md', 2) → 'delegation-fail-r3.md'
 */
export function failureFilename(
  baseName: string,
  ext: string,
  feedbackRound: number,
): string {
  return `${baseName}-r${feedbackRound + 1}.${ext}`;
}

// ---------------------------------------------------------------------------
// Round detection from existing files
// ---------------------------------------------------------------------------

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find the highest feedback round number for a given base name
 * in a list of filenames.
 *
 * Accepts a pre-read file list — does not perform I/O.
 * Returns 0 if no matching files are found (round 0 = initial attempt).
 *
 * Matches both unsuffixed (`baseName.ext`) and suffixed (`baseName-rN.ext`)
 * patterns. The unsuffixed form counts as round 0.
 *
 * Examples:
 *   latestRound(['research.md'], 'research') → 0
 *   latestRound(['research.md', 'research-r2.md'], 'research') → 2
 *   latestRound(['other.md'], 'research') → -1  (no match)
 */
export function latestRound(files: readonly string[], baseName: string): number {
  let max = -1;
  const pattern = new RegExp(`^${escapeRegex(baseName)}(?:-r(\\d+))?\\.`);
  for (const f of files) {
    const match = pattern.exec(f);
    if (match !== null) {
      const roundStr = match[1];
      const round = roundStr !== undefined ? parseInt(roundStr, 10) : 0;
      if (round > max) max = round;
    }
  }
  return max;
}
