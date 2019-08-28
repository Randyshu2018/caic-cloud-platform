import {
  isEmpty as _isEmpty,
  isString as _isString,
  isNumber as _isNumber,
  isFunction as _isFunction,
  omitBy,
} from 'lodash';
import { parse, stringify } from 'qs';
import { SELECT_SIGN_PROJECT } from './ENUM';

export { createHashHistory as history } from 'history';

// export const history = createHistory.createHashHistory;
/**
 * 是否是 development 环境
 * @type {boolean}
 */
export const isDev = process.env.NODE_ENV === 'development';

/**
 * 是否是 production 环境
 * @type {boolean}
 */
export const isProd = process.env.NODE_ENV === 'production';

/**
 * 判断值是否为空
 * @param value {*}
 * @return {boolean} 是否为空
 */
export const isEmpty = (value) => _isEmpty(value);

/**
 * 判断是否是 string
 * @param value {*}
 * @return {boolean} 是否是 string
 */
export const isString = (value) => _isString(value);

/**
 * 判断是否是数组
 * @return {boolean} 是否是 string
 */
export const isArray = Array.isArray;

/**
 *
 * @param value {*}
 * @return {boolean}
 */
export function isDefined(value) {
  return value != null || value != undefined;
}

/**
 *
 * @param value
 * @return {boolean}
 */
export function isUndefined(value) {
  return value == null || value == undefined;
}

/**
 * 判断是否为数值类型
 * @param value
 * @returns {boolean}
 */
export const isNumber = (value) => _isNumber(value);

/**
 * 判断是否为函数
 * @param value {*}
 * @returns {boolean} 是否为函数
 */
export const isFunction = (value) => _isFunction(value);

export const setStorage = (key, value) =>
  localStorage.setItem(key, isString(value) ? value : JSON.stringify(value));

export const getStorage = (key) => localStorage.getItem(key);

export function getStorageObj(key) {
  const value = localStorage.getItem(key);
  return isEmpty(value) ? {} : JSON.parse(value);
}

export function removeStorage(key) {
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}

/**
 * 更新存储的对象
 * @param key {string} 存储键
 * @param obj {object} 更新的对象值
 */
export function updateStorage(key, obj) {
  setStorage(key, { ...getStorageObj(key), ...omitBy(obj, isUndefined) });
}

/**
 * 🥺 刷新后状态丢失到本地
 * @param id {number} 签约项目 id
 * @param pageSize {number?} 分页大小
 * @param pageNum {number?} 分页的页数
 */
export function saveSelectSignProject({ id, pageSize, pageNum }) {
  updateStorage(SELECT_SIGN_PROJECT, { pageNum, pageSize, id });
}

export function getCookie(name) {
  var value = '; ' + document.cookie;
  var parts = value.split('; ' + name + '=');
  if (parts.length == 2)
    return parts
      .pop()
      .split(';')
      .shift();
}

export function cookie(name, value, days) {
  // if value is undefined, get the cookie value
  if (value === undefined) {
    var cookiestring = '; ' + window.document.cookie;
    var cookies = cookiestring.split('; ' + name + '=');
    if (cookies.length === 2) {
      var val = decodeURIComponent(
        cookies
          .pop()
          .split(';')
          .shift()
      );
      if (val.search(/:/i) > 0) {
        val = JSON.parse(val);
      }
      return val;
    }
    return null;
  } else {
    // if value is a false boolean, we'll treat that as a delete
    if (value === false) {
      days = -1;
    }
    var expires = '';
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toGMTString();
    }
    let hostArr = window.location.hostname.split('.');
    let url = hostArr.length === 2 ? hostArr.join('.') : hostArr.slice(1).join('.');
    window.document.cookie =
      name + '=' + encodeURIComponent(value) + expires + '; path=/;domain=' + url;
  }
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

export const getQueryValueByName = (str, name) => {
  if (!str || !name) {
    return '';
  }
  try {
    let tmpStr = str.substring(1);
    let tmpArr = tmpStr.split('&');
    if (tmpArr.length > 0) {
      for (let i = 0; i < tmpArr.length; i++) {
        let tmpItemArr = tmpArr[i].split('=');
        if (tmpItemArr[0] === name) {
          return tmpItemArr[1];
        }
      }
    }
  } catch (e) {
    return '';
  }
};

/**
 * URL地址栏问号传参值的解析
 * @returns {{}}
 */
export const queryURLParameter = (str = window.location.href) => {
  const obj = {};
  str.replace(/([^?&=#]+)=([^?&=#]+)/g, function() {
    obj[arguments[1]] = arguments[2];
  });
  str.replace(/#([^?=&#]+)/g, function() {
    obj['HASH'] = arguments[1];
  });
  return obj;
};

export const formatDate = (value, slash = '-') => {
  if (!value) return '';
  let arr = value.match(/\d+/g);
  if (arr[1].length === 1) {
    arr[1] = '0' + arr[1];
  }
  return arr.join(slash);
};

export const classNameFun = (str = '', cls = {}) => {
  const classNameList = [];
  classNameList.push(str);
  const className = Object.entries(cls)
    .filter(([_, value]) => !!value)
    .map(([className, _]) => className);
  classNameList.push(...className);
  return classNameList.join(' ');
};

// 格式化时间
export const format = (date, type = 'time') => {
  const timeFormat = {
    day: 'YYYY-MM-DD HH:mm:ss',
    time: 'HH:mm',
    dayMileage: 'YYYY-MM-DD',
  };
  return date && date.format(timeFormat[type]);
};

// 深拷贝
export const deepCopy = (values) => {
  let newValues;
  if (Array.isArray(values)) {
    const cpValues = [...values];
    newValues = [];
    while (cpValues.length) {
      newValues.push(deepCopy(cpValues.pop()));
    }
  } else if (typeof values === 'object') {
    newValues = {};
    for (let i in values) {
      newValues[i] = values[i];
    }
  }
  return newValues;
};
