import AsyncData from '../asyncData';
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
const configs = {
  OFFICE: {
    title: '办公',
    AsyncData: AsyncData(() => import('./OFFICE')),
  },
  COMMERCIAL: {
    title: '商业',
    AsyncData: AsyncData(() => import('./COMMERCIAL')),
  },
  HOTEL: {
    title: '酒店',
    AsyncData: AsyncData(() => import('./HOTEL')),
  },
  APARTMENT: {
    title: '公寓',
    AsyncData: AsyncData(() => import('./APARTMENT')),
  },
  PARK: {
    title: '园区',
    AsyncData: AsyncData(() => import('./PARK')),
  },
  GARAGE: {
    title: '车库',
    AsyncData: AsyncData(() => import('./GARAGE')),
  },
};
async function DataSources(type) {
  const o = { ...configs[type || 'OFFICE'] };
  const data = await o.AsyncData();
  const childer = [];
  Object.entries(data).forEach(([title, values], index) => {
    const arr = [...values];
    arr.unshift({ key: `title-${index}`, type: 'title', title });
    childer.push(...arr);
  });
  delete o.AsyncData;
  return { ...o, childer };
}

export default DataSources;
