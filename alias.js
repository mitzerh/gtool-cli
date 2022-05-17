
const moduleAlias = require('module-alias');
const dir = __dirname;

const list = {
    '@config': `${dir}/config`,
    '@src': `${dir}/src`,
    '@methods': `${dir}/src/methods`,
    '@features': `${dir}/src/features`,
};

moduleAlias.addAliases(list);
