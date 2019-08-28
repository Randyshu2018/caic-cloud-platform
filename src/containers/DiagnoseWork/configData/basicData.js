import DiagnoseDataServices from 'src/services/assetDiagnoseWork';
import { computeCreatorMap } from './compute';
// 资产诊断
export default {
  null: {
    requset: {
      key: 'BASIC',
      get: async (params = {}) => {
        const fetchData = await DiagnoseDataServices.fetchDiagnoseDataQuery(params);
        const data = computeCreatorMap(fetchData);
        // console.log(data);

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
  企业名称: {
    项目名称: {
      key: 'projectName',
      disabled: true,
      span: 24,
    },
    其他名称: {
      key: 'BASIC_OFFICE_BASIC_QTMC',
    },
    诊断对象: {
      key: 'BASIC_OFFICE_BASIC_ZDDX',
      type: 'textArea',
    },
  },
  企业信息: {
    物业公司名称: {
      key: 'BASIC_OFFICE_COMPANY_WYGSMC',
    },
    项目开发商: {
      key: 'BASIC_OFFICE_COMPANY_XMKFS',
    },
    项目投资商: {
      key: 'BASIC_OFFICE_COMPANY_XMTZS',
    },
  },
  产品信息: {
    城市: {
      key: 'BASIC_OFFICE_PRODUCT_CITY',
      type: 'site',
      span: 12,
    },
    地址: {
      key: 'BASIC_OFFICE_PRODUCT_DZ',
      span: 12,
    },
    物业等级: {
      key: 'BASIC_OFFICE_PRODUCT_WYDJ',
      type: 'select',
      span: 12,
      initialValue: '超甲级',
      editData: ['超甲级', '甲级', '乙级', '其他'].map((value) => ({ id: value, value })),
    },
    '产权年限（单选）': {
      key: 'BASIC_OFFICE_PRODUCT_CQNX',
      initialValue: '40年',
      editData: ['40年', '50年', '70年', 'inputOther'].map((value) => ({ id: value, value })),
      type: 'radio',
      isInput: true,
      span: 24,
    },
    产权起始时间: {
      key: 'BASIC_OFFICE_PRODUCT_CQQSSJ',
      type: 'datePicker',
      span: 12,
    },
    竣工时间: {
      key: 'BASIC_OFFICE_PRODUCT_JGSJ',
      type: 'datePicker',
      span: 12,
    },
    开业时间: {
      key: 'BASIC_OFFICE_PRODUCT_KYSJ',
      type: 'datePicker',
    },
    楼栋数: {
      key: 'BASIC_OFFICE_PRODUCT_LDS',
      span: 12,
      after: '栋',
    },
    层数: {
      key: 'BASIC_OFFICE_PRODUCT_CS',
      span: 12,
      after: '层',
    },
    用地面积: {
      key: 'BASIC_OFFICE_PRODUCT_YDMJ',
      span: 12,
      after: '㎡',
    },
    建筑面积: {
      key: 'BASIC_OFFICE_PRODUCT_JZMJ',
      span: 12,
      after: '㎡',
    },
    地上建筑面积: {
      key: 'BASIC_OFFICE_PRODUCT_DSJZMJ',
      span: 12,
      after: '㎡',
    },
    地下建筑面积: {
      key: 'BASIC_OFFICE_PRODUCT_DXJZMJ',
      span: 12,
      after: '㎡',
    },
    办公建筑面积: {
      key: 'BASIC_OFFICE_PRODUCT_BGJZMJ',
      span: 12,
      after: '㎡',
    },
    标准层面积: {
      key: 'BASIC_OFFICE_PRODUCT_BZCMJ',
      span: 12,
      after: '㎡',
    },
    净层高: {
      key: 'BASIC_OFFICE_PRODUCT_JCG',
      span: 12,
      after: '米',
    },
    客梯数: {
      key: 'BASIC_OFFICE_PRODUCT_KTS',
      span: 12,
      after: '部',
    },
    车位数: {
      key: 'BASIC_OFFICE_PRODUCT_CWS',
      span: 12,
      after: '个',
    },
  },
  经营信息: {
    总投资额: {
      key: 'BASIC_OFFICE_BIZ_ZTZE',
      span: 12,
      after: '万元',
    },
    '是否独立产权（单选）': {
      key: 'BASIC_OFFICE_BIZ_SFDLCQ',
      initialValue: 1,
      editData: [{ id: 1, value: '是' }, { id: 0, value: '否' }],
      type: 'radio',
    },
    经营数据表_null: {
      name: '经营数据表',
      key: 'BASIC_OFFICE_BIZ_JYSJB',
      tableColumns: [
        {
          title: '时间',
          dataIndex: 'BIZ_DATE',
          key: 'BIZ_DATE',
          editable: true,
          width: 90,
          align: 'center',
          inputType: 'select',
        },
        {
          title: '出租率（%）',
          dataIndex: 'BIZ_OCCUPANCY_RATE',
          key: 'BIZ_OCCUPANCY_RATE',
          editable: true,
          width: 115,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '总经营收入（万元）',
          dataIndex: 'BIZ_OPERATING_INCOME',
          key: 'BIZ_OPERATING_INCOME',
          editable: true,
          width: 180,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '租金收入（万元）',
          dataIndex: 'BIZ_RENTAL_INCOME',
          key: 'BIZ_RENTAL_INCOME',
          editable: true,
          width: 110,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '办公成本不含税收（万元）',
          dataIndex: 'BIZ_OFFICE_COST',
          key: 'BIZ_OFFICE_COST',
          editable: true,
          width: 150,
          align: 'center',
          inputType: 'number',
        },
        {
          title: 'EBITD（万元）',
          dataIndex: 'BIZ_EBITDA',
          key: 'BIZ_EBITDA',
          editable: true,
          width: 130,
          align: 'center',
          inputType: 'number',
        },
        {
          title: 'GOP（万元）',
          dataIndex: 'BIZ_GOP',
          key: 'BIZ_GOP',
          editable: true,
          width: 130,
          align: 'center',
          inputType: 'number',
        },
      ],
      dataSource: [],
      type: 'editableTable',
    },
    租户列表_null: {
      name: '租户列表',
      key: 'BASIC_OFFICE_BIZ_ZHLB',
      tableColumns: [
        {
          title: '租户名称',
          dataIndex: 'TENANT_NAME',
          key: 'TENANT_NAME',
          editable: true,
          width: 190,
          align: 'center',
        },
        {
          title: '租户行业',
          dataIndex: 'TENANT_INDUSTRY',
          key: 'TENANT_INDUSTRY',
          editable: true,
          width: 115,
          align: 'center',
        },
        {
          title: '租户楼层',
          dataIndex: 'TENANT_FLOOR',
          key: 'TENANT_FLOOR',
          editable: true,
          width: 100,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '租户室号',
          dataIndex: 'TENANT_ROOM',
          key: 'TENANT_ROOM',
          editable: true,
          width: 110,
          align: 'center',
        },
        {
          title: '租户租金（元/月）',
          dataIndex: 'TENANT_RENT',
          key: 'TENANT_RENT',
          editable: true,
          width: 150,
          align: 'center',
          inputType: 'number',
        },
        {
          title: '租户面积（㎡）',
          dataIndex: 'TENANT_AREA',
          key: 'TENANT_AREA',
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
  图片信息: {
    外立面_null: {
      key: 'BASIC_OFFICE_PIC_WLM',
      span: 12,
      type: 'uploadImg',
    },
    入口及大堂_null: {
      key: 'BASIC_OFFICE_PIC_RKJDT',
      span: 12,
      type: 'uploadImg',
    },
    租户水牌_null: {
      key: 'BASIC_OFFICE_PIC_ZHSP',
      span: 12,
      type: 'uploadImg',
    },
    环保认证证书_null: {
      key: 'BASIC_OFFICE_PIC_HBRZZS',
      span: 12,
      type: 'uploadImg',
    },
  },
};
