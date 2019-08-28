import { request } from '../modules/request';
import { message } from 'antd';
import { error, reject, resolveObj } from './base';

export class UserService {
  sendCodeUrl = '/api/member/sendCode';
  verifyCodeUrl = '/api/member/verifyCode';
  loginUrl = '/api/member/login';
  logoutUrl = '/api/member/logout';

  /**
   * 注册或者登陆 发送验证码
   * @param platform {String?} 平台 YL_APP("易楼APP"), YL_IN("易楼IN"), QSL_APP("秋实链APP"), QSL_MERCHANT("秋实链商户平台");
   * @param mobile {Number} 手机号
   * @param msgSymbol {String?} 101 秋实链验证码， 201 秋实链授权， 301 易楼验证码
   * @param codeLength {Number?}
   * @return {Promise<T | {}> | * | undefined}
   */
  sendCode({ platform = 'QSL_MERCHANT', mobile, msgSymbol = '101', codeLength = 4 }) {
    return request
      .post(this.sendCodeUrl, { platform, mobile, msgSymbol, codeLength })
      .then(({ data }) => data || true)
      .catch((error) => {
        message.info(error.responseMsg || '发送验证码失败');
        return false;
      });
  }

  /**
   *
   * @param platform {String?} 平台 YL_APP("易楼APP"), YL_IN("易楼IN"), QSL_APP("秋实链APP"), QSL_MERCHANT("秋实链商户平台");
   * @param mobile {Number} 手机号
   * @param msgSymbol {String?} 101 秋实链验证码， 201 秋实链授权， 301 易楼验证码
   * @param code {String} 验证码
   * @return {Promise<T | {}> | * | undefined}
   */
  verifyCode({ platform = 'QSL_MERCHANT', mobile, msgSymbol, code }) {
    return request
      .post(this.verifyCodeUrl, {
        platform,
        mobile,
        msgSymbol,
        code,
      })
      .catch(reject);
  }

  /**
   *
   * @param mobile {Number} 手机号
   * @param loginType {Number} 登录方式 1 手机号验证码 2手机号密码
   * @param platform {String?} YL_APP("易楼APP"), YL_IN("易楼IN"), QSL_APP("秋实链APP"), QSL_MERCHANT("秋实链商户平台");
   * @param msgSymbol {String} 101 秋实链验证码 201 运营后台授权 301 易楼验证码
   * @param code {Number} 手机验证码
   * @param password {String}
   * @return {Promise<T | {}> | * | undefined}
   */
  login({ mobile, loginType, platform = 'QSL_MERCHANT', msgSymbol = '101', code, password }) {
    return request
      .post(this.loginUrl, {
        mobile,
        loginType,
        platform,
        msgSymbol,
        code,
        password,
      })
      .then(resolveObj)
      .catch(reject);
  }

  /**
   * 退出登录
   * @return {Promise<T | never> | * | undefined}
   */
  logout() {
    return request
      .get(this.logoutUrl)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export class MerchantServices {
  signProject = '/api/signed/project/list';

  /**
   * 查询概要项目列表
   * @param memberId {Array} 当前用户 id
   * @param merchantId {Array?} 主体 id
   * @param businessType {String?} 业态
   * @param cityCode {String?} 城市 code
   * @param name {String?} 业态
   * * @param pageNum {Number?} 页码
   * @param pageSize {Number?} 每页显示数
   * @return {Promise<T | {}> | * | undefined}
   */
  fetchSignProjects({
    memberId,
    merchantId,
    cityCode,
    businessType,
    name,
    pageNum = 1,
    pageSize = 10,
  }) {
    return request
      .get(this.signProject, {
        memberId,
        merchantId,
        cityCode,
        businessType,
        name,
        pageNum,
        pageSize,
      })
      .then((res) => {
        const data = resolveObj(res);
        Array.isArray(data.list) && data.list.forEach(item => {
          item.assetProjectDto = item.assetProject || {}
          delete item.assetProject
        })
        return data
      })
      .catch(error);
  }
}
