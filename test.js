import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import binCheck from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);

const bin = {
	darwin: path.join(__dirname, 'fixtures/optipng-osx'),
	linux: path.join(__dirname, 'fixtures/optipng-linux'),
	win32: path.join(__dirname, 'fixtures/optipng-win32.exe'),
};

test('async', async t => {
	t.true(await binCheck(bin[process.platform]));
	await t.throwsAsync(
		binCheck('node', [__filename]),
		undefined,
		`Couldn't execute the "${__filename}" binary. Make sure it has the right permissions.`,
	);
});
