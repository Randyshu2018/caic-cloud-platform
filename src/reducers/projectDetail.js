export const SET_PROJECT_DETAIL = 'SET_PROJECT_DETAIL';

export const projectDetail = (state = {}, action) => {
  switch (action.type) {
    case SET_PROJECT_DETAIL:
      return {
        ...state,
        [action.projectDetail.projectId + '']: action.projectDetail,
      };
    default:
      return state;
  }
};

export const setProjectDetail = (projectDetail) => ({
  type: SET_PROJECT_DETAIL,
  projectDetail,
});
