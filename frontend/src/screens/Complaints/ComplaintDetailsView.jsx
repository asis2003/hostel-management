import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Form, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/message";
import Loader from "../../components/loader";
import {
  getComplaintDetails,
  submitComplaintFeedback,
} from "../../actions/complaintActions";
import { COMPLAINT_FEEDBACK_RESET } from "../../constants/complaintConstants";

const statusVariant = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Rejected: "danger",
};

const ComplaintDetailsView = ({ match, history }) => {
  const complaintId = match.params.id;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const complaintDetails = useSelector((state) => state.complaintDetails);
  const { loading, error, complaint } = complaintDetails;

  const complaintFeedback = useSelector((state) => state.complaintFeedback);
  const {
    loading: loadingFeedback,
    error: errorFeedback,
    success: successFeedback,
  } = complaintFeedback;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    } else {
      if (successFeedback) {
        dispatch({ type: COMPLAINT_FEEDBACK_RESET });
      }
      dispatch(getComplaintDetails(complaintId));
    }
  }, [dispatch, history, userInfo, complaintId, successFeedback]);

  const feedbackHandler = (e) => {
    e.preventDefault();
    dispatch(
      submitComplaintFeedback(complaintId, {
        feedbackRating: Number(rating),
        feedbackComment: comment,
      })
    );
  };

  return (
    <>
      <Link to="/complaints" className="btn btn-light my-3">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={8}>
            <Card className="p-3">
              <h3>{complaint.title}</h3>
              <p>
                <Badge bg={statusVariant[complaint.status] || "secondary"}>
                  {complaint.status}
                </Badge>{" "}
                | {complaint.category} | Room: {complaint.roomNo}
                {complaint.blockNo && ` | Floor: ${complaint.blockNo}`}
              </p>
              <p>
                <strong>Description:</strong>
                <br />
                {complaint.description}
              </p>
              {complaint.assignedTo && (
                <p>
                  <strong>Assigned To:</strong> {complaint.assignedTo}
                </p>
              )}
              {complaint.resolutionNote && (
                <p>
                  <strong>Resolution Note:</strong>
                  <br />
                  {complaint.resolutionNote}
                </p>
              )}
              <p className="text-muted">
                Raised on: {new Date(complaint.createdAt).toLocaleString()}
              </p>
            </Card>
          </Col>

          {complaint.status === "Resolved" && !complaint.feedbackRating && (
            <Col md={4}>
              <Card className="p-3">
                <h5>Give Feedback</h5>
                {errorFeedback && (
                  <Message variant="danger">{errorFeedback}</Message>
                )}
                {loadingFeedback && <Loader />}
                <Form onSubmit={feedbackHandler}>
                  <Form.Group controlId="rating" className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as="select"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Very Poor</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="comment" className="mb-3">
                    <Form.Label>Comment (optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Submit Feedback
                  </Button>
                </Form>
              </Card>
            </Col>
          )}

          {complaint.feedbackRating && (
            <Col md={4}>
              <Card className="p-3">
                <h5>Your Feedback</h5>
                <p>Rating: {complaint.feedbackRating} / 5</p>
                {complaint.feedbackComment && (
                  <p>{complaint.feedbackComment}</p>
                )}
              </Card>
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default ComplaintDetailsView;