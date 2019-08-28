import NoMatch from './components/noMatch';
import Bm from '../containers/BuildingManagement';

export default [
  {
    path: '/build-manage',
    currentKey: '0',
    childer: [
      {
        path: '/',
        component: Bm,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
