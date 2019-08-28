import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb, Row, Col, Button, Input, Select, Alert } from 'antd';
import { Link } from 'react-router-dom';
import NewRent from './tmpl/newRent';
import Drawers from './tmpl/drawers';
import './style/index.scss';
import RentTable from './tmpl/renderTable';
import api from 'api';
import ChartsTmpl from './tmpl/charts';
import { events } from 'func';
import BasePage from '../../components/base-page/index';

class Rent extends BasePage {
  state = {
    search: '',
    chartConOpt: {},
    noNewPro: true,
    visible: false,
    id: 0,
    noBuilding: false,
    buildingList: [],
    buildingId: null,
    isRequest: false,
  };

  componentDidMount() {
    const { project } = this.props;
    if (project.id) {
      this.getBuilding();
    }
    events.on('saveContractNext', this.reload);
  }

  //查询楼宇信息
  getBuilding = () => {
    const { project } = this.props;
    const { id } = project;
    api.contractListByProjectId({ projectId: id }).then((res) => {
      if (!res) {
        this.setState({
          noBuilding: true,
        });
      } else {
        res.unshift({
          id: 0,
          name: '全部楼宇',
        });
        this.setState({
          buildingList: res,
        });
      }
    });
  };

  componentDidUpdate(prevProps) {
    const { project } = this.props;
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.getBuilding();
    }
  }

  build = () => {
    this.setState({ visible: true, noNewPro: true });
  };
  toggle = (visible) => this.setState({ visible });
  // 柱状图搜索
  clickBar = (val) => {
    this.thisRentTable.fetchData({ endSignDate: val.name }, true);
  };
  // 楼宇选择
  handleChangebuild = (value) => {
    this.setState({
      buildingId: value,
      isRequest: false,
    });
  };
  // 输入框搜索
  handleSearch = () => {
    this.thisRentTable.fetchData(
      {
        buildingId: this.state.buildingId,
        lessee: this.refs.search.state.value,
        roomName: this.refs.searchRoom.state.value,
      },
      true
    );
    this.setState({
      isRequest: true,
    });
  };
  rentTableCallback = (params, thisRentTable) => {
    if (thisRentTable) {
      this.thisRentTable = thisRentTable;
    } else {
      // this.thisNewRent.showDrawer(params);
    }
  };

  openDetail = (id) => {
    this.setState({ visible: true, noNewPro: false, id });
  };
  closeDetail = () => this.toggle(false);

  reload = () => {
    this.closeDetail();
    window.tableGetData();
    window.getData();
  };
  componentWillUnmount() {
    events.removeListener('saveContractNext', this.reload);
  }
  render() {
    const {
      chartConOpt,
      noNewPro,
      visible,
      id,
      noBuilding,
      buildingList,
      buildingId,
      isRequest,
    } = this.state;
    const { project } = this.props;
    const { Option } = Select;
    if (noBuilding) {
      return this.showAlert();
    }
    return (
      <React.Fragment>
        <div className="rent-container">
          <Breadcrumb separator=">" className="breadcrumb">
            <Breadcrumb.Item>租赁合同</Breadcrumb.Item>
          </Breadcrumb>
          <section className="rent">
            {/* 搜索框 */}
            <Row gutter={30} className="rent-search">
              <Col span={1} className="rent-searchCol">
                选择楼宇:
              </Col>
              <Col span={6} style={{ width: 180 }}>
                <div>
                  <Select
                    style={{ width: 180 }}
                    defaultValue="全部楼宇"
                    onChange={this.handleChangebuild}
                  >
                    {buildingList.map((value) => {
                      return (
                        <Option value={value.id} key={value.id}>
                          {value.name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              </Col>
              <Col span={1} className="rent-searchCol" style={{ marginLeft: 30 }}>
                承租方:
              </Col>
              <Col span={4}>
                <div>
                  <Input placeholder="请输入承租方名称" ref="search" />
                </div>
              </Col>
              <Col span={1} className="rent-searchCol">
                房间号:
              </Col>
              <Col span={4}>
                <div>
                  <Input placeholder="请输入房间号名称" ref="searchRoom" />
                </div>
              </Col>
              <Col span={2} className="searchButton">
                <Button htmlType="button" type="primary" onClick={() => this.handleSearch()}>
                  搜索
                </Button>
              </Col>
            </Row>
            {/* 到期监控图 */}
            <ChartsTmpl
              click={this.clickBar}
              project={project}
              buildingId={buildingId}
              isRequest={isRequest}
            />
          </section>
          <section className="rentList">
            {/* 客户列表 */}
            <div className="list">
              <h2>合同列表</h2>
              {/* 新建合同 */}
              <Button className="newRentBut" icon="plus" onClick={this.build}>
                新建合同
              </Button>
              <div className="list-body">
                <RentTable
                  close={this.closeDetail}
                  open={this.openDetail}
                  callback={this.rentTableCallback}
                  id={id}
                  project={project}
                />
              </div>
              <div />
              {visible && (
                <Drawers
                  noNewPro={noNewPro}
                  isBuildingMan={false}
                  close={this.toggle}
                  contractId={id}
                  project={project}
                />
              )}
            </div>
          </section>
        </div>
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

export default connect(mapStateToProps)(Rent);
