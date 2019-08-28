import {
  BasicData,
  AssetDiagnosis,
  OperationDiagnosis,
  WorthDiagnosis,
  // DealDiagnosis,
} from './configData';
const configData = {
  '1': {
    name: '基础数据',
    source: BasicData,
  },
  '2': {
    name: '资产诊断',
    source: AssetDiagnosis,
  },
  '3': {
    name: '运营诊断',
    source: OperationDiagnosis,
  },
  '4': {
    name: '价值诊断',
    source: WorthDiagnosis,
  },
  // '5': {
  //   name: '交易诊断',
  //   source: DealDiagnosis,
  // },
};

export default class Event {
  setStateIsAnewRenderForm = () => {
    this.setState(
      {
        isAnewRenderForm: false,
      },
      this.setConfigData
    );
  };

  commontEntries = (data = {}) => {
    const newData = {};
    Object.entries(data).forEach(([key, value]) => {
      key !== 'null' && (newData[key] = { type: 'title' });
      if (typeof value === 'object')
        Object.keys(value).forEach((key) => (newData[key] = value[key]));
    });
    return newData;
  };

  setConfigData = () => {
    const step = this.props.match.params.step;
    if (!configData.hasOwnProperty(step)) return void 0;
    const { name, source } = configData[step];
    const newData = this.commontEntries(source, {}, !!0);
    this.setState({
      isAnewRenderForm: true,
      data: {
        [name]: newData,
      },
    });
  };

  handleSubmit = () => {
    this.props.history.push(
      `/asset-diagnose/history/${this.props.match.params.projectId}/new-authorize/`
    );
  };

  handleTableInfo = (type, name) => {
    const tableData = {
      type,
      name,
      carNo: this.search.carNo,
    };
    this.setState({ isMoadlShow: true, tableData });
  };

  handlePageSkip = (step) => {
    this.props.history.push(
      `/asset-diagnose/update-work/${this.props.match.params.projectId}/${step}`
    );
  };
}
