import React from 'react';
import '../style/index.scss';
import { Button, message } from 'antd';
import BuildList from './buildList';
import NewFoolOrBuild from './newCommon';
export class App extends React.Component {
  state = {
    visibleFool: false,
    visibleBuild: false,
  };
  closeFool = () =>
    this.setState({ visibleFool: false }, () => {
      if (window.delBuildManageState) {
        window.getBuildManageBuilding && window.getBuildManageBuilding();
      }
    });
  openFool = () => {
    window.delBuildManageState = false;
    this.setState({ visibleFool: true });
  };
  closeBuild = () =>
    this.setState({ visibleBuild: false }, () => {
      if (window.delBuildManageState) {
        window.getBuildManageBuilding && window.getBuildManageBuilding();
      }
    });
  openBuild = () => {
    const { building } = this.props;
    const floorList = building.floors || [];
    if (!floorList.length) {
      message.info('请先新建楼层');
      return;
    }
    window.delBuildManageState = false;
    this.setState({ visibleBuild: true });
  };
  componentDidMount() {}
  render() {
    const { visibleFool, visibleBuild } = this.state;
    const { building } = this.props;
    const floorList = building.floors || [];

    return (
      <React.Fragment>
        <div className="hasbuild-news-container">
          <div className="hasbuild-news-title">
            <h2>楼宇信息</h2>
            <ul className="center">
              <li>
                <i />
                空置
              </li>
              <li>
                <i className="blue" />
                正常租期
              </li>
              <li>
                <i className="yellow" />
                即将到期
              </li>
            </ul>
            <div className="right">
              <Button type="primary" onClick={this.openFool}>
                + 新建楼层
              </Button>
              <span style={{ paddingLeft: 20 }} />
              <Button style={{ background: '#50E3C2', color: '#ffff' }} onClick={this.openBuild}>
                + 新建房源
              </Button>
            </div>
          </div>
        </div>
        <BuildList floorList={floorList} building={building} />
        {visibleFool && (
          <NewFoolOrBuild
            title={'楼层'}
            building={building}
            visible={visibleFool}
            close={this.closeFool}
            type="floor"
          />
        )}
        {visibleBuild && (
          <NewFoolOrBuild
            visible={visibleBuild}
            close={this.closeBuild}
            title="房源"
            type="build"
            top
            title1="房号"
            building={building}
            addtTitle="添加房间"
          />
        )}
      </React.Fragment>
    );
  }
}
export default App;
