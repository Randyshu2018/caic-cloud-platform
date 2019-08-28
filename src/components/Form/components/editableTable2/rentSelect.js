import React from 'react';
import { Icon, Row, Col, Popconfirm, Select } from 'antd';
import { Consumer } from 'src/containers/Rent/context';
import './style.scss';

const ArrayReduce = (data) => {
  if (!Array.isArray(data)) return [];
  const handelData = JSON.parse(JSON.stringify(data).replace(/floors/g, 'rooms'));
  return handelData.reduce((previousValue, values, index) => {
    const item = {
      value: values.id,
      label: values.name,
      children: !Array.isArray(values.rooms)
        ? [
            {
              value: values.mgtArea,
              label: values.mgtArea,
            },
          ]
        : ArrayReduce(values.rooms, true),
    };
    previousValue.push(item);
    return previousValue;
  }, []);
};

class RentSelectComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log('++++++++');
    console.log(this.props);
    const dataSource = [...props.dataSource];
    this.state = {
      dataSource,
      dataSourceSelect: [this.getList()],
      dataSourceValues: [this.getList()],
    };
  }
  componentDidMount() {
    const state = this.dataDiff(this.props);
    console.log('componentDidMount: this.props', this.props);

    this.setState({
      ...state,
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:', nextProps);

    if (!Array.isArray(nextProps.dataSource) && !Array.isArray(this.props.dataSource))
      throw new Error('dataSource type not Array!');
    if (nextProps.buildNewsList.length !== this.props.buildNewsList.length || !this.props.isEdit) {
      const state = this.dataDiff(nextProps);
      this.setState({
        ...state,
      });
    }
  }
  dataDiff = (props) => {
    const state = {};
    const dataSource = [...props.dataSource];
    if (Array.isArray(dataSource)) {
      state.dataSource = dataSource;
      const dataSourceValues = dataSource.reduce((previousValue, currentValue) => {
        const values = ['buildingName', 'floorName', 'roomName', 'area'];
        console.log('dataSource====', dataSource);
        const itemValue = values.map((key) => currentValue[key] || '');
        previousValue.push(itemValue);
        return previousValue;
      }, []);
      state.dataSourceValues = dataSourceValues;
    }
    if (Array.isArray(props.buildNewsList)) {
      const list = [...this.getList()];
      const buildNewsList = ArrayReduce(props.buildNewsList);
      // const buildNewsList = ArrayReduce(arr);
      console.log('props.buildNewsList', buildNewsList);
      list.unshift(buildNewsList);
      const dataSourceSelect = dataSource.map(() => list);
      state.dataSourceSelect = dataSourceSelect;
    }
    console.log('state:', state);
    return state;
  };

  getList(v = []) {
    return Array.apply(null, new Array(4)).map(() => v);
  }
  reduceArr = (arr) => {
    return (Array.isArray(arr) ? arr : []).reduce((newArr, i) => {
      newArr.push(Array.isArray(i) ? [...i] : { ...i });
      return newArr;
    }, []);
  };

  handleChange = () => {
    typeof this.props.tableCallback === 'function' &&
      this.props.tableCallback(this.state.dataSource);
  };

  handleSelectChange = (pi, ti, v) => {
    console.log('pi, ti, v');
    console.log(pi, ti, v);
    this.setState(
      (state) => {
        let dataSourceValues = this.reduceArr(state.dataSourceValues);
        let dataSourceSelect = this.reduceArr(state.dataSourceSelect);
        let dataSource = this.reduceArr(state.dataSource);
        const keys = ['buildingName', 'floorName', 'roomName', 'area'];
        const select = dataSourceSelect[pi];
        let nextSelect = {};
        if (ti + 1 < select.length) {
          const nextIndex = select[ti].findIndex(({ value }) => value === v);
          if (nextIndex !== -1) {
            nextSelect = dataSourceSelect[pi][ti][nextIndex];
            dataSourceSelect[pi][ti + 1] = Array.isArray(nextSelect.children)
              ? nextSelect.children
              : [];
          }
        }
        dataSourceValues[pi][ti] = v;
        dataSource[pi][keys[ti]] = v;
        dataSource[pi][`${keys[ti]}label`] = nextSelect.label;
        if (ti === 2) {
          const areaV = nextSelect.children[0] || {};
          dataSource[pi][keys[ti + 1]] = areaV.value;
          dataSourceValues[pi][ti + 1] = areaV.value;
        } else if (ti === 0 || ti === 1) {
          dataSource[pi][keys[ti + 1]] = '';
          dataSourceValues[pi][ti + 1] = '';
          dataSource[pi][keys[ti + 2]] = '';
          dataSourceValues[pi][ti + 2] = '';
          dataSource[pi][keys[ti + 3]] = '';
          dataSourceValues[pi][ti + 3] = '';
        }
        return {
          dataSourceValues,
          dataSourceSelect,
          dataSource,
        };
      },
      () => this.handleChange()
    );
  };

  handleDelete = (pi) => {
    const rf = (d) => d.filter((_, i) => i !== pi);
    this.setState(
      (state) => ({
        dataSourceValues: rf(state.dataSourceValues),
        dataSourceSelect: rf(state.dataSourceSelect),
        dataSource: rf(state.dataSource),
      }),
      () => this.handleChange()
    );
  };

  renderEdit = (selectList, defaultValue, index, i) => {
    if (i === 3) return <span>{defaultValue || '-'}</span>;
    return selectList.length ? (
      <Select
        value={defaultValue}
        onChange={(e) => this.handleSelectChange(index, i, e)}
        disabled={this.props.disabled}
      >
        {/* <Select.Option value="">请选择{tips[i]}</Select.Option> */}
        {selectList.map((item, jndex) => (
          <Select.Option key={`${index}-${jndex}`} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    ) : (
      <span>{defaultValue || '-'}</span>
    );
  };

  handleAdd = () => {
    this.setState((state) => {
      const dataSourceValues = this.reduceArr(state.dataSourceValues);
      const dataSourceSelect = this.reduceArr(state.dataSourceSelect);
      const dataSource = this.reduceArr(state.dataSource);
      const list = [...this.getList()];
      const buildNewsList = ArrayReduce(this.props.buildNewsList);
      // const buildNewsList = ArrayReduce(arr);
      list.unshift(buildNewsList);
      return {
        dataSourceValues: dataSourceValues.concat([this.getList('')]),
        dataSourceSelect: dataSourceSelect.concat([list]),
        dataSource: dataSource.concat({ buildingName: '', floorName: '', roomName: '', area: '' }),
      };
    });
  };

  colSpan = 4;
  th = [
    {
      name: '选择楼宇',
      key: 'buildingName',
    },
    {
      name: '选择楼层',
      key: 'floorName',
    },
    {
      name: '选择房源',
      key: 'roomName',
    },
    {
      name: '面积/㎡',
      key: 'area',
    },
    {
      name: '操作',
      key: 'operation',
      render: (pi, ti) => {
        // console.log(pi, ti);
        if (this.props.disabled) return null;
        if (this.state.dataSource.length === 1 && pi === 0) return null;
        return (
          <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(pi, ti)}>
            <Icon type="delete" theme="filled" />
          </Popconfirm>
        );
      },
    },
  ];
  renderChildrenHeader = () => {
    const th = this.th;
    const childrenHeader = (
      <Row>
        {th.map((item, index) => (
          <Col key={item.key} className={item.key} span={this.colSpan} style={{ width: '135px' }}>
            {item.name}
          </Col>
        ))}
      </Row>
    );
    return childrenHeader;
  };

  renderChildrenFloor = (verifyArr) => {
    return verifyArr ? (
      <div key="footer" className="footer">
        <div className="add-btn" onClick={() => this.handleAdd()}>
          <span>
            <Icon type="plus" />
            添加一行
          </span>
        </div>
      </div>
    ) : null;
    // return verifyArr ? (
    //   <div>
    //     <Button onClick={() => this.handleAdd()}>
    //       <Icon type="plus" />
    //       添加一行
    //     </Button>
    //   </div>
    // ) : null;
  };

  renderChildrenBody = (verifyArr) => {
    const { dataSource, dataSourceFloor, dataSourceSelect, dataSourceValues } = this.state;
    const body = dataSource || [];
    const childrenBody = body.reduce((previousValue, currenValue, index) => {
      // const keys = ['floorName', 'roomName', 'area'];
      const childrenNode = [];
      this.th.forEach((item, i) => {
        let selectList = [],
          floorList = [];

        if (verifyArr) {
          selectList = (dataSourceSelect[index] || [])[i] || [];
        }
        childrenNode.push(
          <Col key={`${item.key}-${index}-${i}`} span={this.colSpan} style={{ width: '135px' }}>
            {typeof item.render === 'function'
              ? item.render(index, i)
              : this.props.isEdit
                ? this.renderEdit(selectList, (dataSourceValues[index] || [])[i], index, i)
                : currenValue[item.key]}
          </Col>
        );
      });
      previousValue.push(<Row key={index}>{childrenNode}</Row>);
      return previousValue;
    }, []);
    return childrenBody;
  };
  render() {
    // console.log('%c---------------', 'color:red');
    console.log('this.state:', this);
    const verifyArr = Array.isArray(this.props.buildNewsList) && this.props.buildNewsList.length;
    return (
      <section className="rentSelect editableTable2">
        {this.renderChildrenHeader()}
        {this.renderChildrenBody(verifyArr)}
        {this.props.disabled ? null : this.renderChildrenFloor(verifyArr)}
      </section>
    );
  }
}

@Consumer
export default class Component extends React.Component {
  render() {
    const payload = {
      isEdit: true,
      disabled: false,
      ...this.props,
      // tableCallback: (res) => {
      //   console.log('res:', res);
      // },
    };
    const dataSource = [...this.props.dataSource];
    dataSource.push({ buildingName: '', floorName: '', roomName: '', area: '' });
    payload.dataSource = dataSource;
    return <RentSelectComponent {...payload} />;
  }
}
