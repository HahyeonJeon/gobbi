/**
 * Tests for the doctor library functions.
 *
 * Uses Node's built-in test runner (`node:test`) and strict assertions.
 * Run via: npm test (which compiles first, then runs the compiled JS).
 */

import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  computeStatus,
  computeMaturityLevel,
  computeCompleteness,
  generateSummary,
  runDoctorCheck,
} from '../lib/docs/doctor.js';
import type { Finding } from '../lib/docs/health.js';
import { auditReferences, auditConventions, auditCommands } from '../lib/docs/audit.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gobbi-test-'));
}

function removeTempDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

/** Create a file (and any missing parent dirs) with the given content. */
function createFile(filePath: string, content: string = ''): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ---------------------------------------------------------------------------
// computeStatus
// ---------------------------------------------------------------------------

describe('computeStatus', () => {
  it('returns clean for empty findings', () => {
    assert.equal(computeStatus([]), 'clean');
  });

  it('returns clean for info-only findings', () => {
    const findings: Finding[] = [
      { path: 'a', severity: 'info', category: 'test', message: 'msg', suggestion: 'fix' },
    ];
    assert.equal(computeStatus(findings), 'clean');
  });

  it('returns attention-needed for warnings', () => {
    const findings: Finding[] = [
      { path: 'a', severity: 'warning', category: 'test', message: 'msg', suggestion: 'fix' },
    ];
    assert.equal(computeStatus(findings), 'attention-needed');
  });

  it('returns degraded for errors', () => {
    const findings: Finding[] = [
      { path: 'a', severity: 'error', category: 'test', message: 'msg', suggestion: 'fix' },
    ];
    assert.equal(computeStatus(findings), 'degraded');
  });

  it('returns degraded when mixed errors and warnings', () => {
    const findings: Finding[] = [
      { path: 'a', severity: 'warning', category: 'test', message: 'msg', suggestion: 'fix' },
      { path: 'b', severity: 'error', category: 'test', message: 'msg', suggestion: 'fix' },
    ];
    assert.equal(computeStatus(findings), 'degraded');
  });
});

// ---------------------------------------------------------------------------
// computeMaturityLevel
// ---------------------------------------------------------------------------

describe('computeMaturityLevel', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      removeTempDir(dir);
    }
    tempDirs.length = 0;
  });

  function track(dir: string): string {
    tempDirs.push(dir);
    return dir;
  }

  it('returns 0 for empty dir (no .claude/)', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    const level = await computeMaturityLevel(claudeDir, root, 0, 0);
    assert.equal(level, 0);
  });

  it('returns 1 for CLAUDE.md + .claude/ + project/', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    fs.mkdirSync(claudeDir, { recursive: true });
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });
    // No skills or agents → stays at L1
    const level = await computeMaturityLevel(claudeDir, root, 0, 0);
    assert.equal(level, 1);
  });

  it('returns 2 for L1 + project/ + 1 skill', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });
    createFile(
      path.join(claudeDir, 'skills', 'test-skill', 'SKILL.md'),
      '---\nname: test-skill\n---\n# Test Skill',
    );
    const level = await computeMaturityLevel(claudeDir, root, 0, 0);
    assert.equal(level, 2);
  });

  it('returns 3 for L2 + rules + gotchas + 3 skills + 0 errors', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });

    // 3 skills
    for (const name of ['skill-a', 'skill-b', 'skill-c']) {
      createFile(
        path.join(claudeDir, 'skills', name, 'SKILL.md'),
        `---\nname: ${name}\n---\n# ${name}`,
      );
    }

    // Rules
    createFile(path.join(claudeDir, 'rules', 'naming.md'), '# Naming rules');

    // Gotcha file (inside a skill)
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.md'), '# Gotchas');

    const level = await computeMaturityLevel(claudeDir, root, 0, 0);
    assert.equal(level, 3);
  });

  it('returns 4 for L3 + JSON peers + 0 errors + 0 warnings', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });

    // 3 skills — each .md has a .json peer
    for (const name of ['skill-a', 'skill-b', 'skill-c']) {
      const skillDir = path.join(claudeDir, 'skills', name);
      createFile(path.join(skillDir, 'SKILL.md'), `---\nname: ${name}\n---\n# ${name}`);
      createFile(path.join(skillDir, 'SKILL.json'), '{}');
    }

    // Rules — .md + .json peer
    createFile(path.join(claudeDir, 'rules', 'naming.md'), '# Naming rules');
    createFile(path.join(claudeDir, 'rules', 'naming.json'), '{}');

    // Gotcha file (inside a skill) — .md + .json peer
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.md'), '# Gotchas');
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.json'), '{}');

    const level = await computeMaturityLevel(claudeDir, root, 0, 0);
    assert.equal(level, 4);
  });

  it('returns 3 when warnings block L4', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });

    for (const name of ['skill-a', 'skill-b', 'skill-c']) {
      const skillDir = path.join(claudeDir, 'skills', name);
      createFile(path.join(skillDir, 'SKILL.md'), `---\nname: ${name}\n---\n# ${name}`);
      createFile(path.join(skillDir, 'SKILL.json'), '{}');
    }
    createFile(path.join(claudeDir, 'rules', 'naming.md'), '# Naming rules');
    createFile(path.join(claudeDir, 'rules', 'naming.json'), '{}');
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.md'), '# Gotchas');
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.json'), '{}');

    // 1 warning blocks L4 but allows L3
    const level = await computeMaturityLevel(claudeDir, root, 0, 1);
    assert.equal(level, 3);
  });

  it('returns 2 when errors block L3', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });

    for (const name of ['skill-a', 'skill-b', 'skill-c']) {
      const skillDir = path.join(claudeDir, 'skills', name);
      createFile(path.join(skillDir, 'SKILL.md'), `---\nname: ${name}\n---\n# ${name}`);
      createFile(path.join(skillDir, 'SKILL.json'), '{}');
    }
    createFile(path.join(claudeDir, 'rules', 'naming.md'), '# Naming rules');
    createFile(path.join(claudeDir, 'rules', 'naming.json'), '{}');
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.md'), '# Gotchas');
    createFile(path.join(claudeDir, 'skills', 'skill-a', 'gotchas.json'), '{}');

    // 1 error blocks L3 — stays at L2
    const level = await computeMaturityLevel(claudeDir, root, 1, 0);
    assert.equal(level, 2);
  });
});

// ---------------------------------------------------------------------------
// computeCompleteness
// ---------------------------------------------------------------------------

describe('computeCompleteness', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const dir of tempDirs) {
      removeTempDir(dir);
    }
    tempDirs.length = 0;
  });

  function track(dir: string): string {
    tempDirs.push(dir);
    return dir;
  }

  it('reports everything missing for an empty dir', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    // Do not create .claude/ — all checks should fail
    const report = await computeCompleteness(claudeDir, root);
    assert.equal(report.present.length, 0);
    assert.ok(report.missing.length > 0);
    assert.equal(report.score, 0);
  });

  it('reports everything present for a fully populated dir', async () => {
    const root = track(createTempDir());
    const claudeDir = path.join(root, '.claude');
    createFile(path.join(root, 'CLAUDE.md'), '# Project');
    fs.mkdirSync(claudeDir, { recursive: true });
    createFile(
      path.join(claudeDir, 'skills', 'test-skill', 'SKILL.md'),
      '---\nname: test-skill\n---\n# Test',
    );
    createFile(path.join(claudeDir, 'agents', 'test-agent.md'), '# Agent');
    createFile(path.join(claudeDir, 'rules', 'test.md'), '# Rule');
    fs.mkdirSync(path.join(claudeDir, 'project'), { recursive: true });
    createFile(path.join(claudeDir, 'settings.json'), '{}');
    createFile(path.join(claudeDir, 'skills', 'test-skill', 'gotchas.md'), '# Gotchas');

    const report = await computeCompleteness(claudeDir, root);
    assert.equal(report.missing.length, 0);
    assert.equal(report.score, 1);
    assert.ok(report.present.length > 0);
  });
});

// ---------------------------------------------------------------------------
// generateSummary
// ---------------------------------------------------------------------------

describe('generateSummary', () => {
  it('produces summary with status and maturity', () => {
    const summary = generateSummary('clean', 2, 0, 0, {
      score: 0.5,
      missing: ['settings.json'],
      present: ['CLAUDE.md'],
    });
    assert.ok(summary.includes('Clean'));
    assert.ok(summary.includes('Level 2'));
    assert.ok(summary.includes('Structured'));
  });

  it('includes error and warning counts when non-zero', () => {
    const summary = generateSummary('degraded', 1, 3, 2, {
      score: 0.25,
      missing: [],
      present: [],
    });
    assert.ok(summary.includes('3 errors'));
    assert.ok(summary.includes('2 warnings'));
  });

  it('includes next step for non-L4 maturity', () => {
    const summary = generateSummary('clean', 0, 0, 0, {
      score: 0,
      missing: [],
      present: [],
    });
    assert.ok(summary.includes('CLAUDE.md'));
    assert.ok(summary.includes('.claude/'));
  });

  it('omits next step for L4', () => {
    const summary = generateSummary('clean', 4, 0, 0, {
      score: 1,
      missing: [],
      present: ['CLAUDE.md'],
    });
    // L4 has no next step — summary should be a single line
    const lines = summary.split('\n');
    assert.equal(lines.length, 1);
  });
});

// ---------------------------------------------------------------------------
// runDoctorCheck integration
// ---------------------------------------------------------------------------

describe('runDoctorCheck integration', () => {
  it('returns a valid DoctorReport shape', async () => {
    const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
    const report = await runDoctorCheck(repoRoot);

    assert.ok(
      ['clean', 'attention-needed', 'degraded'].includes(report.status),
      `unexpected status: ${report.status}`,
    );
    assert.ok(
      report.maturityLevel >= 0 && report.maturityLevel <= 4,
      `maturity out of range: ${report.maturityLevel}`,
    );
    assert.ok(Array.isArray(report.findings));
    assert.ok(typeof report.completeness.score === 'number');
    assert.ok(report.completeness.score >= 0 && report.completeness.score <= 1);
    assert.ok(Array.isArray(report.completeness.missing));
    assert.ok(Array.isArray(report.completeness.present));
    assert.ok(typeof report.summary === 'string');
    assert.ok(report.summary.length > 0);
  });
});

// ---------------------------------------------------------------------------
// Audit library regression tests
// ---------------------------------------------------------------------------

describe('audit library functions', () => {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
  const claudeDir = path.join(repoRoot, '.claude');

  it('auditReferences returns well-shaped Finding[]', async () => {
    const findings = await auditReferences({ directory: claudeDir, repoRoot });
    assert.ok(Array.isArray(findings));
    for (const f of findings) {
      assert.ok(typeof f.path === 'string');
      assert.ok(
        ['error', 'warning', 'info'].includes(f.severity),
        `unexpected severity: ${f.severity}`,
      );
      assert.ok(typeof f.category === 'string');
      assert.ok(typeof f.message === 'string');
      assert.ok(typeof f.suggestion === 'string');
    }
  });

  it('auditConventions returns well-shaped Finding[]', async () => {
    const findings = await auditConventions({ directory: claudeDir, repoRoot });
    assert.ok(Array.isArray(findings));
    for (const f of findings) {
      assert.ok(typeof f.path === 'string');
      assert.ok(['error', 'warning', 'info'].includes(f.severity));
      assert.ok(typeof f.category === 'string');
      assert.ok(typeof f.message === 'string');
      assert.ok(typeof f.suggestion === 'string');
    }
  });

  it('auditCommands returns well-shaped Finding[]', async () => {
    const findings = await auditCommands({ directory: claudeDir, repoRoot });
    assert.ok(Array.isArray(findings));
    for (const f of findings) {
      assert.ok(typeof f.path === 'string');
      assert.ok(['error', 'warning', 'info'].includes(f.severity));
      assert.ok(typeof f.category === 'string');
      assert.ok(typeof f.message === 'string');
      assert.ok(typeof f.suggestion === 'string');
    }
  });
});

// ---------------------------------------------------------------------------
// Ignore comment regex
// ---------------------------------------------------------------------------

describe('ignore comments', () => {
  const re = /<!--\s*gobbi-(?:audit|doctor):ignore\s*-->/;

  it('recognizes gobbi-audit:ignore', () => {
    assert.ok(re.test('<!-- gobbi-audit:ignore -->'));
  });

  it('recognizes gobbi-doctor:ignore', () => {
    assert.ok(re.test('<!-- gobbi-doctor:ignore -->'));
  });

  it('rejects unrelated comments', () => {
    assert.ok(!re.test('<!-- gobbi-other:ignore -->'));
  });

  it('tolerates extra whitespace', () => {
    assert.ok(re.test('<!--  gobbi-audit:ignore  -->'));
  });
});
