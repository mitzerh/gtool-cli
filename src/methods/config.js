/**
 * Set custom user configuration properties.
 * The custom configuration will be found at {HOME_DIR}/gtool-cli/config
 */
const config = require('@config');
const Helper = require('@src/helper');
const log = console.log;
const os = require('os');
const fs = require('fs');

const cmd = process.argv[3];

module.exports = (opts) => {

    let arr = process.argv.slice(3);

    if (arr.length === 0) {
        return showConfig();
    }

    const cmd = arr[0];
    const proceed = /set|unset/.test(cmd);
    const allow =  [
        'browser'
    ];

    if (!proceed) { return helperStr(); };

    let set = {};
    let unset = null;
    let save = true;

    // current
    let curr = (() => {
        let res = {};
        if (!Helper.isFileExists(config.userConfig.file)) {
            Helper.createDir(config.userConfig.path);
        } else {
            res = JSON.parse(Helper.readFile(config.userConfig.file));
        }
        return res;
    })();

    const key = arr[1];

    switch (cmd) {

        case "set":
            (() => {
                save = (
                    allow.includes(key) &&
                    arr.length >= 3
                ) ? true : false;

                if (save) {
                    set[key] = (arr.splice(2)).join(' ');
                } else {
                    log('cannot set config!');
                }
            })();
            break;

        case "unset":
            (() => {
                let key = arr[1];
                save = (
                    allow.includes(key) ||
                    curr[key]
                ) ? true : false;

                if (save) {
                    unset = arr[1];
                } else {
                    log('cannot unset key!');
                }
            })();
            break;

    }

    if (!save) { return; }

    // deletion
    if (unset) {
        if (curr[unset]) {
            delete curr[unset];
        }
    }

    // save json config
    curr = JSON.stringify(Object.assign(curr, set), null, 2);
    Helper.writeFile(config.userConfig.file, curr);
    log('saved config:', config.userConfig.file.cyan);

};

function showConfig() {
    if (!Helper.isFileExists(config.userConfig.file)) { return log('no user custom config defined.\n'); }
    let conf = JSON.stringify(JSON.parse(Helper.readFile(config.userConfig.file)), null, 2);
    log('User Custom Config:'.green);
    log(conf, '\n');
}

function helperStr() {
    log('config commands: set, unset');
    log('example:');
    log('gtool config set browser chrome');
    log('gtool config unset browser');
}
