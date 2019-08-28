import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';
import {Link} from 'react-router-dom';
import { Input,Button } from 'antd';
class InputBlock extends Component {

  render() {
    return (
      <div className="inputBlockContainer">
         <div className="inputItem">
             <Input placeholder="请输入手机号查询" addonBefore="手机号码："/>
         </div>  
         <div className="inputItem PaddingLeft30">
             <Input placeholder="请输入姓名查询" addonBefore="姓名："/>
         </div> 
         <div className="inputItem PaddingLeft30">
           <Button type="primary" onClick={()=>this.props.clickFilter()} style={{backgroundColor:'#3B5EFE'}}>查询</Button>
         </div>  
         <div className="inputItem">
           <Link to={'/author/step-input-mobile'}>
           <Button type="primary" style={{backgroundColor:'#1ADAA5',borderColor:'#1ADAA5'}}>+ 新增授权账号</Button>
           </Link>
         </div> 
      </div>  

    );
  }
}
InputBlock.propTypes = {
  breadData: PropTypes.array
};

export default InputBlock;
