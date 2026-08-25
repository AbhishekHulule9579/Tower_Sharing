const fs = require('fs');
const path = require('path');

console.log('Running patch-node-check to allow Angular CLI to run on Node.js 18.12.0...');

// Polyfill URL.canParse and os.availableParallelism in current process as well
const os = require('os');
if (!os.availableParallelism) {
  os.availableParallelism = () => os.cpus().length;
}

const urlModule = require('url');
if (typeof URL.canParse !== 'function') {
  const canParsePolyfill = function (url, base) {
    try {
      return !!new URL(url, base);
    } catch (e) {
      return false;
    }
  };
  URL.canParse = canParsePolyfill;
  if (typeof globalThis !== 'undefined' && globalThis.URL) {
    globalThis.URL.canParse = canParsePolyfill;
  }
  if (urlModule) {
    urlModule.canParse = canParsePolyfill;
  }
}

// 1. Patch bin/ng.js
const ngPath = path.join(__dirname, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');
if (fs.existsSync(ngPath)) {
  let content = fs.readFileSync(ngPath, 'utf8');
  if (!content.includes('URL.canParse')) {
    const polyfillCode = `
const osModule = require('os');
if (!osModule.availableParallelism) osModule.availableParallelism = () => osModule.cpus().length;
const urlModule = require('url');
if (typeof URL.canParse !== 'function') {
  const canParsePolyfill = function (url, base) {
    try { return !!new URL(url, base); } catch (e) { return false; }
  };
  URL.canParse = canParsePolyfill;
  if (typeof globalThis !== 'undefined' && globalThis.URL) globalThis.URL.canParse = canParsePolyfill;
  if (urlModule) urlModule.canParse = canParsePolyfill;
}
`;
    content = content.replace(
      "const path = require('path');",
      "const path = require('path');\n" + polyfillCode
    );
  }
  content = content.replace(
    /version\[0\] < 18 \|\| \(version\[0\] === 18 && version\[1\] < 19\)/g,
    'version[0] < 18'
  );
  fs.writeFileSync(ngPath, content, 'utf8');
}

// 2. Patch lib/cli/index.js
const cliIndexPath = path.join(__dirname, 'node_modules', '@angular', 'cli', 'lib', 'cli', 'index.js');
if (fs.existsSync(cliIndexPath)) {
  let content = fs.readFileSync(cliIndexPath, 'utf8');
  content = content.replace(
    'const MIN_NODEJS_VERSION = [18, 13];',
    'const MIN_NODEJS_VERSION = [18, 0];'
  );
  fs.writeFileSync(cliIndexPath, content, 'utf8');
}

// 3. Patch @angular/build/src/utils/environment-options.js
const envOptionsPath = path.join(__dirname, 'node_modules', '@angular', 'build', 'src', 'utils', 'environment-options.js');
if (fs.existsSync(envOptionsPath)) {
  let content = fs.readFileSync(envOptionsPath, 'utf8');
  content = content.replace(
    '(0, node_os_1.availableParallelism)()',
    "(typeof node_os_1.availableParallelism === 'function' ? (0, node_os_1.availableParallelism)() : (0, node_os_1.cpus)().length)"
  );
  fs.writeFileSync(envOptionsPath, content, 'utf8');
}

console.log('Node compatibility patches applied successfully!');
