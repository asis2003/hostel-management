import {
  COMPLAINT_RAISE_REQUEST,
  COMPLAINT_RAISE_SUCCESS,
  COMPLAINT_RAISE_FAIL,
  COMPLAINT_RAISE_RESET,
  COMPLAINT_LIST_MY_REQUEST,
  COMPLAINT_LIST_MY_SUCCESS,
  COMPLAINT_LIST_MY_FAIL,
  COMPLAINT_LIST_ALL_REQUEST,
  COMPLAINT_LIST_ALL_SUCCESS,
  COMPLAINT_LIST_ALL_FAIL,
  COMPLAINT_DETAILS_REQUEST,
  COMPLAINT_DETAILS_SUCCESS,
  COMPLAINT_DETAILS_FAIL,
  COMPLAINT_UPDATE_REQUEST,
  COMPLAINT_UPDATE_SUCCESS,
  COMPLAINT_UPDATE_FAIL,
  COMPLAINT_UPDATE_RESET,
  COMPLAINT_FEEDBACK_REQUEST,
  COMPLAINT_FEEDBACK_SUCCESS,
  COMPLAINT_FEEDBACK_FAIL,
  COMPLAINT_FEEDBACK_RESET,
} from "../constants/complaintConstants";

export const complaintRaiseReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPLAINT_RAISE_REQUEST:
      return { loading: true };
    case COMPLAINT_RAISE_SUCCESS:
      return { loading: false, success: true, complaint: action.payload };
    case COMPLAINT_RAISE_FAIL:
      return { loading: false, error: action.payload };
    case COMPLAINT_RAISE_RESET:
      return {};
    default:
      return state;
  }
};

export const complaintListMyReducer = (state = { complaints: [] }, action) => {
  switch (action.type) {
    case COMPLAINT_LIST_MY_REQUEST:
      return { loading: true, complaints: [] };
    case COMPLAINT_LIST_MY_SUCCESS:
      return { loading: false, complaints: action.payload };
    case COMPLAINT_LIST_MY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const complaintListAllReducer = (state = { complaints: [] }, action) => {
  switch (action.type) {
    case COMPLAINT_LIST_ALL_REQUEST:
      return { loading: true, complaints: [] };
    case COMPLAINT_LIST_ALL_SUCCESS:
      return { loading: false, complaints: action.payload };
    case COMPLAINT_LIST_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const complaintDetailsReducer = (state = { complaint: {} }, action) => {
  switch (action.type) {
    case COMPLAINT_DETAILS_REQUEST:
      return { ...state, loading: true };
    case COMPLAINT_DETAILS_SUCCESS:
      return { loading: false, complaint: action.payload };
    case COMPLAINT_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const complaintUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPLAINT_UPDATE_REQUEST:
      return { loading: true };
    case COMPLAINT_UPDATE_SUCCESS:
      return { loading: false, success: true, complaint: action.payload };
    case COMPLAINT_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case COMPLAINT_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

export const complaintFeedbackReducer = (state = {}, action) => {
  switch (action.type) {
    case COMPLAINT_FEEDBACK_REQUEST:
      return { loading: true };
    case COMPLAINT_FEEDBACK_SUCCESS:
      return { loading: false, success: true, complaint: action.payload };
    case COMPLAINT_FEEDBACK_FAIL:
      return { loading: false, error: action.payload };
    case COMPLAINT_FEEDBACK_RESET:
      return {};
    default:
      return state;
  }
};