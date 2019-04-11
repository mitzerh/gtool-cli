
const config = require('../../config');
const Helper = require('../helper');
const log = console.log;
const os = require('os');
const fs = require('fs');

const cmd = process.argv[3];

module.exports = (opts) => {

    let arr = process.argv;
    let iter = 0;
    let settings = {};

    while (iter < arr.length) {
        if (/^--/.test(arr[iter])) {
            settings[arr[iter].replace(/^--/, '')] = arr[iter+1];
            iter++;
        }
        iter++;
    }

    if (Helper.isEmptyObj(settings)) { return; }
    
    // save
    let curr = {};
    if (!Helper.isFileExists(config.userConfig.file)) {
        Helper.createDir(config.userConfig.path);
    } else {
        curr = JSON.parse(Helper.readFile(config.userConfig.file));
    }

    curr = JSON.stringify(Object.assign(curr, settings), null, 2);
    Helper.writeFile(config.userConfig.file, curr);

    log('saved config:', config.userConfig.file.cyan);

};
