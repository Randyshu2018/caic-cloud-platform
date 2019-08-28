import React from 'react';
import { Layout } from 'antd';
import AsyncComponent from 'src/hoc/asyncComponent';
import { getPageQuery } from 'src/modules/utils';
import StepsComponent from './components/steps/index';
import './style.scss';

const EjuProjectCombo = AsyncComponent(() => import('./components/projectCombo/index'));
const EjuProjectOutline = AsyncComponent(() => import('./components/projectOutline/index'));
const EjuProjectVerify = AsyncComponent(() => import('./components/projectVerify/index'));

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  componentWillReceiveProps({
    match: {
      params: { steps },
    },
  }) {
    steps in this.renderType ||
      this.props.history.replace(`/create-project/flow/${this.props.match.params.steps}`);
  }

  componentDidMount() {}

  get query() {
    return getPageQuery();
  }

  get orderId() {
    const { orderId } = this.query;
    return orderId;
  }

  get renderType() {
    return {
      '1': <EjuProjectCombo {...this.props} />,
      '2': <EjuProjectVerify {...this.props} />,
      '3': <EjuProjectOutline {...this.props} />,
    };
  }

  renderView() {
    const steps = this.props.match.params.steps;
    return this.renderType[steps] || null;
  }

  render() {
    return (
      <Layout className="eju-create-project_container">
        {this.orderId ? (
          <div className="eju-steps_container hc">创建新项目</div>
        ) : (
          <StepsComponent match={this.props.match} clickCallback={() => {}} />
        )}
        <div className="eju-create-project_body eju-flex-center">{this.renderView()}</div>
      </Layout>
    );
  }
}

export default View;
