const ip = require('ip');
const chalk = require('chalk');
const NODE_ENV = process.env.NODE_ENV || 'development';
const fs = require('fs');
const port = '1314';
const environment = process.argv[2];
const pathnameFun = (env) => `http://${env || 'test'}-opc.qiushibc.com`;
//代理配置，详细启动方法请阅读 README 最后一部分
let proxyHost = '';
switch (environment) {
  case 'test':
  case 'dev':
    proxyHost = pathnameFun(environment);
    break;
  case 'mock':
    proxyHost = fs.readFileSync('./.env.local').toString();
    if (!proxyHost) {
      console.log(chalk.yellow('请在 .env.local 文件中配置 mock 服务代理'));
      process.exit();
    }
    break;
  default:
    proxyHost = pathnameFun('test');
}
module.exports = {
  ip,
  port,
  env: NODE_ENV,
  basePath: __dirname,
  srcDir: 'src',
  main: 'main',
  outDir: 'dist',
  publicPath: NODE_ENV === 'development' ? `http://${ip.address()}:${port}/` : './',
  sourcemaps: NODE_ENV === 'development',
  proxyHost,
  externals: {},
  globals: {},
  verbose: false,
  vendors: [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'redux-thunk',
    'react-router-dom',
    'babel-polyfill',
  ],
  // 转发的请求地址
  proxyApiPathArr: [
    'api',
    // 'login'
  ],
};
