import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FormContainer from "../../components/formContainer";
import Message from "../../components/message";
import Loader from "../../components/loader";
import { raiseComplaint } from "../../actions/complaintActions";
import { COMPLAINT_RAISE_RESET } from "../../constants/complaintConstants";

const RaiseComplaintView = ({ history }) => {
  const [category, setCategory] = useState("Electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [floorNo, setFloorNo] = useState("");
  const [roomError, setRoomError] = useState("");
  const [floorError, setFloorError] = useState("");

  const dispatch = useDispatch();

  const complaintRaise = useSelector((state) => state.complaintRaise);
  const { loading, error, success } = complaintRaise;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }
    if (success) {
      dispatch({ type: COMPLAINT_RAISE_RESET });
      history.push("/complaints");
    }
  }, [dispatch, history, userInfo, success]);

  const handleRoomChange = (e) => {
    const value = e.target.value;

    // Allow only numbers and max 2 digits
    if (value === "" || (/^\d{0,2}$/.test(value) && Number(value) <= 20)) {
      setRoomNo(value);
      setRoomError("");
    } else if (Number(value) > 20) {
      setRoomError("Room number cannot be more than 20");
    }
  };

  const handleFloorChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^[1-4]$/.test(value)) {
      setFloorNo(value);
      setFloorError("");
    } else {
      setFloorError("Floor number must be between 1 and 4");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Final validation
    if (!roomNo || Number(roomNo) < 1 || Number(roomNo) > 20) {
      setRoomError("Room number must be between 1 and 20");
      return;
    }

    if (!floorNo || !["1", "2", "3", "4"].includes(floorNo)) {
      setFloorError("Floor number must be 1, 2, 3 or 4");
      return;
    }

    dispatch(
      raiseComplaint({
        category,
        title,
        description,
        roomNo,
        blockNo: floorNo, // sending as blockNo to backend
      })
    );
  };

  return (
    <FormContainer>
      <h1>Raise Complaint</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="category" className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Wi-Fi">Wi-Fi</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Describe the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId="roomNo" className="mb-3">
              <Form.Label>Room No (1 - 20)</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. 12"
                value={roomNo}
                onChange={handleRoomChange}
                isInvalid={!!roomError}
                required
                maxLength={2}
              />
              <Form.Control.Feedback type="invalid">
                {roomError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="floorNo" className="mb-3">
              <Form.Label>Floor No (1 - 4)</Form.Label>
              <Form.Control
                as="select"
                value={floorNo}
                onChange={handleFloorChange}
                isInvalid={!!floorError}
                required
              >
                <option value="">Select Floor</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {floorError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary" className="mt-2">
          Submit Complaint
        </Button>
        <Link to="/complaints" className="btn btn-light ms-2 mt-2">
          Cancel
        </Link>
      </Form>
    </FormContainer>
  );
};

export default RaiseComplaintView;