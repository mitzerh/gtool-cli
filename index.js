#!/usr/bin/env node

require('colors');
require('./alias');
const config = require('@config');
const Helper = require('@src/helper');
const GitCmd = require('@src/git');
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

const repoDir = Helper.repoDir(currDir);
const gitCmd = new GitCmd(repoDir);

// check if feature first
if (Helper.isFileExists(`${config.dir.src}/features/${cmd}/index.js`)) {
    setFeature();
}
// check cmd arg = method
else if (Helper.isFileExists(`${config.dir.src}/methods/${cmd}.js`)) {
    setMethod();
} else {
    log('command does not exist!\n'.red);
    exit();
}

function setMethod() {


    if (!repoDir) {
        log('current path is not a git repo!\n'.red);
        exit();
    }

    require(`${config.dir.src}/methods/${cmd}`)({
        gitCmd: gitCmd,
        currDir: currDir
    });
}

function setFeature() {
    require(`${config.dir.src}/features/${cmd}`)({
        gitCmd: gitCmd,
        currDir: currDir
    });
}


function exit() {
    process.exit();
}
