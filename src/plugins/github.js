class Plugin {

    constructor() {

    }

    getUrl(info) {
        let path = info.path.replace(/\.git$/, '');
        return `https://github.com/${path}`;
    }


}

module.exports = new Plugin;
