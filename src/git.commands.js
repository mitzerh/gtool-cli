const Helper = require('cli-helper').instance;
const fs = require('fs');
const path = require('path');

const defaultPlugins = require('./plugins');

class GitCmd {

    constructor(dir, plugins) {
        this._dir = dir;
        this._plugins = plugins;
        this._info = {
            fetchUrl: (cmd('git remote show -n origin | grep Fetch', this._dir)).trim(),
            currBranch: cmd('git rev-parse --abbrev-ref HEAD', this._dir)
        };
    }

    getRepoRemote() {
        return this._info.remote || (() => {
            let res = this._info.fetchUrl.replace(/^([^:]+)\:\s+/i, '');
            this._info.remote = res;
            return res;
        })();
    }

    getRepoName() {
        return this._info.name || (() => {
            let remote = this.getRepoRemote();
            let match = remote.match(/\/[^\/]+$/);
            let res = match[0].replace(/^\//, '').replace(/\.git$/, '');
            this._info.name = res;
            return res;
        })();
    }

    getUrl(info) {
        let res = null;
        let method = 'getUrl';
        res = customPlugin(method, info, this._plugins);
        // try defaults
        if (!res) {
            res = defaultPlugins[method](info);
        }
        return res;
    }

    getPullRequestUrl(info) {
        let res = null;
        let method = 'getPullRequestUrl';
        res = customPlugin(method, info, this._plugins);
        // try defaults
        if (!res) {
            res = defaultPlugins[method](info);
        }
        return res;
    }

    getDetails() {
        return this._info.details || (() => {
            let remote = this.getRepoRemote();
            let name = this.getRepoName();
            let type = /^https/.test(remote) ? 'https' : 'ssh';
            let path = (type === 'ssh') ? remote.match(/[^\:]+$/)[0] : (() => {
                let match = remote.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/);
                return match[3];
            })();

            let res = {
                type: type.toUpperCase(),
                remote: remote,
                name: name,
                path: path,
                base: 'master' // todo: pull from api
            };

            res = Object.assign(res, {
                url: this.getUrl(res)
            });

            this._info.details = res;
            return res;

        })();
    }

    get(type, opts, verbose) {
        opts = opts || {};
        let cmd = null;
        let branch = opts.branch || this._info.currBranch;

        switch (type) {

            // curent branch
            case "current-branch":
                return this._info.currBranch;

            // HEAD commit sha
            case "head-sha":
                cmd = "git rev-parse --short HEAD";
                break;

            case "head-sha-origin":
                cmd = `git rev-parse --short origin/${branch}`;
                break;

            case "status":
                cmd = "git status -sb";
                break;

            case "diff-status":
                cmd = "git diff --name-status";
                break;

            case "diff-status-origin":
                cmd = `git diff --name-status ${branch} ^origin/${branch}`;
                break;

            case "diff-sha-changed-files":
                cmd = `git diff --name-only ${opts.shaBefore} ${opts.shaAfter}`;
                break;

            // case 'origin-reset':
            //     cmd = `git reset --hard origin/${props.CURRENT_BRANCH}`;
            //     break;

            case 'fetch-all':
                cmd = `git fetch --all && git fetch --tags`;
                break;

        }

        let output = '';
        if (cmd) {
            output = Helper.shellCmd(cmd, this._dir, verbose) || '';
        }
        return output;
    }

}

function hasPluginMethod(plugin, method) {
    return (typeof plugin === 'object' && typeof plugin[method] === 'function') ? true : false;

}

function cmd(cmd, path, opt) {
    return Helper.shellCmd(cmd, path, opt);
}

function customPlugin(method, info, plugins) {
    let res = null;
    if (Array.isArray(plugins)) {
        for (let i = 0; i < plugins[i]; i++) {
            let plugin = plugins[i];
            if (hasPluginMethod(plugin, method)) {
                res = plugin[method](info);
                if (res) { break; }
            }
        }
    }
    return res;
}

module.exports = GitCmd;
