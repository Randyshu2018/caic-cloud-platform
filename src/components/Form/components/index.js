/* eslint-disable no-mixed-operators */
import React from 'react';
import AsyncComponent from 'src/hoc/asyncComponent';
import { Input } from 'antd';
// import ComponentCheckBoxSelect from 'src/components/FormInput/CheckBoxSelect';
// import ComponentSelectCityArea from 'src/components/FormInput/SelectCityArea';

const ComponentRadioInputMerge = AsyncComponent((_) => import('./radioInputMerge.js'));
const ComponentSelectInputMerge = AsyncComponent((_) => import('./selectInputMerge.js'));
const ComponentCheckboxInputMerge = AsyncComponent((_) => import('./checkboxInputMerge.js'));
const ComponentDatePicker = AsyncComponent((_) => import('./datePicker1.js'));
const ComponentEditableTable = AsyncComponent((_) => import('./editableTable.js'));
const ComponentUploadImg = AsyncComponent((_) => import('./upload.js'));
const ComponentSelectCityArea = AsyncComponent((_) =>
  import('src/components/FormInput/SelectCityArea')
);
const ComponentCheckBoxSelect = AsyncComponent((_) =>
  import('src/components/FormInput/CheckBoxSelect')
);

export default class RenderItemComponent {
  renderCheckbox = (data, index) => (
    <ComponentCheckboxInputMerge form={this.props.form} data={{ ...data, index }} key={index} />
  );
  renderRadio = (data, index) => (
    <ComponentRadioInputMerge form={this.props.form} data={{ ...data, index }} key={index} />
  );
  renderDatePicker = (data, index) => (
    <ComponentDatePicker
      form={this.props.form}
      data={{ ...data, index }}
      key={index}
      datePickerCallback={(value) => this.handleDatePickerCallback({ key: data.key, value })}
    />
  );
  renderUploadImg = (data, index) => [
    <ComponentUploadImg
      UploadCallback={this.handleUploadCallback}
      form={this.props.form}
      data={{ ...data, index }}
      key={index}
    />,
    this.renderInputHidden(data),
  ];
  renderInputHidden = ({ key, initialValue }) => {
    return this.props.form.getFieldDecorator(key, {
      initialValue,
    })(<Input type="hidden" key={`hidden_${key}`} />);
  };
  renderEditableTable = (data, index) => {
    const { key, columns = [], dataSource = [] } = data;
    const dataS = [];
    dataSource.forEach((item, index) => {
      const data = { ...item };
      data.key = index;
      dataS.push(data);
    });
    const requset = {
      get: '',
      set: '',
      updated: this.dataList,
    };
    return [
      <ComponentEditableTable
        tableCallback={(source) => this.handleTableCallback({ key, source })}
        data={{ ...data, index }}
        key={key}
        requset={requset}
        dataSource={dataS}
        columns={columns}
      />,
      this.renderInputHidden({ key, initialValue: dataSource }),
    ];
  };

  renderSelect = (data, index) => (
    <ComponentSelectInputMerge form={this.props.form} data={{ ...data, index }} key={index} />
  );

  renderCheckBoxSelect = (data, index) => {
    const { editData, key, initialValue = {} } = data;
    // let formValue = this.props.form.getFieldsValue([key])[key];
    // formValue = formValue ? formValue : initialValue;
    this.formItem[key] = initialValue;
    const initValue = [];
    Object.entries(editData).forEach(([key, value]) => {
      const item = Object.assign({}, { ...value, selected: false });
      if (initialValue[key]) {
        item.value = initialValue[key];
        item.selected = true;
      }
      initValue.push(item);
    });
    return [
      <span key={index} style={{ marginTop: '-20px', display: 'block' }}>
        <ComponentCheckBoxSelect
          onChange={(select) => this.handleCheckBoxSelectChange(select, key, editData)}
          initValue={initValue}
          disabled={false}
        />
      </span>,
      // this.renderInputHidden(data),
    ];
  };

  renderTextArea = ({ key, rules, initialValue }) => {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator(key, {
      initialValue,
      rules,
    })(<Input.TextArea key={key} rows={4} />);
  };
  renderSite = (data) => {
    const { key, initialValue } = data;
    return [
      <ComponentSelectCityArea
        key={key}
        initAreaValue={Array.isArray(initialValue) ? initialValue : []}
        onChange={(values) => this.handleSelectCityAreaChange(key, values)}
      />,
      this.renderInputHidden(data),
    ];
  };
  setFieldsValue = (key, values) => {
    this.props.form.setFieldsValue({ [key]: values });
  };
  handleUploadCallback = ({ key, imageUrl }) => {
    this.setFieldsValue(key, imageUrl);
  };
  handleTableCallback = ({ key, source }) => {
    this.setFieldsValue(key, source);
  };
  handleTableCallback = ({ key, source }) => {
    this.setFieldsValue(key, source);
  };
  handleCheckBoxSelectChange = (select, key, editData) => {
    const newSelect = {};
    this.Comp(editData, ([key, values]) => {
      const node = select.filter(({ name }) => name === values.name);
      if (node.length > 0) {
        const item = node[0];
        const value = item.selected ? item.value : null;
        newSelect[key] = value;
      }
    });
    this.formItem[key] = newSelect;
    // this.setFieldsValue(key, newSelect);
  };
  handleSelectCityAreaChange = (key, values) => {
    // console.log(key, values);
    this.setFieldsValue(key, values);
  };
  handleDatePickerCallback = ({ key, value }) => {
    this.props.form.setFieldsValue({ key: value });
  };
}
