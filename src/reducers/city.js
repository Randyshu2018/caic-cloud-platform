import { CityServices } from '../services/diagnoseServices';

export const SET_CITIES = 'SET_CITIES';

export const city = (state = { cities: [] }, action) => {
  switch (action.type) {
    case SET_CITIES:
      return { ...state, cities: action.cities };
    default:
      return state;
  }
};

export const setCities = (cities) => ({
  type: SET_CITIES,
  cities,
});

const fetchCity = () => (dispatch) => {
  return new CityServices().fetchCity().then((cities) => {
    dispatch(setCities(cities));
  });
};

export const fetchCityIfNeed = () => (dispatch, getState) => {
  const {
    city: { cities },
  } = getState();

  // 有一条"全部"的空值
  if (cities.length <= 1) {
    return dispatch(fetchCity());
  }
};
