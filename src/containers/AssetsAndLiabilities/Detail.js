import React from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { LeadInServices } from '../../services/LeadInServices';
import { format } from '../../modules/date';
import './LeadIn.scss';
import { Link } from 'react-router-dom';
import CalendarIcon from '../../components/Icon/CalendarIcon';

const leadInServices = new LeadInServices();

export default class AssetsAndLiabilitiesDetail extends React.Component {
  state = {
    month: this.props.match.params.dateMonth,
    projectName: '',
    balanceSheetBegin: {},
    balanceSheetEnd: {},
  };

  componentDidMount() {
    this.fetchDetail();
  }

  fetchDetail() {
    const { month } = this.state;
    const {
      match: {
        params: { projectId },
      },
    } = this.props;

    const dateMonth = format(month, 'YYYY-MM');

    leadInServices.fetchBalance({ projectId, dateMonth }).then((res) => {
      const { projectName, balanceSheetBegin, balanceSheetEnd } = res;
      this.setState({
        projectName,
        balanceSheetBegin: balanceSheetBegin || {},
        balanceSheetEnd: balanceSheetEnd || {},
      });
    });
  }

  render() {
    const { projectName, balanceSheetBegin, balanceSheetEnd } = this.state;
    const {
      match: {
        params: { projectId, dateMonth },
      },
    } = this.props;

    const date = format(dateMonth, 'YYYY年M期');
    const dateDetail = format(dateMonth, 'YYYY-MM');

    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/task/detail/${projectId}?date=${dateDetail}`}>详情</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>财务数据</Breadcrumb.Item>
        </Breadcrumb>
        <div className="assets-lead-in">
          <div className="lead-in-header">
            <Row>
              <Col span={20}>
                <div className="lead-in-upload-name">{projectName}-资产负债表</div>
                <div className="date-month">
                  <CalendarIcon /> {date}
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
                  <td>流动资产</td>
                  <td />
                  <td />
                  <td />
                  <td>流动负债</td>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>货币资金</td>
                  <td>1</td>
                  <td>{balanceSheetBegin.monetaryFunds}</td>
                  <td>{balanceSheetEnd.monetaryFunds}</td>
                  <td>短期借款</td>
                  <td>28</td>
                  <td>{balanceSheetBegin.shortTermBorrowing}</td>
                  <td>{balanceSheetEnd.shortTermBorrowing}</td>
                </tr>
                <tr>
                  <td>交易性金融资产</td>
                  <td>2</td>
                  <td>{balanceSheetBegin.transFinancialAssets}</td>
                  <td>{balanceSheetEnd.transFinancialAssets}</td>
                  <td>应付票据</td>
                  <td>29</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.notesPayable}</span>
                      <input type="text" style={{ display: 'none' }} />
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.notesPayable}</span>
                      <input type="text" style={{ display: 'none' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>应收票据</td>
                  <td>3</td>
                  <td>{balanceSheetBegin.notesReceivable}</td>
                  <td>{balanceSheetEnd.notesReceivable}</td>
                  <td>应付帐款</td>
                  <td>30</td>
                  <td>{balanceSheetBegin.accountsPayable}</td>
                  <td>{balanceSheetEnd.accountsPayable}</td>
                </tr>
                <tr>
                  <td>应收股利</td>
                  <td>4</td>
                  <td>{balanceSheetBegin.dividendsReceivable}</td>
                  <td>{balanceSheetEnd.dividendsReceivable}</td>
                  <td>预收帐款</td>
                  <td>31</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.advanceAccounts}</span>
                      <input type="text" style={{ display: 'none' }} />
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.advanceAccounts}</span>
                      <input type="text" style={{ display: 'none' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>应收利息</td>
                  <td>5</td>
                  <td>{balanceSheetBegin.interestReceivable}</td>
                  <td>{balanceSheetEnd.interestReceivable}</td>
                  <td>应付职工薪酬</td>
                  <td>32</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.payPayable}</span>
                      <input type="text" style={{ display: 'none' }} />
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.payPayable}</span>
                      <input type="text" style={{ display: 'none' }} />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>应收账款</td>
                  <td>6</td>
                  <td>{balanceSheetBegin.accountReceivable}</td>
                  <td>{balanceSheetEnd.accountReceivable}</td>
                  <td>应交税费</td>
                  <td>33</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.payableTaxes}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.payableTaxes}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>其他应收款</td>
                  <td>7</td>
                  <td>{balanceSheetBegin.otherReceivables}</td>
                  <td>{balanceSheetEnd.otherReceivables}</td>
                  <td>应付利息</td>
                  <td>34</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.interestPayable}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.interestPayable}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>预付账款</td>
                  <td>8</td>
                  <td>{balanceSheetBegin.prepayments}</td>
                  <td>{balanceSheetEnd.prepayments}</td>
                  <td>应付利润</td>
                  <td>35</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.profitPayable}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.profitPayable}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>存货</td>
                  <td>9</td>
                  <td>{balanceSheetBegin.inventory}</td>
                  <td>{balanceSheetEnd.inventory}</td>
                  <td>其他应付款</td>
                  <td>36</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.otherPayables}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.otherPayables}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>一年内到期的长期债权投资</td>
                  <td>10</td>
                  <td>{balanceSheetBegin.expLongTermDebtInvest}</td>
                  <td>{balanceSheetEnd.expLongTermDebtInvest}</td>
                  <td>其他流动负债</td>
                  <td>37</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.otherCurrentDebts}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.otherCurrentDebts}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>其他流动资产</td>
                  <td>11</td>
                  <td>{balanceSheetBegin.otherCurrentAssets}</td>
                  <td>{balanceSheetEnd.otherCurrentAssets}</td>
                  <td>流动负债合计</td>
                  <td>38</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalCurrentDebts}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.totalCurrentDebts}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>流动资产合计</td>
                  <td>12</td>
                  <td>{balanceSheetBegin.totalCurrentAssets}</td>
                  <td>{balanceSheetEnd.totalCurrentAssets}</td>
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
                    {/*<div>
                      <span>{balanceSheetEnd.totalNonCurrentDebts}</span>
                    </div>*/}
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
                  <td>
                    <div>
                      <span>{balanceSheetEnd.longTermBorrowing}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>长期股权投资</td>
                  <td>13</td>
                  <td>{balanceSheetBegin.longTermEquityInvest}</td>
                  <td>{balanceSheetEnd.longTermEquityInvest}</td>
                  <td>长期应付款</td>
                  <td>40</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.longTermPayables}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.longTermPayables}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>长期债权投资</td>
                  <td>14</td>
                  <td>{balanceSheetBegin.longTermDebtInvest}</td>
                  <td>{balanceSheetEnd.longTermDebtInvest}</td>
                  <td>递延收益</td>
                  <td>41</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.deferredRevenue}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.deferredRevenue}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>固定资产原价</td>
                  <td>15</td>
                  <td>{balanceSheetBegin.fixedAssetsCost}</td>
                  <td>{balanceSheetEnd.fixedAssetsCost}</td>
                  <td>其他非流动负债</td>
                  <td>42</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.otherNonCurrentDebts}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.otherNonCurrentDebts}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>减：累计折旧</td>
                  <td>16</td>
                  <td>{balanceSheetBegin.accumulatedDepreciation}</td>
                  <td>{balanceSheetEnd.accumulatedDepreciation}</td>
                  <td>非流动负债合计</td>
                  <td>43</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalNonCurrentDebts}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.totalNonCurrentDebts}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>固定资产净值</td>
                  <td>17</td>
                  <td>{balanceSheetBegin.netFixedAssets}</td>
                  <td>{balanceSheetEnd.netFixedAssets}</td>
                  <td>负债合计</td>
                  <td>44</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalDebts}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.totalDebts}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>在建工程</td>
                  <td>18</td>
                  <td>{balanceSheetBegin.constructionProject}</td>
                  <td>{balanceSheetEnd.constructionProject}</td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>工程物资</td>
                  <td>19</td>
                  <td>{balanceSheetBegin.engineeringMaterials}</td>
                  <td>{balanceSheetEnd.engineeringMaterials}</td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>固定资产清理</td>
                  <td>20</td>
                  <td>{balanceSheetBegin.fixedAssetsLiquidation}</td>
                  <td>{balanceSheetEnd.fixedAssetsLiquidation}</td>
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>生产性生物资产</td>
                  <td>21</td>
                  <td>{balanceSheetBegin.biologicalAssets}</td>
                  <td>{balanceSheetEnd.biologicalAssets}</td>
                  <td>所有者权益(或股东权益)</td>
                  <td />
                  <td>
                    {/*<div>
                      <span>{balanceSheetBegin.totalOwnersEquity}</span>
                    </div>*/}
                  </td>
                  <td>
                    {/*<div>
                      <span>{balanceSheetEnd.totalOwnersEquity}</span>
                    </div>*/}
                  </td>
                </tr>
                <tr>
                  <td>无形资产</td>
                  <td>22</td>
                  <td>{balanceSheetBegin.intangibleAssets}</td>
                  <td>{balanceSheetEnd.intangibleAssets}</td>
                  <td>实收资本(或股本)</td>
                  <td>45</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.paidCapital}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.paidCapital}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>开发支出</td>
                  <td>23</td>
                  <td>{balanceSheetBegin.developmentSpending}</td>
                  <td>{balanceSheetEnd.developmentSpending}</td>
                  <td>资本公积</td>
                  <td>46</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.capitalReserves}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.capitalReserves}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>长期待摊费用</td>
                  <td>24</td>
                  <td>{balanceSheetBegin.longTermExpenses}</td>
                  <td>{balanceSheetEnd.longTermExpenses}</td>
                  <td>盈余公积</td>
                  <td>47</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.surplusReserves}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.surplusReserves}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>其他非流动资产</td>
                  <td>25</td>
                  <td>{balanceSheetBegin.otherNonCurrentAssets}</td>
                  <td>{balanceSheetEnd.otherNonCurrentAssets}</td>
                  <td>未分配利润(未弥补亏损以"-"号表示)</td>
                  <td>48</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.undistributedProfit}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.undistributedProfit}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>非流动资产合计</td>
                  <td>26</td>
                  <td>{balanceSheetBegin.totalNonCurrentAssets}</td>
                  <td>{balanceSheetEnd.totalNonCurrentAssets}</td>
                  <td>所有者权益(或股东权益)合计</td>
                  <td>49</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalOwnersEquity}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.totalOwnersEquity}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>资产合计</td>
                  <td>27</td>
                  <td>{balanceSheetBegin.totalAssets}</td>
                  <td>{balanceSheetEnd.totalAssets}</td>
                  <td>负债和所有者权益 (或股东权益)合计</td>
                  <td>50</td>
                  <td>
                    <div>
                      <span>{balanceSheetBegin.totalDebtsOwnersEquity}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>{balanceSheetEnd.totalDebtsOwnersEquity}</span>
                    </div>
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
