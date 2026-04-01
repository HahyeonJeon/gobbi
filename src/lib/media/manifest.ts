import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * A single output file entry in the manifest.
 */
export interface ManifestFile {
  filename: string;
  /** File type: "resized", "frame", "contact-sheet", "screenshot", "capture" */
  type: string;
  width: number;
  height: number;
  format: string;
}

/**
 * Contact sheet metadata in the manifest.
 */
export interface ManifestContactSheet {
  filename: string;
  layout: string;
  columns: number;
  rows: number;
  cellWidth: number;
}

/**
 * Source media metadata in the manifest.
 * The `[key: string]: unknown` index signature allows type-specific
 * metadata such as width, height, fps, duration, etc.
 */
export interface ManifestSource {
  /** Source type: "image", "video", "web" */
  type: string;
  path: string;
  [key: string]: unknown;
}

/**
 * Output section of the manifest containing generated files
 * and optional contact sheet metadata.
 */
export interface ManifestOutput {
  files: ManifestFile[];
  contactSheet?: ManifestContactSheet | undefined;
}

/**
 * Top-level manifest structure written as `manifest.json` to the output
 * directory after a media analysis command completes.
 */
export interface Manifest {
  command: string;
  timestamp: string;
  source: ManifestSource;
  output: ManifestOutput;
}

/**
 * Write a manifest JSON file to the specified output directory.
 * Creates `manifest.json` with pretty-printed JSON content.
 * @param outputDir - Absolute path to the output directory.
 * @param manifest - The manifest data to write.
 */
export async function writeManifest(outputDir: string, manifest: Manifest): Promise<void> {
  const filePath = path.join(outputDir, 'manifest.json');
  await writeFile(filePath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}
