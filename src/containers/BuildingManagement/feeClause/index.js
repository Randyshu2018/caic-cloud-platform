import React from 'react';
// import { Link } from 'react-router-dom';
import { Table, Form, Button, message } from 'antd';
import '../style/index.scss';
import BaseClause from './baseClause';
import BailType from './bailType';
import LeaseTerm from './leaseTerm';
import { events } from 'func';
import { observer, inject } from 'mobx-react';
import api from 'api';
import HxDetail from './hx-detail';
export const ContractTitle = ({ title, margin, right }) => (
  <div className="build-contract-title" style={{ marginTop: margin ? 20 : 0 }}>
    {title}
    <span style={{ float: 'right' }}>{right}</span>
  </div>
);
@inject('buildManage')
@observer
@Form.create()
class App extends React.Component {
  componentDidMount() {
    // console.log(this.props.buildManage);
    //获取form里面的数据
    events.on('getFormData', this.handleSubmit);
  }
  handleSubmit = (e) => {
    events.customerList = [];
    events.systemList = [];
    // e.preventDefault();
    // const { contractRooms } =
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      let { contractData } = events;
      const { billType, billAmount } = values;
      const arr = Object.entries(values);
      // contractData = {
      //   contract: {
      //     tenancyClauseList: [],
      //     billList: []
      //   }
      // }
      const contractRooms = contractData.contractRooms || [];
      const billAmountBzj = values['billAmount-bzj'] || '';
      const billDateBzj = values['billDate-bzj'] ? values['billDate-bzj'].format('YYYY-MM-DD') : '';
      if (!billAmountBzj || !billDateBzj) {
        message.info('请完善保证金条款信息');
        return;
      }
      let area = 0;
      contractRooms.forEach((v) => {
        area += +v.area;
      });
      contractData.contract.area = area;
      contractData.contract.deposit = billAmountBzj;
      const getArrFun = (str) => arr.filter((v) => v[0].includes(str));
      // const beginDateArr = getArrFun('beginDate-list-');
      // const endDateArr = getArrFun('endDate-list-');
      const arr1 = [];
      const arr2 = [];
      //设置全局的 租期条款类型
      events.zqtkType = billType;
      if (billType === 'customer') {
        const beginDateArr = getArrFun('beginDate-zdylist-');
        const endDateArr = getArrFun('endDate-zdylist-');
        const billDateArr = getArrFun('billDate-zdylist-');
        const billAmountArr = getArrFun('billAmount-zdylist-');
        beginDateArr.forEach((v, i) => {
          const endDateArri = endDateArr[i][1];
          const billDateArri = billDateArr[i][1];
          arr1.push({
            beginDate: v[1] ? v[1].format('YYYY-MM-DD') : '',
            endDate: endDateArri ? endDateArri.format('YYYY-MM-DD') : '',
            billDate: billDateArri ? billDateArri.format('YYYY-MM-DD') : '',
            billType: 'RENTAL',
            billAmount: billAmountArr[i][1] || 0,
          });
        });
        contractData.contract.billList = [
          {
            beginDate: arr1[0].beginDate,
            billAmount: values['billAmount-bzj'],
            endDate: arr1[arr1.length - 1].endDate,
            billType: 'DEPOSIT',
            billDate: billDateBzj,
          },
          ...arr1,
        ];
        contractData.contract.tenancyClauseList = [];
      } else {
        const beginDateArr = getArrFun('beginDate-list-');
        const endDateArr = getArrFun('endDate-list-');
        // let { zjDetailList } = events;
        const zjDetailList = events.zjDetailList || [];
        const dateType = getArrFun('dateType-list-');
        const paymentCycle = getArrFun('paymentCycle-list-');
        const tenancyWay = getArrFun('tenancyWay-list-');
        // let payDate = getArrFun('payDate-list-')
        const payDateDate = getArrFun('payDate-list-date-');
        const payDateInput = getArrFun('payDate-list-input-');
        // console.log(payDateDate,payDateInput)
        beginDateArr.forEach((v, i) => {
          let payDateStr;
          if (dateType[i][1] === 'ASSIGN') {
            // console.log(payDateDate[i])
            const payDateDatei = payDateDate.filter((v) => v[0] === `payDate-list-date-${i}`)[0][1];
            // const payDateDatei = payDateDate[i][1];
            payDateStr = payDateDatei ? payDateDatei.format('YYYY-MM-DD') : '';
          } else {
            const payDateInputi = payDateInput.filter(
              (v) => v[0] === `payDate-list-input-${i}`
            )[0][1];
            // console.log(payDateInputi)
            payDateStr = payDateInputi || '';
          }
          arr2.push({
            beginDate: v[1] ? v[1].format('YYYY-MM-DD') : '',
            dateType: dateType[i][1],
            endDate: endDateArr[i][1] ? endDateArr[i][1].format('YYYY-MM-DD') : '',
            paymentCycle: paymentCycle[i][1],
            tenancyWay: tenancyWay[i][1],
            clauseType: '系统生成账单',
            payDate: payDateStr,
          });
        });
        contractData.contract.billList = [
          {
            beginDate: arr2[0].beginDate,
            billAmount: values['billAmount-bzj'],
            endDate: arr2[arr2.length - 1].endDate,
            billType: 'DEPOSIT',
            billDate: billDateBzj,
          },
          ...zjDetailList,
        ];
        contractData.contract.tenancyClauseList = arr2;
      }
      events.contractData = contractData;
      // console.log(arr1, arr2)
      events.customerList = arr1;
      events.systemList = arr2;
    });
  };

  save = () => {
    events.emit('getFormData');
    const { contractData, zqtkType, customerList, systemList } = events;
    const arr = zqtkType === 'customer' ? customerList : systemList;
    if (arr.length === 0) {
      return;
    }
    const last = arr[arr.length - 1];
    for (let i in last) {
      if (!last[i]) {
        message.info('请完善必填信息项');
        return;
      }
    }
    if (zqtkType === 'system') {
      const billList = contractData.contract.billList || [];
      for (let i = 0; i < billList.length; i++) {
        const { billAmount, billDate } = billList[i];
        if (!billAmount || !billDate) {
          message.info('请完善租金明细报表中的信息');
          return;
        }
      }
      if (billList.length <= 1) {
        message.info('请先生成租金明细列表');
        return;
      }
    }

    // console.log(zqtkType, contractData);
    api.saveContract(contractData).then((res) => {
      if (res !== null) {
        message.success('保存成功');
        events.emit('saveContractNext');
      }
    });
  };
  back = () => {
    events.emit('openFeeTerms', { key: 1 });
  };
  componentWillUnmount() {
    events.removeListener('getFormData', this.handleSubmit);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { buildManage, isBlank } = this.props;
    const { contractData, contractDetail } = buildManage;
    // console.log(isBlank);
    const obj = isBlank ? contractData : contractDetail;
    let area = 0;
    (obj.contractRooms || []).map((v, i) => {
      area += +v.area;
    });
    // isBlank = true
    const totalArea = <span style={{ color: '#3B5EFE' }}>总面积：{area}㎡</span>;
    return (
      <React.Fragment>
        <Form layout="inline">
          <ContractTitle title="基本条款" right={totalArea} />
          <BaseClause isBlank={isBlank} />
          <ContractTitle title="保证金类型" margin />
          {isBlank && (
            <React.Fragment>
              <BailType getFieldDecorator={getFieldDecorator} />
              <ContractTitle title="租期条款" margin />
              <LeaseTerm getFieldDecorator={getFieldDecorator} />
              <div className="pl-10 mt-20">
                <Button onClick={this.back}>上一步</Button>
                <span className="pr-25" />
                <Button type="primary" onClick={this.save}>
                  保存
                </Button>
              </div>
            </React.Fragment>
          )}
          {!isBlank && <HxDetail />}
        </Form>
      </React.Fragment>
    );
  }
}
export default App;
