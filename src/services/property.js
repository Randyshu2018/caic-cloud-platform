import { request } from 'src/modules/request';
import { message } from 'antd';

const NETWORK_ERROR = '网络异常';

const PRE_URL = '';

function error(res) {
  message.info(res.responseMsg || NETWORK_ERROR);
  return {};
}

const apiAssetProject = PRE_URL + '/api/asset_project/get';
const apiUp2Chain = PRE_URL + '/api/task/up2Chain';
const apiAssetProjectSave = PRE_URL + '/api/asset_project/save';
const apiGetTask = PRE_URL + '/api/task/getTask';
const apiGetTaskSave = PRE_URL + '/api/task/save';
const apiGetTaskList = PRE_URL + '/api/task/list';
const apiGetTaskSheetUpload = PRE_URL + '/api/task/sheetUpload';

const apiContractSave = PRE_URL + '/api/om/contract/save';

class PropertyServices {
  /**
   * 资管项目查询
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryOrder(params) {
    return request
      .get(apiAssetProject, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 月数据上链
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchUp2Chain(params) {
    return request
      .get(apiUp2Chain, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 资管项目保
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchAssetProjectSave(params) {
    return request
      .post(apiAssetProjectSave, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 查询月度数据详情
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchGetTask(params) {
    return request
      .get(apiGetTask, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 月度数据-任务列表
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchGetTaskList(params) {
    return request
      .get(apiGetTaskList, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 查询月度数据保存或者修改接口
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchGetTaskSave(params) {
    return request
      .post(apiGetTaskSave, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 月度数据上传
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchGetTaskSheetUpload(params) {
    return request
      .post(apiGetTaskSheetUpload, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 保存主体信息
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  // fetchMerchantSave(params) {
  //   return request
  //     .post(apiMerchantSave, params)
  //     .then((res) => res)
  //     .catch(error);
  // }

  /**
   * 楼宇管理-新建租赁合同
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  apiContractSave(params) {
    return request
      .post(apiGetTaskSheetUpload, params)
      .then((res) => res)
      .catch(error);
  }
}

export { PropertyServices };
export default new PropertyServices();
