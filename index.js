import isexe from 'isexe';
import {x} from 'tinyexec';

const binCheck = (bin, args) => {
	if (!Array.isArray(args)) {
		args = ['--help'];
	}

	return isexe(bin)
		.then(works => {
			if (!works) {
				throw new Error(`Couldn't execute the "${bin}" binary. Make sure it has the right permissions.`);
			}

			return x(bin, args);
		})
		.then(result => result.exitCode === 0);
};

export default binCheck;
