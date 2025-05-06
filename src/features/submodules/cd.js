const config = require('@config');
const Helper = require('@src/helper');
const log = console.log;

let subName = process.argv[4] || null;

module.exports = (opts) => {
  //log('todo:submodules:go', opts);

  const subInfo = opts.submodules;

  if (!subName) {
    if (subInfo.keys.length === 1) {
      subName = subInfo.keys[0];
    } else {
      log('Missing submodule name!');
      log('Example   :', 'gtool sub cd [name]'.red);
      log('Available :', `${subInfo.keys.toString()}`.green);
      return;
    }
  } else {
    if (!subInfo.keys.includes(subName)) {
      log('Submodule name not found!');
      log('Available :', `${subInfo.keys.toString()}`.green);
      return;
    }
  }

  const info = subInfo.items[subName],
    repodir = opts.gitCmd._dir;

  let fpath = `${repodir}/${info.path}`;
  process.chdir(`${repodir}/${info.path}`);

  log('process');

};
