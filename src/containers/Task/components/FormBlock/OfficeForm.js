import React, { Component } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col } from 'antd';
import AuthorServices from '../../../../services/author';
import CalendarIcon from '../../../../components/Icon/CalendarIcon';
const FormItem = Form.Item;
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some((field) => fieldsError[field]);
}
class OfficeForm extends Component {
  state = {
    error: '',
    startTimeRangeOptions: [],
    mainShopNum: 2,
    mainShopList: ['', ''],
    formShopItemLayout: {
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
    },
    formAreaItemLayout: {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 17,
        },
      },
    },
  };

  fetchInitData = () => {
    AuthorServices.fetchDataRange({ projectId: '1' }).then((res) => {
      if (!res) {
        return;
      }
      this.setState({ startTimeRangeOptions: res.beginDates });
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.action !== 'create') {
      let mainTenantNames = nextProps.data.mainTenantNames;
      this.setState({ mainShopList: mainTenantNames });
      return;
    }
  }

  componentDidMount() {
    this.fetchInitData();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  deleteShop = (index) => {
    let tmpShopItem = this.state.mainShopList;
    tmpShopItem.splice(index, 1);
    this.setState({ mainShopList: tmpShopItem });
  };

  clickAddMainShop = () => {
    let tmpShop = this.state.mainShopList;
    tmpShop.push('');
    this.setState({ mainShopList: tmpShop });
  };

  backClick = () => {
    this.props.backClick();
  };

  render() {
    const { mainShopList } = this.state;
    const { data, action } = this.props;

    let mainTenantNames = mainShopList;
    if (!mainShopList) {
      mainTenantNames = ['', ''];
    }
    const { getFieldDecorator, getFieldsError } = this.props.form;

    const formInnerItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 8,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 16,
        },
      },
    };
    return (
      <div className="offormContainer">
        <Form onSubmit={this.handleSubmit}>
          <Row
            style={{
              padding: '0px 30px 20px 30px',
            }}
          >
            <Col
              span={12}
              style={{
                fontSize: '22px',
              }}
            >
              {this.props.name}
            </Col>
            <Col
              span={12}
              style={{
                textAlign: 'right',
              }}
            >
              {action !== 'query' ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="buttonStyle"
                  style={{
                    marginRight: '30px',
                    backgroundColor: '#00E4A5',
                    borderColor: '#00E4A5',
                  }}
                  disabled={hasErrors(getFieldsError())}
                >
                  <img
                    src={require('../../../../assets/button_save.svg')}
                    style={{
                      marginRight: '8px',
                      height: '15px',
                    }}
                  />
                  保存
                </Button>
              ) : (
                ''
              )}
              <Link
                to={
                  '/task/detail/' +
                  this.props.id +
                  '?date=' +
                  this.props.dateMonth +
                  '&assetType=' +
                  this.props.assetType
                }
              >
                <Button type="primary" className="buttonStyle">
                  <img
                    src={require('../../../../assets/button_back.svg')}
                    style={{
                      marginRight: '8px',
                      height: '15px',
                    }}
                  />
                  返回
                </Button>
              </Link>
            </Col>
          </Row>

          <Row
            style={{
              padding: '0px 0px 20px 30px',
              marginBottom: '20px',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <Col span={3}>
              <div className="Filter__calendar">
                <CalendarIcon />
                <span>{this.props.dateMonth}期</span>
              </div>
            </Col>
          </Row>

          <Row
            style={{
              padding: '0px 30px 0px 30px',
            }}
          >
            <Col span={4}>
              <FormItem {...formInnerItemLayout} label="平均租金">
                {getFieldDecorator('averagePrice', {
                  initialValue: data.averagePrice,
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的平均租金',
                    },
                    {
                      required: false,
                      pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                      message: '请输入正确的租金',
                    },
                  ],
                })(
                  <div className="inputContainer">
                    <Input
                      placeholder="请输入租金"
                      maxLength={12}
                      defaultValue={data.averagePrice}
                      disabled={action === 'query' ? true : false}
                    />
                    <div className="afterUnit">元/㎡.月</div>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col
              span={7}
              style={{
                marginLeft: '57px',
              }}
            >
              <FormItem {...formInnerItemLayout} label="平均出租率">
                {getFieldDecorator('occupancyRate', {
                  initialValue: data.occupancyRate,
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的平均出租率',
                    },
                    {
                      required: false,
                      pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                      message: '请输入正确的平均出租率',
                    },
                  ],
                })(
                  <div className="inputContainer">
                    <Input
                      placeholder="请输入平均出租率"
                      maxLength={7}
                      defaultValue={data.occupancyRate}
                      disabled={action === 'query' ? true : false}
                    />
                    <div className="afterUnit">%</div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>

          {mainTenantNames.map((item, index) => (
            <Row key={index}>
              <Col span={12}>
                <FormItem
                  {...this.state.formShopItemLayout}
                  label={'主力租户' + (index + 1)}
                  style={{
                    marginLeft: '-20px',
                  }}
                >
                  {getFieldDecorator('mainTenantNames' + index, {
                    initialValue: item,
                    rules: [
                      {
                        required: false,
                        message: '请输入正确的主力租户',
                      },
                    ],
                  })(
                    <div className="inputContainer">
                      <Input
                        placeholder="请输入主力租户"
                        //   defaultValue={item}
                        disabled={action === 'query' ? true : false}
                      />
                      <div className="afterDelete">
                        {index > 1 &&
                          action !== 'query' && (
                            <img
                              src={require('../../../../assets/form_item_delete.svg')}
                              onClick={() => this.deleteShop(index)}
                            />
                          )}
                      </div>
                    </div>
                  )}
                </FormItem>
              </Col>
            </Row>
          ))}

          {action !== 'query' && (
            <Row>
              <Col span={12} style={{ paddingLeft: '7.5%' }}>
                <Button type="primary" onClick={this.clickAddMainShop} className="buttonAdd">
                  + 添加主力店
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </div>
    );
  }
}
OfficeForm.propTypes = {
  //   breadData: PropTypes.array
};

export default Form.create()(OfficeForm);
