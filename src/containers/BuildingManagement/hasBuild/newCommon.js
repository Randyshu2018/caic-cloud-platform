import React from 'react';

import { Modal, Form, Row, Col, Button, Select, message } from 'antd';
import AddCommon from './addCommon';
import api from 'api';
import { history } from 'func';
const { confirm } = Modal;
const { Option } = Select;
class FloorForm extends React.Component {
  constructor(props) {
    super(props);
    this.getRoomList = this.getRoomList.bind(this);
  }
  state = {
    floorList: [],
    roomList: [],
  };
  componentDidMount() {
    const { type } = this.props;
    if (type === 'build') {
      this.getRoomList();
    } else {
      this.searchFloor();
    }
  }
  // 每次进来查询下楼层
  searchFloor = () => {
    return new Promise((resolve, reject) => {
      const { building } = this.props;
      const { id } = building;
      api
        .getFloorList({
          buildingId: id,
        })
        .then((res) => {
          this.setState({ floorList: res || [] }, () => {
            resolve(res && res[0]);
          });
        });
    });
  };
  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.confirm(values);
    });
  };
  confirm = (values) => {
    // console.log('Received values of form: ', values);
    const { type, building, close } = this.props;
    const req = type === 'build' ? api.createRoom : api.createFloor;
    const { id } = building;
    const arr = Object.entries(values).filter((v) => v[0].includes('new-'));
    const zzs = /^[1-9]\d*$/; //正整数
    // const zs = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/; //正数
    const obj1 = {
      buildingId: id,
      floorDataList: [],
    };
    const obj2 = {
      floorId: values.floorId || '',
      roomDataList: [],
    };
    // console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      const num1 = arr[i][1];
      const num0 = arr[i][0];
      //校验数据
      if (num1 === undefined) {
        message.info('请完善信息');
        return;
      }
      if (type === 'floor' && num0.includes('new-floor')) {
        if (!zzs.test(num1)) {
          message.info('楼层为正整数');
          return;
        }
      }
      if (num0.includes('new-area')) {
        // if (!zs.test(num1)) {
        //   message.info('面积应为正数');
        //   return;
        // }
        if (+num1 <= 0) {
          message.info('面积应为正数');
          return;
        }
      }
    }
    const floorArr = arr.filter((v) => v[0].includes('new-floor'));
    const areaArr = arr.filter((v) => v[0].includes('new-area'));
    floorArr.forEach((v, i) => {
      type === 'build'
        ? obj2.roomDataList.push({
            roomName: v[1],
            roomArea: areaArr[i][1],
          })
        : obj1.floorDataList.push({
            floorName: v[1],
            // mgtArea: areaArr[i][1],
          });
    });
    if (type === 'build' && !obj2.roomDataList.length) {
      // message.info('请添加房间');
      close();
      return;
    }
    if (type === 'floor' && !obj1.floorDataList.length) {
      // message.info('请添加楼层');
      close();
      return;
    }
    // if (!obj1.floorDataList.length || !obj2.roomDataList) {
    //   message.info(type === 'floor' ? '请添加楼层' : '请添加房间');
    //   return;
    // }
    // console.log(obj1, obj2);
    const obj = type === 'build' ? obj2 : obj1;

    req(obj).then((res) => {
      const handle = () => {
        message.success('保存成功');
        window.getBuildManageBuilding && window.getBuildManageBuilding();
        setImmediate(close);
      };
      if (res) {
        if (type === 'build') {
          if (typeof res === 'object') {
            confirm({
              title: '提示',
              cancelText: '用用再说',
              okText: '立即升级',
              content: res.responseMsg,
              onOk() {
                history.push(`/create-project/upgrade-package/${id}`);
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          } else {
            handle();
          }
        } else {
          handle();
        }
      }
    });
  };
  async getRoomList() {
    const val = await this.searchFloor();
    // console.log(val)
    this.getRoomListReq(val.id);
  }
  getRoomListReq = (floorId) => {
    api.getRoomList({ floorId }).then((res) => {
      this.setState({ roomList: res });
    });
  };
  //本地删除请求过来的条目
  delList = (val) => {
    const { floorList, roomList } = this.state;
    const { type } = this.props;
    let arr = (type === 'build' ? roomList : floorList).map((v) => v);
    for (let i = 0; i < arr.length; i++) {
      if (+arr[i].id === +val.id) {
        arr.splice(i, 1);
      }
    }
    this.setState({ [type === 'build' ? 'roomList' : 'floorList']: arr });
  };
  select = (v) => {
    // console.log(v)
    this.getRoomListReq(v);
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { children, top, title1, type, addtTitle, building } = this.props;
    const { floorList, roomList } = this.state;
    // console.log(floorList)
    return (
      <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
        {top && (
          <Row gutter={24}>
            <Col span={11}>
              <Form.Item label={`选择楼层`}>
                {getFieldDecorator(`floorId`, {
                  initialValue: floorList[0] && floorList[0].id,
                })(
                  <Select onChange={this.select}>
                    {floorList.map((v, i) => (
                      <Option key={i} value={v.id}>
                        {v.name}楼
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        )}
        <div style={{ maxHeight: 400, overflow: 'auto', padding: '10px 0' }}>
          <AddCommon
            getFieldDecorator={getFieldDecorator}
            title1={title1}
            originList={type === 'build' ? roomList : floorList}
            delList={this.delList}
            type={type}
            addtTitle={addtTitle}
            building={building}
          />
        </div>
        <Row gutter={24}>
          <Col span={24}>
            <div className="blank-line" />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={23}>
            <div className="build-floor-btns">
              {children}
              <span style={{ paddingLeft: 20 }} />
              <Button type="primary" onClick={this.handleSearch}>
                确定
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}
const FloorFormApp = Form.create({ name: 'advanced_search' })(FloorForm);
class App extends React.Component {
  render() {
    const { close, title, top, title1, type, building, addtTitle } = this.props;
    return (
      <React.Fragment>
        <Modal title={`新建${title}`} visible onCancel={close} width="730px" footer={null}>
          <FloorFormApp
            top={top}
            building={building}
            title1={title1}
            type={type}
            addtTitle={addtTitle}
            close={close}
          >
            <Button onClick={close}>取消</Button>
          </FloorFormApp>
        </Modal>
      </React.Fragment>
    );
  }
}
export default App;
