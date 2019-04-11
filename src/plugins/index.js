
const githubPlugin = require('./github');

class Plugins extends githubPlugin {

    constructor() {
        super();
    }

}

module.exports = new Plugins;
