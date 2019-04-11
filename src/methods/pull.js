
const config = require('../../config');
const Helper = require('../helper');
const log = console.log;

module.exports = (opts) => {
    let gitCmd = opts.gitCmd;

    let currBranch = gitCmd.get('current-branch');
    let info = gitCmd.getDetails();

    let pullRequestUrl = gitCmd.getPullRequestUrl(Object.assign(info, {
        currBranch: gitCmd.get('current-branch')
    }));

    if (pullRequestUrl) {
        Helper.opener(pullRequestUrl, config);
    }
};
