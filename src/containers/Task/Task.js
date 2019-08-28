import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Select, Table, DatePicker } from 'antd';
import EBreadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import { api, request } from '../../modules/request';
import { format } from '../../modules/date';
import { assets } from '../../modules/ENUM';
import { CityServices } from '../../services/diagnoseServices';

import './Task.scss';

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY年MM月';
const Option = Select.Option;

function TableStatus({ id, up2chain }) {
  const status = id > 0 ? '已上传' : up2chain ? '-' : '待上传';
  const cls = id > 0 ? 'status' : 'unstatus';
  return (
    <div className={cls}>
      <span>{status}</span>
    </div>
  );
}

const tableTitle = [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
  },
  {
    title: '运营数据',
    key: 'bizDataSheetId',
    dataIndex: 'bizDataSheetId',
    render: (id, { up2chain }) => <TableStatus id={id} up2chain={up2chain} />,
  },
  {
    title: '资产负债表',
    dataIndex: 'balanceSheetId',
    key: 'balanceSheetId',
    render: (id, { up2chain }) => <TableStatus id={id} up2chain={up2chain} />,
  },
  {
    title: '利润表',
    dataIndex: 'profitSheetId',
    key: 'profitSheetId',
    render: (id, { up2chain }) => <TableStatus id={id} up2chain={up2chain} />,
  },
  {
    title: '现金流量表',
    dataIndex: 'cashFlowSheetId',
    key: 'cashFlowSheetId',
    render: (id, { up2chain }) => <TableStatus id={id} up2chain={up2chain} />,
  },

  {
    title: '上链状态',
    key: 'up2chain',
    dataIndex: 'up2chain',
    render: (up2chain) => (
      <div className={up2chain ? 'status' : 'unstatus'}>
        <span>{up2chain ? '已上链' : '未上链'}</span>
      </div>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Link
          to={`/task/detail/${record.projectId}?date=${record.dateMonth.value}&assetType=${
            record.assetType
          }`}
        >
          详情
        </Link>
      </span>
    ),
  },
];

const SELECTED_ATTR = ['selectedTermDate', 'selectedAssetsType', 'selectedCity'];

export default class Task extends React.Component {
  state = {
    breadData: [
      {
        path: '/task/index',
        name: '任务管理',
      },
    ],
    taskListData: [],
    termDates: [],
    selectedTermDate: '',
    dateMonth: moment('2013-11'),
    selectedAssetsType: 'HOTEL',
    city: [],
    selectedCity: '',
  };

  merchantId = localStorage.getItem('merchantId');

  componentDidMount() {
    this.fetchCityListData();
    this.fetchTaskListData();
  }

  fetchCityListData() {
    new CityServices().fetchCity(this.merchantId).then((city) => {
      this.setState({ city: [{ value: '全部', key: '' }, ...city] });
    });
  }

  fetchTaskListData = () => {
    const { dateMonth: _dateMonth, selectedAssetsType, selectedCity } = this.state;

    const dateMonth = format(_dateMonth, 'YYYY-MM');

    request
      .get(api.TASK_LIST_API, {
        dateMonth,
        assetType: selectedAssetsType,
        cityCode: selectedCity,
        merchantId: this.merchantId,
        pageNum: 1,
        pageSize: 100,
      })
      .then((res) => {
        if (!!res.data) {
          this.setState({
            taskListData: res.data.content,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleSelectChange = (value, type = SELECTED_ATTR[0]) => {
    this.setState({ [type]: value }, this.fetchTaskListData);
  };

  handleDateChange = (date, dateMonth) => {
    this.setState({ dateMonth }, this.fetchTaskListData);
  };

  render() {
    const { breadData, city, taskListData, dateMonth } = this.state;

    return (
      <div className="task-wrapper">
        <EBreadcrumb breadData={breadData} />
        <div className="Filter header-filter">
          <label>
            <span className="tit">日期：</span>
            <MonthPicker
              defaultValue={dateMonth}
              format={monthFormat}
              onChange={this.handleDateChange}
              style={{ width: 200 }}
            />
          </label>
          <label>
            <span className="tit">类型：</span>
            <Select
              placeholder="请选择类型"
              style={{ width: 200 }}
              onChange={(value) => {
                this.handleSelectChange(value, SELECTED_ATTR[1]);
              }}
            >
              {assets.map(({ key, value }) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </label>
          <label>
            <span className="tit">城市：</span>
            <Select
              placeholder="请选择城市"
              style={{ width: 200 }}
              onChange={(value) => {
                this.handleSelectChange(value, SELECTED_ATTR[2]);
              }}
            >
              {city.map(({ key, value }) => (
                <Option key={key} value={key}>
                  {value}
                </Option>
              ))}
            </Select>
          </label>
        </div>
        <div className="Table">
          <Table
            columns={tableTitle}
            dataSource={taskListData}
            rowKey={(record) => record.taskId}
          />
        </div>
      </div>
    );
  }
}
