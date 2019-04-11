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

    getRepoOrigin() {
        return this._info.name || (() => {
            let res = this._info.fetchUrl.replace(/^([^:]+)\:\s+/i, '');
            this._info.name = res;
            return res;
        })();
    }

    getRepoName() {
        return this._info.name || (() => {
            let origin = this.getRepoOrigin();
            let match = origin.match(/\/[^\/]+$/);
            let res = match[0].replace(/^\//, '').replace(/\.git$/, '');
            this._info.name = res;
            return res;

        })();
    }

    getUrl(info) {
        let res = null;
        let method = 'getUrl';

        if (Array.isArray(this._plugins)) {
            for (let i = 0; i < this._plugins[i]; i++) {
                let plugin = this._plugins[i];
                if (hasPluginMethod(plugin, method)) {
                    res = plugin[method](info);
                    if (res) { break; }
                }
            }
        }

        // try defaults
        if (!res) {
            res = defaultPlugins[method](info);
        }

        return res;

    }

    getDetails() {
        return this._info.details || (() => {
            let origin = this.getRepoOrigin();
            let name = this.getRepoName();
            let type = /^https/.test(origin) ? 'https' : 'ssh';
            let path = (type === 'ssh') ? origin.match(/[^\:]+$/)[0] : (() => {
                let match = origin.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/);
                return match[3];
            })();

            let res = {
                type: type,
                origin: origin,
                name: name,
                path: path
            };

            res = Object.assign(res, {
                url: this.getUrl(res)
            });

            this._info.details = res;
            return res;

        })();
    }

    get(type, opts, verbose) {
        let cmd = null;

        switch (type) {

            // curent branch
            case "current-branch":
                return this._info.currBranch;

            // HEAD commit sha
            case "head-sha":
                cmd = "git rev-parse --short HEAD";
                break;

            case "head-sha-origin":
                cmd = `git rev-parse --short origin/${this._info.currBranch}`;
                break;

            case "status":
                cmd = "git status -sb";
                break;

            case "diff-status":
                cmd = "git diff --name-status";
                break;

            case "diff-status-origin":
                cmd = `git diff --name-status ${this._info.currBranch} ^origin/${this._info.currBranch}`;
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

module.exports = GitCmd;
