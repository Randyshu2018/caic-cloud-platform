import React from 'react';
import 'src/containers/Orders/style.scss';
import { getStorageObj } from 'src/modules/utils';
import { Col, Row, Layout, Button, Table, Icon, Spin } from 'antd';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';
import OrderStatusType from 'src/modules/orderType';

const antIcon = <Icon type="loading" style={{ fontSize: 28 }} spin />;

function ComponentContainer(props) {
  return (
    <div className="order-detail">
      <div className="eju-flex eju-flex-between header">
        <div className="title">
          {props.order_title}
          <span className="tip">{props.order_title_tip}</span>
        </div>
        <div>{props.order_button}</div>
      </div>
      <div className="body">
        <Table dataSource={props.dataSource} columns={props.columns} pagination={false} />
      </div>
    </div>
  );
}

@ComponentEvent('evt', Event)
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadData: [{ name: '订单中心', path: '/orders/center' }, { name: '详情' }],
      orderStatus: '1',
      data: {},
    };
  }
  get storageUser() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return { memberId };
  }

  componentDidMount() {
    this.evt.fetchData();
  }

  renderLayout1() {
    const { orderStatus, data } = this.state;
    const children = (props) => {
      const dataTitle = {
        userName: '创建人',
        createTime: '创建时间',
        payDate: '支付时间',
        statusMsg: '订单状态',
        toolCode: '支付方式',
        signDateRange: '起始时间',
        amount: '订单金额',
        merchantName: '认证主体',
      };

      const values = Object.keys(dataTitle).map((key) => ({
        classname: key === 'statusMsg' ? OrderStatusType[data.status] || '' : '',
        key,
        value: props[key],
        title: dataTitle[key],
      }));

      return (
        <Row className="table-row">
          {values.map((data) => (
            <Col span={8} key={data.key}>
              <p>
                <span>{data.title}:</span>
                <span className={data.classname}>{data.value || '-'}</span>
              </p>
            </Col>
          ))}
        </Row>
      );
    };
    const columns = [
      {
        title: '订单概要',
        dataIndex: 'order',
        key: 'key',
        render: children,
      },
    ];
    const dataSource = [
      {
        key: 'order-td',
        order: {
          ...data.orderSummary,
        },
      },
    ];
    const buttonTypes = {
      '1':
        // <Button
        //   type="primary"
        //   onClick={() => {
        //     this.props.history.push('/orders/applyFor')
        //   }}
        // >申请发票</Button>
        null,
      '2': (
        <React.Fragment>
          <Button type="primary" onClick={() => this.evt.fetchOrderCreate(data)}>
            立即支付
          </Button>
          <Button className="theme-btn-1" onClick={() => this.evt.fetchOrderCancel(data)}>
            取消订单
          </Button>
        </React.Fragment>
      ),
      '3': <span class="eju-btn eju-btn-grag">审核中</span>,
      '4': <span class="eju-btn eju-btn-grag">已作废</span>,
    };
    // orderStatus
    const props = {
      order_title: `订单编号: ${data.traceNO || '-'}`,
      order_button: <div className="order_button">{buttonTypes[orderStatus]}</div>,
      dataSource,
      columns,
    };
    return ComponentContainer(props);
  }
  renderLayout2() {
    const columns = [
      {
        title: '项目数',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: '服务内容',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    const { name, serviceList = [] } = this.state.data.pkg || {};
    const dataSource = serviceList.map((item, key) => ((item.key = key), item));
    const tip = '备注：套餐内总共可以创建20个项目，均可做资产管理个资产交易，其中2个可以做资产诊断';
    const props = {
      order_title: `套餐详情(${name}）`,
      order_title_tip: '' && tip,
      dataSource,
      columns,
    };
    return ComponentContainer(props);
  }
  renderLayout3() {
    if (this.state.orderStatus !== '1') return null;
    const params = {
      align: 'center',
      width: '130px',
      render: (value) => {
        return value ? <Icon type="check" style={{ fontSize: '18px' }} /> : '-';
      },
    };
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
      },
      // {
      //   title: '认证主体',
      //   dataIndex: 'order2',
      //   key: 'key2',
      // },
      {
        title: '资产管理',
        dataIndex: 'hasAassetProject',
        key: 'hasAassetProject',
        ...params,
      },
      {
        title: '资产诊断',
        dataIndex: 'hasDignoseProject',
        key: 'hasDignoseProject',
        ...params,
      },
      {
        title: '资产交易',
        dataIndex: 'hasMarketProject',
        key: 'hasMarketProject',
        ...params,
      },
    ];

    const { usedCount, totalCount, projectList = [] } = this.state.data.project || {};
    const dataSource = projectList.map((item, key) => ((item.key = key), item));
    const props = {
      order_title: `创建项目数（${usedCount}/${totalCount}）`,
      dataSource,
      columns,
      order_button: totalCount > 1 && (
        <Button
          type="primary"
          onClick={() =>
            this.props.history.push(`/create-project/flow/1?orderId=${this.state.data.orderId}`)
          }
        >
          创建新项目
        </Button>
      ),
    };
    return ComponentContainer(props);
  }
  render() {
    return (
      <Spin indicator={antIcon} spinning={this.state.isLoading}>
        <Layout className="order-layout">
          <Breadcrumb breadData={this.state.breadData} />
          <div className="eju_container">
            {this.renderLayout1()}
            {this.renderLayout2()}
            {this.renderLayout3()}
          </div>
        </Layout>
      </Spin>
    );
  }
}

export default View;
