const port = require('../project.config').port;
const chalk = require('chalk');
const portIsOccupied = require('./portUsed');
const open = require('open');
const ip = require('ip');
console.log(chalk.green('Starting server...'));
portIsOccupied(port).then((p) => {
  require('./server.js').listen(p, () => {
    console.log(chalk.green('Server is running at http://' + ip.address() + `:${p}`));
    open('http://' + ip.address() + `:${p}`);
  });
});
