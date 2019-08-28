import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Consumer } from 'src/context/index';
import PropTypes from 'prop-types';
import { Layout, Menu, Select, Icon } from 'antd';
import { chooseProject } from 'src/reducers/login';
import {
  isArray,
  isEmpty,
  isDefined,
  getStorageObj,
  saveSelectSignProject,
} from 'src/modules/utils';
import { SELECT_SIGN_PROJECT } from 'src/modules/ENUM';
import './Sider.scss';

const { Sider } = Layout;
const { Option } = Select;

@Consumer
class SiderBar extends Component {
  static propTypes = {
    currentKey: PropTypes.string,
  };

  static defaultProps = {
    currentKey: '1',
  };

  constructor(props) {
    super(props);
    this.state = {
      currentKey: this.props.currentKey,
    };
  }

  projects = this.props.allProjects.filter(({ signSuccess }) => signSuccess);

  componentWillReceiveProps = (nextProps) => {
    const router = {
      '/operation/build-manage': '4-1',
      '/property/info': '5-1',
    };
    const pathName = nextProps.location.pathname;
    if (Object.hasOwnProperty.call(router, pathName)) {
      this.setState({
        currentKey: router[pathName],
      });
    }
    if (nextProps.location.pathname === '/property/info') {
      this.setState({
        currentKey: '5-1',
      });
    }
  };

  componentDidMount() {
    // console.log(this.props)
    const {
      projects,
      props: { projectId, selectSideProject },
    } = this;

    if (isDefined(projectId) && !isEmpty(selectSideProject)) {
      //
    }
    // 当刷新页面时，设置第一条为选中签约项目
    else if (isArray(projects) && projects.length > 0) {
      const { id } = getStorageObj(SELECT_SIGN_PROJECT);

      const project = projects.find(({ id: _id }) => _id === id) || projects[0];

      this.props.dispatch(chooseProject(project));
    } else {
      this.props.history.replace('/');
    }
  }

  handleClick = (e) => {
    let key = e.key;
    if (key.indexOf('sub') > -1) return;
    this.setState({
      currentKey: key,
    });
  };

  onSelect = (id) => {
    const selectProject = this.projects.find(({ id: _id }) => _id === id) || {};
    saveSelectSignProject({ id: selectProject.id });
    this.props.dispatch(chooseProject(selectProject));
    this.props.history.replace('/combo/index');
  };

  filterSubMenu(value, list = [], key = 'url') {
    let result = null;
    if (!(list instanceof Array)) return result;
    result = list.find((item) => value.indexOf(`${item[key]}`) > -1);
    return result;
  }

  //获取侧边菜单是否只展示运营管理
  getAuthSideList = (selectSideProject) => {
    if (!selectSideProject) {
      return false;
    }
    const origServiceList = selectSideProject.pkg && selectSideProject.pkg.origServiceList;
    if (!origServiceList) {
      return false;
    }
    let isOk = false;
    origServiceList.forEach((item) => {
      if (item.code === 'OM') {
        isOk = true;
      }
    });
    return isOk;
  };

  render() {
    const {
      projects,
      props: { selectSideProject, location = {} },
      state: { currentKey },
    } = this;

    const { businessType } = this.props.selectSideProject;

    const isOnlyShowOperation = this.getAuthSideList(this.props.selectSideProject);

    const renderIcon = (icon) => (
      <img
        src={require(`src/assets/${icon}.svg`)}
        style={{
          marginRight: '8px',
          height: '15px',
        }}
        alt=""
      />
    );

    // 该项菜单只有在项目业态为OFFICE时才需要展示
    // 获取当前选中业态项 this.props.selectSideProject
    const operation = {
      code: 'operation',
      businessType: 'OFFICE',
      key: '4',
      name: '运营管理',
      renderIcon: renderIcon('icon_menu2'),
      children: [
        {
          name: '楼宇管理',
          url: '/operation/build-manage',
          key: '4-1',
        },
        {
          name: '合同管理',
          url: '/operation/rent/index',
          key: '4-3',
        },
        {
          name: '招商管理',
          url: '/operation/management',
          key: '4-2',
        },
        {
          name: '账单管理',
          url: '/operation/bill/index',
          key: '4-4',
        },
        {
          name: '保证金明细',
          url: '/operation/deposit/index',
          key: '4-5',
        },
        {
          name: '收入确认',
          url: '/operation/income/index',
          key: '4-6',
        },
      ],
    };
    let diagnose = {
      code: 'asset-diagnose',
      key: '2',
      children: [],
      name: '资产诊断',
      url: `/asset-diagnose/history`,
    };
    let menuData = [
      {
        code: 'combo',
        key: '0',
        children: [],
        name: '套餐总览',
        url: '/combo/index',
        renderIcon: renderIcon('icon_menu1'),
      },
      // {
      //   code: 'task',
      //   key: '1',
      //   children: [],
      //   name: '任务管理',
      //   url: `/task/detail/${projectId}`, //query assetType
      // },
      {
        code: 'property',
        key: '5',
        name: '资产管理',
        children: [
          {
            name: '项目资管信息',
            url: '/property/info',
            key: '5-1',
          },
          {
            name: '年度数据',
            url: '/property/year-data',
            key: '5-2',
          },
          {
            name: '月度数据',
            url: '/property/monthly-data/list',
            key: '5-3',
          },
          {
            name: '编辑月度数据',
            url: '/property/monthly-data/details',
            key: '5-3',
            showSubMenu: false,
          },
        ],
      },
      {
        code: 'autor',
        key: '3',
        children: [],
        name: '授权管理',
        url: '/author/index',
        renderIcon: renderIcon('icon_menu5'),
      },
    ];

    businessType === 'OFFICE' && menuData.splice(1, 0, operation);
    businessType === 'OFFICE' && menuData.splice(3, 0, diagnose);
    // if (isOnlyShowOperation) {
    //   menuData = [];
    //   menuData.push(operation);
    // }
    const defaultOpenKeys = [];
    const defaultSelectedKeys = [currentKey];
    const subMenu = menuData.find((item) => item.key === currentKey && !!item.children.length);
    if (!!subMenu) {
      defaultOpenKeys.push(subMenu.key);
      const isKeys = this.filterSubMenu(location.pathname, subMenu.children);
      defaultSelectedKeys.pop();
      defaultSelectedKeys.push(isKeys && isKeys.key);
    }

    return (
      <Sider width={230} className="eju-sider-menu">
        <div className="side-select-dark">
          <Select
            style={{ width: '100%' }}
            size={'large'}
            suffixIcon={<Icon type="caret-down" />}
            value={selectSideProject.id}
            onSelect={this.onSelect}
          >
            {projects.map(({ id, name }) => {
              return (
                <Option value={id} key={id}>
                  {name}
                </Option>
              );
            })}
          </Select>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={defaultSelectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          onClick={this.handleClick}
          style={{ borderRight: 0 }}
        >
          {menuData.map((item, index) => {
            const children = [];
            const menuItem = ({ url, name, key, showSubMenu = true }) => {
              return showSubMenu ? (
                <Menu.Item key={key}>
                  <Link to={url} style={{ paddingLeft: '16px' }} replace>
                    {item.renderIcon ? item.renderIcon : <Icon type="file-text" />}
                    {name}
                  </Link>
                </Menu.Item>
              ) : null;
            };
            if (item.children.length) {
              children.push(
                <Menu.SubMenu
                  key={item.key}
                  title={
                    <span style={{ paddingLeft: '16px' }}>
                      <Icon type="appstore" />
                      {item.name}
                    </span>
                  }
                >
                  {item.children.map((item) => menuItem({ ...item }))}
                </Menu.SubMenu>
              );
            } else {
              children.push(menuItem({ ...item, index }));
            }
            return children;
          })}
        </Menu>
      </Sider>
    );
  }
}

const mapStateToProps = (state) => {
  const { allProjects, projectId, merchantId, selectSideProject } = state.sideProjects;

  return {
    allProjects,
    projectId,
    merchantId,
    selectSideProject,
  };
};

export default connect(mapStateToProps)(withRouter(SiderBar));
