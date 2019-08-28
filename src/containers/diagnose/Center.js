import React from 'react';
import { Breadcrumb, Select, Table } from 'antd';
import { Link } from 'react-router-dom';
import { DiagnoseServices, CityServices } from '../../services/diagnoseServices';
import { getStorage } from '../../modules/utils';
import { DiagnoseStatus, defaultRender as render } from './diagnoseComponents';
import { assets } from '../../modules/ENUM';

import './Center.scss';

const { Option } = Select;

const columns = [
  {
    title: '项目名称',
    dataIndex: 'projectName',
    render,
  },
  {
    title: '诊断数据上传时间',
    dataIndex: 'submitDate',
    rowClassName: 'text-center',
    className: 'text-center',
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
  {
    title: '操作',
    dataIndex: '',
    render(text, { projectId }) {
      return (
        <div>
          <Link to={`/asset-diagnose/update-work/${projectId}/1`} style={{ marginRight: 20 }}>
            新的诊断
          </Link>
          <Link to={`history/${projectId}`}>历史诊断</Link>
        </div>
      );
    },
  },
];

export default class DiagnoseCenter extends React.Component {
  state = {
    loading: false,
    city: [],
    diagnoses: {},
    assetType: void 0,
    cityCode: void 0,
    pageSize: 10,
  };

  merchantId = getStorage('merchantId');

  componentDidMount() {
    new CityServices().fetchCity(this.merchantId).then((city) => {
      this.setState({ city: [{ value: '全部', key: '' }, ...city] });
    });

    this.fetchProjectDiagnoses({});
  }

  fetchProjectDiagnoses = ({
    pageNum = 1,
    pageSize = this.state.pageSize,
    assetType = this.state.assetType,
    cityCode = this.state.cityCode,
  }) => {
    this.setState({ loading: true });

    new DiagnoseServices()
      .fetchProjectDiagnoses({
        merchantId: this.merchantId,
        assetType: assetType || void 0,
        cityCode: cityCode || void 0,
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

  chooseHotel = (assetType) => {
    this.setState({ assetType });
    this.fetchProjectDiagnoses({ assetType });
  };

  chooseCity = (cityCode) => {
    this.setState({ cityCode });
    this.fetchProjectDiagnoses({ cityCode });
  };

  onShowSizeChange = (current, pageSize) => {
    this.setState({ pageSize });
    this.fetchProjectDiagnoses({ pageSize });
  };

  pageChange = (pageNum) => {
    this.fetchProjectDiagnoses({ pageNum });
  };

  render() {
    const {
      loading,
      city,
      diagnoses: { diagnoseCentreList = [], total = 0 },
      pageSize,
    } = this.state;

    return (
      <React.Fragment>
        <Breadcrumb separator=">" className="breadcrumb">
          <Breadcrumb.Item>
            <Link to={'/asset-diagnose/center'}>诊断中心</Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className="asset-diagnose">
          <div className="diagnose-center-filter header-filter">
            <label>
              <span className="tit">类型：</span>
              <Select placeholder="请选择类型" onChange={this.chooseHotel}>
                {assets.map(({ key, value }) => (
                  <Option value={key} key={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </label>
            <label>
              <span className="tit">城市：</span>
              <Select placeholder="请选择城市" onChange={this.chooseCity}>
                {city.map(({ key, value }) => (
                  <Option value={key} key={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            </label>
          </div>
          <div className="diagnose-center-list">
            <Table
              rowKey="projectId"
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
