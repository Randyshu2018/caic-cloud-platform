import React from 'react';
import {
  DatePicker,
  // Modal,
  Input,
  // Radio,
  Select,
  Layout,
  Form,
  Button,
  Spin,
  Icon,
  Checkbox,
} from 'antd';
import ComponentEvent from 'src/hoc/componentEvent';
import FormLayout from 'src/components/Form/CreateProject';
import { ContextComponent } from 'src/context/index';
import moment from 'moment';
import { getPageQuery, getStorageObj } from 'src/modules/utils';
import Event from './event';
import { CreateProjectServices } from '../../../../services/createProject';
import OrderPay from '../../../../modules/orderPay';

const antIcon = <Icon type="loading" style={{ fontSize: 28 }} spin />;

@ComponentEvent(Event)
class View extends React.Component {
  constructor(props) {
    super(props);

    this.editData = [{ id: 3, value: '企业' }, { id: 1, value: '个人' }];

    const render = ({ relevanceKeys, initialValue, key }, thisForm) => {
      const children = [];
      const keys = relevanceKeys.key.split('|');
      const values = thisForm.getFieldsValue();
      const isRelevanceValue = keys.find((k) => !values[k]);
      if (!isRelevanceValue) {
        children.push(
          <Input
            value={values[key]}
            onChange={(e) => {
              thisForm.setFieldsValue({ [key]: e.target.value });
            }}
          />
        );
      } else {
        children.push(
          <span key={key} className="text-color">
            请先上传{relevanceKeys.title}
          </span>
        );
      }
      return (
        <React.Fragment>
          {children}
          {thisForm.renderInputHidden({ key, initialValue })}
        </React.Fragment>
      );
    };

    this.state = {
      type: 3,
      isEjuForm: true,
      merchantList: [],
      loading: false,
      isPageinitLoading: true,
      merchantId: null,
      // visible: false,
      // merchantOrderList: [],
      // initialValueRadio: '0',
      data: {
        name: '验证身份',
        children: {
          3: [
            {
              title: '主体类型',
              key: 'type',
              type: 'radio',
              initialValue: 3,
              required: true,
              editData: this.editData,
            },
            {
              title: '联系人姓名',
              key: 'contactName',
            },
            {
              title: '营业执照副本',
              key: 'businessLicenseUrl',
              type: 'uploadImg',
              required: true,
              formKey: { bizLicenseUrl: '上传营业执照' },
            },
            {
              title: '企业名称',
              key: 'name',
              required: true,
              relevanceKeys: {
                key: 'bizLicenseUrl',
                title: '营业执照副本',
              },
              render,
            },
            {
              title: '证件号码',
              key: 'bizLicenseNum',
              relevanceKeys: {
                key: 'bizLicenseUrl',
                title: '营业执照副本',
              },
              required: true,
              render,
            },
            {
              title: '住所',
              key: 'address',
              relevanceKeys: {
                key: 'bizLicenseUrl',
                title: '营业执照副本',
              },
              required: true,
              render,
            },
            {
              title: '证件有效期',
              key: 'date',
              type: 'datePicker',
              required: true,
              render: ({ key, initialValue }, thisForm) => {
                const formValue = thisForm.getFieldsValue();
                const beginValue = formValue['beginDate']
                  ? moment(formValue['beginDate'], 'YYYY-MM-DD')
                  : void 0;
                return (
                  <div className="eju-flex" key={key}>
                    {thisForm.renderInputHidden({ key: 'dateCheckbox', initialValue: false })}
                    <div className="eju-flex" style={{ marginRight: '15px' }}>
                      <DatePicker
                        value={beginValue}
                        placeholder="开始时间"
                        format={'YYYY-MM-DD'}
                        onChange={(e) => {
                          thisForm.setFieldsValue({ beginDate: e && e.format('YYYY-MM-DD') });
                        }}
                      />
                      <span style={{ margin: '0 10px' }}>~</span>
                      <DatePicker
                        placeholder="结束时间"
                        format={'YYYY-MM-DD'}
                        disabled={formValue['dateCheckbox']}
                        onChange={(e) => {
                          thisForm.setFieldsValue({ endDate: e && e.format('YYYY-MM-DD') });
                        }}
                      />
                      {thisForm.renderInputHidden({ key: 'beginDate', initialValue })}
                      {thisForm.renderInputHidden({ key: 'endDate', initialValue })}
                    </div>
                    <Checkbox
                      onChange={(checkedValue) => {
                        const { checked } = checkedValue.target;
                        const setFieldsValue = { dateCheckbox: checked };
                        thisForm.setFieldsValue(setFieldsValue);
                      }}
                    >
                      永久有效
                    </Checkbox>
                  </div>
                );
              },
              // render
            },
            {
              title: '法人姓名',
              key: 'legalPersonRealName',
              relevanceKeys: {
                key: 'legalPersonIdFrontUrl|legalPersonIdBackUrl',
                title: '法人身份证',
              },
              // required: true,
              // render,
            },
          ],
          1: [
            {
              title: '主体类型',
              key: 'type',
              type: 'radio',
              initialValue: 1,
              required: true,
              editData: this.editData,
            },
            {
              title: '身份证',
              key: 'card',
              type: 'uploadImg',
              required: true,
              isItem: true,
              formKey: { idFrontUrl: '上传身份证正面', idBackUrl: '上传身份证反面' },
            },
            {
              title: '姓名',
              key: 'realName',
              relevanceKeys: {
                key: 'idFrontUrl|idBackUrl',
                title: '身份证',
              },
              required: true,
              render,
            },
            {
              title: '身份证号码',
              key: 'idNum',
              relevanceKeys: {
                key: 'idFrontUrl|idBackUrl',
                title: '身份证',
              },
              required: true,
              render,
            },
          ],
        },
      },
    };
    this.query = {};
  }

  get memberId() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return memberId;
  }

  get packageId() {
    return getPageQuery().packageId;
  }

  async componentDidMount() {
    try {
      await this.fetchData();
      this.setState({
        isPageinitLoading: false,
      });
    } catch (error) {
      throw error;
    }
  }

  renderForm() {
    const opt = {
      requset: {
        get: async (params = {}) => {
          return {};
        },
        set: async (_params = {}) => {
          this.save(_params);
          return {};
        },
      },
      ...this.state.data,
    };
    const { children, requset } = opt;
    return (
      <Layout className="eju-projectVerify eju-flex-a">
        <div className="container">
          <FormLayout
            requset={requset}
            formData={children[this.state.type]}
            tip="确认信息填写完整，点击按钮提交认证信息，即可开展相关业务。"
            onChange={this.handleFormChange}
            $handleEjuForm={() => this.setState({ isEjuForm: false })}
          />
        </div>
      </Layout>
    );
  }

  chooseMerchant = (merchantId) => {
    this.setState({ merchantId });
  };

  createSignedOrder = async () => {
    const {
      memberId,
      packageId,
      state: { merchantId },
    } = this;

    const createProjectServices = new CreateProjectServices();
    const orderId = await createProjectServices.createSignedOrder({
      memberId,
      merchantId,
      packageId,
    });
    if (orderId !== false) {
      this.doPay(orderId);
    }
  };

  doPay(orderId) {
    return new CreateProjectServices().orderPayment(orderId).then((res) => {
      if (res !== false) {
        new OrderPay(`/create-project/flow/3?orderId=${orderId}`).createForm(res);
      }
    });
  }

  renderKnown() {
    const data = {
      title: '已有认证主体',
      key: 'merchantId',
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const footer = (children, className = '') => {
      const wrapperCol = {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 6 },
      };
      return (
        <Form.Item wrapperCol={wrapperCol} className={className}>
          {children}
        </Form.Item>
      );
    };

    const { merchantList, merchantId } = this.state;

    return (
      <div className="eju-form-container">
        <Form>
          <Form.Item
            {...formItemLayout}
            label={<span className="ant-form-item-required">{data.title}</span>}
          >
            <div style={{ width: 428 }}>
              <Select defaultValue={merchantId} onSelect={this.chooseMerchant}>
                <Select.Option value={null}>请选择</Select.Option>
                {merchantList.map(({ id, name }) => (
                  <Select.Option value={id} key={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </Form.Item>
          {footer(
            <Button
              type="dashed"
              icon="plus"
              className="btn-plus active"
              style={{ width: 428 }}
              onClick={this.handleMerchantClick}
            >
              添加新的认证主体
            </Button>
          )}
          {footer(
            <Button type="primary" onClick={this.createSignedOrder}>
              下一步
            </Button>
          )}
        </Form>
      </div>
    );
  }

  render() {
    if (this.state.isPageinitLoading) return <Spin />;
    const children = this.state.isEjuForm ? this.renderForm() : this.renderKnown();
    return (
      <Spin indicator={antIcon} spinning={this.state.loading} tip={this.state.loadingTip}>
        <ContextComponent.Provider value={{ $handleRecognition: this.handleRecognition }}>
          {children}
        </ContextComponent.Provider>
      </Spin>
    );
  }
}

export default View;
