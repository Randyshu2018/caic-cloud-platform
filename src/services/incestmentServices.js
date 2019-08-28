import { request } from '../modules/request';
import { error, resolveObj, messageRequestError, errorNoMessage } from './base';

export class InvestmentServices {
  visitors = '/api/om/visitor/list';
  visitorsStatus = '/api/om/visitor/getStatusPieChart';
  visitorsMonthTotal = '/api/om/visitor/getTotalBarChart';
  visitorSave = '/api/om/visitor/save';
  visitorDetail = '/api/om/visitor/get';

  /**
   *
   * 招商管理-查询客户信息列表
   * @param projectId {number} 项目 id
   * @param name {string} 客户姓名
   * @param status {string} 客户状态
   * @param beginDate {date} 开始时间
   * @param endDate {date} 结束时间
   * @param pageNum {number}
   * @param pageSize {number}
   * @return {Promise<T | never> | * | undefined}
   */
  fetchVisitors({ projectId, name, status, beginDate, endDate, pageNum = 1, pageSize = 10 }) {
    return request
      .post(this.visitors, { projectId, name, status, beginDate, endDate, pageNum, pageSize })
      .then(resolveObj);
    // .catch(error); // 自行处理非 '000' 状态
  }

  /**
   * 招商管理-客户状态分布
   * @param projectId {number} 项目id
   * @return {Promise<T | never> | * | undefined}
   */
  fetchCustomersStatus(projectId) {
    return request
      .get(this.visitorsStatus, { projectId })
      .then(resolveObj)
      .catch(errorNoMessage);
  }

  /**
   * 招商管理-客户总量变化
   * @param projectId {number} 项目id
   * @return {Promise<T | never> | * | undefined}
   */
  fetchCustomersMonthTotal(projectId) {
    return request
      .get(this.visitorsMonthTotal, { projectId })
      .then(resolveObj)
      .catch(errorNoMessage);
  }

  updateCustomer(data) {
    return request
      .post(this.visitorSave, data)
      .then((res) => {
        return true;
      })
      .catch((e) => {
        messageRequestError(e);
        return false;
      });
  }

  /**
   * 招商管理-根据客户 id 查询客户信息
   * @param id {number} 客户 id
   * @return {Promise<T | never> | * | undefined}
   */
  fetchCustomerDetail(id) {
    return request
      .get(this.visitorDetail, { id })
      .then(resolveObj)
      .catch(error);
  }
}
