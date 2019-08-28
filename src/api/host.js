let { hostname } = window.location;

hostname = hostname.replace(/\..*/, '');

const api = {
  'test-opc': 'http://test-opc.qiushibc.com',
  'dev-opc': 'http://dev-opc.qiushibc.com',
  opc: 'http://dev-opc.qiushibc.com',
};
let baseURL = '';
switch (hostname) {
  case 'test-opc':
  case 'dev-opc':
  case 'opc':
    baseURL = api[hostname];
    break;
  default:
    baseURL = api['dev-opc'];
}
// baseURL='http://172.28.120.152:8074'
export default baseURL;
