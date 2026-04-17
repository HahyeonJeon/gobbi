/**
 * STATIC_* cache-safety lint for error-state + resume compiler constants.
 *
 * Every module-level STATIC_* constant exported from `errors.sections.ts`
 * feeds a `StaticSection.content` field in the compiled prompt. Anthropic
 * prompt caching requires those bytes to be stable across every
 * invocation — timestamps, UUIDs, absolute paths, or per-invocation PIDs
 * in any of these constants break the cache prefix on every call.
 *
 * This test iterates over the imported constants and asserts each passes
 * `STATIC_LINT_RULES`.
 *
 * ## Zoned imports — parallel-safe (H-A / plan F-2 resolution)
 *
 * D.1 lands this file with a single shared-role import and a single
 * `LINT_TARGETS` entry. D.2 appends error-state preamble imports inside
 * the D.2 zone below. D.4 appends resume preamble imports inside the D.4
 * zone. Both Wave 2 executors edit ONLY their own zone — the diffs touch
 * disjoint line ranges, so merge conflicts are structurally impossible.
 */

import { describe, it, expect } from 'bun:test';
import { lintStaticContent, STATIC_LINT_RULES } from '../assembly.js';
import { makeStatic } from '../sections.js';

// ----- D.1 shared role import (do NOT edit in D.2 or D.4) -----
import { STATIC_ROLE_ERROR_RECOVERY } from '../errors.sections.js';

// ----- D.2 APPEND HERE: error-state preamble imports -----
// (D.2 executor adds a line like:
//  import {
//    STATIC_PREAMBLE_CRASH,
//    STATIC_PREAMBLE_TIMEOUT,
//    STATIC_PREAMBLE_FEEDBACK_CAP,
//    STATIC_PREAMBLE_INVALID,
//    STATIC_PREAMBLE_UNKNOWN,
//  } from '../errors.sections.js';
// )

// ----- D.4 APPEND HERE: resume preamble imports -----
// (D.4 executor adds a line like:
//  import {
//    STATIC_ROLE_RESUME_RECOVERY,
//    STATIC_RESUME_PREAMBLE_CRASH,
//    STATIC_RESUME_PREAMBLE_TIMEOUT,
//    STATIC_RESUME_PREAMBLE_FEEDBACK_CAP,
//    STATIC_RESUME_PREAMBLE_INVALID,
//    STATIC_RESUME_PREAMBLE_UNKNOWN,
//  } from '../errors.sections.js';
// )

/**
 * Combined iteration set. Each entry is `[label, content]`. D.1 seeds the
 * shared role. D.2 and D.4 APPEND entries in their labeled zones — they
 * do NOT edit existing entries.
 */
const LINT_TARGETS: readonly (readonly [string, string])[] = [
  ['STATIC_ROLE_ERROR_RECOVERY', STATIC_ROLE_ERROR_RECOVERY],
  // ----- D.2 APPEND HERE: error-state preamble entries -----
  // ['STATIC_PREAMBLE_CRASH', STATIC_PREAMBLE_CRASH],
  // ['STATIC_PREAMBLE_TIMEOUT', STATIC_PREAMBLE_TIMEOUT],
  // ['STATIC_PREAMBLE_FEEDBACK_CAP', STATIC_PREAMBLE_FEEDBACK_CAP],
  // ['STATIC_PREAMBLE_INVALID', STATIC_PREAMBLE_INVALID],
  // ['STATIC_PREAMBLE_UNKNOWN', STATIC_PREAMBLE_UNKNOWN],
  // ----- D.4 APPEND HERE: resume preamble entries -----
  // ['STATIC_ROLE_RESUME_RECOVERY', STATIC_ROLE_RESUME_RECOVERY],
  // ['STATIC_RESUME_PREAMBLE_CRASH', STATIC_RESUME_PREAMBLE_CRASH],
  // ['STATIC_RESUME_PREAMBLE_TIMEOUT', STATIC_RESUME_PREAMBLE_TIMEOUT],
  // ['STATIC_RESUME_PREAMBLE_FEEDBACK_CAP', STATIC_RESUME_PREAMBLE_FEEDBACK_CAP],
  // ['STATIC_RESUME_PREAMBLE_INVALID', STATIC_RESUME_PREAMBLE_INVALID],
  // ['STATIC_RESUME_PREAMBLE_UNKNOWN', STATIC_RESUME_PREAMBLE_UNKNOWN],
];

describe('STATIC_* error/resume constants are cache-safe', () => {
  it('registry is non-empty (sanity — at least D.1 shared role present)', () => {
    expect(LINT_TARGETS.length).toBeGreaterThan(0);
  });

  it.each(LINT_TARGETS.map(([label, content]) => [label, content]))(
    '%s passes STATIC_LINT_RULES',
    (label, content) => {
      // Wrap the constant in a single static section so `lintStaticContent`
      // can run over it — it expects a `KindedSection[]`, not raw strings.
      const issues = lintStaticContent(
        [
          {
            kind: 'static',
            section: makeStatic({ id: `test.${label}`, content }),
          },
        ],
        STATIC_LINT_RULES,
      );
      if (issues.length > 0) {
        const detail = issues
          .map((i) => `  - [${i.ruleId}] match="${i.match}"`)
          .join('\n');
        throw new Error(
          `Static constant '${label}' violates STATIC_LINT_RULES:\n${detail}`,
        );
      }
      expect(issues).toEqual([]);
    },
  );
});
