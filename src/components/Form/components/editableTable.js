import React from 'react';
import {
  Select,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Row,
  Col,
  Button,
  Icon,
  DatePicker,
} from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  get mementDate() {
    const year = moment().get('year');
    return Array.apply(null, new Array(10)).map((_, i) => year - i);
  }
  getInput = () => {
    const style = { width: '100%' };
    let children = '';
    switch (this.props.inputType) {
      case 'number':
        children = <InputNumber style={style} />;
        break;
      case 'dataPicker':
        children = <DatePicker style={style} />;
        break;
      case 'select':
        children = (
          <Select style={style}>
            {this.mementDate.map((value) => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        );
        break;
      default:
        children = <Input style={style} />;
        break;
    }
    return children;
  };

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
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `不能为空`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
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
        width: 100,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {(form) => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <a onClick={(_) => this.cancel(record.key)}>取消</a>
                </span>
              ) : (
                <span>
                  <a
                    className="margin-15"
                    disabled={editingKey !== ''}
                    onClick={() => this.edit(record.key)}
                  >
                    编辑
                  </a>
                  <Popconfirm title="确认删除吗?" onConfirm={() => this.handleDelete(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              )}
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

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const tableColumns = {};
    this.props.data.tableColumns.forEach((value) => {
      tableColumns[value.key] = '';
    });
    const newData = {
      key: count,
      ...tableColumns,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      editingKey: count,
    });
  };
  save(form, key) {
    form.validateFields((error, row) => {
      // console.log(row);

      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
      } else {
        newData.push(row);
      }
      this.setState({ dataSource: newData, editingKey: '' });
      this.handleChange(newData);
    });
  }
  handleChange(dataSource) {
    typeof this.props.tableCallback === 'function' && this.props.tableCallback(dataSource);
  }
  edit(key) {
    this.setState({ editingKey: key });
  }

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
        }),
      };
    });

    return [
      <Row key="header">
        <Col span={24}>
          <Col span={4} className="table-title">
            <span>{this.props.data.name}</span>
          </Col>
          <Col span={20}>
            <Button onClick={this.handleAdd} className="span-add-btn">
              <Icon type="plus" />
              添加一行
            </Button>
          </Col>
        </Col>
      </Row>,
      <Row key="body">
        <Col span={24}>
          <div>
            <EditableContext.Provider value={this.props.form}>
              <Table
                components={components}
                bordered
                dataSource={this.state.dataSource}
                columns={columns}
                rowClassName="editable-row"
                pagination={{
                  onChange: this.cancel,
                }}
              />
            </EditableContext.Provider>
          </div>
        </Col>
      </Row>,
    ];
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
