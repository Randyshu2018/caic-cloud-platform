import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import '../style/style.scss';
import TitleContainer from './titleContainer';
class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <TitleContainer title="诊断综述" extra="fdsafds">
          我是一只小小鸟，却怎么飞都飞不高
        </TitleContainer>
      </React.Fragment>
    );
  }
}
export default App;
