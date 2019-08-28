import AsyncComponent from '../components/AsyncComponent/AsyncComponent';
import NoMatch from './components/noMatch';
const Rent = AsyncComponent(() => import('../containers/Rent/index'));
const Bm = AsyncComponent(() => import('../containers/BuildingManagement'));
const Management = AsyncComponent(() => import('src/containers/Investment/Management'));
const BmDetail = AsyncComponent(() => import('../containers/BuildingManagement/hasBuild'));
const Income = AsyncComponent(() => import('../containers/Income/index'));
const Deposit = AsyncComponent(() => import('../containers/OperationBillAndDeposit/index'));
const Bill = AsyncComponent(() => import('../containers/OperationBillAndDeposit/index-bill'));

export default [
  {
    path: '/operation',
    currentKey: '4',
    childer: [
      {
        path: '/rent/index',
        component: Rent,
      },
      {
        path: '/build-manage',
        component: Bm,
      },
      {
        path: '/build-manage/:id',
        component: BmDetail,
      },
      {
        path: '/management',
        component: Management,
        exact: false,
      },
      {
        path: '/income/index',
        component: Income,
        exact: false,
      },
      {
        path: '/deposit/index',
        component: Deposit,
        exact: false,
      },
      {
        path: '/bill/index',
        component: Bill,
        exact: false,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
