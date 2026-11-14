import React from "react";
import { Card, Badge, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const statusVariant = {
  Pending: "warning",
  "In Progress": "info",
  Resolved: "success",
  Rejected: "danger",
};

const ComplaintCard = ({ complaint }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="mb-0">{complaint.title}</Card.Title>
          <Badge bg={statusVariant[complaint.status] || "secondary"}>
            {complaint.status}
          </Badge>
        </div>

        <Card.Subtitle className="mb-2 text-muted">
          {complaint.category} • Room {complaint.roomNo}
          {complaint.blockNo && ` • Block ${complaint.blockNo}`}
        </Card.Subtitle>

        <Card.Text className="text-truncate" style={{ maxHeight: "3.6em" }}>
          {complaint.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            {new Date(complaint.createdAt).toLocaleDateString()}
          </small>

          <LinkContainer to={`/complaints/${complaint._id}`}>
            <Button variant="outline-primary" size="sm">
              View Details
            </Button>
          </LinkContainer>
        </div>

        {complaint.assignedTo && (
          <div className="mt-2">
            <small className="text-muted">
              Assigned to: <strong>{complaint.assignedTo}</strong>
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ComplaintCard;