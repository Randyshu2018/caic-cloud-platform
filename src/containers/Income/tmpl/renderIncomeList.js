import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Button, Input, Table, Pagination } from 'antd';
import api from 'api';
import { format } from '../../../modules/date';
import { events } from 'func';

export class IncomeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      current: 1,
      total: 0,
      months: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'June',
        'July',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      columns: [
        {
          title: '租客',
          dataIndex: 'lessee',
          key: 'lessee',
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
          title: '费用类型',
          dataIndex: 'billType',
          key: 'billType',
        },
      ],
      years: null,
    };
  }
  componentDidMount() {
    window.incomeTableGetData = this.fetchIncomeData;
    const { project } = this.props;
    if (project.id) {
      this.fetchIncomeData(null, true);
    }
    this.props.callback(null, this);
    events.on('sendSelectYearData', this.columnsList);
  }
  componentDidUpdate(prevProps) {
    const { project, open } = this.props;
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.fetchIncomeData(null, true);
    }
  }
  columnsList = (data) => {
    this.setState({
      years: data,
    });
    let { columns } = this.state;

    let columnsItemArr = [];
    for (let i = 0; i < this.state.months.length; i++) {
      let a = null;
      if (i < 9) {
        a = `0${i + 1}`;
      } else {
        a = `${i + 1}`;
      }
      columnsItemArr.push({
        title: `${data}-${a}`,
        dataIndex: `amount4${this.state.months[i]}`,
        key: `amount4${this.state.months[i]}`,
      });
    }
    this.setState({
      columns: [
        ...columns.slice(0, 3),
        {
          title: `${data}年合计`,
          dataIndex: 'amount4Year',
          key: 'amount4Year',
        },
        ...columnsItemArr,
      ],
    });
  };
  fetchIncomeData = async (obj = {}, reset) => {
    const { project } = this.props;
    const { id } = project;
    if (obj && obj.year) {
      this.setState({
        years: obj.year,
      });
    }
    const params = {
      projectId: id,
      pageNum: 1,
      pageSize: 10,
      lessee: '',
      year: '',
      inLeasingOnly: false,
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
    api.contractIncomeList(payload).then((res) => {
      if (res) {
        this.setState({
          dataSource: res.list,
          total: res.totalElements,
          current: res.pageNum,
        });
      }
    });
  };

  toDetail = (record) => {
    return {
      onClick: () => {
        this.props.open(record.contractId);
      },
    };
  };

  callfn = (current) => {
    this.props.pfn(current);
  };
  componentWillUnmount() {
    events.removeListener('sendSelectYearData', this.columnsList);
  }
  render() {
    const { columns } = this.state;
    return (
      <Table
        className="income-table"
        dataSource={this.state.dataSource.map((item, key) => ({ ...item, key }))}
        columns={columns}
        rowClassName={(record, index) => (index % 2 === 1 ? 'editablebg' : '')}
        onRow={this.toDetail}
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
            this.fetchIncomeData(payload);
            this.callfn(current);
          },
        }}
      />
    );
  }
}
export default IncomeList;
