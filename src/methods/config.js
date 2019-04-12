/**
 * Set custom user configuration properties.
 * The custom configuration will be found at {HOME_DIR}/gtool-cli/config
 */
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
    let deletions = [];

    while (iter < arr.length) {
        if (/^--/.test(arr[iter])) {
            let key = arr[iter].replace(/^--/, '');
            let val = arr[iter+1];
            if (key === 'del') {
                deletions.push(val);
            } else {
                settings[key] = val;
            }
            iter++;
        }
        iter++;
    }

    // save
    let curr = {};
    if (!Helper.isFileExists(config.userConfig.file)) {
        Helper.createDir(config.userConfig.path);
    } else {
        curr = JSON.parse(Helper.readFile(config.userConfig.file));
    }

    // deletions
    if (deletions.length > 0) {
        deletions.forEach((key) => {
            if (curr[key]) {
                delete curr[key];
            }
        });
    }

    curr = JSON.stringify(Object.assign(curr, settings), null, 2);
    Helper.writeFile(config.userConfig.file, curr);

    log('saved config:', config.userConfig.file.cyan);

};
