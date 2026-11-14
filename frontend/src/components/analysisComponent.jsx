import React, { useEffect, useState } from "react";
import { Table, Button, ButtonGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import Loading from "./loader";
import Message from "./message";
import { CSVLink } from "react-csv";

const AnalysisComponent = () => {
  const attendanceAnalysis = useSelector((state) => state.attendanceAnalysis);
  const { loading, error, attendance } = attendanceAnalysis;

  const [filter, setFilter] = useState("ALL"); // ALL | IN | OUT
  const [inData, setInData] = useState([]);
  const [outData, setOutData] = useState([]);
  const [allData, setAllData] = useState([]);

  const headers = [
    { label: "Name", key: "name" },
    { label: "Contact", key: "contact" },
    { label: "Room No", key: "roomNo" },
    { label: "Status", key: "attendance" },
  ];

  useEffect(() => {
    if (attendance && attendance.details && attendance.data) {
      const inList = [];
      const outList = [];
      const allList = [];

      Object.entries(attendance.details).forEach(([id, info]) => {
        const status = attendance.data[id] || "—";
        const row = {
          name: info.name,
          contact: info.contact,
          roomNo: info.roomNo,
          attendance: status,
        };

        allList.push(row);

        if (status === "IN") {
          inList.push(row);
        } else if (status === "OUT") {
          outList.push(row);
        }
      });

      setInData(inList);
      setOutData(outList);
      setAllData(allList);
    }
  }, [attendance]);

  const displayedData =
    filter === "IN" ? inData : filter === "OUT" ? outData : allData;

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loading />
      ) : (
        <>
          {attendance && (
            <>
              {/* Filter buttons */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <ButtonGroup>
                  <Button
                    variant={filter === "ALL" ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setFilter("ALL")}
                  >
                    All ({allData.length})
                  </Button>
                  <Button
                    variant={filter === "IN" ? "success" : "outline-success"}
                    size="sm"
                    onClick={() => setFilter("IN")}
                  >
                    IN ({inData.length})
                  </Button>
                  <Button
                    variant={filter === "OUT" ? "danger" : "outline-danger"}
                    size="sm"
                    onClick={() => setFilter("OUT")}
                  >
                    OUT ({outData.length})
                  </Button>
                </ButtonGroup>
              </div>

              <Table striped bordered hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact No</th>
                    <th>Room No</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.name}</td>
                      <td>{row.contact}</td>
                      <td>{row.roomNo}</td>
                      <td>
                        <span
                          style={{
                            color:
                              row.attendance === "IN"
                                ? "var(--accent)"
                                : row.attendance === "OUT"
                                ? "#e63946"
                                : "var(--text-muted)",
                            fontWeight: 600,
                          }}
                        >
                          {row.attendance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {displayedData.length === 0 && (
                <Message variant="info">
                  No students found for this filter.
                </Message>
              )}

              {/* Download buttons */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                <CSVLink
                  data={inData}
                  headers={headers}
                  filename={`attendance_IN_${Date()
                    .toString()
                    .substring(0, 15)}.csv`}
                  className="btn btn-success btn-sm"
                >
                  Download IN only ({inData.length})
                </CSVLink>

                <CSVLink
                  data={outData}
                  headers={headers}
                  filename={`attendance_OUT_${Date()
                    .toString()
                    .substring(0, 15)}.csv`}
                  className="btn btn-danger btn-sm"
                >
                  Download OUT only ({outData.length})
                </CSVLink>

                <CSVLink
                  data={allData}
                  headers={headers}
                  filename={`attendance_ALL_${Date()
                    .toString()
                    .substring(0, 15)}.csv`}
                  className="btn btn-primary btn-sm"
                >
                  Download All ({allData.length})
                </CSVLink>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AnalysisComponent;