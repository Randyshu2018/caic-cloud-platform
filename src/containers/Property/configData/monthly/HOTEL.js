export default {
  经营收入: [
    {
      key: 'HOTEL_JYSR_KFSR',
      title: '客房总收入',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYSR_KFSR_ZXSR',
      title: '直销收入',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYSR_KFSR_OTASR',
      title: 'OTA渠道收入',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYSR_CYSR',
      title: '餐饮收入',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYSR_QTSR',
      title: '其他收入',
      span: 12,
      after: '元',
    },
  ],
  经营成本: [
    {
      key: 'HOTEL_JYCB_KFCBJFY',
      title: '客房成本及费用',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYCB_CYCBJFY',
      title: '餐饮成本及费用',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYCB_QTYYBMCBJFY',
      title: '其他运营部门成本及费用',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYCB_NHFY',
      title: '能耗费用',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYCB_WXFY',
      title: '维修费用',
      span: 12,
      after: '元',
    },
    {
      key: 'HOTEL_JYCB_QTCBJFY',
      title: '其他成本及费用',
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
      key: 'HOTEL_LR_EBITDA',
      title: 'EBLTDA',
      after: '元',
      type: 'radioInput',
      isEBLTDA: '1',
      rules: [{ required: false }],
    },
    {
      key: 'HOTEL_JYCB_ZCGLFJZSYJ',
      title: '资产管理费及招商佣金',
      span: 12,
      after: '元',
      type: 'radioInput',
      isEBLTDA: '0',
      rules: [{ required: false }],
    },
    {
      key: 'HOTEL_JYCB_GYJZBDSY',
      title: '公允价值变动损益',
      span: 12,
      after: '元',
      type: 'radioInput',
      isEBLTDA: '0',
      rules: [{ required: false }],
    },
    {
      key: 'HOTEL_JYSR_YYWSR',
      title: '营业外收入',
      after: '元',
      type: 'radioInput',
      isEBLTDA: '0',
      rules: [{ required: false }],
    },
  ],
  GOP: [
    {
      key: 'HOTEL_LR_GOP',
      title: 'GOP',
      after: '元',
    },
  ],
  租金情况: [
    {
      key: 'HOTEL_ZJQK_LZL',
      title: '入住率',
      after: '%',
    },
    {
      key: 'HOTEL_ZJQK_PJFJ',
      title: '平均房价ADR',
      span: 12,
      after: '元/间',
    },
    {
      key: 'HOTEL_ZJQK_RevPAR',
      title: 'RevPAR',
      span: 12,
      after: '元',
    },
  ],
  其他: [
    {
      key: 'HOTEL_QT_HYZS',
      title: '会员总数',
      after: '人',
    },
  ],
};
