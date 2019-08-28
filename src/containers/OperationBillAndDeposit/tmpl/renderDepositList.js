import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Button, Input, Table, Pagination } from 'antd';
import api from 'api';
import { format } from '../../../modules/date';

export class IncomeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      current: 1,
      total: 0,
      fetchData: {
        receivableAmount: null,
        receivableCount: null,
        realAmount: null,
        realCount: null,
        dueInAmount: null,
        dueInCount: null,
      },
    };
  }

  componentDidMount() {
    window.depositTableGetData = this.depositFetchData;
    const { project } = this.props;
    if (project.id) {
      this.depositFetchData(null, true);
    }
    this.props.callback(null, this);
  }
  componentDidUpdate(prevProps) {
    const { project, open } = this.props;
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.depositFetchData(null, true);
    }
  }

  depositFetchData = async (obj = {}, reset) => {
    const { project, type } = this.props;
    const { id } = project;

    const params = {
      projectId: id,
      pageNum: 1,
      pageSize: 10,
      billType: this.props.type,
      beginDate: '',
      endDate: '',
      lessee: '',
      room: '',
      buildingId: '',
      overdueStatus: '',
      payStatus: '',
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
    for (const item in payload) {
      if (payload[item] === '') delete payload[item];
      if (!payload['beginDate']) {
        payload['beginDate'] = '2000-01-01';
        // payload['endDate'] = format(new Date(), 'YYYY-MM-DD');
        payload['endDate'] = '2050-01-01';
      }
    }
    // console.log(payload);
    // ajax data
    api.contractDepositList(payload).then((res) => {
      if (res) {
        this.setState({
          dataSource: res.billDataDtoList,
          total: res.resultCount,
          current: this.state.current,
          fetchData: res,
        });
        // console.log(res);
      }
    });
  };
  showTableinfo = (id, account) => {
    // console.log(id);
    this.props.open(id, account);
  };

  render() {
    const {
      fetchData: {
        receivableAmount,
        receivableCount,
        realAmount,
        realCount,
        dueInAmount,
        dueInCount,
      },
    } = this.state;
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
      },
      {
        title: '房间号',
        dataIndex: 'roomName',
        key: 'roomName',
        render: (data) => {
          return (data || '').split(',').length > 1 ? '多房号' : data;
        },
      },
      {
        title: '账单金额',
        dataIndex: 'billAmount',
        key: 'billAmount',
        render: (data) => {
          return data + '元';
        },
      },
      {
        title: '费用类型',
        dataIndex: 'billType',
        key: 'billType',
        render: (data) => {
          if (data === 'RENTAL') return '租金';
          if (data === 'DEPOSIT') return '保证金';
          return '';
        },
      },
      {
        title: '逾期状态',
        dataIndex: 'overdueStatus',
        key: 'overdueStatus',
        render: (data, k) => {
          return data === '1' ? (
            <span>
              逾期<span style={{ color: '#FF3654' }}>({k && k.overdueDays}天)</span>
            </span>
          ) : (
            '正常'
          );
        },
      },

      {
        title: '开始日期',
        dataIndex: 'beginDate',
        key: 'beginDate',
      },
      {
        title: '结束日期',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '入账日期',
        dataIndex: 'bookedDate',
        key: 'bookedDate',
        render: (data) => {
          return data ? data : '-';
        },
      },
      {
        title: '付款状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        render: (data) => {
          if (data === 'CLOSED') return '已结清';
          if (data === 'UNPAID') return '未付款';
          return '';
        },
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: (_, item) => {
          return item.payStatus !== 'CLOSED' ? (
            <span
              style={{ color: '#3B5EFE', cursor: 'pointer' }}
              onClick={() => this.showTableinfo(item.id, item.billAmount)}
            >
              结清
            </span>
          ) : (
            '-'
          );
        },
      },
    ];
    return (
      <div className="depositTable">
        <ul className="depositUl">
          {this.props.type !== 'DEPOSIT' && (
            <li>
              <section>{`应收（${'' + receivableCount || '--'}笔）`}</section>
              <p>{`${receivableAmount || '--'}元`}</p>
            </li>
          )}
          <li>
            <section>{`实收（${'' + realCount || '--'}笔）`}</section>
            <p>{`${realAmount || '--'}元`}</p>
          </li>
          <li>
            <section>{`待收（${'' + dueInCount || '--'}笔）`}</section>
            <p>{`${dueInAmount || '--'}元`}</p>
          </li>
        </ul>
        <Table
          className="income-table"
          dataSource={this.state.dataSource.map((item, key) => ({
            ...item,
            key,
          }))}
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
              this.depositFetchData(payload);
            },
          }}
        />
      </div>
    );
  }
}
export default IncomeList;
