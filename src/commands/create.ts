import path from 'path';
import { writeFile, mkdir, chmod } from 'fs/promises';
import { isV2Installed } from '../lib/detect.js';
import { sync } from '../lib/sync.js';
import { SUBDIRS } from '../lib/gobbi-dir.js';
import { ok, error } from '../lib/style.js';
import { askQuestion, askChoice } from '../lib/prompt.js';

interface CreateOptions {
  nonInteractive: boolean;
  type?: string | undefined;
  name?: string | undefined;
}

const VALID_TYPES = ['skill', 'agent', 'hook'] as const;
type DocType = typeof VALID_TYPES[number];

/**
 * Convert a kebab-case name to Title Case.
 * @param name - The kebab-case name (e.g. "my-cool-skill").
 * @returns Title-cased string (e.g. "My Cool Skill").
 */
function toTitleCase(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate a user-provided name for a skill, agent, or hook.
 * Returns an error message string if invalid, or null if valid.
 */
function validateName(name: string): string | null {
  if (name.length === 0) {
    return 'Name cannot be empty.';
  }
  if (name.includes('/') || name.includes('\\')) {
    return 'Name cannot contain path separators.';
  }
  if (name.includes(' ')) {
    return 'Name cannot contain spaces. Use kebab-case (e.g. "my-skill").';
  }
  if (name !== name.toLowerCase()) {
    return 'Name must be lowercase. Use kebab-case (e.g. "my-skill").';
  }
  if (name.startsWith('gobbi-') || name === 'gobbi') {
    return 'The "gobbi" prefix is reserved for core components.';
  }
  return null;
}

/**
 * Generate the scaffold content for a skill SKILL.md.
 */
function skillTemplate(name: string): string {
  const title = toTitleCase(name);
  return `---
name: ${name}
description: ${name} — [describe what this skill does and when to load it]
allowed-tools: Read, Grep, Glob
---

# ${title}

[What this skill helps Claude do]
`;
}

/**
 * Generate the scaffold content for an agent .md file.
 */
function agentTemplate(name: string): string {
  const title = toTitleCase(name);
  return `---
name: ${name}
description: ${name} — [describe this agent's specialty]
tools: Read, Grep, Glob, Bash
---

# ${title}

[This agent's role and instructions]
`;
}

/**
 * Generate the scaffold content for a hook .sh file.
 */
function hookTemplate(name: string): string {
  return `#!/usr/bin/env bash
# ${name} hook
set -euo pipefail
echo "${name} hook executed"
`;
}

/**
 * Resolve the doc type from options or by prompting the user.
 */
async function resolveType(options: CreateOptions): Promise<DocType> {
  if (options.type !== undefined) {
    const t = options.type.toLowerCase();
    if (isValidType(t)) {
      return t;
    }
    console.log(error(`Invalid type "${options.type}". Must be one of: ${VALID_TYPES.join(', ')}`));
    process.exit(1);
  }

  if (options.nonInteractive) {
    console.log(error('Type is required in non-interactive mode. Use --type <skill|agent|hook>.'));
    process.exit(1);
  }

  return await askChoice('What would you like to create?', [...VALID_TYPES]) as DocType;
}

/**
 * Type guard for valid doc types.
 */
function isValidType(value: string): value is DocType {
  return (VALID_TYPES as readonly string[]).includes(value);
}

/**
 * Resolve the name from options or by prompting the user.
 */
async function resolveName(docType: DocType, options: CreateOptions): Promise<string> {
  if (options.name !== undefined) {
    const validationError = validateName(options.name);
    if (validationError !== null) {
      console.log(error(validationError));
      process.exit(1);
    }
    return options.name;
  }

  if (options.nonInteractive) {
    console.log(error('Name is required in non-interactive mode. Use --name <name>.'));
    process.exit(1);
  }

  for (;;) {
    const answer = await askQuestion(`Enter ${docType} name (kebab-case): `);
    const name = answer.trim();
    const validationError = validateName(name);
    if (validationError === null) {
      return name;
    }
    console.log(error(validationError));
  }
}

/**
 * Run the gobbi create command — scaffold a new user skill, agent, or hook.
 * @param targetDir - The project root.
 * @param options - Command options.
 */
export async function runCreate(targetDir: string, options: CreateOptions): Promise<void> {
  // 1. Check v2 is installed
  if (!(await isV2Installed(targetDir))) {
    console.log(error('Gobbi is not installed in this project.'));
    console.log("Run 'npx gobbi init' to install it first.");
    process.exit(1);
  }

  // 2. Get doc type
  const docType = await resolveType(options);

  // 3. Get name
  const name = await resolveName(docType, options);

  // 4-5. Scaffold based on type
  switch (docType) {
    case 'skill': {
      const skillDir = path.join(targetDir, SUBDIRS.userSkills, name);
      await mkdir(skillDir, { recursive: true });
      const filePath = path.join(skillDir, 'SKILL.md');
      await writeFile(filePath, skillTemplate(name), 'utf8');
      console.log(ok(`Created skill: ${SUBDIRS.userSkills}/${name}/SKILL.md`));
      break;
    }
    case 'agent': {
      const agentsDir = path.join(targetDir, SUBDIRS.userAgents);
      await mkdir(agentsDir, { recursive: true });
      const filePath = path.join(agentsDir, `${name}.md`);
      await writeFile(filePath, agentTemplate(name), 'utf8');
      console.log(ok(`Created agent: ${SUBDIRS.userAgents}/${name}.md`));
      break;
    }
    case 'hook': {
      const hooksDir = path.join(targetDir, SUBDIRS.userHooks);
      await mkdir(hooksDir, { recursive: true });
      const filePath = path.join(hooksDir, `${name}.sh`);
      await writeFile(filePath, hookTemplate(name), 'utf8');
      await chmod(filePath, 0o755);
      console.log(ok(`Created hook: ${SUBDIRS.userHooks}/${name}.sh`));
      break;
    }
  }

  // 6. Run sync
  await sync(targetDir);
  console.log(ok('Synced .gobbi/ to .claude/'));

  // 7. Print success
  console.log('');
  console.log(ok(`Created ${docType} "${name}" successfully.`));
}
