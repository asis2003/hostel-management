import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/message";
import Loader from "../../components/loader";
import LeavePassCard from "../../components/LeavePassCard";
import { getLeaveDetails } from "../../actions/leaveActions";

const statusVariant = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const LeaveDetailsView = ({ match, history }) => {
  const leaveId = match.params.id;
  const dispatch = useDispatch();

  const leaveDetails = useSelector((state) => state.leaveDetails);
  const { loading, error, leave } = leaveDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(getLeaveDetails(leaveId));
    }
  }, [dispatch, history, userInfo, leaveId]);

  return (
    <>
      <Link to="/leave" className="btn btn-light my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={7}>
            <Card className="p-4">
              <h3>
                {leave.type} Application{" "}
                <Badge bg={statusVariant[leave.status] || "secondary"}>
                  {leave.status}
                </Badge>
              </h3>

              <p>
                <strong>Student:</strong> {leave.studentName}
              </p>
              <p>
                <strong>Room:</strong> {leave.roomNo}
              </p>
              <p>
                <strong>Duration:</strong> {leave.startDate} → {leave.endDate}
              </p>
              <p>
                <strong>Reason:</strong>
                <br />
                {leave.reason}
              </p>
              <p>
                <strong>Parent:</strong> {leave.parentName} ({leave.parentContact})
              </p>

              {leave.adminNote && (
                <p>
                  <strong>Admin Note:</strong> {leave.adminNote}
                </p>
              )}

              <p className="text-muted mt-3 mb-0">
                Applied on: {new Date(leave.createdAt).toLocaleString()}
              </p>
            </Card>
          </Col>

          {/* Digital Pass Card */}
          {leave.status === "Approved" && leave.passCode && (
            <Col md={5}>
              <LeavePassCard leave={leave} />
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default LeaveDetailsView;