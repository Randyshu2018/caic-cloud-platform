import React from 'react';
import { Layout, Button, Row, Col, InputNumber, Form, message, Spin, Icon, Input } from 'antd';
import ComponentEvent from 'src/hoc/componentEvent';
import RenderItemComponent from './components/index.js';
import ComponentAuthor from './components/author';
import { localStorageDiagnose } from 'src/hoc/localStorage';
import './style.scss';

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

@Form.create()
@ComponentEvent(RenderItemComponent)
class EjuForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: true,
      data: {},
      requsetKey: {},
      loading: !!props.loading,
    };
    this.requset = {};
    this.styleItem = {
      ...props.styleItem,
    };
    this.formItem = {};
    this.current = Math.floor(props.match.params.step) || 1;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let isRender = true;
  //   if (nextState.loading === this.state.loading) isRender = false;
  //   return isRender
  // }

  async componentDidMount() {
    let data = Object.assign({}, this.props.data);
    if ('requset' in data) {
      this.requset = Object.assign(this.requset, data.requset);
      delete data.requset;
    }
    this.data = data;
    await this.dataList();
  }

  // 请求数据
  httpRequset = async (type, form = {}) => {
    const payload = this.requset;
    if (payload === undefined) {
      return false;
    }
    const { projectId, step } = this.props.match.params;
    const typeMap = {
      '1': 'BASIC',
      '2': 'ASSET',
      '3': 'OPERATE',
      '4': 'VALUE',
      '5': 'TRADE',
    };
    const params = {
      projectId,
      type: typeMap[step],
      ...form,
    };
    if (this.id) params.id = this.id;
    try {
      return payload[type] ? await payload[type](params) : [];
    } catch (error) {
      message.error(`${this.H1Title}--${error.msg}`);
    }
  };
  onPageSkip = (current) =>
    typeof this.props.onPageSkip === 'function' && this.props.onPageSkip(current);
  handlePrev = () => {
    this.onPageSkip(this.current - 1);
  };
  setDate = async (form) => {
    try {
      const res = await this.httpRequset('set', form);
      const { projectId, step } = this.props.match.params;
      if (res.responseCode === '000') {
        message.success('保存成功～');
        if (this.current === 4) {
          this.props.onSubmit();
          localStorageDiagnose('remove', { projectId, step });
        } else {
          this.onPageSkip(this.current + 1);
          localStorageDiagnose('set', { projectId, step });
        }
      }
    } catch (error) {
      console.error(error);
      alert(error.msg);
    }
  };
  // 格式化时间
  format = (date, type = 'time') => {
    const timeFormat = {
      day: 'YYYY-MM-DD HH:mm:ss',
      time: 'HH:mm',
      dayMileage: 'YYYY-MM-DD',
    };
    return date && date.format(timeFormat[type]);
  };
  // 表达提交
  onSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((_, values) => {
      const notDiagnose = this.state.notDiagnose;
      let verify = true;
      let formValue = {
        ...values,
        ...this.formItem,
      };
      for (const key in formValue) {
        if (!verify) break;
        const value = formValue[key];
        if (typeof value === 'object' && !Array.isArray(value)) {
          if ('format' in value) {
            formValue[key] = this.format(value, 'dayMileage');
          }
        } else if (!value && value !== 0) {
          verify = false;
          notDiagnose ||
            this.Comp(this.props.data, ([title, values = {}]) => {
              if (values.key === key) {
                message.info(`${title.replace(/_null/g, '')}不能为空`);
              }
            });
        }
      }
      // 是否诊断已定义，且为true时，直接保存
      if (typeof notDiagnose !== 'undefined') {
        formValue.notDiagnose = notDiagnose;
        if (notDiagnose) {
          return this.setDate(formValue);
        }
      }
      verify && this.setDate(formValue);
    });
  };

  Comp = (data = {}, render) => {
    return Object.entries(data).map(render);
  };

  lodash = (list, cbif) => {
    let d = {};
    list.forEach((item) => {
      if (cbif(item)) {
        d = { ...item };
      }
    });
    return d;
  };

  handleInputKeydown = (e, key, valueLength) => {
    const { value } = e.target;
    if (valueLength) {
      this.setState({
        [`${key}_length`]: value.toString().length,
      });
    }
  };

  debounce = (cb) => {
    clearTimeout(this.InputNumberonChangeTime);
    this.InputNumberonChangeTime = setTimeout(() => {
      cb();
    }, 100);
  };

  tierThree = ([title, data = {}], index) => {
    let isEdit = this.state.isEdit;
    const chidrens = [];
    const renders = [];
    let {
      type = '',
      disabledInput = false,
      key,
      nameTxt,
      initialValue,
      disabled,
      render,
      renderEdit,
      span,
      valueLength,
      after,
    } = data;
    // data.rules = [{ required: true, message: ' ' }];
    const classNames = [`form-item_${key}`, this.props.span || span ? '' : 'flex'].join(' ');
    span = this.props.span || span || 24;
    const labelCol = {
      // xs: { span },
      // sm: { span: 4 },
    };
    if (type === 'title') {
      return (
        <Col span={24} key={index} className="eju-form-item-title">
          <Col span={12}>
            <Col className="node-title">{title}</Col>
          </Col>
        </Col>
      );
    } else if (initialValue === 'form-item-none') {
      return null;
    }
    if (!render) {
      render = () => <span key={index}>{nameTxt}</span>;
    }
    if (isEdit) {
      const { getFieldDecorator } = this.props.form;
      if (!disabled) {
        if (!renderEdit) {
          let comp = ({ key }) => {
            if (type === 'InputNumber') {
              return (
                <InputNumber
                  key={key}
                  disabled={disabledInput}
                  onChange={(e) => this.InputNumberonChange(e, key)}
                  onKeyUp={(e) => this.handleInputKeydown(e, key, valueLength)}
                />
              );
            }
            return (
              <Input
                key={key}
                disabled={disabledInput}
                onKeyUp={(e) => this.handleInputKeydown(e, key, valueLength)}
                addonAfter={after}
              />
            );
          };
          renderEdit = comp;
        }
        if (initialValue === undefined) initialValue = nameTxt === '--' ? '' : nameTxt;

        switch (type) {
          case 'textArea':
            renders.push(this.renderTextArea({ ...data, initialValue }, index));
            break;
          case 'datePicker':
            renders.push(this.renderDatePicker(data, index));
            break;
          case 'uploadImg':
            data.title = title.replace(/_null/g, '');
            renders.push(this.renderUploadImg(data, index));
            break;
          case 'checkbox':
            renders.push(this.renderCheckbox(data, index));
            break;
          case 'radio':
            renders.push(this.renderRadio(data, index));
            break;
          case 'select':
            renders.push(this.renderSelect(data, index));
            break;
          case 'site':
            renders.push(this.renderSite(data, index));
            break;
          case 'editableTable':
            renders.push(this.renderEditableTable(data, index));
            break;
          case 'checkBoxSelect':
            renders.push(this.renderCheckBoxSelect(data, index));
            break;
          default:
            let option = {};
            if (initialValue !== undefined) {
              option = {
                initialValue,
              };
            }
            option.rules = data.rules;
            renders.push(getFieldDecorator(key, option)(renderEdit(data, index, this)));
            renders.push(
              <i key={`${key}_i`} className="form_item_i_l">
                {this.state[`${key}_length`]}
              </i>
            );
            break;
        }
      } else {
        renders.push(render(data));
      }
    } else {
      renders.push(render(data, this));
    }
    chidrens.push(...renders);
    return this.renderComponentForm({ title, span, index, classNames, labelCol }, chidrens);
  };
  renderComponentForm = ({ title, span, index, classNames, labelCol }, component) => {
    let label;
    if (title.indexOf('_null') > -1) {
      label = null;
    } else {
      label = title;
    }
    const renderFormItem = (labelCol = {}) => (
      <Col
        className="formFlex"
        span={span}
        key={index}
        style={this.state.isEdit ? this.styleItem : {}}
      >
        <Form.Item
          labelCol={labelCol}
          label={
            title.indexOf('_null') > -1 ? null : (
              <span
                style={{ width: label.length > 17 ? '250px' : '190px', display: 'inline-block' }}
              >
                {label}
              </span>
            )
          }
          className={classNames}
        >
          {component}
        </Form.Item>
      </Col>
    );
    if (span === 24) {
      const labelCol = {
        // xs: { span: 24 },
        // sm: { span: 4 },
      };
      return (
        <Col span={24} key={index}>
          {renderFormItem(labelCol)}
        </Col>
      );
    }
    return renderFormItem(labelCol);
  };
  handleAuthorChange = (notDiagnose) => {
    this.setState({ notDiagnose });
  };
  // 数据解析
  dataList = async () => {
    this.setState({
      loading: true,
    });
    try {
      if (this.requset.key) {
        const asyncData = await this.httpRequset('get');
        const getData = { ...asyncData };
        const setData = {};
        const setNot = {};

        this.id = getData.id || null;
        // 非基础信息表单时，可以通过设置保存的 notDiagnose 判断可不编辑保存
        if (this.current !== 1) {
          const key = 'notDiagnose';
          setNot[key] = getData[key];
        }
        const datas = { ...this.data };
        if (getData.diagnoseType === 'ASSET' && !getData.showBizDict) {
          const key = '经营信息';
          delete datas[key];
        }
        Object.entries(datas).forEach(([title, values]) => {
          let item = { ...values };
          if (item.type && item.type === 'editableTable') {
            item.dataSource = Object.assign([], getData[item.key]);
          } else {
            item.nameTxt = getData[item.key];
            item.initialValue = item.initialValue || void 0;
            if (
              getData.hasOwnProperty(item.key) &&
              typeof getData[item.key] === 'object' &&
              getData[item.key].editData
            ) {
              item.editData = item.nameTxt.editData;
              delete item.nameTxt;
            }
            const nameTxt = item.nameTxt;
            if (nameTxt || nameTxt === 0) item.initialValue = getData[item.key];
          }
          setData[title] = item;
        });
        this.setState({
          data: setData,
          ...setNot,
        });
      }
    } catch (error) {
      console.error(error);
      message.error(error.msg);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  cancel = (e) => {
    this.dataList();
  };

  render() {
    const { title } = this.props;
    const titleNode = this.props.title.split(',');
    let notDiagnose = this.state.notDiagnose;
    notDiagnose = typeof notDiagnose === 'undefined' ? false : notDiagnose;

    // title 表单模块
    // isEditShow 是否能编辑
    const node = {
      title: titleNode[0],
      isEditShow: titleNode[1],
      record: titleNode[2],
    };
    this.H1Title = node.title;
    return (
      <Spin indicator={antIcon} spinning={this.state.loading} wrapperClassName="at-spin">
        <Layout className="eju">
          <ComponentAuthor
            current={this.current}
            title={title}
            notDiagnose={this.state.notDiagnose}
            onChange={this.handleAuthorChange}
          />
          <Form onSubmit={this.onSubmit} key={this.props.index}>
            <Row>
              {notDiagnose ? <span className="eju-modal" /> : null}
              <Col span="24">
                {this.Comp(this.state.data, (item, index) => this.tierThree(item, index))}
              </Col>
            </Row>
            <Row>
              <div className="eju-button">
                <span>
                  {this.current !== 1 ? (
                    <Button className="at-spanl" onClick={this.handlePrev}>
                      上一步
                    </Button>
                  ) : null}
                </span>
                <Button type="primary" htmlType="submit">
                  {this.current === 4 ? '提交' : '保存并下一步'}
                </Button>
              </div>
            </Row>
          </Form>
        </Layout>
      </Spin>
    );
  }
}

export default EjuForm;
