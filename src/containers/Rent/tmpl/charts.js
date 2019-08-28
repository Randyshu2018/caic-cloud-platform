import React, { Component } from 'react';
import '../style/index.scss';
import Charts from '../../../components/charts/container';
import chartConfig from '../chartConfig';
import api from 'api';
import { connect } from 'react-redux';

export class App extends React.Component {
  state = {
    chartList: [],
  };
  componentDidMount() {
    // echart的表
    window.getData = this.getData;
    const { project } = this.props;
    if (project.id) {
      this.getData();
    }
    console.log(project);
  }

  componentDidUpdate(prevProps) {
    const { project } = this.props;
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.getData();
    }
  }
  componentWillReceiveProps(props) {
    console.log(props);
    if (props.isRequest) {
      this.getData({ buildingId: props.buildingId });
    }
  }
  getData = (obj) => {
    const params = {
      projectId: this.props.project.id,
      buildingId: '',
      ...obj,
    };
    try {
      api.contractChart(params).then((res) => {
        if (res) {
          this.setState({
            chartList: res.dataList || [],
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    const { chartList } = this.state;
    const [x, y] = [[], []];
    chartList.map((value, index, arr) => {
      x.push(value.dateMonth);
      y.push(value.count);
    });
    return (
      <React.Fragment>
        <div className="monitor">
          <h2>到期监控图</h2>
          <div style={{ height: 300 }}>
            <Charts option={chartConfig(x, y)} height="300px" click={this.props.click} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    sideProjects: { selectSideProject },
  } = state;

  return {
    project: selectSideProject,
    // selectSideProject,
  };
};
export default connect(mapStateToProps)(App);
