import React, { Component } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom'; // BrowserRouter HashRouter
import { Layout, Spin } from 'antd';
import { ContextComponent } from 'src/context/index';
import { getStorageObj, isEmpty } from './modules/utils';
import { fetchALLSignProjects } from './reducers/login';
import './App.scss';
import { routesConfig } from 'src/routes/index';
import RouterComponent from './routes/components/router';
import { TopHeader } from './components/Layout';
import LayoutCon from './containers/Layout';
import Dia from './containers/Diagnosis';

/**
 * 登录注册忘记秘密等页面，不是经常使用，没必要打包到主体文件中，按需加载，该用到就加载，用不到的不加载，不浪费资源
 * 相关前端工程优化文章[https://mp.weixin.qq.com/s/6bwlUZoCN4ZuT_tt263gPQ]
 *  */
import AsyncComponent from 'src/components/AsyncComponent/AsyncComponent';
const NoMatch = AsyncComponent(() => import('src/routes/components/noMatch'));
const Login = AsyncComponent(() => import('./containers/Login/Login'));
const Sample = AsyncComponent(() => import('./containers/Sample/Form'));
const ChartSample = AsyncComponent(() => import('./containers/Sample/ChartSample'));
const Home = AsyncComponent(() => import('./containers/Home/Home'));
const Register = AsyncComponent(() => import('./containers/Register/Register'));
const Forgetpwd = AsyncComponent(() => import('./containers/ForgetPwd/ForgetPwd'));
const PreviewFile = AsyncComponent(() => import('./containers/PreviewFile/index'));

class _NeedLogin extends Component {
  state = {
    loading: true,
  };

  get memberId() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return memberId;
  }

  componentDidMount() {
    const { allProjects } = this.props;

    Promise.resolve(
      isEmpty(allProjects) && this.props.dispatch(fetchALLSignProjects({ memberId: this.memberId }))
    ).finally(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const { loading } = this.state;
    if (loading)
      return (
        <Spin size="large">
          <div style={{}} />
        </Spin>
      );
    // 这里需要考虑是否依赖签约项目
    return (
      <Switch>
        <ContextComponent.Provider value={{ location: this.props.location }}>
          {routesConfig.map((item, index) => <RouterComponent {...item} key={index} />)}
        </ContextComponent.Provider>
        <Route component={NoMatch} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  const { allProjects } = state.sideProjects;

  return { allProjects };
};

const NeedLogin = connect(mapStateToProps)(_NeedLogin);

export default class App extends Component {
  componentDidMount() {
    // 清除百度地图存入localStorage的缓存
    Object.keys(localStorage)
      .filter((key) => key.indexOf('BMap_') === 0)
      .forEach((key) => localStorage.removeItem(key));
  }
  render() {
    return (
      <React.Fragment>
        <div className="App">
          <div className="loading-container" id="loadingContainer">
            <div className="loading-side">
              <Spin size="large" />
            </div>
          </div>
          <Router>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Layout>
                    <TopHeader />
                    <Layout.Content>
                      <Home {...props} />
                    </Layout.Content>
                  </Layout>
                )}
              />
              <Route path={`/login`} component={Login} />
              <Route path={`/sample`} component={Sample} />
              <Route path={`/chart-sample`} component={ChartSample} />
              <Route path={`/register`} component={Register} />
              <Route path={`/forgetpwd`} component={Forgetpwd} />
              <Route path={`/preview`} component={PreviewFile} />
              <Route path={`/layout`} component={LayoutCon} />
              <Route path={`/dia`} component={Dia} />
              <Route component={NeedLogin} />
            </Switch>
          </Router>
        </div>
      </React.Fragment>
    );
  }
}
