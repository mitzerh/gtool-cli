const config = require('../config');
const Helper = require('cli-helper').instance;
const fs = require('fs');
const path = require('path');
const log = console.log;

const defaultPlugins = require('./plugins');

class GitCmd {

    constructor(dir) {
        this._dir = dir;
        this._useDefaultPlugin = true;

        const fetchUrl = cmd('git config --get remote.origin.url');
        const currBranch = cmd('git rev-parse --abbrev-ref HEAD', this._dir);
        const remote = fetchUrl.replace(/^([^:]+)\:\s+/i, '');

        this._plugin = (() => {
            let method = 'isPlugin';
            let plugins = config.userConfig.plugins;
            let instance = defaultPlugins;
            if (Array.isArray(plugins) && plugins.length > 0) {
                for (let i = 0; i < plugins.length; i++) {
                    let plugin = plugins[i];
                    if (hasPluginMethod(plugin, method)) {
                        if (plugin[method](remote)) {
                            instance = plugin;
                            this._useDefaultPlugin = false;
                            break;
                        }
                    }
                }
            }
            return instance;
        })();

        this._info = {
            fetchUrl: fetchUrl,
            currBranch: currBranch,
            remote: remote,
            type: this._plugin.name(),
            name: (() => {
                let match = remote.match(/\/[^\/]+$/);
                return match[0].replace(/^\//, '').replace(/\.git$/, '');
            })(),
            mode: /^https/.test(remote) ? 'https' : 'ssh'
        };

    }

    getRepoName() {
        return this._info.name;
    }

    getUrl(info) {
        let res = null;
        return this._getPlugin('url', info);
    }

    getPullRequestUrl(info) {
        return this._getPlugin('pullRequestUrl', info);
    }

    getDetails() {

        return this._details || (() => {
            let remote = this._info.remote;
            let mode = this._info.mode;

            let res = {
                mode: this._info.mode.toUpperCase(),
                type: this._info.type,
                remote: remote,
                name: this._info.name,
                path: this._getPlugin('pathname', this._info),
                url: this._getPlugin('url', this._info),
                base: this.getDefaultBranch() // 'master' // todo: pull from api
            };

            this._details = res;
            return res;
        })();
    }

    getDefaultBranch() {
        const remote = this._info.remote;
        let output = '[unknown]';
        try {
            // https://stackoverflow.com/questions/28666357/how-to-get-default-git-branch
            const cmd = `git remote show ${remote} | sed -n '/HEAD branch/s/.*: //p'`;
            output = Helper.shellCmd(cmd, this._dir);
        } catch(err) {
            console.log('error getting default branch');
            console.log(err);
        }
        return output;
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

            case 'fetch-branch':
                cmd = `git fetch origin ${branch}`;
                break;
        }

        let output = '';
        if (cmd) {
            output = Helper.shellCmd(cmd, this._dir, verbose) || '';
        }
        return output;
    }

    _getPlugin(method, info) {
        let res = null;
        if (this._plugin[method]) {
            res = this._plugin[method](info);
        } else if (defaultPlugins[method]) {
            if (!this._useDefaultPlugin && !this._warned) {
                this._warned = true;
                let custom = this._info.type;
                log('ERROR:'.red, `missing method '${method}()' on your custom plugin: ${custom}\n`);
                process.exit(1);
            }
            // always try defaults just in case
            res = defaultPlugins[method](info);
        }
        return res;
    }

}

function hasPluginMethod(plugin, method) {
    return (typeof plugin === 'object' && typeof plugin[method] === 'function') ? true : false;

}

function cmd(cmd, path, opt) {
    return Helper.shellCmd(cmd, path, opt);
}

module.exports = GitCmd;
