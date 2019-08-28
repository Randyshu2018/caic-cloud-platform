import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { Drawer, Row, Col, Form, Button, message, Icon } from 'antd';
// import FormLayout from 'src/components/Form/rentForm';
// import contractConfig from './config';
import '../style/index.scss';
// import { SelectTmpl, InputTmpl, PayType, DateTmpl, rowList } from './tmpl';
import Upload from 'src/components/Form/components/upload.js';
import api from 'api';
import config from './config';
import { observer, inject } from 'mobx-react';
import { events } from 'func';
@inject('buildManage')
@observer
@Form.create()
class App extends Component {
  state = {
    visible: true,
    data: [],
    noNewPro: true, //是否新建合同
    contractDetail: {},
    attachFiles: [],
  };
  componentDidMount() {
    this.getData();
    // console.log(this.props);
  }
  handleUploadCallback = ({ key, imageUrl }) => {
    // this.setFieldsValue({ [key]: imageUrl });
    const arr = imageUrl.map((v) => {
      const name = v.replace(/.*\//, '');
      return {
        name,
        url: v,
      };
    });
    // console.log(arr);
    this.setState({ attachFiles: arr });
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.saveContract(values);
    });
  };
  saveContract = (values) => {
    // console.log(this.props);
    const { floor, room, close, building, buildManage } = this.props;
    const { attachFiles } = this.state;
    const { signingDate, beginSignDate, endSignDate } = values;
    // console.log(building)
    for (let i in values) {
      if (values[i] === undefined) {
        message.info('请完善信息');
        return;
      }
    }
    const obj = {
      projectId: building.projectId,
      contractRooms: [
        {
          buildingId: building.id,
          floorId: floor.id,
          roomId: room.id,
          name: building.name,
          floor: floor.name,
          room: room.name,
          area: room.mgtArea,
        },
      ],
      customer: {
        lessee: values.lessee,
        industry: values.industry,
        legalPerson: values.legalPerson,
        signer: values.signer,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
      },
      contract: {
        contractNO: values.contractNO,
        depositNumber: values.depositNumber,
        payNumber: values.payNumber,
        depositAmt: values.depositAmt,
        signingDate: signingDate ? signingDate.format('YYYY-MM-DD') : '',
        singlePrice: values.singlePrice,
        beginSignDate: beginSignDate ? beginSignDate.format('YYYY-MM-DD') : '',
        endSignDate: endSignDate ? values.endSignDate.format('YYYY-MM-DD') : '',
      },
      attachFiles,
    };
    // if (!attachFiles.length) {
    //   message.info('请上传附件');
    //   return;
    // }
    // console.log(obj);
    buildManage.setContractData(obj);
    events.emit('openFeeTerms');
  };
  getData = () => {
    const { room, buildManage } = this.props;
    const { contractId } = room;
    // console.log(room);
    if (contractId === null) {
      return;
    }
    api.contractDetail({ contractId }).then((res) => {
      buildManage.setContractDetail(res || {});
      this.setState({ contractDetail: res || {} });
    });
  };
  componentWillUnmount() {
    const { buildManage } = this.props;
    buildManage.setContractDetail({});
  }
  render() {
    const { close, floor, room, isBlank, building = {} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { contractDetail } = this.state;
    const gfd = getFieldDecorator;
    const conObj = contractDetail || {};
    const attachFiles = conObj.attachFiles || [];
    const initialValue = attachFiles.map((v) => v.url);
    // console.log(initialValue)

    const dataConfig = {
      title: () => <div style={{ fontSize: '14px', margin: '10px 0' }}>合同附件</div>,
      label: '上传文件',
      uploadMax: 10,
      key: 'aaa',
      initialValue,
      fileAccept: 'image/*,.pdf,.doc,.docx',
      // // 对应类型的多种属性
      fileType: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/jpg',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
    };
    const contractData = {
      ...contractDetail,
      ...(contractDetail.customer || {}),
    };
    return (
      <React.Fragment>
        {/* <Drawer title={isBlank ? '新建租赁合同' : '合同详情'} width={720} onClose={close} visible> */}
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          {config(floor, room, gfd, contractData, building)}
          {/* <Config floor={floor} room={room} gfd={gfd} contractData={contractData} /> */}
          <Row gutter={24}>
            <Col span={1} />
            <Col span={22}>
              <Form.Item>
                {isBlank ? (
                  <Upload
                    UploadCallback={this.handleUploadCallback}
                    form={this.props.form}
                    data={dataConfig}
                    label={'上传文件'}
                  />
                ) : (
                  <div className="ht-fj">
                    <span>合同附件</span>
                    <ul>
                      {initialValue.map((v, i) => {
                        return (
                          <li key={i}>
                            <a href={v}>
                              <Icon type="link" />
                              <span style={{ paddingLeft: 10 }}>{v.replace(/.*\//, '')}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>
          {isBlank && (
            <Row gutter={24}>
              <Col span={1} />
              <Col span={22}>
                <div style={{ paddingTop: 10 }}>
                  <Button onClick={close}> {isBlank ? '取消' : '关闭'}</Button>
                  <span style={{ paddingLeft: 10 }} />
                  <Button type="primary" htmlType="submit">
                    下一步
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
        {/* </Drawer> */}
      </React.Fragment>
    );
  }
}
export default App;
