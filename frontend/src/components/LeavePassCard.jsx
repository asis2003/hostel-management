import React from "react";
import { Card, Badge } from "react-bootstrap";

const LeavePassCard = ({ leave }) => {
  if (!leave || leave.status !== "Approved" || !leave.passCode) {
    return null;
  }

  return (
    <Card
      className="text-center shadow"
      style={{
        border: "2px solid #198754",
        background: "linear-gradient(135deg, #f8fff9 0%, #e8f5e9 100%)",
        maxWidth: "360px",
        margin: "0 auto",
      }}
    >
      <Card.Body className="p-4">
        <div className="mb-2">
          <Badge bg="success" className="px-3 py-2">
            APPROVED
          </Badge>
        </div>

        <h4 className="mb-1 fw-bold text-success">HOSTEL PASS</h4>
        <h6 className="text-uppercase text-muted mb-3">{leave.type}</h6>

        <hr />

        <h5 className="mb-1">{leave.studentName}</h5>
        <p className="mb-1">
          <strong>Room:</strong> {leave.roomNo}
        </p>
        <p className="mb-3">
          <strong>Valid:</strong> {leave.startDate} → {leave.endDate}
        </p>

        <div
          className="py-3 px-2 mb-3"
          style={{
            background: "#ffffff",
            border: "2px dashed #198754",
            borderRadius: "8px",
          }}
        >
          <small className="text-muted d-block mb-1">PASS CODE</small>
          <h2
            className="mb-0 fw-bold"
            style={{
              letterSpacing: "6px",
              fontFamily: "monospace",
              color: "#198754",
            }}
          >
            {leave.passCode}
          </h2>
        </div>

        <p className="text-muted small mb-0">
          Show this pass to Watchman / Warden
        </p>
      </Card.Body>
    </Card>
  );
};

export default LeavePassCard;