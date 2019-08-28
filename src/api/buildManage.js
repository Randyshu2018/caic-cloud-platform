import { ajax } from './';
class Xhr {
  getBuilding = (postData = {}) => ajax.get('/api/om/building/getBuilding', { params: postData });
  getFloorList = (postData = {}) => ajax.get('/api/om/building/getFloorList', { params: postData });
  createBuilding = (postData = {}) => ajax.post('/api/om/building/saveBuilding', postData);
  createFloor = (postData = {}) => ajax.post('/api/om/building/createFloor', postData);
  getRoomList = (postData = {}) => ajax.get('/api/om/building/getRoomList', { params: postData });
  deleteRoom = (postData = {}) => ajax.get('/api/om/building/deleteRoom', { params: postData });
  deleteFloor = (postData = {}) => ajax.get('/api/om/building/deleteFloor', { params: postData });
  createRoom = (postData = {}) => ajax.post('/api/om/building/createRoom', postData);
  saveContract = (postData = {}) => ajax.post('/api/om/contract/save', postData);
  contractDetail = (postData = {}) => ajax.get('/api/om/contract/detail', { params: postData });
  getBuildingList = (postData = {}) => ajax.post('/api/om/building/getBuildingList', postData);
  buildingTotalStatis = (postData = {}) =>
    ajax.get('/api/om/building/totalStatis', { params: postData });
  queryByProjectId = (postData = {}) =>
    ajax.get('/api/om/amortization/queryByProjectId', { params: postData });
  calculateBillTime = (postData = {}) => ajax.post('/api/om/bill/calculateBillTime', postData);
  //获取首页项目列表
  getProjectList = (postData = {}) => ajax.get('/api/signed/project/list', { params: postData });
}

export default new Xhr();
