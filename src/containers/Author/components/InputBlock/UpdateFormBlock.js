import React, { Component } from 'react';
import './style.scss';
import { AuthorizeServices } from '../../../../services/author';
import { Form, Select, Button, Row, Col } from 'antd';
import { authorizeRoles } from '../../authorizeBase';

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class UpdateFormBlock extends Component {
  state = {
    beginDates: [],
    endDates: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  componentDidMount() {
    new AuthorizeServices().fetchAuthorizeDates().then(({ beginDates = [], endDates = [] }) => {
      this.setState({ beginDates, endDates });
    });
  }

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;
    const { beginDates, endDates } = this.state;
    const { authorize } = this.props;

    const formSelectLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 3,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
      },
    };

    const tailLayout = {
      wrapperCol: {
        sm: {
          span: 14,
          offset: 3,
        },
      },
    };

    return (
      <div className="formBlockContainer" style={{ height: '450px' }}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formSelectLayout} label="被授权人角色">
            <Row gutter={8}>
              <Col span={12}>
                {getFieldDecorator('roleType', {
                  initialValue: authorize.roleType,
                  rules: [
                    {
                      required: true,
                      message: '请选择被授权人角色',
                    },
                  ],
                })(
                  <Select placeholder="请选择授权人角色">
                    {authorizeRoles.map(({ name }) => (
                      <Option value={name} key={name}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formSelectLayout} label="数据时间区间">
            <Row>
              <Col span={12}>
                {getFieldDecorator('beginMonth', {
                  initialValue: authorize.beginMonth,
                  rules: [
                    {
                      required: true,
                      message: '请选择开始时间',
                    },
                  ],
                })(
                  <Select placeholder="请选择开始时间">
                    {beginDates.map(({ value, text }) => (
                      <Option value={value} key={value}>
                        {text}
                      </Option>
                    ))}
                  </Select>
                )}
              </Col>
              <Col
                span={1}
                style={{
                  textAlign: 'center',
                }}
              >
                -
              </Col>
              <Col span={11}>
                {getFieldDecorator('endMonth', {
                  initialValue: authorize.endMonth,
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间',
                    },
                  ],
                })(
                  <Select placeholder="请选择结束时间">
                    {endDates.map(({ value, text }) => (
                      <Option value={value} key={value}>
                        {text}
                      </Option>
                    ))}
                  </Select>
                )}
              </Col>
            </Row>
          </FormItem>
          <FormItem {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              className="buttonStyle"
              disabled={hasErrors(getFieldsError())}
            >
              确认授权
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(UpdateFormBlock);
