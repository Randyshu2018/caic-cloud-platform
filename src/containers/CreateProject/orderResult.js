import NProgress from 'nprogress';
import React from 'react';
import Cookie from 'js-cookie';
import { Layout } from 'antd';
import CreateProjectServices from 'src/services/createProject';
import './style.scss';
import { getPageQuery, isEmpty } from 'src/modules/utils';
import SuccessIcon from 'src/components/Icon/SuccessIcon.js';
import { ORDER_PAY_RETURN_REDIRECT } from '../../modules/ENUM';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: {},
      time: 3,
    };
  }

  get query() {
    return getPageQuery();
  }

  componentDidMount() {
    this.fetchData();
    this.handleTime();
  }

  componentWillUnmount() {
    if (this.ConstSetInterval) {
      clearInterval(this.ConstSetInterval);
    }
  }

  handleLink = () => {
    NProgress.done();

    const redirect = Cookie.get(ORDER_PAY_RETURN_REDIRECT);
    if (!isEmpty(redirect)) {
      Cookie.remove(ORDER_PAY_RETURN_REDIRECT);
      return this.props.history.replace(redirect);
    }

    this.ConstSetInterval && clearInterval(this.ConstSetInterval);
    this.props.history.replace('/');
  };

  handleTime() {
    this.ConstSetInterval = setInterval(() => {
      let { time } = this.state;
      if (time < 1) {
        return this.handleLink();
      }
      this.setState({
        time: time - 1,
      });
    }, 1000);
  }

  async fetchData() {
    NProgress.start();
    const { orderId } = this.query;
    if (!orderId) return this.handleLink();

    const res = await CreateProjectServices.fetchQueryOrder(orderId);
    if (!isEmpty(res)) {
      this.setState({
        orderInfo: res.data,
      });
    }
  }

  render() {
    const { orderInfo, time } = this.state;
    const { amount } = orderInfo || {};

    return (
      <Layout className="eju-create-project_container eju-flex-center order-result">
        <div onClick={this.handleLink} className="eju-flex-row">
          <div>
            <SuccessIcon />
          </div>
          <div className="body">
            <div className="title">
              您已成功付款<span>{amount}</span>元
            </div>
            <div>订单号: {this.query.orderId}</div>
            <p className="time">{time} 秒后返回首页</p>
          </div>
        </div>
      </Layout>
    );
  }
}

export default View;
