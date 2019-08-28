import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export default class ComponentView extends React.Component {
  componentDidMount() {}
  render() {
    const { data, disabled } = this.props;
    const initialValue = data.initialValue;
    const format = data.format || 'YYYY-MM-DD';
    const value = initialValue ? moment(initialValue, format) : '';
    // if (!initialValue || initialValue === '--') {
    //   this.props.datePickerCallback(moment(value, format));
    // }

    return (
      <DatePicker
        onChange={(e) => this.props.datePickerCallback(e)}
        disabled={disabled}
        value={value}
        format={format}
        // placeholder="请输入日期"
      />
    );
    // return form.getFieldDecorator(data.key, {
    //   initialValue: moment(value, format),
    //   format,
    // })(<DatePicker disabled={disabled} defaultValue={moment('2015/01/01', format)} format={format}/>);
  }
}
