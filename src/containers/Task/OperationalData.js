import React from 'react';
import './OperationalData.scss';
import Content from '../../components/Layout/Content';
import { Table, message, Icon } from 'antd';
import { isArray, isEmpty } from '../../modules/utils';
import OperationalDataServices from '../../services/operationaldata';
import HotelForm from './components/FormBlock/HotelForm';
import BusinessForm from './components/FormBlock/BusinessForm';
import OtherForm from './components/FormBlock/otherForm';
import EBreadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import OfficeForm from './components/FormBlock/OfficeForm';

const TYPE = [
  {
    type: 0,
    key: 'HOTEL',
    name: '酒店',
  },
  {
    type: 1,
    key: 'OFFICE',
    name: '商业',
  },
  {
    type: 2,
    key: 'COMMERCIAL',
    name: '办公',
  },
  {
    type: 3,
    key: 'SHOP',
    name: '商铺',
  },
  {
    type: 4,
    key: 'APARTMENT',
    name: '公寓',
  },
  {
    type: 5,
    key: 'GARAGE',
    name: '车库',
  },
  {
    type: 6,
    key: 'PARK',
    name: '园区',
  },
];

const typeTransfer = (type) => {
  type = parseInt(type);
  let tmp = TYPE.find((t, i) => t.type === type);
  return tmp;
};
export default class OperationalData extends React.Component {
  state = {
    breadData: [
      {
        path:
          '/task/detail/' +
          this.props.match.params.id +
          '?date=' +
          this.props.match.params.yMonth +
          '&assetType=' +
          typeTransfer(this.props.match.params.type).key,
        name: '详情',
      },
      { path: '/', name: '运营数据' },
    ],
    action: this.props.match.params.action,
    type: '', //0,酒店 1，办公，2，商业
    id: '', //项目ID
    name: '', //项目名称
    dateMonth: '',
    dataSource: [],
    columnsHotel: [
      {
        title: '期数',
        dataIndex: 'dateMonthStr',
        key: 'dateMonthStr',
      },
      {
        title: '平均房价（元）',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
      },
      {
        title: '平均出租率(%)',
        dataIndex: 'occupancyRate',
        key: 'occupancyRate',
      },
      {
        title: '平均revpar（元）',
        dataIndex: 'revpar',
        key: 'revpar',
      },
    ],
    columnsOffice: [
      {
        title: '期数',
        dataIndex: 'dateMonthStr',
        key: 'dateMonthStr',
      },
      {
        title: '平均租金（元/㎡，月）',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
      },
      {
        title: '平均出租率(%)',
        dataIndex: 'occupancyRate',
        key: 'occupancyRate',
      },
      {
        title: '主力租户1',
        dataIndex: 'mainTenantNames',
        key: 'mainTenantNames',
        render: (item, record) => <span>{item[0]}</span>,
      },
      {
        title: '主力租户2',
        dataIndex: 'mainTenantNames',
        key: 'mainTenantNames',
        render: (item, record) => <span>{item[1]}</span>,
      },
    ],
    columnsBuiness: [
      {
        title: '期数',
        dataIndex: 'dateMonthStr',
        key: 'dateMonthStr',
      },
      {
        title: '首层租金（元/㎡，月）',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
      },
      {
        title: '平均出租率(%)',
        dataIndex: 'occupancyRate',
        key: 'occupancyRate',
      },
      {
        title: '坪效（元）',
        dataIndex: 'areaEffectiveness',
        key: 'areaEffectiveness',
      },
      {
        title: '主力店1',
        dataIndex: 'mainStores',
        render(item, record) {
          const [first] = isArray(item) ? item : [];
          return isEmpty(first) ? (
            <Icon type="minus" />
          ) : (
            <span>
              {first.name}
              <span style={{ marginLeft: '30px' }}>{first.area}</span>
            </span>
          );
        },
      },
      {
        title: '主力店2',
        dataIndex: 'mainStores',
        key: 'mainStores2',
        render(item, record) {
          const [, second] = isArray(item) ? item : [];
          return isEmpty(second) ? (
            <Icon type="minus" />
          ) : (
            <span>
              {second.name}
              <span style={{ marginLeft: '30px' }}>{second.area}</span>
            </span>
          );
        },
      },
    ],
    columnsOthers1: [
      {
        title: '期数',
        dataIndex: 'dateMonthStr',
        key: 'dateMonthStr',
      },
      {
        title: '平均出租率(%)',
        dataIndex: 'occupancyRate',
        key: 'occupancyRate',
      },
      {
        title: '平均租金（元/㎡，月）',
        dataIndex: 'averagePrice',
        key: 'averagePrice',
      },
    ],
    columnsOthers2: [
      {
        title: '期数',
        dataIndex: 'dateMonthStr',
        key: 'dateMonthStr',
      },
      {
        title: '车位使用率(%)',
        dataIndex: 'parkingOccupancy',
        key: 'parkingOccupancy',
      },
      {
        title: '车位周转率(%)',
        dataIndex: 'parkingTurnoverRate',
        key: 'parkingTurnoverRate',
      },
    ],
    currentMonthData: {},
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    let type = this.props.match.params.type;
    let name = this.props.match.params.name;
    let action = this.props.match.params.action;
    let yMonth = this.props.match.params.yMonth;

    // query/update/create
    if (!id || !type || !action || !yMonth) {
      return;
    }
    this.setState({ id: id, type: type, name: name, action: action, dateMonth: yMonth });
    this.fetchOperationalDataHistory(id);
    this.fetchOperationalDetail(id, yMonth);
  }

  fetchOperationalDataHistory = (id) => {
    OperationalDataServices.fetchOperationalDataHistory({ projectId: id }).then((res) => {
      if (!res) {
        return;
      }
      let result = [];
      for (let i = 0; i < res.length; i++) {
        let tmp = res[i];
        tmp = Object.assign({}, tmp, { key: i });
        result.push(tmp);
      }
      this.setState({ dataSource: result });
    });
  };

  fetchOperationalDetail = (id, yMonth) => {
    OperationalDataServices.fetchOperationalDataQuery({ projectId: id, dateMonth: yMonth }).then(
      (res) => {
        if (!res) {
          return;
        }
        this.setState({ currentMonthData: res });
      }
    );
  };

  handleSubmit = (values) => {
    if (this.state.type === '2') {
      let mainStores = [];
      let count = 0;
      for (let key in values) {
        let tmp = values[key];
        if (key.indexOf('mainStoresName') > -1) {
          let tmpItem = { name: tmp, area: values['mainStoresArea' + count] };
          delete values[key];
          delete values['mainStoresArea' + count];
          count = count + 1;
          mainStores.push(tmpItem);
        }
      }
      values = Object.assign({}, values, { mainStores: mainStores });
    }
    if (this.state.type === '1') {
      let mainTenantNames = [];
      for (let key in values) {
        let tmp = values[key];
        if (key.indexOf('mainTenantNames') > -1) {
          mainTenantNames.push(tmp);
          delete values[key];
        }
      }
      values = Object.assign({}, values, { mainTenantNames: mainTenantNames });
    }
    values = Object.assign({}, values, {
      projectId: this.state.id,
      dateMonth: this.state.dateMonth,
    });
    OperationalDataServices.fetchOperationalDataCreate(values).then((res) => {
      if (res.responseCode !== '000') {
        message.error('数据保存失败');
        return;
      }
      message.success('数据保存成功');
      //   this.props.history.goBack();
      this.props.history.push(
        '/task/detail/' +
          this.props.match.params.id +
          '?date=' +
          this.props.match.params.yMonth +
          '&assetType=' +
          typeTransfer(this.props.match.params.type).key
      );
    });
  };

  backClick = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      breadData,
      dataSource,
      columnsHotel,
      columnsBuiness,
      columnsOffice,
      columnsOthers1,
      columnsOthers2,
      type,
      currentMonthData,
      action,
    } = this.state;
    return (
      <div className="operContainer">
        <EBreadcrumb breadData={breadData} />
        {type === '0' && (
          <HotelForm
            handleSubmit={this.handleSubmit.bind(this)}
            name={this.state.name}
            data={currentMonthData}
            action={action}
            dateMonth={this.state.dateMonth}
            backClick={this.backClick.bind(this)}
            assetType={typeTransfer(this.props.match.params.type).key}
            id={this.state.id}
          />
        )}
        {type === '2' && (
          <BusinessForm
            handleSubmit={this.handleSubmit.bind(this)}
            name={this.state.name}
            data={currentMonthData}
            action={action}
            dateMonth={this.state.dateMonth}
            backClick={this.backClick.bind(this)}
            assetType={typeTransfer(this.props.match.params.type).key}
            id={this.state.id}
          />
        )}
        {type === '1' && (
          <OfficeForm
            handleSubmit={this.handleSubmit.bind(this)}
            name={this.state.name}
            data={currentMonthData}
            action={action}
            dateMonth={this.state.dateMonth}
            backClick={this.backClick.bind(this)}
            assetType={typeTransfer(this.props.match.params.type).key}
            id={this.state.id}
          />
        )}
        {(type === '3' || type === '4' || type === '5' || type === '6') && (
          <OtherForm
            handleSubmit={this.handleSubmit.bind(this)}
            name={this.state.name}
            data={currentMonthData}
            action={action}
            dateMonth={this.state.dateMonth}
            backClick={this.backClick.bind(this)}
            assetType={typeTransfer(this.props.match.params.type).key}
            id={this.state.id}
            type={type}
          />
        )}
        <Content>
          <div className="titleName">历史上链数据</div>

          {type === '0' &&
            dataSource.length > 0 && (
              <Table onHeaderCell={false} columns={columnsHotel} dataSource={dataSource} />
            )}
          {type === '2' &&
            dataSource.length > 0 && (
              <Table onHeaderCell={false} columns={columnsBuiness} dataSource={dataSource} />
            )}
          {type === '1' &&
            dataSource.length > 0 && (
              <Table onHeaderCell={false} columns={columnsOffice} dataSource={dataSource} />
            )}
          {(type === '3' || type === '4' || type === '6') &&
            dataSource.length > 0 && (
              <Table onHeaderCell={false} columns={columnsOthers1} dataSource={dataSource} />
            )}
          {type === '5' &&
            dataSource.length > 0 && (
              <Table onHeaderCell={false} columns={columnsOthers2} dataSource={dataSource} />
            )}
        </Content>
      </div>
    );
  }
}
