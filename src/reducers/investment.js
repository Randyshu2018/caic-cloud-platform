import { isEmpty } from 'lodash';
import { message } from 'antd';
import { InvestmentServices } from '../services/incestmentServices';
import { EMPTY_BUILDING_CODE } from '../modules/ENUM';
import api from 'api';

export const SET_HAS_BUILDING = 'SET_HAS_BUILDING';
export const SET_CUSTOMERS = 'SET_CUSTOMERS';
export const CUSTOMERS_LOADING = 'CUSTOMERS_LOADING';
export const CUSTOMERS_PAGE = 'CUSTOMERS_PAGE';
export const CUSTOMERS_STATUS = 'CUSTOMERS_STATUS';
export const CUSTOMERS_MONTH_TOTAL = 'CUSTOMERS_MONTH_TOTAL';
export const CUSTOMERS_DETAIL = 'CUSTOMERS_DETAIL';
export const CUSTOMERS_DETAIL_LOADING = 'CUSTOMERS_DETAIL_LOADING';

export const investmentCustomer = (
  state = {
    hasBuilding: null,
    customers: [],
    total: 0,
    loading: true,
    pageNum: 1,
    pageSize: 10,
    status: {},
    monthTotal: {},
    customerDetails: {},
    customerDetailLoading: false,
  },
  action
) => {
  const {
    hasBuilding,
    customers,
    total,
    loading,
    pageNum,
    pageSize,
    status,
    monthTotal,
    customerDetail,
    customerDetailLoading,
  } = action;
  switch (action.type) {
    case SET_CUSTOMERS:
      return { ...state, customers, total, loading, pageNum, pageSize };
    case CUSTOMERS_LOADING:
      return { ...state, loading };
    case CUSTOMERS_PAGE:
      return { ...state, pageNum, pageSize };
    case CUSTOMERS_STATUS:
      return { ...state, status };
    case CUSTOMERS_MONTH_TOTAL:
      return { ...state, monthTotal };
    case CUSTOMERS_DETAIL:
      const { customerDetails } = state;
      customerDetails[customerDetail.id] = customerDetail;
      return {
        ...state,
        customerDetails: { ...customerDetails },
      };
    case CUSTOMERS_DETAIL_LOADING:
      return { ...state, customerDetailLoading };
    case SET_HAS_BUILDING:
      return { ...state, hasBuilding };
    default:
      return state;
  }
};

export const setCustomers = ({ customers, loading, total, pageNum, pageSize }) => ({
  type: SET_CUSTOMERS,
  customers,
  total,
  loading,
  pageNum,
  pageSize,
});

export const customersLoading = ({ loading }) => ({
  type: CUSTOMERS_LOADING,
  loading,
});

export const customersPage = ({ pageNum, pageSize }) => ({
  type: CUSTOMERS_LOADING,
  pageNum,
  pageSize,
});

export const setCustomersStatus = ({ status }) => ({
  type: CUSTOMERS_STATUS,
  status,
});

export const setCustomersMonthTotal = ({ monthTotal }) => ({
  type: CUSTOMERS_MONTH_TOTAL,
  monthTotal,
});

export const setCustomerDetail = ({ customerDetail }) => ({
  type: CUSTOMERS_DETAIL,
  customerDetail,
});

export const setCustomerDetailLoading = ({ customerDetailLoading }) => ({
  type: CUSTOMERS_DETAIL_LOADING,
  customerDetailLoading,
});

export const setHasBuilding = ({ hasBuilding }) => ({
  type: SET_HAS_BUILDING,
  hasBuilding,
});

export const fetchCustomers = ({
  projectId,
  name,
  status,
  beginDate,
  endDate,
  pageNum,
  pageSize,
}) => (dispatch, getState) => {
  dispatch(customersLoading({ loading: true }));
  return new InvestmentServices()
    .fetchVisitors({ projectId, name, status, beginDate, endDate, pageNum, pageSize })
    .then((data) => {
      const { list, totalElements } = data;
      // const { hasBuilding } = getState().investmentCustomer;

      const customers = Array.isArray(list) ? list : [];
      // if (hasBuilding !== true) {
      //   dispatch(setHasBuilding({ hasBuilding: true }));
      // }
      dispatch(
        setCustomers({
          customers,
          total: totalElements,
          loading: false,
          pageNum,
          pageSize,
        })
      );
    })
    .catch((error) => {
      // const { responseCode, responseMsg } = error;
      // const { hasBuilding } = getState().investmentCustomer;
      // if (responseCode === EMPTY_BUILDING_CODE) {
      //   // if (/responseCode":"om04"/.test(responseMsg)) {
      //   if (hasBuilding !== false) {
      //     message.error('没有关联的楼宇信息，请先创建楼宇');
      //     dispatch(setHasBuilding({ hasBuilding: false }));
      //   }
      // } else {
      //   message.error(responseMsg);
      // }
      // dispatch(customersLoading({ loading: false }));
    });
};

// 判断有没有楼宇
export const fetchCustomersIs = (projectId) => (dispatch) => {
  api.contractListByProjectId({ projectId: projectId }).then((res) => {
    if (!res) {
      dispatch(setHasBuilding({ hasBuilding: false }));
    } else {
      dispatch(fetchCustomers({ projectId: projectId }));
    }
  });
};

export const fetchCustomersStatus = (projectId) => (dispatch) => {
  return new InvestmentServices().fetchCustomersStatus(projectId).then((status) => {
    dispatch(setCustomersStatus({ status }));
  });
};

export const fetchCustomersMonthTotal = (projectId) => (dispatch) => {
  return new InvestmentServices().fetchCustomersMonthTotal(projectId).then((monthTotal) => {
    dispatch(setCustomersMonthTotal({ monthTotal }));
  });
};

export const fetchCustomerDetail = (id) => (dispatch) => {
  dispatch(setCustomerDetailLoading({ customerDetailLoading: true }));
  return new InvestmentServices().fetchCustomerDetail(id).then((customerDetail) => {
    if (!isEmpty(customerDetail)) {
      dispatch(setCustomerDetail({ customerDetail }));
    }
    dispatch(setCustomerDetailLoading({ customerDetailLoading: false }));
  });
};

export const fetchCustomersIfNeed = ({
  projectId,
  name,
  status,
  beginDate,
  endDate,
  pageNum,
  pageSize,
}) => (dispatch, getState) => {
  const {
    investmentCustomer: { customers },
  } = getState();

  if (isEmpty(customers)) {
    dispatch(
      fetchCustomers({
        projectId,
        name,
        status,
        beginDate,
        endDate,
        pageNum,
        pageSize,
      })
    );
  }
};

export const fetchCustomersStatusIfNeed = (projectId) => (dispatch, getState) => {
  const {
    investmentCustomer: { status },
  } = getState();

  if (isEmpty(status)) {
    dispatch(fetchCustomersStatus(projectId));
  }
};

export const fetchCustomersMonthTotalIfNeed = (projectId) => (dispatch, getState) => {
  const {
    investmentCustomer: { monthTotal },
  } = getState();

  if (isEmpty(monthTotal)) {
    dispatch(fetchCustomersMonthTotal(projectId));
  }
};
