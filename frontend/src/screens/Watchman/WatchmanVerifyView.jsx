import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import FormContainer from "../../components/formContainer";
import Message from "../../components/message";
import Loader from "../../components/loader";
import LeavePassCard from "../../components/LeavePassCard";

const WatchmanVerifyView = ({ history }) => {
  const [passCode, setPassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leave, setLeave] = useState(null);

  useEffect(() => {
    const watchmanInfo = localStorage.getItem("watchmanInfo");
    if (!watchmanInfo) {
      history.push("/watchman/login");
    }
  }, [history]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLeave(null);

    if (!passCode.trim()) {
      setError("Please enter a pass code");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `/leaves/verify/${passCode.trim().toUpperCase()}`
      );
      setLeave(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Invalid or expired pass code");
      setLeave(null);
    }
  };

  const resetHandler = () => {
    setPassCode("");
    setLeave(null);
    setError("");
  };

  const logoutHandler = () => {
    localStorage.removeItem("watchmanInfo");
    history.push("/watchman/login");
  };

  return (
    <FormContainer>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Watchman Pass Verification</h2>
        <Button variant="outline-danger" size="sm" onClick={logoutHandler}>
          Logout
        </Button>
      </div>

      {/* Input Form - Only visible when no result */}
      {!leave && (
        <Card className="p-4 mb-4">
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="passCode" className="mb-3">
              <Form.Label>Enter Pass Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. A7K9P2"
                value={passCode}
                onChange={(e) => setPassCode(e.target.value.toUpperCase())}
                maxLength={8}
                style={{
                  fontSize: "1.5rem",
                  letterSpacing: "6px",
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
                autoFocus
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Pass"}
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {loading && <Loader />}

      {error && (
        <Message variant="danger">
          <strong>Invalid Pass Code</strong>
          <br />
          {error}
        </Message>
      )}

      {/* Success Result */}
      {leave && (
        <>
          <Message variant="success">
            <strong>Pass Verified – APPROVED</strong>
          </Message>

          <Row className="justify-content-center mb-3">
            <Col md={8}>
              <LeavePassCard leave={leave} />
            </Col>
          </Row>

          <Card className="p-3 mb-3">
            <h5>Student Details</h5>
            <p className="mb-1">
              <strong>Name:</strong> {leave.studentName}
            </p>
            <p className="mb-1">
              <strong>Room:</strong> {leave.roomNo}
            </p>
            <p className="mb-1">
              <strong>Type:</strong> {leave.type}
            </p>
            <p className="mb-1">
              <strong>Valid From:</strong> {leave.startDate}
            </p>
            <p className="mb-1">
              <strong>Valid To:</strong> {leave.endDate}
            </p>
            <p className="mb-1">
              <strong>Parent:</strong> {leave.parentName} ({leave.parentContact})
            </p>
            {leave.reason && (
              <p className="mb-0">
                <strong>Reason:</strong> {leave.reason}
              </p>
            )}
          </Card>

          <div className="text-center">
            <Button variant="primary" onClick={resetHandler}>
              Verify Another Pass
            </Button>
          </div>
        </>
      )}
    </FormContainer>
  );
};

export default WatchmanVerifyView;