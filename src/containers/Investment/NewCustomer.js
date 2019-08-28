import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form,
  Button,
  Drawer,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Slider,
  Spin,
  message,
} from 'antd';
import moment, { isMoment } from 'moment';
import { forEach } from 'lodash';
import { CUSTOMER_STATUS, SOURCE_NAME, TEL_REGEXP } from '../../modules/ENUM';
import { InvestmentServices } from '../../services/incestmentServices';
import { fetchCustomerDetail } from '../../reducers/investment';
import { getStorageObj } from '../../modules/utils';
import closeSvg from './assets/close.svg';
import './NewCustomer.scss';

const { Option } = Select;
const { TextArea } = Input;

const Memo = ({
  getFieldDecorator,
  field,
  index,
  getFieldDecoratorOption = {},
  hasAddButton = false,
  addMemo,
  removeMemo,
}) => {
  const hasRemoveMemo = typeof removeMemo === 'function';
  return (
    <div className="add-customer-memo">
      <Form.Item
        label={
          hasAddButton ? (
            <div className="new-customer-memo">
              <div className="fr">
                <Button type="link" onClick={addMemo}>
                  添加备注
                </Button>
              </div>
              备注
            </div>
          ) : (
            ''
          )
        }
      >
        {getFieldDecorator(field, getFieldDecoratorOption)(
          <TextArea rows={4} style={{ minHeight: 90 }} placeholder="请填写备注信息" />
        )}
      </Form.Item>
      {hasRemoveMemo && <div className="delete-memo" onClick={removeMemo(index)} />}
    </div>
  );
};

class NewCustomerForm extends React.PureComponent {
  static propTypes = {
    isNeedCreateCustomer: PropTypes.bool.isRequired,
    updating: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
    customer: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  state = {
    memos: [{}],
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const memos = nextProps.customer.memoList;
    if (Array.isArray(memos) && memos.length > 0 && this.state.memos.length <= memos.length) {
      this.setState({ memos });
    }
  }

  addMemo = (e) => {
    e.preventDefault();
    const { memos } = this.state;
    const memoNode = memos.slice(0);

    const index = memoNode.length;
    memoNode[index] = index;

    this.setState({ memos: memoNode });
  };

  removeMemo = (index) => (e) => {
    e.preventDefault();
    const { memos } = this.state;
    const _memos = memos.splice(0);

    _memos.splice(index, 1);
    this.setState({ memos: _memos });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  getTelValueFromEvent(e) {
    if (!e || !e.target) {
      return e;
    }
    const {
      target: { value },
    } = e;
    return value.replace(/[^-0-9+]/, '');
  }

  render() {
    const { memos } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
      isNeedCreateCustomer,
      updating,
      customer,
      onCancel,
    } = this.props;

    return (
      <Form
        className="new-customer-form"
        onSubmit={this.onSubmit}
        layout="vertical"
        // hideRequiredMark
      >
        <h2 className="customer-content-title">租客信息</h2>
        <div className="customer-contain">
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="租客">
                {getFieldDecorator('name', {
                  initialValue: customer.name,
                  rules: [{ required: true, message: '请输入客户名称' }],
                })(<Input placeholder="请输入客户名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="行业">
                {getFieldDecorator('industry', {
                  initialValue: customer.industry,
                  // rules: [{ required: true, message: '请输入客户所属行业' }],
                })(<Input placeholder="请输入客户所属行业" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="租客联系人">
                {getFieldDecorator('contactName', {
                  initialValue: customer.contactName,
                  rules: [{ required: true, message: '请输入联系人名称' }],
                })(<Input placeholder="请输入联系人名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="联系电话">
                {getFieldDecorator('contactPhone', {
                  initialValue: customer.contactPhone,
                  getValueFromEvent: this.getTelValueFromEvent,
                  rules: [
                    { required: true, message: '请输入联系电话' },
                    { pattern: TEL_REGEXP, message: '请输入正确的电话号码' },
                  ],
                })(<Input type="tel" placeholder="请输入联系电话" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="需求面积(㎡)" required={true} style={{ marginBottom: 0 }}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('expectAreaFrom', {
                    initialValue: customer.expectAreaFrom,
                    rules: [
                      { required: true, message: '请输入最小需求面积' },
                      { min: 1, message: '需求面积大于 0' },
                    ],
                  })(<Input type="number" min={1} step="0.01" placeholder="最小需求面积" />)}
                </Form.Item>
                <span className="space text-center">-</span>
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('expectAreaTo', {
                    initialValue: customer.expectAreaTo,
                    rules: [
                      { required: true, message: '请输入最大需求面积' },
                      {
                        validator: (rule, value, callback) => {
                          if (parseFloat(value) < parseFloat(getFieldValue('expectAreaFrom'))) {
                            callback('最大需求面积应当比最小需求面积大');
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<Input type="number" min={1} step="0.01" placeholder="最大需求面积" />)}
                </Form.Item>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="期望价格(元/㎡天)" style={{ marginBottom: 0 }}>
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('expectPriceFrom', {
                    initialValue: customer.expectPriceFrom,
                    rules: [
                      // { required: true, message: '请输入最小期望价格' },
                      { min: 1, message: '期望价格大于 0' },
                    ],
                  })(<Input type="number" min={1} step="0.01" placeholder="最小期望价格" />)}
                </Form.Item>
                <span className="space text-center">-</span>
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  {getFieldDecorator('expectPriceTo', {
                    initialValue: customer.expectPriceTo,
                    rules: [
                      // { required: true, message: '请输入最高期望价格' },
                      {
                        validator: (rule, value, callback) => {
                          if (parseFloat(value) < parseFloat(getFieldValue('expectPriceFrom'))) {
                            callback('最大期望价格应当比最小期望价格大');
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<Input type="number" min={1} step="0.01" placeholder="最高期望价格" />)}
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="预计签约时间">
                {getFieldDecorator('expectSigningDate', {
                  ...(customer.expectSigningDate != null && {
                    initialValue: moment(customer.expectSigningDate),
                  }),
                  // rules: [{ required: true, message: '请输入预计签约时间' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择签约时间" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="租客状态">
                {getFieldDecorator('status', {
                  initialValue: customer.status,
                  rules: [{ required: true, message: '请选择租客状态' }],
                })(
                  <Select placeholder="请选择租客状态">
                    {CUSTOMER_STATUS.map(({ name, key }) => (
                      <Option value={key} key={key}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="来访途径">
                {getFieldDecorator('source', {
                  initialValue: customer.source,
                  rules: [{ required: true, message: '请选择来访途径' }],
                })(
                  <Select placeholder="请选择来访途径">
                    {SOURCE_NAME.map(({ name }) => (
                      <Option value={name} key={name}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="来访时间">
                {getFieldDecorator('visitDate', {
                  ...(customer.visitDate != null && { initialValue: moment(customer.visitDate) }),
                  rules: [{ required: true, message: '请选择来访时间' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择来访时间" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="渠道联系人">
                {getFieldDecorator('channelContactName', {
                  initialValue: customer.channelContactName,
                  // rules: [{ required: true, message: '请输入渠道联系人名字' }],
                })(<Input placeholder="请输入渠道联系人名字" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="渠道联系人电话">
                {getFieldDecorator('channelContactPhone', {
                  initialValue: customer.channelContactPhone,
                  getValueFromEvent: this.getTelValueFromEvent,
                  rules: [
                    // { required: true, message: '请输入渠道联系人电话' },
                    { pattern: TEL_REGEXP, message: '请输入正确的电话号码' },
                  ],
                })(
                  <Input type="tel" style={{ width: '100%' }} placeholder="请输入渠道联系人电话" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={22}>
              <Form.Item label="成交几率">
                {getFieldDecorator('dealPercent', {
                  initialValue: customer.dealPercent,
                })(<Slider min={0} max={100} step={1} tipFormatter={null} />)}
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label="&nbsp;">
                <span className="ant-form-text">{`${getFieldValue('dealPercent') || 0}%`}</span>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <h2 className="customer-content-title">租客当前信息</h2>
        <div className="customer-contain">
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="当前地址">
                {getFieldDecorator('address', {
                  initialValue: customer.address,
                  // rules: [{ required: true, message: '请输入当前地址' }],
                })(<Input placeholder="请输入当前地址" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="当前合同到期日">
                {getFieldDecorator('expiredDate', {
                  ...(customer.expiredDate != null && {
                    initialValue: moment(customer.expiredDate),
                  }),
                  // rules: [{ required: true, message: '请选择当前合同到期日' }],
                })(<DatePicker style={{ width: '100%' }} placeholder="请选择当前合同到期日" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="当前面积">
                {getFieldDecorator('area', {
                  initialValue: customer.area,
                  // rules: [{ required: true, message: '请输入当前面积' }],
                })(<Input type="number" placeholder="请输入当前面积" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="当前租金">
                {getFieldDecorator('rentAmt', {
                  initialValue: customer.rentAmt,
                  // rules: [{ required: true, message: '请输入当前租金' }],
                })(<Input type="number" placeholder="请输入当前租金" />)}
              </Form.Item>
            </Col>
          </Row>
          {memos.map(({ content }, index) => {
            return (
              <Row gutter={30} key={index}>
                <Col span={24}>
                  <Memo
                    getFieldDecorator={getFieldDecorator}
                    getFieldDecoratorOption={{
                      initialValue: content,
                    }}
                    field={`memoList.${index}.content`}
                    hasAddButton={index === 0}
                    addMemo={this.addMemo}
                    // removeMemo={(isNeedCreateCustomer && index === 0) || this.removeMemo}
                    removeMemo={index !== 0 && this.removeMemo}
                    index={index}
                  />
                </Col>
              </Row>
            );
          })}
          <div>
            <Button className="btn-cancel" onClick={onCancel} style={{ marginRight: 30 }}>
              取消
            </Button>
            <Button type="primary" htmlType="submit" loading={updating}>
              保存
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

const WrappedNewCustomerForm = Form.create()(NewCustomerForm);
WrappedNewCustomerForm.propTypes = NewCustomerForm.propTypes;

class NewCustomer extends React.Component {
  state = {
    updating: false,
  };

  static get memberName() {
    const { loginAccount: { member: { name } = {} } = {} } = getStorageObj('user');
    return name;
  }

  get isNeedCreateCustomer() {
    return this.props.match.params.id === 'new';
  }

  get id() {
    return this.props.match.params.id;
  }

  get projectId() {
    return this.props.match.params.projectId;
  }

  componentDidMount() {
    if (!this.isNeedCreateCustomer) {
      this.props.dispatch(fetchCustomerDetail(this.id));
    }
  }

  updateCustomer = (values) => {
    this.setState({ updating: true });
    const result = { projectId: this.projectId };
    let msg = '新建客户信息成功。';
    if (!this.isNeedCreateCustomer) {
      result.id = this.id;
      msg = '成功编辑客户信息。';
    }

    forEach(values, (value, key) => {
      result[key] = isMoment(value) ? value.valueOf() : value;
    });

    result.memoList = result.memoList.map(({ content }) => ({
      content,
      nickName: NewCustomer.memberName,
      uploadTime: Date.now(),
    }));

    console.log(result);
    new InvestmentServices().updateCustomer(result).then((successful) => {
      this.setState({ updating: false });
      if (successful) {
        message.success(msg);
        this.goBack();
      }
    });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { customerDetails, customerDetailLoading } = this.props;
    const { updating } = this.state;

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
        <div className="new-customer-body">
          <header className="customer-title">
            <div className="close" onClick={this.goBack}>
              <img src={closeSvg} alt="close" />
            </div>
            招商管理
          </header>
          <Spin size="large" spinning={customerDetailLoading}>
            <WrappedNewCustomerForm
              updating={updating}
              isNeedCreateCustomer={this.isNeedCreateCustomer}
              customer={customer}
              onSubmit={this.updateCustomer}
              onCancel={this.goBack}
            />
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

export const WrappedNewCustomer = connect(mapStateToProps)(NewCustomer);
