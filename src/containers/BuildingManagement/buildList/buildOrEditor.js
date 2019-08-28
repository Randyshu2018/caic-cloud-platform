import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import Form from '../noBuild/form';

export class App extends React.Component {
  static propTypes = {
    reload: PropTypes.func,
  };
  render() {
    // const { visible } = this.state;
    const { type, handleCancel, reload, detail } = this.props;
    return (
      <React.Fragment>
        <Modal
          title={type === 'new' ? '创建楼宇' : '编辑楼宇'}
          visible
          // onOk={handleOk}
          onCancel={handleCancel}
          width="730px"
          footer={null}
        >
          <Form close={handleCancel} reload={reload} detail={detail}>
            <Button onClick={handleCancel}>取消</Button>
            <span style={{ padding: 10 }} />
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
export default App;
