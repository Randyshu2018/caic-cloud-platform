import NProgress from 'nprogress';
import React from 'react';
import { isFunction } from 'src/modules/utils';
import { Button, Form, Icon, message } from 'antd';
import FormItem from './index';

// 使用 react Context方法传值
// import * as Context from 'src/containers/Property/context';
// @Context.Consumer

@Form.create()
class ComponentView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      isSearchView: false,
    };
  }
  componentDidMount() {
    const { onFormRefsCallBack, form } = this.props;
    isFunction(onFormRefsCallBack) && onFormRefsCallBack(form);
    this.fetchData();
  }

  // 提交
  onSubmit = (e) => {
    e && e.preventDefault();
    const formData = this.props.data.childer;
    this.props.form.validateFields((_, values) => {
      let formValue = {
        ...values,
      };
      this.setDate(formValue);
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
      data: { key, childer = [] },
    } = this.props;
    if (!childer.length) return null;
    return (
      <div className="eju-form-container">
        <Form onSubmit={this.onSubmit}>
          <div className="eju-flex eju-flex-between title eju-flex-a">
            {/* <div>
              <div className="size22">项目名称：{key}</div>
              <Icon type="calendar" style={{ fontSize: '18px', marginRight: '3px' }} /> 2019-7-2
            </div> */}
            <Button htmlType="submit" icon="save">
              提交
            </Button>
          </div>
          <div className="body">
            {/**
              isEdit: 表单是否可编辑
             */}
            <FormItem isEdit={this.state.isEdit} formData={childer} {...this.props} />
          </div>
        </Form>
      </div>
    );
  }
}

// const FormComponent = Context.Consumer(ComponentView);
export default ComponentView;
