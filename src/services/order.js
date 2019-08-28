import { request } from 'src/modules/request';
import { error } from './base';

const PRE_URL = '';

const apiOrderCancel = PRE_URL + '/api/signed/order/cancel';
const apiOrderDetail = PRE_URL + '/api/signed/order/detail';
const apiOrderList = PRE_URL + '/api/signed/order/list';
const apiOrderAddProject = PRE_URL + '/api/signed/order/addProject';
const apiOrderPayment = PRE_URL + '/api/signed/order/payment';
const apiMerchantList = PRE_URL + '/api/signed/merchant/list';

class OrdersServices {
  /**
   * 查询主体列表
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchMerchantList(params) {
    return request
      .get(apiMerchantList, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 签约-取消订单
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOrderCancel(params) {
    return request
      .get(apiOrderCancel, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 签约-查询订单列表
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOrderList(params) {
    return request
      .get(apiOrderList, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 签约-查询订单详情
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOrderDetail(params) {
    return request
      .get(apiOrderDetail, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 签约-支付订单
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOrderPayment(params) {
    return request
      .get(apiOrderPayment, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 签约-订单添加概要项目
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOrderAddProject(params) {
    return request
      .post(apiOrderAddProject, params)
      .then((res) => res)
      .catch(error);
  }
}

export { OrdersServices };
export default new OrdersServices();
