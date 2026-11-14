import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
  studentListReducer,
  studentAddReducer,
  studentDetailsReducer,
  getStudentsByRoomNoReducer,
  studentUpdateReducer,
  studentDeleteReducer,
} from "./reducers/studentsReducer";
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  attendanceDataEnterReducer,
  attendanceAnalysisReducer,
  deleteAttendanceReducer,
} from "./reducers/attendanceReducer";

// ===== NEW: Complaint Reducers =====
import {
  complaintRaiseReducer,
  complaintListMyReducer,
  complaintListAllReducer,
  complaintDetailsReducer,
  complaintUpdateReducer,
  complaintFeedbackReducer,
} from "./reducers/complaintReducer";

// ===== NEW: Leave Reducers =====
import {
  leaveApplyReducer,
  leaveListMyReducer,
  leaveListAllReducer,
  leaveDetailsReducer,
  leaveUpdateReducer,
} from "./reducers/leaveReducer";

const reducer = combineReducers({
  // Students
  studentsList: studentListReducer,
  studentDetails: studentDetailsReducer,
  studentAdd: studentAddReducer,
  studentUpdate: studentUpdateReducer,
  studentDelete: studentDeleteReducer,
  getStudentsByRoomNo: getStudentsByRoomNoReducer,

  // Users
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,

  // Attendance
  attendanceDataEnter: attendanceDataEnterReducer,
  attendanceAnalysis: attendanceAnalysisReducer,
  attendanceDelete: deleteAttendanceReducer,

  // ===== NEW: Complaints =====
  complaintRaise: complaintRaiseReducer,
  complaintListMy: complaintListMyReducer,
  complaintListAll: complaintListAllReducer,
  complaintDetails: complaintDetailsReducer,
  complaintUpdate: complaintUpdateReducer,
  complaintFeedback: complaintFeedbackReducer,

  // ===== NEW: Leave =====
  leaveApply: leaveApplyReducer,
  leaveListMy: leaveListMyReducer,
  leaveListAll: leaveListAllReducer,
  leaveDetails: leaveDetailsReducer,
  leaveUpdate: leaveUpdateReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;