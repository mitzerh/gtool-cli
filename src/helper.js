const CLIHelper = require('cli-helper').constructor;
const fs = require('fs');
const path = require('path');
const open = require('open');
const log = console.log;

class Helper extends CLIHelper {

    constructor() {
        super();
    }

    mkdir(val) {

    }

    repoDir(val) {
        let base = this.shellCmd('git rev-parse --git-dir 2> /dev/null', val);
        return (base === '.git') ? val : (base.replace(/\/\.git$/, ''));
    }

    isEmptyObj(obj) {
        let res = true;
        for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, 'key')) {
                res = false;
                break;
            }
        }
        return res;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    opener(url, config) {
        let browser = config.userConfig.browser || 'default';

        let use = (/chrome/i.test(browser)) ?
            'chrome' : (/firefox/i.test(browser)) ?
            'firefox' : (/edge/i.test(browser)) ?
            'edge' : null

        let opts = {};
        if (use) {
            opts = {
                app: {
                    name: open.apps[use]
                }
            };
        }

        log(`opening [ browser "${use || 'default'}" ]:`);
        log(url.cyan, '\n');
        open(url, opts);
    }
}

module.exports = new Helper;
