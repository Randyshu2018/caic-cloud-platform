import DiagnoseDataServices from 'src/services/assetDiagnoseWork';
import { computeCreatorMap } from './compute';

// 资产诊断
export default {
  null: {
    requset: {
      key: 'ASSET',
      get: async (params = {}) => {
        const fetchData = await DiagnoseDataServices.fetchDiagnoseDataQuery(params);
        const data = computeCreatorMap(fetchData);
        return {
          ...data,
        };
      },
      set: async (params = {}) => {
        const res = await DiagnoseDataServices.fetchDiagnoseDataSave(params);
        return res;
      },
      editData: async (params = {}) => {
        return [];
      },
    },
  },
  建筑信息: {
    标准层使用率: {
      key: 'ASSET_OFFICE_BUILDING_BZCSYL',
      after: '%',
      span: 12,
    },
    架高地板高度: {
      key: 'ASSET_OFFICE_BUILDING_JGDBGD',
      after: '毫米',
      span: 12,
    },
    电梯平均等待时间: {
      key: 'ASSET_OFFICE_BUILDING_DTPJDDSJ',
      after: '秒',
      span: 12,
    },
    客梯梯速: {
      key: 'ASSET_OFFICE_BUILDING_KTTS',
      after: 'm/s',
      span: 12,
    },
    '电力负荷（不含空调）': {
      key: 'ASSET_OFFICE_BUILDING_DLFH',
      after: 'VA/㎡',
      span: 12,
    },
    楼板荷载: {
      key: 'ASSET_OFFICE_BUILDING_LBFH',
      after: 'kg/㎡',
      span: 12,
    },
    '环保认证（多选）': {
      key: 'ASSET_OFFICE_BUILDING_HBRZ',
      type: 'checkBoxSelect',
      initialValue: {
        EP_GREEN_BUILDING: null,
        EP_LEED: '铂金级',
        EP_OTHER: null,
      },
      editData: {
        EP_LEED: {
          name: 'LEED',
          options: ['铂金级', '金级'],
        },
        EP_GREEN_BUILDING: {
          name: '绿建',
          options: ['三星', '其他'],
        },
        EP_OTHER: {
          name: '其它',
        },
      },
    },
    '空调系统（单选）': {
      key: 'ASSET_OFFICE_BUILDING_KTXT',
      type: 'select',
      isInput: true,
      initialValue: '新风系统和VAV系统或顶板辐射系统',
      editData: [
        '新风系统和VAV系统或顶板辐射系统',
        '新风系统四管制风机盘管或风管空调系统',
        '新风系统和二管制风机盘管',
        'inputOther',
      ].map((value) => ({ id: value, value })),
    },
    '涵盖无障碍设计（多选）': {
      key: 'ASSET_OFFICE_BUILDING_HGWZASJ',
      initialValue: ['无障碍坡道'],
      editData: ['无障碍坡道', '无障碍电梯', '卫生间无障碍设施', '无'].map((value) => ({
        id: value,
        value,
      })),
      type: 'checkbox',
    },
    '是否双回路供电（单选）': {
      key: 'ASSET_OFFICE_BUILDING_SFSHLGD',
      initialValue: 1,
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
      span: 12,
    },
    '是否智能5A（单选）': {
      key: 'COMMON_OFFICE_BUILDING_SFZN5A',
      initialValue: 1,
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
      span: 12,
    },
    '是否有智能门禁系统（单选）': {
      key: 'COMMON_OFFICE_BUILDING_SFYZNMJXT',
      initialValue: 1,
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
      span: 12,
    },
    '是否有安保自动化系统集成控制（单选）': {
      key: 'COMMON_OFFICE_BUILDING_SFYABZDHXTJCKZ',
      initialValue: 1,
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
      span: 12,
    },
  },
  经营信息: {
    '是否整层出售（单选）': {
      key: 'ASSET_OFFICE_BIZ_SFZCCS',
      initialValue: 1,
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
    },
    出售物业占比: {
      key: 'ASSET_OFFICE_BIZ_CSWYZB',
      after: '%',
    },
  },
};
