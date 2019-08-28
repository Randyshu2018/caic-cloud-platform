import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon, Dropdown } from 'antd';
import logo from '../../assets/icon_logo.svg';
import { getStorageObj, clearStorage } from '../../modules/utils';
import { UserService } from '../../services/login';
import './TopHeader.scss';

const { Header } = Layout;

class TopHeader extends Component {
  state = {};

  logout = () => {
    new UserService().logout();
    clearStorage();
    this.props.history.push('/login');
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item onClick={this.logout}>退出</Menu.Item>
      </Menu>
    );
    const { loginAccount: { member: { mobile: name } = {} } = {} } = getStorageObj('user');

    return (
      <Header className="top-header eju-flex eju-flex-between eju-flex-a">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="秋实链" />
          </Link>
        </div>
        <div className="eju-flex eju-flex-between eju-flex-a">
          <div
            className="order eju-flex eju-flex-a"
            onClick={() => {
              const {
                location: { pathname },
                history: { push },
              } = this.props;
              const path = '/orders/center';
              path !== pathname && push(path);
            }}
          >
            <Icon type="profile" />
            订单中心
          </div>
          <Dropdown overlay={menu} className="header-login-user">
            <span style={{ color: '#fff', cursor: 'pointer' }}>
              <Icon type="user" />
              <span style={{ marginLeft: '3px' }}>{name}</span>
              <Icon type="down" />
            </span>
          </Dropdown>
        </div>
      </Header>
    );
  }
}

export default withRouter(TopHeader);
