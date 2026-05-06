export function normalizeVersion(value) {
  if (!value) return null;
  const match = String(value).match(/(\d+)\.(\d+)(?:\.(\d+))?/);
  return match ? { raw: String(value), major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3] ?? 0) } : { raw: String(value), major: 0, minor: 0, patch: 0 };
}

export function compareVersions(actual, expected) {
  const a = normalizeVersion(actual);
  const e = normalizeVersion(expected);
  if (!a || !e) return { ok: true, severity: 'info', message: 'version comparison skipped' };
  if (a.major !== e.major) return { ok: false, severity: 'error', message: `major version mismatch: ${a.raw} vs ${e.raw}` };
  if (a.minor !== e.minor) return { ok: false, severity: 'warning', message: `minor version differs: ${a.raw} vs ${e.raw}` };
  if (a.patch !== e.patch) return { ok: true, severity: 'info', message: `patch version differs: ${a.raw} vs ${e.raw}` };
  return { ok: true, severity: 'ok', message: `version match: ${a.raw}` };
}

export function versionReport(actual = {}, expected = {}) {
  return {
    protoc: compareVersions(actual.protoc, expected.protoc),
    phpPlugin: compareVersions(actual.phpPlugin, expected.phpPlugin),
    phpRuntime: compareVersions(actual.phpRuntime, expected.phpRuntime)
  };
}
