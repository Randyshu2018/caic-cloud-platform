import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import blank from '../img/blank.png';
import Form from './form';
import './NoBuilding.scss';

export class App extends React.Component {
  static propTypes = {
    reload: PropTypes.func,
  };

  state = {
    visible: true,
  };
  handleCancel = () => {
    this.setState({ visible: false });
  };
  openModal = () => {
    this.setState({ visible: true });
  };
  reload = () => {
    const { reload } = this.props;
    this.setState(
      {
        visible: false,
      },
      reload
    );
  };
  render() {
    const { visible } = this.state;
    return (
      <React.Fragment>
        <div className="no-build-container">
          <img src={blank} alt="" />
          <div>暂无信息</div>
          <span>暂没有楼宇信息，请完善资料</span>
          <button onClick={this.openModal}>完善信息</button>
        </div>
        <Modal
          title="创建楼宇"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="730px"
          footer={null}
        >
          <Form close={this.handleCancel} reload={this.reload}>
            <Button onClick={this.handleCancel}>取消</Button>
            <span style={{ padding: 10 }} />
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
export default App;
