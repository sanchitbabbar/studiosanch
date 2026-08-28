import { readdir, readFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Fail the build if private material or executable PHP enters the static export.
const root = path.resolve('out');
// These retired handlers are retained as 503 responses for PHP hosting only.
for (const name of ['subscribe.php', 'appointment.php']) {
  await unlink(path.join(root, 'php', name)).catch(error => { if (error.code !== 'ENOENT') throw error; });
}
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    const relative = path.relative(root, file);
    assert(!entry.isSymbolicLink(), `Symlink in export: ${relative}`);
    assert(!/^(archive|output|backend|node_modules|\.git)(\/|$)/.test(relative), `Private directory: ${relative}`);
    assert(!/(^|\/)(\.env[^/]*|subscribers\.txt|dashboard\.db)$|\.(sqlite|db|pem|key|sql)$/i.test(relative), `Sensitive file: ${relative}`);
    if (entry.isDirectory()) await inspect(file);
    else if (/\.php$/i.test(file)) {
      const contents = await readFile(file, 'utf8');
      // PHP-looking route names may be static route artifacts, but never PHP source.
      assert(!contents.includes('<?php'), `Executable PHP source in export: ${relative}`);
    }
  }
}
await inspect(root);
const headers = await readFile(path.join(root, '_headers'), 'utf8');
assert(headers.includes('X-Frame-Options: DENY'));
const routes = JSON.parse(await readFile(path.join(root, '_routes.json'), 'utf8'));
assert(routes.include.includes('/php/*'));
console.log('Export safety checks passed.');
