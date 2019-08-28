import React from 'react';
// import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import NoBuild from './noBuild';
import HasBuild from './hasBuild';
import './style/index.scss';
import api from 'api';
import { connect } from 'react-redux';
// import { observer, inject } from 'mobx-react'
import BuildLsit from './buildList';
const mapStateToProps = (state) => {
  const {
    sideProjects: { selectSideProject },
  } = state;

  return {
    project: selectSideProject,
    // selectSideProject,
  };
};
// @inject('example')
// @observer
@connect(mapStateToProps)
class App extends React.Component {
  // constructor(props) {
  //   super(props);
  //   window.getBuildManageBuilding = this.getBuilding;
  // }
  state = {
    building: {},
    //交替隐藏两个组件
    Tmpl: null,
  };
  componentDidMount() {
    // console.log(this.props);
    const { project } = this.props;
    if (project.id) {
      this.getBuilding();
    }
  }
  componentDidUpdate(prevProps) {
    const { project } = this.props;
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.getBuilding();
    }
  }
  //查询楼宇信息
  getBuilding = () => {
    const { project } = this.props;
    const { id, name } = project;
    api
      .getBuildingList({
        projectId: id,
        // name,
        pageNum: 1,
        pageSize: 10,
      })
      .then((res) => {
        // console.log(res)
        const obj = {
          reload: this.getBuilding,
          building: res || {},
          projectId: id,
          name,
        };
        const arr = res ? res.list : [];
        this.setState({
          building: res || {},
          Tmpl: +arr.length === 0 ? <NoBuild {...obj} /> : <BuildLsit {...obj} />,
        });
      });
  };
  render() {
    const { Tmpl } = this.state;
    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>楼宇管理</Breadcrumb.Item>
        </Breadcrumb>
        <div className="build-manage-container" style={{ minHeight: window.screen.height - 280 }}>
          {/* <NoBuild /> */}
          {Tmpl}
          {/* {Tmpl && <Tmpl reload={this.getBuilding} building={building} />} */}
          {/* <BuildLsit /> */}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
