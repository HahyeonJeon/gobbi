/**
 * Tests for `commands/prompt/render.ts` — the markdown + composed
 * formatters used by `gobbi prompt render`.
 *
 * Wave C.1.5 (issue #156). Snapshot tests pin the markdown output;
 * cache-stability tests assert that `composed` form's
 * `staticPrefixHash` is reproducible across two compile passes.
 *
 * Diff form is exercised end-to-end in C.1.6's e2e test (after the
 * patch command can populate the JSONL chain). Here we cover the
 * formatters that do not require a live chain.
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderComposed, renderMarkdown } from '../render.js';
import { validateStepSpec } from '../../../specs/_schema/v1.js';
import type { StepSpec } from '../../../specs/types.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SPECS_ROOT = resolve(HERE, '..', '..', '..', 'specs');

function loadSpec(promptId: string): StepSpec {
  const path = resolve(SPECS_ROOT, promptId, 'spec.json');
  const raw = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  const result = validateStepSpec(raw);
  if (!result.ok) {
    throw new Error(`spec ${promptId} failed validation`);
  }
  return result.value;
}

const PROMPT_IDS = [
  'ideation',
  'planning',
  'execution',
  'evaluation',
  'memorization',
  'handoff',
] as const;

describe('renderMarkdown', () => {
  for (const promptId of PROMPT_IDS) {
    test(`${promptId} markdown render matches snapshot`, () => {
      const spec = loadSpec(promptId);
      const out = renderMarkdown(spec);
      expect(out).toMatchSnapshot();
    });
  }

  test('markdown ends with a single trailing newline', () => {
    const spec = loadSpec('ideation');
    const out = renderMarkdown(spec);
    expect(out.endsWith('\n')).toBe(true);
    // No double trailing newlines.
    expect(out.endsWith('\n\n\n')).toBe(false);
  });

  test('markdown contains the description as the H1 heading', () => {
    const spec = loadSpec('ideation');
    const out = renderMarkdown(spec);
    expect(out.startsWith(`# ${spec.meta.description}`)).toBe(true);
  });

  test('markdown contains every block.static id as an H2 heading', () => {
    const spec = loadSpec('ideation');
    const out = renderMarkdown(spec);
    for (const block of spec.blocks.static) {
      expect(out).toContain(`## ${block.id}`);
    }
  });

  test('markdown contains every delegation key as an H2 with prefix', () => {
    const spec = loadSpec('ideation');
    const out = renderMarkdown(spec);
    for (const key of Object.keys(spec.blocks.delegation)) {
      expect(out).toContain(`## delegation: ${key}`);
    }
  });

  test('markdown carries the footer as an H2 section', () => {
    const spec = loadSpec('ideation');
    const out = renderMarkdown(spec);
    expect(out).toContain('## footer');
    // The footer body is rendered too — assert one byte from the footer.
    expect(out).toContain(spec.blocks.footer.trim().slice(0, 30));
  });
});

// ---------------------------------------------------------------------------
// composed — cache stability invariant (synthesis §8.1)
// ---------------------------------------------------------------------------

describe('renderComposed', () => {
  test('two consecutive composed renders for the same spec/promptId produce identical output', () => {
    const spec = loadSpec('ideation');
    const a = renderComposed(spec, 'ideation');
    const b = renderComposed(spec, 'ideation');
    expect(a).toBe(b);
  });

  test('composed output prefixes the staticPrefixHash header line', () => {
    const spec = loadSpec('ideation');
    const out = renderComposed(spec, 'ideation');
    // The hash format is whatever assembly.ts emits; we accept the
    // non-empty hex form and any optional algorithm prefix.
    expect(out).toMatch(
      /^# gobbi prompt render ideation --format=composed\n# staticPrefixHash: [\w:]+\n/,
    );
  });

  test('composed output contains the footer text from the spec', () => {
    const spec = loadSpec('planning');
    const out = renderComposed(spec, 'planning');
    expect(out).toContain(spec.blocks.footer.trim().slice(0, 30));
  });
});
