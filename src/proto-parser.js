const FIELD_RE = /^(optional|required|repeated)?\s*([A-Za-z_][\w.<>]*)\s+([A-Za-z_]\w*)\s*=\s*(\d+)/;

export function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

export function parseProto(source, file = 'inline.proto') {
  const clean = stripComments(source);
  const syntax = clean.match(/syntax\s*=\s*"([^"]+)"\s*;/)?.[1] ?? 'proto2';
  const pkg = clean.match(/package\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s*;/)?.[1] ?? '';
  const phpNamespace = unescapeProtoString(clean.match(/option\s+php_namespace\s*=\s*"([^"]+)"\s*;/)?.[1]) ?? namespaceFromPackage(pkg);
  const messages = parseBlocks(clean, 'message').map((block) => ({
    name: block.name,
    fields: block.body.split('\n').map((line) => line.trim()).map(parseField).filter(Boolean)
  }));
  const enums = parseBlocks(clean, 'enum').map((block) => ({
    name: block.name,
    values: block.body.split('\n').map((line) => line.trim()).map(parseEnumValue).filter(Boolean)
  }));
  const services = parseBlocks(clean, 'service').map((block) => ({
    name: block.name,
    rpcs: [...block.body.matchAll(/rpc\s+([A-Za-z_]\w*)\s*\(([^)]+)\)\s*returns\s*\(([^)]+)\)/g)].map((m) => ({ name: m[1], input: m[2].trim(), output: m[3].trim() }))
  }));
  return { file, syntax, package: pkg, phpNamespace, messages, enums, services };
}

function parseBlocks(source, kind) {
  const blocks = [];
  const re = new RegExp(`${kind}\\s+([A-Za-z_]\\w*)\\s*\\{`, 'g');
  let match;
  while ((match = re.exec(source))) {
    let depth = 1;
    let index = re.lastIndex;
    while (index < source.length && depth > 0) {
      if (source[index] === '{') depth += 1;
      if (source[index] === '}') depth -= 1;
      index += 1;
    }
    blocks.push({ name: match[1], body: source.slice(re.lastIndex, index - 1) });
    re.lastIndex = index;
  }
  return blocks;
}

function parseField(line) {
  const match = line.match(FIELD_RE);
  if (!match) return null;
  return { label: match[1] || 'singular', type: match[2], name: match[3], number: Number(match[4]) };
}

function parseEnumValue(line) {
  const match = line.match(/^([A-Za-z_]\w*)\s*=\s*(-?\d+)/);
  return match ? { name: match[1], number: Number(match[2]) } : null;
}

function namespaceFromPackage(pkg) {
  if (!pkg) return '';
  return pkg.split('.').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('\\');
}

function unescapeProtoString(value) {
  return value == null ? null : value.replace(/\\\\/g, '\\').replace(/\\"/g, '"');
}
