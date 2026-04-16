import { describe, it, expect } from 'bun:test';

import {
  artifactFilename,
  failureFilename,
  latestRound,
} from '../artifacts.js';

// ===========================================================================
// artifactFilename
// ===========================================================================

describe('artifactFilename', () => {
  it('round 0 produces no suffix', () => {
    expect(artifactFilename('research', 'md', 0)).toBe('research.md');
  });

  it('round 1 produces -r1 suffix', () => {
    expect(artifactFilename('research', 'md', 1)).toBe('research-r1.md');
  });

  it('round 3 produces -r3 suffix', () => {
    expect(artifactFilename('plan', 'json', 3)).toBe('plan-r3.json');
  });

  it('handles multi-word base names', () => {
    expect(artifactFilename('execution-result', 'md', 2)).toBe('execution-result-r2.md');
  });

  it('handles various extensions', () => {
    expect(artifactFilename('data', 'jsonl', 1)).toBe('data-r1.jsonl');
    expect(artifactFilename('report', 'txt', 0)).toBe('report.txt');
  });
});

// ===========================================================================
// failureFilename
// ===========================================================================

describe('failureFilename', () => {
  it('round 0 produces -r1 suffix', () => {
    expect(failureFilename('delegation-fail', 'md', 0)).toBe('delegation-fail-r1.md');
  });

  it('round 2 produces -r3 suffix', () => {
    expect(failureFilename('delegation-fail', 'md', 2)).toBe('delegation-fail-r3.md');
  });

  it('round 5 produces -r6 suffix', () => {
    expect(failureFilename('error-log', 'json', 5)).toBe('error-log-r6.json');
  });
});

// ===========================================================================
// latestRound
// ===========================================================================

describe('latestRound', () => {
  it('returns -1 when no matching files', () => {
    expect(latestRound(['unrelated.txt', 'other.md'], 'research')).toBe(-1);
  });

  it('returns 0 for unsuffixed match only', () => {
    expect(latestRound(['research.md'], 'research')).toBe(0);
  });

  it('returns the highest round number', () => {
    const files = ['research.md', 'research-r1.md', 'research-r3.md'];
    expect(latestRound(files, 'research')).toBe(3);
  });

  it('handles mixed file names correctly', () => {
    const files = [
      'plan.md',
      'plan-r1.md',
      'plan-r2.md',
      'research.md',
      'research-r1.md',
      'other.txt',
    ];
    expect(latestRound(files, 'plan')).toBe(2);
    expect(latestRound(files, 'research')).toBe(1);
    expect(latestRound(files, 'other')).toBe(0);
  });

  it('does not match partial base names', () => {
    const files = ['research-notes.md', 'research-notes-r2.md'];
    // 'research' should not match 'research-notes' because the pattern
    // expects the base name to be followed by an optional -rN and then a dot
    expect(latestRound(files, 'research')).toBe(-1);
  });

  it('matches base names with special regex characters', () => {
    const files = ['file (1).md', 'file (1)-r2.md'];
    expect(latestRound(files, 'file (1)')).toBe(2);
  });

  it('handles large round numbers', () => {
    const files = ['data-r100.json', 'data-r50.json', 'data.json'];
    expect(latestRound(files, 'data')).toBe(100);
  });
});
