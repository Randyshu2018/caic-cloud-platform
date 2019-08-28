/**
 * VIEW 高阶组件
 * feat:
 * 1. 注入redux connect连接器
 * 2. 模块公用抛错块
 */
import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'antd';
import { hasAssetProjectId, hasBusinessType } from 'src/containers/Property/configData/asyncData';
import { Link } from 'react-router-dom';

function CommponentAlert(props, type = 'info') {
  const descriptionType = {
    info: () => (
      <span>
        业态“{props.businessType}”不存在。
        此项目，不能添加资管信息，请尝试重新切换其他项目，在进行操作。如有疑问，请联系线下管理员。
      </span>
    ),
    other: () => (
      <span>
        请先添加项目资管信息,才能进行此操作
        <Link to="/property/info" style={{ marginLeft: '20px' }}>
          点击添加
        </Link>
      </span>
    ),
  };
  return <Alert message="提示" description={descriptionType[type]()} type="info" showIcon />;
}

const mapStateToProps = (state) => {
  const { selectSideProject = {} } = state.sideProjects;
  const assetProjectDto = selectSideProject.assetProjectDto;
  return {
    $$sideProjects: { ...selectSideProject },
    selectSideProject,
    assetProjectName: selectSideProject.name,
    assetProjectId: assetProjectDto.id,
  };
};

const View = (Comp) => {
  @connect(mapStateToProps)
  class VIEWComponent extends Comp {
    render() {
      // console.log('VIEWComponent.props', this.props);
      const {
        selectSideProject,
        location: { pathname },
      } =
        this.props || {};
      const asssetProjectId = hasAssetProjectId(selectSideProject);
      // 资管id不存在，需要创建项目资管信息
      if (!asssetProjectId) {
        let type = 'other';
        // 只有页面为当前路由时，才能创建
        if (pathname === '/property/info') {
          // 业态如果不存在，则需要提示
          if (!hasBusinessType(selectSideProject.businessType)) {
            type = 'info';
          } else {
            return super.render({ asssetProjectId, ...this.props }, this.state);
          }
        }
        return CommponentAlert({ businessType: selectSideProject.businessType }, type);
      }
      return super.render({ asssetProjectId, ...this.props }, this.state);
    }
  }
  return VIEWComponent;
};
export default View;
