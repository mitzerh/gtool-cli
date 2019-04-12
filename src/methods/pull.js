
const config = require('../../config');
const Helper = require('../helper');
const log = console.log;

module.exports = (opts) => {
    let gitCmd = opts.gitCmd;

    let currBranch = gitCmd.get('current-branch');
    let info = gitCmd.getDetails();

    // check first if current branch is up-to-date on origin
    let sha = gitCmd.get('head-sha');
    let shaRemote = gitCmd.get('head-sha-origin');

    log('BRANCH :', currBranch.cyan);
    log('remote :', shaRemote.cyan);
    log('local  :', sha.cyan, '\n');

    if (!shaRemote) {
        return log('You have not pushed this branch to remote yet!\n'.red);
    } else if (sha !== shaRemote) {
        return log('Please make sure you have the lastest updates on origin for this branch!\n'.red);
    }

    let pullRequestUrl = gitCmd.getPullRequestUrl(Object.assign(info, {
        currBranch: currBranch
    }));

    if (pullRequestUrl) {
        Helper.opener(pullRequestUrl, config);
    }
};
