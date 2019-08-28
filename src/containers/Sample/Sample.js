import React from 'react';
import { Layout, Form, Icon, Input, Button } from 'antd';
import SelectCityArea from '../../components/FormInput/SelectCityArea';
import CheckBoxSelect from '../../components/FormInput/CheckBoxSelect';

export default class Sample extends React.Component {
  constructor(props) {
    super(props);
  }

  onSelectCityAreaChange = (value) => {
    console.log('onSelectCityAreaChange', value);
  };

  onCheckBoxSelectChange = (value) => {
    console.log('onCheckBoxSelectChange', value);
  };

  render() {
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ fontSize: '20px', paddingBottom: '15px' }}>秋实链-公共组件使用实例</div>
        <SelectCityArea
          initAreaValue={['上海市', '上海', '黄浦区']}
          onChange={this.onSelectCityAreaChange}
        />
        <CheckBoxSelect
          onChange={this.onCheckBoxSelectChange}
          initValue={[
            { name: 'LEED', selected: false, options: ['铂金', '铂金1', '铂金2'] },
            { name: '绿箭', selected: true, options: ['铂金', '铂金1', '铂金2'], value: '' },
            { name: '其它', selected: true, value: '11' },
          ]}
          disabled={false}
        />
      </div>
    );
  }
}
