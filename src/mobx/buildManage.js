import { observable, action, computed } from 'mobx';
import Api from 'api';
import { events } from 'func';
class Store {
  @observable count = 0;
  @observable contractData = {};
  @observable contractDetail = {};

  @action
  setContractData(data) {
    events.contractData = data;
    this.contractData = data;
  }
  @action
  getContractData() {
    // 封装成promise对象
    return Promise.resolve(this.contractData);
  }
  @action
  setContractDetail(data) {
    events.contractDetail = data;
    this.contractDetail = data;
  }
}

export default new Store();
