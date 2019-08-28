import React from 'react';
import { Layout } from 'antd';
import ComponentEvent from 'src/hoc/componentEvent';
import OrderServices from 'src/services/order';
import CreateProjectServices from 'src/services/createProject';
import Event from './event';
import FormLayout from 'src/components/Form/CreateProject';
import { getPageQuery } from 'src/modules/utils';

@ComponentEvent(Event)
class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  get query() {
    return getPageQuery() || {};
  }
  componentDidMount() {}

  onCallback = (id) => {
    this.props.history.push('/');
  };

  render() {
    const opt = {
      name: '创建概要项目',
      requset: {
        get: async (params = {}) => {
          const fetchData = await CreateProjectServices.fetchQueryProjectGet(params);
          const p = Object.hasOwnProperty;
          // "121.48752,31.260261"
          // 121.525848,31.236345
          if (p.call(fetchData, 'geoPoint')) {
            const geoPoint = fetchData.geoPoint.split(',');
            const value = geoPoint.length
              ? {
                  lng: Number.parseFloat(geoPoint[1]),
                  lat: Number.parseFloat(geoPoint[0]),
                }
              : '';
            fetchData.geoPoint = value;
          }
          return {
            ...fetchData,
          };
        },
        set: async (params = {}) => {
          const { orderId } = this.query;
          const k = 'geoPoint';
          if (params.hasOwnProperty(k) && typeof params[k] === 'object') {
            const { lng, lat } = params[k];
            params[k] = `${lat},${lng}`;
          }
          let res;
          if (orderId) {
            res = await OrderServices.fetchOrderAddProject({ ...params, orderId });
          } else {
            res = await CreateProjectServices.fetchCreateOrUpdateProject(params);
          }
          return res;
        },
        editData: async (params = {}) => {
          return [];
        },
      },
      children: [
        {
          title: '项目位置',
          key: 'areaCode',
          type: 'selectCity',
          tip: '请按照(省/市/区)格式填写哦',
        },
        {
          title: '详细地址_null',
          key: 'address',
          type: 'cityInput',
          formKey: ['geoPoint'],
        },
        {
          title: '地图定位',
          key: 'geoPoint',
          type: 'map',
          formKey: { 1: 'address' },
        },
        {
          title: '项目名称',
          key: 'name',
        },
        {
          title: '项目类别',
          key: 'businessType',
          type: 'select',
          initialValue: 'COMMERCIAL',
          editData: 'COMMERCIAL|商业,HOTEL|酒店,OFFICE|办公,GARAGE|车库,APARTMENT|公寓,PARK|园区'
            .split(',')
            .map((v) => {
              const sv = v.split('|');
              return { id: sv[0], value: sv[1] };
            }),
        },
      ],
    };
    const { children, requset } = opt;
    return (
      <Layout className="eju-projectOutline eju-flex-a">
        <div className="container">
          <FormLayout requset={requset} formData={children} onCallback={this.onCallback} />
        </div>
      </Layout>
    );
  }
}

export default View;
