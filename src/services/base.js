import { message } from 'antd';
import { NETWORK_ERROR } from '../modules/ENUM';
import { isEmpty, isArray } from '../modules/utils';

export { NETWORK_ERROR };

export function messageRequestError(res) {
  message.error(res.responseMsg || NETWORK_ERROR);
}

/**
 * 提示错误信息，非 '000' 的状态默认返回空对象
 * @param res
 * @return {{}}
 */
export function error(res) {
  messageRequestError(res);
  return {};
}

/**
 * 不提示错误信息，非 '000' 的状态默认返回空对象
 * @param res
 * @return {{}}
 */
export function errorNoMessage(res) {
  return {};
}

/**
 * 提示错误信息，非 '000' 的状态默认返回空数组
 * @param res
 * @return {Array}
 */
export function errorArray(res) {
  messageRequestError(res);
  return [];
}

/**
 * 不提示错误信息，非 '000' 的状态默认返回空数组
 * @param res
 * @return {Array}
 */
export function errorArrayNoMessage(res) {
  return [];
}

/**
 * 提示错误信息，所有非 '000' 的状态在具体页面进行错误逻辑处理，
 * @param res
 * @return {Promise<never>}
 */
export function reject(res) {
  messageRequestError(res);
  return Promise.reject(res);
}

/**
 * 默认成功，并不提示错误信息
 * @param res
 * @return {*}
 */
export function errorNoMsg(res) {
  // message.info(res.responseMsg || NETWORK_ERROR);
  return res;
}

/**
 * Promise 成功的默认回调函数
 * @param data
 * @return {{}}
 */
export const resolveObj = ({ data }) => (isEmpty(data) ? {} : data);

/**
 * Promise 成功的默认回调函数
 * @param data
 * @return {{}}
 */
export const resolveArray = ({ data }) => (isArray(data) ? data : []);
