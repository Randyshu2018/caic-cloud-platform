// 价值诊断
import DiagnoseDataServices from 'src/services/assetDiagnoseWork';
import { computeCreatorMap } from './compute';

export default {
  null: {
    requset: {
      key: 'VALUE',
      get: async (params = {}) => {
        const fetchData = await DiagnoseDataServices.fetchDiagnoseDataQuery(params);
        const data = computeCreatorMap(fetchData);
        return {
          ...data,
        };
      },
      set: async (params = {}) => {
        const res = await DiagnoseDataServices.fetchDiagnoseDataSubmit(params);
        return res;
      },
      editData: async (params = {}) => {
        return [];
      },
    },
  },
  建筑信息: {
    '土地属性（多选）': {
      key: 'VALUE_OFFICE_BUILDING_TDSX',
      editData: ['住宅', '商业', '办公', '工业', 'inputOther'].map((value) => ({
        id: value,
        value,
      })),
      type: 'checkbox',
      isInput: true,
    },
    '改造合规性（单选）': {
      key: 'VALUE_OFFICE_BUILDING_GZHGX',
      editData: [{ id: 1, value: '合规' }, { id: 0, value: '不合规' }],
      type: 'radio',
    },
  },
  经营信息: {
    办公总成本及税费: {
      key: 'VALUE_OFFICE_BIZ_BGZCBJSF',
      after: '万元／年',
    },
    经营成本: {
      key: 'VALUE_OFFICE_BIZ_JYCB',
      after: '万元／年',
    },
    人工成本: {
      key: 'VALUE_OFFICE_BIZ_RGCB',
      after: '万元／年',
    },
  },
};
