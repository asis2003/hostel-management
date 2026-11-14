import React, { useEffect } from "react";
import { Table, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { postAttendance } from "../actions/attendanceActions";
import { Link } from "react-router-dom";

const AttendanceTableComponent = ({
  students,
  attendanceMap,
  setAttendanceMap,
  attendance,
  roomNo,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {}, [dispatch, attendanceMap]);

  const updateAttendance = () => {
    let roomData = attendance ? [...attendance.roomNo] : [roomNo];
    if (attendance && !attendance.roomNo.includes(roomNo)) {
      roomData.push(roomNo);
    }
    if (!attendance) {
      roomData = [roomNo];
    }

    const dataData = { ...attendanceMap };
    const detailsData = attendance ? { ...attendance.details } : {};

    students.forEach((student) => {
      detailsData[student._id] = {
        name: student.name,
        contact: student.contact,
        roomNo: student.roomNo,
      };
    });

    dispatch(
      postAttendance({
        roomNo: roomData,
        details: detailsData,
        data: dataData,
      })
    );
  };

  return (
    <>
      <Table striped bordered hover responsive className="table-sm mt-3">
        <thead>
          <tr>
            <th>NAME</th>
            <th>ATTENDANCE</th>
            <th>STATUS</th>
            <th>CONTACT</th>
            <th>CITY</th>
          </tr>
        </thead>
        <tbody>
          {students &&
            students.map((student) => (
              <tr key={student._id}>
                <td>
                  <Link to={`/student/${student._id}`}>{student.name}</Link>
                </td>
                <td>
                  <Form.Control
                    as="select"
                    size="sm"
                    value={attendanceMap[student._id] || "IN"}
                    onChange={(e) => {
                      setAttendanceMap({
                        ...attendanceMap,
                        [student._id]: e.target.value,
                      });
                    }}
                  >
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </Form.Control>
                </td>
                <td>
                  <span
                    style={{
                      color:
                        student.status === "Outside"
                          ? "#e63946"
                          : student.status === "Home"
                          ? "#4ea8de"
                          : "var(--accent)",
                      fontWeight: 500,
                    }}
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  <a href={`tel:${student.contact}`}>{student.contact}</a>
                </td>
                <td>{student.city}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Button variant="success" className="mt-2" onClick={updateAttendance}>
        Update Attendance
      </Button>
    </>
  );
};

export default AttendanceTableComponent;