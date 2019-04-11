
const config = require('../../config');
const Helper = require('../helper');
const log = console.log;

module.exports = (opts) => {
    let echo = [];
    let info = opts.gitCmd.getDetails();
    log ('Repository Details:'.green);
    for (let id in info) {
        let idstr = Helper.capitalize(id) + addSpaces((6 - id.length));
        echo.push(`${idstr} :` + ` ${info[id]}`.cyan);
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
