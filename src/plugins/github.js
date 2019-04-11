const log = console.log;

class Plugin {

    constructor() {

    }

    getRepoType(remoteUrl) {
        return (/github\.com/.test(remoteUrl)) ? 'github' : null;
    }

    getUrl(info) {
        if (info.repo !== 'github') { return null; }
        let path = info.path.replace(/\.git$/, '');
        res = `https://github.com/${path}`;
    }

    getPullRequestUrl(info) {
        if (info.repo !== 'github') { return null; }
        let url = this.getUrl(info);
        let targetBranch = info.targetBranch || info.base;
        return `${url}/compare/${info.currBranch}...${targetBranch}`;
    }

}

module.exports = Plugin;
