import React, { Component } from 'react';
import { Modal } from 'antd';

export default class component extends Component {
  state = {};

  render() {
    const childrenTitle = (
      <div className="details-modal-title">
        <h3>提示</h3>
      </div>
    );
    return (
      <Modal
        title={childrenTitle}
        visible={this.props.visible}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
        okText="确认上链"
      >
        <p>请谨慎上链，上链后的资料不可篡改，记录在区块链中。</p>
      </Modal>
    );
  }
}
