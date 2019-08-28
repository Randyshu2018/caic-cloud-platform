const deepCopy = (values) => {
  let newValues;
  if (Array.isArray(values)) {
    const cpValues = [...values];
    newValues = [];
    while (cpValues.length) {
      newValues.push(deepCopy(cpValues.pop()));
    }
  } else if (typeof values === 'object') {
    newValues = {};
    for (let i in values) {
      newValues[i] = values[i];
    }
  }
  return newValues;
};

const dataChilder = [
  {
    key: 'type',
    title: '项目类别',
    disabled: true,
  },
  {
    key: 'totalBuildArea',
    title: '总建筑面积',
    after: '㎡',
  },
  {
    key: 'commercialArea',
    title: '配套商业面积',
    after: '㎡',
  },
  {
    key: 'parkingSpaces',
    title: '车位数',
    after: '个',
  },
  {
    key: 'ringCertification',
    title: '环保认证',
    type: 'select',
    initialValue: 'LEED',
    editData: 'LEED|WELL|BREEAM|无认证'.split('|').map((value) => ({ id: value, value })),
  },
  {
    key: 'initCost',
    title: '初始成本',
    after: '元',
  },
  {
    key: 'operatingBuildArea',
    title: '经营建筑面积',
    after: '㎡',
  },
  {
    key: 'rentableArea',
    title: '可租赁面积',
    after: '㎡',
  },
  {
    key: 'guestRooms',
    title: '客房数',
    after: '间',
  },
  {
    key: 'rentableNumberSets',
    title: '可出租套数',
    after: '套',
  },
  {
    key: 'publicArea',
    title: '公共区域面积',
    after: '㎡',
  },
  {
    key: 'groundBusinessType',
    title: '楼上业态',
    type: 'select',
    initialValue: 'ALL',
    editData: 'ALL|综合体,COMMERCIAL|商业,HOTEL|酒店,OFFICE|办公,INDUSTRY|工业,HOUSE|住宅,OTHER|其他,SHOP|商铺,APARTMENT|公寓,PARK|园区'
      .split(',')
      .map((v) => {
        const sv = v.split('|');
        return { id: sv[0], value: sv[1] };
      }),
  },
  {
    key: 'groundBusinessType',
    title: '楼上业态名称',
    after: '㎡',
  },
  {
    key: 'parkingLayers',
    title: '停车层数',
    after: '层',
  },
  {
    key: 'parkingSpaces',
    title: '停车位总数',
    after: '个',
  },
  {
    key: 'groundParkingSpaces',
    title: '地上停车位个数',
    after: '个',
  },
  {
    key: 'undergroundParkingSpaces',
    title: '地下停车位个数',
    after: '个',
  },
  {
    key: 'hourlyParkingSpaces',
    title: '时租车位个数',
    after: '个',
  },
  {
    key: 'hourlyParkingFee',
    title: '时租车位收费标准',
    after: '元/小时',
  },
  {
    key: 'monthlyParkingSpaces',
    title: '月租车位个数',
    after: '个',
  },
  {
    key: 'rentableArea',
    title: '可出租面积',
    after: '㎡',
  },
  {
    key: 'diningArea',
    title: '餐饮面积',
    after: '㎡',
  },
  {
    key: 'buildingNum',
    title: '栋数',
    after: '栋',
  },
  {
    key: 'layerNum',
    title: '楼层数',
    after: '层',
  }
];

/**
 * COMMERCIAL|商业,
 * HOTEL|酒店,
 * OFFICE|办公
 * INDUSTRY|工业
 * GARAGE|车库
 * HOUSE|住宅
 * OTHER|其他
 * SHOP|商铺
 * APARTMENT|公寓
 * PARK|园区'
 *  */
const accordWithTypes = {
  '办公|OFFICE': '项目类别,总建筑面积,配套商业面积,可出租面积,楼层数,车位数,环保认证,初始成本',
  '商业|COMMERCIAL': '项目类别,总建筑面积,经营建筑面积,可租赁面积,楼层数,车位数,初始成本',
  '酒店|HOTEL': '项目类别,总建筑面积,餐饮面积,客房数,车位数,初始成本',
  '公寓|APARTMENT': '项目类别,总建筑面积,可出租面积,可出租套数,公共区域面积,初始成本',
  '园区|PARK': '项目类别,总建筑面积,栋数,可出租面积,初始成本',
  '车库|GARAGE':
    '项目类别,楼上业态,停车层数,停车位总数,地上停车位个数,地下停车位个数,时租车位个数,时租车位收费标准,月租车位个数,初始成本',
};

const DataSources = [];

Object.entries(accordWithTypes).forEach(([keys, types]) => {
  const [name, key] = keys.split('|');
  const typesList = types.split(',');
  const item = {
    name,
    key,
  };

  const childer = [];
  typesList.forEach((title) => {
    const o = deepCopy(dataChilder.find((im) => im.title === title));
    !o && console.log(keys, o, title);
    o && childer.unshift(o);
  });

  item.childer = deepCopy(childer);
  DataSources.push(deepCopy(item));
});

export default DataSources;
