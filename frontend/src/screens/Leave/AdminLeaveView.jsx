import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Form, Row, Col, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/message";
import Loader from "../../components/loader";
import { listAllLeaves, updateLeave } from "../../actions/leaveActions";
import { LEAVE_UPDATE_RESET } from "../../constants/leaveConstants";

const statusVariant = {
  Pending: "warning",
  Approved: "success",
  Rejected: "danger",
};

const AdminLeaveView = ({ history }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const dispatch = useDispatch();

  const leaveListAll = useSelector((state) => state.leaveListAll);
  const { loading, error, leaves } = leaveListAll;

  const leaveUpdate = useSelector((state) => state.leaveUpdate);
  const { success: successUpdate } = leaveUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(listAllLeaves({ status: statusFilter }));
      if (successUpdate) {
        dispatch({ type: LEAVE_UPDATE_RESET });
        setShowModal(false);
      }
    }
  }, [dispatch, history, userInfo, statusFilter, successUpdate]);

  const openAction = (leave) => {
    setSelected(leave);
    setStatus(leave.status === "Pending" ? "Approved" : leave.status);
    setAdminNote(leave.adminNote || "");
    setShowModal(true);
  };

  const submitUpdate = () => {
    dispatch(
      updateLeave(selected._id, {
        status,
        adminNote,
      })
    );
  };

  return (
    <>
      <h1>Manage Leave / Outing Requests</h1>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            as="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </Form.Control>
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
              <th>Student</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Pass</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id}>
                <td>{l.type}</td>
                <td>{l.studentName}</td>
                <td>{l.roomNo}</td>
                <td>{l.startDate}</td>
                <td>{l.endDate}</td>
                <td>
                  <Badge bg={statusVariant[l.status]}>{l.status}</Badge>
                </td>
                <td>{l.passCode || "-"}</td>
                <td>
                  {l.status === "Pending" && (
                    <Button
                      variant="primary"
                      className="btn-sm"
                      onClick={() => openAction(l)}
                    >
                      Action
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p>
                <strong>
                  {selected.studentName} ({selected.roomNo})
                </strong>
              </p>
              <p>
                {selected.startDate} → {selected.endDate}
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Admin Note (optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submitUpdate}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminLeaveView;