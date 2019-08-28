const commonLS = (type, value, key) => {
  const G = localStorage;
  const values = {
    set: () => G.setItem(key, JSON.stringify(value)),
    get: () => {
      const source = G.getItem(key);
      return source && JSON.parse(source);
    },
    remove: () => G.removeItem(key),
  };
  return values[type]();
};

const localStorageProperty = (type, value) => {
  const key = `YJU_PROPERTY_MONTHLY_DATA_DETAILS${value.projectId}`;
  return commonLS(type, value, key);
};
const localStorageDiagnose = (type, value) => {
  const key = `YJU_ASSET_DIAGNOSE_UPDATE_WORK_TYPE_${value.projectId}`;
  // const G = localStorage;
  // const values = {
  //   set: () => G.setItem(key, JSON.stringify(value)),
  //   get: () => {
  //     const source = G.getItem(key);
  //     return source && JSON.parse(source);
  //   },
  //   remove: () => G.removeItem(key),
  // };
  // return values[type]();
  return commonLS(type, value, key);
};
export { localStorageDiagnose, localStorageProperty };
