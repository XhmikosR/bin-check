'use strict';

var executable = require('executable');
var spawn = require('child_process').spawn;

/**
 * Check if a executable is working correctly by checking it's exit code
 *
 * @param {String} name
 * @param {String|Array} cmd
 * @param {Function} cb
 * @api public
 */

module.exports = function (name, cmd, cb) {
    var bin;

    if (typeof cmd === 'function') {
        cb = cmd;
        cmd = ['--help'];
    }

    cmd = cmd || ['--help'];
    cmd = Array.isArray(cmd) ? cmd : [cmd];

    executable(name, function (err, works) {
        if (err) {
            return cb(err);
        }

        if (works) {
            bin = spawn(name, cmd);

            bin.on('error', function (err) {
                return cb(err);
            });

            bin.on('exit', function (code) {
                return cb(null, code === 0 ? true : false);
            });
        } else {
            return cb(null, false);
        }
    });
};