import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Badge, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../../components/message";
import Loader from "../../components/loader";
import { listMyLeaves } from "../../actions/leaveActions";

const statusVariant = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const MyLeaveHistoryView = ({ history }) => {
  const dispatch = useDispatch();

  const leaveListMy = useSelector((state) => state.leaveListMy);
  const { loading, error, leaves } = leaveListMy;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(listMyLeaves());
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h1>My Leave / Outing History</h1>
        </Col>
        <Col className="text-end">
          <Link to="/leave/apply" className="btn btn-primary">
            Apply New
          </Link>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Room</th>
              <th>Status</th>
              <th>Pass Code</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id}>
                <td>{l.type}</td>
                <td>{l.startDate}</td>
                <td>{l.endDate}</td>
                <td>{l.roomNo}</td>
                <td>
                  <Badge bg={statusVariant[l.status]}>{l.status}</Badge>
                </td>
                <td>
                  {l.passCode ? (
                    <strong style={{ fontSize: "1.1rem" }}>{l.passCode}</strong>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <LinkContainer to={`/leave/${l._id}`}>
                    <Button variant="light" className="btn-sm">
                      View
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default MyLeaveHistoryView;