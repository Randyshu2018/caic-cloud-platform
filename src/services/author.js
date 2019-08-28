import { request } from '../modules/request';
import { message } from 'antd';
import { isEmpty } from '../modules/utils';
import { error, reject, resolveObj, NETWORK_ERROR } from './base';

const PRE_URL = '';

const apiAuthorizeLicenseDetail = PRE_URL + '/api/authorize/licensee/detail';
const apiGetDataRange = PRE_URL + '/api/authorize/datelist';
const apiGetHistoryRecord = PRE_URL + '/api/authorize/authconfirm/history';
// const apiSendMobileCode = PRE_URL + '/api/member/sendCode';
const apiVerifyMobileCode = PRE_URL + '/api/member/verifyCode';
const apiAuthorUpload = PRE_URL + '/api/authorize/execute';

export class AuthorizeServices {
  authorizes = '/api/asset/authorize/list';
  licensee = '/api/asset/authorize/queryLicensee';
  makeKey = '/api/asset/authorize/makeKey';
  dateList = '/api/asset/authorize/datelist';
  create = '/api/asset/authorize/create';
  update = '/api/asset/authorize/update';
  authorizeDetail = '/api/asset/authorize/detail';
  authorizeGetDetail = '/api/asset/authorize/get';

  /**
   * 授权管理-获取授权配置信息列表
   * @param assetProjectId {string} 资管项目ID
   * @param memberPhone {number?} 手机号
   * @param memberName {string?} 名称
   * @param pageNum {number?}
   * @param pageSize {number?}
   * @return {Promise<T | {}> | * | undefined}
   */
  fetchAuthorizes({ assetProjectId, memberPhone, memberName, pageNum = 1, pageSize = 10 }) {
    return request
      .get(this.authorizes, { assetProjectId, memberPhone, memberName, pageNum, pageSize })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 授权管理-查询会员信息
   * @param mobile {number} 被授权人手机号
   * @param assetProjectId {number} 资管项目ID
   * @return {Promise<T | {}> | * | undefined}
   */
  queryLicensee({ mobile, assetProjectId }) {
    return request
      .get(this.licensee, { mobile, assetProjectId })
      .then(resolveObj)
      .catch(reject);
  }

  /**
   * 授权管理-生成密钥
   * @param mobile {number} 被授权人手机号
   * @param memberName {string} 被授权人名称
   * @return {Promise<T | {}> | * | undefined}
   */
  makePrivateKey({ mobile, memberName }) {
    return request
      .get(this.makeKey, { mobile, memberName })
      .then(({ data }) => (isEmpty(data) ? '' : data))
      .catch((error) => {
        message.info(error.responseMsg || NETWORK_ERROR);
        return '';
      });
  }

  /**
   * 授权管理-新增授权帐号-日期区间
   * @return {Promise<T | {}> | * | undefined}
   */
  fetchAuthorizeDates() {
    return request
      .get(this.dateList)
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 授权管理 新增/修改授权配置信息
   * @param id {number?} 记录 ID，创建时为 null
   * @param beginMonth {string} 授权开始日期
   * @param endMonth {string} 授权结束日期
   * @param roleType {string} 角色类型
   * @param memberId {number} 被授权人ID
   * @param memberPhone {number} 被授权人手机号
   * @param assetProjectId {number} 资管项目ID
   * @param operatorId {number} 操作员ID
   * @return {Promise<T | never> | * | undefined}
   */
  createAuthorize({
    id,
    beginMonth,
    endMonth,
    roleType,
    memberId,
    memberPhone,
    assetProjectId,
    operatorId,
  }) {
    return request
      .post(this.create, {
        id,
        beginMonth,
        endMonth,
        roleType,
        memberId,
        memberPhone,
        assetProjectId,
        operatorId,
      })
      .then(resolveObj)
      .catch(reject); // 自行处理非 000 状态
  }

  /**
   * 授权管理 新增/修改授权配置信息
   * @param id {number?} 记录 ID，创建时为 null
   * @param beginMonth {string} 授权开始日期
   * @param endMonth {string} 授权结束日期
   * @param roleType {string} 角色类型
   * @param memberId {number} 被授权人ID
   * @param memberPhone {number} 被授权人手机号
   * @param assetProjectId {number} 资管项目ID
   * @param operatorId {number} 操作员ID
   * @return {Promise<T | never> | * | undefined}
   */
  updateAuthorize({
    id,
    beginMonth,
    endMonth,
    roleType,
    memberId,
    memberPhone,
    assetProjectId,
    operatorId,
  }) {
    return request
      .post(this.update, {
        id,
        beginMonth,
        endMonth,
        roleType,
        memberId,
        memberPhone,
        assetProjectId,
        operatorId,
      })
      .then(resolveObj)
      .catch(reject); // 自行处理非 000 状态
  }

  /**
   * 授权管理-获取授权配置信息详情，包含授权历史和授权数据
   * @param preAuthId {number} 预授权配置ID
   * @param pageNum {number?}
   * @param pageSize {number?}
   * @return {Promise<T | never> | * | undefined}
   */
  fetchAuthorizeAllDetail({ preAuthId, pageNum = 1, pageSize = 10 }) {
    return request
      .get(this.authorizeDetail, { preAuthId, pageNum, pageSize })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 授权管理-获取授权配置信息详情
   * @param preAuthId {number} 预授权配置ID
   * @return {Promise<T | never> | * | undefined}
   */
  fetchAuthorizeDetail({ preAuthId }) {
    return request
      .get(this.authorizeGetDetail, { preAuthId })
      .then(resolveObj)
      .catch(error);
  }
}

class AuthorServices {
  /**
   * 获取“授权-授权用户项目列表”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchApiAuthorizeLicenseDetail(params = {}) {
    return request
      .get(apiAuthorizeLicenseDetail, params)
      .then(({ data }) => (isEmpty(data) ? {} : data))
      .catch(error);
  }

  /**
   * 获取“授权-数据区间”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchDataRange(params = {}) {
    return request
      .get(apiGetDataRange, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 获取“授权-历史数据”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchHistoryRecord(params = {}) {
    return request
      .get(apiGetHistoryRecord, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 获取“授权-短信验证码验证”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchVerifyMobileCode(mobile, code) {
    return request
      .post(apiVerifyMobileCode, { mobile: mobile, code: code, platform: 'YYHT', msgSymbol: '201' })
      .then((res) => res)
      .catch(error);
  }

  /**
   * 获取“授权-授权上链”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchAuthorUpload(params) {
    return request
      .post(apiAuthorUpload, params)
      .then((res) => res)
      .catch(error);
  }
}

export { AuthorServices };
export default new AuthorServices();
