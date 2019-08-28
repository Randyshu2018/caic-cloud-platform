import { ajax } from './';
class Xhr {
  contractChart = (postData = {}) => ajax.get('/api/om/contract/chart', { params: postData });
  contractList = (postData = {}) => ajax.get('/api/om/contract/list', { params: postData });
  contractDetail = (postData = {}) => ajax.get('/api/om/contract/detail', { params: postData });
  contractSave = (postData = {}) => ajax.post('/api/om/contract/save', postData);
  contractChooseFloor = (postData = {}) =>
    ajax.get('/api/om/building/chooseFloorsAndRooms', { params: postData });
  contractListByProjectId = (postData = {}) =>
    ajax.get('/api/om/building/listByProjectId', { params: postData });
  // income
  contractIncomeList = (postData = {}) => ajax.post('/api/om/income/list', postData);
  contractIncomeExport = (postData = {}) => ajax.post('/api/om/income/export', postData);
  contractIncomeSave = (postData = {}) => ajax.post('/api/om/income/save', postData);
  contractStatisInfo = (postData = {}) =>
    ajax.get('/api/om/income/statisInfo', { params: postData });
  contractQueryYearList = (postData = {}) =>
    ajax.get('/api/om/income/queryYearList', { params: postData });
  // deposit
  contractDepositAmount = (postData = {}) =>
    ajax.get('/api/om/bill/depositAmount', { params: postData });
  contractDepositList = (postData = {}) => ajax.post('/api/om/bill/list', postData);
  contractDepositCostSettle = (postData = {}) => ajax.post('/api/om/bill/costSettle', postData);
}

export default new Xhr();
