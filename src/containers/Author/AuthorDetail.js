import React from 'react';
import { connect } from 'react-redux';
import './Author.scss';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Content from '../../components/Layout/Content';
import { Table, Button } from 'antd';
import AuthorServices from '../../services/author';
import { Link } from 'react-router-dom';

class AuthorDetail extends React.Component {
  state = {
    breadData: [
      {
        path: '/author/index',
        name: '授权管理',
      },
      {
        path: '/',
        name: '用户详情',
      },
    ],
    name: '',
    mobile: '',
    type: '',
    dataSource: [],
    licenseeId: '',
    authorizeId: '',
    totalNum: 0,
    currentPage: 1,
  };

  componentDidMount() {
    this.licenseeId = this.props.match.params.licenseId;

    this.fetchAuthorProjectList(1);
  }

  fetchAuthorProjectList = (pageNum) => {
    AuthorServices.fetchApiAuthorizeLicenseDetail({
      licenseId: this.licenseeId,
      pageNum,
      merchantId: this.props.merchantId,
    }).then(({ authorizeList, licensee, totalElements: totalNum }) => {
      const { licenseName, mobile, type, authorizeId } = licensee || {};
      this.setState({
        dataSource: authorizeList || [],
        name: licenseName,
        mobile,
        type,
        totalNum,
        authorizeId,
        currentPage: pageNum,
      });
    });
  };

  render() {
    const { breadData, dataSource, name, mobile, authorizeId, type } = this.state;
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
      },
      {
        title: '被授权人角色',
        dataIndex: 'licenseRole',
        key: 'licenseeRole',
      },
      {
        title: '授权有效期',
        dataIndex: 'datePeriod',
        key: 'datePeriod',
      },
      {
        title: '授权数据类型',
        dataIndex: 'sheetItems',
        key: 'sheetItems',
      },
      {
        title: '授权时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '操作员',
        dataIndex: 'operatorName',
        key: 'operatorName',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, { authorizeId, type, licenseName, uin }) => (
          <span>
            <span>
              <Link
                to={`/author/author-project-detail/${authorizeId}?licenseName=${licenseName}&type=${type}&uin=${uin}`}
              >
                查看
              </Link>
            </span>
            <span> | </span>
            <span>
              <Link to={`/author/update-author-project/${authorizeId}`}>编辑</Link>
            </span>
          </span>
        ),
      },
    ];

    return (
      <div className="authorDetailContainer">
        <Breadcrumb breadData={breadData} />
        <Content>
          <div className="projectName">
            <div className="eLeft" />
            <div className="eRight">
              <span style={{ marginLeft: '30px' }}>
                <Link to={'/author/index'}>
                  <Button type="primary" style={{ backgroundColor: '#3B5EFE' }}>
                    返回
                  </Button>
                </Link>
              </span>
            </div>
          </div>
          <div className="projectBase" style={{ marginTop: '0px' }}>
            <p>账号：{mobile}</p>
            <p>名称：{name} </p>
            <p>类型：{type}</p>
          </div>
          <div className="projectName" style={{ marginBottom: '30px' }}>
            <div className="eLeft">已授权项目</div>
            <div className="eRight">
              <span>
                <Link
                  to={
                    '/author/step-select-project/1/' +
                    this.licenseeId +
                    '/' +
                    mobile +
                    '/' +
                    name +
                    '/' +
                    type
                  }
                >
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#1ADAA5', borderColor: '#1ADAA5' }}
                  >
                    + 新增授权项目
                  </Button>
                </Link>
              </span>
            </div>
          </div>
          <Table
            rowKey="authorizeId"
            onHeaderCell={false}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              total: this.state.totalNum,
              current: this.state.currentPage,
              onChange: (page, pageSize) => {
                this.fetchAuthorProjectList(page);
              },
            }}
          />
        </Content>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { merchantId },
  } = state;

  return {
    merchantId,
  };
};

export default connect(mapStateToProps)(AuthorDetail);
