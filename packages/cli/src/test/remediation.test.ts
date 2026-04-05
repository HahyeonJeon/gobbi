/**
 * Tests for the remediation library (gobbi doctor --plan / --fix).
 *
 * Uses Node's built-in test runner (`node:test`) and strict assertions.
 * Run via: npm test (which compiles first, then runs the compiled JS).
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  computeRemediations,
  applyRemediation,
  type RemediationPlan,
  type Remediation,
} from '../lib/docs/remediation.js';
import type { Finding } from '../lib/docs/health.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'gobbi-remediation-test-'));
}

function removeTempDir(dir: string): void {
  fs.rmSync(dir, { recursive: true, force: true });
}

/** Create a file (and any missing parent dirs) with the given content. Returns the full path. */
function createFile(dir: string, relativePath: string, content: string): string {
  const fullPath = path.join(dir, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  return fullPath;
}

// ---------------------------------------------------------------------------
// computeRemediations
// ---------------------------------------------------------------------------

describe('computeRemediations', () => {
  it('empty findings produces empty plan', () => {
    const plan = computeRemediations([]);
    assert.equal(plan.auto.length, 0);
    assert.equal(plan.suggested.length, 0);
    assert.equal(plan.skipped.length, 0);
  });

  it('findings without fixable go to skipped', () => {
    const finding: Finding = {
      path: 'test.json',
      severity: 'error',
      category: 'validation-error',
      message: 'test',
      suggestion: 'fix it',
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.skipped.length, 1);
    assert.equal(plan.auto.length, 0);
  });

  it('sync-out-of-date with auto + valid context produces json2md action', () => {
    const finding: Finding = {
      path: 'skills/_claude/SKILL.json',
      severity: 'warning',
      category: 'sync-out-of-date',
      message: 'JSON and Markdown are out of sync',
      suggestion: 'Run gobbi docs json2md',
      fixable: 'auto',
      context: { jsonPath: '/tmp/test/skills/_claude/SKILL.json' },
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.auto.length, 1);
    assert.equal(plan.auto[0]!.action, 'json2md');
  });

  it('bidirectional-consistency with auto + valid context produces add-nav-entry', () => {
    const finding: Finding = {
      path: 'skills/_claude/gotchas.json',
      severity: 'warning',
      category: 'bidirectional-consistency',
      message: 'test',
      suggestion: 'fix it',
      fixable: 'auto',
      context: {
        parentJsonPath: '/tmp/test/skills/_claude/SKILL.json',
        childTitle: 'Gotcha: _claude',
        childNavKey: 'skills/_claude/gotchas.md',
      },
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.auto.length, 1);
    assert.equal(plan.auto[0]!.action, 'add-nav-entry');
  });

  it('naming-mismatch with auto + valid context produces rename-frontmatter', () => {
    const finding: Finding = {
      path: 'skills/gobbi/SKILL.md',
      severity: 'warning',
      category: 'naming-mismatch',
      message: 'test',
      suggestion: 'fix it',
      fixable: 'auto',
      context: { jsonPath: '/tmp/test/skills/gobbi/SKILL.json', dirName: 'gobbi' },
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.auto.length, 1);
    assert.equal(plan.auto[0]!.action, 'rename-frontmatter');
  });

  it('suggested findings go to suggested array', () => {
    const finding: Finding = {
      path: 'test.md',
      severity: 'warning',
      category: 'stale-reference',
      message: 'broken ref',
      suggestion: 'Check if renamed',
      fixable: 'suggested',
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.suggested.length, 1);
    assert.equal(plan.auto.length, 0);
  });

  it('manual findings go to skipped', () => {
    const finding: Finding = {
      path: 'test.json',
      severity: 'error',
      category: 'validation-error',
      message: 'test',
      suggestion: 'fix it',
      fixable: 'manual',
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.skipped.length, 1);
  });

  it('auto finding missing required context demotes to skipped', () => {
    const finding: Finding = {
      path: 'test.json',
      severity: 'warning',
      category: 'sync-out-of-date',
      message: 'out of sync',
      suggestion: 'run json2md',
      fixable: 'auto',
      // No context — should demote to skipped
    };
    const plan = computeRemediations([finding]);
    assert.equal(plan.skipped.length, 1);
    assert.equal(plan.auto.length, 0);
  });
});

// ---------------------------------------------------------------------------
// applyRemediation
// ---------------------------------------------------------------------------

describe('applyRemediation', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = createTempDir();
  });

  afterEach(() => {
    removeTempDir(tmpDir);
  });

  it('json2md: regenerates .md from .json', async () => {
    // Create a minimal skill JSON
    const jsonContent = JSON.stringify(
      {
        $schema: 'gobbi-docs/skill',
        title: 'Test Skill',
        frontmatter: { name: 'test', description: 'A test skill' },
        navigation: {},
      },
      null,
      2,
    );
    const jsonPath = createFile(tmpDir, 'SKILL.json', jsonContent);
    // Create an out-of-date .md
    createFile(tmpDir, 'SKILL.md', 'old content');

    const remediation: Remediation = {
      action: 'json2md',
      finding: {
        path: 'SKILL.json',
        severity: 'warning',
        category: 'sync-out-of-date',
        message: 'out of sync',
        suggestion: 'run json2md',
        fixable: 'auto',
        context: { jsonPath },
      },
      description: 'Regenerate SKILL.md from SKILL.json',
      targetPath: jsonPath.replace(/\.json$/, '.md'),
    };

    const result = await applyRemediation(remediation);
    assert.equal(result.success, true);

    // Verify .md was regenerated
    const mdContent = fs.readFileSync(jsonPath.replace(/\.json$/, '.md'), 'utf8');
    assert.ok(mdContent.includes('# Test Skill'));
    assert.ok(!mdContent.includes('old content'));
  });

  it('add-nav-entry: adds navigation to parent JSON and regenerates .md', async () => {
    // Create parent SKILL.json without child nav
    const parentJson = JSON.stringify(
      {
        $schema: 'gobbi-docs/skill',
        title: 'Parent Skill',
        frontmatter: { name: 'parent', description: 'Parent' },
        navigation: {},
      },
      null,
      2,
    );
    const parentJsonPath = createFile(tmpDir, 'skills/parent/SKILL.json', parentJson);
    createFile(tmpDir, 'skills/parent/SKILL.md', 'old');

    const remediation: Remediation = {
      action: 'add-nav-entry',
      finding: {
        path: 'skills/parent/gotchas.json',
        severity: 'warning',
        category: 'bidirectional-consistency',
        message: 'test',
        suggestion: 'add nav',
        fixable: 'auto',
        context: {
          parentJsonPath,
          childTitle: 'Gotchas: parent',
          childNavKey: 'skills/parent/gotchas.md',
        },
      },
      description: 'Add nav entry',
      targetPath: parentJsonPath,
    };

    const result = await applyRemediation(remediation);
    assert.equal(result.success, true);

    // Verify parent JSON has new nav entry
    const updatedJson = JSON.parse(fs.readFileSync(parentJsonPath, 'utf8'));
    assert.equal(updatedJson.navigation['skills/parent/gotchas.md'], 'Gotchas: parent');

    // Verify .md was regenerated
    const mdContent = fs.readFileSync(parentJsonPath.replace(/\.json$/, '.md'), 'utf8');
    assert.ok(mdContent.includes('Gotchas: parent'));
  });

  it('rename-frontmatter: updates name in JSON and regenerates .md', async () => {
    const jsonContent = JSON.stringify(
      {
        $schema: 'gobbi-docs/skill',
        title: 'My Skill',
        frontmatter: { name: 'wrong-name', description: 'A skill' },
        navigation: {},
      },
      null,
      2,
    );
    const jsonPath = createFile(tmpDir, 'skills/correct-name/SKILL.json', jsonContent);
    createFile(tmpDir, 'skills/correct-name/SKILL.md', 'old');

    const remediation: Remediation = {
      action: 'rename-frontmatter',
      finding: {
        path: 'skills/correct-name/SKILL.md',
        severity: 'warning',
        category: 'naming-mismatch',
        message: 'name mismatch',
        suggestion: 'update name',
        fixable: 'auto',
        context: { jsonPath, dirName: 'correct-name' },
      },
      description: 'Rename frontmatter',
      targetPath: jsonPath,
    };

    const result = await applyRemediation(remediation);
    assert.equal(result.success, true);

    // Verify JSON frontmatter was updated
    const updatedJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    assert.equal(updatedJson.frontmatter.name, 'correct-name');

    // Verify .md was regenerated with new name
    const mdContent = fs.readFileSync(jsonPath.replace(/\.json$/, '.md'), 'utf8');
    assert.ok(mdContent.includes('correct-name'));
  });

  it('returns failure for non-existent file', async () => {
    const remediation: Remediation = {
      action: 'json2md',
      finding: {
        path: 'nonexistent.json',
        severity: 'warning',
        category: 'sync-out-of-date',
        message: 'test',
        suggestion: 'test',
        fixable: 'auto',
        context: { jsonPath: path.join(tmpDir, 'nonexistent.json') },
      },
      description: 'Should fail',
      targetPath: path.join(tmpDir, 'nonexistent.md'),
    };

    const result = await applyRemediation(remediation);
    assert.equal(result.success, false);
    assert.ok(result.error !== undefined);
  });
});
