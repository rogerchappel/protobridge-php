# Reproducible setup

Requirements:

- Node.js 20+
- npm 10+
- Bash for smoke/validation scripts

No protobuf compiler is required for V1 because snapshots are generated with the deterministic fallback.

```bash
npm install
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

To refresh the bundled golden snapshot after an intentional parser or fixture change:

```bash
node scripts/write-basic-snapshot.mjs
```
