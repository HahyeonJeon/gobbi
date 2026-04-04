/**
 * gobbi-docs JSON template validator.
 *
 * Validates:
 * - `$schema` is a valid doc schema
 * - Required fields per doc type
 * - Frontmatter fields per type
 * - Content blocks have valid `type` values
 * - If .md file exists alongside .json, compares json2md output with existing .md
 */

import { readFile } from 'fs/promises';
import path from 'path';

import { renderDoc } from './renderer.js';
import {
  isDocSchema,
  VALID_BLOCK_TYPES,
} from './types.js';

import type {
  GobbiDoc,
  ContentBlock,
  Section,
  GotchaEntry,
} from './types.js';

// ---------------------------------------------------------------------------
// Validation Result
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  syncStatus?: 'in-sync' | 'out-of-sync' | 'no-md-file';
}

// ---------------------------------------------------------------------------
// Main Validator
// ---------------------------------------------------------------------------

/**
 * Validate a parsed GobbiDoc JSON object.
 * If `jsonFilePath` is provided, also checks sync with corresponding .md.
 */
export async function validateDoc(
  raw: unknown,
  jsonFilePath?: string,
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // --- Top-level structure ---

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { valid: false, errors: ['Document must be a JSON object'], warnings };
  }

  const obj = raw as Record<string, unknown>;

  // $schema
  const schemaValue = obj['$schema'];
  if (typeof schemaValue !== 'string') {
    errors.push('Missing or invalid "$schema" field (must be a string)');
    return { valid: false, errors, warnings };
  }
  if (!isDocSchema(schemaValue)) {
    errors.push(`Invalid "$schema" value: "${schemaValue}". Must be one of: gobbi-docs/skill, gobbi-docs/agent, gobbi-docs/rule, gobbi-docs/root, gobbi-docs/child, gobbi-docs/gotcha`);
    return { valid: false, errors, warnings };
  }
  const schema = schemaValue;

  // title
  if (typeof obj['title'] !== 'string' || obj['title'].length === 0) {
    errors.push('Missing or empty "title" field');
  }

  // opening (optional string)
  if ('opening' in obj && typeof obj['opening'] !== 'string') {
    errors.push('"opening" must be a string if present');
  }

  // navigation (optional object)
  if ('navigation' in obj) {
    validateNavigation(obj['navigation'], errors);
  }

  // --- Type-specific validation ---

  const docType = schema.slice('gobbi-docs/'.length);

  switch (docType) {
    case 'skill':
      validateSkillFrontmatter(obj, errors);
      validateSections(obj, errors, warnings);
      break;
    case 'agent':
      validateAgentFrontmatter(obj, errors);
      validateSections(obj, errors, warnings);
      break;
    case 'rule':
      if ('frontmatter' in obj) {
        validateRuleFrontmatter(obj, errors);
      }
      validateSections(obj, errors, warnings);
      break;
    case 'root':
      if ('frontmatter' in obj) {
        warnings.push('"root" doc type should not have frontmatter');
      }
      validateSections(obj, errors, warnings);
      break;
    case 'child':
      if ('frontmatter' in obj) {
        warnings.push('"child" doc type should not have frontmatter');
      }
      if (typeof obj['parent'] !== 'string' || obj['parent'].length === 0) {
        errors.push('"child" doc type requires a non-empty "parent" field');
      }
      validateSections(obj, errors, warnings);
      break;
    case 'gotcha':
      if ('frontmatter' in obj) {
        warnings.push('"gotcha" doc type should not have frontmatter');
      }
      if (typeof obj['parent'] !== 'string' || obj['parent'].length === 0) {
        errors.push('"gotcha" doc type requires a non-empty "parent" field');
      }
      validateEntries(obj, errors, warnings);
      break;
  }

  // --- Sync check ---
  let syncStatus: 'in-sync' | 'out-of-sync' | 'no-md-file' = 'no-md-file';
  if (jsonFilePath !== undefined && errors.length === 0) {
    syncStatus = await checkSync(raw as GobbiDoc, jsonFilePath);
    if (syncStatus === 'out-of-sync') {
      warnings.push('Generated Markdown does not match existing .md file — run json2md to update');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    syncStatus,
  };
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

function validateNavigation(nav: unknown, errors: string[]): void {
  if (nav === null || typeof nav !== 'object' || Array.isArray(nav)) {
    errors.push('"navigation" must be an object');
    return;
  }
  const navObj = nav as Record<string, unknown>;
  for (const [key, value] of Object.entries(navObj)) {
    if (typeof value !== 'string') {
      errors.push(`navigation["${key}"] must be a string`);
    }
    // Warn if key uses legacy markdown link format instead of .claude/-relative path
    if (/^\[.*\]\(.*\)$/.test(key)) {
      errors.push(`navigation key "${key}" uses markdown link syntax — use a .claude/-relative path instead (e.g., "skills/_git/conventions.md")`);
    }
  }
}

// ---------------------------------------------------------------------------
// Frontmatter Validators
// ---------------------------------------------------------------------------

function validateSkillFrontmatter(obj: Record<string, unknown>, errors: string[]): void {
  if (!('frontmatter' in obj) || obj['frontmatter'] === null || typeof obj['frontmatter'] !== 'object') {
    errors.push('"skill" doc type requires a "frontmatter" object');
    return;
  }
  const fm = obj['frontmatter'] as Record<string, unknown>;
  if (typeof fm['name'] !== 'string' || fm['name'].length === 0) {
    errors.push('skill frontmatter requires non-empty "name"');
  }
  if (typeof fm['description'] !== 'string' || fm['description'].length === 0) {
    errors.push('skill frontmatter requires non-empty "description"');
  }
  if ('allowed-tools' in fm && typeof fm['allowed-tools'] !== 'string') {
    errors.push('skill frontmatter "allowed-tools" must be a string if present');
  }
}

function validateAgentFrontmatter(obj: Record<string, unknown>, errors: string[]): void {
  if (!('frontmatter' in obj) || obj['frontmatter'] === null || typeof obj['frontmatter'] !== 'object') {
    errors.push('"agent" doc type requires a "frontmatter" object');
    return;
  }
  const fm = obj['frontmatter'] as Record<string, unknown>;
  const requiredFields = ['name', 'description', 'tools', 'model'] as const;
  for (const field of requiredFields) {
    if (typeof fm[field] !== 'string' || (fm[field] as string).length === 0) {
      errors.push(`agent frontmatter requires non-empty "${field}"`);
    }
  }
}

function validateRuleFrontmatter(obj: Record<string, unknown>, errors: string[]): void {
  const fm = obj['frontmatter'];
  if (fm === null || typeof fm !== 'object' || Array.isArray(fm)) {
    errors.push('"frontmatter" must be an object if present for rule type');
  }
}

// ---------------------------------------------------------------------------
// Sections Validator
// ---------------------------------------------------------------------------

function validateSections(obj: Record<string, unknown>, errors: string[], warnings: string[]): void {
  if (!('sections' in obj)) return;

  const sections = obj['sections'];
  if (!Array.isArray(sections)) {
    errors.push('"sections" must be an array');
    return;
  }

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i] as unknown;
    if (section === null || typeof section !== 'object' || Array.isArray(section)) {
      errors.push(`sections[${i}] must be an object`);
      continue;
    }
    const sectionObj = section as Record<string, unknown>;

    // heading: string | null
    if (!('heading' in sectionObj)) {
      errors.push(`sections[${i}] must have a "heading" field (string or null)`);
    } else if (sectionObj['heading'] !== null && typeof sectionObj['heading'] !== 'string') {
      errors.push(`sections[${i}].heading must be a string or null`);
    }

    // content: ContentBlock[]
    if (!('content' in sectionObj)) {
      errors.push(`sections[${i}] must have a "content" array`);
    } else if (!Array.isArray(sectionObj['content'])) {
      errors.push(`sections[${i}].content must be an array`);
    } else {
      validateBlocks(sectionObj['content'] as unknown[], `sections[${i}]`, errors, warnings);
    }
  }
}

// ---------------------------------------------------------------------------
// Block Validator
// ---------------------------------------------------------------------------

function validateBlocks(
  blocks: unknown[],
  pathPrefix: string,
  errors: string[],
  _warnings: string[],
): void {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i] as unknown;
    const blockPath = `${pathPrefix}.content[${i}]`;

    if (block === null || typeof block !== 'object' || Array.isArray(block)) {
      errors.push(`${blockPath} must be an object`);
      continue;
    }
    const blockObj = block as Record<string, unknown>;

    if (typeof blockObj['type'] !== 'string') {
      errors.push(`${blockPath} must have a "type" string`);
      continue;
    }

    const blockType = blockObj['type'];
    if (!(VALID_BLOCK_TYPES as readonly string[]).includes(blockType)) {
      errors.push(`${blockPath} has invalid type "${blockType}". Must be one of: ${VALID_BLOCK_TYPES.join(', ')}`);
      continue;
    }

    switch (blockType) {
      case 'text':
        if (typeof blockObj['value'] !== 'string') {
          errors.push(`${blockPath} (text) requires a "value" string`);
        }
        break;
      case 'principle':
        if (typeof blockObj['statement'] !== 'string') {
          errors.push(`${blockPath} (principle) requires a "statement" string`);
        }
        if ('body' in blockObj && typeof blockObj['body'] !== 'string') {
          errors.push(`${blockPath} (principle) "body" must be a string if present`);
        }
        break;
      case 'table':
        if (!Array.isArray(blockObj['headers'])) {
          errors.push(`${blockPath} (table) requires a "headers" array`);
        }
        if (!Array.isArray(blockObj['rows'])) {
          errors.push(`${blockPath} (table) requires a "rows" array`);
        }
        break;
      case 'constraint-list':
        if (!Array.isArray(blockObj['items'])) {
          errors.push(`${blockPath} (constraint-list) requires an "items" array`);
        }
        break;
      case 'list':
        if (!Array.isArray(blockObj['items'])) {
          errors.push(`${blockPath} (list) requires an "items" array`);
        }
        if (blockObj['style'] !== 'bullet' && blockObj['style'] !== 'numbered') {
          errors.push(`${blockPath} (list) "style" must be "bullet" or "numbered"`);
        }
        break;
      case 'subsection':
        if (typeof blockObj['heading'] !== 'string') {
          errors.push(`${blockPath} (subsection) requires a "heading" string`);
        }
        if (!Array.isArray(blockObj['content'])) {
          errors.push(`${blockPath} (subsection) requires a "content" array`);
        } else {
          validateBlocks(blockObj['content'] as unknown[], `${blockPath}.subsection`, errors, _warnings);
        }
        break;
    }
  }
}

// ---------------------------------------------------------------------------
// Gotcha Entries Validator
// ---------------------------------------------------------------------------

function validateEntries(obj: Record<string, unknown>, errors: string[], _warnings: string[]): void {
  if (!('entries' in obj)) {
    errors.push('"gotcha" doc type requires an "entries" array');
    return;
  }

  const entries = obj['entries'];
  if (!Array.isArray(entries)) {
    errors.push('"entries" must be an array');
    return;
  }

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i] as unknown;
    const entryPath = `entries[${i}]`;

    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`${entryPath} must be an object`);
      continue;
    }
    const entryObj = entry as Record<string, unknown>;

    if (typeof entryObj['title'] !== 'string' || entryObj['title'].length === 0) {
      errors.push(`${entryPath} requires a non-empty "title" string`);
    }

    // metadata is optional (null or object)
    if ('metadata' in entryObj && entryObj['metadata'] !== null && typeof entryObj['metadata'] !== 'object') {
      errors.push(`${entryPath}.metadata must be an object or null`);
    }

    // body is required
    if (!('body' in entryObj) || entryObj['body'] === null || typeof entryObj['body'] !== 'object') {
      errors.push(`${entryPath} requires a "body" object`);
    } else {
      const body = entryObj['body'] as Record<string, unknown>;
      const requiredBodyFields = ['priority', 'what-happened', 'user-feedback', 'correct-approach'] as const;
      for (const field of requiredBodyFields) {
        if (typeof body[field] !== 'string') {
          errors.push(`${entryPath}.body requires a "${field}" string`);
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Sync Check
// ---------------------------------------------------------------------------

async function checkSync(
  doc: GobbiDoc,
  jsonFilePath: string,
): Promise<'in-sync' | 'out-of-sync' | 'no-md-file'> {
  const dir = path.dirname(jsonFilePath);
  const basename = path.basename(jsonFilePath, '.json');
  const mdPath = path.join(dir, `${basename}.md`);

  let existingMd: string;
  try {
    existingMd = await readFile(mdPath, 'utf8');
  } catch {
    return 'no-md-file';
  }

  const generatedMd = renderDoc(doc);
  return existingMd === generatedMd ? 'in-sync' : 'out-of-sync';
}

// ---------------------------------------------------------------------------
// Validation helpers for external use
// ---------------------------------------------------------------------------

/**
 * Parse and validate a JSON file from disk.
 */
export async function validateFile(filePath: string): Promise<ValidationResult> {
  let content: string;
  try {
    content = await readFile(filePath, 'utf8');
  } catch {
    return { valid: false, errors: [`Cannot read file: ${filePath}`], warnings: [] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { valid: false, errors: ['Invalid JSON'], warnings: [] };
  }

  return validateDoc(parsed, filePath);
}
