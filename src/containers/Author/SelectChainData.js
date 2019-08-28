import React from 'react';
import './Author.scss';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Content from '../../components/Layout/Content';
import { Table, Checkbox, Button, message, Spin } from 'antd';
import AuthorServices from '../../services/author';
import { UserService } from '../../services/login';
import MobileMotal from './components/Motal/MobileMotal';

export default class SelectChainData extends React.Component {
  constructor(props) {
    super(props);
    this.data = {
      computedTime: '',
      isdisabled: 0,
    };
  }
  state = {
    breadData: [
      {
        path: '/author/index',
        name: '授权管理',
      },
      {
        path: '/',
        name: '历史数据',
      },
    ],
    checkedList: [],
    formData: {
      mobile: '',
      name: '',
      projectId: 3,
    },
    visible: false,
    typeData: [],
    columns: [
      {
        title: '全选',
        dataIndex: 'authMonth',
        key: 'authMonth',
        render: (item) => item && item.date,
      },
      {
        title: '运营数据',
        dataIndex: 'bizDataSheet',
        key: 'bizDataSheet',
        render: (item) =>
          item.text !== '-' ? (
            <Checkbox checked={item.checked} onChange={this.handleItemChange} item={item}>
              {item.text}
            </Checkbox>
          ) : (
            item.text
          ),
      },
      {
        title: '资产负债表',
        dataIndex: 'balanceSheet',
        key: 'balanceSheet',
        render: (item) =>
          item.text !== '-' ? (
            <Checkbox checked={item.checked} onChange={this.handleItemChange} item={item}>
              {item.text}
            </Checkbox>
          ) : (
            item.text
          ),
      },
      {
        title: '现金流量表',
        dataIndex: 'cashFlowSheet',
        key: 'cashFlowSheet',
        render: (item) =>
          item.text !== '-' ? (
            <Checkbox checked={item.checked} onChange={this.handleItemChange} item={item}>
              {item.text}
            </Checkbox>
          ) : (
            item.text
          ),
      },
      {
        title: '利润表',
        dataIndex: 'profitSheet',
        key: 'profitSheet',
        render: (item) =>
          item.text !== '-' ? (
            <Checkbox checked={item.checked} onChange={this.handleItemChange} item={item}>
              {item.text}
            </Checkbox>
          ) : (
            item.text
          ),
      },
    ],
    dataSource: [],
    mobile: '',
    computedTime: 0,
    authId: '',
    loadingShow: false,
  };

  mobile = localStorage.getItem('mobile');

  componentDidMount() {
    let type = this.props.match.params.type;
    let authId = this.props.match.params.authId;
    let mobile = this.props.match.params.mobile;

    if (!type || !authId || !mobile) {
      return;
    }
    let typeArray = type.split('|');
    for (let i = 0; i < typeArray.length; i++) {
      typeArray[i] === '经营数据' ? (typeArray[i] = 'bizDataSheet') : '';
      typeArray[i] === '资产负债表' ? (typeArray[i] = 'balanceSheet') : '';
      typeArray[i] === '现金流量表' ? (typeArray[i] = 'cashFlowSheet') : '';
      typeArray[i] === '利润表' ? (typeArray[i] = 'profitSheet') : '';
    }
    this.setState(
      {
        typeData: typeArray,
        authId: authId,
        mobile: mobile,
      },
      () => {
        this.fetchHistoryRecord();
      }
    );
  }

  fetchHistoryRecord = () => {
    AuthorServices.fetchHistoryRecord({ authorizeId: this.state.authId, pageSize: '1000' }).then(
      (res) => {
        if (!res) {
          return;
        }
        if (res.content && res.content.length <= 0) {
          // this.props.history.push('/author/author-result');
          this.fetchSendMobileCode();
        } else {
          this.responseHistoryRecord(res.content);
        }
      }
    );
  };

  fetchSendMobileCode = () => {
    new UserService()
      .sendCode({ mobile: this.mobile, platform: 'YYHT', msgSymbol: '201' })
      .then((data) => {
        if (data) {
          this.counter();
          this.setState({ visible: true });
        }
      });
  };

  responseHistoryRecord = (res) => {
    if (!res) return;
    const { typeData, columns } = this.state;
    let resultData = [];
    for (let i = 0; i < res.length; i++) {
      let item = res[i];
      let resultItem = {
        key: i,
        taskId: item.taskId,
        authMonth: {
          date: item.authMonth.text,
          value: item.authMonth.value,
          checked: false,
        },
      };
      for (let key in item) {
        if (typeData.indexOf(key) > -1) {
          let tmp = {
            date: item.authMonth.text,
            item: key,
            checked: false,
            text: item[key] === true ? '已有上链数据' : '-',
          };
          let jsonStr = '{"' + key + '":' + JSON.stringify(tmp) + '}';
          resultItem = Object.assign({}, resultItem, JSON.parse(jsonStr));
        }
      }
      resultData.push(resultItem);
    }
    let resultColumns = [];
    resultColumns.push(columns[0]);
    for (let i = 1; i < columns.length; i++) {
      let tmp = columns[i];
      if (typeData.indexOf(tmp.dataIndex) > -1) {
        resultColumns.push(tmp);
      }
    }
    this.setState({ columns: resultColumns, dataSource: resultData });
  };

  handleDateChange = (e) => {
    const { dataSource } = this.state;
    let tmpDataSource = dataSource;
    for (let i = 0; i < tmpDataSource.length; i++) {
      let tmp = tmpDataSource[i];
      for (let key in tmp) {
        if (
          (tmp[key]['checked'] || tmp[key]['checked'] === false) &&
          e.target.defaultValue === tmpDataSource[i][key]['date']
        ) {
          tmpDataSource[i][key]['checked'] = e.target.checked;
        }
      }
    }
    this.setState({ dataSource: tmpDataSource });
  };
  handleItemChange = (e) => {
    const { dataSource } = this.state;
    let tmpDataSource = dataSource;
    for (let i = 0; i < tmpDataSource.length; i++) {
      let tmp = tmpDataSource[i];

      for (let key in tmp) {
        if (
          e.target.item &&
          key === e.target.item.item &&
          tmpDataSource[i]['authMonth']['date'] === e.target.item.date
        ) {
          tmpDataSource[i][key]['checked'] = e.target.checked;
        }
      }
    }
    this.setState({ dataSource: tmpDataSource });
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let stateData = this.state.dataSource;
      for (let i = 0; i < stateData.length; i++) {
        let tmp = stateData[i];
        for (let key in tmp) {
          if (tmp[key].date) {
            stateData[i][key].checked = false;
          }
        }
      }
      for (let i = 0; i < selectedRows.length; i++) {
        let tmp = selectedRows[i];
        for (let j = 0; j < stateData.length; j++) {
          if (tmp['key'] === stateData[j]['key']) {
            for (let key in stateData[j]) {
              if (stateData[j][key].date) {
                stateData[j][key].checked = true;
              }
            }
          }
        }
      }
      this.setState({ dataSource: stateData });
    },
  };

  onClickNext = () => {
    let isChoice = false;
    for (let i = 0; i < this.state.dataSource.length; i++) {
      let tmpItem = this.state.dataSource[i];
      for (let key in tmpItem) {
        if (tmpItem[key] && tmpItem[key].checked === true) {
          isChoice = true;
        }
      }
    }
    if (isChoice === false) {
      message.info('您还没有选择授权的项目');
      return;
    }
    if (this.state.computedTime === 0) {
      this.fetchSendMobileCode();
      return;
    }
    if (this.timer) {
      this.setState({ visible: true });
    }
  };

  onHandleMoal = () => {
    const { dataSource } = this.state;
    this.setState({ visible: false });
    let authConfirmDtos = [];
    for (let i = 0; i < this.state.dataSource.length; i++) {
      let tmp = dataSource[i];
      let resultItem = { authMonth: tmp.authMonth.value, taskId: tmp.taskId };
      tmp.bizDataSheet && tmp.bizDataSheet.checked === true
        ? (resultItem = Object.assign({}, resultItem, { bizDataSheet: true }))
        : (resultItem = Object.assign({}, resultItem, { bizDataSheet: false }));
      tmp.balanceSheet && tmp.balanceSheet.checked === true
        ? (resultItem = Object.assign({}, resultItem, { balanceSheet: true }))
        : (resultItem = Object.assign({}, resultItem, { balanceSheet: false }));
      tmp.cashFlowSheet && tmp.cashFlowSheet.checked === true
        ? (resultItem = Object.assign({}, resultItem, { cashFlowSheet: true }))
        : (resultItem = Object.assign({}, resultItem, { cashFlowSheet: false }));
      tmp.profitSheet && tmp.profitSheet.checked === true
        ? (resultItem = Object.assign({}, resultItem, { profitSheet: true }))
        : (resultItem = Object.assign({}, resultItem, { profitSheet: false }));
      authConfirmDtos.push(resultItem);
    }
    this.setState({ loadingShow: true });
    AuthorServices.fetchAuthorUpload({
      authorizeId: this.state.authId,
      uin: this.state.mobile,
      authConfirmDtos: authConfirmDtos,
    }).then((res) => {
      this.setState({ loadingShow: false });
      if (!res) {
        return;
      }
      if (res.responseCode === '000') {
        this.props.history.push('/author/author-result');
      } else {
        message.info(res.responseMsg);
      }
    });
  };

  counter = () => {
    this.data.computedTime = 60;
    this.timer = setInterval(() => {
      this.data.computedTime--;
      this.setState({ computedTime: this.data.computedTime });
      if (this.data.computedTime == 0) {
        clearInterval(this.timer);
      }
    }, 1000);
  };

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  onCancelModal = () => {
    this.setState({ visible: false });
  };

  onReSendCode = () => {
    this.counter();
    this.fetchSendMobileCode();
  };

  render() {
    const { breadData, dataSource, columns } = this.state;

    return (
      <div className="selectChainDataContainer">
        <Breadcrumb breadData={breadData} />
        <Content>
          <Table
            rowSelection={this.rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            scroll={{ x: true, y: 500 }}
          />
          <div
            style={{
              textAlign: 'center',
              marginTop: '50px',
            }}
          >
            <Button type="primary" className="buttonStyle" onClick={this.onClickNext}>
              数据上链
            </Button>
          </div>
        </Content>
        <MobileMotal
          mobile={this.mobile}
          visible={this.state.visible}
          onHandleMoal={this.onHandleMoal.bind(this)}
          computedTime={this.state.computedTime}
          onCancelModal={this.onCancelModal.bind(this)}
          onReSendCode={this.onReSendCode.bind(this)}
        />
        {this.state.loadingShow === true ? (
          <div className="loading">
            <Spin tip="数据授权中，请稍后" />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  }
}
