/**
 * Created by summer on 2018/9/19.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/gauge';
import 'echarts/lib/chart/pie';

export default class BarChart extends Component {
  static propTypes = {
    option: PropTypes.object.isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    click: PropTypes.func,
  };

  static defaultProps = {
    option: {},
    width: '100%',
    height: 200,
  };

  initBar = () => {
    const { click } = this.props;
    if (this.ID) {
      this.myChart = echarts.init(this.ID);
      this.myChart.clear();
      this.setEchartOption();

      this.myChart.on('click', null);
      this.myChart.on('click', (val) => {
        // console.log(val)
        click && click(val);
      });
      this.resizeEventFunc = throttle(this.myChart.resize, 500);
      window.addEventListener('resize', this.resizeEventFunc);
    }
  };

  setEchartOption() {
    const { option } = this.props;

    if (this.myChart) {
      this.myChart.setOption(option, true);
    }
  }

  componentDidMount() {
    setTimeout(this.initBar);
  }

  componentDidUpdate(prevProps) {
    const parse = (option) => JSON.stringify(option);
    if (parse(prevProps.option) !== parse(this.props.option)) {
      this.setEchartOption();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEventFunc);
  }

  render() {
    const { width, height } = this.props;
    return (
      <div
        ref={(ID) => {
          this.ID = ID;
        }}
        style={{ width, height }}
      />
    );
  }
}
