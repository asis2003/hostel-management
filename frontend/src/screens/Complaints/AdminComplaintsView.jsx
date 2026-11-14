import React, { useEffect, useState } from "react";
import { Table, Button, Badge, Form, Row, Col, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/message";
import Loader from "../../components/loader";
import {
  listAllComplaints,
  updateComplaint,
} from "../../actions/complaintActions";
import { COMPLAINT_UPDATE_RESET } from "../../constants/complaintConstants";

const statusVariant = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Rejected: "danger",
};

const AdminComplaintsView = ({ history }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  const dispatch = useDispatch();

  const complaintListAll = useSelector((state) => state.complaintListAll);
  const { loading, error, complaints } = complaintListAll;

  const complaintUpdate = useSelector((state) => state.complaintUpdate);
  const { success: successUpdate } = complaintUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    } else {
      dispatch(
        listAllComplaints({
          status: statusFilter,
          category: categoryFilter,
        })
      );
      if (successUpdate) {
        dispatch({ type: COMPLAINT_UPDATE_RESET });
        setShowModal(false);
      }
    }
  }, [dispatch, history, userInfo, statusFilter, categoryFilter, successUpdate]);

  const openEdit = (complaint) => {
    setSelected(complaint);
    setStatus(complaint.status);
    setAssignedTo(complaint.assignedTo || "");
    setResolutionNote(complaint.resolutionNote || "");
    setShowModal(true);
  };

  const submitUpdate = () => {
    dispatch(
      updateComplaint(selected._id, {
        status,
        assignedTo,
        resolutionNote,
      })
    );
  };

  return (
    <>
      <h1>Manage Complaints</h1>

      <Row className="mb-3">
        <Col md={3}>
          <Form.Control
            as="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </Form.Control>
        </Col>
        <Col md={3}>
          <Form.Control
            as="select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Wi-Fi">Wi-Fi</option>
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
              <th>Date</th>
              <th>Room</th>
              <th>Floor</th>
              <th>Category</th>
              <th>Title</th>
              <th>Raised By</th>
              <th>Status</th>
              <th>Assigned</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td>{c.roomNo}</td>
                <td>{c.blockNo || "-"}</td>
                <td>{c.category}</td>
                <td>{c.title}</td>
                <td>{c.raisedByName}</td>
                <td>
                  <Badge bg={statusVariant[c.status] || "secondary"}>
                    {c.status}
                  </Badge>
                </td>
                <td>{c.assignedTo || "-"}</td>
                <td>
                  <Button
                    variant="light"
                    className="btn-sm"
                    onClick={() => openEdit(c)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p>
                <strong>{selected.title}</strong> — Room {selected.roomNo}
                {selected.blockNo && ` | Floor ${selected.blockNo}`}
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Assign To</Form.Label>
                <Form.Control
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  placeholder="Staff name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Resolution Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
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
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminComplaintsView;