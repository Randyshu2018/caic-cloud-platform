const net = require('net');
// const port = process.env.PORT ? (process.env.PORT - 100) : 3000;
const port = require('../project.config').port;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;
// process.env.ELECTRON_START_URL = 'http://172.28.116.63:1314';

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;
            const exec = require('child_process').exec;
            exec('npm run electron');
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});
