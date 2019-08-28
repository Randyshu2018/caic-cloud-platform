import React from 'react';
import { Link } from 'react-router-dom';
import { Message, Icon, Spin, Button, Layout, Checkbox, Table } from 'antd';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';
import CreateProjectServices from 'src/services/createProject';
import { getStorageObj, getPageQuery, isEmpty } from 'src/modules/utils';
import AsyncComponent from 'src/components/AsyncComponent/AsyncComponent';
import '../pkg.scss';

const ComponentAgreement = AsyncComponent(() => import('src/components/Agreement'));
const antIcon = <Icon type="loading" style={{ fontSize: 28 }} spin />;

@ComponentEvent(Event)
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: null,
      sureBuyNewPackage: false,
      list: [],
      isAccredis: true,
      loading: false,
    };
  }

  get storageUser() {
    const { loginAccount: { member: { memberId } = {} } = {} } = getStorageObj('user');
    return { memberId };
  }

  get search() {
    return getPageQuery();
  }

  componentDidMount() {
    CreateProjectServices.fetchOrderPackage(this.storageUser.memberId).then((packages) => {
      if (isEmpty(packages)) {
        this.fetchData();
      }
      this.setState({ packages });
    });
  }

  choosePackage = (packageId) => () => {
    if (!this.state.isAccredis) {
      return Message.info('请勾选"我已阅读并同意"服务协议再进行此操作');
    }

    this.props.history.push(`2?packageId=${packageId}`);
  };

  async fetchData() {
    try {
      const res = await CreateProjectServices.fetchQueryNewPackageList(this.storageUser.memberId);
      const list = Array.isArray(res) ? res : [];
      //临时增加描述
      list.forEach((item) => {
        if (item.name.indexOf('试用') > -1) item['mark'] = '价值5888';
        if (item.name.indexOf('运营版A') > -1) item['mark'] = '项目面积≤30000m²';
        if (item.name.indexOf('运营版B') > -1) item['mark'] = '项目面积>30000m²';
        if (item.name.indexOf('诊断版') > -1) item['mark'] = '原价50000';
      });

      this.setState({ list });
    } catch (error) {
      console.log(error);
    }
  }

  buyNewPackage = (e) => {
    e.preventDefault();

    this.setState({ sureBuyNewPackage: true }, this.fetchData);
  };

  render() {
    const { packages, sureBuyNewPackage, list } = this.state;

    if (packages == null) return null;
    if (sureBuyNewPackage === true || isEmpty(packages)) {
      return (
        <Spin indicator={antIcon} spinning={this.state.loading}>
          <Layout className="eju-projectCombo eju-flex-a">
            <div className="eju-projectCombo_header_title text-center">
              <h1>资管云套餐</h1>
              <p>各类资产轻松管，体检维度全覆盖，专项报告更全面、专业、精细</p>
            </div>
            <div className="eju-projectCombo_body eju-flex-row">
              {list.map((item, index) => (
                <div key={index} className="item eju-flex-column eju-flex-a">
                  {item.flag != null && <div className="pkg-flag">{item.flag}</div>}
                  <div className="item-title">{item.name}</div>
                  <div className="eju-flex-1 eju-flex-column eju-flex-a">
                    <div className="item-original-price">
                      {/* 原价<span className="line-through">{item.origPrice}</span> */}
                      <span>{item.mark}</span>
                    </div>
                    <div className="item-price">{item.price}</div>
                    {/* <div className="item-day">每天仅￥{item.effectiveMonth}</div> */}
                    <div className="item-content-row">
                      {(item.origServiceList || []).map(
                        (v, index) =>
                          v.quantity == 0 ? (
                            <div className="dont line-through" key={index}>
                              {v.name}
                            </div>
                          ) : (
                            <div key={index}>{`${v.name}`}</div>
                          )
                      )}
                    </div>
                  </div>
                  <Button
                    className="item-btn eju-flex-center"
                    onClick={this.choosePackage(item.id)}
                    disabled={!item.enabled}
                  >
                    选择套餐
                  </Button>
                </div>
              ))}
            </div>
            <div className="eju-projectCombo_footer eju-flex-a eju-flex-row">
              <Checkbox onChange={this.handleCheckBoxChange} defaultChecked>
                我已阅读并同意
              </Checkbox>
              <ComponentAgreement>
                <span className="text-span" style={{ marginLeft: '-10px' }}>
                  《用户协议》
                </span>
              </ComponentAgreement>
            </div>
          </Layout>
        </Spin>
      );
    } else {
      const packagesColumns = [
        {
          title: '订单主体',
          dataIndex: 'merchantName',
        },
        {
          title: '套餐类型',
          dataIndex: 'pkgName',
        },
        {
          title: '服务内容',
          dataIndex: 'services',
        },
        {
          title: '可建项目',
          dataIndex: 'unUsedProject',
          render(unUsedProject) {
            return unUsedProject + ' 个';
          },
        },
        {
          title: '操作',
          dataIndex: 'orderId',
          render: (orderId) => <Link to={`3?orderId=${orderId}`}>使用</Link>,
        },
      ];

      return (
        <div className="choose-package">
          <h1>选择套餐</h1>
          <div style={{ margin: '20px 0' }}>发现您有可用套餐，可直接创建项目</div>
          <Table columns={packagesColumns} dataSource={packages} pagination={false} />
          <div className="fr" style={{ marginTop: 20 }}>
            您也可以<a href="#" onClick={this.buyNewPackage}>
              购买新套餐
            </a>
          </div>
        </div>
      );
    }
  }
}

export default View;
