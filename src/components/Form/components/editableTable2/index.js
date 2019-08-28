import './style.scss';
import React from 'react';
import { Cascader, Table, Popconfirm, Form, Row, Col, Icon } from 'antd';
import { Consumer } from 'src/containers/Rent/context';

const EditableContext = React.createContext();

const ArrayReduce = (data) => {
  if (!Array.isArray(data)) return [];
  return data.reduce((previousValue, values, index) => {
    const item = {
      value: `${values.id}|${values.name}`,
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

class EditableCell extends React.Component {
  render() {
    const {
      editing,
      dataIndex = 0,
      title,
      inputType,
      record = {},
      index,
      ...restProps
    } = this.props;

    return (
      <EditableContext.Consumer>
        {(form) => {
          return <td {...restProps}>{restProps.children}</td>;
        }}
      </EditableContext.Consumer>
    );
  }
}
@Form.create()
class EditableTableEvent extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = [...props.dataSource];
    const tableColumns = [...props.data.tableColumns];
    this.state = { dataSource, editingKey: '', count: dataSource.length };
    this.columns = [
      ...tableColumns,
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 200,
        render: (text, record) => {
          return (
            <div>
              <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
  }
  isEditing = (record) => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource].filter((item) => item.key !== key);
    this.setState({ dataSource });
    this.handleChange(dataSource);
  };

  handleAdd = (tableColumns) => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      ...tableColumns,
    };
    const newDataSource = [...dataSource, newData];
    this.setState({
      dataSource: newDataSource,
      count: count + 1,
      editingKey: count,
    });
    this.handleChange(newDataSource);
  };
  handleChange(dataSource) {
    console.log('dataSource:', dataSource);

    typeof this.props.tableCallback === 'function' && this.props.tableCallback(dataSource);
  }
  handleCascaderChange = (value) => {
    // handleAdd
    console.log(value);
    const [floorName, roomName, area] = value;
    const tableColumns = {
      floorName,
      roomName,
      area,
    };
    this.handleAdd(tableColumns);
  };
  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.inputType || 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
          editdata: col.editData,
          // handleselect: this.handleSelect,
        }),
      };
    });

    return (
      <div className="editableTable2">
        <Row key="header">
          <Col span={24}>
            <Col span={4} className="table-title">
              <span>{this.props.data.name}</span>
            </Col>
          </Col>
        </Row>
        <Row key="body">
          <Col span={24}>
            <div>
              <EditableContext.Provider
                value={{ ...this.props.form, handleselect: this.handleSelect }}
              >
                <Table
                  components={components}
                  bordered
                  dataSource={this.state.dataSource}
                  columns={columns}
                  rowClassName="editable-row"
                  pagination={false}
                  locale={{ emptyText: <div /> }}
                />
              </EditableContext.Provider>
            </div>
          </Col>
        </Row>
        <div key="footer" className="footer">
          <div
            className="add-btn"
            onClick={(e) => {
              this.setState({
                tip: '请依次选择楼层，房源，面积',
              });
            }}
          >
            {this.state.tip ? (
              <span> {this.state.tip} </span>
            ) : (
              <span>
                <Icon type="plus" />
                添加一行
              </span>
            )}
            <Cascader
              options={ArrayReduce(this.props.buildNewsList)}
              onChange={(value) => this.handleCascaderChange(value)}
              onClick={(e) => this.state.tip && e.stopPropagation()}
              onPopupVisibleChange={(value) => {
                console.log('value--==');
                console.log(value);
                !value &&
                  this.setState({
                    tip: '',
                  });
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

@Consumer
class EditableTable extends React.Component {
  state = {
    isRender: false,
  };
  componentWillReceiveProps(nextProps) {
    // console.log('nextProps:', nextProps);
    if (nextProps.dataSource) {
      this.setState(
        {
          isRender: false,
        },
        () => {
          this.setState({
            isRender: true,
          });
        }
      );
    }
  }
  componentDidMount() {
    this.setState({
      isRender: true,
    });
  }
  render() {
    console.log('table2:', this.props);

    if (!this.state.isRender) return null;
    return (
      <React.Fragment>
        <EditableTableEvent {...this.props} />
      </React.Fragment>
    );
  }
}

// const EditableFormTable = Form.create()(EditableTableEvent);

export default EditableTable;
