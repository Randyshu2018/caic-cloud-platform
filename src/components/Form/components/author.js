import React, { PureComponent } from 'react';
import { Checkbox, Icon } from 'antd';

class ComponentView extends PureComponent {
  constructor(props) {
    super(props);
    const datas = {
      '1': {
        name: '基础数据',
        explain: '如需对您的项目做诊断，基础信息为必填信息，为了保证诊断的准确性，请完善以下数据。',
      },
      '2': {
        name: '资产诊断',
        explain:
          '如需对您的项目做资产诊断，需要将当期数据授权给秋实链，为了保证诊断的准确性，请完善以下数据。',
      },
      '3': {
        name: '运营诊断',
        explain:
          '如需对您的项目做运营诊断，需要将当期数据授权给秋实链，为了保证诊断的准确性，请完善以下数据。',
      },
      '4': {
        name: '价值诊断',
        explain:
          '如需对您的项目做价值诊断，需要将当期数据授权给秋实链，为了保证诊断的准确性，请完善以下数据。',
      },
      '5': {
        name: '交易诊断',
        explain:
          '如需对您的项目做交易诊断，需要将当期数据授权给秋实链，为了保证诊断的准确性，请完善以下数据。',
      },
    };

    this.state = {
      data: datas[props.current],
    };
  }

  handleChange = ({ target }) => {
    this.props.onChange(target.checked);
  };
  renderCheckbox() {
    const checked = this.props.notDiagnose;
    return (
      <p className="span">
        <span>本项不诊断</span>
        <Checkbox onChange={this.handleChange} checked={checked}>
          是（勾选后，默认为当前类型本期不做诊断）
        </Checkbox>
      </p>
    );
  }
  render() {
    const { name, explain } = this.state.data;
    const isDisabled = this.props.current === 1;
    return (
      <div className="eju-tip eju-checkbox">
        {/* <Icon type="info-circle" /> */}
        <div>
          <h4>{name}</h4>
          <p>{explain}</p>
          {isDisabled ? null : this.renderCheckbox()}
        </div>
      </div>
    );
  }
}

export default ComponentView;
