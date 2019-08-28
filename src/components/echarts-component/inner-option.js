import {
  PIE_COLORS,
  LINE_COLORS,
  SIMPLE_PIE_OPTION_TMPL,
  SIMPLE_LINE_OPTION_TMPL,
  LINE_AREA_COLORS,
  SIMPLE_LINE_BAR_OPTION_TMPL,
  SIMPLE_LINE_OPTION_NOXY_TMPL,
  SIMPLE_LINE_AREA_COLORS,
  PERCENT_PIE_OPTION_TMPL,
} from './template';

export default class InnerhandleOption {
  handlePercentPie = (data) => {
    let option = PERCENT_PIE_OPTION_TMPL;
    let series = [{ value: data.value || 0 }, { value: data.total - data.value }];
    series[0]['itemStyle'] = { color: data.color || '#FC4077' };
    series[1]['itemStyle'] = { color: '#EBEBEB' };
    option.series.data = series;
    console.log('handlePercentPie', option);
    // option
    return option;
  };

  handleSimplePie = (data) => {
    let option = SIMPLE_PIE_OPTION_TMPL;
    let colors = PIE_COLORS;
    let legendColors = {
      a: { fontSize: 15, color: '#1F242D' },
      b: { fontSize: 15, color: '#1F242D' },
    };
    let series = data.series;
    series &&
      series.forEach((item, index) => {
        item['itemStyle'] = { color: colors[index] };
      });
    let legend = [];
    data.showLegend &&
      data.series.forEach((item) => {
        legend.push(item['name']);
      });
    if (data.showLegend) {
      option.legend.formatter = function(name) {
        var target;
        for (var i = 0; i < series.length; i++) {
          if (name === series[i].name) {
            target = series[i].value + series[i].unit;
            // unit = series[i].unit;
            legendColors['c' + i] = { color: colors[i] };
          }
        }
        var arr = ['{a|' + ' ' + name + '     }' + '{b|' + target + '}'];
        return arr.join('\n');
      };
      option.legend.textStyle = {
        rich: legendColors,
      };
    }
    if (data.size && data.size === 'small') {
      console.log(data.size);
      option.series.radius = ['40%', '35%'];
    }
    option.series[0].data = series;
    if (data.seriesUnit) option.tooltip.formatter = `{a} <br/>{b}: {c}${data.seriesUnit}`;
    option.legend.data = legend;
    console.log('handleSimplePie', option);
    return option;
  };

  handleLines = (data) => {
    const lineColors = LINE_COLORS;
    const lineAreaAColors = LINE_AREA_COLORS;
    let option = SIMPLE_LINE_OPTION_TMPL;
    const { showArea } = data;

    let { sixMonthSheets } = data;
    const xArr = sixMonthSheets[0].monthItems.map((v) => v.yearMonth.replace('-', '.'));
    const seriesArr = sixMonthSheets.map((v, i) => {
      let obj = {
        name: v.name,
        type: 'line',
        //   symbol: 'none',
        symbolSize: 8,
        smooth: true,
        zlevel: 20,
        data: v.monthItems.map((val) => val.value),
        lineStyle: lineAreaAColors[i].lineStyle,
        //   areaStyle: lineAreaAColors[i].areaStyle,
      };
      if (showArea) obj = { ...obj, areaStyle: lineAreaAColors[i].areaStyle };

      return obj;
    });
    const legendArr = sixMonthSheets.map((v) => v.name);
    option.legend.data = legendArr;
    option.series = seriesArr;
    option.xAxis[0].data = xArr;
    option.color = lineColors;
    console.log(option);
    return option;
  };

  handleSimpleLine = (data) => {
    console.log('handleSimpleLine data', data);
    const index = data.type || 0;
    const lineColors = LINE_COLORS;
    const lineAreaAColors = SIMPLE_LINE_AREA_COLORS;
    let option = SIMPLE_LINE_OPTION_NOXY_TMPL;
    const xArr = data.data.map((v) => v.yearMonth.replace('-', '.'));
    let obj = {
      name: data.name,
      type: 'line',
      symbol: 'none',
      smooth: true,
      zlevel: 20,
      data: data.data.map((val) => +val.value),
      lineStyle: lineAreaAColors[index].lineStyle,
      areaStyle: lineAreaAColors[index].areaStyle,
    };
    option.series = obj;
    option.color = lineColors;
    option.xAxis.data = xArr;
    console.log('handleSimpleLine', option);
    return option;
  };

  handleLineBar = (data) => {
    const lineColors = LINE_COLORS;
    const lineAreaAColors = LINE_AREA_COLORS;
    let option = SIMPLE_LINE_BAR_OPTION_TMPL;

    let { sixMonthSheets } = data;
    const xArr = sixMonthSheets[0].monthItems.map((v) => v.yearMonth.replace('-', '.'));
    const seriesArr = sixMonthSheets.map((v, i) => {
      console.log(v);
      const obj1 = {
        // unitName: v.unitName,
        symbol: 'none',
        smooth: true,
        name: v.name,
        type: 'bar',
        zlevel: 1,
        data: v.monthItems.map((val) => +val.value),
      };
      const obj2 = {
        name: v.name,
        yAxisIndex: 1,
        type: 'line',
        symbol: 'none',
        // symbolSize:8,
        smooth: false,
        zlevel: 20,
        data: v.monthItems.map((val) => val.value),
        lineStyle: lineAreaAColors[i].lineStyle,
        //   areaStyle: lineAreaAColors[i].areaStyle,
      };
      return v.unitName === '%' ? obj2 : obj1;
    });
    const legendArr = sixMonthSheets.map((v) => v.name);
    option.legend.data = legendArr;
    option.series = seriesArr;
    option.xAxis[0].data = xArr;
    option.color = lineColors;

    return option;
  };
}
