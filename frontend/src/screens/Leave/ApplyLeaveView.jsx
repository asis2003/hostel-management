import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FormContainer from "../../components/formContainer";
import Message from "../../components/message";
import Loader from "../../components/loader";
import { applyLeave } from "../../actions/leaveActions";
import { LEAVE_APPLY_RESET } from "../../constants/leaveConstants";

const ApplyLeaveView = ({ history }) => {
  const [type, setType] = useState("Leave");
  const [roomNo, setRoomNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");

  const dispatch = useDispatch();

  const leaveApply = useSelector((state) => state.leaveApply);
  const { loading, error, success } = leaveApply;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    if (success) {
      dispatch({ type: LEAVE_APPLY_RESET });
      history.push("/leave");
    }
  }, [dispatch, history, userInfo, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(parentContact)) {
      alert("Parent contact must be 10 digits");
      return;
    }

    if (endDate < startDate) {
      alert("End Date cannot be before Start Date");
      return;
    }

    dispatch(
      applyLeave({
        type,
        roomNo,
        studentName,
        startDate,
        endDate,
        reason,
        parentName,
        parentContact,
      })
    );
  };

  return (
    <FormContainer>
      <h1>Apply for Leave / Outing</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="type" className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Leave">Leave</option>
            <option value="Outing">Outing</option>
          </Form.Control>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="studentName" className="mb-3">
              <Form.Label>Student Name</Form.Label>
              <Form.Control
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="roomNo" className="mb-3">
              <Form.Label>Room No</Form.Label>
              <Form.Control
                type="text"
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="startDate" className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                min={today}                    // ← Only today & future
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="endDate" className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                min={startDate || today}       // ← Cannot be before Start Date
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="reason" className="mb-3">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="parentName" className="mb-3">
              <Form.Label>Parent / Guardian Name</Form.Label>
              <Form.Control
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="parentContact" className="mb-3">
              <Form.Label>Parent Contact (10 digits)</Form.Label>
              <Form.Control
                type="text"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
                required
                maxLength={10}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" className="mt-2">
          Submit Application
        </Button>
        <Link to="/leave" className="btn btn-light ms-2 mt-2">
          Cancel
        </Link>
      </Form>
    </FormContainer>
  );
};

export default ApplyLeaveView;