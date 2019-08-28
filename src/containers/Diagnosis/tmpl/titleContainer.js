import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import '../style/style.scss';

class App extends React.Component {
  render() {
    const { title, extra, children } = this.props;
    return (
      <React.Fragment>
        <div className="dia-title-container">
          <div className="dia-title-container-title">
            <h3>{title}</h3>
            <span>{extra}</span>
          </div>
          <div className="dia-title-container-conent">{children}</div>
        </div>
      </React.Fragment>
    );
  }
}
export default App;
