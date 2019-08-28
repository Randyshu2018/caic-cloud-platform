import React, { Component } from 'react';
import NProgress from 'nprogress';
import { connect } from 'react-redux';
import { Spin, Drawer } from 'antd';
import FormLayout from 'src/components/Form/rentForm';
import '../style/index.scss';
import contractConfig from './contractConfig';
import api from 'api';
import BaseInfo from './baseInfo';
import PackageCon from 'src/containers/BuildingManagement/packageContract';
import * as Context from 'src/containers/Rent/context';

const { ContextComponent } = Context;
class newRent extends Component {
  state = {
    visible: false,
    selectTab: 0,
    tabInfo: null,
  };

  componentDidMount() {
    const { project, callback } = this.props;
    this.handleTabInfo(0);
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  };
  handleTab = (index) => {
    this.setState({
      selectTab: index,
    });
    this.handleTabInfo(index);
  };
  handleTabInfo = (selectTab) => {
    let children = '';
    switch (selectTab) {
      case 0:
        children = <BaseInfo noNewPro={this.props.noNewPro} id={this.props.id} />;
        break;
      case 1:
        children = <div>222</div>;
        break;
      default:
        children = <div>333</div>;
        break;
    }
    this.setState({
      tabInfo: children,
    });
  };
  render() {
    const { noNewPro, close, id, contractId } = this.props;
    const { selectTab, tabInfo } = this.state;
    const tabList = [
      {
        title: '基本信息',
      },
      {
        title: '费用服务',
      },
      {
        title: '收入确认',
      },
    ];
    return (
      <div className="newRent">
        <Drawer
          className="rent-container"
          title={noNewPro ? `新建租赁合同` : `租赁合同详情`}
          width={720}
          onClose={() => close(false)}
          visible
        >
          {/* <div className="tabList">
            {tabList.map((item, index) => {
              return (
                <span className="tab" onClick={() => this.handleTab(index)}>
                  <span className={index === selectTab ? 'selectTab' : ''}>{item.title}</span>
                </span>
              );
            })}
          </div>
          <div className="tabInfo">{tabInfo}</div> */}
          <PackageCon
            isBlank={noNewPro}
            contractId={id || contractId}
            onClose={close}
            first={<BaseInfo {...this.props} />}
          />
        </Drawer>
      </div>
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

export default connect(mapStateToProps)(newRent);
