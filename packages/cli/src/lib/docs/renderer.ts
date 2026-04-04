/**
 * gobbi-docs JSON to Markdown renderer.
 *
 * Follows the rendering rules from the gobbi-docs spec exactly:
 * - Frontmatter as YAML between `---` markers
 * - `# {title}` for H1
 * - Navigation as **Navigate deeper from here:** table
 * - `---` between sections
 * - Block types render per spec
 * - Gotcha type renders entries with `---` separators
 */

import path from 'path';

import type {
  GobbiDoc,
  ContentBlock,
  Section,
  Navigation,
  GotchaEntry,
  GotchaMetadata,
  GotchaBody,
  SkillFrontmatter,
  AgentFrontmatter,
  RuleFrontmatter,
} from './types.js';

// ---------------------------------------------------------------------------
// Main Renderer
// ---------------------------------------------------------------------------

/**
 * Render a GobbiDoc to Markdown string.
 */
export function renderDoc(doc: GobbiDoc, jsonFilePath?: string): string {
  const parts: string[] = [];

  // 1. Frontmatter
  const frontmatterMd = renderFrontmatter(doc);
  if (frontmatterMd !== null) {
    parts.push(frontmatterMd);
  }

  // 2. Title
  parts.push(`# ${doc.title}`);

  // 3. Opening
  if (doc.opening !== undefined) {
    parts.push('');
    parts.push(doc.opening);
  }

  // 4. Navigation
  if (doc.navigation !== undefined) {
    parts.push('');
    parts.push(renderNavigation(doc.navigation, jsonFilePath));
  }

  // 5. Sections or Entries
  if (doc.$schema === 'gobbi-docs/gotcha') {
    // Gotcha entries
    for (const entry of doc.entries) {
      parts.push('');
      parts.push('---');
      parts.push('');
      parts.push(renderGotchaEntry(entry));
    }
  } else {
    // Regular sections
    const sections = doc.sections;
    if (sections !== undefined && sections.length > 0) {
      for (const section of sections) {
        parts.push('');
        parts.push('---');
        parts.push('');
        parts.push(renderSection(section));
      }
    }
  }

  return parts.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

function renderFrontmatter(doc: GobbiDoc): string | null {
  switch (doc.$schema) {
    case 'gobbi-docs/skill':
      return renderSkillFrontmatter(doc.frontmatter);
    case 'gobbi-docs/agent':
      return renderAgentFrontmatter(doc.frontmatter);
    case 'gobbi-docs/rule': {
      if (doc.frontmatter !== undefined) {
        return renderRuleFrontmatter(doc.frontmatter);
      }
      return null;
    }
    case 'gobbi-docs/root':
    case 'gobbi-docs/child':
    case 'gobbi-docs/gotcha':
      return null;
  }
}

function renderSkillFrontmatter(fm: SkillFrontmatter): string {
  const lines: string[] = ['---'];
  lines.push(`name: ${fm.name}`);
  lines.push(`description: ${fm.description}`);
  if (fm['allowed-tools'] !== undefined) {
    lines.push(`allowed-tools: ${fm['allowed-tools']}`);
  }
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function renderAgentFrontmatter(fm: AgentFrontmatter): string {
  const lines: string[] = ['---'];
  lines.push(`name: ${fm.name}`);
  lines.push(`description: ${fm.description}`);
  lines.push(`tools: ${fm.tools}`);
  lines.push(`model: ${fm.model}`);
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

function renderRuleFrontmatter(fm: RuleFrontmatter): string {
  const entries = Object.entries(fm);
  if (entries.length === 0) return '';
  const lines: string[] = ['---'];
  for (const [key, value] of entries) {
    lines.push(`${key}: ${value}`);
  }
  lines.push('---');
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function renderNavigation(nav: Navigation, jsonFilePath?: string): string {
  const entries = Object.entries(nav);
  if (entries.length === 0) return '';

  // Compute the directory of the output file relative to .claude/
  // so we can convert .claude/-relative nav paths to file-relative links
  let outputDirFromClaude: string | undefined;
  if (jsonFilePath !== undefined) {
    const normalized = jsonFilePath.replace(/\\/g, '/');
    const claudeIdx = normalized.indexOf('.claude/');
    if (claudeIdx !== -1) {
      outputDirFromClaude = path.posix.dirname(normalized.slice(claudeIdx + '.claude/'.length));
    }
  }

  const lines: string[] = [];
  lines.push('**Navigate deeper from here:**');
  lines.push('');
  lines.push('| Document | Covers |');
  lines.push('|----------|--------|');
  for (const [file, description] of entries) {
    let linkPath = file;
    if (outputDirFromClaude !== undefined) {
      linkPath = path.posix.relative(outputDirFromClaude, file);
    }
    const displayName = linkPath.split('/').pop() ?? linkPath;
    lines.push(`| [${displayName}](${linkPath}) | ${description} |`);
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export function renderSection(section: Section): string {
  const parts: string[] = [];

  if (section.heading !== null) {
    parts.push(`## ${section.heading}`);
  }

  for (const block of section.content) {
    parts.push('');
    parts.push(renderBlock(block));
  }

  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Content Blocks
// ---------------------------------------------------------------------------

export function renderBlock(block: ContentBlock): string {
  switch (block.type) {
    case 'text':
      return block.value;
    case 'principle':
      return renderPrinciple(block.statement, block.body);
    case 'table':
      return renderTable(block.headers, block.rows);
    case 'constraint-list':
      return renderConstraintList(block.items);
    case 'list':
      return renderList(block.style, block.items);
    case 'subsection':
      return renderSubsection(block.heading, block.content);
  }
}

function renderPrinciple(statement: string, body: string | undefined): string {
  const parts: string[] = [`> **${statement}**`];
  if (body !== undefined) {
    parts.push('');
    parts.push(body);
  }
  return parts.join('\n');
}

function renderTable(headers: string[], rows: string[][]): string {
  const lines: string[] = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`|${headers.map(() => '---').join('|')}|`);
  for (const row of rows) {
    lines.push(`| ${row.join(' | ')} |`);
  }
  return lines.join('\n');
}

function renderConstraintList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function renderList(style: 'bullet' | 'numbered', items: string[]): string {
  if (style === 'numbered') {
    return items.map((item, i) => `${i + 1}. ${item}`).join('\n');
  }
  return items.map((item) => `- ${item}`).join('\n');
}

function renderSubsection(heading: string, content: ContentBlock[]): string {
  const parts: string[] = [`### ${heading}`];
  for (const block of content) {
    parts.push('');
    parts.push(renderBlock(block));
  }
  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Gotcha Entries
// ---------------------------------------------------------------------------

function renderGotchaEntry(entry: GotchaEntry): string {
  const parts: string[] = [];

  // Title
  parts.push(`### ${entry.title}`);

  // Optional metadata (YAML between --- markers)
  if (entry.metadata !== undefined && entry.metadata !== null) {
    parts.push('---');
    parts.push(renderGotchaMetadata(entry.metadata));
    parts.push('---');
  }

  // Body
  parts.push('');
  parts.push(renderGotchaBody(entry.body));

  return parts.join('\n');
}

function renderGotchaMetadata(meta: GotchaMetadata): string {
  const lines: string[] = [];
  if (meta.priority !== undefined) {
    lines.push(`priority: ${meta.priority}`);
  }
  if (meta['tech-stack'] !== undefined) {
    lines.push(`tech-stack: ${meta['tech-stack']}`);
  }
  if (meta.enforcement !== undefined) {
    lines.push(`enforcement: ${meta.enforcement}`);
  }
  if (meta.pattern !== undefined) {
    lines.push(`pattern: ${JSON.stringify(meta.pattern)}`);
  }
  if (meta.event !== undefined) {
    lines.push(`event: ${meta.event}`);
  }
  return lines.join('\n');
}

function renderGotchaBody(body: GotchaBody): string {
  const lines: string[] = [];
  lines.push(`**Priority:** ${body.priority}`);
  lines.push('');
  lines.push(`**What happened:** ${body['what-happened']}`);
  lines.push('');
  lines.push(`**User feedback:** ${body['user-feedback']}`);
  lines.push('');
  lines.push(`**Correct approach:** ${body['correct-approach']}`);
  return lines.join('\n');
}
