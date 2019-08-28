import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './layout.scss';
export const LayoutSearchList = ({ style }) => {
  return (
    <ul className="search-list-contaner" style={style}>
      <li>
        <img src="https://cn.bing.com/th?id=OIP.wH4NwWimTAAx2XdZ6lnn4gHaNK&pid=Api&rs=1" alt="" />
        <span>虹口大厦</span>
      </li>
      <li>
        <img src="https://cn.bing.com/th?id=OIP.wH4NwWimTAAx2XdZ6lnn4gHaNK&pid=Api&rs=1" alt="" />
        <span>虹口大厦</span>
      </li>
      <li>
        <img src="https://cn.bing.com/th?id=OIP.wH4NwWimTAAx2XdZ6lnn4gHaNK&pid=Api&rs=1" alt="" />
        <span>虹口大厦</span>
      </li>
    </ul>
  );
};
class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="qsl-layout-search">
          <Icon type="search" style={{ marginLeft: 0 }} />
          <input type="text" placeholder="输入项目名称" />
          {/* <LayoutSearchList /> */}
        </div>
      </React.Fragment>
    );
  }
}
export default App;
