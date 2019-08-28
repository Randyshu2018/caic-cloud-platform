import NProgress from 'nprogress';
import { message, Modal } from 'antd';
import { getPageQuery } from 'src/modules/utils';
import OrderServices from 'src/services/order';
import OrderPay from 'src/modules/orderPay';
const Pay = new OrderPay();
const { confirm } = Modal;
export default class Event {
  fetchData = async () => {
    NProgress.start();
    try {
      this.setState({
        isLoading: true,
      });
      const { orderId } = getPageQuery();
      const res = await OrderServices.fetchOrderDetail({ orderId });
      if (res.data) {
        const { status } = res.data;
        // SUPPLEMENT("SUPPLEMENT", "待完善"),
        // WAIT_PAY("WAIT_PAY", "待付款"),
        // OFF_LINE_CONFIRM("OFF_LINE_CONFIRM", "待确认"),
        // /** 付款成功/已生效 */
        // PAY_SUCCESS("PAY_SUCCESS", "已生效"),
        // PAY_FAILURE("PAY_FAILURE", "付款失败"),
        // /** 取消/作废 */
        // CANCEL("CANCEL", "作废"),
        // EXPIRED_SERVICE("EXPIRED_SERVICE", "服务过期");
        const orderStatusType = {
          // 待付款
          WAIT_PAY: '2',
          // 付款成功已生效
          PAY_SUCCESS: '1',
          // 付款失败
          PAY_FAILURE: '3',
          // 作废
          CANCEL: '4',
          // 待确认
          OFF_LINE_CONFIRM: '5',
          // 待完善
          SUPPLEMENT: '6',
          // 服务过期
          EXPIRED_SERVICE: '7',
        };
        this.setState({
          isLoading: false,
          orderStatus: orderStatusType[status],
          data: res.data,
        });
      }
    } catch (error) {
    } finally {
      NProgress.done();
    }
  };
  // 创建订单
  fetchOrderCreate = async ({ orderId }) => {
    try {
      this.setState({
        isLoading: true,
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
        isLoading: false,
      });
    }
  };
  // 取消订单
  fetchOrderCancel = async ({ orderId }) => {
    confirm({
      title: '确认取消此订单吗？',
      onOk: async () => {
        await OrderServices.fetchOrderCancel({ orderId, memberId: this.storageUser.memberId });
        message.info('操作成功');
        this.evt.fetchData();
      },
    });
  };
}
