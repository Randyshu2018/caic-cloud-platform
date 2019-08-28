import React from 'react';
import BuildTop from './buildTop';
import BuildNews from './buildNews';
import api from 'api';
import { Breadcrumb } from 'antd';
import { history } from 'func';
export class App extends React.Component {
  constructor(props) {
    super(props);
    window.getBuildManageBuilding = this.getBuilding;
  }
  state = {
    building: {},
  };
  componentDidMount() {
    this.getBuilding();
  }
  getBuilding = () => {
    const { id } = this.props.match.params;
    // console.log(this.props)
    api.getBuilding({ buildingId: id }).then((res) => {
      // console.log(res);
      this.setState({ building: res || {} });
    });
  };
  render() {
    const { building = {} } = this.state;
    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>
            <span style={{ cursor: 'pointer', color: '#00b1fd' }} onClick={history.goBack}>
              ◀ 楼宇管理
            </span>{' '}
            / {building.name}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="build-manage-container">
          <BuildTop building={building} />
          <BuildNews building={building} />
        </div>
      </React.Fragment>
    );
  }
}
export default App;
