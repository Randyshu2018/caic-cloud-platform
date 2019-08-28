import AsyncComponent from 'src/components/AsyncComponent/AsyncComponent';
const OrderCenter = AsyncComponent(() => import('src/containers/Orders/children/center/index'));
const Detail = AsyncComponent(() => import('src/containers/Orders/children/detail/index'));
const ApplyFor = AsyncComponent(() => import('src/containers/Orders/children/applyFor/index'));
const NoMatch = AsyncComponent(() => import('src/routes/components/noMatch'));

export default [
  {
    path: '/orders',
    currentKey: '0',
    layout: 'fullScreen',
    childer: [
      {
        path: `/center`,
        component: OrderCenter,
      },
      {
        path: `/detail`,
        component: Detail,
      },
      {
        path: `/applyFor`,
        component: ApplyFor,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
