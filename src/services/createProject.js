import { request } from 'src/modules/request';
import { error, resolveArray, errorArray, resolveObj, messageRequestError } from './base';

const PRE_URL = '';

const apiQueryPackageList = PRE_URL + '/api/signed/project/queryPackageList';
const apiQueryNewPackageList = PRE_URL + '/api/signed/pkg/list';
const apiQueryProjectList = PRE_URL + '/api/signed/project/list';
const apiQueryProjectGet = PRE_URL + '/api/signed/project/get';
const apiCreateOrUpdateProject = PRE_URL + '/api/signed/project/createOrUpdate';
const apiQueryCityChildnode = PRE_URL + '/api/dict/city/list/childnode';
const apiQueryCityArea = PRE_URL + '/api/dict/city/queryarea';
const apiSetProjectPackage = PRE_URL + '/api/signed/project/setProjectPackage';
const apiMerchantSave = PRE_URL + '/api/signed/merchant/save';
const apiMerchantList = PRE_URL + '/api/signed/merchant/list';
const apiOrderCreate = PRE_URL + '/api/signed/order/create';
const apiQueryOrder = PRE_URL + '/api/signed/order/get';
const apiQueryListMerchantByMember = '/api/signed/merchant/list';
const apiQueryMerchantSet = '/api/signed/merchant/set';
const apiQueryGetImageInfo = '/api/dict/recognition/getImageInfo';

class CreateProjectServices {
  /**
   * 付费签约－主体信息－图片信息识别
   * type 类型；1:个人；3:企业
   * bizLicenseImageUrl 营业执照URL
   * idCardUpImageUrl 身份证正面URL
   * idCardDownImageUrl 身份证反面URL
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryGetImageInfo(params) {
    return request
      .post(apiQueryGetImageInfo, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 设置主体接口
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryMerchantSet(params) {
    return request
      .get(apiQueryMerchantSet, params)
      .then((res) => res)
      .catch(error);
  }

  /**
   * 签约-查询会员对应的主体列表
   * @param memberId {number}
   * @returns {Promise<any> | Promise<any> | * | undefined}
   */
  fetchQueryListMerchantByMember(memberId) {
    return request
      .get(apiQueryListMerchantByMember, { memberId })
      .then((res) => res)
      .catch(error);
  }
  /**
   * 查询订单
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  /**
   * 查询订单
   * @param orderId {number}
   * @returns {Promise<any> | Promise<any> | * | undefined}
   */
  fetchQueryOrder(orderId) {
    return request
      .get(apiQueryOrder, { orderId })
      .then((res) => res)
      .catch(error);
  }

  /**
   * 签约-查询已有套餐列表
   * @param memberId {number} 会员 ID
   * @returns {Promise<any> | Promise<any> | * | undefined}
   */
  fetchOrderPackage(memberId) {
    return request
      .get('/api/signed/pkg/queryOrderPackage', { memberId })
      .then(resolveArray)
      .catch(errorArray);
  }

  /**
   * 签约－创建订单
   * @param source {string?} 来源
   * @param memberId
   * @param merchantId
   * @param packageId
   * @returns {Promise<boolean> | Promise<any | boolean> | * | undefined}
   */
  createSignedOrder({ source = 'MERCHANT', memberId, merchantId, packageId }) {
    return request
      .post('/api/signed/order/create', { source, memberId, merchantId, pkg: { packageId } })
      .then((res) => res.data)
      .catch((error) => {
        messageRequestError(error);
        return false;
      });
  }

  /**
   * 签约-支付订单
   * @param orderId {number} 订单号
   * @returns {Promise<boolean> | Promise<any | boolean> | * | undefined}
   */
  orderPayment(orderId) {
    return request
      .get('/api/signed/order/payment', { orderId })
      .then(resolveObj)
      .catch((error) => {
        messageRequestError(error);
        return false;
      });
  }

  /**
   * 签约-查询升级套餐列表
   * @param orderId {number} 订单 id
   * @returns {Promise<Array> | Promise<Array> | * | undefined}
   */
  fetchUpgradePackage(orderId) {
    return request
      .get('/api/signed/pkg/queryUpgradePackage', { orderId })
      .then(resolveArray)
      .catch(errorArray);
  }

  /**
   * 签约-升级套餐
   * @param source {string?} 发起来源
   * @param createBy {string} 用户操作人
   * @param origOrderId {number} 原订单 ID
   * @param packageId {number} 升级的套餐 ID
   * @returns {*}
   */
  upgradePackage({ source = 'MERCHANT', createBy, origOrderId, packageId }) {
    return request
      .post('/api/signed/pkg/upgrade', { source, createBy, origOrderId, packageId })
      .then((res) => res && res.data)
      .catch((error) => {
        messageRequestError(error);
        return false;
      });
  }

  /**
   * 创建订单
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOrderCreate(params) {
    return request
      .get(apiOrderCreate, params)
      .then((res) => res)
      .catch(error);
  }
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
   * 保存主体信息
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchMerchantSave(params) {
    return request
      .post(apiMerchantSave, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 设置项目套餐
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchSetProjectPackage(params) {
    return request
      .get(apiSetProjectPackage, params)
      .then((res) => res.data)
      .catch(error);
  }
  /**
   * 新套餐列表接口
   *
   * @return {Promise|*|Promise<T | never>|void}
   */

  /**
   * 签约-套餐列表接口
   * @param memberId {number} 会员 id
   * @returns {Promise<any> | Promise<any> | * | undefined}
   */
  fetchQueryNewPackageList(memberId) {
    return request
      .get(apiQueryNewPackageList, { memberId })
      .then((res) => res.data)
      .catch(error);
  }
  /**
   * 套餐列表接口
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryPackageList(params) {
    return request
      .get(apiQueryPackageList, params)
      .then((res) => res.data)
      .catch(error);
  }
  /**
   * 查询概要项目列表
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchList(params) {
    return request
      .get(apiQueryProjectList, params)
      .then((res) => res.data)
      .catch(error);
  }
  /**
   * 创建概要项目
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchCreateOrUpdateProject(params) {
    return request
      .post(apiCreateOrUpdateProject, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 获取概要项目详情
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryProjectGet(params) {
    return request
      .get(apiQueryProjectGet, params)
      .then((res) => res.data)
      .catch(error);
  }
  /**
   * 获取下级城市码
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryCityChildnode(params) {
    return request
      .get(apiQueryCityChildnode, params)
      .then((res) => res.data)
      .catch(error);
  }
  /**
   * 根据区code查找上级省市
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryCityArea(params) {
    return request
      .get(apiQueryCityArea, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 获取“诊断信息-保存”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  // fetchDiagnoseDataSave(params) {
  //   return request
  //     .post(apiDiagnoseDataSave, params)
  //     .then((res) => res)
  //     .catch(error);
  // }
}

export { CreateProjectServices };
export default new CreateProjectServices();
