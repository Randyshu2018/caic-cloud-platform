import axios from 'axios';
import buildManage from './buildManage';
import rent from './rent';
import { message } from 'antd';
import { history, toggleLoading } from 'func';
import baseURL from './host';
// 接口模块
// 实例化 ajax请求对象
const loadingArr = [];
const ajaxinstance = axios.create({
  baseURL,
  // baseURL: 'http://172.28.116.119:1442',
  // baseURL: 'http://rest.apizza.net/mock/fe331c5764b00d8017916bf5c96f28d2',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

// 请求拦截器
ajaxinstance.interceptors.request.use(
  (config) => {
    !loadingArr.length && toggleLoading('block');
    loadingArr.push('小美女');
    let token = localStorage.getItem('opc_token') || '';
    config.headers['token'] = token;
    return config;
  },
  (error) => {
    loadingArr.length = 0;
    toggleLoading();
    Promise.reject(error);
  }
);

// 响应拦截器
ajaxinstance.interceptors.response.use(
  (response) => {
    // console.log(response);
    loadingArr.shift();
    !loadingArr.length && toggleLoading();
    const res = response.data;
    const { responseCode, responseMsg } = res;
    if (response.headers['content-type'] === 'APPLICATION/OCTET-STREAM') {
      return response.data;
    }
    if (responseCode.includes('token_error')) {
      Promise.resolve()
        .then(() => message.error('登录过时'))
        .then(() => history.push('/login'));
      return null;
    }
    if (responseCode.includes('om40')) {
      return { responseMsg };
    }
    if (+responseCode !== 0) {
      message.error(responseMsg);
      return null;
    }
    return res.data;
  },
  (error) => {
    loadingArr.length = 0;
    toggleLoading();
    return Promise.reject(error);
  }
);

/**
 * [API api接口封装]
 * @type {Object}
 */
const API = {
  ...buildManage,
  ...rent,
};
export const ajax = ajaxinstance;
export default API;
