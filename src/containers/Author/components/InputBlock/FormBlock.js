import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import { AuthorizeServices } from '../../../../services/author';
import { authorizeRoles } from '../../authorizeBase';
import './style.scss';

const FormItem = Form.Item;
const Option = Select.Option;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class FormBlock extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    projectName: PropTypes.string,
  };

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
    const { projectName } = this.props;

    const formItemLayout = {
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
          span: 8,
        },
      },
    };
    const tailLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 8,
          offset: 3,
        },
      },
    };

    return (
      <div className="formBlockContainer">
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="账号">
            {getFieldDecorator('licenseUin', {
              initialValue: this.props.mobile,
              rules: [
                {
                  required: true,
                  message: '请输入正确的手机号',
                },
              ],
            })(
              <Input
                placeholder="请输入手机号"
                type="number"
                maxLength={11}
                style={{ backgroundColor: '#ffffff', border: 'none', color: '#333333' }}
                disabled
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('licenseName', {
              initialValue: this.props.name,
              rules: [
                {
                  required: true,
                  message: '请输入正确的姓名',
                },
              ],
            })(
              <Input
                placeholder="请输入姓名"
                maxLength={30}
                minLength={10}
                style={{ backgroundColor: '#ffffff', border: 'none', color: '#333333' }}
                disabled
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('type', {
              initialValue: this.props.lType,
              rules: [
                {
                  required: true,
                  message: '请输入正确的姓名',
                },
              ],
            })(
              <Input
                placeholder="类型"
                style={{ backgroundColor: '#ffffff', border: 'none', color: '#333333' }}
                disabled
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择项目">
            <span style={{ paddingLeft: 10, color: '#333' }}>{projectName}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="被授权人角色">
            {getFieldDecorator('roleType', {
              rules: [
                {
                  required: true,
                  message: '请选择被授权人角色',
                },
              ],
            })(
              <Select placeholder="请选择授权人角色">
                {authorizeRoles.map(({ name }, index) => (
                  <Option value={name} key={index + 'li'}>
                    {name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="数据时间区间">
            <Row>
              <Col span={12}>
                {getFieldDecorator('beginMonth', {
                  rules: [
                    {
                      required: true,
                      message: '请选择开始时间',
                    },
                  ],
                })(
                  <Select placeholder="开始时间">
                    {beginDates.map(({ text, value }) => (
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
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间',
                    },
                  ],
                })(
                  <Select placeholder="结束时间" style={{}}>
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

const mapStateToProps = (state) => {
  const {
    sideProjects: { signedProjects, projectId },
  } = state;

  const { name: projectName } =
    signedProjects.find(({ assetProjectDto: { id } }) => id === projectId) || {};

  return {
    projectName,
    projectId,
  };
};

export default Form.create()(connect(mapStateToProps)(FormBlock));
