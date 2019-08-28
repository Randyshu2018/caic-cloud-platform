/**
 * Created by summer on 2018/11/22.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Modal, Icon, Button, message } from 'antd';
import { isEmpty } from 'lodash';

import EBreadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import CalendarIcon from '../../components/Icon/CalendarIcon';
import TableIcon from '../../components/Icon/TableIcon';
import { request, api } from '../../modules/request';
import { getStorage, getStorageObj, queryURLParameter } from '../../modules/utils';
import './TaskDataAnalyse.scss';

const TableTitle = ({ title }) => (
  <div className="Table-title">
    <span>{title}</span>
  </div>
);

const TableWrap = ({ columns, dataSource }) => (
  <div className="Table">
    <Table columns={columns} dataSource={dataSource} pagination={false} bordered />
  </div>
);

const tableOneTitle = [
  {
    title: '收入(万元)',
    dataIndex: 'income',
    key: 'income',
  },
  {
    title: '支出(万元)',
    dataIndex: 'expenditure',
    key: 'expenditure',
  },
  {
    title: '净利润(万元)',
    dataIndex: 'netProfit',
    key: 'netProfit',
  },
  {
    title: '净利率(%)',
    dataIndex: 'netProfitMargin',
    key: 'netProfitMargin',
  },
  {
    title: '投资回报率(%)',
    dataIndex: 'returnOnInvestmentMargin',
    key: 'returnOnInvestmentMargin',
  },
];

const tableTwoTitle = [
  {
    title: '净资产收益率(％)',
    dataIndex: 'returnOnEquityMargin',
    key: 'returnOnEquityMargin',
  },
  {
    title: '主营业务净利率(％)',
    dataIndex: 'mainBusinessNetProfitMargin',
    key: 'mainBusinessNetProfitMargin',
  },
  {
    title: '总资产利润率(％)',
    dataIndex: 'totalAssetProfitMargin',
    key: 'totalAssetProfitMargin',
  },
];

const tableThreeTitle = [
  {
    title: '流动比率(％)',
    dataIndex: 'currentRatio',
    key: 'currentRatio',
  },
  {
    title: '速动比率(％)',
    dataIndex: 'quickRatio',
    key: 'quickRatio',
  },
  {
    title: '现金比率(％)',
    dataIndex: 'cashRatio',
    key: 'cashRatio',
  },
  {
    title: '资产负债率(％)',
    dataIndex: 'balanceRatio',
    key: 'balanceRatio',
  },
  {
    title: '产权比率(％)',
    dataIndex: 'equityRatio',
    key: 'equityRatio',
  },
];

const ruleModalTableTitle = [
  {
    title: '明细',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '计算公式',
    dataIndex: 'value',
    key: 'value',
  },
];

const cochainModalTableTitle = [
  {
    title: '被授权人姓名',
    dataIndex: 'alicenseName',
    width: 120,
    key: 'alicenseName',
  },
  {
    title: '运营数据',
    dataIndex: 'bizDataSheet',
    key: 'bizDataSheet',
    width: 70,
    render: (value) => (value ? <Icon type="check" /> : <Icon type="minus" />),
  },
  {
    title: '资产负债表',
    dataIndex: 'cbalanceSheet',
    key: 'cbalanceSheet',
    width: 70,
    render: (value) => (value ? <Icon type="check" /> : <Icon type="minus" />),
  },
  {
    title: '现金流量表',
    dataIndex: 'dcashFlowSheet',
    key: 'dcashFlowSheet',
    width: 70,
    render: (value) => (value ? <Icon type="check" /> : <Icon type="minus" />),
  },
  {
    title: '利润表',
    dataIndex: 'profitSheet',
    key: 'profitSheet',
    width: 70,
    render: (value) => (value ? <Icon type="check" /> : <Icon type="minus" />),
  },
];

class TaskDataAnalyse extends Component {
  state = {
    breadData: [
      {
        path:
          '/task/detail/' +
          this.props.match.params.projectId +
          '?date=' +
          queryURLParameter().date +
          '&assetType=' +
          queryURLParameter().assetType,
        name: '详情',
      },
      {
        path: '/task/analyse',
        name: '数据分析',
      },
    ],
    tableOneData: [],
    tableTwoData: [],
    tableThreeData: [],
    ruleModalVisible: false,
    cochainModalVisible: false,
    modalTableOneData: [],
    modalTableTwoData: [],
    modalTableThreeData: [],
    cochainTableData: [],
    selectedRowKeys: [],
    projectName: '',
    postParams: {},
    date: queryURLParameter().date,
    taskId: Number(queryURLParameter().taskId),
    projectId: this.props.match.params.projectId,
    up2chainLoading: false,
    isOnChainStatus: false,
  };

  componentDidMount() {
    this.fetchAnalyseData();
    this.fetchAnalyseRuleData();
    this.fetchChainMemberData();
  }

  setRuleModalVisible = (ruleModalVisible) => {
    this.setState({ ruleModalVisible });
  };

  setCochainModalVisible = (cochainModalVisible) => {
    this.setState({ cochainModalVisible });
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  fetchAnalyseData = () => {
    const params = {
      taskId: this.state.taskId,
    };
    request
      .get(api.TASK_ANALYSE_API, params)
      .then((res) => {
        if (!!res.data) {
          res.data.benefit[0].key = 0;
          res.data.profitability[0].key = 0;
          res.data.solvency[0].key = 0;
          this.setState({
            tableOneData: res.data.benefit,
            tableTwoData: res.data.profitability,
            tableThreeData: res.data.solvency,
          });
        }
      })
      .catch((e) => {
        if (e.responseCode === 'operator42') {
          this.setState({
            isOnChainStatus: true,
          });
        } else {
          console.log(e);
        }
      });
  };

  fetchAnalyseRuleData = () => {
    request
      .get(api.TASK_ANALYSE_RULE_API, {
        taskId: this.state.taskId,
      })
      .then((res) => {
        if (!!res.data) {
          this.setState({
            modalTableOneData: res.data.benefit,
            modalTableTwoData: res.data.profitability,
            modalTableThreeData: res.data.solvency,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  fetchChainMemberData = () => {
    const { projectId, date } = this.state;
    const { merchantId } = this.props;
    request
      .get(api.TASK_CHAIN_MEMBER_API, {
        merchantId: merchantId || getStorage('merchantId'),
        projectId,
        dateMonth: date,
      })
      .then((res) => {
        if (!!res.data) {
          let arr = [];
          const table = isEmpty(res.data.members)
            ? []
            : res.data.members.map((t, index) => {
                let obj = {
                  key: index,
                  alicenseName: t.licenseName,
                  bizDataSheet: t.sheetItem.bizDataSheet,
                  cbalanceSheet: t.sheetItem.balanceSheet,
                  dcashFlowSheet: t.sheetItem.cashFlowSheet,
                  profitSheet: t.sheetItem.profitSheet,
                  mobile: t.mobile,
                  authId: t.authId,
                };
                arr.push(index);
                return obj;
              });
          this.setState({
            projectName: res.data.project.name,
            cochainTableData: table,
            selectedRowKeys: arr,
            postParams: {
              merchantId: res.data.merchant.id,
              projectId: res.data.project.id,
              dateMonth: date,
            },
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  postUp2chain = () => {
    const { selectedRowKeys, cochainTableData, postParams } = this.state;
    const { loginAccount: { member: { memberId: operatorId } = {} } = {} } = getStorageObj('user');

    let memberList = [];
    if (selectedRowKeys.length > 0) {
      memberList = selectedRowKeys.map((key) => cochainTableData[key]).map((item) => {
        return {
          authId: item.authId,
          mobile: item.mobile,
          bizDataSheetIf: true,
          balanceSheetIf: true,
          cashFlowSheetIf: true,
          profitSheetIf: true,
        };
      });
    }
    const params = {
      merchantId: postParams.merchantId,
      projectId: postParams.projectId,
      dateMonth: postParams.dateMonth,
      operatorId,
      memberList,
    };
    this.setState({
      up2chainLoading: true,
    });
    request
      .post(api.TASK_CHAIN_UP2CHAIN_API, params)
      .then((res) => {
        this.setState({
          up2chainLoading: false,
        });
        if (!!res.data) {
          message.success('上链成功！');
          this.setCochainModalVisible(false);
          this.fetchAnalyseData();
        } else {
          message.error('上链失败！');
        }
      })
      .catch((e) => {
        this.setState({
          up2chainLoading: false,
        });
        message.error(`上链失败(${e.responseMsg || ''})`);
      });
  };

  render() {
    const {
      date,
      projectName,
      ruleModalVisible,
      cochainModalVisible,
      breadData,
      tableOneData,
      tableTwoData,
      tableThreeData,
      modalTableOneData,
      modalTableTwoData,
      modalTableThreeData,
      cochainTableData,
      selectedRowKeys,
      up2chainLoading,
    } = this.state;
    if (!tableOneData) {
      return null;
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="task-data-analyse-wrapper">
        <EBreadcrumb breadData={breadData} />
        <div className="Filter">
          <div className="Filter__title">
            <div>
              <span>{projectName}</span>
              <a
                className="Filter__title__rule"
                onClick={(e) => {
                  e.preventDefault();
                  this.setRuleModalVisible(true);
                }}
              >
                查看计算规则
              </a>
            </div>
            {this.state.isOnChainStatus ? (
              <Button type="primary" disabled>
                数据已上链
              </Button>
            ) : (
              <div
                className="Filter__title__btn"
                onClick={(e) => {
                  e.preventDefault();
                  this.setCochainModalVisible(true);
                }}
              >
                <TableIcon />
                确认上链
              </div>
            )}
          </div>
          <div className="Filter__calendar">
            <CalendarIcon />
            <span>{`${date.split('-')[0]}年${date.split('-')[1]}期`}</span>
          </div>
        </div>
        <TableTitle title="收益分析" />
        <TableWrap columns={tableOneTitle} dataSource={tableOneData} />
        <TableTitle title="盈利能力分析" />
        <TableWrap columns={tableTwoTitle} dataSource={tableTwoData} />
        <TableTitle title="偿债能力分析" />
        <TableWrap columns={tableThreeTitle} dataSource={tableThreeData} />
        <Modal
          title="分析数据计算 规则"
          centered
          width="70%"
          visible={ruleModalVisible}
          onCancel={() => this.setRuleModalVisible(false)}
          footer={null}
        >
          <TableTitle title="收益分析" />
          <TableWrap columns={ruleModalTableTitle} dataSource={modalTableOneData} />
          <TableTitle title="盈利能力分析" />
          <TableWrap columns={ruleModalTableTitle} dataSource={modalTableTwoData} />
          <TableTitle title="偿债能力分析" />
          <TableWrap columns={ruleModalTableTitle} dataSource={modalTableThreeData} />
        </Modal>
        <Modal
          title=""
          centered
          width="70%"
          visible={cochainModalVisible}
          onCancel={() => this.setCochainModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => this.setCochainModalVisible(false)}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={up2chainLoading}
              onClick={this.postUp2chain}
            >
              确认上链
            </Button>,
          ]}
        >
          <div className="Cochain-modal">
            <h3>确认被授权人信息</h3>
            <p>
              请确认运营主体是否变更，如有变更可在当前页面修改，本期上链数据会在秋实链app端对以下用户开放，可在当前
              页面修改被授权人本期数据的查看权限，确认无误后，点击“确认上链”按钮立即生效！
            </p>
            <p className="Cochain-modal__operation">
              运营主体：<span>{projectName}</span>
            </p>
          </div>
          <div className="Table">
            <Table
              rowSelection={rowSelection}
              columns={cochainModalTableTitle}
              dataSource={cochainTableData}
              pagination={false}
              scroll={{ y: 240 }}
              loading={up2chainLoading}
              bordered
            />
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { merchantId },
  } = state;

  return {
    merchantId,
  };
};

export default connect(mapStateToProps)(TaskDataAnalyse);
