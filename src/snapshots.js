import { digestDescriptor, sortObject } from './descriptor.js';
import { versionReport } from './versions.js';

export function makeSnapshot(descriptor, profile = {}) {
  const body = {
    schemaVersion: 1,
    generator: {
      protoc: profile.protoc ?? 'deterministic-fallback',
      phpPlugin: profile.phpPlugin ?? 'deterministic-fallback',
      phpRuntime: profile.phpRuntime ?? 'unknown'
    },
    descriptor: stripDigest(descriptor),
    generated: renderPhpShape(descriptor)
  };
  return { ...body, digest: digestDescriptor(body) };
}

export function compareSnapshots(actual, expected) {
  const mismatches = [];
  compareValue('', stripVolatile(actual), stripVolatile(expected), mismatches);
  const versions = versionReport(actual.generator, expected.generator);
  const failedVersion = Object.values(versions).filter((entry) => !entry.ok);
  return {
    ok: mismatches.length === 0 && failedVersion.every((entry) => entry.severity !== 'error'),
    mismatchCount: mismatches.length,
    mismatches,
    versions
  };
}

function renderPhpShape(descriptor) {
  return descriptor.files.flatMap((file) => file.messages.map((message) => ({
    class: `${file.phpNamespace ? `${file.phpNamespace}\\\\` : ''}${message.name}`,
    fields: message.fields.map((field) => ({
      name: field.name,
      number: field.number,
      type: phpType(field.type, field.label),
      repeated: field.label === 'repeated'
    }))
  }))).sort((a, b) => a.class.localeCompare(b.class));
}

function phpType(type, label) {
  const scalar = { string: 'string', int32: 'int', int64: 'int|string', bool: 'bool', bytes: 'string', double: 'float', float: 'float' }[type] ?? type.replace(/^\./, '');
  return label === 'repeated' ? `array<${scalar}>` : scalar;
}

function compareValue(path, actual, expected, mismatches) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) return;
  if (typeof actual !== typeof expected || actual === null || expected === null || typeof actual !== 'object') {
    mismatches.push({ path: path || '$', actual, expected });
    return;
  }
  const keys = [...new Set([...Object.keys(actual), ...Object.keys(expected)])].sort();
  for (const key of keys) compareValue(`${path}/${key}`, actual[key], expected[key], mismatches);
}

function stripVolatile(snapshot) {
  const cleaned = { ...snapshot };
  delete cleaned.digest;
  return sortObject(cleaned);
}

function stripDigest(descriptor) {
  const cleaned = { ...descriptor };
  delete cleaned.digest;
  return cleaned;
}
