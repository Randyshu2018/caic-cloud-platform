import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import 'src/containers/Orders/style.scss';
import { getStorageObj } from 'src/modules/utils';
import { Icon, Pagination, Popconfirm, DatePicker, Select, Layout } from 'antd';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import EJUSearchBar from 'src/components/searchBar/index';
import EJUTable from 'src/components/table/index';
import OrderStatusType from 'src/modules/orderType';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';

const { RangePicker } = DatePicker;

@ComponentEvent('evt', Event)
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultCurrent: 1,
      breadData: [{ name: '订单中心' }],
      selectKeys: [],
      merchantList: [],
      /**
        WAIT_PAY("WAIT_PAY", "待付款"),
        PAY_SUCCESS("PAY_SUCCESS", "付款成功"),
        PAY_FAILURE("PAY_FAILURE", "付款失败"),
        CANCEL("CANCEL", "取消"),
        OFF_LINE_CONFIRM("OFF_LINE_CONFIRM", "待确认");
      */
      orderList: [
        {
          value: '',
          name: '全部',
        },
        {
          value: 'WAIT_PAY',
          name: '待付款',
        },
        {
          value: 'OFF_LINE_CONFIRM',
          name: '待确认',
        },
        {
          value: 'PAY_SUCCESS',
          name: '已生效',
        },
        {
          value: 'CANCEL',
          name: '已作废',
        },
        {
          value: 'EXPIRED_SERVICE',
          name: '已过期',
        },
      ],
    };
    const ski = {
      memberId: this.storageUser.memberId,
      merchantId: '',
      status: '',
      beginDate: '',
      endDate: '',
      pageNum: 1,
      pageSize: 10,
    };
    this.defaultSki = { ...ski };
    this.ski = { ...ski };
  }

  componentDidMount() {
    this.evt.fetchMerchantList();
    this.evt.fetchData();
  }
  get storageUser() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return { memberId };
  }
  renderSearchBar() {
    const columns = [
      {
        title: '查询时间',
        key: 'date',
        span: 8,
        render: () => <RangePicker key="date" onChange={() => {}} format="YYYY-MM-DD" />,
      },
      {
        title: '认证主体',
        key: 'merchantId',
        initialValue: '',
        render: () => (
          <Select key="merchantId">
            <Select.Option value="">全部</Select.Option>
            {this.state.merchantList.map((i) => (
              <Select.Option key={i.id} value={i.id}>
                {i.name}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        title: '订单状态',
        key: 'status',
        initialValue: '',
        render: () => {
          return (
            <Select key="status">
              {this.state.orderList.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.name}
                </Select.Option>
              ))}
            </Select>
          );
        },
      },
    ];

    return (
      <EJUSearchBar
        columns={columns}
        colSpan={6}
        initialItemCount={4}
        onSearch={this.evt.handleSearch}
        onReset={() => {
          this.table && this.table.search();
        }}
      />
    );
  }

  renderTable() {
    // 列表的数据结构
    // data: <title> <key> <width> <align>
    const columns = [
      {
        data: '订单号,orderId,180',
      },
      {
        data: '认证主体,merchantName',
      },
      {
        data: '创建人,userName',
      },
      {
        data: '订单创建时间,createTime',
      },
      {
        data: '订单金额,amount',
      },
      {
        data: '订单状态,statusMsg',
        renderConsole: (data) => (
          <span className={OrderStatusType[data.status]}>{data.statusMsg}</span>
        ),
      },
      {
        data: '创建项目数,quantity',
      },
      {
        data: '套餐,pkgName',
      },
      {
        data: '服务内容,services',
      },
      {
        data: '操作,x,200,center',
        renderConsole: (data) => {
          // SUPPLEMENT("SUPPLEMENT", "待完善"),
          // WAIT_PAY("WAIT_PAY", "待付款"),
          // OFF_LINE_CONFIRM("OFF_LINE_CONFIRM", "待确认"),
          // /** 付款成功/已生效 */
          // PAY_SUCCESS("PAY_SUCCESS", "已生效"),
          // PAY_FAILURE("PAY_FAILURE", "付款失败"),
          // /** 取消/作废 */
          // CANCEL("CANCEL", "作废"),
          // EXPIRED_SERVICE("EXPIRED_SERVICE", "服务过期");
          const detailSpan = (
            <Link className="text-span" to={`/orders/detail?orderId=${data.orderId}`}>
              详情
            </Link>
          );

          const type = {
            WAIT_PAY: (data) => (
              <React.Fragment>
                {detailSpan}
                <span className="text-span" onClick={() => this.evt.fetchOrderCreate(data)}>
                  去付款
                </span>
                <Popconfirm
                  key="2"
                  okText="是"
                  cancelText="否"
                  title="确认取消订单吗？"
                  onConfirm={() => {
                    this.evt.fetchOrderCancel(data);
                  }}
                >
                  <span className="text-span">取消订单</span>
                </Popconfirm>
              </React.Fragment>
            ),
            PAY_SUCCESS: (data) => {
              const { upgrade } = data;
              return (
                <Fragment>
                  {detailSpan}
                  {upgrade && (
                    <Link to={`/create-project/upgrade-package/${data.orderId}`}>升级套餐</Link>
                  )}
                </Fragment>
              );
            },
          };
          return ((f) => (f ? f(data) : detailSpan))(type[data.status]);
        },
      },
    ];

    return (
      <div
        className="order-table eju-flex eju-flex-column eju-flex-a"
        key="order-table"
        style={{ minHeight: window.screen.height - 400 }}
      >
        <EJUTable
          pagination={false}
          columns={columns}
          loading={this.state.loading}
          dataSource={this.state.dataSource}
        />
        <Pagination
          current={this.state.defaultCurrent}
          // defaultCurrent={this.state.defaultCurrent}
          total={this.state.totalElements}
          onChange={this.evt.handlePaginationChange}
        />
      </div>
    );
  }

  render() {
    return (
      <Layout className="order-layout table-list">
        <Breadcrumb breadData={this.state.breadData} />
        <div className="eju_container">
          {this.renderSearchBar()}
          {this.renderTable()}
        </div>
      </Layout>
    );
  }
}

export default View;
