import URL from 'url-parse';
import qs from 'qs';
import { isEmpty, isString, clearStorage } from './utils';
import { NETWORK_ERROR, LOGIN_TOKEN_NAME } from './ENUM';
import { api } from './api-config';
import baseURL from '../api/host';
const defaultOptions = {
  headers: {
    token: localStorage.getItem(LOGIN_TOKEN_NAME),
    // 'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
};

function jsonResponseHandler(data, apiOptions) {
  return Promise.resolve(data);
}
export const request = {
  sendRequest(url, options = {}) {
    url = baseURL + url;
    if (!isEmpty(options.qs)) {
      url = this.addQueryString(url, options.qs);
    }

    url = this.normalizeRestfulParams(url, options);
    const ops = { ...defaultOptions };
    ops.headers.token = localStorage.getItem(LOGIN_TOKEN_NAME);
    if (!isEmpty(options) && !isEmpty(options.headers)) {
      ops.headers = Object.assign({}, ops.headers, options.headers);
      delete options.headers;
    }
    this.options = Object.assign({}, ops, options);

    const apiOptions = Object.assign({}, this.options, options);
    // const apiOptions = { ...defaultOptions, options };
    // apiOptions.headers = Object.assign(
    //   {},
    //   defaultOptions.headers,
    //   options.headers
    // );
    return fetch(url, apiOptions)
      .then((response) => {
        if (!response.ok) {
          try {
            return response.json().then((data) => {
              return Promise.reject(data);
            });
          } catch (e) {
            return Promise.reject({ responseMsg: NETWORK_ERROR });
          }
        }
        return response.json();
      })
      .then(
        (data) => {
          const { responseCode, responseMsg } = data;
          const loginExpireCode = ['token_error00', 'token_error01', 'token_error02'];
          if (responseCode === '000' /* || responseCode === 'operator26'*/) {
            return data;
          } else if (loginExpireCode.indexOf(responseCode) > -1) {
            // 友好一点的提示 🙄
            data = { responseMsg: '登录状态失效，请重新登录' };

            /* eslint-disable */
            clearStorage();
            let host = window.location.href.split('#')[0];
            location.href = host + '#/login';
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                return reject(data);
              }, 0);
            });
          } else {
            return Promise.reject(data);
          }
        },
        (data) => Promise.reject(data)
      );
  },
  get(url, params = {}, options = {}) {
    options = Object.assign({}, options, { headers: { 'Content-Type': 'application/json' } });
    if (!isEmpty(params)) {
      url = addQueryString(url, params);
    }
    return this.sendRequest(url, options);
  },
  post(url, data = {}, options = {}) {
    options = Object.assign({}, options, { headers: { 'Content-Type': 'application/json' } });
    return this.sendRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },
  put(url, data = {}, options = {}) {
    return this.sendRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },
  delete(url, data = {}, options = {}) {
    return this.sendRequest(url, {
      method: 'DELETE',
      body: JSON.stringify(data),
      ...options,
    });
  },
  uploadFile(url, data, options = {}) {
    const formData = new FormData();

    if (!isEmpty(data)) {
      for (const key in data) {
        formData.append(key, data[key]);
      }
    }

    const apiOptions = Object.assign(
      {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      },
      options
    );

    return this.sendRequest(url, apiOptions);
  },
  upload(url, inputFiles, extraData, fileFieldName, options = {}) {
    const formData = new FormData();
    if (!isEmpty(extraData)) {
      const keys = Object.keys(extraData);
      for (const key of keys) {
        formData.append(key, extraData[key]);
      }
    }
    const fieldName = fileFieldName || 'files';
    let i = 0;
    for (; i < inputFiles.length; i++) {
      formData.append(fieldName, inputFiles[i]);
    }

    url = normalizeRestfulParams(url, options);

    const apiOptions = Object.assign(
      {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      },
      options
    );
    return fetch(url, apiOptions)
      .then((response) => response.json())
      .then((data) => jsonResponseHandler(data, apiOptions));
  },
  normalizeRestfulParams(url, { restParams = [] } = {}) {
    return formatRestfulUrl(url, restParams);
  },
};
/*eslint-disable*/
export function getQuery(url = location.href) {
  const obj = new URL(url, true);
  return obj.query;
}

function addQueryString(url, params, baseUrl = '', noHost = true) {
  if (isEmpty(params)) return url;
  const obj = new URL(url, baseUrl);
  const addedQuery = isString(params) ? params : qs.stringify(params);
  const query = obj.query ? `${obj.query}&${addedQuery}` : `?${addedQuery}`;
  const fullHost = obj.protocol ? `${obj.protocol}//${obj.host}` : '';
  return `${noHost ? '' : fullHost}${obj.pathname}${query}${obj.hash}`;
}

function normalizeRestfulParams(url, { restParams = [] } = {}) {
  return formatRestfulUrl(url, restParams);
}
/**
 * Simplify the rest parameters creation, e.g:
 * //NOTICE: order of params in array is important, params use object do not care about order
 * formatRestfulUrl('/user/:id/:id2', [1,2]) ->  /user/1/2
 * formatRestfulUrl('/user/:id/:id2', {id2: 2, id: 1}) ->  /user/1/2
 * @param {string} url request url definition
 * @param {Array|Object} params rest parameters
 * @return {*}
 */
export const formatRestfulUrl = function(url, params) {
  if (!params || url.indexOf(':') < 0) return url;
  let parts = url.split('/');
  let partIndex = 0;
  const isArray = Array.isArray(params);
  parts.forEach(function(ele, index) {
    if (ele.indexOf(':') === 0) {
      parts[index] = isArray ? params[partIndex] : params[ele.substring(1)];
      partIndex++;
    }
  });
  return parts.join('/');
};
export { api, NETWORK_ERROR };
