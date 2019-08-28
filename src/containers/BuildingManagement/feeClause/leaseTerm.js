/**
 * 租期条款
 */
import React from 'react';
// import { Link } from 'react-router-dom';
import { Form, Row, Col, Input, Select } from 'antd';
import '../style/index.scss';
import ZdyBuild from './zdyBuild';
import XtBuild from './xtBuild';
const { Option } = Select;

class App extends React.Component {
  state = {
    type: 'system',
  };
  handleCurrencyChange = (type) => {
    this.setState({ type });
  };
  render() {
    const { getFieldDecorator } = this.props;
    const { type } = this.state;
    const Tmpl =
      type === 'customer' ? (
        <ZdyBuild getFieldDecorator={getFieldDecorator} />
      ) : (
        <XtBuild getFieldDecorator={getFieldDecorator} />
      );
    return (
      <div className="pl-10 pr-10 pt-10">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="">
              {getFieldDecorator(`billType`, {
                initialValue: type,
                rules: [
                  {
                    required: false,
                    message: '请输入信息',
                  },
                ],
              })(
                <Select style={{ width: 176 }} onChange={this.handleCurrencyChange}>
                  <Option value="customer">自定义生成账单</Option>
                  <Option value="system">系统生成账单</Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        {Tmpl}
        {/* <ZdyBuild getFieldDecorator={getFieldDecorator} /> */}
        {/* <XtBuild getFieldDecorator={getFieldDecorator} /> */}
      </div>
    );
  }
}
export default App;
