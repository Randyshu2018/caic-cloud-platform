import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Steps from '../../components/Steps/Steps';
import Content from '../../components/Layout/Content';
import FormBlock from './components/InputBlock/FormBlock';
import { MobileCode } from './components/MobileCode';
import { AuthorizeServices } from '../../services/author';
import { getStorageObj } from '../../modules/utils';
import { stepsData } from './authorizeBase';
import './Author.scss';

const breadData = [
  {
    path: '/author/index',
    name: '授权管理',
  },
  {
    path: '/',
    name: '新增授权账号',
  },
];

class StepSelectProject extends React.Component {
  static seconds = 60;

  time = StepSelectProject.seconds;

  state = {
    loadingShow: false,
    codeModelVisible: false,
    confirmLoading: false,
    mobileCode: [],
    codeText: '',
  };

  static get memberId() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return memberId;
  }

  get params() {
    return this.props.match.params;
  }

  componentDidMount() {}

  formData = {};

  openSendCode = (params) => {
    this.formData = params;
    this.setState({ codeModelVisible: true });
  };

  createAuthorize = (params) => {
    const { projectId } = this.props;
    const { mobile, licenseId } = this.params;

    const p = {
      ...params,
      memberPhone: mobile,
      memberId: licenseId,
      operatorId: StepSelectProject.memberId,
      assetProjectId: projectId,
    };

    this.setState({ loadingShow: true });

    new AuthorizeServices()
      .createAuthorize(p)
      .then((data) => {
        this.props.history.push(`/author/author-result`);
      })
      .catch(() => {
        this.setState({ loadingShow: false });
      });
  };

  render() {
    const { loadingShow, codeModelVisible } = this.state;
    const { mobile, name, type, lType } = this.params;

    return (
      <div className="stepSelectProjectContainer">
        <Breadcrumb breadData={breadData} />
        {type === '0' && <Steps stepsData={stepsData} current={2} />}
        <Content>
          <FormBlock mobile={mobile} name={name} lType={lType} handleSubmit={this.openSendCode} />
        </Content>
        <MobileCode
          visible={codeModelVisible}
          onOk={() => {
            this.createAuthorize(this.formData);
          }}
        />
        {loadingShow && (
          <div className="loading">
            <Spin tip="提交中" />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { projectId, merchantId },
  } = state;

  return {
    projectId,
    merchantId,
  };
};

export default connect(mapStateToProps)(StepSelectProject);
