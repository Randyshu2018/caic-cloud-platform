import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, Icon, Modal, Row, Upload, Breadcrumb, message } from 'antd';
import CalendarIcon from '../../components/Icon/CalendarIcon';
import { isEmpty } from '../../modules/utils';
import { format } from '../../modules/date';
import { LeadInServices } from '../../services/LeadInServices';
import './OperationalDataTable.scss';
import { EXCEL_ACCEPT } from '../../modules/ENUM';

const leadInServices = new LeadInServices();

class OperationalDataTable extends React.Component {
  state = {
    month: this.props.match.params.dateMonth,
    fileList: [],
    done: false,
    visible: false,
    confirmLoading: false,
    uploadError: '',
  };

  saveBalance = () => {
    const { month, balanceSheetBegin, balanceSheetEnd } = this.state;
    const {
      match: {
        params: { projectId },
      },
    } = this.props;

    const dateMonth = format(month, 'YYYY-MM');

    leadInServices
      .saveBalance({ projectId, dateMonth, balanceSheetBegin, balanceSheetEnd })
      .then((res) => {
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
        .upload({ projectId, file, dateMonth: format(month, 'YYYY-MM'), sheetType: 'balance' })
        .then(() => {
          message.success(`${file.name} 上传文件成功`);
          this.setState({
            confirmLoading: false,
            done: true,
            visible: false,
            uploadError: '',
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
    const { fileList, done, confirmLoading, uploadError, visible } = this.state;
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
          title="上传运营数据表"
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
                href="/templet/assets-liabilities.xlsx"
                download="运营数据表-模板"
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
        <div className="assets-lead-in">
          <div className="lead-in-header">
            <Row>
              <Col span={18}>
                <div className="lead-in-upload-name">{projectName}-运营数据表</div>
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
                    onClick={this.saveBalance}
                  >
                    提交
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <table className="table-list table-list-align-left">
              <colgroup>
                <col width="35%" />
                <col width="30%" />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>分类</th>
                  <th>指标</th>
                  <th>金额</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>经营收益</td>
                  <td>总收入</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>其中：客房收入（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>餐饮收入（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>其他收入（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>出租率（%）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>均价（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>revpar（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>总成本（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>其中：人力成本（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>餐饮成本（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>营销费用（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>能耗费用（元）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>客源分类</td>
                  <td>会员卡数（张）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>本月客流（人次）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>其中：餐饮客流（人次）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>订单来源</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>其中：直销（%）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>渠道（%）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>会员（%）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>协议（%）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>上门（%）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td> 其他（%）</td>
                  <td />
                </tr>
                <tr>
                  <td>工作人员</td>
                  <td>本月离职人员数（个）</td>
                  <td />
                </tr>
                <tr>
                  <td />
                  <td>员工数（个）</td>
                  <td />
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

export default connect(mapStateToProps)(OperationalDataTable);
