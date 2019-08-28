import React from 'react';
import { Cascader, Input } from 'antd';
import CreateProjectServices from 'src/services/createProject';
import { isFunction } from 'src/modules/utils';

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
      defaultValue: [],
      isInput: true,
      selectedOptions: [],
    };
  }
  componentWillReceiveProps({ value }) {
    value !== this.props.value && this.fetchDefaultValue(value);
  }
  componentDidMount() {
    this.fetchData();
  }
  dataFilter(list, isLeaf = false) {
    list = Array.isArray(list) ? list : [];
    return list.map((item) => {
      const i = { ...item };
      i.isLeaf = isLeaf;
      i.value = i.code;
      i.label = i.name;
      delete i.code;
      delete i.name;
      return i;
    });
  }
  async fetchDefaultValue(areaCode) {
    if (!areaCode) return;
    let defaultValue = await CreateProjectServices.fetchQueryCityArea({ areaCode });
    defaultValue = ['province', 'city', 'area'].map((key) => defaultValue[key]);
    const {
      onChange,
      data: { key },
    } = this.props;
    isFunction(onChange) &&
      onChange(defaultValue.map((item) => item.code), key, defaultValue.map((item) => item.name));
    this.setState({ defaultValue: defaultValue.map((item) => item.name) });
  }
  async fetchData() {
    const state = {};
    const province = await CreateProjectServices.fetchQueryCityChildnode({ code: 'CN' });
    state.options = this.dataFilter(province);
    this.setState(
      {
        ...state,
      },
      () => {
        // console.log(this.Cascader);
      }
    );
  }
  onChange = (value, selectedOptions) => {
    const {
      onChange,
      data: { key },
    } = this.props;
    isFunction(onChange) && onChange(value, key, selectedOptions.map((item) => item.label));
  };
  async loadData(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const res = await CreateProjectServices.fetchQueryCityChildnode({ code: targetOption.value });
    const isLeaf = selectedOptions.length >= 2;
    const options = this.dataFilter(res, isLeaf);
    targetOption.loading = false;
    targetOption.children = [...options];
    this.setState({
      options: [...this.state.options],
    });
  }
  render() {
    let { defaultValue, isInput } = this.state;
    if (defaultValue.length > 0) {
      defaultValue = defaultValue.join('/');
    }
    let isCascader = true;
    if (defaultValue.length > 0 && isInput) {
      isCascader = false;
    }

    return (
      <div style={{ width: '428px' }}>
        {defaultValue.length > 0 && isInput ? (
          <Input
            defaultValue={defaultValue}
            onClick={() => {
              this.setState({ isInput: false });
              this.Cascader.setState({ popupVisible: true });
            }}
          />
        ) : null}
        <div style={{ display: isCascader ? 'block' : 'none' }}>
          <Cascader
            ref={(e) => (this.Cascader = e)}
            key={this.props.data.key}
            options={this.state.options}
            loadData={this.loadData.bind(this)}
            onChange={this.onChange}
            placeholder={defaultValue ? defaultValue : '请选择'}
            changeOnSelect
          />
        </div>
      </div>
    );
  }
}

export default Component;
