import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Row, Col, Button, Upload, message, Modal, Icon, Alert, Breadcrumb } from 'antd';
import CalendarIcon from '../../components/Icon/CalendarIcon';
import { LeadInServices } from '../../services/LeadInServices';
import { format } from '../../modules/date';
import { isEmpty } from '../../modules/utils';
import './LeadIn.scss';
import { EXCEL_ACCEPT } from '../../modules/ENUM';

const leadInServices = new LeadInServices();

export class AssetsAndLiabilities extends React.Component {
  state = {
    month: this.props.match.params.dateMonth,
    fileList: [],
    done: false,
    visible: false,
    confirmLoading: false,
    uploadError: '',
    balanceSheetBegin: {},
    balanceSheetEnd: {},
  };

  editor = (status) => (e) => {
    const d = e.target;

    try {
      if (status === 'show') {
        let _d = d;
        if (d.nodeName === 'SPAN' || d.nodeName === 'INPUT') {
          _d = d.parentNode;
        }
        const input = _d.querySelector('input');

        _d.querySelector('span').style.display = 'none';
        input.style.display = 'block';
        input.focus();
      } else {
        d.parentNode.querySelector('span').style.display = status === 'show' ? 'none' : 'block';
        d.parentNode.querySelector('input').style.display = status === 'show' ? 'block' : 'none';
      }
    } catch (e) {
      console.log(e);
    }
  };

  change = (target, targetKey) => (e) => {
    const value = e.target.value;

    this.setState({ [target]: { ...this.state[target], [targetKey]: value } });
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
        .then((data) => {
          const { balanceSheetBegin, balanceSheetEnd } = data;
          message.success(`${file.name} 上传文件成功`);
          this.setState({
            confirmLoading: false,
            done: true,
            visible: false,
            uploadError: '',
            balanceSheetBegin: balanceSheetBegin || {},
            balanceSheetEnd: balanceSheetEnd || {},
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
    const {
      // month,
      fileList,
      done,
      confirmLoading,
      uploadError,
      visible,
      balanceSheetBegin,
      balanceSheetEnd,
    } = this.state;
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
          title="上传资产负债表"
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
                download="资产负债表-模板"
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
                <div className="lead-in-upload-name">{projectName}-资产负债表</div>
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
            <table className="table-list">
              <colgroup>
                <col width="14%" />
                <col width="8%" />
                <col />
                <col />
                <col width="14%" />
                <col width="8%" />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>资产</th>
                  <th>行数</th>
                  <th>年初数</th>
                  <th>本期数</th>
                  <th>负债及股东权益</th>
                  <th>行数</th>
                  <th>年初数</th>
                  <th>本期数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>流动资产：</td>
                  <td />
                  <td />
                  <td />
                  <td>流动负债：</td>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>货币资金</td>
                  <td>1</td>
                  <td>{balanceSheetBegin.monetaryFunds}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.monetaryFunds}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.monetaryFunds}
                        onChange={this.change('balanceSheetEnd', 'monetaryFunds')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>短期借款</td>
                  <td>28</td>
                  <td>{balanceSheetBegin.shortTermBorrowing}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.shortTermBorrowing}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.shortTermBorrowing}
                        onChange={this.change('balanceSheetEnd', 'shortTermBorrowing')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>交易性金融资产</td>
                  <td>2</td>
                  <td>{balanceSheetBegin.transFinancialAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.transFinancialAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.transFinancialAssets}
                        onChange={this.change('balanceSheetEnd', 'transFinancialAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>应付票据</td>
                  <td>29</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.notesPayable}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.notesPayable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.notesPayable}
                        onChange={this.change('balanceSheetEnd', 'notesPayable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>应收票据</td>
                  <td>3</td>
                  <td>{balanceSheetBegin.notesReceivable}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.notesReceivable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.notesReceivable}
                        onChange={this.change('balanceSheetEnd', 'notesReceivable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>应付帐款</td>
                  <td>30</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.accountsPayable}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.accountsPayable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.accountsPayable}
                        onChange={this.change('balanceSheetEnd', 'accountsPayable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>应收股利</td>
                  <td>4</td>
                  <td>{balanceSheetBegin.dividendsReceivable}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.dividendsReceivable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.dividendsReceivable}
                        onChange={this.change('balanceSheetEnd', 'dividendsReceivable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>预收帐款</td>
                  <td>31</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.advanceAccounts}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.advanceAccounts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.advanceAccounts}
                        onChange={this.change('balanceSheetEnd', 'advanceAccounts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>应收利息</td>
                  <td>5</td>
                  <td>{balanceSheetBegin.interestReceivable}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.interestReceivable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.interestReceivable}
                        onChange={this.change('balanceSheetEnd', 'interestReceivable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>应付职工薪酬</td>
                  <td>32</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.payPayable}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.payPayable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.payPayable}
                        onChange={this.change('balanceSheetEnd', 'payPayable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>应收账款</td>
                  <td>6</td>
                  <td>{balanceSheetBegin.accountReceivable}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.accountReceivable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.accountReceivable}
                        onChange={this.change('balanceSheetEnd', 'accountReceivable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>应交税费</td>
                  <td>33</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.payableTaxes}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.payableTaxes}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.payableTaxes}
                        onChange={this.change('balanceSheetEnd', 'payableTaxes')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>其他应收款</td>
                  <td>7</td>
                  <td>{balanceSheetBegin.otherReceivables}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.otherReceivables}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.otherReceivables}
                        onChange={this.change('balanceSheetEnd', 'otherReceivables')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>应付利息</td>
                  <td>34</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.interestPayable}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.interestPayable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.interestPayable}
                        onChange={this.change('balanceSheetEnd', 'interestPayable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>预付账款</td>
                  <td>8</td>
                  <td>{balanceSheetBegin.prepayments}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.prepayments}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.prepayments}
                        onChange={this.change('balanceSheetEnd', 'prepayments')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>应付利润</td>
                  <td>35</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.profitPayable}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.profitPayable}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.profitPayable}
                        onChange={this.change('balanceSheetEnd', 'profitPayable')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>存货</td>
                  <td>9</td>
                  <td>{balanceSheetBegin.inventory}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.inventory}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.inventory}
                        onChange={this.change('balanceSheetEnd', 'inventory')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>其他应付款</td>
                  <td>36</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.otherPayables}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.otherPayables}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.otherPayables}
                        onChange={this.change('balanceSheetEnd', 'otherPayables')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>一年内到期的长期债权投资</td>
                  <td>10</td>
                  <td>{balanceSheetBegin.expLongTermDebtInvest}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.expLongTermDebtInvest}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.expLongTermDebtInvest}
                        onChange={this.change('balanceSheetEnd', 'expLongTermDebtInvest')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>其他流动负债</td>
                  <td>37</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.otherCurrentDebts}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.otherCurrentDebts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.otherCurrentDebts}
                        onChange={this.change('balanceSheetEnd', 'otherCurrentDebts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>其他流动资产</td>
                  <td>11</td>
                  <td>{balanceSheetBegin.otherCurrentAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.otherCurrentAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.otherCurrentAssets}
                        onChange={this.change('balanceSheetEnd', 'otherCurrentAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>流动负债合计</td>
                  <td>38</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalCurrentDebts}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalCurrentDebts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalCurrentDebts}
                        onChange={this.change('balanceSheetEnd', 'totalCurrentDebts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>流动资产合计</td>
                  <td>12</td>
                  <td>{balanceSheetBegin.totalCurrentAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalCurrentAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalCurrentAssets}
                        onChange={this.change('balanceSheetEnd', 'totalCurrentAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td>非流动负债</td>
                  <td />
                  <td>
                    {/*<div>
                      <span>{balanceSheetBegin.totalNonCurrentDebts}</span>
                    </div>*/}
                  </td>
                  <td>
                    {/*<React.Fragment>
                      <span>{balanceSheetEnd.totalNonCurrentDebts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalNonCurrentDebts}
                        onChange={this.change('balanceSheetEnd', 'totalNonCurrentDebts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>*/}
                  </td>
                </tr>
                <tr>
                  <td>非流动资产</td>
                  <td />
                  <td />
                  <td />
                  <td>长期借款</td>
                  <td>39</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.longTermBorrowing}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.longTermBorrowing}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.longTermBorrowing}
                        onChange={this.change('balanceSheetEnd', 'longTermBorrowing')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>长期股权投资</td>
                  <td>13</td>
                  <td>{balanceSheetBegin.longTermEquityInvest}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.longTermEquityInvest}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.longTermEquityInvest}
                        onChange={this.change('balanceSheetEnd', 'longTermEquityInvest')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>长期应付款</td>
                  <td>40</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.longTermPayables}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.longTermPayables}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.longTermPayables}
                        onChange={this.change('balanceSheetEnd', 'longTermPayables')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>长期债权投资</td>
                  <td>14</td>
                  <td>{balanceSheetBegin.longTermDebtInvest}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.longTermDebtInvest}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.longTermDebtInvest}
                        onChange={this.change('balanceSheetEnd', 'longTermDebtInvest')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>递延收益</td>
                  <td>41</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.deferredRevenue}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.deferredRevenue}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.deferredRevenue}
                        onChange={this.change('balanceSheetEnd', 'deferredRevenue')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>固定资产原价</td>
                  <td>15</td>
                  <td>{balanceSheetBegin.fixedAssetsCost}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.fixedAssetsCost}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.fixedAssetsCost}
                        onChange={this.change('balanceSheetEnd', 'fixedAssetsCost')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>其他非流动负债</td>
                  <td>42</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.otherNonCurrentDebts}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.otherNonCurrentDebts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.otherNonCurrentDebts}
                        onChange={this.change('balanceSheetEnd', 'otherNonCurrentDebts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>减：累计折旧</td>
                  <td>16</td>
                  <td>{balanceSheetBegin.accumulatedDepreciation}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.accumulatedDepreciation}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.accumulatedDepreciation}
                        onChange={this.change('balanceSheetEnd', 'accumulatedDepreciation')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>非流动负债合计</td>
                  <td>43</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalNonCurrentDebts}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalNonCurrentDebts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalNonCurrentDebts}
                        onChange={this.change('balanceSheetEnd', 'totalNonCurrentDebts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>固定资产净值</td>
                  <td>17</td>
                  <td>{balanceSheetBegin.netFixedAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.netFixedAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.netFixedAssets}
                        onChange={this.change('balanceSheetEnd', 'netFixedAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>负债合计</td>
                  <td>44</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalDebts}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalDebts}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalDebts}
                        onChange={this.change('balanceSheetEnd', 'totalDebts')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>在建工程</td>
                  <td>18</td>
                  <td>{balanceSheetBegin.constructionProject}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.constructionProject}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.constructionProject}
                        onChange={this.change('balanceSheetEnd', 'constructionProject')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>工程物资</td>
                  <td>19</td>
                  <td>{balanceSheetBegin.engineeringMaterials}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.engineeringMaterials}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.engineeringMaterials}
                        onChange={this.change('balanceSheetEnd', 'engineeringMaterials')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>固定资产清理</td>
                  <td>20</td>
                  <td>{balanceSheetBegin.fixedAssetsLiquidation}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.fixedAssetsLiquidation}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.fixedAssetsLiquidation}
                        onChange={this.change('balanceSheetEnd', 'fixedAssetsLiquidation')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>生产性生物资产</td>
                  <td>21</td>
                  <td>{balanceSheetBegin.biologicalAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.biologicalAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.biologicalAssets}
                        onChange={this.change('balanceSheetEnd', 'biologicalAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>所有者权益(或股东权益)</td>
                  <td />
                  <td>
                    {/*<div>
                      <span>{balanceSheetBegin.totalOwnersEquity}</span>
                    </div>*/}
                  </td>
                  <td>
                    {/*<React.Fragment>
                      <span>{balanceSheetEnd.totalOwnersEquity}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalOwnersEquity}
                        onChange={this.change('balanceSheetEnd', 'totalOwnersEquity')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>*/}
                  </td>
                </tr>
                <tr>
                  <td>无形资产</td>
                  <td>22</td>
                  <td>{balanceSheetBegin.intangibleAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.intangibleAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.intangibleAssets}
                        onChange={this.change('balanceSheetEnd', 'intangibleAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>实收资本(或股本)</td>
                  <td>45</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.paidCapital}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.paidCapital}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.paidCapital}
                        onChange={this.change('balanceSheetEnd', 'paidCapital')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>开发支出</td>
                  <td>23</td>
                  <td>{balanceSheetBegin.developmentSpending}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.developmentSpending}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.developmentSpending}
                        onChange={this.change('balanceSheetEnd', 'developmentSpending')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>资本公积</td>
                  <td>46</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.capitalReserves}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.capitalReserves}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.capitalReserves}
                        onChange={this.change('balanceSheetEnd', 'capitalReserves')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>长期待摊费用</td>
                  <td>24</td>
                  <td>{balanceSheetBegin.longTermExpenses}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.longTermExpenses}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.longTermExpenses}
                        onChange={this.change('balanceSheetEnd', 'longTermExpenses')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>盈余公积</td>
                  <td>47</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.surplusReserves}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.surplusReserves}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.surplusReserves}
                        onChange={this.change('balanceSheetEnd', 'surplusReserves')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>其他非流动资产</td>
                  <td>25</td>
                  <td>{balanceSheetBegin.otherNonCurrentAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.otherNonCurrentAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.otherNonCurrentAssets}
                        onChange={this.change('balanceSheetEnd', 'otherNonCurrentAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>未分配利润(未弥补亏损以"-"号表示)</td>
                  <td>48</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.undistributedProfit}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.undistributedProfit}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.undistributedProfit}
                        onChange={this.change('balanceSheetEnd', 'undistributedProfit')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>非流动资产合计</td>
                  <td>26</td>
                  <td>{balanceSheetBegin.totalNonCurrentAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalNonCurrentAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalNonCurrentAssets}
                        onChange={this.change('balanceSheetEnd', 'totalNonCurrentAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>所有者权益(或股东权益)合计</td>
                  <td>49</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalOwnersEquity}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalOwnersEquity}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalOwnersEquity}
                        onChange={this.change('balanceSheetEnd', 'totalOwnersEquity')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                </tr>
                <tr>
                  <td>资产合计</td>
                  <td>27</td>
                  <td>{balanceSheetBegin.totalAssets}</td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalAssets}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalAssets}
                        onChange={this.change('balanceSheetEnd', 'totalAssets')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
                  <td>负债和所有者权益 (或股东权益)合计</td>
                  <td>50</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalDebtsOwnersEquity}</span>
                    </div>
                  </td>
                  <td onClick={this.editor('show')}>
                    <React.Fragment>
                      <span>{balanceSheetEnd.totalDebtsOwnersEquity}</span>
                      <input
                        type="number"
                        style={{ display: 'none' }}
                        value={balanceSheetEnd.totalDebtsOwnersEquity}
                        onChange={this.change('balanceSheetEnd', 'totalDebtsOwnersEquity')}
                        onBlur={this.editor('hide')}
                      />
                    </React.Fragment>
                  </td>
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

export default connect(mapStateToProps)(AssetsAndLiabilities);
