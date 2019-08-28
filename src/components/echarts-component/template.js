export const LINE_AREA_COLORS = [
  {
    lineStyle: {
      color: '#39A5FC',
      width: 6,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(80, 132, 255, 0.3)', // 50% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(80, 132, 255, 0.1)', // 0% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
  {
    lineStyle: {
      color: '#FFB86B',
      width: 6,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(255, 184, 107, 0.6)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(255, 184, 107, 0.1)', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
  {
    lineStyle: {
      color: '#0CD79F',
      width: 6,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(12, 215, 159, 0.3)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(12, 215, 159, 0.1)', // 0% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
];

export const SIMPLE_LINE_AREA_COLORS = [
  {
    lineStyle: {
      color: '#39A5FC',
      width: 2,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(80, 132, 255, 0.3)', // 50% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(80, 132, 255, 0.1)', // 0% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
  {
    lineStyle: {
      color: '#FFB86B',
      width: 2,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(255, 184, 107, 0.6)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(255, 184, 107, 0.1)', // 100% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
  {
    lineStyle: {
      color: '#0CD79F',
      width: 2,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(12, 215, 159, 0.3)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(12, 215, 159, 0.1)', // 0% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
  {
    lineStyle: {
      color: '#ffffff',
      width: 2,
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0,
            color: 'rgba(255, 255, 255, 0.3)', // 0% 处的颜色
          },
          {
            offset: 1,
            color: 'rgba(255, 255, 255, 0.1)', // 0% 处的颜色
          },
        ],
        global: false, // 缺省为 false
      },
    },
  },
];

export const PIE_COLORS = ['#F94B7E', '#00E4A5', '#4D7BFE', '#8065FF', '#F5A623'];

export const LINE_COLORS = ['#39A5FC', '#FFB86B', '#00E4A5'];

export const BAR_COLORS = ['#39A5FC', '#FFB86B', '#00E4A5'];

const TMPL_TEXTTYPE = {
  color: '#333333',
};
const TMPL_TOOLTIP = {
  trigger: 'axis',
  formatter: function(params) {
    let relVal = params[0].name;
    for (let i = 0, l = params.length; i < l; i++) {
      if (params[i].seriesType === 'bar') {
        relVal +=
          '<br/>' +
          params[i].seriesName +
          ' : ' +
          (params[i].value || params[i].value === 0
            ? parseFloat(params[i].value).toFixed(2) + '万'
            : '-');
      } else {
        relVal +=
          '<br/>' +
          params[i].seriesName +
          ' : ' +
          (params[i].value || params[i].value === 0
            ? parseFloat(params[i].value).toFixed(2) + '%'
            : '-');
      }
    }
    return relVal;
  },
};

const TMPL_DATAZOOM = [
  {
    // show: true, //是否显示下方滚动条
    show: false, //是否显示下方滚动条
    realtime: true,
    start: 0, //显示数据开始位置
    // end: 50, //显示数据结束位置
    end: 100, //显示数据结束位置
    filterMode: 'empty',
  },
  {
    id: 'dataZoomX',
    show: true, //是否显示下方滚动条
    type: 'inside',
    realtime: true,
    start: 0,
    end: 50,
    xAxisIndex: [0],
    // filterMode: 'filter',
    zoomLock: true,
    filterMode: 'empty',
  },
];

const TMPL_LEGEND = {
  itemHeight: 12,
  itemWidth: 12,
  icon: 'circle',
  bottom: 0,
  // data: ['利润总额', '成本费用', '成本费用率'],
  data: [],
  textStyle: {
    color: '#2B3B4D',
    fontSize: 14,
  },
};

const TMPL_LEGEND_RIGHT = {
  orient: 'vertical',
  x: 'right',
  top: 'middle',
  align: 'left',
  padding: [5, 30, 5, 5],
  itemWidth: 8,
  itemHeight: 8,
  textStyle: { fontSize: '14px', color: '#333333' },
  data: [],
};
const TMPL_LEGEND_RIGHT_TOP = {
  ...TMPL_LEGEND,
  bottom: 'auto',
  top: 10,
  right: 10,
};

const TMPL_XAXIS = [
  {
    type: 'category',
    data: [],
    axisPointer: {
      type: 'shadow',
    },
    nameTextStyle: {
      // color: '#999999',
      fontSize: '10',
    },
    boundaryGap: ['20%', '20%'],
    axisLabel: {
      color: '#828BAA',
      fontSize: '14',
      fontWeight: '300',
      // rotate: 40,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
];

const TMPL_YAXIS_LEFT = {
  type: 'value',
  name: '单位：万元',
  zlevel: 1,
  nameTextStyle: {
    color: '#828BAA',
    fontSize: '14',
    // align: 'left',
    rich: {
      a: {
        align: 'right',
      },
    },
    padding: [0, 0, 0, 0],
  },
  axisLabel: {
    formatter: '{value}',
    color: '#465481',
    fontSize: '15',
  },
  axisLine: {
    show: false,
  },
  axisTick: {
    show: false,
  },
  splitLine: {
    show: true,
    lineStyle: {
      color: '#EAEDF5',
    },
  },
};

const TMPL_YAXIS_RIGHT = {
  type: 'value',
  axisTick: {
    show: false,
  },
  // scale: true,
  // max: 100,
  // min: 0,
  zlevel: 20,
  name: '单位:%',
  nameTextStyle: {
    color: '#828BAA',
    fontSize: 14,
    align: 'right',
    padding: [0, 0, 0, 40],
  },
  axisLine: {
    show: false,
  },
  splitLine: {
    show: false,
    lineStyle: {
      color: '#66E7FF',
    },
  },
  axisLabel: {
    color: '#465481',
    fontSize: 15,
  },
};

const TMPL_GRID_TOP = {
  top: '20%',
  //   containLabel: true,
};

const TMPL_SERIES = [
  {
    name: '',
    type: 'pie',
    radius: ['40%', '65%'],
    // center: ['30%', '50%'],
    avoidLabelOverlap: false,
    itemStyle: {
      // 此配置
      normal: {
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    },
    label: {
      normal: {
        show: false,
        position: 'center',
      },
      emphasis: {
        show: false,
      },
    },
    labelLine: {
      normal: {
        show: false,
      },
    },
    data: [],
  },
];

export const SIMPLE_LINE_OPTION_NOXY_TMPL = {
  //   textStyle: TMPL_TEXTTYPE,
  tooltip: TMPL_TOOLTIP,
  dataZoom: TMPL_DATAZOOM,
  legend: TMPL_LEGEND,
  xAxis: { ...TMPL_XAXIS[0], show: false },
  yAxis: { ...TMPL_YAXIS_LEFT, show: false },
  series: [],
  color: [],
};

export const SIMPLE_LINE_OPTION_TMPL = {
  textStyle: TMPL_TEXTTYPE,
  tooltip: TMPL_TOOLTIP,
  dataZoom: TMPL_DATAZOOM,
  legend: TMPL_LEGEND_RIGHT_TOP,
  xAxis: TMPL_XAXIS,
  yAxis: TMPL_YAXIS_LEFT,
  grid: TMPL_GRID_TOP,
  series: [],
  color: [],
};

export const SIMPLE_LINE_BAR_OPTION_TMPL = {
  textStyle: TMPL_TEXTTYPE,
  tooltip: TMPL_TOOLTIP,
  dataZoom: TMPL_DATAZOOM,
  legend: TMPL_LEGEND_RIGHT_TOP,
  xAxis: TMPL_XAXIS,
  yAxis: [TMPL_YAXIS_LEFT, TMPL_YAXIS_RIGHT],
  series: [],
  barWidth: '17',
  grid: TMPL_GRID_TOP,
  color: [],
};
export const SIMPLE_PIE_OPTION_TMPL = {
  tooltip: {
    trigger: 'item',
    //   formatter: '{a} <br/>{b}: {c} ({d})',
  },
  legend: TMPL_LEGEND,
  series: TMPL_SERIES,
};

export const PERCENT_PIE_OPTION_TMPL = {
  series: TMPL_SERIES[0],
};

export const SIMPLE_PIE_OPTION_RIGHT_TMPL = {
  ...SIMPLE_LINE_BAR_OPTION_TMPL,
  legend: TMPL_LEGEND_RIGHT,
};
