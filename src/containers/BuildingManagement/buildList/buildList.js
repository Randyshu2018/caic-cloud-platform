import React from 'react';
// import { Link } from 'react-router-dom';
import { Tooltip, Button, Pagination } from 'antd';
import '../style/index.scss';
import api from 'api';
// import { observer, inject } from 'mobx-react'
import ListTable from './listTable';
import { Paging } from 'func/commonTmpl';
import BuildOrEditor from './buildOrEditor';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { building = {} } = this.props;
    this.state = {
      renderList: (building.list || []).map((v, i) => {
        v.key = i;
        return v;
      }),
      current: 1,
      total: building.totalPages * 10 || 0,
      visible: false,
      type: 'new',
      buildDetai: {},
    };
  }
  getData = (obj = {}) => {
    const { projectId } = this.props;
    api
      .getBuildingList({
        projectId,
        // name,
        pageNum: 1,
        pageSize: 10,
        ...obj,
      })
      .then((res) => {
        this.setState({
          renderList: (res.list || []).map((v, i) => {
            v.key = i;
            return v;
          }),
          total: res.totalPages * 10 || 0,
        });
      });
  };
  change = (i) => {
    // console.log(i)
    this.setState({ current: i }, () => {
      this.getData({ pageNum: i });
    });
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  openModal = () => {
    this.setState({ visible: true, type: 'new', buildDetai: {} });
  };
  reload = () => {
    this.setState(
      {
        visible: false,
        current: 1,
      },
      () => {
        this.getData();
        window.getBuildNewsData && window.getBuildNewsData();
      }
    );
  };
  // 打开编辑
  openEditor = (res) => {
    this.setState({ visible: true, type: 'editor', buildDetai: res || {} });
  };
  // 获取楼宇信息 编辑的时候
  getBuildDetail = (buildingId) => {
    api.getBuilding({ buildingId }).then((res) => {
      if (res !== null) {
        this.openEditor(res);
      }
    });
  };
  openEditorModal = (id) => this.getBuildDetail(id);
  render() {
    const { current, total, renderList, visible, type, buildDetai } = this.state;
    return (
      <React.Fragment>
        <div className="build-list-title">
          <h1>楼宇列表</h1>
          <Button type="primary" onClick={this.openModal}>
            + 新建楼宇
          </Button>
        </div>
        <ListTable renderList={renderList} open={this.openEditorModal} />
        <Paging current={current} total={total} onChange={this.change} />
        {visible && (
          <BuildOrEditor
            handleCancel={this.handleCancel}
            reload={this.reload}
            type={type}
            detail={buildDetai}
          />
        )}
      </React.Fragment>
    );
  }
}
