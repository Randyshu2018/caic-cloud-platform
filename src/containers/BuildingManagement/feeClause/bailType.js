/**
 * 保证金条款
 */
import React from 'react';
// import { Link } from 'react-router-dom';
import { Form, Row, Col, Input, DatePicker, InputNumber } from 'antd';
import '../style/index.scss';

class App extends React.Component {
  render() {
    const { getFieldDecorator } = this.props;
    return (
      <div className="pl-10 pr-10">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="保证金类型">
              {getFieldDecorator(`field-10`, {
                initialValue: '租金保证金',
                rules: [
                  {
                    required: false,
                    message: '请输入信息',
                  },
                ],
              })(<Input placeholder="" disabled />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="保证金金额">
              {getFieldDecorator(`billAmount-bzj`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入保证金金额',
                  },
                ],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="请输入金额(元)" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="付款时间">
              {getFieldDecorator(`billDate-bzj`, {
                // initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              })(<DatePicker />)}
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}
export default App;
