/**
 * 系统生成账单
 */
import React from 'react';
// import { Link } from 'react-router-dom';
import { Form, Row, Col, Input, Select, DatePicker, message, InputNumber } from 'antd';
import '../style/index.scss';
import delimg from '../img/del-build.png';
import DetailList from './detailList';
import { events } from 'func';
import { timestampToTime } from './zdyBuild';
import moment from 'moment';
import api from 'api';
const { Option } = Select;
class BuildList extends React.Component {
  state = {
    dateType: '',
  };
  dateTypeChange = (val) => {
    this.setState({ dateType: val });
  };
  render() {
    const { getFieldDecorator, hasDel, i, len, del, val } = this.props;
    const { dateType } = this.state;
    const DateTmpl =
      dateType === 'ASSIGN'
        ? getFieldDecorator(`payDate-list-date-${i}`, {
            initialValue: null,
            rules: [
              {
                required: true,
                message: '请选择时间',
              },
            ],
          })(<DatePicker style={{ width: 90 }} />)
        : getFieldDecorator(`payDate-list-input-${i}`, {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请填写信息',
              },
            ],
          })(<InputNumber min={1} style={{ width: 80 }} placeholder="天" precision={0.1} />);
    return (
      <div className="build-list">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="开始时间">
              {getFieldDecorator(`beginDate-list-${i}`, {
                initialValue: val.beginDate ? moment(val.beginDate, 'YYYY-MM-DD') : null,
                rules: [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              })(<DatePicker disabled={val.lock} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="结束时间">
              {getFieldDecorator(`endDate-list-${i}`, {
                initialValue: val.endDate ? moment(val.endDate, 'YYYY-MM-DD') : null,
                rules: [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              })(<DatePicker disabled={len > 1 && i !== len - 1} />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="付款时间">
              {getFieldDecorator(`dateType-list-${i}`, {
                initialValue: dateType,
                rules: [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              })(
                <Select style={{ width: 100 }} onChange={this.dateTypeChange}>
                  <Option value="ADVANCE">提前</Option>
                  <Option value="DELAY">推迟</Option>
                  <Option value="ASSIGN">指定日期</Option>
                </Select>
              )}
              <span className="pl-10" />
              {DateTmpl}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="付款周期(几月一付)/月">
              {getFieldDecorator(`paymentCycle-list-${i}`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请输入信息',
                  },
                ],
              })(<InputNumber min={1} style={{ width: '100%' }} placeholder="" precision={0.1} />)}
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="租期划分方式">
              {getFieldDecorator(`tenancyWay-list-${i}`, {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(
                <Select style={{ width: 355 }}>
                  <Option value="START_DATE">按起始日划分</Option>
                  <Option value="FIRST_MONTH_FIRST_PERIOD_NM">
                    按自然月划分(首月非整自然月划入第一期)
                  </Option>
                  <Option value="FIRST_MONTH_ONE_MONTH_NM">
                    按自然月划分(首月非整自然月算一个月)
                  </Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        {i === len - 1 && i !== 0 && <img src={delimg} alt="" onClick={del} />}
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    listNum: [{}],
    zjDetailList: [],
    visible: false,
  };
  add = () => {
    let { listNum } = this.state;
    const arr = listNum.map((v) => v);
    this.getFormData();
    // console.log(events.customerList)
    const { systemList } = events;
    if (!systemList.length) {
      return;
    }
    for (let i = 0; i < systemList.length; i++) {
      for (let j in systemList[i]) {
        if (j !== 'billType' && !systemList[i][j]) {
          message.info('请完善列表中必填信息');
          return;
        }
      }
    }

    const nextStartDate = systemList[systemList.length - 1].endDate;
    // console.log(nextStartDate, systemList, systemList[systemList.length - 1]);
    const dateTime = new Date(nextStartDate);
    let newNextStartDate = dateTime.setDate(dateTime.getDate() + 1);
    newNextStartDate = timestampToTime(newNextStartDate);
    let nextEndDate = dateTime.setDate(dateTime.getDate() + 1);
    nextEndDate = timestampToTime(nextEndDate);
    // console.log(newNextStartDate)
    arr.push({
      beginDate: newNextStartDate,
      lock: true,
      endDate: nextEndDate,
    });
    this.setState({
      listNum: arr,
    });
  };
  del = () => {
    let { listNum } = this.state;
    const arr = listNum.map((v) => v);
    arr.pop();
    this.setState({
      listNum: arr,
    });
  };
  getFormData = () => {
    events.emit('getFormData');
  };
  // 运营管理 - 根据租期条款生成租金明细时间
  calculateBillTime = () => {
    this.getFormData();
    const { systemList } = events;
    // console.log(systemList)
    if (!systemList.length) {
      return;
    }
    for (let i = 0; i < systemList.length; i++) {
      for (let j in systemList[i]) {
        if (j !== 'billType' && !systemList[i][j]) {
          message.info('请完善列表中必填信息');
          return;
        }
      }
    }
    this.setState({ visible: false });
    api
      .calculateBillTime({
        tenancyClauseList: systemList,
      })
      .then((res) => {
        // console.log(res);
        events.zjDetailList = res || [];
        this.setState({
          zjDetailList: res || [],
          visible: true,
        });
      });
  };
  componentWillUnmount() {
    events.zjDetailList = [];
  }
  render() {
    const { getFieldDecorator } = this.props;
    const { listNum, zjDetailList, visible } = this.state;
    return (
      <React.Fragment>
        {listNum.map((v, i) => {
          return (
            <BuildList
              key={i}
              getFieldDecorator={getFieldDecorator}
              len={listNum.length}
              i={i}
              del={this.del}
              val={v}
            />
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="add-zdy-build" onClick={this.add}>
            +租期条款
          </div>
          <button className="create-rent-detail" onClick={this.calculateBillTime}>
            生成租金明细
          </button>
        </div>
        {zjDetailList.length > 0 && visible && <DetailList renderList={zjDetailList} />}
      </React.Fragment>
    );
  }
}
export default App;
