import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Build with Vite
console.log('Building with Vite...');
execSync('vite build', { stdio: 'inherit' });

// Add Tampermonkey headers
const userscriptPath = resolve('dist/userscript.js');
const content = readFileSync(userscriptPath, 'utf-8');

const headers = `// ==UserScript==
// @name         WPlace Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Keyboard shortcuts and enhancements for WPlace drawing
// @author       Vitroid
// @match        https://wplace.live/
// @grant        none
// @run-at       document-end
// ==/UserScript==

`;

writeFileSync(userscriptPath, headers + content);
console.log('Added Tampermonkey headers to userscript.js');
