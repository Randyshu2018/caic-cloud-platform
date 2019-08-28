import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { setStorage } from '../../modules/utils';
import { UserService } from '../../services/login';
import { LOGIN_TOKEN_NAME } from '../../modules/ENUM';
import embellish from './assets/login-picture/embellish.png';
import embellish2x from './assets/login-picture/embellish@2x.jpg';
import './Login.scss';
import Legislation from 'src/components/Legislation/index';
import BasePage from '../../components/base-page/index';

class Login extends BasePage {
  static CODE_TEXT = '获取验证码';
  static CODE_LENGTH = 4;
  static SECOND = 60;
  state = {
    codeText: Login.CODE_TEXT,
    typeId: 1,
  };
  componentDidMount() {}

  userService = new UserService();
  time = Login.SECOND;

  login = (e) => {
    e.preventDefault();
    this.props.form.validateFields(['mobile', 'code'], (err, values) => {
      if (!err) {
        this.userService
          .login({ ...values, loginType: 1 })
          .then((userData) => {
            const { token, loginAccount } = userData;
            setStorage('user', userData);
            setStorage('mobile', loginAccount && loginAccount.mobile);
            setStorage(LOGIN_TOKEN_NAME, token);
            let host = window.location.href.split('#')[0];
            window.location.href = host;
          })
          .catch((error) => {
            // responseCode 不为 000，对应处理
            console.log(error);
          });
      }
    });
  };
  //登陆方式切换
  loginType = (index) => {
    this.setState({ typeId: index });
  };

  getCode = () => {
    const mobile = this.props.form.getFieldValue('mobile');

    if (this.time === Login.SECOND) {
      this.userService.sendCode({ mobile, codeLength: Login.CODE_LENGTH }).then((data) => {
        if (data) {
          message.success('发送验证码成功');

          this.timer = setInterval(() => {
            if (--this.time <= 0) {
              clearInterval(this.timer);
              this.time = Login.SECOND;
              this.setState({ codeText: Login.CODE_TEXT });
            } else {
              this.setState({ codeText: this.time + 's' });
            }
          }, 1000);
        }
      });
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { codeText, typeId } = this.state;

    return (
      <div className="login-bg">
        <div className="login-main">
          <div className="login clearfix">
            <div className="login-picture">
              <img src={embellish} srcSet={`${embellish2x} 2x`} alt="" />
            </div>
            <div className="login-form-body">
              <div className="login-choose">
                {/*<span
                  className={typeId === 0 ? 'tit active' : 'tit'}
                  onClick={() => this.loginType(0)}
                >
                  密码登录
                </span>*/}
                <span
                  className={typeId === 1 ? 'tit active' : 'tit'}
                  onClick={() => this.loginType(1)}
                >
                  验证码登录
                </span>
              </div>
              <Form onSubmit={this.login} className="login-form">
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
                      placeholder="请输入您的手机号"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {typeId === 0 ? (
                    <div>
                      <Col span={24}>
                        {getFieldDecorator('pwd', {
                          rules: [],
                        })(
                          <Input
                            prefix={<img src={require('./assets/password.svg')} alt="" />}
                            placeholder="请输入登录密码"
                          />
                        )}
                      </Col>
                    </div>
                  ) : (
                    <Row gutter={12}>
                      <Col span={16}>
                        {getFieldDecorator('code', {
                          rules: [
                            { required: true, message: '请输入验证码' },
                            {
                              max: Login.CODE_LENGTH,
                              message: `验证码的长度为${Login.CODE_LENGTH}`,
                            },
                            {
                              min: Login.CODE_LENGTH,
                              message: `验证码的长度为${Login.CODE_LENGTH}`,
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
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </Form.Item>
                {/*<Row>
                  <Col span={12}>
                    <Link to={'/forgetpwd'}>忘记密码</Link>
                  </Col>
                  <Col span={12} className="text-right">
                    <Link to={'/register'}>注册账号</Link>
                  </Col>
                </Row>*/}
              </Form>
            </div>
          </div>
        </div>
        <Legislation />
      </div>
    );
  }
}

export default Form.create()(Login);
