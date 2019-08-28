import React, { Component } from 'react';
import { Modal, Row, Col, Input, DatePicker, Form } from 'antd';
import api from 'api';
import locale from 'antd/es/date-picker/locale/zh_CN';
// import FormLayout from 'src/components/Form/rentForm';
// import * as Context from 'src/containers/Deposit/context';
// const { ContextComponent } = Context;
const { TextArea } = Input;
@Form.create()
class DepositBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      id: 0,
      account: 0,
      data: {},
    };
  }

  componentDidMount() {}

  handleOk = (e) => {
    this.handleSubmit();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const value = {
          ...values,
          bookDate: values['bookDate'].format('YYYY-MM-DD'),
          billId: this.props.id,
        };
        console.log('Received values of form: ', value);
        delete value.money;
        api.contractDepositCostSettle({ ...value }).then((res) => {
          if (res) {
            this.props.close(false);
            window.depositTableGetData();
          }
        });
      }
    });
  };

  render() {
    const { close } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        className="depositBox"
        title="费用结清"
        visible={this.state.visible}
        onOk={this.handleSubmit}
        onCancel={() => close(false)}
        destroyOnClose
      >
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <Row>
            <Col span={12}>
              <Form.Item label="入账时间">
                {getFieldDecorator('bookDate', {
                  rules: [{ required: true, message: '请选择日期' }],
                })(<DatePicker format="YYYY-MM-DD" locale={locale} />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="金额">
                {getFieldDecorator('money', {
                  rules: [{ required: true, message: '请输入金额' }],
                  initialValue: this.props.account + '元',
                })(<Input disabled className="money" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="备注信息">
                {getFieldDecorator('remark', {
                  rules: [{ required: false, message: '' }],
                })(<TextArea rows={4} style={{ width: 470 }} />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}
export default DepositBox;
