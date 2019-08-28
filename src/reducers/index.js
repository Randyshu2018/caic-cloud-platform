import { combineReducers } from 'redux';
import { login, sideProjects } from './login';
import { projectDetail } from './projectDetail';
import { city } from './city';
import { investmentCustomer } from './investment';

const rootReducer = combineReducers({
  login,
  sideProjects,
  projectDetail,
  city,
  investmentCustomer,
});

export default rootReducer;
