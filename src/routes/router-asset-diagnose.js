import AsyncComponent from '../components/AsyncComponent/AsyncComponent';
const DiagnoseWork = AsyncComponent(() => import('src/containers/DiagnoseWork/index'));
const NoMatch = AsyncComponent(() => import('src/routes/components/noMatch'));
const BlockchainSuccess = AsyncComponent(() => import('src/containers/diagnose/BlockchainSuccess'));
const DiagnoseHistory = AsyncComponent(() => import('src/containers/diagnose/History'));
// const DiagnoseCenter = AsyncComponent(() => import('src/containers/diagnose/Center'));
const NewAuthorize = AsyncComponent(() => import('src/containers/diagnose/NewAuthorize'));

export default [
  {
    path: '/asset-diagnose',
    currentKey: '2',
    childer: [
      /*{
        path: '/center',
        component: DiagnoseCenter,
      },*/
      {
        path: '/history',
        component: DiagnoseHistory,
      },
      {
        path: '/blockchain-success',
        component: BlockchainSuccess,
      },
      {
        path: '/update-work/:projectId/:step',
        component: DiagnoseWork,
      },
      {
        path: `/history/:projectId/new-authorize`,
        component: NewAuthorize,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
