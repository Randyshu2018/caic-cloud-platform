import React, { Component } from 'react';
import './style.scss';
import AuthorServices from '../../../../services/author';
import { Modal, Input } from 'antd';

export default class MobileMotal extends Component {
  state = {
    mobileError: '',
    visible: false,
    stateCount: 60,
    mobileCode: [-1, -1, -1, -1], //验证码
  };

  fetchVerifyMobileCode = () => {
    const { mobileCode } = this.state;
    const { mobile } = this.props;
    AuthorServices.fetchVerifyMobileCode(mobile, mobileCode.join('')).then((res) => {
      // if (!res) {
      //   return;
      // }
      if (res.responseCode === '000') {
        this.setState({ visible: false });
        this.props.onHandleMoal();
      } else {
        this.setState({ mobileError: res.responseMsg });
      }
    });
  };

  componentDidMount() {
    this.setState({ visible: this.props.visible });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible, stateCount: nextProps.computedTime });
  }

  handleModalOk = (e) => {
    const { mobileCode } = this.state;
    for (let i = 0; i < mobileCode.length; i++) {
      if (mobileCode[i] === -1) {
        this.setState({ mobileError: '验证码不正确' });
        return;
      }
    }
    this.fetchVerifyMobileCode();
  };
  handleModalCancel = (e) => {
    this.setState({ visible: false });
    this.props.onCancelModal();
  };

  onChangeInputNumber1 = (e) => {
    //  console.log(e.target.value);
    let code = this.state.mobileCode;
    code[0] = e.target.value;
    this.setState({ mobileCode: code });
  };
  onChangeInputNumber2 = (e) => {
    let code = this.state.mobileCode;
    code[1] = e.target.value;
    this.setState({ mobileCode: code });
  };
  onChangeInputNumber3 = (e) => {
    let code = this.state.mobileCode;
    code[2] = e.target.value;
    this.setState({ mobileCode: code });
  };
  onChangeInputNumber4 = (e) => {
    let code = this.state.mobileCode;
    code[3] = e.target.value;
    this.setState({ mobileCode: code });
  };

  onReSendCode = () => {
    this.props.onReSendCode();
  };

  render() {
    const { mobile } = this.props;
    return (
      <div className="mobileContainer">
        <Modal
          title="提示"
          visible={this.state.visible}
          onOk={this.handleModalOk}
          style={{
            textAlign: 'center',
          }}
          onCancel={this.handleModalCancel}
        >
          <img src={require('../../../../assets/motal_mobile.svg')} />
          <p
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              margin: '15px 0px 0px 0px',
            }}
          >
            输入验证码
          </p>
          <p
            style={{
              fontSize: '14px',
              color: '#828BAA',
              margin: '0px 0px 10px 0px',
            }}
          >
            验证码已发送至手机：<span
              style={{
                color: '#3369DF',
              }}
            >
              +86 {mobile}
            </span>
          </p>
          <div>
            <Input
              size="large"
              min={0}
              max={9}
              onChange={this.onChangeInputNumber1}
              style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#EFEFEF',
                marginRight: '10px',
              }}
            />
            <Input
              size="large"
              min={0}
              max={9}
              onChange={this.onChangeInputNumber2}
              style={{
                // marginLeft: '20px',
                width: '42px',
                height: '42px',
                backgroundColor: '#EFEFEF',
                marginRight: '10px',
              }}
            />
            <Input
              size="large"
              min={0}
              max={9}
              onChange={this.onChangeInputNumber3}
              style={{
                // marginLeft: '20px',
                width: '42px',
                height: '42px',
                backgroundColor: '#EFEFEF',
                marginRight: '10px',
              }}
            />
            <Input
              size="large"
              min={0}
              max={9}
              onChange={this.onChangeInputNumber4}
              style={{
                // marginLeft: '20px',
                width: '42px',
                height: '42px',
                backgroundColor: '#EFEFEF',
              }}
            />{' '}
            {this.state.mobileError != '' ? (
              <p
                style={{
                  marginTop: '10px',
                  color: 'red',
                }}
              >
                {this.state.mobileError}
              </p>
            ) : (
              ''
            )}
          </div>
          <p
            style={{
              fontSize: '14px',
              color: '#828BAA',
              margin: '10px 0px',
              textAlign: 'left',
              marginLeft: '110px',
            }}
          >
            <span
              style={{
                color: '#3369DF',
              }}
            >
              {this.state.stateCount}s&nbsp;
            </span>
            {this.state.stateCount === 0 || this.state.stateCount === '0' ? (
              <span style={{ cursor: 'pointer', color: '#3b5efe' }} onClick={this.onReSendCode}>
                重新发送
              </span>
            ) : (
              <span>重新发送</span>
            )}
            {/* <span style={{ cursor: 'pointer' }} onClick={this.onReSendCode}>
                重新发送
              </span> */}
          </p>
        </Modal>
      </div>
    );
  }
}
MobileMotal.propTypes = {
  //   breadData: PropTypes.array
};
MobileMotal.defaultProps = {
  mobile: '',
  visible: false,
};
