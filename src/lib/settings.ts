import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface HookCommand {
  type: 'command';
  command: string;
  timeout?: number | undefined;
  async?: boolean | undefined;
}

export interface HookConfig {
  matcher?: string | undefined;
  hooks: HookCommand[];
}

export interface HookEntry {
  event: string;
  config: HookConfig;
}

interface SettingsHookConfig {
  hooks?: Array<{ command?: string }>;
}

interface Settings {
  hooks?: Record<string, SettingsHookConfig[]>;
  permissions?: {
    allow?: string[];
  };
  [key: string]: unknown;
}

/**
 * Merge hook configuration entries into a settings JSON file.
 * Avoids duplicates by checking for matching command strings.
 * @param settingsPath - Absolute path to the settings JSON file.
 * @param hookEntries - Hook entries to merge.
 */
export async function mergeHookConfig(settingsPath: string, hookEntries: HookEntry[]): Promise<void> {
  // Ensure parent directory exists
  const parentDir = path.dirname(settingsPath);
  await mkdir(parentDir, { recursive: true });

  // Read existing settings or start fresh
  let settings: Settings = {};
  try {
    const raw = await readFile(settingsPath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      settings = parsed as Settings;
    }
  } catch {
    // File doesn't exist or is invalid — start with empty object
  }

  // Ensure hooks object exists
  if (!settings.hooks) {
    settings.hooks = {};
  }

  for (const { event, config } of hookEntries) {
    const hooksObj = settings.hooks;

    // Ensure the event array exists
    if (!Array.isArray(hooksObj[event])) {
      hooksObj[event] = [];
    }

    const eventArray = hooksObj[event];
    if (!eventArray) continue;

    // Extract the command string from the new config for dedup
    const firstHook = config.hooks[0];
    const newCommand = firstHook?.command;

    // Check for duplicate by command string
    const isDuplicate = eventArray.some((existing) => {
      const existingFirstHook = existing.hooks?.[0];
      const existingCommand = existingFirstHook?.command;
      return existingCommand !== undefined && existingCommand === newCommand;
    });

    if (!isDuplicate) {
      eventArray.push(config);
    }
  }

  await writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
}

/**
 * Merge permission strings into a settings JSON file.
 * Avoids duplicates by checking for exact string matches.
 * @param settingsPath - Absolute path to the settings JSON file.
 * @param permissions - Permission strings to merge.
 */
export async function mergePermissions(settingsPath: string, permissions: string[]): Promise<void> {
  // Ensure parent directory exists
  const parentDir = path.dirname(settingsPath);
  await mkdir(parentDir, { recursive: true });

  // Read existing settings or start fresh
  let settings: Settings = {};
  try {
    const raw = await readFile(settingsPath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      settings = parsed as Settings;
    }
  } catch {
    // File doesn't exist or is invalid — start with empty object
  }

  // Ensure permissions.allow array exists
  if (!settings.permissions) {
    settings.permissions = {};
  }
  if (!Array.isArray(settings.permissions.allow)) {
    settings.permissions.allow = [];
  }

  // Add each permission if not already present
  for (const perm of permissions) {
    if (!settings.permissions.allow.includes(perm)) {
      settings.permissions.allow.push(perm);
    }
  }

  await writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
}
