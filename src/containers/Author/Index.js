import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/EBreadcrumb';
import { Table, Alert } from 'antd';
import { AuthorizeServices } from '../../services/author';
import { Form, Input, Button, Row, Col } from 'antd';
import './Author.scss';

const FormItem = Form.Item;

const columns = [
  {
    title: '手机号',
    dataIndex: 'memberPhone',
  },
  {
    title: '名称',
    dataIndex: 'memberName',
  },
  {
    title: '被授权人角色',
    dataIndex: 'roleType',
  },
  {
    title: '授权有效期',
    dataIndex: 'dateRange',
  },
  {
    title: '授权时间',
    dataIndex: 'authDate',
  },
  {
    title: '操作员',
    dataIndex: 'operatorName',
  },
  {
    title: '操作',
    key: 'authId',
    render: (text, { authId, roleType, memberName, memberPhone, dateRange }) => (
      <div>
        <Link to={`/author/author-project-detail/${authId}`}>查看</Link>
        {' | '}
        <Link to={`/author/update-author-project/${authId}`}>编辑</Link>
      </div>
    ),
  },
];

class Index extends React.Component {
  state = {
    authorize: {},
    memberPhone: undefined,
    memberName: undefined,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.projectId !== this.props.projectId) {
      this.fetchAuthorizes({ assetProjectId: nextProps.projectId });
    }
  }

  componentDidMount() {
    if (!this.props.projectId) return;
    this.fetchAuthorizes({});
  }

  fetchAuthorizes = ({
    assetProjectId = this.props.projectId,
    memberPhone = this.state.memberPhone,
    memberName = this.state.memberName,
    pageNum = 1,
    pageSize = 10,
  }) => {
    new AuthorizeServices()
      .fetchAuthorizes({ assetProjectId, memberPhone, memberName, pageNum })
      .then((data) => {
        this.setState({
          authorize: data,
        });
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.fetchAuthorizes(values);
      }
    });
  };

  render() {
    const { authorize } = this.state;
    const { totalElements: total, list = [] } = authorize;

    const { getFieldDecorator } = this.props.form;

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
    if (!this.props.projectId) {
      return (
        <Alert
          message="提示"
          description={
            <span>
              请先添加项目资管信息,才能进行此操作
              <Link to="/property/info" style={{ marginLeft: '20px' }}>
                点击添加
              </Link>
            </span>
          }
          type="info"
          showIcon
        />
      );
    }
    return (
      <div className="bodyContainer">
        <Breadcrumb
          breadData={[{ path: '/', name: '授权管理' }]}
          separator=">"
          className="breadcrumb"
        />
        <Form
          onSubmit={this.handleSubmit}
          style={{
            backgroundColor: '#fff',
            padding: '20px 20px 0px 0px',
            marginTop: 30,
            borderRadius: 8,
          }}
        >
          <Row>
            <Col span={7}>
              <FormItem {...formItemLayout} label="账号">
                {getFieldDecorator('memberPhone', {
                  rules: [],
                })(
                  <Input
                    placeholder="请输入手机号或机构号"
                    type="number"
                    maxLength={11}
                    minLength={10}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('memberName', {
                  rules: [],
                })(<Input placeholder="请输入姓名或机构名称" />)}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                style={{
                  marginLeft: 20,
                }}
              >
                <Button type="primary" htmlType="submit" className="buttonStyle">
                  查询
                </Button>
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem className="text-right">
                <Button
                  type="primary"
                  onClick={() => this.props.history.push('/author/step-input-mobile')}
                  className="buttonStyle"
                >
                  + 新增授权账号
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div
          style={{
            marginTop: 30,
            borderRadius: 8,
            minHeight: window.screen.height - 400,
            backgroundColor: '#ffffff',
          }}
        >
          <Table
            rowKey="authId"
            onHeaderCell={false}
            columns={columns}
            dataSource={list}
            pagination={{
              total,
              onChange: (pageNum) => {
                this.fetchAuthorizes({ pageNum });
              },
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { projectId, merchantId },
  } = state;

  return {
    projectId,
    merchantId,
  };
};

export default Form.create()(connect(mapStateToProps)(Index));
