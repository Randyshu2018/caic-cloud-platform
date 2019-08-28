// import AsyncComponent from 'src/hoc/asyncComponent';

import AssetsAndLiabilities from 'src/containers/AssetsAndLiabilities/AssetsAndLiabilities';
import AssetsAndLiabilitiesDetail from 'src/containers/AssetsAndLiabilities/Detail';
import CashFlowStatements from 'src/containers/CashFlowStatements/CashFlowStatements';
import CashFlowStatementsDetail from 'src/containers/CashFlowStatements/Detail';
import ProfitStatement from 'src/containers/ProfitStatement/ProfitStatement';
import ProfitStatementDetail from 'src/containers/ProfitStatement/Detail';
import OperationalDataTable from 'src/containers/OperationalDataTable/OperationalDataTable';
import OperationalDataTableDetail from 'src/containers/OperationalDataTable/Detail';
import NoMatch from 'src/routes/components/noMatch';
// import Task from 'src/containers/Task/Task';
import OperationalData from 'src/containers/Task/OperationalData';
import TaskDataAnalyse from 'src/containers/TaskDataAnalyse/TaskDataAnalyse';
import TaskDetail from 'src/containers/TaskDetail/TaskDetail';

export default [
  {
    path: '/task',
    currentKey: '1',
    childer: [
      /*{
        path: `/index`,
        component: Task,
      },*/
      {
        path: `/operational-data/:action/:type/:id/:name/:yMonth`,
        component: OperationalData,
      },
      {
        path: `/analyse/:projectId`,
        component: TaskDataAnalyse,
      },
      {
        path: `/detail/:projectId`,
        component: TaskDetail,
      },
      {
        path: `/assets-and-liabilities/:projectId/:dateMonth`,
        component: AssetsAndLiabilities,
      },
      {
        path: `/assets-and-liabilities/detail/:projectId/:dateMonth`,
        component: AssetsAndLiabilitiesDetail,
      },
      {
        path: `/cash-flow-statements/:projectId/:dateMonth`,
        component: CashFlowStatements,
      },
      {
        path: `/cash-flow-statements/detail/:projectId/:dateMonth`,
        component: CashFlowStatementsDetail,
      },
      {
        path: `/profit-statements/:projectId/:dateMonth`,
        component: ProfitStatement,
      },
      {
        path: `/profit-statements/detail/:projectId/:dateMonth`,
        component: ProfitStatementDetail,
      },
      {
        path: `/operational-data-table/:projectId/:dateMonth`,
        component: OperationalDataTable,
      },
      {
        path: `/operational-data-table/detail/:projectId/:dateMonth`,
        component: OperationalDataTableDetail,
      },
      {
        path: '',
        component: NoMatch,
      },
    ],
  },
];
