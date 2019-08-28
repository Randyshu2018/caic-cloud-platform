import React from 'react';
import { Link } from 'react-router-dom';
import VIEW from 'src/containers/Property/view';
import { Button, Alert, Input, Select, Radio, Form, message } from 'antd';
import YearDataServices from 'src/services/yearDataServices';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import './style.scss';
const Option = Select.Option;
const Item = Form.Item;

const initData = [
  {
    name: '收入',
    subName: '年度总目标',
    completedAmount: null,
    cutOffPeriod: null,
    total: {
      checked: true,
      value: null,
    },
    monthData: {
      checked: false,
      value: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
    },
  },
  {
    name: '成本',
    subName: '年度总目标',
    cutOffPeriod: null,
    completedAmount: null,
    total: {
      checked: true,
      value: null,
    },
    monthData: {
      checked: false,
      value: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
    },
  },
  {
    name: '利润',
    subName: '年度总目标',
    completedAmount: null,
    cutOffPeriod: null,
    total: {
      checked: true,
      value: null,
    },
    monthData: {
      checked: false,
      value: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
    },
  },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const formItemLayoutRow = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
const formItemLayoutTable = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

@VIEW
class View extends React.Component {
  state = {
    breadData: [{ name: '年度数据', path: '#' }],
    year: new Date().getFullYear(),
    lastROI: '',
    otherData: initData,
    yearSheetId: null,
    costYearSheetDataId: null,
    incomeYearSheetDataId: null,
    profitYearSheetDataId: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.assetProjectId != this.props.assetProjectId) {
      this.fetchQueryYearData(nextProps, this.state.year);
    }
  }

  componentDidMount() {
    this.fetchQueryYearData(this.props);
  }

  fetchQueryYearData = (nextProps, year = new Date().getFullYear()) => {
    const { assetProjectId } = nextProps;
    if (!assetProjectId) return {};
    // const { assetProjectId } = this.state;
    YearDataServices.fetchYearData({
      assetProjectId: assetProjectId,
      year: year,
    }).then((res) => {
      this.handlerQueryYearData(res);
    });
  };

  handlerQueryYearData = (data) => {
    if (!data) {
      this.setState({
        yearSheetId: null,
      });
      this.initOtherData();
      return;
    }
    this.setState({
      yearSheetId: data.yearSheetId,
    });
    const { lastROI, income, cost, profit } = data;
    let result = { lastROI: lastROI };
    this.setState({
      incomeYearSheetDataId: income && income.yearSheetDataId,
      costYearSheetDataId: cost && cost.yearSheetDataId,
      profitYearSheetDataId: profit && profit.yearSheetDataId,
    });
    if (income) {
      result = Object.assign({}, result, this.initzMonthData(0, income));
    }
    if (cost) {
      result = Object.assign({}, result, this.initzMonthData(1, cost));
    }
    if (profit) {
      result = Object.assign({}, result, this.initzMonthData(2, profit));
    }
    // console.log('result111',result);
    this.props.form.setFieldsValue(result);
  };

  initzMonthData = (i, data) => {
    let result = {};
    result[`total${i}`] = data.totalTargetAmount;
    const {
      one,
      two,
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
      ten,
      eleven,
      twelve,
    } = data.month;
    // const {one,twoq,threeq,fourq} = data.quarter;
    result[`rowMonth-${i}-${1}`] = one;
    result[`rowMonth-${i}-${2}`] = two;
    result[`rowMonth-${i}-${3}`] = three;
    result[`rowMonth-${i}-${4}`] = four;
    result[`rowMonth-${i}-${5}`] = five;
    result[`rowMonth-${i}-${6}`] = six;
    result[`rowMonth-${i}-${7}`] = seven;
    result[`rowMonth-${i}-${8}`] = eight;
    result[`rowMonth-${i}-${9}`] = nine;
    result[`rowMonth-${i}-${10}`] = ten;
    result[`rowMonth-${i}-${11}`] = eleven;
    result[`rowMonth-${i}-${12}`] = twelve;
    result[`rowQuarter-${i}-${0}`] = data.quarter.one;
    result[`rowQuarter-${i}-${1}`] = data.quarter.two;
    result[`rowQuarter-${i}-${2}`] = data.quarter.three;
    result[`rowQuarter-${i}-${3}`] = data.quarter.four;
    result[`done${i}`] = data.completedAmount;
    result[`month${i}`] = data.cutOffPeriod;
    return result;
  };

  initOtherData = () => {
    let result = { lastROI: '' };
    for (let i = 0; i < 3; i++) {
      result[`total${i}`] = '';
      for (let j = 0; j < 12; j++) {
        result[`rowMonth-${i}-${j + 1}`] = '';
        if (j < 4) {
          result[`rowQuarter-${i}-${j}`] = '';
        }
      }
    }
    this.props.form.setFieldsValue(result);
  };

  radioChangeClick = (type, index) => {
    const otherData = this.state.otherData;
    if (type === 'month') {
      otherData[index].total.checked = false;
      otherData[index].monthData.checked = true;
    }
    if (type === 'year') {
      otherData[index].total.checked = true;
      otherData[index].monthData.checked = false;
    }

    this.setState({ otherData: otherData });
  };

  onChangeInputValue = (value, k, k1, index, rowIndex) => {
    // console.log('value',value.target.value,'k',k,'k1',k1,'index',index);
    value = value.target.value;
    this.props.form.validateFields((err, values) => {
      let total = 0;
      let rowQuarter = 0;
      if (!value) {
        value = 0;
      }
      for (let i = 1; i < 13; i++) {
        //  console.log('========rowIndex',rowIndex,'i',i);
        if (rowIndex === i) {
          //    console.log('=====000===='+values[`rowMonth-${k}-${rowIndex}`]);
          total = +total + +value;
        } else {
          let tmp = 0;
          if (values[`rowMonth-${k}-${i}`]) {
            tmp = +values[`rowMonth-${k}-${i}`];
          }
          total = total + tmp;
        }
      }
      for (let i = k1 * 3 + 1; i < k1 * 3 + 4; i++) {
        //   console.log('--------rowIndex',rowIndex,'i',i);
        if (rowIndex === i) {
          rowQuarter = +rowQuarter + +value;
        } else {
          let tmp = 0;
          if (values[`rowMonth-${k}-${i}`]) {
            tmp = +values[`rowMonth-${k}-${i}`];
          }
          rowQuarter = rowQuarter + tmp;
        }
      }
      //   console.log('total',total);

      values[`total${k}`] = total.toFixed(2);
      values[`rowQuarter-${k}-${k1}`] = rowQuarter.toFixed(2);
      //   console.log('values',values);
      this.props.form.setFieldsValue(values);
    });
  };

  onChangeTotalInputValue = (value, formName) => {
    value = value.target.value;
    if (!value) {
      return;
    }
    let index = 0;
    formName == 'total0' ? (index = 0) : '';
    formName == 'total1' ? (index = 1) : '';
    formName == 'total2' ? (index = 2) : '';
    let tmpQuarter = (value / 4).toFixed(2);
    let tmpMonth = (value / 12).toFixed(2);

    this.props.form.validateFields((err, values) => {
      for (let i = 1; i < 13; i++) {
        values[`rowMonth-${index}-${i}`] = tmpMonth;
      }
      for (let i = 0; i < 4; i++) {
        values[`rowQuarter-${index}-${i}`] = tmpQuarter;
      }
      this.props.form.setFieldsValue(values);
    });
  };

  renderOtherCompontent = () => {
    const { getFieldDecorator } = this.props.form;
    const { otherData } = this.state;
    const renderDom = otherData.map((item, k) => (
      <div className="other-item" key={k}>
        <div className="item-title-block">
          <div className="block-title">{`${item.name}(${item.subName})`}</div>
        </div>
        <div className="item-content-block">
          <div className="item-block">
            <div className="item-checkbox">
              <span className="radio-left">
                <Radio
                  checked={item.total.checked}
                  onChange={() => this.radioChangeClick('year', k)}
                />
              </span>
              {this.renderInputItemCompontent(
                '按年汇总录入',
                item.total.value,
                '元',
                'total' + k,
                '数据不能为空',
                !item.total.checked
              )}
              <span className="radio-right">
                <Radio
                  checked={item.monthData.checked}
                  onChange={() => this.radioChangeClick('month', k)}
                >
                  按月细分录入
                </Radio>
              </span>
              {/* <span></span> */}
            </div>
          </div>
          <div className="item-block block-right">
            {this.renderInputItemCompontent(
              '当前已完成',
              item.completedAmount,
              '元',
              'done' + k,
              '当前已完成不能为空',
              false,
              false
            )}
            {this.renderInputItemCompontent(
              '截止月份',
              item.cutOffPeriod,
              '月',
              'month' + k,
              '当前截止月份不能为空',
              false,
              false
            )}
          </div>
        </div>
        {
          <div className="item-content-list">
            {item.monthData.value.map((item1, k1) => {
              const months = ['一', '二', '三', '四'];
              return (
                <div className="row" key={k1}>
                  <Item {...formItemLayoutTable} label={`${months[k1]}季度总额（元):`}>
                    {getFieldDecorator(`rowQuarter-${k}-${k1}`, {
                      rules: [
                        {
                          required: item.monthData.checked ? true : false,
                          message: `${months[k1]}季度总额不能为空`,
                        },
                        {
                          required: false,
                          pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                          message: '只能为数字',
                        },
                      ],
                      initialValue: item1[0],
                    })(<Input placeholder="0.00" disabled={true} />)}
                  </Item>
                  <Item {...formItemLayoutRow} label={`${k1 * 3 + 1}月（元):`}>
                    {getFieldDecorator(`rowMonth-${k}-${k1 * 3 + 1}`, {
                      rules: [
                        {
                          required: item.monthData.checked ? true : false,
                          message: `${k1 * 3 + 1}月不能为空`,
                        },
                        {
                          required: false,
                          pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                          message: '只能为数字',
                        },
                      ],
                      initialValue: item1[1],
                    })(
                      <Input
                        placeholder="请输入"
                        disabled={item.monthData.checked ? false : true}
                        onChange={(value) => this.onChangeInputValue(value, k, k1, 1, k1 * 3 + 1)}
                      />
                    )}
                  </Item>
                  <Item {...formItemLayoutRow} label={`${k1 * 3 + 2}月（元):`}>
                    {getFieldDecorator(`rowMonth-${k}-${k1 * 3 + 2}`, {
                      rules: [
                        {
                          required: item.monthData.checked ? true : false,
                          message: `${k1 * 3 + 2}月不能为空`,
                        },
                        {
                          required: false,
                          pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                          message: '只能为数字',
                        },
                      ],
                      initialValue: item1[2],
                    })(
                      <Input
                        placeholder="请输入"
                        disabled={item.monthData.checked ? false : true}
                        onChange={(value) => this.onChangeInputValue(value, k, k1, 2, k1 * 3 + 2)}
                      />
                    )}
                  </Item>
                  <Item {...formItemLayoutRow} label={`${k1 * 3 + 3}月（元):`}>
                    {getFieldDecorator(`rowMonth-${k}-${k1 * 3 + 3}`, {
                      rules: [
                        {
                          required: item.monthData.checked ? true : false,
                          message: `${k1 * 3 + 3}月不能为空`,
                        },
                        {
                          required: false,
                          pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                          message: '只能为数字',
                        },
                      ],
                      initialValue: item1[3],
                    })(
                      <Input
                        placeholder="请输入"
                        disabled={item.monthData.checked ? false : true}
                        onChange={(value) => this.onChangeInputValue(value, k, k1, 3, k1 * 3 + 3)}
                      />
                    )}
                  </Item>
                </div>
              );
            })}
          </div>
        }
      </div>
    ));

    return renderDom;
  };

  renderInputItemCompontent = (
    name,
    defaultValue,
    unit,
    formName,
    errorMsg,
    disabled = false,
    required = true
  ) => {
    const { getFieldDecorator } = this.props.form;
    if (required) {
      return (
        <div className="input-item">
          <Item {...formItemLayout} label={name}>
            {getFieldDecorator(formName, {
              rules: [
                { required: disabled ? false : true, message: errorMsg },
                {
                  required: false,
                  pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                  message: '只能为数字',
                },
              ],
              initialValue: defaultValue,
            })(
              <Input
                placeholder="请输入"
                addonAfter={unit}
                disabled={disabled}
                onChange={(value) => this.onChangeTotalInputValue(value, formName)}
              />
            )}
          </Item>
        </div>
      );
    }

    return (
      <div className="input-item">
        <Item {...formItemLayout} label={name}>
          {getFieldDecorator(formName, {
            initialValue: defaultValue,
          })(<Input placeholder="请输入" addonAfter={unit} disabled={disabled} />)}
        </Item>
      </div>
    );
  };

  renderContentTopCompontent = (name) => {
    return (
      <div className="content-top">
        <div className="block-title">{name}</div>
        {/* <div className="block-button" onClick={this.handleSubmit}>
          保 存
        </div> */}
        <Button className="theme-btn-1" onClick={this.handleSubmit} icon="save">
          保存
        </Button>
      </div>
    );
  };

  renderContentDatePickerCompontent = () => {
    const currentYear = new Date().getFullYear();
    return (
      <Select defaultValue={currentYear} style={{ width: 150 }} onChange={this.onChangePickerYear}>
        <Option value={currentYear - 2}>{`${currentYear - 2}年`}</Option>
        <Option value={currentYear - 1}>{`${currentYear - 1}年`}</Option>
        <Option value={currentYear}>{`${currentYear}年`}</Option>
        <Option value={currentYear + 1}>{`${currentYear + 1}年`}</Option>
        <Option value={currentYear + 2}>{`${currentYear + 2}年`}</Option>
      </Select>
    );
  };

  onChangePickerYear = (year) => {
    // console.log('year', year);
    // if (this.state.year !== year) {
    this.setState(
      {
        year: year,
        incomeYearSheetDataId: null,
        costYearSheetDataId: null,
        profitYearSheetDataId: null,
      },
      () => this.fetchQueryYearData(this.props, year)
    );
    //   this.setState({ year: year }, () => this.fetchQueryYearData(this.props, year));
    // }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let that = this;
    this.props.form.validateFields((err, values) => {
      const {
        year,
        otherData,
        incomeYearSheetDataId,
        costYearSheetDataId,
        profitYearSheetDataId,
      } = that.state;
      //   console.log('values', values);
      if (!err) {
        let incomeData = this.widegetListData('INCOME', values);
        let costData = this.widegetListData('COST', values);
        let profitData = this.widegetListData('PROFIT', values);

        const income = Object.assign(
          {},
          {
            totalTargetAmount: values['total' + 0],
            completedAmount: values['done' + 0],
            cutOffPeriod: values['month' + 0],
            yearSheetDataId: incomeYearSheetDataId,
            type: 'INCOME',
          },
          incomeData
        );
        const cost = Object.assign(
          {},
          {
            totalTargetAmount: values['total' + 1],
            completedAmount: values['done' + 1],
            cutOffPeriod: values['month' + 1],
            yearSheetDataId: costYearSheetDataId,
            type: 'COST',
          },
          costData
        );

        const profit = Object.assign(
          {},
          {
            totalTargetAmount: values['total' + 2],
            completedAmount: values['done' + 2],
            cutOffPeriod: values['month' + 2],
            yearSheetDataId: profitYearSheetDataId,
            type: 'PROFIT',
          },
          profitData
        );

        // !this.state.yearSheetId ? message.error('yearSheetId不能为空'):'';

        const { name, assetProjectDto } = this.props.$$sideProjects;
        console.log(this.props.$$sideProjects);

        const result = {
          assetProjectName: name,
          assetProjectId: assetProjectDto.id,
          yearSheetId: this.state.yearSheetId,
          year: year,
          lastROI: values.lastROI,
          income: income,
          cost: cost,
          profit: profit,
        };
        YearDataServices.fetchQueryDataSave(result).then((res) => {
          if (!res) {
            return;
          }
          if (res && res.responseCode === '000') {
            message.success('数据保存成功');
            this.fetchQueryYearData(this.props, this.state.year);
            return;
          }
          message.error((res && res.responseMsg) || '数据保存失败');
        });
        return;
      }
      message.info('请填完数据再保存');
    });
  };

  widegetListData = (type, values) => {
    let index = 0;
    type === 'INCOME' ? (index = 0) : '';
    type === 'COST' ? (index = 1) : '';
    type === 'PROFIT' ? (index = 2) : '';
    return {
      quarter: {
        one: values[`rowQuarter-${index}-0`],
        two: values[`rowQuarter-${index}-1`],
        three: values[`rowQuarter-${index}-2`],
        four: values[`rowQuarter-${index}-3`],
      },
      month: {
        one: values[`rowMonth-${index}-1`],
        two: values[`rowMonth-${index}-2`],
        three: values[`rowMonth-${index}-3`],
        four: values[`rowMonth-${index}-4`],
        five: values[`rowMonth-${index}-5`],
        six: values[`rowMonth-${index}-6`],
        seven: values[`rowMonth-${index}-7`],
        eight: values[`rowMonth-${index}-8`],
        nine: values[`rowMonth-${index}-9`],
        ten: values[`rowMonth-${index}-10`],
        eleven: values[`rowMonth-${index}-11`],
        twelve: values[`rowMonth-${index}-12`],
      },
    };
  };

  render() {
    const { lastROI } = this.state;
    const { projectId, selectSideProject } = this.props.$$sideProjects;
    const { assetProjectId, assetProjectName } = this.props;
    if (!assetProjectId) {
      return (
        <Alert
          message="提示"
          description={
            <span>
              请先添加项目资管信息,才能进行此操作
              <Link to="/property/info" style={{ marginLeft: '20px' }}>
                点击添加
              </Link>
            </span>
          }
          type="info"
          showIcon
        />
      );
    }
    return (
      <React.Fragment>
        <Breadcrumb breadData={this.state.breadData} />
        <div className="year-data-container">
          <div className="title-block">
            {this.renderContentTopCompontent(`项目名称：${assetProjectName}`)}
            {this.renderContentDatePickerCompontent()}
          </div>
          <Form>
            <div className="other-item rol-item">
              <div className="item-title-block">
                <div className="block-title">{`投资回报率`}</div>
              </div>
              <div className="item-content-block rol-content-block">
                {this.renderInputItemCompontent(
                  '上一年投资回报率：',
                  lastROI,
                  '%',
                  'lastROI',
                  '投资回报率不能为空',
                  false,
                  false
                )}
              </div>
            </div>
            {this.renderOtherCompontent()}
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create()(View);
