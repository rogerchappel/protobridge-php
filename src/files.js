import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function readUtf8(filePath) {
  return fs.readFile(filePath, 'utf8');
}

export async function readJson(filePath) {
  return JSON.parse(await readUtf8(filePath));
}

export async function writeUtf8(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
}

export async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function listProtoFiles(inputPath) {
  const stat = await fs.stat(inputPath);
  if (stat.isFile()) return inputPath.endsWith('.proto') ? [inputPath] : [];
  const entries = await fs.readdir(inputPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const child = path.join(inputPath, entry.name);
    if (entry.isDirectory() && entry.name !== 'snapshots') files.push(...await listProtoFiles(child));
    if (entry.isFile() && entry.name.endsWith('.proto')) files.push(child);
  }
  return files.sort();
}
