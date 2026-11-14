
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";

import Loading from "../components/loader";
import Message from "../components/message";

import {
  getStudentDetails,
  updateStudent,
  deleteStudent,
} from "../actions/studentActions";

import { STUDENT_UPDATE_RESET } from "../constants/studentConstant";

const StudentDetailsView = ({ match, history }) => {
  const [status, setStatus] = useState("");

  const dispatch = useDispatch();

  const studentDetails = useSelector((state) => state.studentDetails);
  const { loading, error, student } = studentDetails;

  const studentUpdate = useSelector((state) => state.studentUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = studentUpdate;

  const studentDelete = useSelector((state) => state.studentDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = studentDelete;

  useEffect(() => {
    if (successDelete) {
      history.push("/");
    }

    if (successUpdate) {
      dispatch({ type: STUDENT_UPDATE_RESET });
    }

    if (!student || !student._id || student._id !== match.params.id) {
      dispatch(getStudentDetails(match.params.id));
    }

    if (student && student._id && !status) {
      setStatus(student.status);
    }
  }, [dispatch, match, successUpdate, successDelete]);

  const navigateToEdit = () => {
    history.push({
      pathname: `/student/edit/${student._id}`,
      state: { studentProps: student },
    });
  };

  const updateStatus = () => {
    student.status = status;
    dispatch(updateStudent(student));
  };

  const deleteStuden = () => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      dispatch(deleteStudent(student._id));
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {loading || loadingUpdate || loadingDelete ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {errorUpdate && (
            <Message variant="danger">{errorUpdate}</Message>
          )}

          {errorDelete && (
            <Message variant="danger">{errorDelete}</Message>
          )}

          {student && (
            <Row>
              {/* Student Image */}
              <Col md={3}>
                <Image
                  src={student.image}
                  alt={student.name}
                  fluid
                  rounded
                />
              </Col>

              {/* Student Details */}
              <Col md={3}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h3>{student.name}</h3>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <strong>Student ID:</strong>{" "}
                    {student.studentId || "N/A"}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <strong>Phone No:</strong>{" "}
                    {student.contact}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <strong>Father Contact:</strong>{" "}
                    {student.fatherContact}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <strong>City:</strong>{" "}
                    {student.city}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <strong>Address:</strong>{" "}
                    {student.address}
                  </ListGroup.Item>

                  {student.category && (
                    <ListGroup.Item>
                      <strong>Category:</strong>{" "}
                      {student.category}
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>

              {/* Room and Status Details */}
              <Col md={4}>
                <Card>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Floor No:</strong>
                        </Col>
                        <Col>{student.blockNo}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Room No:</strong>
                        </Col>
                        <Col>{student.roomNo}</Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Room Type:</strong>
                        </Col>
                        <Col>
                          {student.roomType || "—"}
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Status:</strong>
                        </Col>
                        <Col>
                          <Form.Control
                            size="sm"
                            as="select"
                            value={status}
                            onChange={(e) =>
                              setStatus(e.target.value)
                            }
                          >
                            {["Hostel", "Outside", "Home"].map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Button
                        className="btn-block"
                        type="button"
                        onClick={updateStatus}
                        disabled={status === student.status}
                      >
                        Update Status
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>

              {/* Edit and Delete Buttons */}
              <Col>
                <ListGroup variant="flush">
                  <Row>
                    <ListGroup.Item>
                      <Button
                        onClick={navigateToEdit}
                        className="mb-2"
                        title="Edit Student"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Button
                        variant="danger"
                        onClick={deleteStuden}
                        title="Delete Student"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </ListGroup.Item>
                  </Row>
                </ListGroup>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default StudentDetailsView;
