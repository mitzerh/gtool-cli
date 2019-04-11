const log = console.log;

class Plugin {

    constructor() {

    }

    getUrl(info) {
        let path = info.path.replace(/\.git$/, '');
        return `https://github.com/${path}`;
    }

    getPullRequestUrl(info) {
        let res = null;
        try {
            let url = this.getUrl(info);
            let targetBranch = info.targetBranch || info.base;

            if (info.currBranch !== targetBranch) {
                res = `${url}/compare/${info.currBranch}...${targetBranch}`;
            } else {
                log('ignored.. current branch is the same as the base branch.\n');
            }
        } catch(err) {
            console.log('getPullRequestUrl() error:', err);
        }
        return res;
    }

}

module.exports = new Plugin;
