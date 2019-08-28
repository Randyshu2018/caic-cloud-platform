import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export default class ComponentView extends React.Component {
  render() {
    const { form, data, disabled } = this.props;
    const initialValue = data.initialValue;
    const value = initialValue ? (initialValue === '--' ? new Date() : initialValue) : new Date();
    const format = data.format || 'YYYY-MM-DD';
    // console.log('value',moment(value, format));
    if (!initialValue || initialValue === '--') {
      // this.props.datePickerCallback(moment(value, format));
    }

    // return (
    //   <DatePicker
    //     onChange={(e) => this.props.datePickerCallback(e)}
    //     disabled={disabled}
    //     defaultValue={moment(value, format)}
    //     format={format}
    //   />
    // );
    return form.getFieldDecorator(data.key, {
      initialValue: moment(value, format),
      format,
    })(
      <DatePicker disabled={disabled} defaultValue={moment('2015/01/01', format)} format={format} />
    );
  }
}
