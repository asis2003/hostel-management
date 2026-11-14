import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getStudentsByRoomNo as action } from "../actions/studentActions";
import AttendanceTable from "../components/attendanceTable";

const FLOORS = ["1", "2", "3", "4"];
const ROOMS = Array.from({ length: 20 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const AttendanceView = () => {
  const [floorNo, setFloorNo] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [roomError, setRoomError] = useState("");
  const [floorError, setFloorError] = useState("");
  const dispatch = useDispatch();

  const selectStyle = {
    width: "100%",
    minWidth: "180px",
    maxWidth: "220px",
  };

  const submitHandler = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!floorNo) {
      setFloorError("Select Floor No");
      hasError = true;
    } else {
      setFloorError("");
    }

    if (!roomNo || !/^\d{2}$/.test(roomNo)) {
      setRoomError("Select a valid Room No (exactly 2 digits)");
      hasError = true;
    } else {
      setRoomError("");
    }

    if (hasError) return;

    dispatch(action(roomNo));
  };

  return (
    <>
      <h2>Take Attendance</h2>

      <Form onSubmit={submitHandler} className="mb-4">
        <Row className="align-items-end">
          <Col xs={12} sm={6} md={3} className="mb-2">
            <Form.Group controlId="floorNo">
              <Form.Label>Floor No</Form.Label>
              <Form.Control
                as="select"
                value={floorNo}
                onChange={(e) => {
                  setFloorNo(e.target.value);
                  setFloorError("");
                }}
                isInvalid={!!floorError}
                style={selectStyle}
                required
              >
                <option value="">Select Floor</option>
                {FLOORS.map((f) => (
                  <option key={f} value={f}>
                    Floor {f}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {floorError}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3} className="mb-2">
            <Form.Group controlId="roomNo">
              <Form.Label>Room No</Form.Label>
              <Form.Control
                as="select"
                value={roomNo}
                onChange={(e) => {
                  setRoomNo(e.target.value);
                  setRoomError("");
                }}
                isInvalid={!!roomError}
                required
                style={selectStyle}
              >
                <option value="">Select Room</option>
                {ROOMS.map((r) => (
                  <option key={r} value={r}>
                    Room {r}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {roomError}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Exactly 2 digits (01–20)
              </Form.Text>
            </Form.Group>
          </Col>

          <Col xs={12} sm={6} md={3} className="mb-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!floorNo || !roomNo || roomNo.length !== 2}
              style={{ minWidth: "180px" }}
            >
              Get Students
            </Button>
          </Col>
        </Row>
      </Form>

      <AttendanceTable roomNo={roomNo} floorNo={floorNo} />
    </>
  );
};

export default AttendanceView;