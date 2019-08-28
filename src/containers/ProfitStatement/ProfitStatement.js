import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Upload, message, Breadcrumb, Modal, Icon, Alert } from 'antd';
import { LeadInServices } from '../../services/LeadInServices';
import { format } from '../../modules/date';
import CalendarIcon from '../../components/Icon/CalendarIcon';
import { isEmpty } from '../../modules/utils';
import { EXCEL_ACCEPT } from '../../modules/ENUM';

const leadInServices = new LeadInServices();

export class ProfitStatement extends React.Component {
  state = {
    month: this.props.match.params.dateMonth,
    fileList: [],
    done: false,
    visible: false,
    confirmLoading: false,
    uploadError: '',
    profit: {},
  };

  saveProfit = () => {
    const { month, profit } = this.state;
    const {
      match: {
        params: { projectId },
      },
    } = this.props;

    const dateMonth = format(month, 'YYYY-MM');

    leadInServices.saveProfit({ ...profit, projectId, dateMonth }).then((res) => {
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
        .upload({ projectId, file, dateMonth: format(month, 'YYYY-MM'), sheetType: 'profit' })
        .then((profit) => {
          message.success(`${file.name} 上传文件成功`);
          this.setState({
            confirmLoading: false,
            done: true,
            visible: false,
            uploadError: '',
            profit,
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
    const { fileList, visible, confirmLoading, done, uploadError, profit } = this.state;
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
          title="上传利润表"
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
              请使用模版导入<a href="/templet/利润表.xlsx" download="利润表" target="_blank">
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
                <div className="lead-in-upload-name">{projectName}-利润表</div>
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
                    onClick={this.saveProfit}
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
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>行次</th>
                  <th>本月发生数</th>
                  <th>本年累计数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>一、主营业务收入:</td>
                  <td>1</td>
                  <td>{profit.mainBusinessIncome}</td>
                  <td>{profit.mainBusinessIncomeY}</td>
                </tr>
                <tr>
                  <td>减：主营业务成本</td>
                  <td>2</td>
                  <td>{profit.mainBusinessCost}</td>
                  <td>{profit.mainBusinessCostY}</td>
                </tr>
                <tr>
                  <td>主营业务税金及附加</td>
                  <td>3</td>
                  <td>{profit.mainBusinessTaxes}</td>
                  <td>{profit.mainBusinessTaxesY}</td>
                </tr>
                <tr>
                  <td>销售费用</td>
                  <td>4</td>
                  <td>{profit.costOfSales}</td>
                  <td>{profit.costOfSalesY}</td>
                </tr>
                <tr>
                  <td>管理费用</td>
                  <td>5</td>
                  <td>{profit.managementFees}</td>
                  <td>{profit.managementFeesY}</td>
                </tr>
                <tr>
                  <td>财务费用</td>
                  <td>6</td>
                  <td>{profit.financeCharges}</td>
                  <td>{profit.financeChargesY}</td>
                </tr>
                <tr>
                  <td>其中：利息支出</td>
                  <td>7</td>
                  <td>{profit.interestExpense}</td>
                  <td>{profit.interestExpenseY}</td>
                </tr>
                <tr>
                  <td>其它财务费用</td>
                  <td>8</td>
                  <td>{profit.otherFinancialExpense}</td>
                  <td>{profit.otherFinancialExpenseY}</td>
                </tr>
                <tr>
                  <td>资产减值损失</td>
                  <td>9</td>
                  <td>{profit.assetImpairmentLosses}</td>
                  <td>{profit.assetImpairmentLossesY}</td>
                </tr>
                <tr>
                  <td>加：公允价值变动收益(损失以"-"号表示)</td>
                  <td>10</td>
                  <td>{profit.fairValueChangesEarning}</td>
                  <td>{profit.fairValueChangesEarningY}</td>
                </tr>
                <tr>
                  <td>投资收益(亏损以"-"号表示)</td>
                  <td>11</td>
                  <td>{profit.returnOnInvestment}</td>
                  <td>{profit.returnOnInvestmentY}</td>
                </tr>
                <tr>
                  <td>其中：对联营企业和合营企业的投资收益</td>
                  <td>12</td>
                  <td>{profit.investmentIncomeInVenture}</td>
                  <td>{profit.investmentIncomeInVentureY}</td>
                </tr>
                <tr>
                  <td>二、营业利润(亏损以"-"号表示)</td>
                  <td>13</td>
                  <td>{profit.operatingProfit}</td>
                  <td>{profit.operatingProfitY}</td>
                </tr>
                <tr>
                  <td>加：营业外收入</td>
                  <td>14</td>
                  <td>{profit.nonOperatingIncome}</td>
                  <td>{profit.nonOperatingIncomeY}</td>
                </tr>
                <tr>
                  <td>减：营业外支出</td>
                  <td>15</td>
                  <td>{profit.nonOperatingExpense}</td>
                  <td>{profit.nonOperatingExpenseY}</td>
                </tr>
                <tr>
                  <td>三、利润总额(亏损以"-"号表示)</td>
                  <td>16</td>
                  <td>{profit.profitTotal}</td>
                  <td>{profit.profitTotalY}</td>
                </tr>
                <tr>
                  <td>减：所得税费用</td>
                  <td>17</td>
                  <td>{profit.incomeTaxExpense}</td>
                  <td>{profit.incomeTaxExpenseY}</td>
                </tr>
                <tr>
                  <td>四、净利润(亏损以"-"号表示)</td>
                  <td>18</td>
                  <td>{profit.netProfit}</td>
                  <td>{profit.netProfitY}</td>
                </tr>
                <tr>
                  <td>五、每股收益：</td>
                  <td>19</td>
                  <td>{profit.earningsPerShare}</td>
                  <td>{profit.earningsPerShareY}</td>
                </tr>
                <tr>
                  <td>（一）基本每股收益</td>
                  <td>20</td>
                  <td>{profit.basicEarningsPerShare}</td>
                  <td>{profit.basicEarningsPerShareY}</td>
                </tr>
                <tr>
                  <td>（二）稀释每股收益</td>
                  <td>21</td>
                  <td>{profit.dilutedEarningsPerShare}</td>
                  <td>{profit.dilutedEarningsPerShareY}</td>
                </tr>
                <tr>
                  <td>六、其他综合收益</td>
                  <td>22</td>
                  <td>{profit.otherComprehensiveIncome}</td>
                  <td>{profit.otherComprehensiveIncomeY}</td>
                </tr>
                <tr>
                  <td>七、综合收益总额</td>
                  <td>23</td>
                  <td>{profit.totalComprehensiveIncome}</td>
                  <td>{profit.totalComprehensiveIncomeY}</td>
                </tr>
                <tr>
                  <td>GOP(仅酒店填写)</td>
                  <td>24</td>
                  <td>{profit.gop}</td>
                  <td>{profit.gopY}</td>
                </tr>
                <tr>
                  <td>EBITDA</td>
                  <td>25</td>
                  <td>{profit.ebitda}</td>
                  <td>{profit.ebitdaY}</td>
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

export default connect(mapStateToProps)(ProfitStatement);
