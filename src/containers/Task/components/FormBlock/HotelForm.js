import React, { Component } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col } from 'antd';
import AuthorServices from '../../../../services/author';
import CalendarIcon from '../../../../components/Icon/CalendarIcon';
const FormItem = Form.Item;

class HotelForm extends Component {
  state = {
    error: '',
    startTimeRangeOptions: [],
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.handleSubmit(values);
      }
    });
  };

  backClick = () => {
    this.props.backClick();
  };

  render() {
    const { data, action } = this.props;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
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
      <div className="hformContainer">
        <Form onSubmit={this.handleSubmit}>
          <Row style={{ padding: '0px 30px 20px 30px' }}>
            <Col span={12} style={{ fontSize: '22px' }}>
              {this.props.name}
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
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
                >
                  <img
                    src={require('../../../../assets/button_save.svg')}
                    style={{ marginRight: '8px', height: '15px' }}
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
                    style={{ marginRight: '8px', height: '15px' }}
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

          <Row style={{ padding: '0px 30px 0px 30px' }}>
            <Col span={4}>
              <FormItem {...formItemLayout} label="平均房价">
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
                      maxLength={12}
                      defaultValue={data.averagePrice}
                      disabled={action === 'query' ? true : false}
                    />
                    <div className="afterUnit">元/㎡.月</div>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="平均出租率" style={{ marginLeft: '50px' }}>
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
                      disabled={action === 'query' ? true : false}
                    />
                    <div className="afterUnit">%</div>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label="平均revpar">
                {getFieldDecorator('revpar', {
                  initialValue: data && data.revpar,
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的平均revpar',
                    },
                    {
                      required: false,
                      pattern: new RegExp(/^\d+(\.\d+)?$/, 'g'),
                      message: '请输入正确的平均revpar',
                    },
                  ],
                })(
                  <div className="inputContainer">
                    <Input
                      placeholder="请输入平均revpar"
                      maxLength={12}
                      defaultValue={data.revpar}
                      disabled={action === 'query' ? true : false}
                    />
                    <div className="afterUnit">元</div>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
HotelForm.propTypes = {
  //   breadData: PropTypes.array
};

export default Form.create()(HotelForm);
