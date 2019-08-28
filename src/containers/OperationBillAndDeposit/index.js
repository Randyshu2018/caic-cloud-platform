import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Button, Input, Select, Form, DatePicker, Alert } from 'antd';
import { Link } from 'react-router-dom';
import './style/index.scss';
import DepositList from './tmpl/renderDepositList';
import DepositBox from './tmpl/depositBox';
import api from 'api';
import BasePage from '../../components/base-page/index';

const { RangePicker } = DatePicker;
@Form.create()
class Deposit extends BasePage {
  state = {
    visible: false,
    id: null,
    buildingList: [],
    depositAmount: '--',
    noBuilding: false,
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
      console.log(res);
      if (res) {
        this.setState({
          buildingList: res,
        });
        this.getDepositData(id);
      } else {
        this.setState({
          noBuilding: true,
        });
      }
    });
  };

  //获取明细总额
  getDepositData = (id) => {
    api.contractDepositAmount({ projectId: id }).then((res) => {
      console.log(res);
      if (res) {
        this.setState({ depositAmount: res.depositAmount });
      }
    });
  };

  // 查询条件
  handleSubmit = (e) => {
    this.props.form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue);
      if (!err) {
        new Promise(function(resolve, reject) {
          const rangeValue = fieldsValue['range-picker'];
          //   console.log('rangeValue',rangeValue);
          const values = {
            ...fieldsValue,
            beginDate:
              (rangeValue && rangeValue.length > 0 && rangeValue[0].format('YYYY-MM-DD')) || '',
            endDate:
              (rangeValue && rangeValue.length > 0 && rangeValue[1].format('YYYY-MM-DD')) || '',
          };
          console.log('Received values of form: ', values);
          resolve(values);
        }).then((data) => {
          delete data['range-picker'];
          this.renderDepositList({ ...data });
        });
      }
    });
  };

  openDetail = (id, account) => {
    this.setState({ visible: true, id, account });
  };
  toggle = (visible) => {
    this.setState({ visible });
    this.handleSubmit();
  };

  depositCallback = (param, thisDepositCallback) => {
    if (thisDepositCallback) {
      this.renderDepositList = thisDepositCallback.depositFetchData;
    }
  };
  render() {
    const { visible, test, id, buildingList, depositAmount, account, noBuilding } = this.state;
    const { project } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (noBuilding) {
      return this.showAlert();
    }
    return (
      <React.Fragment>
        <div className="rent-container">
          <Breadcrumb separator=">" className="breadcrumb">
            <Breadcrumb.Item>保证金明细</Breadcrumb.Item>
          </Breadcrumb>
          <section className="deposit" style={{ minHeight: window.screen.height - 280 }}>
            {/* 搜索框 */}
            <Row gutter={30} className="deposit-search">
              <Breadcrumb separator=">" className="deposit-list">
                <Breadcrumb.Item>保证金余额：{depositAmount}元</Breadcrumb.Item>
              </Breadcrumb>
              <Form layout="inline" onSubmit={this.handleSubmit}>
                <div style={{ overflow: 'hidden', margin: '30px 0 30px 0' }}>
                  {/* 时间 */}
                  <Col span={6}>
                    <Form.Item label="时间">
                      {getFieldDecorator('range-picker', {
                        rules: [{ required: false, message: '' }],
                      })(<RangePicker style={{ width: '230px' }} />)}
                    </Form.Item>
                  </Col>
                  {/* 承租方 */}
                  <Col span={6}>
                    <Form.Item label="承租方&nbsp;">
                      {getFieldDecorator('lessee', {
                        rules: [{ required: false, message: '' }],
                      })(<Input placeholder="请输入承租方名称" />)}
                    </Form.Item>
                  </Col>
                  {/* 房间号 */}
                  <Col span={6}>
                    <Form.Item label="房间号&nbsp;">
                      {getFieldDecorator('room', {
                        rules: [{ required: false, message: '' }],
                      })(<Input placeholder="请输入房间号" />)}
                    </Form.Item>
                  </Col>
                </div>
                {/* 2 */}
                {/* 楼宇 */}
                <Col span={6}>
                  <Form.Item label="楼宇">
                    {getFieldDecorator('buildingId', {
                      rules: [{ required: false, message: '' }],
                      initialValue: '',
                    })(
                      <Select style={{ width: '230px' }}>
                        <Select.Option value="" key="0">
                          全部楼宇
                        </Select.Option>
                        {buildingList.map((item) => {
                          return (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {/* 逾期状态  */}
                <Col span={6}>
                  <Form.Item label="逾期状态">
                    {getFieldDecorator('overdueStatus', {
                      rules: [{ required: false, message: '' }],
                      initialValue: '',
                    })(
                      <Select>
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">逾期</Select.Option>
                        <Select.Option value="0">正常</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                {/* 付款状态 */}
                <Col span={6}>
                  <Form.Item label="付款状态">
                    {getFieldDecorator('payStatus', {
                      rules: [{ required: false, message: '' }],
                      initialValue: '',
                    })(
                      <Select>
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="UNPAID">未付款</Select.Option>
                        <Select.Option value="CLOSED">已结清</Select.Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Form>
              <Col span={2} className="searchButton">
                <Button
                  htmlType="button"
                  type="primary"
                  icon="file-search"
                  onClick={() => this.handleSubmit()}
                >
                  查询
                </Button>
              </Col>
            </Row>
            {/* 列表 */}
            <DepositList
              type={'DEPOSIT'}
              project={project}
              open={this.openDetail}
              callback={this.depositCallback}
            />
          </section>
        </div>
        {visible && <DepositBox close={this.toggle} id={id} account={account} />}
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

export default connect(mapStateToProps)(Deposit);
