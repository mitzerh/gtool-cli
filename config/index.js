const path = require('path');
const os = require('os');
const base = path.resolve(`${__dirname}/../`);
const Helper = require('cli-helper').instance;

module.exports = {

    dir: {
        base: base,
        src: `${base}/src`
    },

    userConfig: ((homedir) => {

        let path = `${homedir}/.gtool-cli`;
        let filename = 'config';
        let file = `${path}/${filename}`;

        let defaults = {
            path: path,
            filename: filename,
            file: file,
            // using open 'app' key
            browser: null
        };

        let user = {};

        if (Helper.isFileExists(file)) {
            try {
                user = JSON.parse(Helper.readFile(file));
            } catch(err) {
                // error reading config file
            }
        }
        return Object.assign(defaults, user);

    })(os.homedir())

};
