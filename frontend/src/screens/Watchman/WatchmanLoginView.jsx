import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import FormContainer from "../../components/formContainer";
import Message from "../../components/message";

const WatchmanLoginView = ({ history }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const watchmanInfo = localStorage.getItem("watchmanInfo");
    if (watchmanInfo) {
      history.push("/watchman/verify");
    }
  }, [history]);

  const submitHandler = (e) => {
    e.preventDefault();
    setError("");

    // Hardcoded credentials
    if (username === "watchman" && password === "watchman123") {
      localStorage.setItem(
        "watchmanInfo",
        JSON.stringify({ name: "Watchman", role: "watchman" })
      );
      history.push("/watchman/verify");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <FormContainer>
      <Card className="p-4 mt-5">
        <h2 className="text-center mb-4">Watchman Login</h2>

        {error && <Message variant="danger">{error}</Message>}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" size="lg">
              Login
            </Button>
          </div>
        </Form>

        <p className="text-muted text-center mt-3 mb-0" style={{ fontSize: "0.85rem" }}>
          Only for Watchman use
        </p>
      </Card>
    </FormContainer>
  );
};

export default WatchmanLoginView;