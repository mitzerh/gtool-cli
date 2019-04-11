#!/usr/bin/env node

require('colors');
const config = require('./config');
const Helper = require('./src/helper');
const GitCmd = require('./src/git.commands');
const path = require('path');
const currDir = process.cwd();
const log = console.log;

const cmd = process.argv[2];

// check cmd arg
if (!cmd) {
    log('command required!'.red);
    exit();
}

// check cmd arg = method
if (!Helper.isFileExists(`${config.dir.src}/methods/${cmd}.js`)) {
    log('command does not exist!'.red);
    exit();
}

// check curr path if git repo
let repoDir = Helper.repoDir(currDir);

if (!repoDir) {
    log('current path is not a git repo!'.red);
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
