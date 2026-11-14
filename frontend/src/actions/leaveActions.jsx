import axios from "axios";
import {
  LEAVE_APPLY_REQUEST,
  LEAVE_APPLY_SUCCESS,
  LEAVE_APPLY_FAIL,
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
} from "../constants/leaveConstants";

export const applyLeave = (leaveData) => async (dispatch, getState) => {
  try {
    dispatch({ type: LEAVE_APPLY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/leaves", leaveData, config);

    dispatch({ type: LEAVE_APPLY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LEAVE_APPLY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listMyLeaves = () => async (dispatch, getState) => {
  try {
    dispatch({ type: LEAVE_LIST_MY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get("/leaves/my", config);

    dispatch({ type: LEAVE_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LEAVE_LIST_MY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listAllLeaves = (filters = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: LEAVE_LIST_ALL_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.type) params.append("type", filters.type);

    const { data } = await axios.get(`/leaves?${params.toString()}`, config);

    dispatch({ type: LEAVE_LIST_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LEAVE_LIST_ALL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getLeaveDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: LEAVE_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`/leaves/${id}`, config);

    dispatch({ type: LEAVE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LEAVE_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateLeave = (id, updateData) => async (dispatch, getState) => {
  try {
    dispatch({ type: LEAVE_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/leaves/${id}`, updateData, config);

    dispatch({ type: LEAVE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: LEAVE_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};