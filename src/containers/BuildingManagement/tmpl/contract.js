import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Drawer, Row, Col, Form, Button, message, Icon } from 'antd';
import '../style/index.scss';
import api from 'api';
import PackageCon from '../packageContract';
import Contract from './createConstract';
class App extends Component {
  state = {};
  render() {
    const { close, isBlank } = this.props;
    return (
      <React.Fragment>
        <Drawer
          title={isBlank ? '新建租赁合同' : '合同详情'}
          width={720}
          onClose={close}
          visible={true}
        >
          <PackageCon isBlank={isBlank} first={<Contract {...this.props} />} />
        </Drawer>
      </React.Fragment>
    );
  }
}
export default App;
