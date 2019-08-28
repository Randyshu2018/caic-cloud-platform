import React from 'react';
import './Author.scss';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Content from '../../components/Layout/Content';
import UpdateFormBlock from './components/InputBlock/UpdateFormBlock';
import { MobileCode } from './components/MobileCode';
import { AuthorizeServices } from '../../services/author';
import { Spin } from 'antd';
import { getStorageObj } from '../../modules/utils';

export default class UpdateAuthorProject extends React.Component {
  static get operatorId() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return memberId;
  }

  get authorizeId() {
    return this.props.match.params.authorizeId;
  }

  state = {
    loadingShow: false,
    authorize: {},
    codeModelVisible: false,
  };

  project = {};

  componentDidMount() {
    new AuthorizeServices()
      .fetchAuthorizeDetail({ preAuthId: this.authorizeId })
      .then((authorize) => {
        this.setState({ authorize });
      });
  }

  updateAuthorize = () => {
    const { beginMonth, endMonth, roleType } = this.formData;

    const { memberId, memberPhone, assetProjectId } = this.state.authorize;

    new AuthorizeServices()
      .updateAuthorize({
        id: this.authorizeId,
        beginMonth,
        endMonth,
        roleType,
        memberId,
        memberPhone,
        assetProjectId,
        operatorId: UpdateAuthorProject.operatorId,
      })
      .then((data) => {
        this.props.history.push('/author/author-result');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  submit = (params) => {
    this.formData = params;
    this.setState({ codeModelVisible: true });
  };

  render() {
    const { authorize, loadingShow, codeModelVisible } = this.state;
    const { assetProjectName, memberName, memberPhone } = authorize;

    return (
      <div className="stepUpdateProjectContainer">
        <Breadcrumb
          breadData={[
            {
              path: '/author/index',
              name: '授权管理',
            },
            {
              path: '/',
              name: '修改授权项目',
            },
          ]}
        />
        <Content>
          <h1 className="asset-project-name">{this.props.projectName || assetProjectName}</h1>
          <div style={{ margin: '20px 0', fontSize: 16 }}>
            <span style={{ marginRight: 40 }}>姓名：{memberName}</span>
            <span>手机号：{memberPhone}</span>
          </div>
          <div style={{ borderTop: '1px solid #EFF3F8', paddingTop: 30 }}>
            <UpdateFormBlock
              authorize={authorize}
              handleSubmit={this.submit}
              style={{ height: '400px' }}
            />
          </div>
        </Content>
        <MobileCode visible={codeModelVisible} onOk={this.updateAuthorize} />
        {loadingShow && (
          <div className="loading">
            <Spin tip="提交中" />
          </div>
        )}
      </div>
    );
  }
}
