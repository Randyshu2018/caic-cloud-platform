import React from 'react';
import { connect } from 'react-redux';
import { Drawer, Row, Col, Spin } from 'antd';
import { map } from 'lodash';
import closeSvg from './assets/close.svg';
import { fetchCustomerDetail } from '../../reducers/investment';
import { CUSTOMER_STATUS_NAME } from '../../modules/ENUM';
import { format } from '../../modules/date';
import './CustomerDetail.scss';

function formatSlash(date) {
  return date == null ? '-' : format(date, 'YYYY/MM/DD');
}

class _CustomerDetail extends React.Component {
  state = {};

  get id() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    return id;
  }

  componentDidMount() {
    this.props.dispatch(fetchCustomerDetail(this.id));
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { customerDetails, customerDetailLoading } = this.props;

    const customer = customerDetails[this.id] || {};

    return (
      <Drawer
        // title="招商管理"
        className="investment-drawer"
        width={700}
        closable={false}
        onClose={this.goBack}
        visible={true}
      >
        <div className="customer-detail-body">
          <header className="customer-title">
            <div className="close" onClick={this.goBack}>
              <img src={closeSvg} alt="close" />
            </div>
            客户详情
          </header>
          <Spin size="large" spinning={customerDetailLoading}>
            <div className="customer-detail-main">
              <h2 className="customer-content-title">{customer.name}</h2>
              <div className="customer-contain customer-important">
                <Row>
                  <Col span={8}>
                    <div className="detail-item-title">租客状态</div>
                    <div className="detail-item-content">
                      {CUSTOMER_STATUS_NAME[customer.status]}
                    </div>
                    <div className="detail-item-date">{formatSlash(customer.visitDate)}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">成交几率</div>
                    <div className="detail-item-content">{customer.dealPercent}%</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">需求面积</div>
                    <div className="detail-item-content">
                      {(customer.expectAreaFrom || '') + '-' + (customer.expectAreaTo || '')}㎡
                    </div>
                  </Col>
                </Row>
              </div>
              <h2 className="customer-content-title">租客信息</h2>
              <div className="customer-contain">
                <Row>
                  <Col span={8}>
                    <div className="detail-item-title">租客联系人</div>
                    <div className="detail-item-content">{customer.contactName}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">联系电话</div>
                    <div className="detail-item-content">{customer.contactPhone}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">行业</div>
                    <div className="detail-item-content">{customer.industry}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">期望价格</div>
                    <div className="detail-item-content">
                      {(customer.expectPriceFrom || '') + '-' + (customer.expectPriceTo || '')}元/㎡/天
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">预计入住时间</div>
                    <div className="detail-item-content">
                      {formatSlash(customer.expectSigningDate)}
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">来访途径</div>
                    <div className="detail-item-content">{customer.source}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">来访时间</div>
                    <div className="detail-item-content">{formatSlash(customer.visitDate)}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">渠道联系人</div>
                    <div className="detail-item-content">{customer.channelContactName}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">渠道联系人电话</div>
                    <div className="detail-item-content">{customer.channelContactPhone}</div>
                  </Col>
                </Row>
              </div>
              <h2 className="customer-content-title">租客当前信息</h2>
              <div className="customer-contain">
                <Row>
                  <Col span={8}>
                    <div className="detail-item-title">当前合同到期日</div>
                    <div className="detail-item-content">{formatSlash(customer.expiredDate)}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">当前面积</div>
                    <div className="detail-item-content">{customer.area}</div>
                  </Col>
                  <Col span={8}>
                    <div className="detail-item-title">当前租金</div>
                    <div className="detail-item-content">{customer.rentAmt}</div>
                  </Col>
                  <Col span={24}>
                    <div className="detail-item-title">当前地址</div>
                    <div className="detail-item-content">{customer.address}</div>
                  </Col>
                </Row>
              </div>
              <h2 className="customer-content-title">备注</h2>
              <div className="customer-memos">
                {map(customer.memoList, ({ id, nickName, content, uploadTime }) => (
                  <div className="customer-memo-item" key={id}>
                    <header className="memo-title">
                      <div className="fr">{formatSlash(uploadTime)}</div>
                      {nickName}
                    </header>
                    <div className="memo-content">{content}</div>
                  </div>
                ))}
              </div>
            </div>
          </Spin>
        </div>
      </Drawer>
    );
  }
}

const mapStateToProps = (state) => {
  const { customerDetails, customerDetailLoading } = state.investmentCustomer;

  return {
    customerDetails,
    customerDetailLoading,
  };
};

export const CustomerDetail = connect(mapStateToProps)(_CustomerDetail);
