import isexe from 'isexe';
import spawn from 'nano-spawn';

const binCheck = (bin, args) => {
	if (!Array.isArray(args)) {
		args = ['--help'];
	}

	return isexe(bin)
		.then(works => {
			if (!works) {
				throw new Error(`Couldn't execute the "${bin}" binary. Make sure it has the right permissions.`);
			}

			return spawn(bin, args);
		})
		// Could also try result.stderr === ''
		.then(result => result.exitCode === undefined || result.exitCode === 0);
};

export default binCheck;
