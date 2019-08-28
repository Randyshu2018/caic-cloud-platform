import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import './Author.scss';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Content from '../../components/Layout/Content';

export default class AuthorResult extends React.Component {
  state = {
    breadData: [{ path: '/', name: '授权管理' }],
  };
  render() {
    const { breadData } = this.state;

    return (
      <div className="bodyContainer">
        <Breadcrumb breadData={breadData} />
        <Content>
          <div style={{ textAlign: 'center', marginTop: '10%', height: '500px' }}>
            <img src={require('../../assets/icon_success.svg')} height="74" alt="success" />
            <p style={{ fontSize: '22px', margin: '15px 0px', fontWeight: 'bold' }}>数据授权成功</p>
            <Link to={`/author/index`}>
              <Button type="primary" className="buttonStyle">
                返回首页
              </Button>
            </Link>
          </div>
        </Content>
      </div>
    );
  }
}
