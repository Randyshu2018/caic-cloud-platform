/**
 * test phone number
 */
export const checkPhoneNumber = (params, text = '') => {
  let msg = '';
  text === '' ? (msg = '请输入正确的手机号') : (msg = text);
  /^1[3-9][0-9]{9}$/.test(params) ? (msg = true) : '';
  return msg;
};

/**
 * test password
 */
export const checkPassword = (params, text = '') => {
  let msg = '';
  text === '' ? (msg = '请输入正确的密码') : (msg = text);
  /^(?![^a-zA-Z]+$)(?!\D+$)/.test(params) ? (msg = true) : '';
  return msg;
};
