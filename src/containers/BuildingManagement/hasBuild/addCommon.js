import React from 'react';
import { Form, Row, Col, Input, Popconfirm, message } from 'antd';
import delimg from '../img/del.png';
import api from 'api';
export const FormList = ({
  getFieldDecorator,
  index,
  del,
  title1,
  title2,
  origin,
  value,
  type,
}) => {
  return (
    <Row gutter={24}>
      <Col span={11}>
        <Form.Item label={title1 || `楼层`}>
          {getFieldDecorator(`${origin ? 'origin' : 'new'}-floor-${index}`, {
            initialValue: value.name,
          })(<Input placeholder="" disabled={origin ? true : false} />)}
        </Form.Item>
      </Col>
      {type === 'build' && (
        <Col span={11}>
          <Form.Item label={title2 || `面积/㎡`}>
            {getFieldDecorator(`${origin ? 'origin' : 'new'}-area-${index}`, {
              initialValue: value.mgtArea,
            })(<Input placeholder="" type="number" disabled={origin ? true : false} />)}
          </Form.Item>
        </Col>
      )}
      <Col span={1}>
        <Popconfirm title="确定要删除吗" onConfirm={del}>
          <img className="new-floor-del-img" src={delimg} alt="" />
        </Popconfirm>
      </Col>
    </Row>
  );
};

//复用的中间

export default class AddCommon extends React.Component {
  state = {
    formList: [],
  };
  addList = () => {
    const { formList } = this.state;
    const arr = formList.map((v) => v);
    arr.push({});
    this.setState({ formList: arr });
  };
  del = (val, index, isOrigin) => {
    const { delList, type } = this.props;
    const { formList } = this.state;
    const req = type === 'build' ? api.deleteRoom : api.deleteFloor;
    const obj = {
      [type === 'build' ? 'roomId' : 'floorId']: val.id,
    };
    if (isOrigin) {
      // console.log(type)
      req(obj).then((res) => {
        if (res === true) {
          window.delBuildManageState = true;
          delList(val);
        }
        // else {
        //   message.info('删除出错');
        // }
      });
      return;
    }
    const arr = formList.map((v) => v);
    for (let i = 0; i < arr.length; i++) {
      if (+index === +i) {
        arr.splice(i, 1);
      }
    }
    this.setState({ formList: arr });
  };
  render() {
    const { formList } = this.state;
    const { getFieldDecorator, addtTitle, title1, originList, type } = this.props;
    return (
      <React.Fragment>
        {originList.map((v, i) => {
          return (
            <FormList
              getFieldDecorator={getFieldDecorator}
              key={i}
              index={i}
              del={() => this.del(v, i, true)}
              title1={title1}
              origin
              value={v}
              type={type}
            />
          );
        })}
        {formList.map((v, i) => {
          return (
            <FormList
              getFieldDecorator={getFieldDecorator}
              key={i}
              index={i}
              del={() => this.del(v, i)}
              title1={title1}
              value={v}
              type={type}
            />
          );
        })}
        <Row gutter={24}>
          <Col span={22}>
            <div className="add-floor" onClick={this.addList}>
              +{addtTitle || '添加楼层'}
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
