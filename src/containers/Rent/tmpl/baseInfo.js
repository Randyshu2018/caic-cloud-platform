import React, { Component } from 'react';
import NProgress from 'nprogress';
import { connect } from 'react-redux';
import { Spin, Drawer } from 'antd';
import FormLayout from 'src/components/Form/rentForm';
import '../style/index.scss';
import contractConfig from './contractConfig';
import api from 'api';
import * as Context from 'src/containers/Rent/context';
import { events } from 'func';
import { observer, inject } from 'mobx-react';
// const mapStateToProps = (state) => {
//   const {
//     sideProjects: { selectSideProject },
//   } = state;

//   return {
//     project: selectSideProject,
//   };
// };
const { ContextComponent } = Context;
@inject('buildManage')
@observer
// @connect(mapStateToProps)
class BaseInfo extends Component {
  state = {
    visible: false,
    contractId: 0,
    data: {},
    buildNews: [],
  };

  componentDidMount() {
    const { project, callback } = this.props;
    if (this.props.callback) {
      callback(this);
    }
    this.setState({
      data: contractConfig(),
    });
    // 查询楼层
    if (project.id) {
      this.getFloorData();
    }
  }
  componentDidUpdate(prevProps) {
    const { project } = this.props;
    // 典型用法（不要忘记比较 props）：
    if (+project.id !== +prevProps.project.id) {
      this.getFloorData();
    }
  }
  getFloorData = () => {
    const { project } = this.props;
    api.contractChooseFloor({ projectId: project.id }).then((res) => {
      this.setState({
        buildNews: res,
      });
    });
  };
  onShow = () => {
    this.setState({
      visible: true,
    });
  };
  get requset() {
    const { noNewPro, contractId, buildManage } = this.props;
    return {
      get: async (params = {}) => {
        if (noNewPro || !contractId) {
          return {};
        }
        NProgress.start();
        try {
          // 设置参数
          const query = {
            contractId: contractId,
            // add query...
          };
          const res = await api.contractDetail(query);
          buildManage.setContractDetail(res || {});

          if (res) {
            const data = Object.entries(res).reduce((params, [keys, values]) => {
              if (values instanceof Object && !Array.isArray(values)) {
                Object.keys(values).forEach((key) => {
                  params[key === 'id' ? `${keys}-id` : key] = values[key];
                });
              } else {
                params[keys] = values;
              }
              return params;
            }, {});
            console.log('data:', data);
            let attachFilesUrl = [];
            (data.attachFiles || []).forEach((v) => {
              if (v.url) {
                attachFilesUrl.push(v.url);
              }
            });
            data.attachFilesUrl = attachFilesUrl;
            return {
              ...data,
            };
          } else {
            throw new Error('服务异常');
          }
        } catch (error) {
          return {};
        } finally {
          NProgress.done();
        }
        // console.log('requset get: 获取数据');
      },
      set: async (formValue = {}) => {
        const attachFiles = formValue.attachFilesUrl || [];
        const contractRooms = formValue.contractRooms || [];
        let otherFormValue = {
          contractRooms: contractRooms.map((v) => {
            return {
              buildingId: v.buildingName,
              floorId: v.floorName,
              roomId: v.roomName,
              name: v.buildingNamelabel,
              floor: v.floorNamelabel,
              room: v.roomNamelabel,
              area: v.area,
            };
          }),
          customer: {
            lessee: formValue.lessee,
            industry: formValue.industry,
            legalPerson: formValue.legalPerson,
            signer: formValue.signer,
            contactName: formValue.contactName,
            contactPhone: formValue.contactPhone,
          },
          contract: {
            contractNO: formValue.contractNO,
            signingDate: formValue.signingDate,
            beginSignDate: formValue.beginSignDate,
            endSignDate: formValue.endSignDate,
          },
          attachFiles: attachFiles.map((v) => {
            return {
              name: v.replace(/.*\//, ''),
              url: v,
            };
          }),
        };
        otherFormValue.contractRooms = otherFormValue.contractRooms.reduce((o, value) => {
          var isAdd = o.find(
            (item) => value.floorId === item.floorId && value.roomId === item.roomId
          );
          isAdd || o.push(value);
          return o;
        }, []);
        console.log('otherFormValue', otherFormValue);
        events.emit('setContractData', otherFormValue);
        // try {
        //   const res = await api.contractSave(otherFormValue);
        //   if (res) {
        //     this.props.close(false);
        //     window.tableGetData();
        //     window.getData();
        //   }
        //   return res;
        // } catch (error) {}
      },
    };
  }
  componentWillUnmount() {
    const { buildManage } = this.props;
    buildManage.setContractDetail({});
  }
  render() {
    const {
      state: { params, data },
      requset,
    } = this;
    const propsValue = {
      data,
      params,
      requset,
      // 布局
      labelCol: {},
      wrapperCol: {},
    };
    const { noNewPro, close } = this.props;
    if (!data.hasOwnProperty('key')) return <Spin />;

    return (
      <div className="">
        <div className="houseForm" style={{ marginTop: '-18px' }}>
          <ContextComponent.Provider
            value={{
              disabled: !this.props.noNewPro,
              isEdit: this.props.noNewPro,
              buildNewsList: this.state.buildNews || [],
            }}
          >
            <FormLayout {...propsValue} noNewPro={noNewPro} />
          </ContextComponent.Provider>
        </div>
      </div>
    );
  }
}

export default BaseInfo;
