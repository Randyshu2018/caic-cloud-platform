import AsyncComponent from '../components/AsyncComponent/AsyncComponent';
const CreateProject = AsyncComponent(() => import('src/containers/CreateProject/index'));
const OrderResult = AsyncComponent(() => import('src/containers/CreateProject/orderResult'));
const NoMatch = AsyncComponent(() => import('src/routes/components/noMatch'));
const UpgradePackage = AsyncComponent(() => import('../containers/UpgradePackage/UpgradePackage'));

export default [
  {
    path: '/create-project',
    currentKey: '0',
    layout: 'fullScreen',
    childer: [
      {
        path: '/flow/:steps',
        component: CreateProject,
      },
      {
        path: '/result',
        component: OrderResult,
      },
      {
        path: '/upgrade-package/:orderId',
        component: UpgradePackage,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
