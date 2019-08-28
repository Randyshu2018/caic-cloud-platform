import NProgress from 'nprogress';
import React from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import { Button, message, Col, Form } from 'antd';
import ComponentEvent from 'src/hoc/componentEvent';
import { classNameFun, getPageQuery, getStorageObj, isFunction } from 'src/modules/utils';
import ComponentItem from './components/item';

@Form.create()
@ComponentEvent(ComponentItem)
class ComponentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearchView: false,
    };
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    this.query = {
      ...getPageQuery(),
      memberId,
    };
  }
  static propTypes = {
    formData: PropTypes.array,
    requset: PropTypes.object,
  };
  static defaultTypes = {
    formData: [],
    requset: {},
  };
  get search() {
    return getPageQuery();
  }
  componentDidMount() {
    this.query.id && this.fetchData();
  }
  // 提交
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((_, values) => {
      let verify = true;
      let formValue = {
        ...values,
      };
      // console.log('formValue:', formValue);
      delete formValue.dateCheckbox;
      delete formValue.beginDate;
      delete formValue.endDate;
      delete formValue.selectedCityOptions;

      for (const _key in formValue) {
        if (!verify) break;
        const value = formValue[_key];
        if (!value && value !== 0) {
          verify = false;
          this.props.formData.find(({ title, key, formKey = {}, tip }) => {
            const isRes = key === _key;
            let msg = '';
            if (isRes) {
              msg = title.replace(/_null/g, '');
            } else {
              Object.entries(formKey).find(([key, title]) => {
                const isRes = key === _key;
                isRes && (msg = title.replace(/上传/g, ''));
                return isRes;
              });
            }
            msg && message.info(`${msg}:${tip || '不能为空'}`);
            return isRes;
          });
        }
      }
      const h = Object.hasOwnProperty;
      if (verify && h.call(formValue, 'idNum') && formValue['idNum'].length !== 18) {
        verify = false;
        message.info(`身份证号码长度必须为18位，当前长度为${formValue['idNum'].length}`);
      }
      if (
        verify &&
        h.call(formValue, 'legalPersonIdCardNum') &&
        formValue['legalPersonIdCardNum'].length !== 18
      ) {
        verify = false;
        message.info(
          `法人身份证号码长度必须为18位，当前长度为${formValue['legalPersonIdCardNum'].length}`
        );
      }
      if (verify && h.call(values, 'dateCheckbox')) {
        const { dateCheckbox, beginDate, endDate } = values;
        const getTime = (d) => new Date(d).getTime();
        if (!dateCheckbox) {
          if (!beginDate || !endDate) {
            verify = false;
            message.info(`证件有效期 ${!beginDate ? '开始' : '结束'}时间 不能为空`);
          } else if (beginDate && endDate) {
            if (getTime(beginDate) > getTime(endDate)) {
              verify = false;
              message.info(`证件有效期 开始时间 不能大于 结束时间`);
            }
          }
        } else {
          if (!beginDate) {
            verify = false;
            message.info(`证件有效期 开始时间 不能为空`);
          }
          values['endDate'] = '';
        }
        formValue = Object.assign({}, formValue, values);
        delete formValue.dateCheckbox;
      }
      verify && this.setDate(formValue);
    });
  };
  // 请求数据
  httpRequset = async (type, form = {}) => {
    NProgress.start();
    const payload = this.props.requset;
    if (payload === undefined) {
      return false;
    }
    const { memberId = null, id = null, cityCode } = this.query;
    const params = {
      memberId,
      id,
      ...form,
    };
    if (cityCode) params.cityCode = cityCode;
    try {
      return payload[type] ? await payload[type](params) : [];
    } catch (error) {
      throw Error(`${error}`);
    } finally {
      NProgress.done();
    }
  };
  async setDate(form) {
    NProgress.start();
    try {
      const res = await this.httpRequset('set', form);
      if (res.responseCode === '000') {
        const { onCallback } = this.props;
        isFunction(onCallback) && onCallback(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      NProgress.done();
    }
  }
  async fetchData(type = 'get') {
    NProgress.start();
    if (!isFunction(this.props.requset[type])) return;
    const params = {
      projectId: this.query.id || null,
    };
    const res = await this.props.requset[type](params);
    const requsetTypes = {
      get: () => {
        const getFormItem = this.getFieldsValue();
        const values = Object.keys(getFormItem);
        const setFormItem = {};
        values.forEach((key) => (setFormItem[key] = res[key] || getFormItem[key]));
        this.setFieldsValue(setFormItem);
        res.cityCode && (this.query.cityCode = res.cityCode);
      },
      set: () => {},
    };
    isFunction(requsetTypes[type]) && requsetTypes[type]();
    NProgress.done();
  }

  renderFormItemType(data) {
    const formItem = {
      textArea: () => this.renderTextArea(data),
      datePicker: () => this.renderDatePicker(data),
      cityInput: () => this.renderCityInput(data),
      map: () => this.renderEjuMap(data),
      select: () => this.renderSelect(data),
      input: () => this.renderInput(data),
      radio: () => this.renderRadio(data),
      uploadImg: () => this.renderUploadImg(data),
      selectCity: () => this.renderSelectCity(data),
    };
    return isFunction(formItem[data.type]) ? formItem[data.type]() : null;
  }

  renderMain = (data = {}, index) => {
    const chidrens = [];
    const renders = [];
    let { required, isItem, type, key, initialValue = '', disabled, render, span, title } = data;
    span = span || 24;
    type || (data.type = 'input');
    // 只显示标题
    if (type === 'title') {
      return (
        <Col span={24} key={index} className="eju-form-item-title">
          <Col span={12}>
            <Col className="node-title">{title}</Col>
          </Col>
        </Col>
      );
    }
    // 不显示
    else if (initialValue === 'form-item-none') return null;
    if (!disabled) {
      const children = [];
      if (render) {
        children.push(render(data, this));
      } else {
        children.push(this.renderFormItemType(data));
      }
      renders.push(children);
    } else {
      // 赋默认渲染项
      if (!render) render = () => <span key={index}>{initialValue}</span>;
      renders.push(render(data));
    }
    chidrens.push(...renders);
    return this.renderComponentForm({ key, title, isItem, required }, chidrens);
  };
  renderComponentForm = ({ key, title, isItem, required }, component) => {
    const classNames = classNameFun(`form-item_${key}`);
    const label = title.indexOf('_null') > -1 ? null : title;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: label
        ? {
            xs: { span: 24 },
            sm: { span: 16 },
          }
        : {
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 6 },
          },
    };
    if (isItem) {
      return component;
    }
    return (
      <Form.Item
        {...formItemLayout}
        label={required ? <span className="ant-form-item-required">{label}</span> : label}
        className={classNames}
        key={key}
      >
        {component}
      </Form.Item>
    );
  };
  render() {
    const wrapperCol = {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 6 },
    };
    const footer = (children, className = '') => (
      <Form.Item wrapperCol={wrapperCol} className={className}>
        {children}
      </Form.Item>
    );
    return (
      <div className="eju-form-container">
        <Form onSubmit={this.onSubmit}>
          {this.props.formData.map((item, index) => this.renderMain({ ...item }, index))}
          {footer(this.props.tip, 'eju-form-tip')}
          {footer(
            <React.Fragment key={Date.now()}>
              {isFunction(this.props.$handleEjuForm) ? (
                <Button className="back" onClick={() => this.props.$handleEjuForm()}>
                  返回
                </Button>
              ) : null}
              <Button type="primary" htmlType="submit">
                下一步
              </Button>
            </React.Fragment>
          )}
        </Form>
      </div>
    );
  }
}

export default ComponentView;
