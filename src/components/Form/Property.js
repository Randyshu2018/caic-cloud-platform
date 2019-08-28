import NProgress from 'nprogress';
import React from 'react';
import * as Context from 'src/containers/Property/context';
import { isFunction } from 'src/modules/utils';
import { Button, Form, Icon, message } from 'antd';
import FormItem from './index';

@Context.Consumer
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

  handChangeEBLTDA = (_values) => {
    const values = { ..._values };
    const { notEBLTDA } = this.props;
    if (!notEBLTDA) return values;
    const ValueEBLTDA = values[`SELECT_EBITDA_FLAG`];
    const vArr = notEBLTDA[ValueEBLTDA];
    if (!Array.isArray(vArr)) return values;
    let condition = vArr.length - 1;
    while (condition >= 0) {
      const key = `${this.props.contextType}${vArr[condition]}`;
      if (values.hasOwnProperty(key)) {
        values[key] = '0';
      }
      condition -= 1;
    }
    return values;
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
      formValue = this.handChangeEBLTDA(formValue);
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
      params = {},
    } = this.props;
    if (!childer.length) return null;
    return (
      <div className="property eju-form-container">
        <Form onSubmit={this.onSubmit}>
          <div className="eju-flex eju-flex-between title eju-flex-a">
            <div>
              <div className="size22">项目名称：{params.projectName}</div>
              {params.period ? (
                <p style={{ marginTop: '20px', fontSize: '16px' }}>
                  <Icon type="calendar" style={{ fontSize: '18px', marginRight: '3px'}} />
                  {params.period}
                </p>
              ) : null}
            </div>
            <div className="handleSys">
              {this.state.isEdit ? (
                <Button className="btn-text">已上链</Button>
              ) : (
                <React.Fragment>
                  {this.props.children}
                  <Button className="theme-btn-1" htmlType="submit" icon="save">
                    保存
                  </Button>
                  {this.props.renderBtn && this.props.renderBtn()}
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="body">
            <FormItem isEdit={this.state.isEdit} formData={childer} {...this.props} />
          </div>
        </Form>
      </div>
    );
  }
}

// const FormComponent = Context.Consumer(ComponentView);
export default ComponentView;
