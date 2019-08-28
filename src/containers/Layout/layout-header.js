import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Popconfirm } from 'antd';
import './layout.scss';
import api from 'api';
class App extends React.Component {
  loginOut = () => {};
  render() {
    const user = (JSON.parse(localStorage.getItem('user')) || {}).loginAccount || {};
    const member = user.member || {};
    const mobile = member.mobile;
    return (
      <React.Fragment>
        <img src="/static/img/nav.png" className="qsl-layout-logo" alt="" />
        <ul className="qsl-layout-nav">
          <li className="active">资管云</li>
          <li>投管云</li>
          <li>帮助与支持</li>
          <li>个人中心</li>
        </ul>
        <div className="qsl-layout-blank" />
        <div className="qsl-user-news">
          <div className="news-img-container active">
            <img src="/static/img/news.png" className="active" alt="" />
          </div>
          <span className="user-img" />
          <Popconfirm
            title="确定要退出吗？"
            onConfirm={this.loginOut}
            onCancel={null}
            okText="退出"
            cancelText="取消"
            placement="rightBottom"
          >
            <span className="user-name">{mobile}</span>
          </Popconfirm>
        </div>
      </React.Fragment>
    );
  }
}
export default App;
