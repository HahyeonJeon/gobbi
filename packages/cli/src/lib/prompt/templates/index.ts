/**
 * Prompt template registry.
 *
 * Maps prompt phase names to their template definitions. New templates
 * are registered here as they are implemented across v0.5.x releases.
 */

import type { PromptPhase, PromptTemplate } from '../types.js';
import { SESSION_START_TEMPLATE } from './session-start.js';
import { WORKFLOW_START_TEMPLATE } from './workflow-start.js';

/**
 * Look up the prompt template for a given phase.
 * Returns undefined if the phase has no template registered yet.
 */
export function getTemplate(phase: PromptPhase): PromptTemplate | undefined {
  switch (phase) {
    case 'session-start': return SESSION_START_TEMPLATE;
    case 'workflow-start': return WORKFLOW_START_TEMPLATE;
    default: return undefined;
  }
}
