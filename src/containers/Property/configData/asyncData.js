export function hasAssetProjectId(props = {}) {
  const o = Object.hasOwnProperty;
  const v = props.$$sideProjects || props;
  const k = 'assetProjectDto';
  let has = false;
  if (v && v[k] && o.call(v, k)) {
    if (o.call(v[k], 'id')) {
      has = `${v[k]['id']}`;
    }
  }
  return has;
}
export function hasBusinessType(businessType) {
  const type = ['OFFICE', 'COMMERCIAL', 'HOTEL', 'APARTMENT', 'PARK', 'GARAGE'];
  return type.indexOf(businessType) > -1;
}
// 异步加载表单配置项
export default function asyncData(importData) {
  async function asyncConfigData() {
    const o = Object.hasOwnProperty;
    const data = await importData();
    if (o.call(data, 'default')) {
      return data.default;
    }
    return {};
  }
  return asyncConfigData;
}
