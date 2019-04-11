
const githubPlugin = require('./github');

class Plugins {

    constructor() {

    }

    getUrl(info) {
        let res = null;
        let type = this.getKnownType(info.remote);
        switch (type) {
            case 'github':
                res = githubPlugin.getUrl(info);
                break;
        }
        return res;
    }

    getPullRequestUrl(info) {
        let res = null;
        let type = this.getKnownType(info.remote);
        switch (type) {
            case 'github':
                res = githubPlugin.getPullRequestUrl(info);
                break;
        }
        return res;
    }

    getKnownType(val) {
        let res = null;
        if (/github\.com/.test(val)) {
            res = 'github';
        }
        return res;
    }


}

module.exports = new Plugins;
