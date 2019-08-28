import React from 'react';
import './style.scss';
import ComponentEvent from 'src/hoc/componentEvent';
import ComponentItem from './components/item';
import { classNameFun, isFunction } from 'src/modules/utils';
import { Row, Col, Form } from 'antd';

@ComponentEvent(ComponentItem)
class ComponentView extends React.Component {
  renderFormItemType(data) {
    const formItem = {
      textArea: () => this.renderTextArea(data),
      datePicker: () => this.renderDatePicker(data),
      cityInput: () => this.renderCityInput(data),
      map: () => this.renderEjuMap(data),
      select: () => {
        data.width = '100%';
        return this.renderSelect(data);
      },
      input: () => this.renderInput(data),
      inputHidden: () => this.renderInputHidden(data),
      radio: () => this.renderRadio(data),
      _radio: () => this._renderRadio(data),
      uploadImg: () => this.renderUploadImg(data),
      upload: () => this.renderUpload(data),
      selectCity: () => this.renderSelectCity(data),
      radioInput: () => this.renderRadioInput(data),
      checkbox: () => this.renderCheckbox(data),
      editableTable: () => this.renderEditableTable(data),
      editableTable2: () => this.renderEditableTable2(data),
    };
    const { key, after = '', type } = data;
    if (this.props.isEdit) {
      const getVal = this.getFieldsValue();
      const val = getVal[key];
      const filter = () => (data.editData || []).find(({ id }) => id === val);
      const selectType = {
        radio: (filter() || {}).value,
        _radio: (filter() || {}).value,
        select: (filter() || {}).value,
      };
      const _val = selectType[type] || val;
      return (
        <React.Fragment>
          {
            <span>
              {_val || '--'}
              {`  ${_val && after}`}
            </span>
          }
          {formItem.inputHidden()}
        </React.Fragment>
      );
    }
    return isFunction(formItem[type]) ? formItem[type]() : null;
  }
  renderMain = (data = {}, index) => {
    const chidrens = [];
    const renders = [];
    let { isItem, type, key, initialValue = '', title, render, spanCol = 12 } = data;
    const span = data.span || 24;
    type || (data.type = 'input');

    // 只显示标题
    if (type === 'title') {
      return (
        <Col span={24} key={index} className="eju-form-item-title">
          <Col span={12}>
            {typeof title === 'function' ? title() : <Col className="node-title">{title}</Col>}
          </Col>
        </Col>
      );
    }
    // 不显示
    else if (initialValue === 'form-item-none') return null;
    // 扩展组件
    // 提供内部组件方法， 当前调用参数

    const nodeItem = render ? render(this, data) : this.renderFormItemType(data);
    nodeItem && renders.push(nodeItem);
    chidrens.push(...renders);
    return this.renderComponentForm({ key, title, span, isItem, spanCol }, chidrens);
  };
  renderComponentForm = ({ key, title, isItem, span, spanCol }, component) => {
    const classNames = classNameFun(`form-item_${key}`);
    const label = title.indexOf('_null') > -1 ? null : title;
    if (isItem) {
      return component;
    }
    // 提供外部对表单对布局方法
    const { labelCol = { span: 9 }, wrapperCol = { span: 15 } } = this.props;
    const renderFormItem = () => (
      <Col span={span} key={key}>
        <Form.Item
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          label={label}
          className={classNames}
          key={key}
        >
          {component}
        </Form.Item>
      </Col>
    );
    if (span === 24) {
      return (
        <Col span={24} key={key}>
          <Col span={spanCol} key={key}>
            {renderFormItem()}
          </Col>
        </Col>
      );
    }
    return renderFormItem();
  };
  render() {
    return <Row>{this.props.formData.map((item, index) => this.renderMain(item, index))}</Row>;
  }
}

export default ComponentView;
