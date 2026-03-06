#!/usr/bin/env node
/**
 * Patches expo-modules-core package.json to fix Node 20+ ESM compatibility without breaking Metro.
 *
 * Problem: expo-modules-core sets "main": "src/index.ts" and
 * "exports[.][default]": "./src/index.ts" — these point to raw TypeScript
 * which Node 20's ESM loader can't handle.
 *
 * Solution: Use conditional exports. Point the Node default to 'index.js' (the stub)
 * but point the 'react-native' condition to the original 'src/index.ts'.
 * Metro will follow the 'react-native' condition and get the real code.
 *
 * This is run automatically via the "postinstall" script in package.json.
 */

const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '../node_modules/expo-modules-core/package.json');

if (!fs.existsSync(pkgPath)) {
    console.log('[patch-expo-modules] expo-modules-core not found, skipping.');
    process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

let changed = false;

// 1. Maintain a "react-native" field for older bundlers
if (pkg.main !== 'src/index.ts' && pkg.main !== 'index.js') {
    // If it's already something else, don't touch it
} else {
    pkg.main = 'index.js'; // Safe for Node CLI
    pkg['react-native'] = 'src/index.ts'; // Safe for Metro
    changed = true;
}

// 2. Use conditional exports for modern Node/Metro
if (pkg.exports && pkg.exports['.']) {
    // We want to serve 'src/index.ts' to Metro (react-native condition)
    // and 'index.js' (the stub) to everything else (Node CLI)
    pkg.exports['.'] = {
        types: './build/index.d.ts',
        'react-native': './src/index.ts', // Metro will pick this up
        default: './index.js' // Node/CLI will pick this up
    };
    changed = true;
}

if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('[patch-expo-modules] ✅ Patched expo-modules-core with conditional exports (Node 20 + Metro safe).');
} else {
    console.log('[patch-expo-modules] expo-modules-core already patched, skipping.');
}
