/**
 * Created by summer on 2018/11/23.
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Table, message, DatePicker, Button } from 'antd';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import EBreadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import TableIcon from '../../components/Icon/TableIcon';
import CircleErrorIcon from '../../components/Icon/CircleErrorIcon';
import CircleRightIcon from '../../components/Icon/CircleRightIcon';
import { request, api } from '../../modules/request';
import { queryURLParameter, formatDate, isDefined } from '../../modules/utils';
import { setProjectDetail } from '../../reducers/projectDetail';
import './TaskDetail.scss';

const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY年MM月';
const TableTitle = [
  {
    title: '日期',
    dataIndex: 'dateMonth.text',
    key: 'dateMonth.text',
  },
  {
    title: '运营数据',
    dataIndex: 'bizDataSheetStatus',
    key: 'bizDataSheetStatus',
  },
  {
    title: '资产负债表',
    dataIndex: 'balanceSheetStatus',
    key: 'balanceSheetStatus',
  },
  {
    title: '现金流量表',
    dataIndex: 'cashFlowSheetStatus',
    key: 'cashFlowSheetStatus',
  },
  {
    title: '利润表',
    dataIndex: 'profitSheetStatus',
    key: 'profitSheetStatus',
  },
];
//type=0,酒店，type=1，商业，2，办公
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
const SheetModule = (props) => {
  const { moduleName, uploader, uploadTime, statusRender } = props;
  return (
    <Col span={6}>
      <div className="Sheet-module">
        <h4>{moduleName}</h4>
        {statusRender}
        <p className="Sheet-module__bottom Sheet-module__bottom_first">上传人：{uploader}</p>
        <p className="Sheet-module__bottom">上传时间：{uploadTime}</p>
      </div>
    </Col>
  );
};

export class TaskDetail extends Component {
  state = {
    tableData: [],
    projectId: this.props.projectId,
    // date: queryURLParameter().date,
    dateMonth: queryURLParameter().date || '2013-11',
    assetType: queryURLParameter().assetType,
    taskDetailData: {},
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId !== this.props.projectId) {
      this.fetchTaskDetailData(nextProps.projectId);
    }
  }

  componentDidMount() {
    this.fetchTaskDetailData();
    this.fetchTaskHistoryUp2chainData();
  }

  fetchTaskDetailData = (projectId) => {
    request
      .get(api.TASK_DETAIL_API, {
        projectId: projectId || this.state.projectId,
        dateMonth: this.state.dateMonth,
        assetType: this.state.assetType,
      })
      .then((res) => {
        const { data } = res;
        if (!!data) {
          this.props.dispatch(setProjectDetail(data));

          this.setState({
            taskDetailData: data,
          });
        }
      })
      .catch((e) => {
        e.responseMsg && message.info(e.responseMsg);
      });
  };

  fetchTaskHistoryUp2chainData = () => {
    request
      .get(api.TASK_HISTORY_UP2CHAIN_API, {
        projectId: this.state.projectId,
        pageNum: 1,
        pageSize: 100,
      })
      .then((res) => {
        if (!!res.data) {
          this.setState({
            tableData: res.data.content,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  renderUploaded = (modifyUrl, detailUrl) => {
    return (
      <Fragment>
        <div className="Sheet-module__upload">
          <div className="Sheet-module__upload__status">
            <CircleRightIcon />
            <span>已上传</span>
          </div>
          <div className="Sheet-module__upload__btn">
            {!this.state.taskDetailData.up2chain && (
              <Link to={modifyUrl} className="Sheet-module__upload__replace">
                替换
              </Link>
            )}
            <Link to={detailUrl} className="Sheet-module__upload__view">
              查看
            </Link>
          </div>
        </div>
        <div className="Sheet-module_bar uploaded" />
      </Fragment>
    );
  };

  renderUnuploaded = (url) => {
    return (
      <Fragment>
        <div className="Sheet-module__upload">
          <div className="Sheet-module__upload__status">
            <CircleErrorIcon />
            <span>未上传</span>
          </div>
          <div>
            {!this.state.taskDetailData.up2chain && (
              <Link to={url} className="Sheet-module__upload__replace">
                立即上传
              </Link>
            )}
          </div>
        </div>
        <div className="Sheet-module_bar" />
      </Fragment>
    );
  };

  typeTransfer = (type) => {
    if (!type) {
      return { type: 0 };
    }
    return TYPE.find((t, i) => t.key === type);
  };

  goAnalysePage = ({ taskId, projectId, dateMonth, assetType }) => {
    if (!!taskId) {
      this.props.history.push(
        `/task/analyse/${projectId}?date=${dateMonth}&taskId=${taskId}&assetType=${assetType}`
      );
    } else {
      message.error('您还没有上传文件！');
    }
  };

  handleDateChange = (date, dateString) => {
    this.setState(
      (state, props) => {
        return {
          dateMonth: formatDate(dateString),
        };
      },
      () => {
        this.fetchTaskDetailData();
        this.fetchTaskHistoryUp2chainData();
      }
    );
  };

  render() {
    if (isEmpty(this.state.taskDetailData)) {
      return null;
    }
    const {
      dateMonth,
      tableData,
      projectId,
      taskDetailData: {
        taskId,
        assetType,
        projectName,
        balanceSheet = {},
        profitSheet = {},
        cashFlowSheet = {},
        bizDataSheet = {},
        up2chain,
      },
    } = this.state;

    return (
      <div className="task-detail-wrapper task-data-analyse-wrapper">
        <EBreadcrumb
          breadData={[
            {
              path: '/task/detail',
              name: '详情',
            },
          ]}
        />
        <div className="Filter">
          <div className="Filter__title">
            <div>
              <span>{projectName}</span>
            </div>
            {up2chain ? (
              <Button type="primary" disabled>
                数据已上链
              </Button>
            ) : (
              <div
                className="Filter__title__btn"
                onClick={(e) => {
                  e.preventDefault();
                  this.goAnalysePage({ taskId, projectId, dateMonth, assetType });
                }}
              >
                <TableIcon />
                分析数据
              </div>
            )}
          </div>
          <div className="Filter__calendar">
            <MonthPicker
              defaultValue={moment(dateMonth, monthFormat)}
              format={monthFormat}
              onChange={this.handleDateChange}
            />
            {/*<CalendarIcon />*/}
            {/*<span>{dateMonth}</span>*/}
          </div>
          <Row gutter={32}>
            <SheetModule
              moduleName="运营数据"
              uploader={bizDataSheet.operatorName}
              uploadTime={bizDataSheet.uploadTime}
              statusRender={
                !!bizDataSheet.sheetId
                  ? this.renderUploaded(
                      `/task/operational-data/update/${
                        this.typeTransfer(assetType).type
                      }/${projectId}/${projectName}/${dateMonth}`,
                      `/task/operational-data/query/${
                        this.typeTransfer(assetType).type
                      }/${projectId}/${projectName}/${dateMonth}`
                    )
                  : this.renderUnuploaded(
                      `/task/operational-data/create/${
                        this.typeTransfer(assetType).type
                      }/${projectId}/${projectName}/${dateMonth}`
                    )
              }
            />
            <SheetModule
              moduleName="资产负债表"
              uploader={balanceSheet.operatorName}
              uploadTime={balanceSheet.uploadTime}
              statusRender={
                !!balanceSheet.sheetId
                  ? this.renderUploaded(
                      `/task/assets-and-liabilities/${projectId}/${dateMonth}`,
                      `/task/assets-and-liabilities/detail/${projectId}/${dateMonth}`
                    )
                  : this.renderUnuploaded(`/task/assets-and-liabilities/${projectId}/${dateMonth}`)
              }
            />
            <SheetModule
              moduleName="现金流量表"
              uploader={cashFlowSheet.operatorName}
              uploadTime={cashFlowSheet.uploadTime}
              statusRender={
                !!cashFlowSheet.sheetId
                  ? this.renderUploaded(
                      `/task/cash-flow-statements/${projectId}/${dateMonth}`,
                      `/task/cash-flow-statements/detail/${projectId}/${dateMonth}`
                    )
                  : this.renderUnuploaded(`/task/cash-flow-statements/${projectId}/${dateMonth}`)
              }
            />
            <SheetModule
              moduleName="利润表"
              uploader={profitSheet.operatorName}
              uploadTime={profitSheet.uploadTime}
              statusRender={
                !!profitSheet.sheetId
                  ? this.renderUploaded(
                      `/task/profit-statements/${projectId}/${dateMonth}`,
                      `/task/profit-statements/detail/${projectId}/${dateMonth}`
                    )
                  : this.renderUnuploaded(`/task/profit-statements/${projectId}/${dateMonth}`)
              }
            />
          </Row>
          <div className="Table">
            <Table
              columns={TableTitle}
              dataSource={tableData}
              rowKey="taskId"
              title={() => '历史上链数据'}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { signedProjects, projectId },
  } = state;

  const { name: projectName } =
    signedProjects.find(({ assetProjectDto: { id } }) => id === projectId) || {};

  return {
    projectName,
    projectId,
  };
};

export default connect(mapStateToProps)(TaskDetail);
