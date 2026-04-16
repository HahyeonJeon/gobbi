/**
 * Workflow graph loader — reads `specs/index.json` into a typed graph for
 * dead-step and cycle detection in `gobbi workflow validate`.
 *
 * Skeleton file — A.10 populates this module with the scaffold loader and
 * graph traversal helpers.
 */

export const __todoGraph: unique symbol = Symbol('todo.graph');
