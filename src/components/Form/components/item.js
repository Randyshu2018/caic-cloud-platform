import React from 'react';
import AsyncComponent from 'src/hoc/asyncComponent';
import { InputNumber, Input, Form, Button, Radio } from 'antd';
import { isFunction, classNameFun } from 'src/modules/utils';

const ComponentEjuMap = AsyncComponent(() => import('src/components/Map'));
const ComponentSelectInputMerge = AsyncComponent(() => import('./selectInputMerge.js'));
const ComponentRadioInputMerge = AsyncComponent(() => import('./radioInputMerge.js'));
const ComponentUploadImg = AsyncComponent(() => import('./upload/upload.js'));
const ComponentUpload = AsyncComponent(() => import('./upload/uploadV2.js'));
const ComponentSelectCity = AsyncComponent(() => import('./selectCity.js'));
const ComponentCheckboxInputMerge = AsyncComponent(() => import('./checkboxInputMerge.js'));
const ComponentDatePicker = AsyncComponent(() => import('./datePicker.js'));
const ComponentEditableTable = AsyncComponent(() => import('./editableTable.js'));
const ComponentEditableTable2 = AsyncComponent(() => import('./editableTable2/index'));
const ComponentEditableTable3 = AsyncComponent(() => import('./editableTable2/rentSelect'));

export default class Event {
  renderEditableTable2 = (data) => {
    const { key, columns = [], dataSource = [] } = data;
    const initialValue = this.getFieldsValue()[key] || dataSource;
    return [
      <ComponentEditableTable3
        tableCallback={(source) => this.handleTableCallback({ key, source })}
        data={{ ...data }}
        key={key}
        dataSource={initialValue}
        columns={columns}
      />,
      this.renderInputHidden({ key, initialValue }),
    ];
  };

  renderEditableTable3 = (data) => {
    const { key, columns = [], dataSource = [] } = data;
    const dataS = [];
    const initialValue = this.getFieldsValue()[key] || dataSource;
    initialValue.forEach((item, index) => {
      const data = { ...item };
      data.key = index;
      dataS.push(data);
    });
    console.log('renderEditableTable2:', dataS);

    const requset = {
      get: '',
      set: '',
      updated: this.dataList,
    };

    return [
      <ComponentEditableTable2
        tableCallback={(source) => this.handleTableCallback({ key, source })}
        data={{ ...data }}
        key={key}
        requset={requset}
        dataSource={dataS}
        columns={columns}
      />,
      this.renderInputHidden({ key, initialValue }),
    ];
  };
  renderEditableTable = (data) => {
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
        data={{ ...data }}
        key={key}
        requset={requset}
        dataSource={dataS}
        columns={columns}
      />,
      this.renderInputHidden({ key, initialValue: dataSource }),
    ];
  };
  handleTableCallback = ({ key, source }) => {
    this.setFieldsValue({ [key]: source });
  };
  handleDatePickerCallback = ({ key, value }) => {
    // console.log(key, value);
    this.setFieldsValue({ [key]: value });
  };
  renderDatePicker = (data) => {
    const { key } = data;
    const initialValue = this.getFieldsValue()[key] || data.initialValue;
    return (
      <React.Fragment>
        <ComponentDatePicker
          datePickerCallback={(value) => this.handleDatePickerCallback({ key, value })}
          key={key}
          data={Object.assign({}, data, { initialValue })}
        />
        {this.renderInputHidden({ key, initialValue })}
      </React.Fragment>
    );
  };
  renderCheckbox = (data) => (
    <ComponentCheckboxInputMerge key={data.key} form={this.props.form} data={{ ...data }} />
  );
  handleSelectCity = (res, key, selectedCityOptions) => {
    const [province, cityCode, areaCode] = res;
    areaCode && this.setFieldsValue({ [key]: areaCode });
    this.setFieldsValue({ selectedCityOptions });
    this.query = this.query || {};
    cityCode && (this.query.cityCode = cityCode);
  };
  renderSelectCity = (data) => {
    const value = this.getFieldsValue()[data.key];
    return [
      <ComponentSelectCity
        onChange={this.handleSelectCity}
        value={value}
        data={data}
        key={data.key}
      />,
      this.renderInputHidden(data),
      this.renderInputHidden({ key: 'selectedCityOptions' }),
    ];
  };
  handleMapChange = (res, data) => {
    const formData = {
      [data.key]: `${res.point.lng},${res.point.lat}`,
    };
    const types = {
      1: (key) => {
        formData[key] = res.address;
      },
      2: (key) => {
        const { city = '', province = '', district = '' } = res.addressComponents || res;
        formData[key] = `${city}/${province}/${district}`;
      },
    };
    Object.entries(data.formKey).forEach(
      ([key, value]) => isFunction(types[key]) && types[key](value)
    );
    this.setState(
      {
        isClickSearch: false,
      },
      () => this.setFieldsValue(formData)
    );
  };
  handleMapSearchResult = () => {
    this.setState({
      isClickSearch: false,
    });
  };
  getFieldsValue = () => this.props.form.getFieldsValue();
  setFieldsValue = (formData) => {
    this.props.form.setFieldsValue({ ...formData });
  };
  renderInputHidden = ({ key, initialValue = '' }) => {
    return this.props.form.getFieldDecorator(key, {
      initialValue,
    })(<Input type="hidden" key={`hidden_${key}`} />);
  };
  handleSearchMapClick = (rKey, formData = []) => {
    const rValue = this.getFieldsValue()[rKey];
    const newFormData = {};
    formData.forEach((lkey) => (newFormData[lkey] = rValue));
    this.setState(
      {
        isSearchView: true,
        isClickSearch: true,
      },
      () => this.setFieldsValue(newFormData)
    );
  };
  renderEjuMap = (data) => {
    const key = data.key;
    const values = this.getFieldsValue();
    console.log('renderEjuMap:', values);

    return [
      <div className="form-item-map" key={data.key}>
        <ComponentEjuMap
          isSearchView={this.state.isSearchView}
          onSearchResult={this.handleMapSearchResult}
          onChange={(res) => this.handleMapChange(res, data)}
          isSearchResult={this.state.isClickSearch}
          value={values[key]}
          selectedCityOptions={values['selectedCityOptions']}
          searchValue={values['address']}
        />
      </div>,
      this.renderInputHidden(data),
    ];
  };
  renderInput = (data, isEBLTDA) => {
    if (isFunction(data.renderEdit)) return data.renderEdit(data);
    const renderEdit = () => {
      if (isEBLTDA) return <span key={data.key}>--</span>;
      return data.InputType === 'InputNumber' ? (
        <InputNumber key={data.key} disabled={data.disabled} />
      ) : (
        <Input
          placeholder={data.placeholder}
          key={data.key}
          disabled={data.disabled}
          addonAfter={data.after}
        />
      );
    };
    let option = {
      rules: data.rules || [{ required: true, message: ' ' }],
    };
    if (data.initialValue !== undefined) {
      option = {
        ...option,
        initialValue: data.initialValue,
      };
    }
    return this.props.form.getFieldDecorator(data.key, option)(renderEdit(data));
  };
  renderCityInput = ({ key, rules, disabled, initialValue, formKey }) => {
    const afterChildren = (
      <Button className="marg-l" onClick={() => this.handleSearchMapClick(key, formKey)}>
        搜索地图
      </Button>
    );
    return (
      <div className="eju-flex-row" key={key}>
        {this.props.form.getFieldDecorator(key, { initialValue, rules })(
          <Input
            disabled={disabled}
            onChange={() => {
              this.setState({ isClickSearch: false });
            }}
          />
        )}
        {afterChildren}
      </div>
    );
  };
  renderTextArea = ({ key, rules, initialValue }) => {
    const { getFieldDecorator } = this.props.form;
    return getFieldDecorator(key, {
      initialValue,
      rules,
    })(<Input.TextArea key={key} rows={4} />);
  };
  renderSelect = (data) => (
    <div style={{ width: data.width || '428px' }} key={data.key}>
      <ComponentSelectInputMerge form={this.props.form} data={data} />
    </div>
  );
  renderRadioInput = (data) => {
    const isEBLTDA = this.getFieldsValue()[`SELECT_EBITDA_FLAG`];
    return this.renderInput(data, !(data.isEBLTDA === isEBLTDA));
  };
  renderRadio = (data) => (
    <ComponentRadioInputMerge
      form={this.props.form}
      data={data}
      key={data.key}
      onChange={(e) => {
        const { onChange } = this.props;
        isFunction(onChange) && onChange(e, data, this.props.form);
      }}
    />
  );
  _renderRadio = (data) => {
    const { form } = this.props;
    const { editData } = data;
    return form.getFieldDecorator(data.key, {
      initialValue: data.initialValue,
    })(
      <Radio.Group key={data.key} onChange={this.handChangeEBLTDA}>
        {editData.map((item, index) => {
          const val = item.id;
          const children = (
            <Radio key={index} value={val}>
              {item.value}
            </Radio>
          );
          return children;
        })}
      </Radio.Group>
    );
  };
  handChangeEBLTDA = (e) => {
    const { onChange, notEBLTDA = {} } = this.props;
    const vArr = notEBLTDA[e.target.value];
    if (Array.isArray(vArr)) {
      const formItem = {};
      let condition = vArr.length - 1;
      while (condition >= 0) {
        const key = `${this.props.contextType}${vArr[condition]}`;
        formItem[key] = '';
        condition -= 1;
      }
      this.setFieldsValue(formItem);
    }
    isFunction(onChange) && onChange(e);
  };
  handleUploadCallback = ({ key, imageUrl }) => {
    this.setFieldsValue({ [key]: imageUrl });
  };
  renderUpload = (data) => {
    const { key, label, uploadConfig = {} } = data;
    const initialValue = this.getFieldsValue()[key];
    const dataConfig = Object.assign({}, data, { initialValue, ...uploadConfig });
    delete dataConfig.uploadConfig;
    return (
      <span key={key}>
        <ComponentUpload
          UploadCallback={this.handleUploadCallback}
          form={this.props.form}
          data={dataConfig}
          keys={key}
          label={label}
          initialValue={initialValue}
        />
        {this.renderInputHidden({ key })}
      </span>
    );
  };
  renderComponentUploadImg = (data, label, key) => {
    return (
      <span key={key}>
        <ComponentUploadImg
          UploadCallback={this.handleUploadCallback}
          form={this.props.form}
          data={data}
          keys={key}
          label={label}
        />
        {this.renderInputHidden({ key })}
      </span>
    );
  };
  /**
   *  src/containers/CreateProject/index
   **/
  renderUploadImg = (data) => {
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
    const formData = { ...data };
    const children = Object.entries(formData.formKey || {}).map(([key, label]) => {
      return (
        <Form.Item {...formItemLayout} label={''} key={key}>
          {this.renderComponentUploadImg(Object.assign(formData, { key, title: '' }), label, key)}
        </Form.Item>
      );
    });
    const className = classNameFun('eju-flex-row', {
      styleimg1: children.length === 1,
      styleimg2: children.length === 2,
    });
    return (
      <div key={data.key} className={className}>
        {children.length === 2 ? (
          <span className="ant-form-item-label ant-col-xs-24 ant-col-sm-6">
            <label className="ant-form-item-required">{data.title}</label>
          </span>
        ) : null}
        {children}
      </div>
    );
  };
}
