import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Icon, Input, Row, Col, Select, Button, Pagination, Spin, Modal } from 'antd';
import Cookie from 'js-cookie';
import { assets, TRIAL_EXPIRE_MODAL } from '../../modules/ENUM';
import { format } from '../../modules/date';
import { getStorageObj, saveSelectSignProject } from '../../modules/utils';
import { fetchSignProjectsIfNeed, chooseProject } from '../../reducers/login';
// import { fetchCityIfNeed } from '../../reducers/city';
import './Home.scss';
const antIcon = <Icon type="loading" style={{ fontSize: 28 }} spin />;

const { Option } = Select;

class Home extends React.Component {
  state = {
    businessType: void 0,
    cityCode: void 0,
    name: void 0,
    trial: {
      upgradeModalVisible: false,
      expireDay: null,
      orderId: null,
    },
  };

  static get memberId() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return memberId;
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });

    this.fetchSignProjects({ pageNum: this.props.pageNum }).then(() => {
      this.setState({
        isLoading: false,
      });
    });
    // this.props.dispatch(fetchCityIfNeed());
  }

  fetchSignProjects = ({
    memberId = Home.memberId,
    cityCode = this.state.cityCode,
    businessType = this.state.businessType,
    name = this.state.name,
    pageNum = 1,
    pageSize = this.props.pageSize,
  } = {}) => {
    return this.props.dispatch(
      fetchSignProjectsIfNeed({ memberId, cityCode, businessType, name, pageNum, pageSize })
    );
  };

  chooseCity = (cityCode) => {
    this.setState({ cityCode });
  };

  chooseAsset = (businessType) => {
    this.setState({ businessType });
  };

  onNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  upgrade = (orderId) => (e) => {
    e.preventDefault();

    this.props.history.push(`/create-project/upgrade-package/${orderId}`);
  };

  render = () => {
    return (
      <Spin wrapperClassName="eju-spin" indicator={antIcon} spinning={this.state.isLoading}>
        {this.renderMain()}
      </Spin>
    );
  };

  renderMain() {
    const { projects, cities, dispatch, history, pageNum, pageSize, totalElements } = this.props;
    const { trial } = this.state;

    function Dashboard({ selectedProject, expireDay }) {
      const { signSuccess } = selectedProject;

      function onClick(e) {
        e.preventDefault();

        saveSelectSignProject({ pageNum, pageSize, id: selectedProject.id });

        dispatch(chooseProject(selectedProject));
        history.push('/combo/index');
      }

      return signSuccess && (expireDay == null || expireDay > 0) ? (
        <a href="/combo/index" style={{ marginLeft: 20 }} onClick={onClick}>
          进入
        </a>
      ) : null;
    }

    return (
      <section className="home-body">
        <header className="welcome-to-caic" />
        <main className="home-sign-projects">
          <div className="sign-projects-search header-filter">
            <Row gutter={30}>
              {/*<Col span={4}>
                <div>
                  <span className="tit">公司主体：</span>
                  <span>上海易居（中国）</span>
                </div>
              </Col>*/}
              {/*<Col span={6}>
                <div>
                  <span className="tit">城市：</span>
                  <Select
                    placeholder="请选择城市"
                    onChange={this.chooseCity}
                    style={{ width: 150 }}
                  >
                    {cities.map(({ code, name }) => (
                      <Option value={code} key={code}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>*/}
              {/*<Col span={8}>
                <div>
                  <span className="tit">项目类别：</span>
                  <Select
                    placeholder="请选择项目类别"
                    onChange={this.chooseAsset}
                    style={{ width: 150 }}
                  >
                    {assets.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>*/}
              <Col span={4}>
                <div className="text-right">
                  <Input placeholder="请输入关键字搜索项目" onChange={this.onNameChange} />
                </div>
              </Col>
              <Col span={6}>
                <Button
                  icon="search"
                  htmlType="button"
                  type="primary"
                  onClick={this.fetchSignProjects}
                >
                  查询
                </Button>
              </Col>
            </Row>
          </div>
          <div className="sign-projects-body">
            <ul className="sign-projects clearfix">
              <Link to="/create-project/flow/1">
                <li className="create-sign-project text-center">
                  <div className="add-img" />
                  <div>创建项目</div>
                </li>
              </Link>
              {projects.map((project) => {
                const {
                  projectServiceList,
                  name,
                  id,
                  merchantName,
                  pkg,
                  signEnd,
                  signSuccess,
                  expireMsg,
                  upgrade,
                  orderId,
                  order,
                } = project;
                const { name: versionName, id: versionId, code } = pkg || {};
                const serviceName = (projectServiceList || []).map(({ name }) => name).join('，');
                const merchant = project.merchant || {};
                const { expireDay } = order || {};

                const versionStyleStore = {
                  1: { backgroundColor: '#3b5efe' },
                  4: { backgroundColor: '#02cf96' },
                  2: { backgroundColor: '#02cf96' },
                  5: { backgroundColor: '#02cf96' },
                };
                const versionStyle = versionName
                  ? versionStyleStore[versionId] || { backgroundColor: '#02cf96' }
                  : { display: 'none' };

                // typeCode: 套餐类型码
                // "PACKAGE_TRY":"试用版(一个月)", "PACKAGE_OPERATOR_A":"运营版A",
                // "PACKAGE_OPERATOR_B":"运营版B", "PACKAGE_DIAGNOSE":"诊断版",
                // "PACKAGE_VIP":"VIP版", "PACKAGE_CUSTOM":"定制版"
                const isTrial = code === 'PACKAGE_TRY';
                let expireNode = null;
                if (expireDay != null) {
                  const upgradeNode = upgrade && (
                    <Fragment>
                      ，<Link to={`/create-project/upgrade-package/${orderId}`}>立即升级</Link>
                    </Fragment>
                  );

                  if (expireDay <= 0) {
                    expireNode = (
                      <span style={{ color: 'red' }}>
                        {isTrial ? (
                          <React.Fragment>试用已过期{upgradeNode}</React.Fragment>
                        ) : (
                          '套餐已过期'
                        )}
                      </span>
                    );
                  } else if (expireDay < 30) {
                    expireNode = (
                      <span style={{ color: 'red' }}>
                        {expireDay} 天后过期{upgradeNode}
                      </span>
                    );
                  }

                  if (isTrial && expireDay <= 5 && !Cookie.get(TRIAL_EXPIRE_MODAL)) {
                    Cookie.set(TRIAL_EXPIRE_MODAL, 1, { expires: 1 });
                    this.setState({
                      trial: { upgradeModalVisible: true, expireDay, orderId },
                    });
                  }
                }

                return (
                  <li className="project" key={id}>
                    <h2 className="project-name sln">{name}</h2>
                    <div className="item sln">服务内容：{serviceName}</div>
                    <div className="item sln">认证主体：{merchant.name}</div>
                    <footer className="date-link">
                      <div className="fr">
                        {/*{!signSuccess && <Link to={`/create-project/flow/1?id=${id}`}>编辑</Link>}*/}
                        <Dashboard selectedProject={project} expireDay={expireDay} />
                      </div>
                      {signEnd && (
                        <span className="date">有效期：{format(signEnd, 'YYYY.MM.DD')}</span>
                      )}
                      {expireNode}
                    </footer>
                    <div className="version" style={versionStyle}>
                      {versionName}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="text-center">
              <Pagination
                showSizeChanger
                pageSize={pageSize}
                onShowSizeChange={(current, pageSize) => {
                  this.fetchSignProjects({ pageNum: 1, pageSize });
                }}
                onChange={(pageNum) => {
                  this.fetchSignProjects({ pageNum });
                }}
                current={pageNum}
                total={totalElements}
              />
            </div>
            <Modal
              width={400}
              visible={trial.upgradeModalVisible}
              centered
              closable={false}
              footer={null}
            >
              <div className="trial-modal">
                <h2 className="trial-modal-title">
                  试用套餐{trial.expireDay <= 0 ? '已' : '即将'}到期
                </h2>
                <div className="trial-modal-tip">
                  试用套餐{trial.expireDay <= 0 ? '已' : <span>还有 {trial.expireDay} 天</span>}到期，现可以升级为其他套餐。升级成功后保留原有数据
                </div>
                <div className="trial-modal-btns">
                  <Button
                    onClick={() => {
                      this.setState({ trial: { upgradeModalVisible: false } });
                    }}
                  >
                    用用再说
                  </Button>
                  <Button type="primary" className="fr" onClick={this.upgrade(trial.orderId)}>
                    立即升级
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </main>
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  const { projects, pageNum, pageSize, totalElements, merchantId } = state.sideProjects;
  const { cities } = state.city;

  return { projects, pageNum, pageSize, totalElements, merchantId, cities };
};

export default connect(mapStateToProps)(Home);
