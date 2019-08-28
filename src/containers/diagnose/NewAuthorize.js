import React from 'react';
import { Modal, Table, Checkbox, Row, Col, Button } from 'antd';
import { DiagnoseStatus } from './diagnoseComponents';
import { DiagnoseServices } from '../../services/diagnoseServices';
import { getStorageObj } from '../../modules/utils';
import { map, filter, omit } from 'lodash';
import './NewAuthorize.scss';

export default class NewAuthorize extends React.Component {
  static ROW_SELECTED = 'rowSelected'; // 用于标示某一行是否选择

  state = {
    merchant: {},
    licenses: [],
    confirmLoading: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { projectId },
      },
    } = this.props;

    this.projectId = projectId;

    new DiagnoseServices().fetchLicenses(projectId).then((license) => {
      const { merchant, licenseeList } = license;

      const licenses = (licenseeList || []).map((license) => {
        license[NewAuthorize.ROW_SELECTED] = true;
        return license;
      });

      this.setState({ merchant: merchant || {}, licenses });
    });
  }

  checkKey = (licenseId, key) => (e) => {
    const checked = e.target.checked;
    this.setState(({ licenses }) => {
      const index = licenses.findIndex(({ licenseId: id }) => licenseId === id);

      // 根据 key 是否有值来判断是更改单一项还是行
      if (key) {
        licenses[index][key] = checked;
      } else {
        licenses[index][NewAuthorize.ROW_SELECTED] = checked;
      }

      return { licenses };
    });
  };

  checkAll = (e) => {
    const checked = e.target.checked;

    this.setState(({ licenses }) => {
      return {
        licenses: licenses.map((license) => {
          license[NewAuthorize.ROW_SELECTED] = checked;
          return license;
        }),
      };
    });
  };

  sureAuthorize = () => {
    const { loginAccount: { member: { memberId: operatorId } = {} } = {} } = getStorageObj('user');
    const { licenses } = this.state;

    const chan = {
      projectId: this.projectId,
      operatorId,
      licenseeList: map(
        filter(licenses, (license) => license[NewAuthorize.ROW_SELECTED]),
        (license) => {
          return omit(license, [NewAuthorize.ROW_SELECTED]);
        }
      ),
    };

    this.setState({ confirmLoading: true });
    new DiagnoseServices()
      .upToBlockChain(chan)
      .then((res) => {
        if (res) {
          this.props.history.push(`/asset-diagnose/${this.projectId}/blockchain-success`);
        }
      })
      ['finally'](() => {
        this.setState({ confirmLoading: false });
      });
  };

  cancel = () => {
    this.props.history.push(`/asset-diagnose/history/${this.projectId}`);
  };

  render() {
    const {
      confirmLoading,
      merchant: { name },
      licenses,
    } = this.state;

    const authorizeColumns = [
      {
        title: '被授权人姓名',
        dataIndex: 'licenseName',
        render: (licenseName, row) => {
          return (
            <Checkbox
              checked={row[NewAuthorize.ROW_SELECTED]}
              onChange={this.checkKey(row.licenseId)}
            >
              {licenseName}
            </Checkbox>
          );
        },
      },
      {
        title: '价值诊断',
        dataIndex: 'valueDiagnosis',
        rowClassName: 'text-center',
        className: 'text-center',
        render: (valueDiagnosis, { licenseId }) => {
          return (
            <Checkbox
              defaultChecked={valueDiagnosis}
              onChange={this.checkKey(licenseId, 'valueDiagnosis')}
            />
          );
        },
      },
      {
        title: '运营诊断',
        dataIndex: 'operateDiagnosis',
        rowClassName: 'text-center',
        className: 'text-center',
        render: (operateDiagnosis, { licenseId }) => {
          return (
            <Checkbox
              defaultChecked={operateDiagnosis}
              onChange={this.checkKey(licenseId, 'operateDiagnosis')}
            />
          );
        },
      },
      {
        title: '资产诊断',
        dataIndex: 'assetDiagnosis',
        rowClassName: 'text-center',
        className: 'text-center',
        render: (assetDiagnosis, { licenseId }) => {
          return (
            <Checkbox
              defaultChecked={assetDiagnosis}
              onChange={this.checkKey(licenseId, 'assetDiagnosis')}
            />
          );
        },
      },
      {
        title: '交易诊断',
        dataIndex: 'tradeDiagnosis',
        rowClassName: 'text-center',
        className: 'text-center',
        render: () => {
          /*return (
            <Checkbox
              defaultChecked={tradeDiagnosis}
              onChange={this.checkKey(licenseId, 'tradeDiagnosis')}
            />
          );*/
          return <DiagnoseStatus status={false} />;
        },
      },
      {
        title: '财务诊断',
        dataIndex: 'financialDiagnosis',
        rowClassName: 'text-center',
        className: 'text-center',
        render() {
          return <DiagnoseStatus status={false} />;
        },
      },
      {
        title: '融资诊断',
        dataIndex: 'financingDiagnosis',
        rowClassName: 'text-center',
        className: 'text-center',
        render() {
          return <DiagnoseStatus status={false} />;
        },
      },
    ];

    const allChecked = licenses.every((license) => license[NewAuthorize.ROW_SELECTED]);

    return (
      <div className="new-authorize">
        <Modal
          title="确认被授权人信息"
          visible={true}
          maskClosable={false}
          onOk={this.sureAuthorize}
          confirmLoading={confirmLoading}
          onCancel={this.cancel}
          footer={null}
          style={{ minWidth: 830 }}
        >
          <div className="new-authorize-body">
            <div className="tip">
              本期数据上链后将对以下被授权人开放，如需更改可在左侧勾选框内取消本期数据授权，届时被取消的授权人无法查
              看本期诊断结果。
            </div>
            <div className="company">运营主体：{name}</div>
            <Table
              rowKey="licenseId"
              columns={authorizeColumns}
              dataSource={licenses}
              pagination={false}
              style={{ margin: '0 -24px' }}
            />
            <footer className="new-authorize-footer">
              <Row>
                <Col span={16}>
                  <div className="text-left">
                    <Checkbox checked={allChecked} onChange={this.checkAll}>
                      全选
                    </Checkbox>
                  </div>
                </Col>
                <Col span={8}>
                  <div className="text-right">
                    <Button onClick={this.cancel} style={{ marginRight: 40 }}>
                      取消
                    </Button>
                    <Button onClick={this.sureAuthorize} type="primary" loading={confirmLoading}>
                      确认上链
                    </Button>
                  </div>
                </Col>
              </Row>
            </footer>
          </div>
        </Modal>
      </div>
    );
  }
}
