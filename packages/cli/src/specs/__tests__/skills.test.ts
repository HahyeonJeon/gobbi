/**
 * Unit tests for `specs/skills.ts` — loading real skill directories from
 * `.claude/skills/`, deterministic ordering, graceful handling of missing
 * files, child-doc discovery via the "Navigate deeper from here:" table,
 * and stable `skills.<name>[.<child>]` section ID scheme.
 *
 * Most tests point at the repository's real `.claude/skills/` tree via an
 * absolute `skillsRoot` so they exercise the parser against real content.
 * A dedicated unit test targets the parser directly for edge cases that
 * are hard to set up on-disk.
 */

import { describe, test, expect, mock, beforeEach, afterEach } from 'bun:test';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadSkills,
  extractChildDocFilenames,
  SKILL_NAMES,
  DEFAULT_SKILLS_ROOT,
  type SkillName,
} from '../skills.js';

// ---------------------------------------------------------------------------
// Locate the repository's real `.claude/skills/` directory relative to this
// test file. The test file lives at `packages/cli/src/specs/__tests__/` so
// the skills root is five levels up. Using an absolute path means tests pass
// regardless of cwd.
// ---------------------------------------------------------------------------

const thisDir = dirname(fileURLToPath(import.meta.url));
const REAL_SKILLS_ROOT = resolve(thisDir, '..', '..', '..', '..', '..', '.claude/skills');

// ---------------------------------------------------------------------------
// Silence the console.warn emitted on missing files — the loader's contract
// is "warn-and-skip", and the warnings would clutter test output. Tests that
// assert on warn behaviour swap this mock for an inspection spy.
// ---------------------------------------------------------------------------

let warnSpy: ReturnType<typeof mock>;

beforeEach(() => {
  warnSpy = mock(() => {});
  console.warn = warnSpy as unknown as typeof console.warn;
});

afterEach(() => {
  // bun:test resets mocks between tests by default; nothing to restore here.
});

// ===========================================================================
// Real-skill loading
// ===========================================================================

describe('loadSkills — real skill tree', () => {
  test('loads _gotcha SKILL.md with a stable id and non-empty content', async () => {
    const sections = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: REAL_SKILLS_ROOT,
    });

    // At minimum the main SKILL.md must be present.
    const main = sections.find((s) => s.id === 'skills._gotcha');
    expect(main).toBeDefined();
    expect(main?.content.length).toBeGreaterThan(0);
    expect(main?.content).toContain('gotcha'); // sanity-check real content
  });

  test('discovers at least one child doc from _gotcha "Navigate deeper" table', async () => {
    const sections = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: REAL_SKILLS_ROOT,
    });

    // _gotcha's SKILL.md lists __system.md, __security.md, evaluation.md,
    // project-gotcha.md, and skills-gotcha.md in its table. The real tree
    // includes all five — assert the loader picked them up.
    const childIds = sections
      .filter((s) => s.id !== 'skills._gotcha')
      .map((s) => s.id);

    expect(childIds).toContain('skills._gotcha.__system');
    expect(childIds).toContain('skills._gotcha.__security');
    expect(childIds).toContain('skills._gotcha.evaluation');
    expect(childIds).toContain('skills._gotcha.project-gotcha');
    expect(childIds).toContain('skills._gotcha.skills-gotcha');
  });

  test('loads the nine surviving skills without throwing', async () => {
    const sections = await loadSkills({
      skillNames: SKILL_NAMES,
      skillsRoot: REAL_SKILLS_ROOT,
    });

    for (const name of SKILL_NAMES) {
      const main = sections.find((s) => s.id === `skills.${name}`);
      expect(main).toBeDefined();
      expect(main?.content.length).toBeGreaterThan(0);
    }
  });

  test('every section has id of form skills.<name>[.<child>]', async () => {
    const sections = await loadSkills({
      skillNames: SKILL_NAMES,
      skillsRoot: REAL_SKILLS_ROOT,
    });

    const idPattern = /^skills\.(_[a-z-]+)(?:\.[A-Za-z0-9_-]+)?$/;
    for (const s of sections) {
      expect(s.id).toMatch(idPattern);
    }
  });

  test('_claude main section content mentions the Chain-of-Docs principle', async () => {
    // Content-sanity check: loader passes file bytes through verbatim.
    const sections = await loadSkills({
      skillNames: ['_claude'],
      skillsRoot: REAL_SKILLS_ROOT,
    });

    const main = sections.find((s) => s.id === 'skills._claude');
    expect(main?.content).toContain('Chain-of-Docs');
  });
});

// ===========================================================================
// Deterministic ordering
// ===========================================================================

describe('loadSkills — ordering', () => {
  test('two calls produce identical section id sequences', async () => {
    const call1 = await loadSkills({
      skillNames: SKILL_NAMES,
      skillsRoot: REAL_SKILLS_ROOT,
    });
    const call2 = await loadSkills({
      skillNames: SKILL_NAMES,
      skillsRoot: REAL_SKILLS_ROOT,
    });

    expect(call1.map((s) => s.id)).toEqual(call2.map((s) => s.id));
  });

  test('skills are emitted alphabetically regardless of input order', async () => {
    // Intentionally reverse the input order.
    const reversed = [...SKILL_NAMES].reverse();
    const sections = await loadSkills({
      skillNames: reversed,
      skillsRoot: REAL_SKILLS_ROOT,
    });

    // Extract just the skill-name portion from each main section id and
    // confirm the alphabetical invariant.
    const mainSkillNames = sections
      .filter((s) => /^skills\.[^.]+$/.test(s.id))
      .map((s) => s.id.slice('skills.'.length));

    const sorted = [...mainSkillNames].sort();
    expect(mainSkillNames).toEqual(sorted);
  });

  test('within a skill, main SKILL.md section comes before children', async () => {
    const sections = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: REAL_SKILLS_ROOT,
    });

    const mainIndex = sections.findIndex((s) => s.id === 'skills._gotcha');
    const firstChildIndex = sections.findIndex((s) =>
      s.id.startsWith('skills._gotcha.'),
    );

    expect(mainIndex).toBeGreaterThanOrEqual(0);
    expect(firstChildIndex).toBeGreaterThan(mainIndex);
  });

  test('children within a skill are alphabetically ordered', async () => {
    const sections = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: REAL_SKILLS_ROOT,
    });

    const childIds = sections
      .filter((s) => s.id.startsWith('skills._gotcha.'))
      .map((s) => s.id);

    const sorted = [...childIds].sort();
    expect(childIds).toEqual(sorted);
  });

  test('duplicate skill names in input produce a single set of sections', async () => {
    const sections = await loadSkills({
      skillNames: ['_gotcha', '_gotcha', '_gotcha'],
      skillsRoot: REAL_SKILLS_ROOT,
    });

    const mainOccurrences = sections.filter((s) => s.id === 'skills._gotcha');
    expect(mainOccurrences.length).toBe(1);
  });
});

// ===========================================================================
// Graceful handling of missing files
// ===========================================================================

describe('loadSkills — missing files', () => {
  test('non-existent skill is skipped, not thrown', async () => {
    // Point skillsRoot at a non-existent directory so every skill read fails.
    const sections = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: '/tmp/gobbi-definitely-not-a-real-path-2026',
    });

    expect(sections).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });

  test('mix of present and absent skills returns partial results', async () => {
    // Simulate a mixed scenario by pointing one skill at the real root via
    // a "known absent" name in the union. There is no way to include a
    // fake name in the closed union, so we instead combine a real skill
    // name against a non-existent root and confirm the mix of behaviour
    // in two separate calls.
    const present = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: REAL_SKILLS_ROOT,
    });
    const absent = await loadSkills({
      skillNames: ['_gotcha'],
      skillsRoot: '/tmp/gobbi-definitely-not-a-real-path-2026',
    });

    expect(present.length).toBeGreaterThan(0);
    expect(absent.length).toBe(0);
  });

  test('empty input array yields empty output', async () => {
    const empty = await loadSkills({
      skillNames: [],
      skillsRoot: REAL_SKILLS_ROOT,
    });
    expect(empty).toEqual([]);
  });

  test('default skillsRoot is the documented relative path', () => {
    expect(DEFAULT_SKILLS_ROOT).toBe('.claude/skills');
  });
});

// ===========================================================================
// extractChildDocFilenames — parser edge cases
//
// Testing the parser directly lets us cover edge cases without touching
// the filesystem.
// ===========================================================================

describe('extractChildDocFilenames', () => {
  test('extracts child .md filenames from a conventional table', () => {
    const content = `
# _example

**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | Known mistakes |
| [conventions.md](conventions.md) | Project conventions |

---

## Core Principle
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames].sort()).toEqual(['conventions.md', 'gotchas.md']);
  });

  test('rejects sibling skill references (parent-escape paths)', () => {
    const content = `
**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [_rules](../../_rules) | Sibling skill |
| [gotchas.md](gotchas.md) | Real child |

---
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames]).toEqual(['gotchas.md']);
  });

  test('rejects subdirectory paths like evaluation/README.md', () => {
    const content = `
**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [evaluation/](evaluation/README.md) | Sub-tree |
| [authoring.md](authoring.md) | Real child |

---
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames]).toEqual(['authoring.md']);
  });

  test('rejects non-md targets', () => {
    const content = `
**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [external](https://example.com/foo) | External link |
| [index](index.html) | Wrong extension |
| [gotchas.md](gotchas.md) | Real child |

---
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames]).toEqual(['gotchas.md']);
  });

  test('returns empty array when no Navigate-deeper heading is present', () => {
    const content = `
# _example

No table here at all.

## Core Principle
`;
    const filenames = extractChildDocFilenames(content);
    expect(filenames).toEqual([]);
  });

  test('does not include SKILL.md itself if someone links to it', () => {
    const content = `
**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [SKILL.md](SKILL.md) | Self-reference, should be ignored |
| [gotchas.md](gotchas.md) | Real child |

---
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames]).toEqual(['gotchas.md']);
  });

  test('is case-insensitive for the .md suffix', () => {
    const content = `
**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [notes.MD](notes.MD) | Uppercase extension |

---
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames]).toEqual(['notes.MD']);
  });

  test('stops parsing at the closing --- rule even if more tables follow', () => {
    const content = `
**Navigate deeper from here:**

| Document | Covers |
|----------|--------|
| [gotchas.md](gotchas.md) | In-scope |

---

## Some other section

| Col | Col |
|---|---|
| [not-included.md](not-included.md) | Out-of-scope |
`;
    const filenames = extractChildDocFilenames(content);
    expect([...filenames]).toEqual(['gotchas.md']);
  });
});

// ===========================================================================
// Type-level: SkillName is a closed union
// ===========================================================================

describe('type-level: SkillName', () => {
  test('known skill names type-check', () => {
    // This test is primarily a compile-time assertion — if a name is
    // removed from the union the line fails to compile.
    const known: readonly SkillName[] = [
      '_agents',
      '_claude',
      '_git',
      '_gobbi-cli',
      '_gotcha',
      '_notification',
      '_project',
      '_rules',
      '_skills',
    ];
    expect(known.length).toBe(9);
  });
});
