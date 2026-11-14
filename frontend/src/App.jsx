import React, { useEffect } from "react";
import HomeView from "./screens/homeView";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";
import AddStudentView from "./screens/addStudentView";
import AnalysisView from "./screens/analysisView";
import LoginView from "./screens/Authentication Screens/LoginView";
import RegisterView from "./screens/Authentication Screens/RegisterView";
import StudentDetailsView from "./screens/studentDetailsView";
import AttendanceView from "./screens/attendanceView";
import ProfileView from "./screens/profileView";
import UserListView from "./screens/userListView";
import UserEditView from "./screens/userEditView";
import MenuView from "./screens/menuView";

// ===== Complaint Screens =====
import RaiseComplaintView from "./screens/Complaints/RaiseComplaintView";
import MyComplaintsView from "./screens/Complaints/MyComplaintsView";
import ComplaintDetailsView from "./screens/Complaints/ComplaintDetailsView";
import AdminComplaintsView from "./screens/Complaints/AdminComplaintsView";

// ===== Leave Screens =====
import ApplyLeaveView from "./screens/Leave/ApplyLeaveView";
import MyLeaveHistoryView from "./screens/Leave/MyLeaveHistoryView";
import LeaveDetailsView from "./screens/Leave/LeaveDetailsView";
import AdminLeaveView from "./screens/Leave/AdminLeaveView";

// ===== Watchman Screens =====
import WatchmanLoginView from "./screens/Watchman/WatchmanLoginView";
import WatchmanVerifyView from "./screens/Watchman/WatchmanVerifyView";

const App = () => {
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          {/* Existing Routes */}
          <Route path="/user/:userId/edit" component={UserEditView} />
          <Route path="/userList" component={UserListView} />
          <Route path="/profile" component={ProfileView} />
          <Route path="/attendance" component={AttendanceView} />
          <Route path="/analysis" component={AnalysisView} />
          <Route path="/menu" component={MenuView} />
          <Route path="/addStudent" component={AddStudentView} />
          <Route path="/student/edit/:id" component={AddStudentView} exact />
          <Route path="/student/:id" component={StudentDetailsView} exact />
          <Route path="/login" component={LoginView} exact />
          <Route path="/register" component={RegisterView} exact />
          <Route path="/search/:keyword" component={HomeView} exact />
          <Route path="/page/:pageNumber" component={HomeView} exact />
          <Route
            path="/search/:keyword/page/:pageNumber"
            component={HomeView}
            exact
          />
          <Route path="/" component={HomeView} exact />

          {/* ===== Complaint Routes ===== */}
          <Route path="/complaints/raise" component={RaiseComplaintView} />
          <Route path="/complaints/:id" component={ComplaintDetailsView} exact />
          <Route path="/complaints" component={MyComplaintsView} exact />
          <Route path="/admin/complaints" component={AdminComplaintsView} />

          {/* ===== Leave Routes ===== */}
          <Route path="/leave/apply" component={ApplyLeaveView} />
          <Route path="/leave/:id" component={LeaveDetailsView} exact />
          <Route path="/leave" component={MyLeaveHistoryView} exact />
          <Route path="/admin/leaves" component={AdminLeaveView} />

          {/* ===== Watchman Routes ===== */}
          <Route path="/watchman/login" component={WatchmanLoginView} />
          <Route path="/watchman/verify" component={WatchmanVerifyView} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;