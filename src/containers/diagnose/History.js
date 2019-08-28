import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Col, Row, Table, Alert } from 'antd';
import { DiagnoseServices } from '../../services/diagnoseServices';
import { getStorage } from '../../modules/utils';
import { DiagnoseStatus, defaultRender as render } from './diagnoseComponents';

import './History.scss';

const columns = [
  {
    title: '诊断数据上传时间',
    dataIndex: 'submitDate',
    render,
  },
  {
    title: '诊断结果生成时间',
    dataIndex: 'resultDate',
    rowClassName: 'text-center',
    className: 'text-center',
    render,
  },
  {
    title: '价值诊断',
    dataIndex: 'diagnoseMap',
    key: 'diagnoseMap.valueDiagnose',
    rowClassName: 'text-center',
    className: 'text-center',
    render(diagnoseMap) {
      const { valueDiagnose } = diagnoseMap || {};

      return <DiagnoseStatus status={valueDiagnose} />;
    },
  },
  {
    title: '运营诊断',
    dataIndex: 'diagnoseMap',
    key: 'diagnoseMap.operateDiagnose',
    rowClassName: 'text-center',
    className: 'text-center',
    render(diagnoseMap) {
      const { operateDiagnose } = diagnoseMap || {};

      return <DiagnoseStatus status={operateDiagnose} />;
    },
  },
  {
    title: '资产诊断',
    dataIndex: 'diagnoseMap',
    key: 'diagnoseMap.assetDiagnose',
    rowClassName: 'text-center',
    className: 'text-center',
    render(diagnoseMap) {
      const { assetDiagnose } = diagnoseMap || {};

      return <DiagnoseStatus status={assetDiagnose} />;
    },
  },
  {
    title: '交易诊断',
    dataIndex: 'diagnoseMap',
    key: 'diagnoseMap.tradeDiagnose',
    rowClassName: 'text-center',
    className: 'text-center',
    render(diagnoseMap) {
      const { tradeDiagnose } = diagnoseMap || {};

      return <DiagnoseStatus status={tradeDiagnose} />;
    },
  },
  {
    title: '财务诊断',
    dataIndex: '',
    rowClassName: 'text-center',
    className: 'text-center',
    render() {
      return <DiagnoseStatus status={false} />;
    },
  },
  {
    title: '融资诊断',
    dataIndex: '',
    rowClassName: 'text-center',
    className: 'text-center',
    render() {
      return <DiagnoseStatus status={false} />;
    },
  },
];

class DiagnoseHistory extends React.Component {
  state = {
    loading: false,
    diagnoses: {},
    pageSize: 10,
  };

  //   merchantId = getStorage('merchantId');

  componentDidMount() {
    this.fetchDiagnoseHistory({});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId !== this.props.projectId) {
      this.fetchDiagnoseHistory({}, nextProps.projectId);
    }
  }

  fetchDiagnoseHistory = ({ pageNum = 1, pageSize = this.state.pageSize }, _projectId) => {
    const { projectId } = this.props;
    // console.log('projectId', projectId);

    this.setState({ loading: true });
    new DiagnoseServices()
      .fetchDiagnoseHistory({
        projectId: _projectId || projectId,
        merchantId: this.props.merchantId,
        pageNum,
        pageSize,
      })
      .then((diagnoses) => {
        this.setState({ diagnoses });
      })
      ['finally'](() => {
        this.setState({ loading: false });
      });
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    this.fetchDiagnoseHistory({ pageSize });
  };

  pageChange = (pageNum) => {
    this.fetchDiagnoseHistory({ pageNum });
  };

  render() {
    const {
      loading,
      diagnoses: { diagnoseCentreList = [], total = 0 },
      pageSize,
    } = this.state;

    const {
      match: {
        params: { projectId },
      },
      projectName,
    } = this.props;

    if (!this.props.projectId) {
      return (
        <Alert
          message="提示"
          description={
            <span>
              请先添加项目资管信息,才能进行此操作
              <Link to="/property/info" style={{ marginLeft: '20px' }}>
                点击添加
              </Link>
            </span>
          }
          type="info"
          showIcon
        />
      );
    }

    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          {/*<Breadcrumb.Item>
            <Link to={'/asset-diagnose/center'}>诊断中心</Link>
          </Breadcrumb.Item>*/}
          <Breadcrumb.Item>历史诊断</Breadcrumb.Item>
        </Breadcrumb>
        <div className="diagnose-history" style={{ minHeight: window.screen.height - 280 }}>
          <header className="diagnose-history-header">
            <Row>
              <Col span={18}>
                <div className="diagnose-history-title">
                  <h1 className="title">{projectName}</h1>
                  <div className="tip">历史上链诊断数据</div>
                </div>
              </Col>
              <Col span={6}>
                <div className="text-right">
                  <Link
                    to={`/asset-diagnose/update-work/${this.props.projectId}/1`}
                    className="ant-btn ant-btn-primary"
                  >
                    新的诊断
                  </Link>
                </div>
              </Col>
            </Row>
          </header>
          <div className="diagnose-history-content">
            <Table
              rowKey={() => Math.random().toString()}
              columns={columns}
              dataSource={diagnoseCentreList}
              loading={loading}
              pagination={{
                total,
                pageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.pageChange,
                onShowSizeChange: this.onShowSizeChange,
              }}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { signedProjects, projectId },
  } = state;

  const { name: projectName } =
    signedProjects.find(({ assetProjectDto: { id } }) => id === projectId) || {};

  return {
    projectId,
    projectName,
  };
};

export default connect(mapStateToProps)(DiagnoseHistory);
