import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, message } from 'antd';
import { UserService } from '../../../services/login';
import { getStorageObj } from '../../../modules/utils';
import './MobileCode.scss';

export class MobileCode extends React.Component {
  static get mobile() {
    const { loginAccount: { mobile } = {} } = getStorageObj('user');
    return mobile;
  }

  static propTypes = {
    mobile: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    visible: PropTypes.bool.isRequired,
    onOk: PropTypes.func.isRequired,
  };

  static defaultProps = {
    mobile: MobileCode.mobile,
  };

  static seconds = 60; // 验证码间隔时间，单位秒

  time = MobileCode.seconds; // 验证码倒计时间

  state = {
    visible: false,
    confirmLoading: false,
    mobileCode: [],
    codeText: '',
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.visible !== this.state.visible) {
      // 弹层打开时默认发送验证码
      if (nextProps.visible) {
        this.getCode();
      }
      this.setState({ visible: nextProps.visible });
    }
  }

  verifyCode = async () => {
    this.setState({ confirmLoading: true });

    /**
     * @param arr {Array}
     * @return {boolean | string}
     */
    function generateCode(arr) {
      const code = arr.reduce((a, b) => a + b, '');
      return /^\d{4}$/.test(code) && code;
    }

    const { mobileCode } = this.state;
    const code = generateCode(mobileCode);

    if (code) {
      try {
        await new UserService()
          .verifyCode({ mobile: this.props.mobile, msgSymbol: '201', code })
          .then(() => {
            this.setState({ codeModelVisible: false });
            // 验证码成功
            this.props.onOk();
          });
      } catch (e) {
        console.log(e);
      }
    }

    this.setState({ confirmLoading: false });
  };

  getCode = () => {
    if (this.time === MobileCode.seconds) {
      new UserService()
        .sendCode({ mobile: this.props.mobile, msgSymbol: '201' })
        .then((data) => {
          if (data) {
            message.success('发送验证码成功');

            this.timer = setInterval(() => {
              if (--this.time <= 0) {
                clearInterval(this.timer);
                this.time = MobileCode.seconds;
                this.setState({ codeText: '' });
              } else {
                this.setState({ codeText: this.time + 's' });
              }
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  codeInput = (index, nextTarget) => (e) => {
    const value = e.target.value;

    this.setState(({ mobileCode }) => {
      if (/^\d$/.test(value)) {
        // 当下一个输入框不为空时，自动获取焦点
        if (nextTarget && this[nextTarget] && !this[nextTarget].value) {
          this[nextTarget].focus();
        }
        mobileCode[index] = value;
      } else {
        mobileCode[index] = '';
      }
      return { mobileCode };
    });
  };

  closeModal = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, confirmLoading, mobileCode, codeText } = this.state;
    const { mobile } = this.props;

    return (
      <Modal
        className="mobile-code-modal text-center"
        // title="Title"
        visible={visible}
        onOk={this.verifyCode}
        onCancel={this.closeModal}
        maskClosable={false}
        footer={null}
        centered
        bodyStyle={{ padding: '50px 0 60px' }}
      >
        <div className="code-check-icon">
          <img src={require('src/assets/motal_mobile.svg')} height="70" alt="phone" />
        </div>
        <div className="modal-tip">输入验证码</div>
        <div className="modal-code-mobile">
          验证码已发送至手机：<span style={{ color: '#3369DF' }}>+86 {mobile}</span>
        </div>
        <div className="mobile-code-input">
          <input
            type="text"
            maxLength="1"
            value={mobileCode[0]}
            onChange={this.codeInput(0, 'two')}
          />
          <input
            type="text"
            maxLength="1"
            value={mobileCode[1]}
            onChange={this.codeInput(1, 'three')}
            ref={(el) => (this.two = el)}
          />
          <input
            type="text"
            maxLength="1"
            value={mobileCode[2]}
            onChange={this.codeInput(2, 'four')}
            ref={(el) => (this.three = el)}
          />
          <input
            type="text"
            maxLength="1"
            value={mobileCode[3]}
            onChange={this.codeInput(3)}
            ref={(el) => (this.four = el)}
          />
          <div className="get-code" onClick={this.getCode}>
            <span style={{ color: '#3369DF' }}>{codeText}</span> 重新发送
          </div>
        </div>
        <footer className="text-center">
          <Button key="submit" type="primary" loading={confirmLoading} onClick={this.verifyCode}>
            确定
          </Button>
        </footer>
      </Modal>
    );
  }
}
