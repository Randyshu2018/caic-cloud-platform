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

class BusinessForm extends Component {
  state = {
    error: '',
    startTimeRangeOptions: [],
    mainShopNum: 2,
    mainShopList: [{ name: '', area: '' }, { name: '', area: '' }],
    formShopItemLayout: {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 5,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 19,
        },
      },
    },
    formAreaItemLayout: {
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

  componentDidMount() {
    this.fetchInitData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.action !== 'create') {
      let mainStores = nextProps.data.mainStores;
      this.setState({ mainShopList: mainStores });
      return;
    }
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
    tmpShop.push({ name: '', area: '' });
    this.setState({ mainShopList: tmpShop });
  };

  backClick = () => {
    this.props.backClick();
  };

  render() {
    const { mainShopList } = this.state;
    const { data, action } = this.props;
    let mainStores = mainShopList;
    if (!mainShopList) {
      mainStores = [{ name: '', area: '' }, { name: '', area: '' }];
    }

    const { getFieldDecorator, getFieldsError } = this.props.form;

    const formInnerItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 9,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 15,
        },
      },
    };
    return (
      <div className="bformContainer">
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
              <FormItem {...formInnerItemLayout} label="平均房价">
                {getFieldDecorator('averagePrice', {
                  initialValue: data && data.averagePrice,
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的平均房价',
                    },
                    {
                      required: false,
                      pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                      message: '请输入正确的房价',
                    },
                  ],
                })(
                  <div className="inputContainer">
                    <Input
                      placeholder="请输入房价"
                      maxLength={8}
                      defaultValue={data.averagePrice}
                      disabled={action === 'query'}
                    />
                    <div className="afterUnit">元/㎡.月</div>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col
              span={6}
              style={{
                marginLeft: '50px',
              }}
            >
              <FormItem {...formInnerItemLayout} label="平均出租率">
                {getFieldDecorator('occupancyRate', {
                  initialValue: data && data.occupancyRate,
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
                      disabled={action === 'query'}
                    />
                    <div className="afterUnit">%</div>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formInnerItemLayout} label="坪效">
                {getFieldDecorator('revpar', {
                  initialValue: data && data.revpar,
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的坪效',
                    },
                  ],
                })(
                  <div className="inputContainer">
                    <Input
                      placeholder="请输入坪效"
                      maxLength={12}
                      defaultValue={data.revpar}
                      disabled={action === 'query'}
                    />
                    <div className="afterUnit">元</div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>

          {mainStores.map((item, index) => (
            <Row key={'row' + index}>
              <Col span={10}>
                <FormItem
                  key={'name' + index}
                  {...this.state.formShopItemLayout}
                  label={'主力店' + (index + 1)}
                  style={{
                    marginLeft: '-20px',
                  }}
                >
                  {getFieldDecorator('mainStoresName' + index, {
                    initialValue: item.name,
                    // Option.defaultValue: item.name,
                    rules: [
                      {
                        required: false,
                        message: '请输入正确的主力店',
                      },
                    ],
                  })(
                    <Input
                      placeholder="请输入主力店"
                      //   defaultValue={item.name}
                      disabled={action === 'query'}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem
                  key={'name' + index}
                  {...this.state.formAreaItemLayout}
                  label="规模"
                  style={{
                    marginLeft: '8px',
                  }}
                >
                  {getFieldDecorator('mainStoresArea' + index, {
                    initialValue: item.area,
                    rules: [
                      {
                        required: false,
                        message: '请输入正确的规模',
                      },
                    ],
                  })(
                    <div className="inputContainer">
                      <Input
                        placeholder="请输入规模"
                        // type="number"
                        maxLength={5}
                        defaultValue={item.area}
                        disabled={action === 'query'}
                      />
                      <div className="afterUnit">㎡</div>
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
              <Col span={10} style={{ paddingLeft: '7.5%' }}>
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
BusinessForm.propTypes = {
  //   breadData: PropTypes.array
};

export default Form.create()(BusinessForm);
