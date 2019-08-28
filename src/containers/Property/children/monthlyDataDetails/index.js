import NProgress from 'nprogress';
import React from 'react';
import VIEW from 'src/containers/Property/view';
import PropertyServices from 'src/services/property';
import 'src/containers/Property/style.scss';
import ComponentEvent from 'src/hoc/componentEvent';
import Event from './event';
import * as Context from 'src/containers/Property/context';
import { getPageQuery, getStorageObj } from 'src/modules/utils';
import { Spin, Button, message } from 'antd';
import asyncConfigDataSources from 'src/containers/Property/configData/monthly/index';
import FormLayout from 'src/components/Form/Property';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import Upload from './upload';
import Cochain from './cochain';
import { hasAssetProjectId, hasBusinessType } from 'src/containers/Property/configData/asyncData';
const { ContextComponent } = Context;

@VIEW
@ComponentEvent(Event)
class View extends React.Component {
  constructor(props) {
    super(props);
    /**
     * OFFICE     办公
     * COMMERCIAL 商业
     * HOTEL      酒店
     * APARTMENT  公寓
     * PARK       园区
     * GARAGE     车库
     */
    const {
      match: {
        params: { year },
      },
    } = props;
    this.state = {
      breadData: [
        { name: '月度数据', path: `/property/monthly-data/list?year=${year}` },
        { name: '详情' },
      ],
      data: {},
      spinning: false,
      visible: false,
      visibleUpload: false,
      isLoading: true,
      notEBLTDA: {
        // 直接输入EBITDA 是 否表达值不同，这里取不需要的项值
        '0': ['_LR_EBITDA'],
        '1': ['_JYCB_ZCGLFJZSYJ', '_JYCB_GYJZBDSY', '_JYSR_YYWSR'],
        notValidate: [
          'COMMERCIAL_SRXG_TDL',
          'COMMERCIAL_SRXG_HYXSE',
          'COMMERCIAL_SRXG_HYZS',
          'COMMERCIAL_SRXG_KLL',
        ],
      },
      ...this.stateParms(props),
    };
  }
  stateParms(props) {
    const {
      $$sideProjects: { businessType, name: assetProjectName, assetProjectDto },
      match: {
        params: { year, monthly: month },
      },
    } = props;
    let assetProjectId = null;
    if (hasAssetProjectId(props)) {
      assetProjectId = assetProjectDto.id;
    }
    const {
      member: { memberId: operatorId, name: operatorName },
    } = this.userData;
    return {
      contextType: businessType,
      uploadParams: {
        taskId: this.query.taskId || '',
        year,
        month,
        assetProjectName,
        assetProjectId,
        operatorId,
        operatorName,
        businessType,
      },
      params: {
        projectName: assetProjectName,
        period: `${year}年${month}期`,
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:', nextProps);
    this.setState(
      {
        isLoading: true,
        ...this.stateParms(nextProps),
      },
      () => this.fetchConfigData()
    );
  }
  componentDidMount() {
    NProgress.start();
    this.fetchConfigData();
  }
  get userData() {
    const o = Object.hasOwnProperty;
    const obj = getStorageObj('user');
    const key = 'loginAccount';
    return o.call(obj, key) ? obj[key] : { member: {} };
  }
  get query() {
    const {
      props: {
        match: {
          params: { year },
          url,
        },
        history: { replace },
      },
    } = this;
    const query = {
      ...getPageQuery(),
      year,
      replace,
      url,
    };
    return query;
  }
  get requset() {
    return {
      get: async (params = {}) => {
        const { taskId } = this.query;
        if (!taskId) return {};
        const { data = {} } = await PropertyServices.fetchGetTask({ ...params, taskId });
        const dataMap = { ...data.dataMap };
        delete data.dataMap;
        dataMap.SELECT_EBITDA_FLAG = dataMap.SELECT_EBITDA_FLAG ? '1' : '0';
        return { ...dataMap, ...data };
      },
      set: async (dataMap = {}) => {
        dataMap.SELECT_EBITDA_FLAG = dataMap.SELECT_EBITDA_FLAG === '1';
        return this.save(dataMap);
      },
      editData: async (params = {}) => {
        return [];
      },
    };
  }
  async save(dataMap) {
    /**
     * OFFICE     办公
     * COMMERCIAL 商业
     * HOTEL      酒店
     * APARTMENT  公寓
     * PARK       园区
     * GARAGE     车库
     */
    const {
      props: {
        match: {
          params: { year, monthly: month },
        },
        $$sideProjects: { name: assetProjectName, assetProjectDto },
      },
      state: { contextType: type },
      query: { taskId },
      userData: {
        member: { memberId: operatorId, name: operatorName },
      },
    } = this;
    const params = {
      assetProjectName,
      operatorName: operatorName || '操作员',
      operatorId,
      businessType: type,
      year,
      month,
      taskId: taskId || this.taskId,
      dataMap,
    };
    if (hasAssetProjectId(this.props)) {
      params.assetProjectId = assetProjectDto.id;
    }
    const res = await PropertyServices.fetchGetTaskSave(params);
    if (res.data) {
      this.taskId = res.data;
      this.setState((state) => ({
        uploadParams: Object.assign(state.uploadParams, { taskId: res.data }),
      }));
      this.handleUpPageDetails();
    }
    return res;
  }
  async fetchConfigData() {
    if (!hasBusinessType(this.state.contextType)) return NProgress.done();
    const getSources = await asyncConfigDataSources(this.state.contextType);
    this.setState((state) => ({
      isLoading: false,
      data: typeof getSources === 'object' ? getSources : state.data,
    }));
    NProgress.done();
  }

  async fetchUp2Chain() {
    const {
      userData: {
        member: { memberId },
      },
      query: { taskId = this.taskId },
    } = this;
    this.handleCancel();
    if (!taskId) return message.info('请先保存表单信息');
    this.setState({ spinning: true });
    const res = await PropertyServices.fetchUp2Chain({ memberId, taskId });
    if (res.responseCode === '000') {
      message.success('上链成功');
      this.Up2ChainSuccess();
    } else {
      this.setState({ spinning: false });
    }
  }

  render() {
    const {
      state: { spinning, params, data, contextType, isLoading, notEBLTDA },
      onUploadCallback,
      onFormRefsCallBack,
      requset,
    } = this;
    if (isLoading) return <Breadcrumb breadData={this.state.breadData} />;
    return (
      <React.Fragment>
        <Breadcrumb breadData={this.state.breadData} />
        <Spin spinning={spinning}>
          <ContextComponent.Provider
            value={{
              data,
              contextType,
              params,
              requset,
              notEBLTDA,
              onFormRefsCallBack,
            }}
          >
            <div className="eju_container monthly">
              <FormLayout
                renderBtn={() => (
                  <Button type="primary" onClick={this.handleSubmit}>
                    提交
                  </Button>
                )}
              >
                <Button type="upload" icon="upload" onClick={this.handleUpload}>
                  导入
                </Button>
                {/* <Button type="primary" onClick={this.handleSubmit}>
                  提交
                </Button> */}
              </FormLayout>
            </div>
          </ContextComponent.Provider>
          {
            <Cochain
              handleOk={this.handleCochainOk}
              handleCancel={this.handleCancel}
              visible={this.state.visible}
            />
          }
          {
            <Upload
              hideModel={this.hideModel}
              visible={this.state.visibleUpload}
              params={this.state.uploadParams}
              onCallback={onUploadCallback}
            />
          }
        </Spin>
      </React.Fragment>
    );
  }
}

export default View;
