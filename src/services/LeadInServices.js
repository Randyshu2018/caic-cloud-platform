import { request } from '../modules/request';
import { error, reject, resolveObj } from './base';

export class LeadInServices {
  uploadAction = '/api/sheet/fin/upload';
  balanceSave = '/api/sheet/fin/balance/save';
  queryBalance = '/api/sheet/fin/balance/query';
  cashFlowSave = '/api/sheet/fin/cashFlow/save';
  queryCashFlow = '/api/sheet/fin/cashFlow/query';
  profitSave = '/api/sheet/fin/profit/save';
  queryProfit = '/api/sheet/fin/profit/query';

  upload({ projectId, file, dateMonth, sheetType }) {
    return request
      .uploadFile(this.uploadAction, {
        projectId,
        file,
        dateMonth,
        sheetType,
      })
      .then(resolveObj)
      .catch(reject);
  }

  /**
   * 资产负债表数据保存
   * @param projectId
   * @param dateMonth {string} 2018-11
   * @param balanceSheetBegin {object} 年初数对象
   * @param balanceSheetEnd {object} 本期数对象
   * @return {Promise|*|Promise<T | {}>}
   */
  saveBalance({ projectId, dateMonth, balanceSheetBegin, balanceSheetEnd }) {
    return request
      .post(this.balanceSave, { projectId, dateMonth, balanceSheetBegin, balanceSheetEnd })
      .then((res) => res)
      .catch(reject);
  }

  /**
   * 资产负债表数据查询
   * @param projectId
   * @param dateMonth {string} 2018-11
   * @return {Promise|*|Promise<T | {}>}
   */
  fetchBalance({ projectId, dateMonth }) {
    return request
      .get(this.queryBalance, { projectId, dateMonth })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 现金流量表数据查询
   * @param projectId
   * @param dateMonth {string} 2018-11
   * @return {Promise|*|Promise<T | {}>}
   */
  fetchCashFlow({ projectId, dateMonth }) {
    return request
      .get(this.queryCashFlow, { projectId, dateMonth })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 利润表数据查询
   * @param projectId
   * @param dateMonth {string} 2018-11
   * @return {Promise|*|Promise<T | {}>}
   */
  fetchProfit({ projectId, dateMonth }) {
    return request
      .get(this.queryProfit, { projectId, dateMonth })
      .then(resolveObj)
      .catch(error);
  }

  /**
   * 现金流量表数据保存
   * @param projectId
   * @param dateMonth {string} 2018-11
   * @param cash
   * @return {Promise|*|Promise<T | {}>}
   */
  saveCashFlow({ projectId, dateMonth, ...cash }) {
    return request
      .post(this.cashFlowSave, { projectId, dateMonth, ...cash })
      .then((res) => res)
      .catch(reject);
  }

  /**
   * 利润表数据保存
   * @param projectId
   * @param dateMonth {string} 2018-11
   * @param profit
   * @return {Promise|*|Promise<T | {}>}
   */
  saveProfit({ projectId, dateMonth, ...profit }) {
    return request
      .post(this.profitSave, { projectId, dateMonth, ...profit })
      .then((res) => res)
      .catch(reject);
  }
}
