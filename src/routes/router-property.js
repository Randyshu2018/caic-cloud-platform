import AsyncComponent from 'src/components/AsyncComponent/AsyncComponent';
const NoMatch = AsyncComponent(() => import('src/routes/components/noMatch'));
const PropertyInfo = AsyncComponent(() => import('src/containers/Property/index'));
const PropertyYearData = AsyncComponent(() => import('src/containers/Property/children/yearData'));
const PropertyMonthlyDataList = AsyncComponent(() =>
  import('src/containers/Property/children/monthlyDataList')
);
const PropertyMonthlyDataDetails = AsyncComponent(() =>
  import('src/containers/Property/children/monthlyDataDetails')
);

export default [
  {
    path: '/property',
    currentKey: '5',
    childer: [
      {
        path: '/info',
        component: PropertyInfo,
      },
      {
        path: '/year-data',
        component: PropertyYearData,
      },
      {
        path: '/monthly-data/list',
        component: PropertyMonthlyDataList,
      },
      {
        path: '/monthly-data/details/:year/:monthly',
        component: PropertyMonthlyDataDetails,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
