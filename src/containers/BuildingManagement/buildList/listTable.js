import React from 'react';
// import { Link } from 'react-router-dom';
import { Table } from 'antd';
import '../style/index.scss';
// import api from 'api';
// import { observer, inject } from 'mobx-react'
import { history } from 'func';
export default class App extends React.Component {
  state = {};
  render() {
    const { renderList, open } = this.props;
    // console.log(renderList)
    const columns = [
      {
        title: '楼宇名称',
        dataIndex: 'name',
      },
      {
        title: '管理面积(㎡)',
        dataIndex: 'mgtArea',
      },
      {
        title: '已出租面积(㎡)',
        dataIndex: 'rentedArea',
      },
      {
        title: '出租率(%)',
        dataIndex: 'rentalRate',
      },
      {
        title: '在租实时均价(㎡.天)',
        dataIndex: 'avgPrice',
      },
      {
        title: '在租合同总数/本月新签(份)',
        // dataIndex: 'monthRentedContractNum',
        render(text, record) {
          return `${record.rentedContractNum || '--'}/${record.monthRentedContractNum || '--'}`;
        },
      },
      {
        title: '操作',
        dataIndex: 'address',
        render: (text, record) => {
          return (
            <React.Fragment>
              <a
                href="javascript:;"
                onClick={() => history.push(`/operation/build-manage/${record.id}`)}
              >
                详情
              </a>
              <span className="pl-10" />
              <a href="javascript:;" onClick={() => open(record.id)}>
                编辑
              </a>
            </React.Fragment>
          );
        },
      },
    ];
    return (
      <React.Fragment>
        <Table dataSource={renderList} columns={columns} pagination={false} />
      </React.Fragment>
    );
  }
}
