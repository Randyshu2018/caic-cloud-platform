export default (x, y) => {
  return {
    textStyle: {
      color: '#B1BBC3',
    },
    grid: {
      top: 50,
      left: 30,
      right: 30,
      bottom: 20,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },

    xAxis: {
      type: 'category',
      data: x,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },

      axisPointer: {
        type: 'shadow',
      },
      nameTextStyle: {
        // color: '#999999',
        fontSize: '10',
      },
      boundaryGap: ['20%', '20%'],
      axisLabel: {
        // color: '#999999',
        fontSize: '10',
        // rotate: 40,
        // show: false,
      },
    },
    yAxis: {
      type: 'value',
      // name: '单位:㎡',
      // show:false,
      axisLine: {
        show: false,
      },
      nameTextStyle: {
        // color: '#666666',
        fontSize: '10',
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
        // color: '#999999',
        fontSize: '10',
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EFF3F8',
        },
      },
    },
    legend: {
      itemHeight: 4,
      itemWidth: 12,
      textStyle: {
        color: '#939FA9',
        fontSize: 10,
      },
      orient: 'vertical',
      right: 10,
      // data:['当月到期合同数'],
      // selected: {
      //     '当月到期合同数' : false,
      //     //不想显示的都设置成false
      // }
    },
    series: [
      {
        name: '当月到期合同数',
        type: 'bar',
        // barWidth: '40',
        data: y,
        // label: {
        //   normal: {
        //       show: true
        //   },
        //   emphasis: {
        //       show: true
        //   }
        // },
      },
    ],
    color: ['#187DE8'],
    barWidth: '22',
  };
};
