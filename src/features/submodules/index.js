const config = require('@config');
const Helper = require('@src/helper');
const ini = require('ini');
const log = console.log;
const dir = __dirname;

const cmd = process.argv[3] || null;

module.exports = (opts) => {

  //log('todo:submodules', opts);

  // check if the repo has submodules
  const repodir = opts.gitCmd._dir,
    iniFile = `${repodir}/.gitmodules`;

  if (!Helper.isFileExists(iniFile)) {
    return log('no submodules found..');
  }

  let info = ini.parse(Helper.readFile(iniFile));
  let items = {};

  for (let id in info) {
    let name = getName(id);
    if (name) {
      items[name] = Object.assign({}, info[id]);
    }
  }

  opts.submodules = {
    keys: Object.keys(items),
    items
  };


  // if no command, just show info
  if (!cmd) {
    console.log(opts.submodules);
    return;
  }

  if (!Helper.isFileExists(`${dir}/${cmd}.js`)) {
    console.log('submodule command not found..');
    return;
  }

  const inst = require(`./${cmd}`)(opts);

  function getName(val) {
    let match = val.match(/submodule \"(.+)\"/);
    return match[1] || null;
  }

};
