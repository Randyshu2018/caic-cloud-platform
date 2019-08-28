import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import { Row, Col, Breadcrumb, Form, Input, Button, Select, DatePicker, Table, Alert } from 'antd';
import { forEach } from 'lodash';
import { isMoment } from 'moment';
import { WrappedNewCustomer } from './NewCustomer';
import { CustomerDetail } from './CustomerDetail';
import { App as EmptyBuilding } from '../BuildingManagement/noBuild';
import BarChart from '../../components/charts/container';
import searchSvg from './assets/search.svg';
import { CUSTOMER_STATUS, CUSTOMER_STATUS_NAME } from '../../modules/ENUM';
import {
  fetchCustomers,
  fetchCustomersIs,
  fetchCustomersStatus,
  fetchCustomersMonthTotal,
  setHasBuilding,
} from '../../reducers/investment';
import './Management.scss';
import { format } from '../../modules/date';

function formatDot(date) {
  return date == null ? '-' : format(date, 'YYYY.MM.DD');
}

function SearchCustomers({ form, search }) {
  const { getFieldDecorator, validateFields, getFieldValue } = form;

  function onSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const result = {};

        forEach(values, (value, key) => {
          result[key] = isMoment(value) ? value.valueOf() : value;
        });

        search(result);
      }
    });
  }

  const disabledStartDate = (field) => (current) => {
    const createTimeEnd = getFieldValue(field);
    return current && createTimeEnd && current > createTimeEnd;
  };

  const disabledEndDate = (field) => (current) => {
    const createTimeEnd = getFieldValue(field);
    return current && createTimeEnd && current < createTimeEnd;
  };

  return (
    <div className="search-customers">
      <Form layout="inline" onSubmit={onSubmit}>
        <Form.Item label="时间">
          {getFieldDecorator('beginDate', {
            // initialValue: '',
          })(
            <DatePicker
              disabledDate={disabledStartDate('endDate')}
              placeholder="请选择开始时间"
              style={{ width: 150 }}
            />
          )}
          {' - '}
          {getFieldDecorator('endDate', {
            // initialValue: '',
          })(
            <DatePicker
              disabledDate={disabledEndDate('beginDate')}
              placeholder="请选择结束时间"
              style={{ width: 150 }}
            />
          )}
        </Form.Item>
        <Form.Item label="客户名称">
          {getFieldDecorator('name', {})(<Input placeholder="请输入客户名称" />)}
        </Form.Item>
        <Form.Item label="客户状态">
          {getFieldDecorator('status', {})(
            <Select placeholder="请选择客户状态" style={{ width: 150 }}>
              <Select.Option value={null} key="all">
                全部
              </Select.Option>
              {CUSTOMER_STATUS.map(({ name, key }) => (
                <Select.Option value={key} key={key}>
                  {name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item className="fr" style={{ marginRight: 0 }}>
          <Button type="primary" htmlType="submit">
            <img src={searchSvg} alt="" />
            <span style={{ marginLeft: 8, verticalAlign: 'middle' }}>查询</span>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const WrappedSearchCustomers = Form.create()(SearchCustomers);

class InvestmentChart extends React.PureComponent {
  static propTypes = {
    xAxisData: PropTypes.array.isRequired,
    seriesData: PropTypes.array.isRequired,
  };

  render() {
    const { xAxisData, seriesData } = this.props;

    const sum = seriesData.reduce((a, b) => a + b.value, 0);

    const investmentOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} <!--: {c} -->({d}%)',
      },
      legend: {
        orient: 'vertical',
        //x: 'right',
        top: 50,
        right: '15%',
        align: 'left',
        padding: [8, 5],
        itemGap: 15,
        itemWidth: 14,
        itemHeight: 14,
        textStyle: {
          fontSize: 18,
        },
        icon: 'circle',
        selectedMode: false,
        //formatter: '{name}：{value}',
        data: xAxisData,
      },
      textStyle: {
        color: '#445870',
      },
      color: ['#F94B7E', '#00E4A5', '#4D7BFE', '#8065FF', '#F5A623'],
      series: [
        {
          name: '客户状态',
          type: 'pie',
          center: ['30%', '50%'],
          radius: ['60%', '90%'],
          // avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: false,
              formatter: '{c}\n{b}',
              textStyle: {
                fontSize: 22,
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: seriesData,
        },
      ],
    };

    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <div className="status-sum">
          <div className="sum">{sum}</div>
          <div className="title">客户总量</div>
        </div>
        <BarChart option={investmentOption} height={260} />
      </div>
    );
  }
}

class CustomerViewChart extends React.PureComponent {
  static propTypes = {
    xAxisData: PropTypes.array.isRequired,
    seriesData: PropTypes.array.isRequired,
  };

  render() {
    const { xAxisData, seriesData } = this.props;

    const customerViewOption = {
      color: ['#187DE8'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        top: '3%',
        left: '3%',
        right: '4%',
        bottom: '5%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#939FA9',
            fontSize: 14,
          },
        },
      ],
      yAxis: [
        {
          //show: false,
          type: 'value',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#EFF3F8',
            },
          },
        },
      ],
      series: [
        {
          name: '客户总量',
          type: 'bar',
          barWidth: 22,
          data: seriesData,
        },
      ],
    };

    return (
      <div style={{ width: '100%' }}>
        <BarChart option={customerViewOption} height={260} />
      </div>
    );
  }
}

class InvestmentManagement extends React.Component {
  state = {};

  get projectId() {
    return this.props.projectId;
  }

  componentDidMount() {
    this.parentPathName = this.props.location.pathname;
    setTimeout(this.init, 0);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      location: { pathname },
    } = this.props;
    if (prevProps.location.pathname !== pathname && pathname === this.parentPathName) {
      this.init();
    }
  }

  componentWillUnmount() {
    this.props.dispatch(setHasBuilding({ hasBuilding: null }));
  }

  init = () => {
    this.props.dispatch(fetchCustomersStatus(this.projectId));
    this.props.dispatch(fetchCustomersMonthTotal(this.projectId));
    this.fetchCustomers({});
    this.props.dispatch(fetchCustomersIs(this.projectId));
  };

  fetchCustomers = ({
    projectId = this.projectId,
    name,
    status,
    beginDate,
    endDate,
    pageNum = this.props.pageNum,
    pageSize = this.props.pageSize,
  }) => {
    this.props.dispatch(
      fetchCustomers({
        projectId,
        name,
        status,
        beginDate,
        endDate,
        pageNum,
        pageSize,
      })
    );
  };

  search = (form) => {
    this.fetchCustomers(form);
  };

  render() {
    const {
      match: { path },
      customers,
      total,
      pageNum,
      pageSize,
      loading,
      status,
      monthTotal,
      hasBuilding,
    } = this.props;

    /*if (hasBuilding == null) {
      return; // add loading?
    }*/

    if (hasBuilding === false) {
      return (
        <Alert
          reload={this.init}
          message="提示"
          description={
            <span>
              请先添加楼宇管理信息,才能进行此操作
              <Link to="/operation/build-manage" style={{ marginLeft: '20px' }}>
                点击添加
              </Link>
            </span>
          }
          type="info"
          showIcon
        />
      );
    }

    const columns = [
      {
        title: '客户',
        dataIndex: 'name',
      },
      {
        title: '来访时间',
        dataIndex: 'visitDate',
        render: (visitDate) => formatDot(visitDate),
      },
      {
        title: '联系人',
        dataIndex: 'contactName',
      },
      {
        title: '联系方式',
        dataIndex: 'contactPhone',
      },
      {
        title: '来访途径',
        dataIndex: 'source',
      },
      {
        title: '需求面积',
        dataIndex: 'expectAreaFrom',
        render(expectAreaFrom, { expectAreaTo }) {
          return `${expectAreaFrom}~${expectAreaTo}㎡`;
        },
      },
      {
        title: '客户状态',
        dataIndex: 'status',
        render: (status) => CUSTOMER_STATUS_NAME[status],
      },
      {
        title: '操作',
        dataIndex: 'id',
        render: (id) => {
          return (
            <Fragment>
              <Link
                to={`${path}/customer/${id}`}
                className="customer-operate"
                style={{ marginRight: 20 }}
              >
                详情
              </Link>
              <Link
                to={`${path}/update/${this.projectId}/customer/${id}`}
                className="customer-operate"
              >
                编辑
              </Link>
            </Fragment>
          );
        },
      },
    ];

    const statusPieChartXAxisData = [];
    const statusPieChartSeriesData = [];
    forEach(status, (value, status) => {
      // 由于需要在 name 后显示数值，legend.data[i].name 为 name + ： + value
      const name = CUSTOMER_STATUS_NAME[status] + '：' + value;
      statusPieChartXAxisData.push(name);
      statusPieChartSeriesData.push({ value, name });
    });

    return (
      <div className="investment-management">
        <Route exact path={`${path}/customer/:id`} component={CustomerDetail} />
        <Route
          exact
          path={`${path}/update/:projectId/customer/:id`}
          component={WrappedNewCustomer}
        />
        <div>
          <div className="fr">
            <Link
              to={`${path}/update/${this.projectId}/customer/new`}
              className="create-new-customer"
            >
              新建客户
            </Link>
          </div>
          <Breadcrumb separator=">" className="breadcrumb">
            <Breadcrumb.Item>招商管理</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="investment-management-chart">
          <Row gutter={30}>
            <Col span={12}>
              <div className="investment-chart">
                <h2 className="management-title">招商管理</h2>
                <div className="investment-chart-tip">客户总量状态分布(近30天)</div>
                <InvestmentChart
                  xAxisData={statusPieChartXAxisData}
                  seriesData={statusPieChartSeriesData}
                />
              </div>
            </Col>
            <Col span={12}>
              <div className="customer-view-chart">
                <h2 className="management-title">客户总访量</h2>
                <div className="investment-chart-tip">客户总量变化(近1年)</div>
                <CustomerViewChart xAxisData={monthTotal.x || []} seriesData={monthTotal.y || []} />
              </div>
            </Col>
          </Row>
        </div>
        <main className="investment-management-body">
          <h2 className="management-title">客户列表</h2>
          <div className="investment-management-form">
            <WrappedSearchCustomers search={this.search} />
          </div>
          <div>
            <Table
              rowKey="id"
              className="table"
              columns={columns}
              dataSource={customers}
              loading={loading}
              pagination={{
                total,
                current: pageNum,
                pageSize,
                onChange: (pageNum) => {
                  this.fetchCustomers({ pageNum });
                },
              }}
            />
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    selectSideProject: { id },
  } = state.sideProjects;

  return {
    projectId: id,
    ...state.investmentCustomer,
  };
};

export default connect(mapStateToProps)(InvestmentManagement);
