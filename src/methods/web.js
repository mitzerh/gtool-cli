/**
 * Get the browser url of the repository and attempt to open it
 */
const config = require('@config');
const Helper = require('@src/helper');
const log = console.log;

module.exports = (opts) => {
    const details = opts.gitCmd.getDetails();
    if (details && details.url) {
        Helper.opener(details.url, config);
    }
};
