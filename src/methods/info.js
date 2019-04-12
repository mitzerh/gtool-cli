
const config = require('../../config');
const Helper = require('../helper');
const log = console.log;

let detailed = Helper.getOptArg('--detail');

module.exports = (opts) => {
    let echo = [];
    let info = opts.gitCmd.getDetails();
    log ('Repository Details:'.green);

    if (detailed) {
        for (let id in info) {
            let idstr = Helper.capitalize(id) + addSpaces((6 - id.length));
            echo.push(`${idstr} :` + ` ${info[id]}`.cyan);
        }
    } else {
        echo.push('Name    : ' + info.name.cyan);
        echo.push('Remote  : ' + `(${info.type}) ${info.remote}`.cyan);
        echo.push('Web Url : ' + info.url.cyan);
    }
    
    log(echo.join('\n'), '\n');
};

function addSpaces(len) {
    let arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(' ');
    }
    return arr.join('');
}
