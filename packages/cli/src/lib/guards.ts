/**
 * Shared type guard utilities for runtime narrowing of `unknown` values.
 *
 * These guards are used across lib and command modules to safely narrow
 * parsed JSON, env vars, and other external data without `as` casts.
 */

/** Narrow `unknown` to a plain object (not null, not an array). */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Narrow `unknown` to `string`. */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** Narrow `unknown` to `number`. */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/** Narrow `unknown` to `boolean`. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/** Narrow `unknown` to `unknown[]`. */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
