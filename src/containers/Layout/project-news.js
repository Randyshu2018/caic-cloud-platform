import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './layout.scss';
import { LayoutSearchList } from './qsl-layout-search';
class App extends React.Component {
  state = {
    visible: false,
  };
  toggle = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };
  render() {
    const { visible } = this.state;
    return (
      <React.Fragment>
        <div className="qsl-layout-project-news">
          <img src="https://cn.bing.com/th?id=OIP.ABKjrBgVVjqziIvhhmlJAAHaNK&pid=Api&rs=" alt="" />
          <div className="project-news-title">
            <span>虹口大厦</span>
            {/* <span onClick={this.toggle} className={visible ? 'down' : ''}><Icon type="caret-right" /></span> */}
          </div>
          {/* {
            visible && <LayoutSearchList style={{ top: 115 }} />
          } */}
        </div>
      </React.Fragment>
    );
  }
}
export default App;
