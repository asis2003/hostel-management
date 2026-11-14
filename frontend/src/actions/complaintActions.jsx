import axios from "axios";
import {
  COMPLAINT_RAISE_REQUEST,
  COMPLAINT_RAISE_SUCCESS,
  COMPLAINT_RAISE_FAIL,
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
  COMPLAINT_FEEDBACK_REQUEST,
  COMPLAINT_FEEDBACK_SUCCESS,
  COMPLAINT_FEEDBACK_FAIL,
} from "../constants/complaintConstants";

export const raiseComplaint = (complaintData) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_RAISE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post("/complaints", complaintData, config);

    dispatch({ type: COMPLAINT_RAISE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_RAISE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listMyComplaints = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_LIST_MY_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get("/complaints/my", config);

    dispatch({ type: COMPLAINT_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_LIST_MY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listAllComplaints = (filters = {}) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_LIST_ALL_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);

    const { data } = await axios.get(`/complaints?${params.toString()}`, config);

    dispatch({ type: COMPLAINT_LIST_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_LIST_ALL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getComplaintDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_DETAILS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    const { data } = await axios.get(`/complaints/${id}`, config);

    dispatch({ type: COMPLAINT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateComplaint = (id, updateData) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_UPDATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/complaints/${id}`, updateData, config);

    dispatch({ type: COMPLAINT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const submitComplaintFeedback = (id, feedbackData) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPLAINT_FEEDBACK_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/complaints/${id}/feedback`,
      feedbackData,
      config
    );

    dispatch({ type: COMPLAINT_FEEDBACK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPLAINT_FEEDBACK_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};