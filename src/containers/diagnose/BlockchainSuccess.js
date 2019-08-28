import React from 'react';
import { Breadcrumb, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import './BlockchainSuccess.scss';

export default class BlockchainSuccess extends React.Component {
  state = {
    time: 10,
  };

  projectId = this.props.match.params.projectId;

  componentDidMount() {
    this.timer = setInterval(() => {
      let { time } = this.state;
      this.setState({ time: --time });

      if (time <= 0) {
        this.goHome();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  goHome = () => {
    this.props.history.push(`/asset-diagnose/history`);
  };

  render() {
    const { time } = this.state;
    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={`/asset-diagnose/history`}>历史诊断</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>历史诊断</Breadcrumb.Item>
        </Breadcrumb>
        <main className="blockchain-success text-center">
          <div className="blockchain-success-body text-left">
            <div className="title">
              <Icon type="check-circle" className="icon-check-circle" />数据上链成功!
            </div>
            <div className="tip">(1个工作日内生成体检结果可在秋实链APP端查看)</div>
            <div className="time">{time} 秒后返回首页</div>
            <Button type="primary" onClick={this.goHome}>
              立即返回
            </Button>
          </div>
        </main>
      </React.Fragment>
    );
  }
}
