import {
  LEAVE_APPLY_REQUEST,
  LEAVE_APPLY_SUCCESS,
  LEAVE_APPLY_FAIL,
  LEAVE_APPLY_RESET,
  LEAVE_LIST_MY_REQUEST,
  LEAVE_LIST_MY_SUCCESS,
  LEAVE_LIST_MY_FAIL,
  LEAVE_LIST_ALL_REQUEST,
  LEAVE_LIST_ALL_SUCCESS,
  LEAVE_LIST_ALL_FAIL,
  LEAVE_DETAILS_REQUEST,
  LEAVE_DETAILS_SUCCESS,
  LEAVE_DETAILS_FAIL,
  LEAVE_UPDATE_REQUEST,
  LEAVE_UPDATE_SUCCESS,
  LEAVE_UPDATE_FAIL,
  LEAVE_UPDATE_RESET,
} from "../constants/leaveConstants";

export const leaveApplyReducer = (state = {}, action) => {
  switch (action.type) {
    case LEAVE_APPLY_REQUEST:
      return { loading: true };
    case LEAVE_APPLY_SUCCESS:
      return { loading: false, success: true, leave: action.payload };
    case LEAVE_APPLY_FAIL:
      return { loading: false, error: action.payload };
    case LEAVE_APPLY_RESET:
      return {};
    default:
      return state;
  }
};

export const leaveListMyReducer = (state = { leaves: [] }, action) => {
  switch (action.type) {
    case LEAVE_LIST_MY_REQUEST:
      return { loading: true, leaves: [] };
    case LEAVE_LIST_MY_SUCCESS:
      return { loading: false, leaves: action.payload };
    case LEAVE_LIST_MY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const leaveListAllReducer = (state = { leaves: [] }, action) => {
  switch (action.type) {
    case LEAVE_LIST_ALL_REQUEST:
      return { loading: true, leaves: [] };
    case LEAVE_LIST_ALL_SUCCESS:
      return { loading: false, leaves: action.payload };
    case LEAVE_LIST_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const leaveDetailsReducer = (state = { leave: {} }, action) => {
  switch (action.type) {
    case LEAVE_DETAILS_REQUEST:
      return { ...state, loading: true };
    case LEAVE_DETAILS_SUCCESS:
      return { loading: false, leave: action.payload };
    case LEAVE_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const leaveUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case LEAVE_UPDATE_REQUEST:
      return { loading: true };
    case LEAVE_UPDATE_SUCCESS:
      return { loading: false, success: true, leave: action.payload };
    case LEAVE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case LEAVE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};