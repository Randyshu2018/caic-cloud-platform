import React from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';
import { Form, Input, Button, Row, Col, Modal } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Steps from '../../components/Steps/Steps';
import Content from '../../components/Layout/Content';
import { AuthorizeServices } from '../../services/author';
import { getQueryValueByName } from '../../modules/utils';
import { stepsData } from './authorizeBase';
import './Author.scss';

const FormItem = Form.Item;

class MakePrivateKey extends React.Component {
  state = {
    breadData: [
      {
        path: '/author/index',
        name: '授权管理',
      },
      {
        path: '/',
        name: '新增授权账号',
      },
    ],
    visible: false,
    mobile: this.props.match.params.mobile,
    memberName:
      decodeURIComponent(getQueryValueByName(this.props.location.search, 'memberName')) || '',
    privateKey: '',
  };

  componentDidMount() {}

  makePrivateKey = () => {
    this.props.form.validateFields(['mobile', 'memberName'], (err, { mobile, memberName }) => {
      if (!err) {
        new AuthorizeServices().makePrivateKey({ mobile, memberName }).then((privateKey) => {
          this.setState({ privateKey });
        });
      }
    });
  };

  copyPrivateKey = () => {
    const copySuccess = copy(this.state.privateKey, {
      debug: process.env.NODE_ENV === 'development',
      message: 'Press #{key} to copy',
    });

    if (copySuccess) {
      this.setState({ visible: true });
    }
  };

  handleModalOk = (e) => {
    this.setState({ visible: false });
  };

  handleModalCancel = (e) => {
    this.setState({ visible: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, { mobile, memberName }) => {
      if (!err) {
        new AuthorizeServices()
          .queryLicensee({ mobile, assetProjectId: this.props.projectId })
          .then(({ memberId }) => {
            this.props.history.push(
              `/author/step-select-project/0/${memberId}/${mobile}/${memberName}/个人`
            );
          });
      }
    });
  };

  render() {
    const { breadData, memberName, privateKey } = this.state;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
    };
    const formItemsLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 2,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 22,
        },
      },
    };
    return (
      <div className="stepGenContainer">
        <Breadcrumb breadData={breadData} />
        <Steps stepsData={stepsData} current={1} />
        <Content>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="手机号">
                  {getFieldDecorator('mobile', {
                    initialValue: this.state.mobile,
                    rules: [
                      {
                        required: true,
                        message: '请输入正确的手机号',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请输入手机号"
                      type="number"
                      maxLength={11}
                      minLength={10}
                      style={{ backgroundColor: '#ffffff', border: 'none', color: '#333333' }}
                      disabled
                    />
                  )}
                  <div
                    style={{
                      color: '#FA2242',
                      fontSize: '14px',
                      marginTop: '-15px',
                      marginLeft: '10px',
                    }}
                  >
                    当前用户未生成密钥，您需要代为生成
                  </div>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="姓名">
                  {getFieldDecorator('memberName', {
                    initialValue: memberName,
                    rules: [
                      {
                        required: true,
                        message: '请输入正确的姓名',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请输入姓名"
                      maxLength={30}
                      minLength={2}
                      disabled={!!memberName}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem
                  style={{
                    marginLeft: '20px',
                  }}
                >
                  <Button type="primary" onClick={this.makePrivateKey} className="buttonStyle">
                    生成秘钥
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem
                  {...formItemsLayout}
                  label="密钥"
                  style={{
                    position: 'relative',
                  }}
                >
                  {getFieldDecorator('privateKey', {
                    initialValue: privateKey,
                    rules: [
                      {
                        required: true,
                        message: '请生成秘钥',
                      },
                    ],
                  })(
                    <Input.TextArea
                      placeholder="请生成秘钥"
                      autosize={{
                        minRows: 14,
                        maxRows: 18,
                      }}
                    />
                  )}
                  {privateKey && (
                    <span className="copy-private-key" onClick={this.copyPrivateKey}>
                      一键复制
                    </span>
                  )}
                </FormItem>
              </Col>
              <Col span={8} />
            </Row>
            <FormItem
              style={{
                marginLeft: '20px',
                marginTop: '50px',
                textAlign: 'center',
              }}
            >
              <Button type="primary" htmlType="submit" className="buttonStyle">
                下一步
              </Button>
            </FormItem>
          </Form>
        </Content>
        <Modal
          // title="提示"
          visible={this.state.visible}
          onOk={this.handleModalOk}
          style={{ textAlign: 'center' }}
          onCancel={this.handleModalCancel}
          footer={null}
          centered
          style={{ maxWidth: 460 }}
          bodyStyle={{ padding: 50 }}
        >
          <div className="text-center">
            <img src={require('../../assets/motal_top.svg')} height={54} alt="copy modal" />
            <div style={{ fontSize: 22, fontWeight: 'bold', margin: '20px 0 12px' }}>
              密钥已复制成功
            </div>
            <div style={{ fontSize: 15, color: '#828BAA', marginBottom: 40 }}>
              请以邮件的或其它形式发送给 {memberName}！
            </div>
            <Button type="primary" onClick={this.handleModalCancel}>
              确定
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { merchantId, projectId },
  } = state;

  return {
    merchantId,
    projectId,
  };
};

export default Form.create()(connect(mapStateToProps)(MakePrivateKey));
