import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Select, Input } from 'antd';
import './FormInput.scss';
const Option = Select.Option;
export default class CheckBoxSelect extends React.Component {
  state = {};

  static propTypes = {
    initValue: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    initValue: [],
  };
  onCheckBoxChange = (index, value) => {
    let olderState = this.state.initValue;
    olderState[index].selected = value;
    value === true ? (olderState[index].disabled = false) : (olderState[index].disabled = true);
    // if (value && olderState[index].name === '其它') {
    //   olderState.forEach((item, k) => {
    //     k !== index ? (item.selected = false) : '';
    //   });
    // }
    this.setState({ initValue: olderState }, () => {
      this.handlerPropsData(this.state.initValue);
    });
  };

  onSelectChange = (value, k) => {
    let olderState = this.state.initValue;
    olderState[k].value = value;
    this.setState({ initValue: olderState }, () => {
      this.handlerPropsData(this.state.initValue);
    });
  };

  onInputChange = (value, k) => {
    //   console.log('onInputChange',value.target.value);
    let olderState = this.state.initValue;
    olderState[k].value = value.target.value;
    this.setState({ initValue: olderState }, () => {
      this.handlerPropsData(this.state.initValue);
    });
  };

  handlerPropsData = () => {
    this.props.onChange(this.state.initValue);
  };

  componentWillMount = () => {
    this.setState({
      initValue: this.props.initValue,
    });
    // this.state.initValue = this.props.initValue;
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.initValue === this.state.initValue) {
      return false;
    }
    this.setState({
      initValue: nextProps.initValue,
    });
    // this.state.initValue = nextProps.initValue;
  };

  render() {
    const { initValue } = this.state;
    const { disabled } = this.props;
    let ohterCheck = false;
    initValue.forEach((item) => {
      if (item.name === '其它') {
        ohterCheck = item.selected;
      }
    });
    if (disabled) {
      ohterCheck = disabled;
    }
    return (
      <div className="form-input-container" style={{ marginTop: '20px' }}>
        {initValue &&
          initValue.map((item, k) => {
            return (
              <span key={k} style={{ marginRight: '20px' }}>
                <Checkbox
                  checked={item.selected}
                  onChange={() => this.onCheckBoxChange(k, !item.selected)}
                  disabled={disabled}
                  style={{ marginRight: '6px' }}
                />
                <span>{item.name}</span>
                {item.name !== '其它' ? (
                  <Select
                    defaultValue={item.value}
                    style={{ width: 120 }}
                    onChange={(value) => this.onSelectChange(value, k)}
                    placeholder={'请选择'}
                    disabled={item.selected === false ? true : false}
                  >
                    {item.options.map((item1, k1) => (
                      <Option value={item1} key={k1}>
                        {item1}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    placeholder=""
                    style={{ width: '100px' }}
                    defaultValue={item.value}
                    disabled={disabled ? disabled : !ohterCheck}
                    onChange={(value) => this.onInputChange(value, k)}
                  />
                )}
              </span>
            );
          })}
      </div>
    );
  }
}
