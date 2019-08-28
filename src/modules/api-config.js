const host = ''; //'http://combsout.ejubc.com';
const YJL_TASK = host + `/api/pc/task`;
const YJL = host + `/api`;
const YJL_PC = host + `/api/pc`;

export const api = {
  LOGIN_MOCK: '/user/login-mock/:userId',
  LOGIN_SEND_CODE: '/user/login/send-code',
  LOGIN_VERIFY_CODE: '/user/login/verify-code',
  LOGIN_VERIFY_PWD: '/user/login/verify-pwd',
  USER_USER_DETAIL: '/user/detail',

  FORGET_SEND_CODE: '/user/reset/send-code', //forget password send code
  FORGET_RETSET_CODE: '/user/reset/verify-code', // reset password

  TASK_CALENDAR: YJL_TASK + '/:dateDemension/calendar/taskstatus',

  TASK_LIST: YJL_TASK + '/list', //任务列表
  TASK_CALENDAR_M: YJL_TASK + '/calendar/taskstatus', //任务管理 日历
  TASK_LIST_SCORE: YJL_TASK + '/list/score', // 综合能力表数据
  TASK_SCORE_CALENDAR: YJL_TASK + '/score/calendar/taskstatus', //综合评分任务管理

  TASK_DAY_CALENDAR: YJL_TASK + '/day/calendar/taskstatus', //日任务管理  日历
  //   TASK_LIST_DAY: YJL_TASK + '/list/day', //日任务数据
  TASK_MONTH_CALENDAR: YJL_TASK + '/month/calendar/taskstatus', //月任务管理 日历
  TASK_LIST_MONTH: YJL_TASK + '/list/month/common', //月任务数据
  TASK_YEAR_CALENDAR: YJL_TASK + '/year/calendar/taskstatus', //经营分析预算数据 日历
  TASK_LIST_YEAR: YJL_TASK + '/list/year', // 经营分析预算数据数据
  TASK_MONTH_SCORE_CALENDAR: YJL_TASK + '/month/score/calendar/taskstatus', //综合评分月任务管理
  TASK_LIST_MONTH_SCORE: YJL_TASK + '/list/month/score', // 综合能力表数据
  TASK_LIST_HISTORY: YJL_TASK + '/list/history', // 获取历史上传数据
  //TASK_LIST_HISTORY: host,

  FILE_UPLOAD: YJL_PC + '/data_parse/upload', //文件上传-预览 taskId  file
  FILE_CONFIRM: YJL_PC + '/data_parse/confirm', //文件上传-确认
  FIEL_QUERY: YJL + '/data_statis/query', //文件上传-查看
  FILE_UP2CHAAIN: YJL_PC + '/data_parse/up2Chain', //文件任务-上链

  ANAKYSIS_PREVIEW: YJL_PC + '/data_analysis/preView', //数据分析-预览  taskId
  ANAKYSIS_QUERY: YJL_PC + '/data_analysis/query', //数据分析-查看
  ANAKYSIS_DOANAKYSIS: YJL_PC + '/data_analysis/doAnalysis', //数据分析-分析

  TASK_LIST_API: '/api/task/list',
  GET_TERM_LIST_API: '/api/authorize/datelist',
  TASK_DETAIL_API: '/api/task/detail',
  TASK_HISTORY_UP2CHAIN_API: '/api/task/list/historyUp2chain',
  TASK_CREATE_API: '/api/task/create',
  TASK_ANALYSE_API: '/api/data_analysis/doAnalysis',
  TASK_ANALYSE_RULE_API: '/api/data_analysis/queryRule',
  TASK_CHAIN_MEMBER_API: '/api/chain/members',
  TASK_CHAIN_UP2CHAIN_API: '/api/chain/up2Chain',
  TASK_CITY_LIST_API: '/api/project/list/city',
};
