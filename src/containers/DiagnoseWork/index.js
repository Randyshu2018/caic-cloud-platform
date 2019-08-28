import React from 'react';
import { Layout } from 'antd';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';
import { localStorageDiagnose } from 'src/hoc/localStorage';
import AsyncComponent from 'src/hoc/asyncComponent';
import ComponentPageStateMenu from 'src/components/PageStateMenu';
const ComponentFrom = AsyncComponent(() => import('src/components/Form/DiagnoseWork'));

@ComponentEvent(Event)
class View extends React.Component {
  constructor(props, evt) {
    super(props);
    this.state = {
      breadData: [{ name: '办公' }],
      data: [],
      isAnewRenderForm: false,
    };
  }

  componentWillReceiveProps(nextProps, prevState) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setStateIsAnewRenderForm();
    }
  }

  componentDidMount() {
    const { projectId, step } = this.props.match.params;
    const historyLog = localStorageDiagnose('get', { projectId });
    if (historyLog && historyLog.step !== step) {
      return this.handlePageSkip(historyLog.step);
    }
    // 根据router参数，配置动态表单
    this.setConfigData();
  }

  renderForm() {
    const datas = Object.entries(this.state.data);
    if (!datas.length) return null;
    const [title = '', data = {}] = datas[0] || [];
    return this.state.isAnewRenderForm ? (
      <ComponentFrom
        title={title}
        data={data}
        onSubmit={this.handleSubmit}
        match={this.props.match}
        onPageSkip={this.handlePageSkip}
      />
    ) : null;
  }

  render() {
    const { breadData } = this.state;
    const current = this.props.match.params.step;
    return (
      <Layout>
        <Breadcrumb breadData={breadData} />
        <ComponentPageStateMenu current={current} handlePageStateClick={this.handlePageSkip} />
        <article className="container-article">{this.renderForm()}</article>
      </Layout>
    );
  }
}

export default View;
