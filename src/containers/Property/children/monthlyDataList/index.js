import NProgress from 'nprogress';
import React from 'react';
import VIEW from 'src/containers/Property/view';
import PropertyServices from 'src/services/property';
import { getPageQuery } from 'src/modules/utils';
import { Link } from 'react-router-dom';
import 'src/containers/Property/style.scss';
import { Icon, Table, Select } from 'antd';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import { dataYear2 } from 'src/containers/Property/configData/year';

@VIEW
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadData: [{ name: '月度数据' }],
      selectYear: this.query.year || new Date().getFullYear(),
      yearList: dataYear2(),
      yearDataSource: [],
      loadingTableData: true,
      ...this.stateParms(props),
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:', nextProps);
    this.setState(
      {
        ...this.stateParms(nextProps),
      },
      () => this.fetchData(nextProps)
    );
  }
  get query() {
    return getPageQuery() || {};
  }
  stateParms(props) {
    const { assetProjectName, assetProjectId } = props;
    return {
      assetProjectName,
      assetProjectId,
    };
  }
  componentDidMount() {
    this.fetchData(this.props);
  }

  async fetchData(props = this.props) {
    if (!props.assetProjectId) return;
    NProgress.start();
    this.setState({ loadingTableData: true });
    const params = {};
    params.assetProjectId = props.assetProjectId;
    params.year = this.state.selectYear;
    const { data: yearDataSource, responseCode: code } = await PropertyServices.fetchGetTaskList(
      params
    );
    if (code === '000') {
      this.setState((state) => ({
        loadingTableData: false,
        yearDataSource: Array.isArray(yearDataSource) ? yearDataSource : state.yearDataSource,
      }));
    }
    NProgress.done();
  }

  handleSelectChange = (selectYear) => {
    this.setState({ selectYear }, () => this.fetchData());
  };

  renderTable() {
    const o = Object.hasOwnProperty;
    const render = (v) => v || '--';
    const dataSource = this.state.yearDataSource;
    const columns = [
      {
        title: '日期',
        dataIndex: 'period',
        key: 'period',
      },
      {
        title: '上链状态',
        dataIndex: 'chainStatus',
        key: 'chainStatus',
        render: (value) => {
          const code = {
            0: '待上传',
            1: '待上链',
            2: '已上链',
          };
          const codeName = o.call(code, value) ? code[value] : '未知状态';
          return codeName;
        },
      },
      {
        title: '上传人',
        dataIndex: 'memberName',
        key: 'memberName',
        render,
      },
      {
        title: '上传时间',
        dataIndex: 'uploadDate',
        key: 'uploadDate',
        render,
      },
      {
        title: '上链时间',
        dataIndex: 'chainDate',
        key: 'chainDate',
        render,
      },
      {
        title: '操作',
        dataIndex: 'edit',
        key: 'edit',
        render: (_, item) => {
          const { chainStatus: value, taskId } = item;
          const code = {
            0: '立即上传',
            1: '查看',
            2: '查看',
          };
          const codeName = o.call(code, value) && code[value];
          let query = `${item.year}/${item.month}`;
          taskId && (query += `?taskId=${taskId}`);
          return codeName ? (
            <Link to={`/property/monthly-data/details/${query}`}>{codeName}</Link>
          ) : (
            '--'
          );
        },
      },
    ];
    return (
      <Table
        dataSource={dataSource.map((item, key) => ({ ...item, key }))}
        columns={columns}
        pagination={false}
        loading={this.state.loadingTableData}
      />
    );
  }

  render() {
    const { assetProjectName } = this.props;
    return (
      <React.Fragment>
        <Breadcrumb breadData={this.state.breadData} />
        <div className="eju_container property">
          <div className="list-header">
            <div className="size22">项目名称：{assetProjectName}</div>
            <div className="list-select">
              <Select
                defaultValue={this.state.selectYear}
                width="100"
                onChange={this.handleSelectChange}
                // defaultOpen={true}
                // open={true}
              >
                {this.state.yearList.map((year, index) => (
                  <Select.Option value={year} key={index}>
                    {year}年
                  </Select.Option>
                ))}
              </Select>
            </div>
            <p>
              温馨提示：请确认首次数据上链期数，按时间顺序依次上链，例：如果首次上链期数为2019年2期，则2019年2期之前的数据无法补录！
            </p>
          </div>
          <div className="list-body">{this.renderTable()}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default View;
