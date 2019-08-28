import { request } from 'src/modules/request';
import { error } from './base';

const PRE_URL = '';

const apiDiagnoseDataQuery = PRE_URL + '/api/diagnose_data/query';
const apiDiagnoseDataSave = PRE_URL + '/api/diagnose_data/save';
const apiDiagnoseDataSubmit = PRE_URL + '/api/diagnose_data/submit';

class DiagnoseDataServices {
  /**
   * 获取“诊断信息”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchDiagnoseDataQuery(params) {
    return request
      .get(apiDiagnoseDataQuery, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 获取“诊断信息-保存”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchDiagnoseDataSave(params) {
    return request
      .post(apiDiagnoseDataSave, params)
      .then((res) => res)
      .catch(error);
  }
  /**
   * 获取“诊断信息-保存”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchDiagnoseDataSubmit(params) {
    return request
      .post(apiDiagnoseDataSubmit, params)
      .then((res) => res)
      .catch(error);
  }
}

export { DiagnoseDataServices };
export default new DiagnoseDataServices();
