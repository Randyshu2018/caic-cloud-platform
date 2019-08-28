import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Steps.scss';
import { Steps } from 'antd';

export default class ESteps extends Component {
  static propTypes = {
    stepsData: PropTypes.array.isRequired,
    current: PropTypes.number,
  };

  render() {
    const { stepsData = [], current = 0 } = this.props;
    return (
      <div className="stepsContainer">
        <Steps current={current}>
          {stepsData.map((item, index) => <Steps.Step title={item} description="" key={index} />)}
        </Steps>
      </div>
    );
  }
}
