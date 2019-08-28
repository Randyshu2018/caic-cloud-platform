import React, { Fragment } from 'react';
import { Button, Checkbox, Layout, message } from 'antd';
import AsyncComponent from '../../components/AsyncComponent/AsyncComponent';
import '../CreateProject/components/pkg.scss';
import { CreateProjectServices } from '../../services/createProject';
import { getStorageObj } from '../../modules/utils';
import OrderPay from '../../modules/orderPay';

const ComponentAgreement = AsyncComponent(() => import('src/components/Agreement'));

export default class UpgradePackage extends React.Component {
  state = {
    packages: [],
    isAgree: true,
  };

  get memberName() {
    try {
      const {
        loginAccount: {
          member: { name },
        },
      } = getStorageObj('user');

      return name;
    } catch (e) {
      console.log(e);
      return '';
    }
  }

  componentDidMount() {
    const {
      match: {
        params: { orderId },
      },
    } = this.props;

    new CreateProjectServices().fetchUpgradePackage(orderId).then((packages) => {
      this.setState({ packages });
    });
  }

  choosePackage = (packageId) => () => {
    const {
      match: {
        params: { orderId },
      },
    } = this.props;
    const { isAgree } = this.state;
    if (isAgree) {
      new CreateProjectServices()
        .upgradePackage({ origOrderId: orderId, packageId, createBy: this.memberName })
        .then((res) => {
          if (res !== false) {
            this.doPay(res);
          }
        });
    } else {
      message.warn('升级套餐前请先阅读"用户协议"，并勾选同意选项');
    }
  };

  doPay(orderId) {
    return new CreateProjectServices().orderPayment(orderId).then((res) => {
      if (res !== false) {
        new OrderPay().createForm(res);
      }
    });
  }

  agreeUserAgreement = (e) => {
    this.setState({ isAgree: e.target.checked });
  };

  render() {
    const { packages, isAgree } = this.state;
    return (
      <Layout className="eju-projectCombo eju-flex-a" style={{ padding: '40px 0 70px' }}>
        <div className="eju-projectCombo_header_title text-center">
          <h1>升级套餐</h1>
          <p>升级后保留原有数据还可立享优惠。运营版A套餐剩余时长可抵扣升级费用。</p>
        </div>
        <div className="eju-projectCombo_body eju-flex-row">
          {packages.map((pkg, index) => {
            const {
              id,
              price,
              origPrice,
              flag,
              name,
              origServiceList,
              currentPackage,
              upgrade,
              projectArea,
              priceDeductionAmount,
            } = pkg;

            const btnText = upgrade ? '立即升级' : currentPackage ? '当前套餐' : '不可用';

            return (
              <div key={index} className="item eju-flex-column eju-flex-a">
                {flag != null && <div className="pkg-flag">{flag}</div>}
                <div className="item-title">{name}</div>
                <div className="eju-flex-1 eju-flex-column eju-flex-a">
                  <div className="item-original-price">
                    {/* 原价<span className="line-through">{pkg.origPrice}</span> */}
                    {projectArea && <div>项目面积{projectArea}㎡</div>}
                    {priceDeductionAmount > 0 && (
                      <Fragment>
                        <div>原价¥{origPrice}</div>
                        <div>套餐抵扣¥{priceDeductionAmount}</div>
                      </Fragment>
                    )}
                  </div>
                  <div className="item-price">{price || '-'}</div>
                  {/* <div className="pkg-day">每天仅￥{pkg.effectiveMonth}</div> */}
                  <div className="item-content-row">
                    {(origServiceList || []).map(({ id, quantity, name }) => (
                      <div className={quantity == 0 ? 'dont line-through' : undefined} key={id}>
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  className="item-btn eju-flex-center"
                  onClick={this.choosePackage(id)}
                  disabled={!upgrade}
                >
                  {btnText}
                </Button>
              </div>
            );
          })}
        </div>
        <div className="eju-projectCombo_footer eju-flex-a eju-flex-row">
          <Checkbox onChange={this.agreeUserAgreement} checked={isAgree}>
            我已阅读并同意
          </Checkbox>
          <ComponentAgreement>
            <span className="text-span" style={{ marginLeft: -10 }}>
              《用户协议》
            </span>
          </ComponentAgreement>
        </div>
      </Layout>
    );
  }
}
