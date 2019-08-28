import { request } from '../modules/request';
import { message } from 'antd';
import { error, errorArray, resolveObj, resolveArray, NETWORK_ERROR, errorNoMessage } from './base';

export class CityServices {
  allCity = '/api/dict/city/list/all';

  fetchCity() {
    return request
      .get(this.allCity)
      .then(resolveArray)
      .catch(errorArray)
      .then((cities) => {
        return [{ name: '全部', code: '' }, ...cities];
      });
  }
}

export class DiagnoseServices {
  projectDiagnoseList = '/api/project/projectDiagnoseList';
  diagnoseHistory = '/api/project/diagnoseHistory';
  up2chain = '/api/chain/diagnose/up2chain';
  licenses = '/api/chain/diagnose/licenses';

  /**
   * 查询项目诊断列表
   * @param merchantId {string} 当前运营商 id
   * @param assetType {string} 业态
   * @param cityCode {string} 城市 code
   * @param pageNum {number} 页码
   * @param pageSize {number} 条数
   * @return {Promise<T | {}> | * | undefined}
   */
  fetchProjectDiagnoses({ merchantId, assetType, cityCode, pageNum, pageSize }) {
    return request
      .get(this.projectDiagnoseList, { merchantId, assetType, cityCode, pageNum, pageSize })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 查询项目诊断历史列表
   * @param projectId {number | string} 项目 id
   * @param merchantId {number} 当前运营商 id
   * @param pageNum {number} 页码
   * @param pageSize {number} 条数
   * @return {Promise<T | {}> | * | undefined}
   */
  fetchDiagnoseHistory({ projectId, merchantId, pageNum, pageSize }) {
    return request
      .get(this.diagnoseHistory, { projectId, merchantId, pageNum, pageSize })
      .then(resolveObj)
      .catch(errorNoMessage);
  }

  /**
   * 被授权方列表
   * @param projectId {number | string} 项目 id
   * @return {Promise<T | {}> | * | undefined}
   */
  fetchLicenses(projectId) {
    return request
      .get(this.licenses, { projectId })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 数据上链
   * @param data {object}
   * @return {Promise<T | boolean> | * | undefined}
   */
  upToBlockChain(data) {
    return request
      .post(this.up2chain, data)
      .then(({ data }) => data)
      .catch((error) => {
        message.info(error.responseMsg || NETWORK_ERROR);
        return false;
      });
  }
}
