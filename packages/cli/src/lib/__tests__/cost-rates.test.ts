/**
 * Unit tests for `lib/cost-rates.ts` — per-model token rate table,
 * `derivedCost`, and `proxyCost`.
 *
 * Coverage:
 *   - Known model (opus-4-7) with full 4-field usage → correct total.
 *   - Unknown model → 0 (safe fallback).
 *   - Null/undefined tokensUsed → 0.
 *   - Partial usage shapes (input only, output+cacheCreation only).
 *   - Zero usage fields → 0.
 *   - Negative usage fields clamp to 0 (never produce negative cost).
 *   - Non-object tokensUsed (number, array, boolean) → 0.
 *   - JSON-string form of tokensUsed is parsed by derivedCost.
 *   - proxyCost: positive bytes → linear dollar amount.
 *   - proxyCost: non-number / non-positive → 0.
 *   - MODEL_RATES contains the 5 required entries.
 */

import { describe, expect, test } from 'bun:test';

import {
  derivedCost,
  MODEL_RATES,
  PROXY_DOLLARS_PER_BYTE,
  proxyCost,
} from '../cost-rates.js';

// ===========================================================================
// MODEL_RATES — table completeness
// ===========================================================================

describe('MODEL_RATES', () => {
  test('contains the five required Anthropic model ids', () => {
    expect(MODEL_RATES['claude-opus-4-6']).toBeDefined();
    expect(MODEL_RATES['claude-opus-4-7']).toBeDefined();
    expect(MODEL_RATES['claude-sonnet-4-5']).toBeDefined();
    expect(MODEL_RATES['claude-sonnet-4-6']).toBeDefined();
    expect(MODEL_RATES['claude-haiku-4-5-20251001']).toBeDefined();
  });

  test('cache-read rate is ~10% of input rate per the Anthropic pricing model', () => {
    for (const rate of Object.values(MODEL_RATES)) {
      expect(rate.cacheReadPerMillion).toBeCloseTo(rate.inputPerMillion * 0.1, 6);
    }
  });

  test('cache-creation rate is ~1.25x input rate per the 5-min ephemeral bucket', () => {
    for (const rate of Object.values(MODEL_RATES)) {
      expect(rate.cacheCreationPerMillion).toBeCloseTo(
        rate.inputPerMillion * 1.25,
        6,
      );
    }
  });
});

// ===========================================================================
// derivedCost — happy path
// ===========================================================================

describe('derivedCost — known model with full usage', () => {
  test('opus-4-7 with full 4-field usage → exact math', () => {
    // Opus 4-7 rates: input=5, output=25, cacheRead=0.5, cacheCreate=6.25
    const usage = {
      input_tokens: 100_000,
      output_tokens: 50_000,
      cache_read_input_tokens: 200_000,
      cache_creation_input_tokens: 20_000,
    };
    const expected =
      (100_000 / 1_000_000) * 5 +
      (50_000 / 1_000_000) * 25 +
      (200_000 / 1_000_000) * 0.5 +
      (20_000 / 1_000_000) * 6.25;
    expect(derivedCost(usage, 'claude-opus-4-7')).toBeCloseTo(expected, 6);
  });

  test('sonnet-4-5 with input+output only → sum of two terms', () => {
    // Sonnet 4-5 rates: input=3, output=15
    const usage = {
      input_tokens: 1_000_000,
      output_tokens: 250_000,
    };
    const expected = 3 + (250_000 / 1_000_000) * 15;
    expect(derivedCost(usage, 'claude-sonnet-4-5')).toBeCloseTo(expected, 6);
  });

  test('haiku with cacheCreation only → single-term dollar amount', () => {
    // Haiku rates: cacheCreation=1.25
    const usage = { cache_creation_input_tokens: 800_000 };
    const expected = (800_000 / 1_000_000) * 1.25;
    expect(derivedCost(usage, 'claude-haiku-4-5-20251001')).toBeCloseTo(
      expected,
      6,
    );
  });

  test('json-string form is parsed identically to the object form', () => {
    const usage = {
      input_tokens: 12_345,
      output_tokens: 6_789,
      cache_read_input_tokens: 0,
      cache_creation_input_tokens: 0,
    };
    const objectCost = derivedCost(usage, 'claude-opus-4-6');
    const stringCost = derivedCost(JSON.stringify(usage), 'claude-opus-4-6');
    expect(stringCost).toBeCloseTo(objectCost, 6);
    expect(stringCost).toBeGreaterThan(0);
  });
});

// ===========================================================================
// derivedCost — safe fallbacks
// ===========================================================================

describe('derivedCost — defensive 0 returns', () => {
  test('unknown model → 0', () => {
    const usage = { input_tokens: 1_000_000, output_tokens: 0 };
    expect(derivedCost(usage, 'claude-martian-9-99')).toBe(0);
  });

  test('non-string model → 0', () => {
    const usage = { input_tokens: 1_000_000 };
    expect(derivedCost(usage, 42)).toBe(0);
    expect(derivedCost(usage, null)).toBe(0);
    expect(derivedCost(usage, undefined)).toBe(0);
  });

  test('null / undefined tokensUsed → 0', () => {
    expect(derivedCost(null, 'claude-opus-4-7')).toBe(0);
    expect(derivedCost(undefined, 'claude-opus-4-7')).toBe(0);
  });

  test('all-zero usage fields → 0', () => {
    const usage = {
      input_tokens: 0,
      output_tokens: 0,
      cache_read_input_tokens: 0,
      cache_creation_input_tokens: 0,
    };
    expect(derivedCost(usage, 'claude-opus-4-7')).toBe(0);
  });

  test('negative usage fields clamp to 0 (never negative credit)', () => {
    const usage = {
      input_tokens: -100_000,
      output_tokens: -50_000,
      cache_read_input_tokens: -1_000,
      cache_creation_input_tokens: -200,
    };
    expect(derivedCost(usage, 'claude-opus-4-7')).toBe(0);
  });

  test('non-object tokensUsed (number, boolean, array) → 0', () => {
    expect(derivedCost(42, 'claude-opus-4-7')).toBe(0);
    expect(derivedCost(true, 'claude-opus-4-7')).toBe(0);
    expect(derivedCost([1, 2, 3], 'claude-opus-4-7')).toBe(0);
  });

  test('malformed json-string tokensUsed → 0', () => {
    expect(derivedCost('{not valid json', 'claude-opus-4-7')).toBe(0);
  });

  test('object with no recognised usage fields → 0', () => {
    expect(derivedCost({ unrelated: 'shape' }, 'claude-opus-4-7')).toBe(0);
  });

  test('partial usage with negative + valid mixed → only valid fields contribute', () => {
    // input -100 clamps to 0; output 200_000 at opus rate 25/M = 0.005
    const usage = { input_tokens: -100, output_tokens: 200_000 };
    const expected = (200_000 / 1_000_000) * 25;
    expect(derivedCost(usage, 'claude-opus-4-7')).toBeCloseTo(expected, 6);
  });

  test('NaN / Infinity usage fields clamp to 0', () => {
    const usage = {
      input_tokens: Number.NaN,
      output_tokens: Number.POSITIVE_INFINITY,
    };
    expect(derivedCost(usage, 'claude-opus-4-7')).toBe(0);
  });
});

// ===========================================================================
// proxyCost — byte-proxy fallback
// ===========================================================================

describe('proxyCost', () => {
  test('positive bytes → bytes * PROXY_DOLLARS_PER_BYTE', () => {
    const bytes = 100_000;
    expect(proxyCost(bytes)).toBeCloseTo(bytes * PROXY_DOLLARS_PER_BYTE, 12);
  });

  test('zero bytes → 0', () => {
    expect(proxyCost(0)).toBe(0);
  });

  test('negative bytes → 0 (defensive, no negative credit)', () => {
    expect(proxyCost(-1_000)).toBe(0);
  });

  test('non-number input → 0', () => {
    expect(proxyCost('1000')).toBe(0);
    expect(proxyCost(null)).toBe(0);
    expect(proxyCost(undefined)).toBe(0);
    expect(proxyCost({})).toBe(0);
  });

  test('Infinity / NaN → 0', () => {
    expect(proxyCost(Number.POSITIVE_INFINITY)).toBe(0);
    expect(proxyCost(Number.NaN)).toBe(0);
  });

  test('PROXY_DOLLARS_PER_BYTE equals 25/1e6/4 — conservative opus-output ceiling', () => {
    expect(PROXY_DOLLARS_PER_BYTE).toBeCloseTo(25 / 1_000_000 / 4, 12);
  });
});
