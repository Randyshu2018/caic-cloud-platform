import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { DatePicker, Row, Col, Form, Select, Input } from 'antd';
// import FormLayout from 'src/components/Form/rentForm';
// import contractConfig from './config';
import '../style/index.scss';
import moment from 'moment';

const { Option } = Select;
// 选择框
const depositNumber = [];
const payNumber = [];
for (let i = 0; i < 12; i++) {
  depositNumber.push({
    id: i + 1,
    name: '押' + (i + 1),
  });
  payNumber.push({
    id: i + 1,
    name: '付' + (i + 1),
  });
}
export const SelectTmpl = ({ col, data, gfd, title, initialValue }) => {
  return (
    <Col span={col}>
      <Form.Item label={`选择楼层`}>
        {gfd(title || `field-1000`, {
          initialValue,
          rules: [
            {
              // required: true,
              message: 'Input something!',
            },
          ],
        })(
          <Select>
            <Option value="rmb">12楼</Option>
            <Option value="dollar">11楼</Option>
          </Select>
        )}
      </Form.Item>
    </Col>
  );
};
// 输入框
export const InputTmpl = ({ col, gfd, label, disabled, title, data, initialValue }) => {
  return (
    <Col span={col}>
      <Form.Item label={label}>
        {gfd(title || `field-1000`, {
          initialValue: data ? data[title] : initialValue,
          rules: [
            {
              required: true,
              message: '请输入信息',
            },
          ],
        })(<Input placeholder="" disabled={disabled} />)}
      </Form.Item>
    </Col>
  );
};
// 支付方式
export const PayType = ({ col, gfd, label, data }) => {
  return (
    <Col span={col}>
      <Form.Item label={label}>
        {gfd(`depositNumber`, {
          initialValue: data.depositNumber,
          rules: [
            {
              required: true,
              message: '请选择',
            },
          ],
        })(
          <Select style={{ width: 125 }}>
            {depositNumber.map((v) => (
              <Option key={v.id} value={v.id}>
                {v.name}
              </Option>
            ))}
          </Select>
        )}
        <span style={{ padding: '0 10px' }}>-</span>
        {gfd(`payNumber`, {
          initialValue: data.payNumber,
          rules: [
            {
              required: true,
              message: '请选择',
            },
          ],
        })(
          <Select style={{ width: 125 }}>
            {payNumber.map((v) => (
              <Option key={v.id} value={v.id}>
                {v.name}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Col>
  );
};
// 日期
export const DateTmpl = ({ col, gfd, label, title, data }) => {
  const dateFormat = 'YYYY-MM-DD';

  return (
    <Col span={col}>
      <Form.Item label={label}>
        {gfd(title || `field-999`, {
          initialValue: data[title] ? moment(data[title], dateFormat) : undefined,
          rules: [
            {
              required: true,
              message: '请选择日期',
            },
          ],
        })(<DatePicker style={{ width: '100%' }} format={dateFormat} />)}
      </Form.Item>
    </Col>
  );
};
export const rowList = (data, gfd) => {
  return (
    <Row gutter={24}>
      <Col span={1} />
      {data.map((v, i) => {
        let tmp = null;
        const obj = {
          key: i,
          ...v,
          gfd: gfd,
        };
        switch (v.type) {
          case 'input':
            tmp = <InputTmpl {...obj} />;
            break;
          case 'select':
            tmp = <SelectTmpl {...obj} />;
            break;
          case 'date':
            tmp = <DateTmpl {...obj} />;
            break;
          case 'pay':
            tmp = <PayType {...obj} />;
            break;
          default:
        }
        return tmp;
      })}
    </Row>
  );
};
