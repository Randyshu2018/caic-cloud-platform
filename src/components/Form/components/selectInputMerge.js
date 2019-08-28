import React from 'react';
import { Select, Radio, Input } from 'antd';

class SelectInputMerge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSelectOther: false,
      editData: [],
      inputData: {},
    };
  }
  componentDidMount() {
    this.filterData();
  }
  filterData = () => {
    const { data } = this.props;
    const editData = [...data.editData];
    const hasFilter = editData.filter((v) => v.value === data.initialValue);
    let hasSelectOther = false;
    let inputData = {};
    if (data.isInput) {
      inputData = editData.pop();
      if (hasFilter.length === 0) {
        const value = data.initialValue || '';
        value && (hasSelectOther = true);
        inputData = { id: value, value };
      }
    }
    this.setState({
      inputData,
      editData,
      hasSelectOther,
    });
  };
  handleRadioInput = (e) => {
    const { form, data } = this.props;
    const value = e.target.value;
    form.setFieldsValue({
      [data.key]: value,
    });
    if (!value) {
      const value = 'inputOther';
      this.setState({ inputData: { id: value, value } });
    }
  };
  handleRadio = (e, value) => {
    e.preventDefault();
    const { form, data } = this.props;
    form.setFieldsValue({ [data.key]: value });
    this.setState({
      hasSelectOther: true,
    });
  };
  renderSelectInput = () => {
    const { value, id } = this.state.inputData;
    const has = value === 'inputOther';
    const val = has ? '' : value;
    const hasSelectOther = this.state.hasSelectOther;
    return (
      <Radio.Group
        key={'614'}
        onChange={(e) => this.handleRadio(e, val || '')}
        value={hasSelectOther ? value : '0'}
        style={{ marginLeft: '15px' }}
      >
        <Radio value={value}>
          {hasSelectOther ? (
            <Input
              defaultValue={val || ''}
              key={id}
              style={{ width: this.props.data.inputWidth || 230 }}
              placeholder="其它"
              onChange={this.handleRadioInput}
            />
          ) : (
            `其它 ${val}`
          )}
        </Radio>
      </Radio.Group>
    );
  };
  renderSelect = () => {
    const { form, data } = this.props;
    const { key, initialValue, rules } = data;
    return form.getFieldDecorator(key, { initialValue, rules })(
      <Select
        key={key}
        className="default-width"
        style={{ width: this.props.data.isInput ? '300px' : '100%' }}
        onChange={(_) => {
          this.setState({
            hasSelectOther: false,
          });
        }}
      >
        {this.state.editData.map((item, index) => (
          <Select.Option value={item.id} key={index}>
            {item.value}
          </Select.Option>
        ))}
      </Select>
    );
  };

  render() {
    return [this.renderSelect(), this.props.data.isInput ? this.renderSelectInput() : null];
  }
}

export default SelectInputMerge;
