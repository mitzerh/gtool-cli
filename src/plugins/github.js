const log = console.log;

class Plugin {

    constructor() {
        this._name = 'github';
    }

    /**
     * check whether based on the remote fetch url it is this plugin's repo
     */
    isPlugin(remoteUrl) {
        return /github\.com/.test(remoteUrl);
    }

    /**
     * get the name of this plugin
     */
    name() {
        return this._name;
    }

    /**
     * get the web url of the repo
     */
    url(info) {
        let path = this.pathname(info);
        path = path.replace(/\.git$/, '');
        return `https://github.com/${path}`;
    }

    /**
     * pull request web url
     */
    pullRequestUrl(info) {
        let url = this.url(info);
        let targetBranch = info.targetBranch || info.base;
        return `${url}/compare/${targetBranch}...${info.currBranch}`;
    }

    /**
     * pathname
     */
    pathname(info) {
        let match = info.remote.match(/github\.com(|.+)\:(.+)/);
        return match.pop();
    }

}

module.exports = Plugin;
