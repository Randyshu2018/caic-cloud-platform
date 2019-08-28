import React from 'react';
import BarChart from '../../components/echarts-component/container';
import ChartOption from '../../components/echarts-component/chart-option';
import { response1 } from './response';

export default class Sample extends React.Component {
  state = {
    percentData: {
      total: 100,
      value: 60,
      color: '#FC4077',
      name: '栗子',
    },
    percentData1: {
      total: 100,
      value: 80,
      color: '#00E4A5',
      name: '栗子',
    },
    // simplePieData: ,
  };

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
    const { percentData, percentData1 } = this.state;
    const response1Json = JSON.parse(response1);
    const response1Json2 = JSON.parse(response1);
    const response1Json3 = JSON.parse(response1);
    let linesData = response1Json.data.data[0];
    const linesData1 = response1Json.data.data[1];
    linesData['sixMonthSheets'][1] = response1Json.data.data[1]['sixMonthSheets'][0];
    linesData['showArea'] = false;
    return (
      <div style={{ padding: '10px' }}>
        <div style={{ fontSize: '20px', paddingBottom: '15px' }}>秋实链-公共组件使用实例</div>
        <div style={{ fontSize: '16px', paddingBottom: '15px' }}>饼图使用实例</div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1' }}>
            <BarChart
              option={ChartOption.handlechartOption(ChartOption.TYPE.SIMPLE_PIE, {
                showLegend: true,
                series: [
                  { value: '12220', name: '优秀', unit: '元' },
                  { value: '44550', name: '正常', unit: '元' },
                  { value: '23333', name: '不健康', unit: '元' },
                  { value: '89902', name: '未诊断', unit: '元' },
                ],
              })}
              height="260px"
            />
          </div>
          <div style={{ flex: '1' }}>
            <BarChart
              option={ChartOption.handlechartOption(ChartOption.TYPE.SIMPLE_PIE, {
                showLegend: false,
                size: 'small',
                series: [
                  { value: '12220', name: '优秀', unit: '元' },
                  { value: '44550', name: '正常', unit: '元' },
                  { value: '23333', name: '不健康', unit: '元' },
                  { value: '89902', name: '未诊断', unit: '元' },
                ],
              })}
              height="160px"
            />
          </div>
        </div>

        <div style={{ fontSize: '16px', paddingBottom: '15px', paddingTop: '30px' }}>
          单线条使用实例
        </div>
        <BarChart
          option={ChartOption.handlechartOption(ChartOption.TYPE.SIMPLE_LINE, {
            name: '11',
            // type:2,
            data: [
              { yearMonth: '2018-11', value: '80' },
              { yearMonth: '2018-12', value: '70' },
              { yearMonth: '2019-01', value: '120' },
              { yearMonth: '2019-02', value: '40' },
              { yearMonth: '2019-03', value: '66' },
              { yearMonth: '2019-04', value: '98' },
            ],
            unit: '元',
            color: '#00E4A5',
          })}
          height="150px"
        />
        <div style={{ fontSize: '16px', paddingBottom: '15px', paddingTop: '30px' }}>
          线条使用实例
          <p style={{ fontSize: '14px' }}>需要阴影的传参数showArea=true</p>
        </div>
        <BarChart
          option={ChartOption.handlechartOption(ChartOption.TYPE.LINES, linesData)}
          height="400px"
        />
        <div style={{ fontSize: '16px', paddingBottom: '15px' }}>线条和柱子混合使用实例</div>
        <BarChart
          option={ChartOption.handlechartOption(
            ChartOption.TYPE.LINE_BAR,
            response1Json2.data.data[0]
          )}
          height="400px"
        />
        <div style={{ fontSize: '16px', paddingBottom: '15px' }}>雷达图使用实例</div>
        <BarChart
          option={ChartOption.handlechartOption(
            ChartOption.TYPE.LINE_BAR,
            response1Json2.data.data[0]
          )}
          height="400px"
        />
      </div>
    );
  }
}
