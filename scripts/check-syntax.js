import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const collectJavaScript = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectJavaScript(path) : path.endsWith('.js') ? [path] : [];
});

collectJavaScript('src/js').forEach((file) => {
    execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
});

console.log('Sintaxe JavaScript validada.');
