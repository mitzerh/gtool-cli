/**
 * Attempt to open the Pull Request web url
 */
const config = require('@config');
const Helper = require('@src/helper');
const log = console.log;

module.exports = (opts) => {
    let gitCmd = opts.gitCmd;

    let currBranch = gitCmd.get('current-branch');
    let targetBranch = Helper.getOpt('target') || null;
    let info = gitCmd.getDetails();

    // check first if current branch is up-to-date on origin
    let shaRemote = gitCmd.get('head-sha-origin');
    // if in remote fetch first
    if (shaRemote) {
        gitCmd.get('fetch-branch', null);
        // make sure to get the lastest remote sha
        shaRemote = gitCmd.get('head-sha-origin');
    }
    let sha = gitCmd.get('head-sha');

    log('BRANCH :', currBranch.cyan);
    log('remote :', shaRemote.cyan);
    log('local  :', sha.cyan, '\n');

    if (!shaRemote) {
        return log('You have not pushed this branch to remote yet!\n'.red);
    } else if (sha !== shaRemote) {
        return log('Please make sure you have the lastest updates on origin for this branch!\n'.red);
    }

    let pullRequestUrl = gitCmd.getPullRequestUrl(Object.assign(info, {
        currBranch: currBranch,
        targetBranch: targetBranch
    }));

    if (pullRequestUrl) {
        Helper.opener(pullRequestUrl, config);
    }
};
