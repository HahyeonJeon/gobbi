/**
 * Prompt renderer — takes a PromptTemplate and ResolvedVariables,
 * produces formatted plain text or markdown output.
 *
 * Supports two output formats:
 * - Plain text (default): structured with `---` delimiters and bracket headers
 * - Markdown: uses heading levels, tables, and inline code formatting
 *
 * Emits a stderr warning if the rendered output exceeds 200 lines.
 */

import type { PromptTemplate, PromptLayer, AskUserQuestion, Completion, Transitions } from './types.js';
import type { ResolvedVariables } from './variables.js';
import { interpolate } from './variables.js';

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface RenderOptions {
  markdown: boolean;
}

// ---------------------------------------------------------------------------
// Line Limit
// ---------------------------------------------------------------------------

const LINE_LIMIT = 200;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Render a prompt template with resolved variables into formatted output.
 *
 * @param template - The prompt template to render
 * @param resolved - Map of variable name to resolved string value
 * @param options  - Rendering options (markdown vs plain text)
 * @returns Formatted prompt string
 */
export function renderPrompt(
  template: PromptTemplate,
  resolved: ResolvedVariables,
  options: RenderOptions,
): string {
  const output = options.markdown
    ? renderMarkdown(template, resolved)
    : renderPlainText(template, resolved);

  const lineCount = countLines(output);
  if (lineCount > LINE_LIMIT) {
    console.error(`Warning: rendered prompt exceeds 200 lines (${lineCount} lines)`);
  }

  return output;
}

// ---------------------------------------------------------------------------
// Plain Text Renderer
// ---------------------------------------------------------------------------

function renderPlainText(template: PromptTemplate, resolved: ResolvedVariables): string {
  const sections: string[] = [];

  // Phase header
  sections.push(`[PHASE: ${template.phase}]`);

  // Layers
  for (const layer of template.layers) {
    sections.push(renderPlainLayer(layer, resolved));
  }

  // Ask User
  if (template.askUser !== undefined && template.askUser.length > 0) {
    sections.push(renderPlainAskUser(template.askUser));
  }

  // Completion
  sections.push(renderPlainCompletion(template.completion));

  // Transitions
  sections.push(renderPlainTransitions(template.transitions));

  return sections.join('\n\n') + '\n';
}

function renderPlainLayer(layer: PromptLayer, resolved: ResolvedVariables): string {
  const label = layer.role.toUpperCase();
  const content = interpolate(layer.content, resolved);
  return `--- ${label} ---\n${content}`;
}

function renderPlainAskUser(questions: AskUserQuestion[]): string {
  const lines: string[] = ['[ASK USER]'];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (q === undefined) continue;

    const num = i + 1;
    const multiTag = q.multiSelect === true ? ' [multi-select]' : '';
    lines.push(`Q${num}: ${q.question}${multiTag}`);

    for (let j = 0; j < q.options.length; j++) {
      const opt = q.options[j];
      if (opt === undefined) continue;

      const letter = String.fromCharCode(97 + j); // a, b, c, d...
      const desc = opt.description !== undefined ? ` \u2014 ${opt.description}` : '';
      lines.push(`  ${letter}) ${opt.label}${desc}`);
    }

    // Blank line between questions, but not after the last one
    if (i < questions.length - 1) {
      lines.push('');
    }
  }

  return lines.join('\n');
}

function renderPlainCompletion(completion: Completion): string {
  const lines: string[] = ['[COMPLETION: select one outcome]'];

  for (const outcome of completion.outcomes) {
    const desc = outcome.description !== undefined ? `: ${outcome.description}` : '';
    lines.push(`  - ${outcome.id}${desc}`);
  }

  return lines.join('\n');
}

function renderPlainTransitions(transitions: Transitions): string {
  const lines: string[] = ['[NEXT STEPS]'];

  if (transitions.choices.length > 0) {
    lines.push('Conditions:');
    for (const choice of transitions.choices) {
      lines.push(`  If ${choice.condition.variable} equals "${choice.condition.equals}" \u2192 run: gobbi prompt ${choice.next}`);
    }
  }

  lines.push(`Default: run gobbi prompt ${transitions.default}`);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Markdown Renderer
// ---------------------------------------------------------------------------

function renderMarkdown(template: PromptTemplate, resolved: ResolvedVariables): string {
  const sections: string[] = [];

  // Phase header
  sections.push(`# Phase: ${template.phase}`);

  // Layers
  for (const layer of template.layers) {
    sections.push(renderMarkdownLayer(layer, resolved));
  }

  // Ask User
  if (template.askUser !== undefined && template.askUser.length > 0) {
    sections.push(renderMarkdownAskUser(template.askUser));
  }

  // Completion
  sections.push(renderMarkdownCompletion(template.completion));

  // Transitions
  sections.push(renderMarkdownTransitions(template.transitions));

  return sections.join('\n\n') + '\n';
}

function renderMarkdownLayer(layer: PromptLayer, resolved: ResolvedVariables): string {
  const label = layer.role.charAt(0).toUpperCase() + layer.role.slice(1);
  const content = interpolate(layer.content, resolved);
  return `## ${label}\n${content}`;
}

function renderMarkdownAskUser(questions: AskUserQuestion[]): string {
  const lines: string[] = ['## Ask User'];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (q === undefined) continue;

    const num = i + 1;
    const multiTag = q.multiSelect === true ? ' [multi-select]' : '';
    lines.push(`### Q${num}: ${q.question}${multiTag}`);
    lines.push('| Option | Description |');
    lines.push('|--------|-------------|');

    for (const opt of q.options) {
      const desc = opt.description !== undefined ? opt.description : '';
      lines.push(`| ${opt.label} | ${desc} |`);
    }
  }

  return lines.join('\n');
}

function renderMarkdownCompletion(completion: Completion): string {
  const lines: string[] = [
    '## Completion',
    'Select one outcome:',
    '| Outcome | Description |',
    '|---------|-------------|',
  ];

  for (const outcome of completion.outcomes) {
    const desc = outcome.description !== undefined ? outcome.description : '';
    lines.push(`| ${outcome.id} | ${desc} |`);
  }

  return lines.join('\n');
}

function renderMarkdownTransitions(transitions: Transitions): string {
  const lines: string[] = ['## Next Steps'];

  for (const choice of transitions.choices) {
    lines.push(`- If \`${choice.condition.variable}\` equals \`"${choice.condition.equals}"\` \u2192 \`gobbi prompt ${choice.next}\``);
  }

  lines.push(`- Default: \`gobbi prompt ${transitions.default}\``);

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function countLines(text: string): number {
  if (text.length === 0) return 0;
  let count = 1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') count++;
  }
  return count;
}
