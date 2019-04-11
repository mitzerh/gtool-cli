
const config = require('../../config');
const Helper = require('../helper');
const open = require('open');
const log = console.log;

module.exports = (opts) => {
    const details = opts.gitCmd.getDetails();
    if (details && details.url) {
        let browser = config.userConfig.browser || 'default';
        log('opening:', `[ browser:${browser} ]`, details.url.cyan);
        open(details.url, {
            app: config.userConfig.browser
        });
    }
};
