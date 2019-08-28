import React from 'react';
import { Layout, Menu, Breadcrumb, Icon, Popconfirm } from 'antd';
import './layout.scss';
import QslLayoutSearch from './qsl-layout-search';
import ProjectNews from './project-news';
import ProjectMenu from './qsl-layout-project-menu';
import LayoutHeader from './layout-header';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends React.Component {
  loginOut = () => {};
  render() {
    return (
      <div className="qsl-layout">
        <Layout style={{ minHeight: '100vh' }}>
          <Header className="header">
            <LayoutHeader />
          </Header>
          <Layout style={{ background: '#fff' }}>
            <Sider
              width={240}
              style={{
                background: '#fff',
                overflow: 'auto',
                position: 'relative',
                minHeight: window.innerHeight - 80,
              }}
            >
              <QslLayoutSearch />
              <ProjectNews />
              <ProjectMenu />
              <div className="create-project-container">
                <button>创建项目</button>
              </div>
            </Sider>
            <Layout style={{ padding: 24, background: '#F3F3FA' }}>
              <Content
                style={{
                  margin: 0,
                  minHeight: 280,
                }}
              >
                {this.props.children}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    );
  }
}
export default App;
