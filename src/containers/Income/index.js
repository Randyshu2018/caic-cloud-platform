import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Button, Input, Select, Tooltip, Checkbox, Form, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { format } from '../../modules/date';
import './style/index.scss';
import help from './img/help.png';
import IncomeList from './tmpl/renderIncomeList';
import Drawers from '../Rent/tmpl/drawers';
import api from 'api';
import { events } from 'func';
import BasePage from '../../components/base-page/index';
@Form.create()
class Income extends BasePage {
  state = {
    visible: false,
    listParam: {
      projectId: this.props.project.id,
      lessee: '',
      year: +format(new Date(), 'YYYY'),
      inLeasingOnly: false,
      pageNum: 1,
      pageSize: 10,
    },
    selectYearData: [],
    noBuilding: false,
    statisInfo: [],
    contractId: 0,
  };
  componentDidMount() {
    const { project } = this.props;
    if (project.id) {
      this.getBuilding(project.id);
    }
  }
  //查询楼宇信息
  getBuilding = (id) => {
    api.contractListByProjectId({ projectId: id }).then((res) => {
      if (!res) {
        this.setState({
          noBuilding: true,
        });
      } else {
        this.handleStatisInfo(id);
        this.selectYear(id);
      }
    });
  };
  // 统计查询
  handleStatisInfo = (param) => {
    api.contractStatisInfo({ projectId: param }).then((res) => {
      this.setState({
        statisInfo: res,
      });
    });
  };
  // 报表导出
  handleExportExc = () => {
    this.handleSubmit(null, true);
  };
  // 查询按钮
  handleSubmit = (e, isExportExc) => {
    e && e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (isExportExc) {
          const params = {
            ...this.state.listParam,
            ...values,
          };
          let exportLocalhost = '';
          if (window.location.hostname.indexOf('-') === 1) {
            exportLocalhost = 'http://opc.qiushibc.com';
          } else {
            exportLocalhost = 'http://test-opc.qiushibc.com';
          }
          console.log(
            exportLocalhost,
            params.projectId,
            params.lessee,
            params.year,
            params.pageNum,
            params.pageSize
          );
          window.location.href = `${exportLocalhost}/pc/om/income/export?projectId=${
            params.projectId
          }&lessee=${params.lessee}&year=${params.year}&inLeasingOnly=${
            params.inLeasingOnly
          }&pageNum=${params.pageNum}&pageSize=${params.pageSize}`;
        } else {
          events.emit('sendSelectYearData', values.year);
          this.renderIncomeList.fetchIncomeData({ ...values }, true);
        }
      }
    });
  };
  // 抽屉- 收入确认
  openDetail = (id) => {
    this.setState({ visible: true, noNewPro: false, contractId: id });
    setTimeout(() => events.emit('postionTabIncome', { active: '3' }));
  };
  // 选择年份
  selectYear = (id) => {
    api.contractQueryYearList({ projectId: id }).then((res) => {
      events.emit('sendSelectYearData', res[0] || '');
      this.setState({
        selectYearData: res,
      });
    });
  };
  toggle = (visible) => this.setState({ visible });

  incomeCallback = (param, thisRenderIncomeList) => {
    if (thisRenderIncomeList) {
      this.renderIncomeList = thisRenderIncomeList;
    }
  };
  fn = (data) => {
    let handleListParam = {
      ...this.state.listParam,
      pageNum: data,
    };
    this.setState(
      {
        listParam: handleListParam,
      },
      () => {
        // console.log(this.state.listParam); //setState是异步操作，但是我们可以在它的回调函数里面进行操作
      }
    );
  };
  render() {
    const { visible, selectYearData, statisInfo, contractId, noBuilding } = this.state;
    const { project } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (noBuilding) {
      return this.showAlert();
    }
    return (
      <React.Fragment>
        <div className="rent-container">
          <Breadcrumb separator=">" className="breadcrumb">
            <Breadcrumb.Item>收入确认</Breadcrumb.Item>
          </Breadcrumb>
          <section className="income" style={{ minHeight: window.screen.height - 280 }}>
            <ul className="incomeUl">
              <li>
                <section>{format(new Date(), 'YYYY')}年预计全年收入</section>
                <p>{(statisInfo && statisInfo.amount4Year) || '--'}元</p>
              </li>
              <li>
                <section>本月摊销收入</section>
                <p>{(statisInfo && statisInfo.amount4Month) || '--'}元</p>
              </li>
              <li>
                <section>
                  出租率
                  <Tooltip title="当前出租面积占总房源面积的百分比">
                    <img src={help} alt="" />
                  </Tooltip>
                </section>
                <p>{(statisInfo && statisInfo.rentalRate) || '--'}%</p>
              </li>
            </ul>
            {/* 搜索框 */}
            <Form layout="inline" onSubmit={this.handleSubmit}>
              <Row gutter={30} className="income-search">
                <Breadcrumb separator=">" className="income-list">
                  <Breadcrumb.Item>收入列表</Breadcrumb.Item>
                </Breadcrumb>

                <Col span={6} className="income-searchCol">
                  <Form.Item label="客户名称">
                    {getFieldDecorator('lessee', {
                      rules: [{ required: false, message: '' }],
                      initialValue: '',
                    })(<Input placeholder="请输入客户名称" />)}
                  </Form.Item>
                </Col>

                <Col span={4} className="income-searchCol">
                  <Form.Item label="日期">
                    {getFieldDecorator('year', {
                      rules: [{ required: false, message: '' }],
                      initialValue: selectYearData[0],
                    })(
                      <Select>
                        {selectYearData.map((item) => {
                          return (
                            <Select.Option value={item} key={item}>{`${item}年`}</Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>

                <Col span={6} className="income-searchCol">
                  <Form.Item>
                    {getFieldDecorator('inLeasingOnly', {
                      rules: [{ required: false, message: '' }],
                      initialValue: false,
                    })(<Checkbox>仅显示在租收入列表</Checkbox>)}
                  </Form.Item>
                </Col>
                <Col span={2} className="exportExc">
                  <Button htmlType="button" icon="export" onClick={() => this.handleExportExc()}>
                    报表导出
                  </Button>
                </Col>
                <Col span={2} className="searchButton">
                  <Button
                    htmlType="button"
                    type="primary"
                    icon="file-search"
                    onClick={this.handleSubmit}
                  >
                    搜索
                  </Button>
                </Col>
              </Row>
            </Form>
            <div>
              <IncomeList
                project={project}
                open={this.openDetail}
                pfn={this.fn}
                callback={this.incomeCallback}
                selectYearDatas={selectYearData}
              />
            </div>
          </section>
        </div>
        {visible && (
          <Drawers noNewPro={false} project={project} contractId={contractId} close={this.toggle} />
        )}
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    sideProjects: { selectSideProject },
  } = state;

  return {
    project: selectSideProject,
  };
};

export default connect(mapStateToProps)(Income);
