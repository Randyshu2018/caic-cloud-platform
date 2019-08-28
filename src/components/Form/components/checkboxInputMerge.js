import React from 'react';
import { Checkbox, Input } from 'antd';

class CheckboxInputMerge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSelectOther: false,
      editData: props.data.editData,
      inputData: [],
    };
  }
  componentDidMount() {
    this.filterData();
  }
  filterData = () => {
    const { data } = this.props;
    const editData = [...data.editData];
    const editDataKeys = editData.map(({ value }) => value);
    let hasSelectOther = false;
    let inputData = [];
    // 多选且含有其它组项
    if (data.isInput) {
      const ruleMap = [];
      const outerMap = [];
      // 多选组件，统计其他选项
      (data.initialValue || []).forEach((v) => {
        // 存在已知定义的数据内为一类
        // 否则归类为其它组
        const index = editDataKeys.indexOf(v);
        if (index > -1) {
          ruleMap.push(editData[index]);
        } else {
          const value = v;
          value && outerMap.push(value);
        }
      });
      inputData = [editData.pop()];
      if (outerMap.length > 0) {
        const value = outerMap[0] || '';
        value && (hasSelectOther = true);
        this.defaultValue = value;
        inputData = [{ id: value, value }];
      }
    }
    this.setState({
      inputData,
      editData,
      hasSelectOther,
    });
  };
  computeData(value) {
    const { form, data } = this.props;
    const getKeyValue = form.getFieldsValue([data.key])[data.key] || [];
    const getKeyValueFilter = this.state.editData
      .filter(({ value }) => getKeyValue.indexOf(value) > -1)
      .map(({ value }) => value);
    const setKeyValue =
      value && getKeyValueFilter.indexOf(value) === -1
        ? [...getKeyValueFilter, value]
        : getKeyValueFilter;
    form.setFieldsValue({
      [data.key]: setKeyValue,
    });
  }
  handleCheckboxInput = (e) => {
    const value = e.target.value;
    this.computeData(value);
    if (!value) {
      const value = 'inputOther';
      this.setState({ inputData: [{ id: value, value }] });
    }
    this.defaultValue = value;
  };
  handleCheckbox = (e, values) => {
    const hasSelectOther = e.target.checked;
    const value = hasSelectOther ? values : '';
    this.computeData(value);
    this.setState({
      hasSelectOther,
      inputData: [{ id: this.defaultValue, value: this.defaultValue }],
    });
  };
  renderCheckboxInput = () => {
    const { value, id } = this.state.inputData[0] || {};
    const has = value === 'inputOther';
    const val = has ? '' : value;
    const hasSelectOther = this.state.hasSelectOther;
    return (
      <Checkbox
        onChange={(e) => this.handleCheckbox(e, val || '')}
        checked={hasSelectOther}
        value={value}
        key={'512'}
      >
        {hasSelectOther ? (
          <Input
            defaultValue={val || ''}
            key={id}
            style={{ width: 100 }}
            placeholder="其它"
            onChange={this.handleCheckboxInput}
          />
        ) : (
          `其它 ${val || ''}`
        )}
      </Checkbox>
    );
  };
  renderCheckbox = () => {
    const { form, data } = this.props;
    const { editData } = this.state;
    return form.getFieldDecorator(data.key, {
      initialValue: data.initialValue,
    })(
      <Checkbox.Group key={data.key}>
        {editData.map((item, index) => (
          <Checkbox key={index} value={item.value}>
            {item.value}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  };

  render() {
    return [this.renderCheckbox(), this.props.data.isInput ? this.renderCheckboxInput() : null];
  }
}

export default CheckboxInputMerge;
