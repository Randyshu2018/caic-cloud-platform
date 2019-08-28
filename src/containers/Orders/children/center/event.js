// import http from 'src/utils/http'
import NProgress from 'nprogress';
import OrderServices from 'src/services/order';
import OrderPay from 'src/modules/orderPay';
import { message } from 'antd';
// import CreateProjectServices from 'src/services/createProject';
const Pay = new OrderPay();
export default class Event {
  // 创建订单
  fetchOrderCreate = async ({ orderId }) => {
    try {
      this.setState({
        loading: true,
      });
      const res = await OrderServices.fetchOrderPayment({ orderId });
      // console.log(res);
      if (res.responseCode === '000') {
        const order = res.data;
        Pay.createForm(order);
      }
    } catch (error) {
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  // 取消订单
  fetchOrderCancel = async ({ orderId }) => {
    try {
      this.setState({
        loading: true,
      });
      const res = await OrderServices.fetchOrderCancel({
        orderId,
        memberId: this.storageUser.memberId,
      });
      if (res) {
        message.info('操作成功');
        this.fetchData();
      }
    } catch (error) {
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  fetchMerchantList = () => {
    OrderServices.fetchMerchantList({ memberId: this.storageUser.memberId }).then((res) => {
      const { data = [] } = res;

      this.setState({
        merchantList: data,
      });
    });
  };
  handlePaginationChange = (page, pageSize) => {
    this.setState(
      {
        defaultCurrent: page,
      },
      () => {
        const ski = Object.assign(this.ski, { pageNum: page });
        this.fetchData(ski);
      }
    );
  };
  fetchData = async (payload = {}) => {
    NProgress.start();
    try {
      const params = Object.assign({ ...this.defaultSki }, payload);
      const res = await OrderServices.fetchOrderList(params);

      this.setState({
        ...res.data,
        dataSource: ((res.data || {}).list || []).map(
          (item, i) => ((item.key = i.toString()), item)
        ),
      });
    } catch (error) {
      return [];
    } finally {
      NProgress.done();
    }
  };
  handleLink = (id) => {
    this.props.history.push(`/orders/detail?orderId=${id}`);
  };
  handleSearch = (formData) => {
    return new Promise(async (resolve, reject) => {
      const dateKeys = ['beginDate', 'endDate'];
      const date = formData.date || [];
      dateKeys.forEach((v, i) => (formData[v] = date[i] && date[i].format('YYYY-MM-DD')));
      delete formData.date;
      this.setState(
        {
          defaultCurrent: 1,
        },
        async () => {
          this.ski = Object.assign({ ...this.defaultSki }, formData);
          await this.fetchData(this.ski);
          resolve();
        }
      );
    });
  };
}
