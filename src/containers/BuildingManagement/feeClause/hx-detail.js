import React from 'react';
// import { Link } from 'react-router-dom';
// import { Table, DatePicker, Input, InputNumber } from 'antd';
import '../style/index.scss';
import { ContractTitle } from './index';
import { observer, inject } from 'mobx-react';
import HxTable from './hx-table';
const dateType = (val) => {
  switch (val) {
    case 'ADVANCE':
      return '提前';
    case 'DELAY':
      return '推迟';
    case 'ASSIGN':
      return '指定日期';
    default:
      return '';
  }
};
const tenancyWay = (val) => {
  switch (val) {
    case 'START_DATE':
      return '按起始日划分';
    case 'FIRST_MONTH_FIRST_PERIOD_NM':
      return '首月算首期按自然月划分';
    case 'FIRST_MONTH_ONE_MONTH_NM':
      return '首月算一月按自然月划分';
    default:
  }
};
@inject('buildManage')
@observer
class App extends React.Component {
  render() {
    const { buildManage } = this.props;
    const { contractDetail } = buildManage;
    const billList = contractDetail.billList || [];
    const tenancyClauseList = contractDetail.tenancyClauseList || [];
    const bzjtkArr = billList[0] || {};
    let detailArr = billList;
    detailArr.shift();
    detailArr = detailArr.map((v, i) => {
      v.key = i;
      return v;
    });
    return (
      <React.Fragment>
        <ul className="hx-bzjtk">
          <li>
            <span>保证金类型</span>
            <div>租金保证金</div>
          </li>
          <li>
            <span>保证金金额</span>
            <div>{bzjtkArr.billAmount || '--'}元</div>
          </li>
          <li>
            <span>付款时间</span>
            <div>{bzjtkArr.billDate || '--'}</div>
          </li>
        </ul>
        {tenancyClauseList.length > 0 && (
          <React.Fragment>
            <ContractTitle title="租期条款" />
            {tenancyClauseList.map((v) => (
              <ul key={v.id} className="hx-zqtk">
                <li>
                  <span>开始时间</span>
                  <div>{v.beginDate}</div>
                </li>
                <li>
                  <span>结束时间</span>
                  <div>{v.endDate}</div>
                </li>
                <li>
                  <span>付款时间</span>
                  <div>
                    {dateType(v.dateType)} : {v.payDate}
                    {v.dateType === 'ASSIGN' ? '' : '天'}
                  </div>
                </li>
                <li>
                  <span>付款周期(几月一付)/月</span>
                  <div>{v.paymentCycle}</div>
                </li>
                <li>
                  <span>租期划分方式</span>
                  <div>{tenancyWay(v.tenancyWay)}</div>
                </li>
                <li />
              </ul>
            ))}
          </React.Fragment>
        )}
        <div className="pl-10 pr-10">
          <HxTable renderList={detailArr} />
        </div>
      </React.Fragment>
    );
  }
}
export default App;
