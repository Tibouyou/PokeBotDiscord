const { promisify } = require('util');
const { glob } = require('glob');
const pGlob = promisify(glob);
const Logger = require('../Logger');

module.exports = async client => {
  (await pGlob(`${process.cwd()}/buttons/*/*.js`)).map(async btnFile => {
    const btn = require(btnFile);

    if (!btn.name) return Logger.warn(`Bouton non-chargé: pas de nom\nFichier -> ${btnFile}`);
    
    client.buttons.set(btn.name, btn);
  });
};


