import React from 'react';
import { Form, Row, Col, Input, Button, Icon, DatePicker, message, Cascader } from 'antd';
import api from 'api';
import Upload from 'src/components/Form/components/upload.js';
import { connect } from 'react-redux';
import moment from 'moment';
import typeConfig from './typeConfig';
import { history } from 'func';
const dateFormat = 'YYYY-MM-DD';

class App extends React.Component {
  constructor(props) {
    super(props);
    const { detail = {} } = this.props;
    this.state = {
      expand: false,
      attachFiles: detail.attachFile || '',
      visible: true,
      isQuery: null,
    };
  }

  componentDidMount() {
    // console.log(this.props);
    this.getQueryProject();
  }
  //先去查询有没有配置过
  getQueryProject = () => {
    const { project } = this.props;
    api
      .queryByProjectId({
        projectId: project.id,
      })
      .then((res) => {
        // console.log(res)
        this.setState({
          isQuery: res,
        });
      });
  };
  handleUploadCallback = ({ key, imageUrl }) => {
    // this.setFieldsValue({ [key]: imageUrl });
    // console.log(key, imageUrl);
    this.setState({ attachFiles: imageUrl[0], visible: false });
  };
  handleSearch = (e) => {
    const { reload, project, detail = {} } = this.props;
    const { id } = detail;
    const { attachFiles, isQuery } = this.state;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log('Received values of form: ', values);
      // return;
      let { completionDate, amortizationReq } = values;
      const obj = {
        ...values,
        completionDate: completionDate ? completionDate.format('YYYY-MM-DD') : '',
        projectName: project.name,
        projectId: project.id,
        attachFiles,
        id: id || '',
        amortizationReq:
          isQuery === null
            ? {
                projectId: project.id,
                amortizationCalculationType: amortizationReq[0] || '',
                unNaturaMonthlyConversion: amortizationReq[2] || '',
                amortizationType: amortizationReq[1] || '',
              }
            : isQuery,
      };
      // console.log(obj)
      // return
      const phoneReg = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
      // const areaReg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      Object.keys(obj).forEach((v) => {
        if (obj[v] === undefined) {
          obj[v] = '';
        }
      });

      if (obj.contactPhone) {
        if (!phoneReg.test(obj.contactPhone)) {
          message.info('请填写正确的电话号');
          return;
        }
      }
      if (obj.coveredArea === '' || obj.floorArea === '') {
        message.info('请完善必填信息');
        return;
      }
      if (+obj.coveredArea <= 0 || +obj.floorArea <= 0) {
        message.info('面积为正数');
        return;
      }
      if (!obj.completionDate || !obj.coveredArea || !obj.floorArea || !obj.name || !obj.owner) {
        message.info('请完善必填信息');
        return;
      }
      if (isQuery === null && amortizationReq.length === 0) {
        message.info('请完善必填信息');
        return;
      }
      if (!attachFiles) {
        message.info('请上传照片');
        return;
      }
      // console.log(obj)
      api.createBuilding(obj).then((res) => {
        if (res !== null) {
          message.success('保存成功');
          // setTimeout(reload);
          setTimeout(() => history.push(`/operation/build-manage/${res}`));
        }
      });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, detail = {} } = this.props;
    const { visible, isQuery } = this.state;
    // console.log(detail)
    const dataConfig = {
      title: () => '',
      label: '上传文件',
      uploadMax: 1,
      key: 'build-manage',
      // initialValue: detail.attachFile ? [detail.attachFile || ''] : [],
      initialValue: [],
      // fileAccept: 'image/*,.pdf',
      // // 对应类型的多种属性
      // fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'application/pdf'],
      fileAccept: 'image/*',
      // 对应类型的多种属性
      fileType: ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'],
    };
    let queryProject = [];
    if (isQuery === null) {
      queryProject = [];
    } else {
      const { amortizationCalculationType, amortizationType, unNaturalMonthlyConversion } = isQuery;
      queryProject = [
        amortizationCalculationType,
        amortizationType || '',
        unNaturalMonthlyConversion || '',
      ];
    }
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={`楼宇名称`}>
              {getFieldDecorator(`name`, {
                initialValue: detail.name || '',
                rules: [
                  {
                    required: true,
                    message: '请填写楼宇名称',
                  },
                ],
              })(<Input placeholder="" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`所有权人`}>
              {getFieldDecorator(`owner`, {
                initialValue: detail.owner || '',
                rules: [
                  {
                    required: true,
                    message: '请填所有权人',
                  },
                ],
              })(<Input placeholder="" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={`楼宇建筑面积/㎡`}>
              {getFieldDecorator(`coveredArea`, {
                initialValue: detail.coveredArea || '',
                rules: [
                  {
                    required: true,
                    message: '请填写楼宇面积',
                  },
                ],
              })(<Input placeholder="" type="number" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`占地面积/㎡`}>
              {getFieldDecorator(`floorArea`, {
                initialValue: detail.floorArea || '',
                rules: [
                  {
                    required: true,
                    message: '请填写占地面积',
                  },
                ],
              })(<Input placeholder="" type="number" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={`招商联系电话`}>
              {getFieldDecorator(`contactPhone`, {
                initialValue: detail.contactPhone || '',
                rules: [
                  {
                    required: true,
                    message: '请填写招商联系电话',
                  },
                ],
              })(<Input placeholder="" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={`用途`}>
              {getFieldDecorator(`purpose`, {
                rules: [
                  {
                    // required: true,
                    message: '请填写用途',
                  },
                ],
              })(<Input placeholder="" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={`建成时间`}>
              {getFieldDecorator(`completionDate`, {
                initialValue: detail.completionDate
                  ? moment(detail.completionDate, dateFormat)
                  : undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择时间',
                  },
                ],
              })(<DatePicker style={{ width: '100%' }} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label={`摊销计算类型 / 分摊类型 / 非整自然月换算`}>
              {getFieldDecorator(`amortizationReq`, {
                initialValue: queryProject || [],
                rules: [
                  {
                    required: true,
                    message: '请选择',
                  },
                ],
              })(<Cascader options={typeConfig} placeholder="" disabled={isQuery !== null} />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={
                <span>
                  <span style={{ color: 'red' }}>*</span>楼宇照片
                </span>
              }
            >
              {getFieldDecorator(`attachFiles`, {
                // initialValue: detail.attachFile || '',
                rules: [
                  {
                    // required: true,
                    message: '请上传图片',
                  },
                ],
              })(
                <React.Fragment>
                  <div style={{ display: 'flex' }}>
                    {detail.attachFile &&
                      visible && (
                        <img
                          className="mr-10"
                          src={detail.attachFile || ''}
                          style={{ width: 102, height: 102 }}
                          alt=""
                        />
                      )}
                    <Upload
                      UploadCallback={this.handleUploadCallback}
                      form={this.props.form}
                      data={dataConfig}
                      label={`${detail.attachFile ? '替换图片' : '上传图片'}`}
                    />
                  </div>
                </React.Fragment>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            {children}
            <Button type="primary" onClick={this.handleSearch}>
              确定
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    sideProjects: { selectSideProject },
  } = state;

  return {
    project: selectSideProject,
    // selectSideProject,
  };
};
export default connect(mapStateToProps)(Form.create({ name: 'advanced_search' })(App));
