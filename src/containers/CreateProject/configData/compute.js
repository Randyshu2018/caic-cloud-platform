const keys = (values = {}) => {
  Object.keys(values).forEach((key) => {
    values[key] = 'form-item-none';
  });
  return values;
};
const computeCreatorMap = (fetchData = {}) => {
  let data = {};
  // 资产诊断信息表单内，通过showBizDict(是否独立产权（单选）)，需要判断commonDict是否显示
  if (fetchData.diagnoseType === 'ASSET') {
    if (fetchData.showBizDict) {
      fetchData.commonDict = keys(fetchData.commonDict);
    } else {
      fetchData.bizDict = keys(fetchData.bizDict);
    }
  }

  Object.entries(fetchData).forEach(([key, values]) => {
    if (typeof values === 'object') {
      data = { ...data, ...values };
    } else {
      data = { ...data, [key]: values };
    }
  });
  return data;
};
export { computeCreatorMap };
