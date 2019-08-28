import React from 'react';
import './Author.scss';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Content from '../../components/Layout/Content';
import { Table, Tabs } from 'antd';
import { AuthorizeServices } from '../../services/author';

const TabPane = Tabs.TabPane;

export default class AuthorProjectDetail extends React.Component {
  get authorizeId() {
    return this.props.match.params.authorizeId;
  }

  state = {
    authorize: {},
  };

  componentDidMount() {
    this.fetchAuthorizeDetail({});
  }

  fetchAuthorizeDetail({ preAuthId = this.authorizeId, pageNum = 1, pageSize = 10 }) {
    new AuthorizeServices()
      .fetchAuthorizeAllDetail({ preAuthId, pageNum, pageSize })
      .then((authorize) => {
        authorize.authorizePage = authorize.authorizePage || {};
        authorize.historyPage = authorize.historyPage || {};

        this.setState({ authorize });
      });
  }

  render() {
    const {
      authorize: {
        assetProjectName,
        memberPhone,
        memberName,
        authorizePage = {},
        historyPage = {},
      },
    } = this.state;

    const columns = [
      {
        title: '周期',
        dataIndex: 'period',
        align: 'center',
      },
      {
        title: '运营数据',
        dataIndex: 'authStatus',
        align: 'center',
      },
    ];

    const historyColumns = [
      {
        title: '授权编号',
        dataIndex: 'authId',
      },
      {
        title: '账户',
        dataIndex: 'memberPhone',
      },
      {
        title: '被授权人角色',
        dataIndex: 'roleType',
      },
      {
        title: '授权时间',
        dataIndex: 'authDate',
      },
      {
        title: '授权有效期',
        dataIndex: 'dateRange',
      },
      {
        title: '操作员',
        dataIndex: 'operatorName',
      },
      {
        title: '状态',
        dataIndex: 'statusMsg',
      },
    ];

    return (
      <div className="authorDetailContainer">
        <Breadcrumb
          breadData={[
            {
              path: '/author/index',
              name: '授权管理',
            },
            {
              path: '/',
              name: '历史授权',
            },
          ]}
        />
        <Content>
          <h1 className="asset-project-name">{assetProjectName}</h1>
          <div style={{ margin: '20px 0', fontSize: 16 }}>
            <span style={{ marginRight: 40 }}>姓名：{memberName}</span>
            <span>手机号：{memberPhone}</span>
          </div>
          <Tabs defaultActiveKey="1">
            <TabPane tab="已授权数据" key="1">
              <Table
                rowKey="id"
                columns={columns}
                dataSource={authorizePage.list || []}
                pagination={{
                  total: authorizePage.totalElements,
                  onChange: (pageNum, pageSize) => {
                    this.fetchAuthorizeDetail({ pageNum });
                  },
                }}
              />
            </TabPane>
            <TabPane tab="授权历史" key="2">
              <Table
                rowKey="authId"
                columns={historyColumns}
                dataSource={historyPage.list || []}
                pagination={{
                  total: historyPage.totalElements,
                  onChange: (pageNum, pageSize) => {
                    this.fetchAuthorizeDetail({ pageNum });
                  },
                }}
              />
            </TabPane>
          </Tabs>
        </Content>
      </div>
    );
  }
}
