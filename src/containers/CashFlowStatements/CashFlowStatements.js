import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Upload, message, Modal, Icon, Alert, Breadcrumb } from 'antd';
import { LeadInServices } from '../../services/LeadInServices';
import { format } from '../../modules/date';
import CalendarIcon from '../../components/Icon/CalendarIcon';
import { isEmpty } from '../../modules/utils';
import { EXCEL_ACCEPT } from '../../modules/ENUM';

const leadInServices = new LeadInServices();

export class CashFlowStatements extends React.Component {
  state = {
    month: this.props.match.params.dateMonth,
    fileList: [],
    done: false,
    visible: false,
    confirmLoading: false,
    uploadError: '',
    cash: {},
  };

  saveCashFlow = () => {
    const { month, cash } = this.state;
    const {
      match: {
        params: { projectId },
      },
    } = this.props;

    const dateMonth = format(month, 'YYYY-MM');

    leadInServices.saveCashFlow({ ...cash, projectId, dateMonth }).then((res) => {
      message.success('上传并保存数据成功');
      this.props.history.push(`/task/detail/${projectId}?date=${dateMonth}`);
    });
  };

  showModel = () => {
    this.setState({ visible: true });
  };

  hideModel = () => {
    this.setState({ visible: false });
  };

  upload = () => {
    this.setState({ confirmLoading: true });

    const {
      fileList: [file],
      month,
    } = this.state;
    const {
      match: {
        params: { projectId },
      },
    } = this.props;

    if (file) {
      return leadInServices
        .upload({ projectId, file, dateMonth: format(month, 'YYYY-MM'), sheetType: 'cashFlow' })
        .then((cash) => {
          message.success(`${file.name} 上传文件成功`);
          this.setState({
            confirmLoading: false,
            done: true,
            visible: false,
            uploadError: '',
            cash,
          });
        })
        .catch((res) => {
          this.setState({ confirmLoading: false, uploadError: res.responseMsg });
        });
    } else {
      message.warn('请浏览需要上传的文件');
      this.setState({ confirmLoading: false });
    }
  };

  render() {
    const { fileList, confirmLoading, uploadError, visible, done, cash } = this.state;
    const {
      match: {
        params: { projectId, dateMonth },
      },
      projectDetail,
    } = this.props;
    const detail = projectDetail[projectId];
    const { projectName } = isEmpty(detail) ? {} : detail;

    const date = format(dateMonth, 'YYYY年M期');
    const dateDetail = format(dateMonth, 'YYYY-MM');

    const props = {
      action: leadInServices.uploadAction,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file);
          const newFileList = fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        this.setState(({ fileList }) => {
          this.setState({ fileList: [file] });
        });
        return false;
      },
      fileList,
      showUploadList: true,
      accept: EXCEL_ACCEPT,
    };

    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/task/detail/${projectId}?date=${dateDetail}`}>详情</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>财务数据</Breadcrumb.Item>
        </Breadcrumb>
        <Modal
          title="上传现金流量表"
          visible={visible}
          onOk={this.upload}
          centered={true}
          okText={'导入'}
          confirmLoading={confirmLoading}
          onCancel={this.hideModel}
        >
          <div className="upload-model-body">
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> 浏览
              </Button>
            </Upload>
            <div className="tip-tit">温馨提示</div>
            <div className="tip">
              请使用模版导入<a
                href="/templet/cash-flow-statement.xlsx"
                download="现金流量表-模板"
                target="_blank"
              >
                下载模版
              </a>
            </div>
            {uploadError && (
              <Alert message={uploadError} type="error" showIcon style={{ marginTop: 15 }} />
            )}
          </div>
        </Modal>
        <div className="assets-lead-in" style={{ backgroundColor: 'white' }}>
          <div className="lead-in-header">
            <Row>
              <Col span={18}>
                <div className="lead-in-upload-name">{projectName}-现金流量表</div>
                <div className="date-month">
                  <CalendarIcon /> {date}
                </div>
              </Col>
              <Col span={6}>
                <div className="text-right">
                  <Button type="primary" onClick={this.showModel}>
                    导入表格
                  </Button>
                  <Button
                    className="lead-in-up-button"
                    type="primary"
                    disabled={!done}
                    onClick={this.saveCashFlow}
                  >
                    提交
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <table className="table-list">
              <colgroup>
                <col width="35%" />
                <col width="8%" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>行次</th>
                  <th>本期金额</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>一、经营活动产生的现金流量：</td>
                  <td>1</td>
                  <td />
                </tr>
                <tr>
                  <td>销售商品、提供劳务收到的现金(元)</td>
                  <td>2</td>
                  <td>{cash.goodsSalesReceivedCash}</td>
                </tr>
                <tr>
                  <td>收到的税费返还(元)</td>
                  <td>3</td>
                  <td>{cash.taxAndLeviesRefund}</td>
                </tr>
                <tr>
                  <td>收到其他与经营活动有关的现金(元)</td>
                  <td>4</td>
                  <td>{cash.operaReceivedOtherCash}</td>
                </tr>
                <tr>
                  <td>经营活动现金流入小计(元): </td>
                  <td>5</td>
                  <td>{cash.operaCashInflows}</td>
                </tr>
                <tr>
                  <td>购买商品、接受劳务支付的现金(元)</td>
                  <td>6</td>
                  <td>{cash.goodsSalesPaidCash}</td>
                </tr>
                <tr>
                  <td>支付给职工以及为职工支付的现金(元)</td>
                  <td>7</td>
                  <td>{cash.employeesPaidCash}</td>
                </tr>
                <tr>
                  <td>支付的各项税费(元)</td>
                  <td>8</td>
                  <td>{cash.paidTaxes}</td>
                </tr>
                <tr>
                  <td>支付其他与经营活动有关的现金(元)</td>
                  <td>9</td>
                  <td>{cash.operaPaidOtherCash}</td>
                </tr>
                <tr>
                  <td>经营活动现金流出小计(元)</td>
                  <td>10</td>
                  <td>{cash.operaCashOutflows}</td>
                </tr>
                <tr>
                  <td>经营活动产生的现金流量净额(元)</td>
                  <td>11</td>
                  <td>{cash.operaCashFlows}</td>
                </tr>
                <tr>
                  <td>二、投资活动产生的现金流量：</td>
                  <td>12</td>
                  <td>{cash.investCashFlows}</td>
                </tr>
                <tr>
                  <td>收回投资收到的现金(元)</td>
                  <td>13</td>
                  <td>{cash.investDisposalReceivedCash}</td>
                </tr>
                <tr>
                  <td>取得投资收益收到的现金(元)</td>
                  <td>14</td>
                  <td>{cash.investReturnReceivedCash}</td>
                </tr>
                <tr>
                  <td>处置固定资产、无形资产和其他长期资产收回的现金净额(元)</td>
                  <td>15</td>
                  <td>{cash.longTermReceivedNetCash}</td>
                </tr>
                <tr>
                  <td>处置子公司及其他营业单位收到的现金净额(元)</td>
                  <td>16</td>
                  <td>{cash.otherUnitReceivedNetCash}</td>
                </tr>
                <tr>
                  <td>收到其他与投资活动有关的现金(元)</td>
                  <td>17</td>
                  <td>{cash.otherInvestReceivedCash}</td>
                </tr>
                <tr>
                  <td>投资活动现金流入小计(元):</td>
                  <td>18</td>
                  <td>{cash.investCashInflows}</td>
                </tr>
                <tr>
                  <td>购建固定资产、无形资产和其他长期资产支付的现金(元)</td>
                  <td>19</td>
                  <td>{cash.longTermAssetPaidCash}</td>
                </tr>
                <tr>
                  <td>投资支付的现金(元)</td>
                  <td>20</td>
                  <td>{cash.investPaidCash}</td>
                </tr>
                <tr>
                  <td>取得子公司及其他营业单位支付的现金净额(元)</td>
                  <td>21</td>
                  <td>{cash.otherUnitPaidNetCash}</td>
                </tr>
                <tr>
                  <td>支付其他与投资活动有关的现金(元)</td>
                  <td>22</td>
                  <td>{cash.otherInvestPaidCash}</td>
                </tr>
                <tr>
                  <td>投资活动现金流出小计(元)</td>
                  <td>23</td>
                  <td>{cash.investCashOutflows}</td>
                </tr>
                <tr>
                  <td>投资活动产生的现金流量净额(元)</td>
                  <td>24</td>
                  <td>{cash.investCashFlows}</td>
                </tr>
                <tr>
                  <td>三、筹资活动产生的现金流量：</td>
                  <td>25</td>
                  <td />
                </tr>
                <tr>
                  <td>吸收投资收到的现金(元)</td>
                  <td>26</td>
                  <td>{cash.contributionReceivedCash}</td>
                </tr>
                <tr>
                  <td>取得借款收到的现金(元)</td>
                  <td>27</td>
                  <td>{cash.borrowingsReceivedCash}</td>
                </tr>
                <tr>
                  <td>收到其他与筹资活动有关的现金(元)</td>
                  <td>28</td>
                  <td>{cash.otherFinanceReceivedCash}</td>
                </tr>
                <tr>
                  <td>筹资活动现金流入小计(元)</td>
                  <td>29</td>
                  <td>{cash.financeCashInflows}</td>
                </tr>
                <tr>
                  <td>偿还债务支付的现金(元)</td>
                  <td>30</td>
                  <td>{cash.borrowedCashRepayment}</td>
                </tr>
                <tr>
                  <td>分配股利、利润或偿付利息支付的现金(元)</td>
                  <td>31</td>
                  <td>{cash.profitCashPayment}</td>
                </tr>
                <tr>
                  <td>支付其他与筹资活动有关的现金(元)</td>
                  <td>32</td>
                  <td>{cash.otherFinancePaidCash}</td>
                </tr>
                <tr>
                  <td>筹资活动现金流出小计(元)</td>
                  <td>33</td>
                  <td>{cash.financeCashOutflows}</td>
                </tr>
                <tr>
                  <td>筹资活动产生的现金流量净额(元)</td>
                  <td>34</td>
                  <td>{cash.financeCashFlows}</td>
                </tr>
                <tr>
                  <td>四、汇率变动对现金的影响:</td>
                  <td>35</td>
                  <td />
                </tr>
                <tr>
                  <td>汇率变动对现金的影响(元)</td>
                  <td>36</td>
                  <td>{cash.exchangeRateEffectOnCash}</td>
                </tr>
                <tr>
                  <td>五、现金及现金等价物净增加额:</td>
                  <td>37</td>
                  <td />
                </tr>
                <tr>
                  <td>现金及现金等价物净增加额(元)</td>
                  <td>38</td>
                  <td>{cash.cashNetIncrease}</td>
                </tr>
                <tr>
                  <td>期初现金及现金等价物余额(元)</td>
                  <td>39</td>
                  <td>{cash.initialCash}</td>
                </tr>
                <tr>
                  <td>期末现金及现金等价物余额(元)</td>
                  <td>40</td>
                  <td>{cash.endingCash}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const { projectDetail } = state;

  return {
    projectDetail,
  };
};

export default connect(mapStateToProps)(CashFlowStatements);
