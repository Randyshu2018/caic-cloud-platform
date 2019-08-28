// 运营诊断
import DiagnoseDataServices from 'src/services/assetDiagnoseWork';
import { computeCreatorMap } from './compute';

export default {
  null: {
    requset: {
      key: 'OPERATE',
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
  企业信息: {
    运营商: {
      key: 'OPERATE_OFFICE_COMPANY_YYS',
    },
  },
  建筑信息: {
    '是否智能5A（单选）': {
      key: 'COMMON_OFFICE_BUILDING_SFZN5A',
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
    },
    '是否有智能门禁系统（单选）': {
      key: 'COMMON_OFFICE_BUILDING_SFYZNMJXT',
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
    },
    '是否有安保自动化系统集成控制（单选）': {
      key: 'COMMON_OFFICE_BUILDING_SFYABZDHXTJCKZ',
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
    },
  },
  经营信息: {
    成本数据表_null: {
      name: '成本数据表',
      key: 'OPERATE_OFFICE_BIZ_CBSJB',
      tableColumns: [
        {
          title: '时间',
          dataIndex: 'COST_DATE',
          key: 'COST_DATE',
          editable: true,
          width: 90,
          align: 'center',
          inputType: 'select',
        },
        {
          title: '人工成本（万元）',
          dataIndex: 'COST_LABOR_COST',
          key: 'COST_LABOR_COST',
          editable: true,
          width: 115,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '管理成本（万元）',
          dataIndex: 'COST_MANAGEMENT_COST',
          key: 'COST_MANAGEMENT_COST',
          editable: true,
          width: 180,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '营销成本（万元）',
          dataIndex: 'COST_MARKETING_COST',
          key: 'COST_MARKETING_COST',
          editable: true,
          width: 110,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '租金收缴率（%）',
          dataIndex: 'COST_RENTAL_COLLECTION_RATE',
          key: 'COST_RENTAL_COLLECTION_RATE',
          editable: true,
          width: 150,
          align: 'center',
          inputType: 'number',
        },
      ],
      dataSource: [],
      type: 'editableTable',
    },
  },
};
