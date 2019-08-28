import React, { Component } from 'react';
import NProgress from 'nprogress';
import { connect } from 'react-redux';
import { Spin, Drawer } from 'antd';
import FormLayout from 'src/components/Form/rentForm';
import '../style/index.scss';
import contractConfig from './contractConfig';
import api from 'api';
import * as Context from 'src/containers/Rent/context';

const { ContextComponent } = Context;
class newRent extends Component {
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

  // onClose = () => {
  //   this.setState({
  //     visible: false,
  //   });
  // };

  get requset() {
    const { noNewPro, id } = this.props;
    return {
      get: async (params = {}) => {
        if (noNewPro || !id) {
          return {};
        }
        NProgress.start();
        try {
          // 设置参数
          const query = {
            contractId: id,
            // add query...
          };
          const res = await api.contractDetail(query);
          //
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
          console.log(error.message);
          return {};
        } finally {
          NProgress.done();
        }
        // console.log('requset get: 获取数据');
      },
      set: async (formValue = {}) => {
        const attachFiles = formValue.attachFilesUrl || [];
        let otherFormValue = {
          contractRooms: formValue.contractRooms,
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
            // depositNumber: formValue.depositNumber,
            // payNumber: formValue.payNumber,
            // depositAmt: parseInt(formValue.depositAmt, 10),
            signingDate: formValue.signingDate,
            // singlePrice: parseFloat(formValue.singlePrice),
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
        try {
          const res = await api.contractSave(otherFormValue);
          if (res) {
            this.props.close(false);
            window.tableGetData();
            window.getData();
          }
          return res;
        } catch (error) {}
        // console.log('requset get: 保存数据');
      },
    };
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
      onClose: this.onClose,
    };
    const { noNewPro, close } = this.props;
    if (!data.hasOwnProperty('key')) return <Spin />;

    return (
      <div className="newRent">
        <Drawer
          className="rent-container"
          title={noNewPro ? `新建租赁合同` : `租赁合同详情`}
          width={720}
          onClose={() => close(false)}
          visible
        >
          {/* 房源信息 */}
          <div className="houseForm">
            <ContextComponent.Provider
              value={{
                disabled: !this.props.noNewPro,
                isEdit: this.props.noNewPro,
                buildNewsList: this.state.buildNews || [],
              }}
            >
              <FormLayout {...propsValue} noNewPro={noNewPro} onClose={() => close(false)} />
            </ContextComponent.Provider>
          </div>
        </Drawer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    sideProjects: { selectSideProject },
  } = state;

  return {
    project: selectSideProject,
  };
};

export default connect(mapStateToProps)(newRent);
