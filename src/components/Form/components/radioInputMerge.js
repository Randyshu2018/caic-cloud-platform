import React from 'react';
import { Radio, Input } from 'antd';
import { isFunction } from 'src/modules/utils';
class radioInputMerge extends React.Component {
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

    // console.log('filterData:', data.initialValue);

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
  renderRadioInput = () => {
    const { value, id } = this.state.inputData;
    const has = value === 'inputOther';
    const val = has ? '' : value;
    const hasSelectOther = this.state.hasSelectOther;
    return (
      <Radio.Group
        key={'414'}
        onChange={(e) => this.handleRadio(e, val || '')}
        value={hasSelectOther ? value : 0}
      >
        <Radio value={value}>
          {hasSelectOther ? (
            <Input
              defaultValue={val || ''}
              key={id}
              style={{ width: 100 }}
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
  renderRadio = () => {
    const { form, data } = this.props;
    const { editData } = this.state;
    return form.getFieldDecorator(data.key, {
      initialValue: data.initialValue,
    })(
      <Radio.Group
        key={data.key}
        onChange={(_) => {
          this.setState({
            hasSelectOther: false,
          });
          isFunction(this.props.onChange) && this.props.onChange(_);
        }}
      >
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

  render() {
    return [this.renderRadio(), this.props.data.isInput ? this.renderRadioInput() : null];
  }
}

export default radioInputMerge;
