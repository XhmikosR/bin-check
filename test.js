import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import binCheck from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bin = {
	darwin: path.join(__dirname, 'fixtures/optipng-osx'),
	linux: path.join(__dirname, 'fixtures/optipng-linux'),
	win32: path.join(__dirname, 'fixtures/optipng-win32.exe'),
};

const nonExecutable = path.join(__dirname, 'readme.md');
const permissionError = {message: `Couldn't execute the "${nonExecutable}" binary. Make sure it has the right permissions.`};

// Passes isexe but fails to spawn: not a PE file on Windows, missing interpreter elsewhere
const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bin-check-'));
const unspawnable = path.join(temporaryDir, process.platform === 'win32' ? 'broken.exe' : 'broken');
fs.writeFileSync(unspawnable, process.platform === 'win32' ? 'not an executable\n' : '#!/nonexistent\n', {mode: 0o755});

test.after.always(() => {
	fs.rmSync(temporaryDir, {force: true, recursive: true});
});

test('async', async t => {
	t.true(await binCheck(bin[process.platform]));
	t.false(await binCheck(process.execPath, ['-e', 'process.exit(2)']));
	t.false(await binCheck(unspawnable));
	await t.throwsAsync(binCheck(nonExecutable), permissionError);
});

test('sync', t => {
	t.true(binCheck.sync(bin[process.platform]));
	t.false(binCheck.sync(process.execPath, ['-e', 'process.exit(2)']));
	t.false(binCheck.sync(unspawnable));
	t.throws(() => binCheck.sync(nonExecutable), permissionError);
});
