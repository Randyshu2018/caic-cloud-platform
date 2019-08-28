import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';
import {Link} from 'react-router-dom';
import {Form, Input, Button, Row, Col} from 'antd';
const FormItem = Form.Item;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
  }
class InputSimple extends Component {

  state = {
    error: ''
  }

  handleSubmit = () => {
    // this
    //   .props
    //   .onClickQuery();
  }

  render() {
    const {error} = this.state;
    const {placeholder, name, buttonText, type} = this.props;

    const {getFieldDecorator, getFieldsError} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 6
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 18
        }
      }
    };
    return (
      <div className="inputBlockContainer simple">
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col span={14}>
              <FormItem {...formItemLayout} label="手机号">
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      required: true,
                      message: '请输入正确的手机号'
                    }
                  ]
                })(<Input placeholder="请输入手机号" type="number" maxLength={11}/>)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem style={{textAlign:'right'}}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="buttonStyle"
                  disabled={hasErrors(getFieldsError())}>
                  查询
                </Button>
              </FormItem>
            </Col>
          </Row>

        </Form>
      </div>
    );
  }
}
InputSimple.propTypes = {
  //   breadData: PropTypes.array
};

export default (Form.create()(InputSimple));
