import React from 'react';
// import { Link } from 'react-router-dom';
import { Table } from 'antd';
import '../style/index.scss';
import { observer, inject } from 'mobx-react';
@inject('buildManage')
@observer
class App extends React.Component {
  render() {
    const { buildManage, isBlank } = this.props;
    const { contractData, contractDetail } = buildManage;
    // console.log(isBlank);
    const obj = isBlank ? contractData : contractDetail;
    const dataSource = (obj.contractRooms || []).map((v, i) => {
      v.key = i;
      return v;
    });
    const columns = [
      {
        title: '已选中房源',
        dataIndex: isBlank ? 'name' : 'buildingName',
        align: 'center',
      },
      {
        title: '层数',
        dataIndex: isBlank ? 'floor' : 'floorName',
        align: 'center',
      },
      {
        title: '房间号',
        dataIndex: isBlank ? 'room' : 'roomName',
        align: 'center',
      },
      {
        title: '面积',
        dataIndex: 'area',
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <div className="pd-5" />
        <Table
          align="center"
          size="middle"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </React.Fragment>
    );
  }
}
export default App;
