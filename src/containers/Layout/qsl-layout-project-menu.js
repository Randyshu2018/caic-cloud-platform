import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './layout.scss';
import api from 'api';
class App extends React.Component {
  state = {
    list: [],
  };
  componentDidMount() {
    this.getData();
  }
  getData = (pageNum = 1) => {
    const user = (JSON.parse(localStorage.getItem('user')) || {}).loginAccount || {};
    const member = user.member || {};
    api
      .getProjectList({
        memberId: +member.memberId,
        pageSize: 10,
        pageNum,
      })
      .then((res) => {
        console.log(res);
        this.setState({ list: res.list || [] });
        localStorage.setItem('projectList', JSON.stringify(res.list || []));
      });
  };
  render() {
    const { list } = this.state;
    return (
      <React.Fragment>
        <ul className="qsl-layout-project-menu">
          {list.map((v, i) => {
            return (
              <li key={i}>
                <img
                  src="https://cn.bing.com/th?id=OIP.ABKjrBgVVjqziIvhhmlJAAHaNK&pid=Api&rs=1"
                  alt="图片载入中"
                />
                <span>{v.name}</span>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}
export default App;
