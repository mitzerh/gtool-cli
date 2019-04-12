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
            if (obj.hasOwnProperty(key)) {
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
        log(`opening [ ${browser} ]:`);
        log(url.cyan, '\n');
        open(url, {
            app: config.userConfig.browser
        });
    }
}

module.exports = new Helper;
