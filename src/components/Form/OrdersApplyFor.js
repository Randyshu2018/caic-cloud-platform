import NProgress from 'nprogress';
import React from 'react';
import { isFunction } from 'src/modules/utils';
import { Button, Form, message } from 'antd';
import FormItem from './index';

@Form.create()
class ComponentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }
  componentDidMount() {
    const { onFormRefsCallBack, form } = this.props;
    isFunction(onFormRefsCallBack) && onFormRefsCallBack(form);
    this.fetchData();
  }

  messageValidateFields = (formData, formValue) => {
    let verify = true;
    const { notEBLTDA: { notValidate = [] } = { notValidate: [] } } = this.props;
    for (const _key in formValue) {
      if (!verify) break;
      const value = formValue[_key];
      if (!value && value !== 0 && notValidate.indexOf(_key) === -1) {
        verify = false;
        formData.find(({ title, key, formKey = {}, tip }) => {
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
    return verify;
  };

  // 提交
  onSubmit = (e, fetchUp2Chain) => {
    e && e.preventDefault();
    isFunction(fetchUp2Chain) && (this.fetchUp2Chain = fetchUp2Chain);
    const formData = this.props.data.childer;
    this.props.form.validateFields((_, values) => {
      let formValue = {
        ...values,
      };
      const verify = this.messageValidateFields(formData, formValue);
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
    const params = {
      ...form,
    };
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
        message.success('保存成功');
        isFunction(this.fetchUp2Chain) && this.fetchUp2Chain(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      NProgress.done();
    }
  }
  async fetchData(type = 'get') {
    NProgress.start();
    if (!isFunction(this.props.requset[type])) return NProgress.done();
    const params = {};
    const res = (await this.props.requset[type](params)) || {};
    console.log('form fetchData:', res);

    this.setState({
      isEdit: res.chainStatus && res.chainStatus === '2',
    });

    const requsetTypes = {
      get: () => {
        const getFormItem = this.props.form.getFieldsValue();
        const values = Object.keys(getFormItem);
        const setFormItem = {};
        values.forEach((key) => (setFormItem[key] = res[key] || getFormItem[key]));
        this.props.form.setFieldsValue(setFormItem);
      },
      set: () => {},
    };
    isFunction(requsetTypes[type]) && requsetTypes[type]();
    NProgress.done();
  }

  render() {
    const {
      data: { childer = [] },
    } = this.props;
    const wrapperCol = {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 3 },
    };
    const footer = (children, className = '') => (
      <Form.Item wrapperCol={wrapperCol} className={className}>
        {children}
      </Form.Item>
    );
    if (!childer.length) return null;
    return (
      <div className="eju-form-container">
        <Form onSubmit={this.onSubmit}>
          <div className="body">
            <FormItem
              isEdit={this.state.isEdit}
              formData={childer}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              {...this.props}
            />
          </div>
          {footer(
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          )}
        </Form>
      </div>
    );
  }
}

export default ComponentView;
