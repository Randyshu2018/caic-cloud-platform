import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Button, Input, Table, Pagination } from 'antd';
import api from 'api';

export class RentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      current: 1,
      total: 0,
      noNewPro: true,
    };
  }
  showDrawerinfo = (param) => {
    this.props.open(param);
    // this.props.callback(param);
  };

  componentDidMount() {
    window.tableGetData = this.fetchData;
    const { project } = this.props;
    if (project.id) {
      this.fetchData(null, true);
    }
    this.props.callback(null, this);
  }
  componentDidUpdate(prevProps) {
    const { project } = this.props;
    // console.log(prevProps);
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.fetchData(null, true);
    }
  }

  fetchData = async (obj = {}, reset) => {
    const { project } = this.props;
    const { id } = project;
    const params = {
      projectId: id,
      buildingId: '',
      endSignDate: '',
      pageNum: 1,
      pageSize: 10,
      lessee: '',
      roomName: '',
      ...obj,
    };
    let payload = {};
    if (reset) {
      payload = this.paginationDefault;
      this.payload = params;
    } else {
      this.payload = {
        ...params,
      };
    }
    payload = {
      ...params,
      ...payload,
    };
    // console.log(payload);
    // ajax data
    api.contractList(payload).then((res) => {
      if (res) {
        this.setState({
          dataSource: res.list,
          total: res.totalElements,
          current: res.pageNum,
        });
        // console.log(res);
      }
    });
  };

  render() {
    const { close, open } = this.props;
    const columns = [
      {
        title: '承租方名称',
        dataIndex: 'lessee',
        key: 'lessee',
      },
      {
        title: '楼宇名称',
        dataIndex: 'buildingName',
        key: 'buildingName',
        render: (data) => {
          return (data || '').split(',').length > 1 ? '多楼宇' : data;
        },
      },
      {
        title: '楼层',
        dataIndex: 'floorName',
        key: 'floorName',
        render: (data) => {
          return (data || '').split(',').length > 1 ? '多楼层' : +data ? `${data}层` : `${data}`;
        },
      },
      {
        title: '房号',
        dataIndex: 'roomName',
        key: 'roomName',
        render: (data) => {
          return (data || '').split(',').length > 1 ? '多房号' : data;
        },
      },
      {
        title: '租赁面积',
        dataIndex: 'totalArea',
        key: 'totalArea',
        render: (data) => {
          return <span>{`${data}㎡`}</span>;
        },
      },
      {
        title: '开始日期',
        dataIndex: 'beginSignDate',
        key: 'beginSignDate',
      },
      {
        title: '结束日期',
        dataIndex: 'endSignDate',
        key: 'endSignDate',
      },
      {
        title: '合同单价',
        dataIndex: 'singlePrice',
        key: 'singlePrice',
        render: (data) => {
          return <span>{`${data.toFixed(2)}元/㎡.天`}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: (_, item) => {
          return (
            <span
              style={{ color: '#3B5EFE', cursor: 'pointer' }}
              onClick={() => this.showDrawerinfo(item.id)}
            >
              详情
            </span>
          );
        },
      },
    ];
    return (
      <Table
        dataSource={this.state.dataSource.map((item, key) => ({ ...item, key }))}
        columns={columns}
        rowClassName={(record, index) => (index % 2 === 1 ? 'editablebg' : '')}
        pagination={{
          current: this.state.current,
          total: this.state.total,
          onChange: (current) => {
            this.setState({
              current,
            });
            const payload = {
              ...this.payload,
              pageNum: current,
            };
            this.fetchData(payload);
          },
        }}
        // loading={this.state.loadingTableData}
      />
    );
  }
}
export default RentTable;
