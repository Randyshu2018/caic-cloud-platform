import NProgress from 'nprogress';
import React from 'react';
import { isFunction } from 'src/modules/utils';
import { Button, Form, Icon, message } from 'antd';
import FormItem from './index';
import { events } from 'func';

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

  // 格式化时间
  format = (date, type = 'time') => {
    const timeFormat = {
      day: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm',
      dayMileage: 'YYYY-MM-DD',
    };
    return date && date.format(timeFormat[type]);
  };

  messageValidateFields = (formData, formValue) => {
    console.log(formValue);
    let verify = true;

    for (const _key in formValue) {
      if (!verify) break;
      const value = formValue[_key];
      console.log(formValue[_key]);
      console.log(value);
      console.log(_key);
      if (!value && value !== 0) {
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

  // 转换成时间戳对比
  timeToTimestamp = (timedata) => {
    const date = new Date(timedata);
    let timestamp = null;
    console.log(timestamp);
    return (timestamp = date.getTime());
  };
  // 提交
  onSubmit = (e) => {
    e && e.preventDefault();
    this.props.form.validateFields((_, values) => {
      console.log('values');
      console.log(values);
      let formValue = {
        ...values,
      };
      console.log(formValue);

      const formData = this.props.data.childer;
      const times = ['signingDate', 'endSignDate', 'beginSignDate'];
      times.forEach((t) => {
        formValue.hasOwnProperty(t) && (formValue[t] = this.format(formValue[t], 'dayMileage'));
      });
      console.log(times);
      console.log(formValue);
      // formValue.contractRooms = formValue.contractRooms.reduce((previousValue, _v) => {
      //   const v = {};
      //   const keys = ['floorName', 'roomName', 'buildingName'];
      //   const ids = ['floorId', 'roomId', 'buildingId'];
      //   if (typeof _v === 'object' && !Array.isArray(_v)) {
      //     console.log(_v)
      //     for (let k in _v) {
      //       const index = keys.indexOf(k);
      //       if (index > -1) {
      //         v[ids[index]] = _v[k];
      //       }
      //     }
      //     previousValue.push(v);
      //   }
      //   return previousValue;
      // }, []);

      let verify = true;
      if (Array.isArray(formValue.contractRooms) && formValue.contractRooms.length === 0) {
        verify = false;
        message.info('请先完整填写房源信息');
      } else if (
        this.timeToTimestamp(formValue.beginSignDate) >= this.timeToTimestamp(formValue.endSignDate)
      ) {
        verify = false;
        message.info('合同记租时间应小于合同结束时间');
      } else {
        //不判断是否有合同附件
        let newFormValue = formValue;
        delete newFormValue.attachFilesUrl;
        verify = this.messageValidateFields(formData, newFormValue);
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
      console.log('submit data:', form);
      // form.contractRooms = form.contractRooms.reduce((o, value) => {
      //   var isAdd = o.find(
      //     (item) => value.floorId === item.floorId && value.roomId === item.roomId
      //   );
      //   isAdd || o.push(value);
      //   return o;
      // }, []);

      const res = await this.httpRequset('set', form);
      events.emit('openFeeTerms');

      if (res) {
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
      noNewPro,
    } = this.props;
    if (!childer.length) return null;
    return (
      <div className="eju-form-container">
        <Form onSubmit={this.onSubmit}>
          <div className="body">
            {/**
            isEdit: 表单是否可编辑
           */}
            <FormItem isEdit={this.state.isEdit} formData={childer} {...this.props} />
          </div>
          {noNewPro && (
            <div className="eju-flex title eju-flex-a">
              <React.Fragment>
                <Button
                  onClick={this.props.onClose}
                  style={{
                    width: '90px',
                    height: '34px',
                    margin: '0 20px 0 30px',
                    background: '#C1C7DE',
                  }}
                >
                  取消
                </Button>
                <Button
                  htmlType="submit"
                  style={{ width: '90px', height: '34px', background: '#3B5EFE' }}
                >
                  下一步
                </Button>
              </React.Fragment>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

// const FormComponent = Context.Consumer(ComponentView);
export default ComponentView;
