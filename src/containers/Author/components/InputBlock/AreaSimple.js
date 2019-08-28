import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';
import {Link} from 'react-router-dom';
import { Input,Button } from 'antd';
class AreaSimple extends Component {


  onClickQuery = () =>{ 
    this.props.onClickQuery();
  }
  
  onClickOneKeyCopy = () =>{
    this.props.onClickOneKeyCopy();
  }

  render() {  
    const {
       placeholder,
       name,
      onClickQuery
    } = this.props;
    return (
      <div className="inputBlockContainer simple">
         <div style={{width:'115px',textAlign:'right',paddingRight:'13px'}}>{name}：</div>
         <Input.TextArea placeholder={placeholder} autosize={{ minRows: 10, maxRows: 12 }}/>
         <div className="oneKeyCopy" onClick={()=>this.onClickOneKeyCopy()}>一键复制</div>
      </div>  

    );
  }
}
AreaSimple.propTypes = {
//   breadData: PropTypes.array
};

export default AreaSimple;
