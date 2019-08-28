import React from 'react';
import { Alert } from 'antd';
import { Link } from 'react-router-dom';

export default class BasePage extends React.Component {
  componentDidMount() {}

  componentWillUpdate() {}

  //展示空态页
  showAlert = () => {
    return (
      <Alert
        message="提示"
        description={
          <span>
            请先添加楼宇管理信息,才能进行此操作
            <Link to="/operation/build-manage" style={{ marginLeft: '20px' }}>
              点击添加
            </Link>
          </span>
        }
        type="info"
        showIcon
      />
    );
  };

  render() {
    return <div />;
  }
}
