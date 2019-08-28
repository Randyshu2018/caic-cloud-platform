import { map } from 'lodash';

export const NETWORK_ERROR = '网络连接异常';

export const LOGIN_TOKEN_NAME = 'opc_token'; // 用户登录状态 token
export const SELECT_SIGN_PROJECT = 'select_sign_project'; // 🥺 刷新后状态丢失到本地
export const TRIAL_EXPIRE_MODAL = 'TRIAL_EXPIRE_MODAL'; // 试用版套餐弹层标示
export const ORDER_PAY_RETURN_REDIRECT = 'ORDER_PAY_RETURN_REDIRECT'; // 支付保存跳转地址

export const EXCEL_ACCEPT =
  '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/**
 *
 * @type {*[]}
 */
export const assets = [
  {
    value: '全部',
    key: '',
  },
  {
    value: '酒店',
    key: 'HOTEL',
  },
  {
    value: '办公',
    key: 'OFFICE',
  },
  {
    value: '商业',
    key: 'COMMERCIAL',
  },
  {
    value: '商铺',
    key: 'SHOP',
  },
  {
    value: '公寓',
    key: 'APARTMENT',
  },
  {
    value: '车库',
    key: 'GARAGE',
  },
  {
    value: '园区',
    key: 'PARK',
  },
];

export const CUSTOMER_STATUS_FIRST = 'FIRST'; // 初次接触
export const CUSTOMER_STATUS_POTENTIAL = 'POTENTIAL'; // 潜在客户
export const CUSTOMER_STATUS_INTENTIONAL = 'INTENTIONAL'; // 意向客户
export const CUSTOMER_STATUS_DEAL = 'DEAL'; // 成交客户
export const CUSTOMER_STATUS_LOSING = 'LOSING'; // 流失客户

export const CUSTOMER_STATUS_NAME = {
  [CUSTOMER_STATUS_FIRST]: '初次接触',
  [CUSTOMER_STATUS_POTENTIAL]: '潜在客户',
  [CUSTOMER_STATUS_INTENTIONAL]: '意向客户',
  [CUSTOMER_STATUS_DEAL]: '成交客户',
  [CUSTOMER_STATUS_LOSING]: '流失客户',
};

// 租客状态
export const CUSTOMER_STATUS = map(CUSTOMER_STATUS_NAME, (name, key) => ({ name, key }));

// 来访渠道
export const SOURCE_NAME = [{ name: '渠道' }, { name: '上门' }, { name: '电话' }];

export const MOBILE_REGEXP = /^1\d{10}$/;
export const TEL_REGEXP = /^[-0-9+]{4,}$/;

export const EMPTY_BUILDING_CODE = 'operator101';
