import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row, Breadcrumb } from 'antd';
import CalendarIcon from '../../components/Icon/CalendarIcon';
import { format } from '../../modules/date';
import './OperationalDataTable.scss';

export default class OperationalDataTableDetail extends React.Component {
  state = {
    month: this.props.match.params.dateMonth,
    projectName: '',
  };

  render() {
    const { projectName } = this.state;
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
              <Col span={18}>
                <div className="lead-in-upload-name">{projectName}</div>
                <div className="date-month">
                  <CalendarIcon /> {date}
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
