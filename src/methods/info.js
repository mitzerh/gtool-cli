/**
 * Print out the information details about the repository
 */
const config = require('@config');
const Helper = require('@src/helper');
const log = console.log;

let detailed = Helper.getOptArg('--detail');

module.exports = (opts) => {
    let echo = [''];
    const gitCmd = opts.gitCmd;
    let info = gitCmd.getDetails();
    echo.push('Repository Details:'.green);

    if (detailed) {
        for (let id in info) {
            let idstr = Helper.capitalize(id) + addSpaces((6 - id.length));
            echo.push(`${idstr} :` + ` ${info[id]}`.cyan);
        }
    } else {
        echo.push('Name    : ' + info.name.cyan);
        echo.push('Remote  : ' + `(${info.type}) ${info.remote}`.cyan);
        echo.push('Web Url : ' + info.url.cyan);
        echo.push('Default : ' + info.base.brightRed);
    }

    echo.push('\nBranch Details:'.green);

    let currBranch = gitCmd.get('current-branch');
    let sha = gitCmd.get('head-sha');
    let shaRemote = gitCmd.get('head-sha-origin');
    if (shaRemote) {
        gitCmd.get('fetch-branch', null);
        // make sure to get the lastest remote sha
        shaRemote = gitCmd.get('head-sha-origin');
    }

    if (!shaRemote) {
        echo.push('* WARNING: This branch has not been pushed to remote yet!'.red);
    } else if (shaRemote !== sha) {
        echo.push('* Note: This branch is not updated on remote!'.yellow);
    } else {
        echo.push('* This branch is updated'.green);
    }

    echo.push('Branch Name : ' + currBranch.cyan);
    echo.push('Remote SHA  : ' + shaRemote.cyan);
    echo.push('Local SHA   : ' + sha.cyan);

    log(echo.join('\n'), '\n');
};

function addSpaces(len) {
    let arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(' ');
    }
    return arr.join('');
}
