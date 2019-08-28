import AsyncComponent from '../components/AsyncComponent/AsyncComponent';
import AuthorResult from '../containers/Author/AuthorResult';

const StepInputMobile = AsyncComponent(() => import('src/containers/Author/StepInputMobile'));
const MakePrivateKey = AsyncComponent(() => import('src/containers/Author/MakePrivateKey'));
const StepSelectProject = AsyncComponent(() => import('src/containers/Author/StepSelectProject'));
// const AuthorDetail = AsyncComponent(() => import('src/containers/Author/AuthorDetail'));
// const SelectChainData = AsyncComponent(() => import('src/containers/Author/SelectChainData'));
// const UpdateChainData = AsyncComponent(() => import('src/containers/Author/UpdateChainData'));
const UpdateAuthorProject = AsyncComponent(() =>
  import('src/containers/Author/UpdateAuthorProject')
);
const AuthorProjectDetail = AsyncComponent(() =>
  import('src/containers/Author/AuthorProjectDetail')
);
const AuthorIndex = AsyncComponent(() => import('src/containers/Author/Index'));
const NoMatch = AsyncComponent(() => import('src/routes/components/noMatch'));

export default [
  {
    path: '/author',
    currentKey: '3',
    childer: [
      {
        path: '/index',
        component: AuthorIndex,
      },
      {
        path: '/step-input-mobile',
        component: StepInputMobile,
      },
      {
        path: '/make-private-key/:mobile', // 可选 search 字段 memberName
        component: MakePrivateKey,
      },
      {
        path: '/step-select-project/:type/:licenseId/:mobile/:name/:lType',
        component: StepSelectProject,
      },
      /*{
        path: '/detail/:licenseId',
        component: AuthorDetail,
      },
      {
        path: '/chain-data/:authId/:mobile',
        component: SelectChainData,
      },
      {
        path: '/update-chain-data/:authId/:type/:mobile',
        component: UpdateChainData,
      },*/
      {
        path: '/author-result',
        component: AuthorResult,
      },
      {
        path: '/update-author-project/:authorizeId',
        component: UpdateAuthorProject,
      },
      {
        path: '/author-project-detail/:authorizeId',
        component: AuthorProjectDetail,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
