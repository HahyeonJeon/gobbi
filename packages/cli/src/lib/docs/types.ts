/**
 * gobbi-docs JSON schema types.
 *
 * Discriminated unions on `$schema` (doc types) and `type` (content blocks).
 * Strict mode compliance: no `any`, no `as` assertions.
 */

// ---------------------------------------------------------------------------
// Doc Schema Discriminator
// ---------------------------------------------------------------------------

/** All valid doc schema identifiers. */
export type DocSchema =
  | 'gobbi-docs/skill'
  | 'gobbi-docs/agent'
  | 'gobbi-docs/rule'
  | 'gobbi-docs/root'
  | 'gobbi-docs/child'
  | 'gobbi-docs/gotcha';

/** Short names used as CLI arguments. */
export type DocType = 'skill' | 'agent' | 'rule' | 'root' | 'child' | 'gotcha';

/** Map from short type name to full schema identifier. */
export const DOC_TYPE_TO_SCHEMA: Readonly<Record<DocType, DocSchema>> = {
  skill: 'gobbi-docs/skill',
  agent: 'gobbi-docs/agent',
  rule: 'gobbi-docs/rule',
  root: 'gobbi-docs/root',
  child: 'gobbi-docs/child',
  gotcha: 'gobbi-docs/gotcha',
};

export const VALID_DOC_TYPES: readonly DocType[] = ['skill', 'agent', 'rule', 'root', 'child', 'gotcha'];

// ---------------------------------------------------------------------------
// Frontmatter Types
// ---------------------------------------------------------------------------

export interface SkillFrontmatter {
  name: string;
  description: string;
  'allowed-tools'?: string;
}

export interface AgentFrontmatter {
  name: string;
  description: string;
  tools: string;
  model: string;
}

export interface RuleFrontmatter {
  [key: string]: string;
}

// ---------------------------------------------------------------------------
// Content Block Types (discriminated union on `type`)
// ---------------------------------------------------------------------------

export interface TextBlock {
  type: 'text';
  value: string;
}

export interface PrincipleBlock {
  type: 'principle';
  statement: string;
  body?: string;
}

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface ConstraintListBlock {
  type: 'constraint-list';
  items: string[];
}

export interface ListBlock {
  type: 'list';
  style: 'bullet' | 'numbered';
  items: string[];
}

export interface SubsectionBlock {
  type: 'subsection';
  heading: string;
  content: ContentBlock[];
}

export type ContentBlock =
  | TextBlock
  | PrincipleBlock
  | TableBlock
  | ConstraintListBlock
  | ListBlock
  | SubsectionBlock;

export const VALID_BLOCK_TYPES: readonly string[] = [
  'text', 'principle', 'table', 'constraint-list', 'list', 'subsection',
];

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export interface Section {
  heading: string | null;
  content: ContentBlock[];
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/** Keys are relative filenames, values are description strings. */
export type Navigation = Record<string, string>;

// ---------------------------------------------------------------------------
// Gotcha-Specific Types
// ---------------------------------------------------------------------------

export interface GotchaMetadata {
  priority?: string;
  'tech-stack'?: string;
  enforcement?: 'hook' | 'advisory';
  pattern?: string;
  event?: 'bash' | 'file' | 'stop';
}

export interface GotchaBody {
  priority: string;
  'what-happened': string;
  'user-feedback': string;
  'correct-approach': string;
}

export interface GotchaEntry {
  title: string;
  metadata?: GotchaMetadata | null;
  body: GotchaBody;
}

// ---------------------------------------------------------------------------
// Doc Type Interfaces (discriminated union on `$schema`)
// ---------------------------------------------------------------------------

interface DocBase {
  title: string;
  opening?: string;
  navigation: Navigation;
}

export interface SkillDoc extends DocBase {
  $schema: 'gobbi-docs/skill';
  frontmatter: SkillFrontmatter;
  sections?: Section[];
}

export interface AgentDoc extends DocBase {
  $schema: 'gobbi-docs/agent';
  frontmatter: AgentFrontmatter;
  sections?: Section[];
}

export interface RuleDoc extends DocBase {
  $schema: 'gobbi-docs/rule';
  frontmatter?: RuleFrontmatter;
  sections?: Section[];
}

export interface RootDoc extends DocBase {
  $schema: 'gobbi-docs/root';
  sections?: Section[];
}

export interface ChildDoc extends DocBase {
  $schema: 'gobbi-docs/child';
  parent: string;
  sections?: Section[];
}

export interface GotchaDoc extends DocBase {
  $schema: 'gobbi-docs/gotcha';
  parent: string;
  entries: GotchaEntry[];
}

export type GobbiDoc = SkillDoc | AgentDoc | RuleDoc | RootDoc | ChildDoc | GotchaDoc;

// ---------------------------------------------------------------------------
// Type Guards
// ---------------------------------------------------------------------------

export function isDocType(value: string): value is DocType {
  return (VALID_DOC_TYPES as readonly string[]).includes(value);
}

export function isDocSchema(value: string): value is DocSchema {
  return value.startsWith('gobbi-docs/') && isDocType(value.slice('gobbi-docs/'.length));
}

export function isGotchaDoc(doc: GobbiDoc): doc is GotchaDoc {
  return doc.$schema === 'gobbi-docs/gotcha';
}

export function hasEntries(doc: GobbiDoc): doc is GotchaDoc {
  return 'entries' in doc;
}

export function hasSections(doc: GobbiDoc): doc is Exclude<GobbiDoc, GotchaDoc> {
  return 'sections' in doc && !hasEntries(doc);
}

export function hasFrontmatter(doc: GobbiDoc): doc is SkillDoc | AgentDoc | RuleDoc {
  return 'frontmatter' in doc;
}
