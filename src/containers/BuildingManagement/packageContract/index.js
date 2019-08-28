/**
 * 合同里面的三个选项
 */
import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, Tabs } from 'antd';
import api from 'api';
import { events } from 'func';
import '../style/index.scss';
import FeeClause from '../feeClause';
import ConfirmIncome from '../confirmIncome';
import { observer, inject } from 'mobx-react';
const { TabPane } = Tabs;
@inject('buildManage')
@observer
class App extends React.Component {
  state = {
    active: '1',
    disabledFeeTerms: false,
  };
  componentDidMount() {
    events.on('openFeeTerms', this.openFeeTerms);
    events.on('setContractData', this.setContractData);
    events.on('postionTabIncome', this.postionTabIncome);
  }
  setContractData = (obj) => {
    const { buildManage } = this.props;
    buildManage.setContractData(obj);
  };
  openFeeTerms = (obj = {}) => {
    this.setState({ active: `${obj.key || 2}`, [obj.dis || 'disabledFeeTerms']: false });
  };
  postionTabIncome = (obj) => {
    this.setState({
      active: obj.active,
    });
  };
  callback = (key) => {
    this.setState({ active: key });
  };
  componentWillUnmount() {
    events.removeListener('openFeeTerms', this.openFeeTerms);
    events.removeListener('setContractData', this.setContractData);
    events.removeListener('postionTabIncome', this.postionTabIncome);
  }
  render() {
    let { first, isBlank, contractId, buildManage, onClose } = this.props;
    const { active, disabledFeeTerms } = this.state;
    const Id = buildManage.contractDetail.id;
    return (
      <React.Fragment>
        <Tabs activeKey={active} onChange={this.callback}>
          <TabPane tab="基本信息" key="1">
            {first}
          </TabPane>
          <TabPane tab="费用条款" disabled={disabledFeeTerms || isBlank} key="2">
            <FeeClause isBlank={isBlank} />
          </TabPane>
          <TabPane tab="收入确认" disabled={isBlank} key="3">
            <ConfirmIncome contractId={contractId || Id} onClose={onClose} />
          </TabPane>
        </Tabs>
      </React.Fragment>
    );
  }
}

export default App;
