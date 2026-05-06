import path from 'node:path';
import { createHash } from 'node:crypto';
import { readUtf8, listProtoFiles } from './files.js';
import { parseProto } from './proto-parser.js';

export async function buildDescriptor(inputPath) {
  const files = await listProtoFiles(inputPath);
  const protos = [];
  for (const file of files) {
    protos.push(parseProto(await readUtf8(file), path.relative(process.cwd(), file)));
  }
  const descriptor = { schemaVersion: 1, files: protos };
  return { ...descriptor, digest: digestDescriptor(descriptor) };
}

export function digestDescriptor(descriptor) {
  return createHash('sha256').update(JSON.stringify(sortObject(descriptor))).digest('hex');
}

export function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
}
