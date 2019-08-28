import React from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { setStorage } from '../../modules/utils';
import { UserService } from '../../services/login';
import { NETWORK_ERROR, LOGIN_TOKEN_NAME } from '../../modules/ENUM';
import './Register.scss';

class Register extends React.Component {
  static CODE_TEXT = '发送验证码';
  static CODE_LENGTH = 4;
  static SECOND = 60;
  state = {
    codeText: Register.CODE_TEXT,
  };
  componentDidMount() {}

  userService = new UserService();
  time = Register.SECOND;

  //   login = (e) => {
  //     e.preventDefault();
  //     this.props.form.validateFields(['mobile', 'code'], (err, values) => {
  //       if (!err) {
  //         this.userService.login({ ...values, loginType: 1 }).then((userData) => {
  //           if (userData.responseCode === '000') {
  //             userData = userData.data;
  //             const { token, loginAccount } = userData;
  //             setStorage('user', userData);
  //             setStorage('mobile', loginAccount && loginAccount.mobile);
  //             setStorage(LOGIN_TOKEN_NAME, token);
  //             // that.props.history.push('/author/index');
  //             window.location.href = '/#/author/index';
  //             // window.location.reload();
  //             return;
  //           }
  //           //  message.info(userData.responseMsg || NETWORK_ERROR);
  //         });
  //       }
  //     });
  //   };

  //   getCode = () => {
  //     const mobile = this.props.form.getFieldValue('mobile');

  //     if (this.time === Register.SECOND) {
  //       this.userService.sendCode({ mobile, codeLength: Register.CODE_LENGTH }).then(() => {
  //         message.success('发送验证码成功');

  //         this.timer = setInterval(() => {
  //           if (--this.time <= 0) {
  //             clearInterval(this.timer);
  //             this.time = Register.SECOND;
  //             this.setState({ codeText: Register.CODE_TEXT });
  //           } else {
  //             this.setState({ codeText: this.time + 's' });
  //           }
  //         }, 1000);
  //       });
  //     }
  //   };
  register = () => {};
  render() {
    const { getFieldDecorator } = this.props.form;
    const { codeText } = this.state;

    return (
      <div className="register-bg">
        <div className="register-main">
          <div className="title">
            <div>注册账号</div>
            <div>确认信息填写完整，点击按钮提交注册信息</div>
          </div>
          <Form onSubmit={this.register} className="register-form">
            <Form.Item>
              <Input
                prefix={<img src={require('./assets/user.svg')} alt="" />}
                placeholder="请输入姓名"
              />
            </Form.Item>
            <Form.Item>
              <Input
                prefix={<img src={require('./assets/password.svg')} alt="" />}
                placeholder="请输入登录密码"
              />
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('mobile', {
                rules: [
                  { required: true, message: '请输入你的手机号' },
                  { pattern: /^1[0-9]{10}$/, message: '请输入正确的手机号' },
                ],
              })(
                <Input
                  type="number"
                  prefix={<img src={require('./assets/phone.svg')} alt="" />}
                  placeholder="请输入你的手机号"
                />
              )}
            </Form.Item>
            <Form.Item>
              <Row gutter={12}>
                <Col span={16}>
                  {getFieldDecorator('code', {
                    rules: [
                      { required: true, message: '请输入验证码' },
                      {
                        max: Register.CODE_LENGTH,
                        message: `验证码的长度为${Register.CODE_LENGTH}`,
                      },
                      {
                        min: Register.CODE_LENGTH,
                        message: `验证码的长度为${Register.CODE_LENGTH}`,
                      },
                    ],
                  })(
                    <Input
                      type="number"
                      prefix={<img src={require('./assets/code.svg')} alt="" />}
                      placeholder="请输入验证码"
                    />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    type="primary"
                    htmlType="button"
                    className="get-code"
                    onClick={this.getCode}
                  >
                    {codeText}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                提交
              </Button>
            </Form.Item>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <a href="#/login" style={{ textDecoration: 'underline', color: '#3B5EFE' }}>
              已有账号？点击登录
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(Register);
