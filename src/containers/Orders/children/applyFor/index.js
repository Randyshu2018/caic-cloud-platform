import React from 'react';
import 'src/containers/Orders/style.scss';
import { Layout, Button } from 'antd';
import PropertyServices from 'src/services/property';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import FormLayout from 'src/components/Form/OrdersApplyFor';
import ConfigDataSources, { applyTypes } from 'src/containers/Orders/configData/OrdersApplyFor';

class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breadData: [
        { name: '订单中心', path: '/orders/center' },
        { name: '详情', path: '/orders/detail' },
        { name: '申请发票' },
      ],
      data: {},
      hasIssueRoot: false,
    };
    this.editData = applyTypes;
  }

  get requset() {
    return {
      get: async () => {
        // const fetchData = await PropertyServices.fetchQueryOrder();
        return {};
      },
      set: async (params = {}) => {
        return await this.save(params);
      },
      editData: async (params = {}) => {
        return [];
      },
    };
  }
  componentDidMount() {
    this.setState({
      hasIssueRoot: true,
      data: ConfigDataSources(3),
    });
  }
  async fetchData() {
    this.setState((state) => ({
      isLoading: false,
    }));
  }
  handleFormChange = ({ target: { value } }, props, form) => {
    console.log(props.issueRoot);
    // 选择开具类型
    // 1. 企业
    // 2. 个人
    if (props.issueRoot) {
      this.setState(
        {
          hasIssueRoot: false,
        },
        () => {
          this.setState({ hasIssueRoot: true, data: ConfigDataSources(value) });
        }
      );
    } else if (props.applyRoot) {
      const required = props.applyRoot === value;
      const data = { ...this.state.data };
      const formKey = [];
      data.childer.map((_i) => {
        if (_i.rules) {
          _i.rules = [{ required, message: ' ' }];
          required || formKey.push(_i.key);
        }
        return _i;
      });
      form.resetFields(formKey);
      this.setState({
        data,
      });
    }
  };
  render() {
    const {
      state: { hasIssueRoot, params, data, isLoading },
      requset,
      onFormRefsCallBack,
    } = this;
    if (isLoading) return null;
    const formProps = {
      data,
      params,
      requset,
      onFormRefsCallBack,
      onChange: this.handleFormChange,
    };
    return (
      <Layout className="order-layout">
        <Breadcrumb breadData={this.state.breadData} />
        <div className="eju_container order-apply-for">
          {hasIssueRoot ? <FormLayout {...formProps} /> : null}
        </div>
      </Layout>
    );
  }
}

export default View;
