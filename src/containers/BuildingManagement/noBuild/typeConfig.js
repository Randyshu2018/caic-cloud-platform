export default [
  {
    value: 'NATURAL_MONTH',
    label: '按自然月分摊',
    children: [
      {
        value: 'CONTRACT_TERMS',
        label: '按合同条款分摊',
      },
      {
        value: 'CONTRACT_PRICE',
        label: '按合同总价分摊',
      },
    ],
  },
  {
    value: 'AVERAGE_MONTH',
    label: '按平均月分摊',
    children: [
      {
        value: 'CONTRACT_PRICE',
        label: '按合同总价分摊',
        children: [
          {
            value: 'NATURAL_MONTH',
            label: '按自然月天数',
          },
          {
            value: 'AVERAGE_MONTH',
            label: '按平均月天数',
          },
        ],
      },
    ],
  },
  {
    value: 'CONTRACT_TERMS',
    label: '按合同条款起始日分摊',
  },
];
