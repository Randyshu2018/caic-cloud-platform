import React from 'react';
// import { Link } from 'react-router-dom';
import { Table, DatePicker, Input, InputNumber } from 'antd';
import '../style/index.scss';
import { ContractTitle } from './index';
import moment from 'moment';
import { events } from 'func';
const TableTmpl = ({ dataSource }) => {
  const change = (val, index, type) => {
    const { zjDetailList = [] } = events;
    // console.log(val)
    for (let i = 0; i < zjDetailList.length; i++) {
      if (+i === +index) {
        zjDetailList[i][type] = val;
        break;
      }
    }
    // events.zjDetailList = zjDetailList
  };

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
      dataIndex: 'address',
      key: 'address',
      render(text, record) {
        return (
          <DatePicker
            defaultValue={moment(record.billDate || '', 'YYYY-MM-DD')}
            format={'YYYY-MM-DD'}
            onChange={(date, dateString) => change(dateString, record.index, 'billDate')}
          />
        );
      },
    },
    {
      title: '应收金额',
      dataIndex: 'address',
      key: 'addresss',
      render(text, record) {
        return (
          <InputNumber
            min={0.1}
            style={{ width: 100 }}
            onChange={(val) => change(val, record.index, 'billAmount')}
            placeholder="元"
          />
        );
      },
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
