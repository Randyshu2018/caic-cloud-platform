import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './style/style.scss';
import LayoutCon from '../Layout';
import Zdzs from './tmpl/zdzs';
class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <LayoutCon>
          <Zdzs />
        </LayoutCon>
      </React.Fragment>
    );
  }
}
export default App;
