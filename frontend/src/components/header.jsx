import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Route, useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import SearchBox from "./searchBox";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logoutHandler = () => {
    dispatch(logout());
    history.push("/login");
  };

  return (
    <header>
      <Navbar expand="lg" collapseOnSelect className="royal-navbar">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>NSD Solutions</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            {userInfo && (
              <Route
                render={({ history }) => <SearchBox history={history} />}
              />
            )}

            <Nav className="ml-auto align-items-lg-center">
              {userInfo && (
                <NavDropdown title="More" id="more-nav">
                  <LinkContainer to="/attendance">
                    <NavDropdown.Item>Attendance</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/addStudent">
                    <NavDropdown.Item>Add Student</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/analysis">
                    <NavDropdown.Item>View Analysis</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/menu">
                    <NavDropdown.Item>Menu</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Divider />

                  {/* ===== NEW: Complaints & Leave ===== */}
                  <LinkContainer to="/complaints">
                    <NavDropdown.Item>My Complaints</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/complaints/raise">
                    <NavDropdown.Item>Raise Complaint</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/leave">
                    <NavDropdown.Item>Leave / Outing</NavDropdown.Item>
                  </LinkContainer>

                  {/* Admin only links */}
                  {userInfo.isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <LinkContainer to="/admin/complaints">
                        <NavDropdown.Item>Manage Complaints</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/leaves">
                        <NavDropdown.Item>Manage Leaves</NavDropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                </NavDropdown>
              )}

              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <LinkContainer to="/userList">
                      <NavDropdown.Item>Users List</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;