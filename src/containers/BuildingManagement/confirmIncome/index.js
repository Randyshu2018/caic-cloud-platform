import React from 'react';
import { Table, Form, Row, Col, Input, Button, message } from 'antd';
import '../style/index.scss';
import compile from '../img/icon-compile.png';
import api from 'api';

const ComponetMonth = (props) => {
  return props.that.state.isEdit ? (
    <Input
      className="editInput"
      value={props.text}
      type="number"
      onChange={(e) => {
        const editValue = e.target.value;
        props.that.setState((state) => {
          const dataSource = [...state.dataSource];
          let dataSourceIndex = null;
          for (let i = 0; i < props.that.state.dataSource.length; i++) {
            if (props.that.state.dataSource[i].year === props.record.year) {
              dataSourceIndex = i;
            }
          }
          dataSource[dataSourceIndex] = {
            ...dataSource[dataSourceIndex],
            [props.k]: `${editValue}`,
          };
          return {
            dataSource,
          };
        });
      }}
    />
  ) : (
    <span>{props.text || '--'}</span>
  );
};

@Form.create()
class ConfirmIncome extends React.Component {
  state = {
    isEdit: false,
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    dataSource: [],
    columns: [
      {
        title: '年份',
        dataIndex: 'year',
        key: 'year',
      },
    ],
    confirmIncomeDetail: {
      contractRooms: [],
      totalPrice: 0,
      customer: {
        lessee: '',
        industry: '',
      },
      beginSignDate: '',
      endSignDate: '',
      contractNO: '',
      incomeType: {
        incomeType: null,
        amortizationCalculationType: null,
        amortizationType: null,
        unNaturalMonthlyConversion: null,
      },
    },
  };
  componentDidMount() {
    this.columnsList();
    if (this.props.contractId) {
      const query = {
        contractId: this.props.contractId,
      };
      api.contractDetail(query).then((res) => {
        this.setState({
          confirmIncomeDetail: res,
          dataSource: res.incomeList,
        });
      });
    }
  }

  handleEdit = () => {
    this.setState({
      isEdit: true,
    });
  };

  columnsList = () => {
    let columnsItem = {};
    for (let i = 0; i < this.state.months.length; i++) {
      columnsItem = {
        title: `${i + 1}月`,
        dataIndex: `amount4${this.state.months[i]}`,
        key: `amount4${this.state.months[i]}`,
        render: (text, record, index) => (
          <ComponetMonth
            k={`amount4${this.state.months[i]}`}
            that={this}
            text={text}
            record={record}
            key={`${index}`}
          />
        ),
      };
      this.state.columns.push(columnsItem);
    }
  };

  handleSubmitSave = () => {
    let totals = null;
    this.setState({
      isEdit: false,
    });
    this.state.dataSource.map((item, index) => {
      for (let i = 0; i < this.state.months.length; i++) {
        if (
          item[`amount4${this.state.months[i]}`] === '-' ||
          item[`amount4${this.state.months[i]}`] === ''
        ) {
          item[`amount4${this.state.months[i]}`] = '0';
        }
        // 保存时总金额
        totals += parseFloat(item[`amount4${this.state.months[i]}`]);
      }
    });
    if (totals === this.state.confirmIncomeDetail.totalPrice) {
      const key = ['amount4Year', 'billType', 'contractId', 'lessee', 'roomName'];
      this.state.dataSource.map((item, index) => {
        key.map((keys) => {
          delete item[keys];
        });
      });
      let params = {
        contractId: this.props.contractId,
        incomeList: [...this.state.dataSource],
      };
      api.contractIncomeSave({ ...params }).then((res) => {
        if (res) {
          window.incomeTableGetData();
          // this.props.onClose(false);
          message.success('保存成功');
        }
      });
    } else {
      message.info('租金总额与账单租金总额不匹配，请重新编辑');
    }
  };

  handleTime = (param) => {
    if (param) {
      const arr = param.split('-');
      return arr.join('.');
    }
  };

  render() {
    const { confirmIncomeDetail } = this.state;
    const { getFieldDecorator } = this.props.form;

    const columns = this.state.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });

    return (
      <React.Fragment>
        <div className="confirm-income">
          <Row>
            <Col span={24} className="confirm-title">
              合同概览
            </Col>
          </Row>
          <div className="confirm-info">
            <div className="confirm-building">
              <Row className="title">
                <Col span={6}>
                  <div>已选中房源</div>
                </Col>
                <span>总面积：{confirmIncomeDetail.totalArea}㎡</span>
              </Row>
              <Row className="infoList">
                {confirmIncomeDetail.contractRooms.map((item, index) => {
                  return (
                    <Col span={24} key={index}>
                      <div>{item.buildingName}</div>
                      <div>{item.floorName}层</div>
                      <div>{item.roomName}室</div>
                      <div>{item.area}㎡</div>
                    </Col>
                  );
                })}
              </Row>
            </div>
            <Row className="infoLable">
              <Col span={12}>
                <div>租客</div>
                <div>{confirmIncomeDetail.customer.lessee}</div>
              </Col>
              <Col span={12}>
                <div>租期</div>
                <div>
                  {this.handleTime(confirmIncomeDetail.beginSignDate)} -{' '}
                  {this.handleTime(confirmIncomeDetail.endSignDate)}
                </div>
              </Col>
              <Col span={12}>
                <div>行业</div>
                <div>{confirmIncomeDetail.customer.industry}</div>
              </Col>
              <Col span={12}>
                <div>合同编号</div>
                <div>{confirmIncomeDetail.contractNO}</div>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ marginBottom: '20px', color: '#445870', fontWeight: '500' }}>
                收入确认
              </Col>
            </Row>
            <Row className="infoLable">
              <Col span={12}>
                <div>收入确认方式</div>
                <div>{confirmIncomeDetail.incomeType.incomeType || '-'}</div>
              </Col>
              <Col span={12}>
                <div>摊销计算类型</div>
                <div>{confirmIncomeDetail.incomeType.amortizationCalculationType || '-'}</div>
              </Col>
              <Col span={12}>
                <div>分摊类型</div>
                <div>{confirmIncomeDetail.incomeType.amortizationType || '-'}</div>
              </Col>
              <Col span={12}>
                <div>非整自然月换算规则</div>
                <div>{confirmIncomeDetail.incomeType.unNaturalMonthlyConversion || '-'}</div>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <span onClick={this.handleEdit}>
                  <img src={compile} style={{ width: '14px' }} /> 编辑
                </span>
              </Col>
            </Row>
            <div className="yearlist">
              <Table
                className="yeartable"
                dataSource={this.state.dataSource.map((item, key) => ({ ...item, key }))}
                // dataSource={confirmIncomeDetail.dataSource}
                columns={columns}
                rowClassName={(record, index) => (index % 2 === 1 ? 'editablebg' : '')}
                pagination={false}
              />
            </div>
            <Row>
              <Col span={24} className="total">
                租金合计：{confirmIncomeDetail.totalPrice}元
              </Col>
            </Row>
            <Button type="primary" onClick={this.handleSubmitSave}>
              保存
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default ConfirmIncome;
