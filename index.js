#!/usr/bin/env node

require('colors');
const config = require('./config');
const Helper = require('./src/helper');
const GitCmd = require('./src/git');
const path = require('path');
const currDir = process.cwd();
const log = console.log;

let cmd = ((val) => {
    return config.commandAlias[val] || val;
})(process.argv[2]);

// check cmd arg
if (!cmd) {
    log('command required!\n'.red);
    exit();
}

// check cmd arg = method
if (!Helper.isFileExists(`${config.dir.src}/methods/${cmd}.js`)) {
    log('command does not exist!\n'.red);
    exit();
}

// check curr path if git repo
let repoDir = Helper.repoDir(currDir);

if (!repoDir) {
    log('current path is not a git repo!\n'.red);
    exit();
}

const gitCmd = new GitCmd(repoDir);

require(`${config.dir.src}/methods/${cmd}`)({
    gitCmd: gitCmd,
    currDir: currDir
});

function exit() {
    process.exit();
}
