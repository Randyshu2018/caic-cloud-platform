import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Row, Col } from 'antd';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import Steps from '../../components/Steps/Steps';
import Content from '../../components/Layout/Content';
import { AuthorizeServices } from '../../services/author';
import { isDefined } from '../../modules/utils';
import { stepsData } from './authorizeBase';
import './Author.scss';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}

class StepInputMobile extends React.Component {
  state = {};

  componentDidMount() {}

  queryLicensee(mobile, assetProjectId = this.props.projectId) {
    new AuthorizeServices().queryLicensee({ mobile, assetProjectId }).then((data) => {
      const { id, memberId, memberName = '', publicKey } = data;

      /**
       * 1. data.id != null，预授权配置信息已经存在，直接跳转授权管理->用户授权项目
       * 2. data.memberId != null && data.publicKey != null 新增授权
       * 3. 其它情况，创建密钥，新增授权
       * */
      const to = isDefined(id)
        ? `/author/author-project-detail/${id}`
        : isDefined(publicKey) && isDefined(memberId)
          ? `/author/step-select-project/0/${memberId}/${mobile}/${memberName}/个人`
          : `/author/make-private-key/${mobile}?memberName=${memberName}`;

      this.props.history.push(to);
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, { mobile }) => {
      if (!err) {
        this.queryLicensee(mobile);
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 6,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 18,
        },
      },
    };
    return (
      <div className="bodyContainer">
        <Breadcrumb
          breadData={[
            {
              path: '/author/index',
              name: '授权管理',
            },
            {
              path: '/',
              name: '新增授权账号',
            },
          ]}
        />
        <Steps stepsData={stepsData} />
        <Content>
          <Form onSubmit={this.handleSubmit} style={{ height: '500px' }}>
            <Row style={{ width: '60%', marginTop: '30px' }}>
              <Col span={14}>
                <FormItem {...formItemLayout} label="账号">
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号进行查询',
                      },
                      {
                        max: 11,
                        message: '请输入正确手机号',
                      },
                      {
                        min: 11,
                        message: '请输入正确手机号',
                      },
                    ],
                  })(<Input placeholder="请输入手机号进行查询" type="number" />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  style={{
                    marginLeft: '20px',
                  }}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="buttonStyle"
                    disabled={hasErrors(getFieldsError())}
                  >
                    查询
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Content>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { merchantId, projectId },
  } = state;

  return {
    projectId,
    merchantId,
  };
};

export default Form.create()(connect(mapStateToProps)(StepInputMobile));
