/**
 * gobbi-docs Markdown to JSON migrator.
 *
 * Parses existing `.claude/` Markdown files and produces their JSON template
 * equivalent conforming to the gobbi-docs spec. This is the inverse of
 * renderer.ts — designed for one-time migration of the 77 existing docs.
 *
 * Detection logic:
 * - agents/*.md      → agent
 * - rules/*.md       → rule
 * - README.md        → root
 * - SKILL.md         → skill
 * - gotchas.md / _gotcha/__*.md → gotcha
 * - Everything else  → child
 *
 * Parsing order: frontmatter → title → opening → navigation → sections/entries
 */

import path from 'path';

import type {
  GobbiDoc,
  DocType,
  ContentBlock,
  Section,
  Navigation,
  GotchaEntry,
  GotchaMetadata,
  GotchaBody,
  SkillFrontmatter,
  AgentFrontmatter,
  RuleFrontmatter,
  SkillDoc,
  AgentDoc,
  RuleDoc,
  RootDoc,
  ChildDoc,
  GotchaDoc,
  TextBlock,
  PrincipleBlock,
  TableBlock,
  ConstraintListBlock,
  ListBlock,
  SubsectionBlock,
} from './types.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse a Markdown file into a GobbiDoc JSON template.
 *
 * @param markdown - Raw Markdown content
 * @param filePath - Path to the file (used to detect doc type and parent)
 * @returns Parsed GobbiDoc
 */
export function parseMarkdown(markdown: string, filePath: string): GobbiDoc {
  const docType = detectDocType(filePath);
  const lines = markdown.split('\n');

  // Remove trailing newline that renderers add
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }

  let cursor = 0;

  // 1. Parse frontmatter
  let frontmatter: SkillFrontmatter | AgentFrontmatter | RuleFrontmatter | undefined;
  if (lines[cursor] === '---') {
    const fmResult = parseFrontmatterBlock(lines, cursor);
    frontmatter = fmResult.frontmatter;
    cursor = fmResult.cursor;
  }

  // 2. Skip blank lines before title
  cursor = skipBlankLines(lines, cursor);

  // 3. Parse H1 title
  const titleLine = lines[cursor];
  if (titleLine === undefined || !titleLine.startsWith('# ')) {
    throw new Error(`Expected H1 title, got: "${titleLine ?? '(end of file)'}"`);
  }
  const title = titleLine.slice(2);
  cursor++;

  // 4. Parse opening + navigation (everything between H1 and first --- or H2)
  const openingResult = parseOpeningAndNavigation(lines, cursor);
  const opening = openingResult.opening;
  const navigation = openingResult.navigation;
  cursor = openingResult.cursor;

  // 5. Parse sections or entries
  if (docType === 'gotcha') {
    const parent = detectParent(filePath);
    const entries = parseGotchaEntries(lines, cursor);
    return buildGotchaDoc(title, parent, entries, opening, navigation);
  }

  let sections = parseSections(lines, cursor);

  // Post-process: extract navigation from sections if not found in opening
  let finalNavigation = navigation;
  if (finalNavigation === undefined) {
    const navExtraction = extractNavigationFromSections(sections);
    finalNavigation = navExtraction.navigation;
    sections = navExtraction.sections;
  }

  // Build the doc based on type
  switch (docType) {
    case 'skill':
      return buildSkillDoc(title, frontmatter as SkillFrontmatter, sections, opening, finalNavigation);
    case 'agent':
      return buildAgentDoc(title, frontmatter as AgentFrontmatter, sections, opening, finalNavigation);
    case 'rule':
      return buildRuleDoc(title, frontmatter as RuleFrontmatter | undefined, sections, opening, finalNavigation);
    case 'root':
      return buildRootDoc(title, sections, opening, finalNavigation);
    case 'child': {
      const parent = detectParent(filePath);
      return buildChildDoc(title, parent, sections, opening, finalNavigation);
    }
  }
}

// ---------------------------------------------------------------------------
// Doc Type Detection
// ---------------------------------------------------------------------------

/**
 * Detect the doc type from the file path within `.claude/`.
 */
export function detectDocType(filePath: string): DocType {
  const normalized = filePath.replace(/\\/g, '/');

  // Agent definitions: agents/*.md
  if (/\/agents\/[^/]+\.md$/.test(normalized)) {
    return 'agent';
  }

  // Rule files: rules/*.md
  if (/\/rules\/[^/]+\.md$/.test(normalized)) {
    return 'rule';
  }

  // Root README: .claude/README.md
  const basename = path.basename(normalized);
  if (basename === 'README.md') {
    return 'root';
  }

  // Skill: SKILL.md
  if (basename === 'SKILL.md') {
    return 'skill';
  }

  // Gotcha: gotchas.md OR _gotcha/__*.md
  if (basename === 'gotchas.md') {
    return 'gotcha';
  }
  if (/\/_gotcha\/__[^/]+\.md$/.test(normalized)) {
    return 'gotcha';
  }

  // Everything else is a child
  return 'child';
}

// ---------------------------------------------------------------------------
// Parent Detection
// ---------------------------------------------------------------------------

/**
 * Determine the parent skill from the file path.
 * For files in `.claude/skills/{skill-name}/`, the parent is the skill-name.
 */
function detectParent(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const match = /\/skills\/([^/]+)\//.exec(normalized);
  if (match !== null && match[1] !== undefined) {
    return match[1];
  }
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Doc Builders — typed constructors to satisfy discriminated union
// ---------------------------------------------------------------------------

function buildSkillDoc(
  title: string,
  frontmatter: SkillFrontmatter,
  sections: Section[],
  opening: string | undefined,
  navigation: Navigation | undefined,
): SkillDoc {
  const doc: SkillDoc = {
    $schema: 'gobbi-docs/skill',
    frontmatter,
    title,
  };
  if (opening !== undefined) {
    doc.opening = opening;
  }
  if (navigation !== undefined) {
    doc.navigation = navigation;
  }
  if (sections.length > 0) {
    doc.sections = sections;
  }
  return doc;
}

function buildAgentDoc(
  title: string,
  frontmatter: AgentFrontmatter,
  sections: Section[],
  opening: string | undefined,
  navigation: Navigation | undefined,
): AgentDoc {
  const doc: AgentDoc = {
    $schema: 'gobbi-docs/agent',
    frontmatter,
    title,
  };
  if (opening !== undefined) {
    doc.opening = opening;
  }
  if (navigation !== undefined) {
    doc.navigation = navigation;
  }
  if (sections.length > 0) {
    doc.sections = sections;
  }
  return doc;
}

function buildRuleDoc(
  title: string,
  frontmatter: RuleFrontmatter | undefined,
  sections: Section[],
  opening: string | undefined,
  navigation: Navigation | undefined,
): RuleDoc {
  const doc: RuleDoc = {
    $schema: 'gobbi-docs/rule',
    title,
  };
  if (frontmatter !== undefined) {
    doc.frontmatter = frontmatter as RuleFrontmatter;
  }
  if (opening !== undefined) {
    doc.opening = opening;
  }
  if (navigation !== undefined) {
    doc.navigation = navigation;
  }
  if (sections.length > 0) {
    doc.sections = sections;
  }
  return doc;
}

function buildRootDoc(
  title: string,
  sections: Section[],
  opening: string | undefined,
  navigation: Navigation | undefined,
): RootDoc {
  const doc: RootDoc = {
    $schema: 'gobbi-docs/root',
    title,
  };
  if (opening !== undefined) {
    doc.opening = opening;
  }
  if (navigation !== undefined) {
    doc.navigation = navigation;
  }
  if (sections.length > 0) {
    doc.sections = sections;
  }
  return doc;
}

function buildChildDoc(
  title: string,
  parent: string,
  sections: Section[],
  opening: string | undefined,
  navigation: Navigation | undefined,
): ChildDoc {
  const doc: ChildDoc = {
    $schema: 'gobbi-docs/child',
    parent,
    title,
  };
  if (opening !== undefined) {
    doc.opening = opening;
  }
  if (navigation !== undefined) {
    doc.navigation = navigation;
  }
  if (sections.length > 0) {
    doc.sections = sections;
  }
  return doc;
}

function buildGotchaDoc(
  title: string,
  parent: string,
  entries: GotchaEntry[],
  opening: string | undefined,
  navigation: Navigation | undefined,
): GotchaDoc {
  const doc: GotchaDoc = {
    $schema: 'gobbi-docs/gotcha',
    parent,
    title,
    entries,
  };
  if (opening !== undefined) {
    doc.opening = opening;
  }
  if (navigation !== undefined) {
    doc.navigation = navigation;
  }
  return doc;
}

// ---------------------------------------------------------------------------
// Frontmatter Parsing
// ---------------------------------------------------------------------------

interface FrontmatterResult {
  frontmatter: Record<string, string>;
  cursor: number;
}

function parseFrontmatterBlock(lines: string[], start: number): FrontmatterResult {
  // start is at the opening ---
  let cursor = start + 1;
  const fields: Record<string, string> = {};

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line === undefined) break;
    if (line === '---') {
      cursor++; // skip closing ---
      // Skip blank line after frontmatter
      if (cursor < lines.length && lines[cursor] === '') {
        cursor++;
      }
      return { frontmatter: fields, cursor };
    }
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      fields[key] = value;
    }
    cursor++;
  }

  return { frontmatter: fields, cursor };
}

// ---------------------------------------------------------------------------
// Opening and Navigation Parsing
// ---------------------------------------------------------------------------

interface OpeningAndNavigationResult {
  opening: string | undefined;
  navigation: Navigation | undefined;
  cursor: number;
}

function parseOpeningAndNavigation(lines: string[], start: number): OpeningAndNavigationResult {
  let cursor = start;
  let opening: string | undefined;
  let navigation: Navigation | undefined;

  // Collect all content between H1 and first --- or H2
  const contentLines: string[] = [];
  let foundSeparator = false;

  // Skip initial blank line after title
  if (cursor < lines.length && lines[cursor] === '') {
    cursor++;
  }

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line === undefined) break;

    // Stop at section separator
    if (line === '---') {
      foundSeparator = true;
      cursor++; // skip the ---
      break;
    }

    // Stop at H2
    if (line.startsWith('## ')) {
      break;
    }

    contentLines.push(line);
    cursor++;
  }

  if (contentLines.length > 0) {
    // Detect navigation table within the content
    const navResult = extractNavigation(contentLines);
    navigation = navResult.navigation;
    const remainingContent = navResult.remainingLines;

    // Trim trailing blank lines from remaining content
    while (remainingContent.length > 0 && remainingContent[remainingContent.length - 1] === '') {
      remainingContent.pop();
    }

    if (remainingContent.length > 0) {
      opening = remainingContent.join('\n');
    }
  }

  // If we haven't hit a separator yet, try to find one
  if (!foundSeparator) {
    // Skip blank lines
    cursor = skipBlankLines(lines, cursor);
    if (cursor < lines.length && lines[cursor] === '---') {
      cursor++;
    }
  }

  return { opening, navigation, cursor };
}

// ---------------------------------------------------------------------------
// Navigation Extraction
// ---------------------------------------------------------------------------

interface NavigationExtractResult {
  navigation: Navigation | undefined;
  remainingLines: string[];
}

function extractNavigation(contentLines: string[]): NavigationExtractResult {
  // Look for "**Navigate deeper from here:**" pattern
  const navHeaderIdx = contentLines.findIndex(
    (line) => line === '**Navigate deeper from here:**',
  );

  if (navHeaderIdx === -1) {
    return { navigation: undefined, remainingLines: [...contentLines] };
  }

  const navigation: Navigation = {};
  let navEnd = navHeaderIdx + 1;

  // Skip blank line after nav header
  if (navEnd < contentLines.length && contentLines[navEnd] === '') {
    navEnd++;
  }

  // Parse table header row
  const headerRow = contentLines[navEnd];
  if (headerRow !== undefined && headerRow.startsWith('|')) {
    navEnd++; // skip header row
  }
  // Parse separator row
  const sepRow = contentLines[navEnd];
  if (sepRow !== undefined && sepRow.startsWith('|')) {
    navEnd++; // skip separator row
  }

  // Parse data rows
  while (navEnd < contentLines.length) {
    const line = contentLines[navEnd];
    if (line === undefined || !line.startsWith('|')) break;

    const cells = parseTableRow(line);
    if (cells.length >= 2 && cells[0] !== undefined && cells[1] !== undefined) {
      navigation[cells[0]] = cells[1];
    }
    navEnd++;
  }

  // Build remaining lines (everything before the nav block, everything after)
  const remaining: string[] = [];
  for (let i = 0; i < navHeaderIdx; i++) {
    const line = contentLines[i];
    if (line !== undefined) {
      remaining.push(line);
    }
  }

  // Remove trailing blank line before nav header
  while (remaining.length > 0 && remaining[remaining.length - 1] === '') {
    remaining.pop();
  }

  for (let i = navEnd; i < contentLines.length; i++) {
    const line = contentLines[i];
    if (line !== undefined) {
      remaining.push(line);
    }
  }

  return {
    navigation: Object.keys(navigation).length > 0 ? navigation : undefined,
    remainingLines: remaining,
  };
}

// ---------------------------------------------------------------------------
// Navigation Extraction from Sections
// ---------------------------------------------------------------------------

interface SectionNavigationResult {
  navigation: Navigation | undefined;
  sections: Section[];
}

/**
 * Scan sections for navigation blocks (text blocks matching "Navigate deeper
 * from here:" followed by a table block or list blocks with link items).
 * Extracts the navigation and removes the blocks from the section.
 * Also scans inside subsection blocks recursively.
 * Empty sections are removed entirely.
 */
function extractNavigationFromSections(sections: Section[]): SectionNavigationResult {
  const navigation: Navigation = {};

  /**
   * Extract navigation from a content block array, returning filtered blocks
   * with navigation entries removed.
   */
  function extractFromBlocks(blocks: ContentBlock[]): ContentBlock[] {
    const filtered: ContentBlock[] = [];
    let skipNext = false;

    for (let i = 0; i < blocks.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const block = blocks[i];
      if (block === undefined) continue;

      // Recurse into subsections
      if (block.type === 'subsection') {
        const filteredContent = extractFromBlocks(block.content);
        filtered.push({ type: 'subsection', heading: block.heading, content: filteredContent });
        continue;
      }

      // Detect "Navigate deeper from here:" text block followed by table or list
      if (block.type === 'text' && block.value === NAV_HEADER) {
        const nextBlock = blocks[i + 1];
        if (nextBlock !== undefined && nextBlock.type === 'table') {
          // Table-format navigation: extract from table rows
          for (const row of nextBlock.rows) {
            const docCell = row[0];
            const descCell = row[1];
            if (docCell !== undefined && descCell !== undefined) {
              navigation[docCell] = descCell;
            }
          }
          skipNext = true;
          continue;
        }
        if (nextBlock !== undefined && nextBlock.type === 'list') {
          // List-format navigation: parse "- [file](path) — description"
          for (const item of nextBlock.items) {
            const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)\s*—\s*(.+)$/.exec(item);
            if (linkMatch !== null && linkMatch[2] !== undefined && linkMatch[3] !== undefined) {
              navigation[`[${linkMatch[1]}](${linkMatch[2]})`] = linkMatch[3];
            }
          }
          skipNext = true;
          continue;
        }
        // No recognizable navigation content follows — keep as-is
      }

      filtered.push(block);
    }

    return filtered;
  }

  const filteredSections: Section[] = [];

  for (const section of sections) {
    const filteredContent = extractFromBlocks(section.content);

    // Only keep sections that still have content (or have a heading)
    if (filteredContent.length > 0 || section.heading !== null) {
      filteredSections.push({ heading: section.heading, content: filteredContent });
    }
  }

  return {
    navigation: Object.keys(navigation).length > 0 ? navigation : undefined,
    sections: filteredSections,
  };
}

// ---------------------------------------------------------------------------
// Section Parsing
// ---------------------------------------------------------------------------

function parseSections(lines: string[], start: number): Section[] {
  const sections: Section[] = [];
  let cursor = start;

  while (cursor < lines.length) {
    // Skip blank lines
    cursor = skipBlankLines(lines, cursor);
    if (cursor >= lines.length) break;

    const line = lines[cursor];
    if (line === undefined) break;

    // Check for H2 heading
    if (line.startsWith('## ')) {
      const heading = line.slice(3);
      cursor++;
      const contentResult = parseSectionContent(lines, cursor);
      sections.push({ heading, content: contentResult.blocks });
      cursor = contentResult.cursor;
      continue;
    }

    // Headingless section — content between --- separators with no H2
    if (line !== '---') {
      const contentResult = parseSectionContent(lines, cursor);
      sections.push({ heading: null, content: contentResult.blocks });
      cursor = contentResult.cursor;
      continue;
    }

    // Skip --- separator
    cursor++;
  }

  return sections;
}

interface SectionContentResult {
  blocks: ContentBlock[];
  cursor: number;
}

function parseSectionContent(lines: string[], start: number): SectionContentResult {
  const blocks: ContentBlock[] = [];
  let cursor = start;

  while (cursor < lines.length) {
    // Skip blank lines between blocks
    cursor = skipBlankLines(lines, cursor);
    if (cursor >= lines.length) break;

    const line = lines[cursor];
    if (line === undefined) break;

    // Stop at section separator or next H2
    if (line === '---' || line.startsWith('## ')) {
      // Consume the ---
      if (line === '---') {
        cursor++;
      }
      break;
    }

    // Detect block type and parse
    const blockResult = parseBlock(lines, cursor);
    if (blockResult.block !== null) {
      blocks.push(blockResult.block);
    }
    cursor = blockResult.cursor;
  }

  return { blocks, cursor };
}

// ---------------------------------------------------------------------------
// Block Detection and Parsing
// ---------------------------------------------------------------------------

interface BlockResult {
  block: ContentBlock | null;
  cursor: number;
}

function parseBlock(lines: string[], start: number): BlockResult {
  const line = lines[start];
  if (line === undefined) {
    return { block: null, cursor: start + 1 };
  }

  // Navigation header: parse as standalone text block (will be extracted later)
  if (line === NAV_HEADER) {
    const block: TextBlock = { type: 'text', value: line };
    return { block, cursor: start + 1 };
  }

  // Principle: > **...**
  if (line.startsWith('> **') && line.endsWith('**')) {
    return parsePrincipleBlock(lines, start);
  }

  // Table: | ... |
  if (line.startsWith('|') && line.endsWith('|')) {
    return parseTableBlock(lines, start);
  }

  // Subsection: ### ...
  if (line.startsWith('### ')) {
    return parseSubsectionBlock(lines, start);
  }

  // List items: - or N.
  if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
    return parseListOrConstraintBlock(lines, start);
  }

  // Text block (default)
  return parseTextBlock(lines, start);
}

// ---------------------------------------------------------------------------
// Principle Block
// ---------------------------------------------------------------------------

function parsePrincipleBlock(lines: string[], start: number): BlockResult {
  const line = lines[start];
  if (line === undefined) {
    return { block: null, cursor: start + 1 };
  }

  // Extract statement: > **{statement}**
  const match = /^> \*\*(.+)\*\*$/.exec(line);
  if (match === null || match[1] === undefined) {
    // Fallback to text
    return parseTextBlock(lines, start);
  }

  const statement = match[1];
  let cursor = start + 1;

  // Check for body — skip blank line then collect text until next block boundary
  if (cursor < lines.length && lines[cursor] === '') {
    cursor++;
  }

  const bodyLines: string[] = [];
  while (cursor < lines.length) {
    const bodyLine = lines[cursor];
    if (bodyLine === undefined) break;

    // Stop at blank line, ---, H2, H3, table, list, principle
    if (bodyLine === '' || bodyLine === '---' || bodyLine.startsWith('## ') ||
        bodyLine.startsWith('### ') || bodyLine.startsWith('> **') ||
        (bodyLine.startsWith('|') && bodyLine.endsWith('|')) ||
        bodyLine.startsWith('- ') || /^\d+\.\s/.test(bodyLine)) {
      break;
    }

    bodyLines.push(bodyLine);
    cursor++;
  }

  const block: PrincipleBlock = { type: 'principle', statement };
  if (bodyLines.length > 0) {
    block.body = bodyLines.join('\n');
  }

  return { block, cursor };
}

// ---------------------------------------------------------------------------
// Table Block
// ---------------------------------------------------------------------------

function parseTableBlock(lines: string[], start: number): BlockResult {
  // Parse header row
  const headerLine = lines[start];
  if (headerLine === undefined) {
    return { block: null, cursor: start + 1 };
  }
  const headers = parseTableRow(headerLine);

  let cursor = start + 1;

  // Skip separator row (|---|---|)
  if (cursor < lines.length) {
    const sepLine = lines[cursor];
    if (sepLine !== undefined && /^\|[-:|]+\|$/.test(sepLine.replace(/\s/g, ''))) {
      cursor++;
    }
  }

  // Parse data rows
  const rows: string[][] = [];
  while (cursor < lines.length) {
    const rowLine = lines[cursor];
    if (rowLine === undefined || !rowLine.startsWith('|') || !rowLine.endsWith('|')) break;
    rows.push(parseTableRow(rowLine));
    cursor++;
  }

  const block: TableBlock = { type: 'table', headers, rows };
  return { block, cursor };
}

function parseTableRow(line: string): string[] {
  // Split by |, trim each cell, remove empty first/last from leading/trailing |
  const parts = line.split('|');
  const cells: string[] = [];
  for (let i = 1; i < parts.length - 1; i++) {
    const part = parts[i];
    if (part !== undefined) {
      cells.push(part.trim());
    }
  }
  return cells;
}

// ---------------------------------------------------------------------------
// List / Constraint-List Block
// ---------------------------------------------------------------------------

/** Constraint words that indicate a constraint-list rather than a plain list. */
const CONSTRAINT_WORDS = /^(Never|Always|MUST|Must|NEVER|ALWAYS|Do not|Don't)\b/;

function parseListOrConstraintBlock(lines: string[], start: number): BlockResult {
  const firstLine = lines[start];
  if (firstLine === undefined) {
    return { block: null, cursor: start + 1 };
  }

  const isNumbered = /^\d+\.\s/.test(firstLine);
  const items: string[] = [];
  let cursor = start;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line === undefined) break;

    if (isNumbered) {
      const match = /^\d+\.\s(.*)$/.exec(line);
      if (match === null || match[1] === undefined) break;
      items.push(match[1]);
    } else {
      if (!line.startsWith('- ')) break;
      items.push(line.slice(2));
    }
    cursor++;
  }

  if (items.length === 0) {
    return { block: null, cursor };
  }

  // Determine if this is a constraint list
  const isConstraintList = !isNumbered && items.every((item) => CONSTRAINT_WORDS.test(item));

  if (isConstraintList) {
    const block: ConstraintListBlock = { type: 'constraint-list', items };
    return { block, cursor };
  }

  const block: ListBlock = {
    type: 'list',
    style: isNumbered ? 'numbered' : 'bullet',
    items,
  };
  return { block, cursor };
}

// ---------------------------------------------------------------------------
// Subsection Block
// ---------------------------------------------------------------------------

function parseSubsectionBlock(lines: string[], start: number): BlockResult {
  const line = lines[start];
  if (line === undefined) {
    return { block: null, cursor: start + 1 };
  }

  const heading = line.slice(4); // Remove "### "
  let cursor = start + 1;

  // Parse nested content blocks
  const content: ContentBlock[] = [];

  while (cursor < lines.length) {
    cursor = skipBlankLines(lines, cursor);
    if (cursor >= lines.length) break;

    const nextLine = lines[cursor];
    if (nextLine === undefined) break;

    // Stop at section boundaries: ---, ## heading, ### heading (sibling subsection)
    if (nextLine === '---' || nextLine.startsWith('## ') || nextLine.startsWith('### ')) {
      break;
    }

    const blockResult = parseBlock(lines, cursor);
    if (blockResult.block !== null) {
      content.push(blockResult.block);
    }
    cursor = blockResult.cursor;
  }

  const block: SubsectionBlock = { type: 'subsection', heading, content };
  return { block, cursor };
}

// ---------------------------------------------------------------------------
// Text Block
// ---------------------------------------------------------------------------

function parseTextBlock(lines: string[], start: number): BlockResult {
  const paragraphs: string[] = [];
  let cursor = start;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line === undefined) break;

    // Stop at structural markers
    if (isBlockBoundary(line)) {
      break;
    }

    // Blank line separates paragraphs
    if (line === '') {
      // Check if the next non-blank line is still text content
      const nextNonBlank = peekNextNonBlank(lines, cursor);
      if (nextNonBlank === null || isBlockBoundary(nextNonBlank)) {
        break;
      }
      paragraphs.push('');
      cursor++;
      continue;
    }

    paragraphs.push(line);
    cursor++;
  }

  // Trim trailing blank entries
  while (paragraphs.length > 0 && paragraphs[paragraphs.length - 1] === '') {
    paragraphs.pop();
  }

  if (paragraphs.length === 0) {
    return { block: null, cursor };
  }

  // Join paragraphs — blank lines become \n\n
  const value = joinParagraphs(paragraphs);
  const block: TextBlock = { type: 'text', value };
  return { block, cursor };
}

function joinParagraphs(lines: string[]): string {
  // Convert arrays of lines (with empty strings as paragraph separators) to
  // the renderer's format: paragraphs separated by \n\n
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Gotcha Entry Parsing
// ---------------------------------------------------------------------------

function parseGotchaEntries(lines: string[], start: number): GotchaEntry[] {
  const entries: GotchaEntry[] = [];
  let cursor = start;

  while (cursor < lines.length) {
    // Skip blank lines and ---
    cursor = skipBlankLines(lines, cursor);
    if (cursor >= lines.length) break;

    const line = lines[cursor];
    if (line === undefined) break;

    if (line === '---') {
      cursor++;
      continue;
    }

    // Expect ### heading for entry
    if (line.startsWith('### ')) {
      const entryResult = parseGotchaEntry(lines, cursor);
      entries.push(entryResult.entry);
      cursor = entryResult.cursor;
      continue;
    }

    cursor++;
  }

  return entries;
}

interface GotchaEntryResult {
  entry: GotchaEntry;
  cursor: number;
}

function parseGotchaEntry(lines: string[], start: number): GotchaEntryResult {
  const titleLine = lines[start];
  if (titleLine === undefined || !titleLine.startsWith('### ')) {
    throw new Error(`Expected ### heading at line ${start}`);
  }

  const title = titleLine.slice(4);
  let cursor = start + 1;

  // Check for optional metadata (--- YAML ---)
  let metadata: GotchaMetadata | undefined;
  if (cursor < lines.length && lines[cursor] === '---') {
    cursor++; // skip opening ---
    const metaFields: Record<string, string> = {};

    while (cursor < lines.length) {
      const line = lines[cursor];
      if (line === undefined) break;
      if (line === '---') {
        cursor++; // skip closing ---
        break;
      }
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1) {
        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();
        // Strip surrounding quotes from pattern values
        if (key === 'pattern' && value.startsWith('"') && value.endsWith('"')) {
          value = JSON.parse(value) as string;
        }
        metaFields[key] = value;
      }
      cursor++;
    }

    metadata = buildGotchaMetadata(metaFields);
  }

  // Skip blank line before body
  cursor = skipBlankLines(lines, cursor);

  // Parse body fields: **Priority:**, **What happened:**, **User feedback:**, **Correct approach:**
  const body = parseGotchaBodyFields(lines, cursor);
  cursor = body.cursor;

  const entry: GotchaEntry = { title, body: body.body };
  if (metadata !== undefined) {
    entry.metadata = metadata;
  }

  return { entry, cursor };
}

function buildGotchaMetadata(fields: Record<string, string>): GotchaMetadata {
  const meta: GotchaMetadata = {};
  const priority = fields['priority'];
  if (priority !== undefined) {
    meta.priority = priority;
  }
  const techStack = fields['tech-stack'];
  if (techStack !== undefined) {
    meta['tech-stack'] = techStack;
  }
  const enforcement = fields['enforcement'];
  if (enforcement === 'hook' || enforcement === 'advisory') {
    meta.enforcement = enforcement;
  }
  const pattern = fields['pattern'];
  if (pattern !== undefined) {
    meta.pattern = pattern;
  }
  const event = fields['event'];
  if (event === 'bash' || event === 'file' || event === 'stop') {
    meta.event = event;
  }
  return meta;
}

interface GotchaBodyResult {
  body: GotchaBody;
  cursor: number;
}

function parseGotchaBodyFields(lines: string[], start: number): GotchaBodyResult {
  let cursor = start;
  let priority = '';
  let whatHappened = '';
  let userFeedback = '';
  let correctApproach = '';

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line === undefined) break;

    // Stop at next entry boundary (--- or ### or end)
    if (line === '---' || line.startsWith('### ')) {
      break;
    }

    if (line.startsWith('**Priority:** ')) {
      priority = line.slice('**Priority:** '.length);
      cursor++;
      continue;
    }
    if (line.startsWith('**What happened:** ')) {
      const result = collectMultilineField(lines, cursor, '**What happened:** ');
      whatHappened = result.value;
      cursor = result.cursor;
      continue;
    }
    if (line.startsWith('**User feedback:** ')) {
      const result = collectMultilineField(lines, cursor, '**User feedback:** ');
      userFeedback = result.value;
      cursor = result.cursor;
      continue;
    }
    if (line.startsWith('**Correct approach:** ')) {
      const result = collectMultilineField(lines, cursor, '**Correct approach:** ');
      correctApproach = result.value;
      cursor = result.cursor;
      continue;
    }

    cursor++;
  }

  return {
    body: {
      priority,
      'what-happened': whatHappened,
      'user-feedback': userFeedback,
      'correct-approach': correctApproach,
    },
    cursor,
  };
}

/**
 * Collect a multi-line gotcha body field value.
 * The first line starts with the bold label prefix. Continuation lines
 * follow until another bold label or boundary (--- or ###).
 * Blank lines within the content are treated as paragraph breaks and
 * the continuation text is joined with the first paragraph.
 */
function collectMultilineField(
  lines: string[],
  start: number,
  prefix: string,
): { value: string; cursor: number } {
  const firstLine = lines[start];
  if (firstLine === undefined) {
    return { value: '', cursor: start + 1 };
  }

  const parts: string[] = [firstLine.slice(prefix.length)];
  let cursor = start + 1;

  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line === undefined) break;

    // Stop at next bold label or boundary
    if (line.startsWith('**') || line === '---' || line.startsWith('### ')) {
      break;
    }

    // Blank line — peek ahead to see if content continues
    if (line === '') {
      const nextNonBlank = peekNextNonBlank(lines, cursor);
      // Stop if next content is a bold label, boundary, or end
      if (nextNonBlank === null ||
          nextNonBlank.startsWith('**') ||
          nextNonBlank === '---' ||
          nextNonBlank.startsWith('### ')) {
        break;
      }
      // Continuation paragraph — skip the blank line and keep going
      cursor++;
      continue;
    }

    parts.push(line);
    cursor++;
  }

  return { value: parts.join(' '), cursor };
}

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

/** Navigation header that signals a navigation block. */
const NAV_HEADER = '**Navigate deeper from here:**';

/**
 * Check if a line is a block boundary — a line that starts a new block
 * or structural element, causing the text block parser to stop.
 */
function isBlockBoundary(line: string): boolean {
  return (
    line === '---' ||
    line.startsWith('## ') ||
    line.startsWith('### ') ||
    (line.startsWith('> **') && line.endsWith('**')) ||
    (line.startsWith('|') && line.endsWith('|')) ||
    line.startsWith('- ') ||
    /^\d+\.\s/.test(line) ||
    line === NAV_HEADER
  );
}

function skipBlankLines(lines: string[], cursor: number): number {
  while (cursor < lines.length && lines[cursor] === '') {
    cursor++;
  }
  return cursor;
}

function peekNextNonBlank(lines: string[], start: number): string | null {
  let cursor = start;
  while (cursor < lines.length) {
    const line = lines[cursor];
    if (line !== undefined && line !== '') {
      return line;
    }
    cursor++;
  }
  return null;
}
