import React from 'react';
import VIEW from 'src/containers/Property/view';
import './style.scss';
import { hasAssetProjectId } from 'src/containers/Property/configData/asyncData';
import PropertyServices from 'src/services/property';
import * as Context from 'src/containers/Property/context';
import DataSources from 'src/containers/Property/configData/info';
import FormLayout from 'src/components/Form/Property';
import Breadcrumb from 'src/components/Breadcrumb/EBreadcrumb';
import { chooseProject } from 'src/reducers/login';

const { ContextComponent } = Context;

@VIEW
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
    this.state = {
      breadData: [{ name: '项目资管信息' }],
      data: {},
      ...this.stateParms(props),
    };
  }

  stateParms(props) {
    const {
      $$sideProjects: { businessType, name },
    } = props;
    return {
      contextType: businessType,
      params: {
        projectName: name,
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
      () => this.fetchData()
    );
  }

  componentDidMount() {
    this.fetchData();
  }

  get requset() {
    return {
      get: async () => {
        if (!hasAssetProjectId(this.props)) return false;
        const {
          assetProjectDto: { id: assetProjectId },
        } = this.props.$$sideProjects;
        if (!assetProjectId) return {};
        const fetchData = await PropertyServices.fetchQueryOrder({ assetProjectId });
        return {
          ...fetchData.data,
        };
      },
      set: async (params = {}) => {
        return await this.save(params);
      },
      editData: async (params = {}) => {
        return [];
      },
    };
  }

  async save(_params) {
    let params = { ..._params };
    /**
     * OFFICE     办公
     * COMMERCIAL 商业
     * HOTEL      酒店
     * APARTMENT  公寓
     * PARK       园区
     * GARAGE     车库
     */
    const query = {
      OFFICE: ['commercialArea', 'parkingSpaces', 'ringCertification', 'rentableArea', 'layerNum'],
      COMMERCIAL: ['operatingBuildArea', 'rentableArea', 'parkingSpaces', 'layerNum'],
      HOTEL: ['guestRooms', 'parkingSpaces', 'diningArea'],
      APARTMENT: ['rentableArea', 'rentableNumberSets', 'publicArea'],
      PARK: ['rentableArea', 'buildingNum'],
      GARAGE: [
        'groundBusinessType',
        'parkingLayers',
        'hourlyParkingSpaces',
        'monthlyParkingSpaces',
        'parkingSpaces',
        'groundParkingSpaces',
        'undergroundParkingSpaces',
        'hourlyParkingFee',
      ],
    };
    const type = this.state.contextType;
    const values = query[type];
    const item = {};
    const { assetProjectDto, name: projectName, id: projectId } = this.props.$$sideProjects;
    if (hasAssetProjectId(this.props)) {
      params.assetProjectId = assetProjectDto.id;
    }
    Array.isArray(values) &&
      values.forEach((keyJ) => {
        if (params.hasOwnProperty(keyJ)) {
          item[keyJ] = params[keyJ];
          delete params[keyJ];
        }
      });
    params[type.toLowerCase()] = item;
    params = {
      ...params,
      projectId,
      businessType: type,
      name: projectName,
    };
    const res = await PropertyServices.fetchAssetProjectSave(params);
    // res.responseCode === '000'
    console.log('创建资管项目：', res);
    if (!this.props.assetProjectId) {
      this.chooseProject(res.data);
    }
    return res;
  }

  chooseProject = (assetProjectId) => {
    const selectProject = { ...this.props.selectSideProject };
    selectProject.assetProjectDto = Object.assign(selectProject.assetProjectDto || {}, {
      id: assetProjectId,
    });
    console.log('chooseProject:', selectProject);

    this.props.dispatch(chooseProject(selectProject));
  };

  async fetchData() {
    const data = DataSources.find(({ key }) => key === this.state.contextType) || {};
    // console.log(data);
    (data.childer || []).forEach((item) => {
      if (item.key === 'type') {
        item.initialValue = data.name;
      }
    });
    this.setState((state) => ({
      isLoading: false,
      data: typeof data === 'object' ? data : state.data,
    }));
  }

  handleEvent = () => {};

  render() {
    const {
      state: { isLoading, data, contextType, params },
      handleEvent,
      requset,
    } = this;
    if (isLoading) return null;
    return (
      <React.Fragment>
        <Breadcrumb breadData={this.state.breadData} />
        <ContextComponent.Provider value={{ handleEvent, data, contextType, requset, params }}>
          <div className="eju_container">
            <FormLayout />
          </div>
        </ContextComponent.Provider>
      </React.Fragment>
    );
  }
}

export default View;
