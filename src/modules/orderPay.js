import Cookie from 'js-cookie';
import { isEmpty } from './utils';
import { ORDER_PAY_RETURN_REDIRECT } from './ENUM';

/**
 * 通过订单参数，创建拉起第三方支付请求
 */
export default class OrderPay {
  constructor(redirect) {
    if (!isEmpty(redirect)) {
      this.redirect = redirect;
    }
  }

  createInput(name, value) {
    const _input = document.createElement('input');
    _input.type = 'hidden';
    _input.name = name;
    _input.value = value;
    return _input;
  }

  createForm(params) {
    // 记录支付成功后的跳转地址
    if (isEmpty(this.redirect)) {
      Cookie.remove(ORDER_PAY_RETURN_REDIRECT);
    } else {
      Cookie.set(ORDER_PAY_RETURN_REDIRECT, this.redirect);
    }

    const { requestUrl, method = 'post', requestBody, ...order } = params;
    const _Form = document.createElement('form');
    _Form.action = requestUrl;
    _Form.method = method;
    order.body = requestBody;
    document.querySelector('body').appendChild(_Form);
    for (let i in order) {
      let _input = this.createInput(i, order[i]);
      _Form.appendChild(_input);
    }
    _Form.submit();
  }
}
