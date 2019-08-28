import React from 'react';
// import { Link } from 'react-router-dom';
// import { Breadcrumb } from 'antd';
import '../style/index.scss';
// import api from 'api';
// import { observer, inject } from 'mobx-react'
import BuildNews from './buildNews';
import BuildList from './buildList';
export default class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <BuildNews {...this.props} />
        <BuildList {...this.props} />
      </React.Fragment>
    );
  }
}
