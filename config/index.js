const path = require('path');
const os = require('os');
const fs = require('fs');
const base = path.resolve(`${__dirname}/../`);
const Helper = require('cli-helper').instance;

const homedir = os.homedir();

module.exports = {

    dir: {
        base: base,
        src: `${base}/src`
    },

    commandAlias: {
        repo: 'web'
    },

    userConfig: (() => {

        let path = `${homedir}/.gtool-cli`;
        let filename = 'config';
        let file = `${path}/${filename}`;
        let pluginsPath = `${path}/plugins`;

        let defaults = {
            path: path,
            filename: filename,
            file: file,
            plugins: getPlugins(pluginsPath),
            // using open 'app' key
            browser: null
        };

        // user custom config
        let userCustomConfig = (() => {
            let res = {};
            if (Helper.isFileExists(file)) {
                try {
                    res = JSON.parse(Helper.readFile(file));
                } catch(err) {
                    // error reading config file
                }
            }
            return res;
        })();

        return Object.assign(defaults, userCustomConfig);

    })()

};

function getPlugins(path) {
    if (!Helper.isPathExists(path)) { return []; }
    let res = [];

    fs.readdirSync(path).forEach((item) => {
        let src = `${path}/${item}`;
        try {
            let Plugin = require(src);
            res.push(new Plugin);
        } catch(err) {
            log('error getting plugin from:', src.cyan);
            log(err);
        }

    });
    return res;
}

function isDir(path) {
    return fs.lstatSync(path).isDirectory();
}
