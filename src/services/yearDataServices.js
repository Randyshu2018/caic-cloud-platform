import { request } from '../modules/request';
import { message } from 'antd';

const NETWORK_ERROR = '网络异常';

const PRE_URL = '';

function error(res) {
  message.info(res.responseMsg || NETWORK_ERROR);
  return {};
}

const apiYearDataQuery = PRE_URL + '/api/yearSheet/queryYearSheet';
const apiQueryDataSave = PRE_URL + '/api/yearSheet/saveOrUpdate';

class YearDataServices {
  /**
   * 获取“资管项目-年度数据”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchYearData(params) {
    return request
      .get(apiYearDataQuery, params)
      .then((res) => res.data)
      .catch(error);
  }

  /**
   * 保存修改“资管项目-年度数据”
   *
   * @return {Promise|*|Promise<T | never>|void}
   */
  fetchQueryDataSave(params) {
    return request
      .post(apiQueryDataSave, params)
      .then((res) => res)
      .catch(error);
  }
}

export { YearDataServices };
export default new YearDataServices();
