import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';
import './FormInput.scss';
import iconEye from './asset/icon/eye.svg';
import iconEyeclose from './asset/icon/eyeoclose.svg';

class InputPwd extends React.Component {
  state = { eyeStatus: 0 };
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    size: PropTypes.string,
  };

  static defaultProps = {
    size: 'large',
  };

  changeEyeStatus = () => {
    this.state.eyeStatus === 0 ? this.setState({ eyeStatus: 1 }) : this.setState({ eyeStatus: 0 });
  };

  render() {
    const { placeholder, onChange, maxLength, minLength, size } = this.props;
    const { eyeStatus } = this.state;
    return (
      <div className="form-input-container">
        <Input
          prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
          type={eyeStatus === 0 ? 'password' : 'text'}
          placeholder={placeholder}
          onChange={onChange}
          maxLength={maxLength}
          minLength={minLength}
          size={size}
        />
        <div className="eye-icon">
          <img src={eyeStatus === 0 ? iconEyeclose : iconEye} onClick={this.changeEyeStatus} />
        </div>
      </div>
    );
  }
}

//add other FromInput

export { InputPwd };
