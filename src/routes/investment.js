import NoMatch from './components/noMatch';
import InvestmentManagement from '../containers/Investment/Management';

export default [
  {
    path: '/investment',
    currentKey: '6',
    childer: [
      {
        path: `/management`,
        component: InvestmentManagement,
        exact: false,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
