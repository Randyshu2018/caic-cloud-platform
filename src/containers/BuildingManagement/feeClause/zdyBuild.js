/**
 * 自定义生成账单
 */
import React from 'react';
// import { Link } from 'react-router-dom';
import { Form, Row, Col, Input, Select, DatePicker, InputNumber, message } from 'antd';
import '../style/index.scss';
import delimg from '../img/del-build.png';
import { events } from 'func';
import moment from 'moment';

export function timestampToTime(timestamp) {
  var date = new Date(timestamp.length < 10 ? timestamp * 1000 : timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = date.getDate() + ' ';
  return Y + M + D;
}
const { Option } = Select;

const BuildList = ({ getFieldDecorator, hasDel, i, len, del, val }) => {
  return (
    <div className="build-list">
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label="开始时间">
            {getFieldDecorator(`beginDate-zdylist-${i}`, {
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
        <Col span={6}>
          <Form.Item label="结束时间">
            {getFieldDecorator(`endDate-zdylist-${i}`, {
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
        <Col span={6}>
          <Form.Item label="付款时间">
            {getFieldDecorator(`billDate-zdylist-${i}`, {
              // initialValue: '自定义生成账单',
              rules: [
                {
                  required: true,
                  message: '请选择时间',
                },
              ],
            })(<DatePicker />)}
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="应收金额">
            {getFieldDecorator(`billAmount-zdylist-${i}`, {
              // initialValue: '',
              rules: [
                {
                  required: true,
                  message: '请输入金额',
                },
              ],
            })(<InputNumber min={1} style={{ width: '100%' }} placeholder="元" />)}
          </Form.Item>
        </Col>
      </Row>
      {i === len - 1 && i !== 0 && <img src={delimg} alt="" onClick={del} />}
    </div>
  );
};

class App extends React.Component {
  state = {
    listNum: [{ index: 0 }],
  };
  add = () => {
    let { listNum } = this.state;
    const arr = listNum.map((v) => v);
    this.getFormData();
    // console.log(events.customerList)
    const { customerList } = events;
    if (!customerList.length) {
      return;
    }
    for (let i = 0; i < customerList.length; i++) {
      for (let j in customerList[i]) {
        if (j !== 'billType' && !customerList[i][j]) {
          message.info('请完善列表中必填信息');
          return;
        }
      }
    }
    const nextStartDate = customerList[customerList.length - 1].endDate;
    // console.log(nextStartDate, customerList, customerList[customerList.length - 1])
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
  render() {
    const { getFieldDecorator } = this.props;
    const { listNum } = this.state;
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
        <div className="add-zdy-build" onClick={this.add}>
          +添加一行
        </div>
        {/* <button className="create-rent-detail" onClick={this.test}>
          生成租金明细
        </button> */}
      </React.Fragment>
    );
  }
}
export default App;
