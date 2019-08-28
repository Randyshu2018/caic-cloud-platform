// 交易诊断
import DiagnoseDataServices from 'src/services/assetDiagnoseWork';
import { computeCreatorMap } from './compute';

export default {
  null: {
    requset: {
      key: 'TRADE',
      get: async (params = {}) => {
        const fetchData = await DiagnoseDataServices.fetchDiagnoseDataQuery(params);
        const data = computeCreatorMap(fetchData);
        return {
          ...data,
        };
      },
      set: async (params = {}) => {
        const res = await this.props.$carinfo.saveBaseInfo(params);
        return res;
      },
      editData: async (params = {}) => {
        return [];
      },
    },
    项目名称: {
      key: 'brand',
      disabled: true,
      span: 24,
    },
    其他名称: {
      key: 'carType',
    },
    诊断对象: {
      key: 'ssssqwe',
      type: 'textArea',
    },
  },
  企业信息: {
    物业公司名称: {
      key: 'seatType',
    },
    项目开发商: {
      key: 'seatNum',
    },
    项目投资商: {
      key: 'seatNum2a',
    },
  },
  产品信息: {
    城市: {
      key: 'site',
      type: 'site',
      span: 12,
    },
    地址: {
      key: 'seatType22',
      span: 6,
    },
    物业等级: {
      key: 'seatNum_sss',
      type: 'select',
      islose: true,
      editData: ['超级甲', '甲级', '乙级'].map((value) => ({ id: value, value })),
    },
    '涵盖物业类型（多选）': {
      key: 'a223a',
    },
    '产权年限（单选）': {
      key: 'a22q',
      editData: ['40年', '50年', '70年', 'inputOther'].map((value) => ({ id: value, value })),
      type: 'radio',
      span: 24,
    },
    产权起始时间: {
      key: 'b111',
    },
    竣工时间: {
      key: 'w111',
    },
    开业时间: {
      key: 'e1112',
    },
    楼栋数: {
      key: 'ew113',
    },
    层数: {
      key: 'ew114',
    },
    总用地面积: {
      key: 'ew115',
    },
    地下建筑面积: {
      key: 'ew116',
    },
    地上建筑面积: {
      key: 'ew117',
    },
    办公建筑面积: {
      key: 'ww2',
    },
    标准层面积: {
      key: 'ww23',
    },
    净层高: {
      key: 'ew117',
    },
    客梯数: {
      key: 'ww21',
    },
    总车位数: {
      key: 'ww26',
    },
  },
  经营信息: {
    总投资额: {
      key: 'radaro',
    },
    '租售现状（多选）': {
      key: 'seatTypeo',
    },
    经营数据表: {
      key: 'seatNumo',
    },
    租户列表: {
      key: 'seatNump',
    },
  },
};
