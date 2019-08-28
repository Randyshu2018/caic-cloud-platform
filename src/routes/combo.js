import NoMatch from './components/noMatch';
import ComboExhibition from '../containers/combo/ComboExhibition/ComboExhibition';

export default [
  {
    path: '/combo',
    currentKey: '0',
    childer: [
      {
        path: '/index',
        component: ComboExhibition,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
