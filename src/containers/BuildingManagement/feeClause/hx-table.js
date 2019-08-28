import React from 'react';
// import { Link } from 'react-router-dom';
import { Table, DatePicker, Input, InputNumber } from 'antd';
import '../style/index.scss';
import { ContractTitle } from './index';
import moment from 'moment';
import { events } from 'func';
const TableTmpl = ({ dataSource }) => {
  const columns = [
    {
      title: '区间',
      dataIndex: 'name',
      // key: 'name',
      render(text, record) {
        return record.beginDate + '/' + record.endDate;
      },
    },
    {
      title: '费用类型',
      dataIndex: 'age',
      key: 'age',
      render() {
        return '租金';
      },
    },
    {
      title: '付款时间',
      dataIndex: 'billDate',
      // key: 'address',
    },
    {
      title: '应收金额',
      dataIndex: 'billAmount',
      // key: 'addresss',
    },
  ];
  return <Table dataSource={dataSource} columns={columns} pagination={false} size="small" />;
};

class App extends React.Component {
  render() {
    let { renderList } = this.props;
    renderList = renderList.map((v, i) => {
      v.key = i;
      v.index = i;
      return v;
    });
    return (
      <React.Fragment>
        <ContractTitle title="租金明细报表" margin />
        {/* <div className="detail-list-title">保证金</div>
        <TableTmpl /> */}
        <div className="detail-list-title">租金</div>
        <TableTmpl dataSource={renderList} />
      </React.Fragment>
    );
  }
}
export default App;
