export default {
  经营收入: [
    {
      key: 'APARTMENT_JYSR_ZJSR',
      title: '租金收入',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYSR_WYF',
      title: '物业费',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYSR_TCF',
      title: '停车费',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYSR_QTSR',
      title: '其他收入',
      span: 12,
      after: '元',
    },
  ],
  经营成本: [
    {
      key: 'APARTMENT_JYCB_YYCB',
      title: '营业成本',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYCB_TGCB',
      title: '推广成本',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYCB_RGCB',
      title: '人工成本',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYCB_GZCB',
      title: '改造成本',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_JYCB_QTCB',
      title: '其他成本',
      span: 12,
      after: '元',
    },
  ],
  EBLTDA: [
    {
      key: 'SELECT_EBITDA_FLAG',
      title: '直接输入EBITDA',
      initialValue: '1',
      editData: [{ id: '1', value: '是' }, { id: '0', value: '否' }],
      type: '_radio',
    },
    {
      key: 'APARTMENT_LR_EBITDA',
      title: 'EBLTDA',
      after: '元',
      type: 'radioInput',
      isEBLTDA: '1',
      rules: [{ required: false }],
    },
    {
      key: 'APARTMENT_JYCB_ZCGLFJZSYJ',
      title: '资产管理费及招商佣金',
      span: 12,
      after: '元',
      type: 'radioInput',
      isEBLTDA: '0',
      rules: [{ required: false }],
    },
    {
      key: 'APARTMENT_JYCB_GYJZBDSY',
      title: '公允价值变动损益',
      span: 12,
      after: '元',
      type: 'radioInput',
      isEBLTDA: '0',
      rules: [{ required: false }],
    },
    {
      key: 'APARTMENT_JYSR_YYWSR',
      title: '营业外收入',
      after: '元',
      type: 'radioInput',
      isEBLTDA: '0',
      rules: [{ required: false }],
    },
  ],
  GOP: [
    {
      key: 'APARTMENT_LR_GOP',
      title: 'GOP',
      after: '元',
    },
  ],
  租约情况: [
    {
      key: 'APARTMENT_ZYQK_CZL',
      title: '出租率',
      span: 12,
      after: '%',
    },
    {
      key: 'APARTMENT_ZYQK_XZL',
      title: '续租率',
      span: 12,
      after: '%',
    },
    {
      key: 'APARTMENT_ZYQK_DYQYTS',
      title: '当月签约套数',
      after: '套',
    },
    {
      key: 'APARTMENT_ZYQK_DYQYZMJ',
      title: '当月签约面积',
      span: 12,
      after: '㎡',
    },
    {
      key: 'APARTMENT_ZYQK_DYQYZJZE',
      title: '当月签约租金总额',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_ZYQK_DYZZZSTS',
      title: '当月自主招商套数',
      after: '套',
    },
    {
      key: 'APARTMENT_ZYQK_DYZZZSMJ',
      title: '当月自主招商面积',
      span: 12,
      after: '㎡',
    },
    {
      key: 'APARTMENT_ZYQK_DYZZZSZJJE',
      title: '当月自主招商租金总额',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_ZYQK_DYXZTS',
      title: '当月续租套数',
      after: '套',
    },
    {
      key: 'APARTMENT_ZYQK_DYXZMJ',
      title: '当月续租面积',
      span: 12,
      after: '㎡',
    },
    {
      key: 'APARTMENT_ZYQK_DYXZZJJE',
      title: '当月续租租金总额',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_ZYQK_YQYTS',
      title: '已签约套数',
      after: '套',
    },
    {
      key: 'APARTMENT_ZYQK_YQYZMJ',
      title: '已签约套数面积',
      span: 12,
      after: '㎡',
    },
    {
      key: 'APARTMENT_ZYQK_YQYZJZE',
      title: '已签约租金总额',
      span: 12,
      after: '元',
    },
    {
      key: 'APARTMENT_ZYQK_YXZTS',
      title: '已续租套数',
      after: '套',
    },
    {
      key: 'APARTMENT_ZYQK_YXZZMJ',
      title: '已续租面积',
      span: 12,
      after: '㎡',
    },
    {
      key: 'APARTMENT_ZYQK_YXZZJE',
      title: '已续租租金总额',
      span: 12,
      after: '元',
    },
  ],
  租金情况: [
    {
      key: 'APARTMENT_ZJQK_PJZJ',
      title: '平均租金',
      span: 12,
      after: '元/㎡·天',
    },
    {
      key: 'APARTMENT_ZJQK_ZLFXTJZJ',
      title: '主力房型套均租金',
      span: 12,
      after: '元',
    },
  ],
};
