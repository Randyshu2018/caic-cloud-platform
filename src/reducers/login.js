import { MerchantServices } from '../services/login';
import { isArray, isDefined, setStorage } from '../modules/utils';

export const SET_VERIFY_CODE = 'SET_VERIFY_CODE';
export const SET_MOBILE = 'SET_MOBILE';
export const SET_VERIFY_CODE_WAITING = 'SET_VERIFY_CODE_WAITING';
export const SET_SIDE_PROJECTS = 'SET_SIDE_PROJECTS';
export const SET_PROJECTS_LIST = 'SET_PROJECTS_LIST';
export const SIDE_PROJECT_IDS = 'SIDE_PROJECT_IDS';
export const SET_ALL_PROJECTS = 'SET_ALL_PROJECTS';

export const login = (state = { mobile: '', code: '', verifyCodeWaiting: false }, action) => {
  switch (action.type) {
    case SET_MOBILE:
      return {
        ...state,
        mobile: action.mobile,
      };
    case SET_VERIFY_CODE:
      return {
        ...state,
        code: action.code,
      };
    case SET_VERIFY_CODE_WAITING:
      return {
        ...state,
        verifyCodeWaiting: action.verifyCodeWaiting,
      };
    default:
      return state;
  }
};

export const setMobile = (mobile) => ({
  type: SET_MOBILE,
  mobile,
});

export const setVerifyCode = (code) => ({
  type: SET_VERIFY_CODE,
  code,
});

// projects 签约项目
// projectId 需要特别注意这是选中签约项目所对应的概要项目 id
export const sideProjects = (
  state = {
    projects: [],
    signedProjects: [],
    projectId: undefined,
    merchantId: undefined,
    selectSideProject: {},
    pageNum: 1,
    pageSize: 10,
  },
  action
) => {
  const {
    projects,
    projectId,
    merchantId,
    pageNum,
    pageSize,
    totalElements,
    selectSideProject,
    allProjects,
  } = action;

  // 过滤签约项目中对应有概要项目的
  function filterProjects(projects) {
    return projects.filter(
      ({ assetProjectDto }) => assetProjectDto && isDefined(assetProjectDto.id)
    );
  }
  switch (action.type) {
    case SET_SIDE_PROJECTS:
      return {
        projects,
        signedProjects: filterProjects(projects),
        projectId,
        merchantId,
        selectSideProject: {},
        pageNum,
        pageSize,
        totalElements,
      };
    case SET_PROJECTS_LIST:
      return { ...state, projects, signedProjects: filterProjects(projects) };
    case SIDE_PROJECT_IDS:
      return { ...state, projectId, merchantId, selectSideProject };
    case SET_ALL_PROJECTS:
      return { ...state, allProjects };
    default:
      return state;
  }
};

export const setSideProjects = ({
  projects,
  projectId,
  merchantId,
  pageNum,
  pageSize,
  totalElements,
}) => ({
  type: SET_SIDE_PROJECTS,
  projects,
  projectId,
  merchantId,
  pageNum,
  pageSize,
  totalElements,
});

export const setProjectsList = (projects) => ({
  type: SET_PROJECTS_LIST,
  projects,
});

export const setAllProjects = (allProjects) => ({
  type: SET_ALL_PROJECTS,
  allProjects,
});

export const sideProjectIds = ({ projectId, merchantId, selectSideProject }) => {
  return {
    type: SIDE_PROJECT_IDS,
    projectId,
    merchantId,
    selectSideProject,
  };
};

/**
 * 选择签约项目
 * @param project {object} 签约项目
 * @return {function(*): *}
 */
export const chooseProject = (project) => (dispatch) => {
  const { assetProjectDto, merchantId } = project;
  const { id: assetProjectId } = assetProjectDto || {};

  // 为了旧有代码中的 merchantId localStorage 获取，也为了部分页面 reload 刷新
  setStorage('merchantId', merchantId);

  return dispatch(
    sideProjectIds({ projectId: assetProjectId, merchantId, selectSideProject: project })
  );
};

const fetchSignProjects = ({ memberId, cityCode, businessType, name, pageNum, pageSize }) => (
  dispatch
) => {
  return new MerchantServices()
    .fetchSignProjects({ memberId, cityCode, businessType, name, pageNum, pageSize })
    .then(({ list, totalElements }) => {
      const projects = isArray(list) ? list : [];
      return {
        projects,
        totalElements,
      };
    })
    .then((res) => {
      dispatch(setSideProjects({ ...res, pageNum, pageSize }));
    });
};

export const fetchALLSignProjects = ({ memberId }) => (dispatch) => {
  return new MerchantServices()
    .fetchSignProjects({ memberId, pageNum: 1, pageSize: 100 })
    .then(({ list }) => {
      const projects = isArray(list) ? list : [];

      dispatch(setAllProjects(projects));
    });
};

export const fetchSignProjectsIfNeed = ({
  memberId,
  cityCode,
  businessType,
  name,
  pageNum = 1,
  pageSize = 10,
}) => (dispatch, getState) => {
  const {
    sideProjects: { projects, pageNum: _pageNum },
  } = getState();

  // 如果不考虑的话，可以注释掉判断
  // if (pageNum !== _pageNum || pageNum === 1  || isEmpty(projects)) {
  return dispatch(fetchSignProjects({ memberId, cityCode, businessType, name, pageNum, pageSize }));
  // }
};
