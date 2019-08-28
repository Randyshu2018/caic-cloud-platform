import ordersCentre from './router-orders-centre';
import author from './router-author';
import property from './router-property';
import createProject from './router-create-project';
import combo from './combo';
import rent from './router-operation';
import diagnose from './router-asset-diagnose';
// import buildManage from './building-management';
// import investment from './investment';

export const routesConfig = [
  ...ordersCentre,
  ...author,
  ...property,
  ...combo,
  ...rent,
  ...createProject,
  ...diagnose,
  //   ...income,
  // ...buildManage,
  // ...investment,
];
