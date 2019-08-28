import React, { Component } from 'react';
import { Layout } from 'antd';
import { TopHeader, SiderBar } from 'src/components/Layout/index';

export default class Body extends Component {
  render() {
    const { currentKey, children } = this.props;

    return (
      <Layout>
        <TopHeader />
        <Layout>
          <SiderBar currentKey={currentKey} />
          <Layout.Content style={{ minHeight: 'calc( 100vh - 64px )', padding: 20 }}>
            {children}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
