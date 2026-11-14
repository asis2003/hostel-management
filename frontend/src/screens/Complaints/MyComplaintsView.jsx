import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Badge, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../../components/message";
import Loader from "../../components/loader";
import { listMyComplaints } from "../../actions/complaintActions";

const statusVariant = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Rejected: "danger",
};

const MyComplaintsView = ({ history }) => {
  const dispatch = useDispatch();

  const complaintListMy = useSelector((state) => state.complaintListMy);
  const { loading, error, complaints } = complaintListMy;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      dispatch(listMyComplaints());
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <Row className="align-items-center mb-3">
        <Col>
          <h1>My Complaints</h1>
        </Col>
        <Col className="text-end">
          <Link to="/complaints/raise" className="btn btn-primary">
            Raise New Complaint
          </Link>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : complaints.length === 0 ? (
        <Message>No complaints found. Raise your first complaint!</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Title</th>
              <th>Room</th>
              <th>Floor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>{c.category}</td>
                <td>{c.title}</td>
                <td>{c.roomNo}</td>
                <td>{c.blockNo || "-"}</td>
                <td>
                  <Badge bg={statusVariant[c.status] || "secondary"}>
                    {c.status}
                  </Badge>
                </td>
                <td>
                  <LinkContainer to={`/complaints/${c._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
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

export default MyComplaintsView;