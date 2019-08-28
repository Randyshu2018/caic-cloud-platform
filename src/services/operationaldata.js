import { request } from '../modules/request';
import { error } from './base';

const PRE_URL = '';

const apiOperationalDataHistory = PRE_URL + '/api/sheet/biz/history';
const apiOperationalDataQuery = PRE_URL + '/api/sheet/biz/query';
const apiCreateOperationalData = PRE_URL + '/api/sheet/biz/save';

class OperationalDataServices {
  /**
   * 获取“经营数据-历史数据”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOperationalDataHistory(params) {
    return request
      .get(apiOperationalDataHistory, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 获取“经营数据-查询”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOperationalDataQuery(params) {
    return request
      .get(apiOperationalDataQuery, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 获取“经营数据-保存”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchOperationalDataCreate(params) {
    return request
      .post(apiCreateOperationalData, params)
      .then((res) => res)
      .catch(error);
  }
}

export { OperationalDataServices };
export default new OperationalDataServices();
