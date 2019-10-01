const {exec} = require('../lib/index.js');
const shell = require('shelljs');

shell.rm('-rf', 'sample-folder');

exec('sample-folder');