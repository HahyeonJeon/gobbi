import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Merge hook configuration entries into a settings JSON file.
 * Avoids duplicates by checking for matching command strings.
 * @param {string} settingsPath - Absolute path to the settings JSON file.
 * @param {Array<{event: string, config: object}>} hookEntries - Hook entries to merge.
 */
export async function mergeHookConfig(settingsPath, hookEntries) {
  // Ensure parent directory exists
  const parentDir = path.dirname(settingsPath);
  await mkdir(parentDir, { recursive: true });

  // Read existing settings or start fresh
  let settings = {};
  try {
    const raw = await readFile(settingsPath, 'utf8');
    settings = JSON.parse(raw);
  } catch {
    // File doesn't exist or is invalid — start with empty object
  }

  // Ensure hooks object exists
  if (!settings.hooks) {
    settings.hooks = {};
  }

  for (const { event, config } of hookEntries) {
    // Ensure the event array exists
    if (!Array.isArray(settings.hooks[event])) {
      settings.hooks[event] = [];
    }

    // Extract the command string from the new config for dedup
    const newCommand = config.hooks?.[0]?.command;

    // Check for duplicate by command string
    const isDuplicate = settings.hooks[event].some((existing) => {
      const existingCommand = existing.hooks?.[0]?.command;
      return existingCommand && existingCommand === newCommand;
    });

    if (!isDuplicate) {
      settings.hooks[event].push(config);
    }
  }

  await writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n', 'utf8');
}

/**
 * Merge permission strings into a settings JSON file.
 * Avoids duplicates by checking for exact string matches.
 * @param {string} settingsPath - Absolute path to the settings JSON file.
 * @param {string[]} permissions - Permission strings to merge.
 */
export async function mergePermissions(settingsPath, permissions) {
  // Ensure parent directory exists
  const parentDir = path.dirname(settingsPath);
  await mkdir(parentDir, { recursive: true });

  // Read existing settings or start fresh
  let settings = {};
  try {
    const raw = await readFile(settingsPath, 'utf8');
    settings = JSON.parse(raw);
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
