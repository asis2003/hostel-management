import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./loader";
import Message from "./message";
import AttendanceTableComponent from "./attendanceTableComponent";

const AttendanceTable = ({ roomNo, floorNo }) => {
  const dispatch = useDispatch();
  const [attendanceMap, setAttendanceMap] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);

  const getStudentsByRoomNo = useSelector((state) => state.getStudentsByRoomNo);
  const { loading, error, students, attendance } = getStudentsByRoomNo;
  const attendanceDataEnter = useSelector((state) => state.attendanceDataEnter);
  const {
    loading: loadingAttendance,
    error: errorAttendance,
  } = attendanceDataEnter;

  useEffect(() => {
    if (students) {
      // BOTH roomNo AND floorNo (blockNo) must match
      const matched = students.filter((student) => {
        const roomMatch = String(student.roomNo) === String(roomNo);
        const floorMatch =
          !floorNo || String(student.blockNo) === String(floorNo);
        return roomMatch && floorMatch;
      });

      setFilteredStudents(matched);
      arrangeTable(matched);
    } else {
      setFilteredStudents([]);
    }
  }, [dispatch, attendance, students, roomNo, floorNo]);

  const arrangeTable = (list) => {
    const tempMap = { ...attendanceMap };

    list.forEach((student) => {
      if (attendance && attendance.data && attendance.data[student._id]) {
        const val = attendance.data[student._id];
        if (val === "IN" || val === "OUT") {
          tempMap[student._id] = val;
        } else {
          tempMap[student._id] = "IN";
        }
      } else {
        tempMap[student._id] = "IN";
      }
    });

    setAttendanceMap(tempMap);
  };

  return (
    <>
      {error && <Message variant="danger">{error}</Message>}
      {loading || loadingAttendance ? (
        <Loading />
      ) : (
        <>
          {errorAttendance && (
            <Message variant="danger">{errorAttendance}</Message>
          )}
          {students && filteredStudents.length === 0 && roomNo && (
            <Message variant="info">
              No students found for Floor {floorNo || "—"} / Room {roomNo}
            </Message>
          )}
          {filteredStudents.length > 0 && (
            <AttendanceTableComponent
              students={filteredStudents}
              attendanceMap={attendanceMap}
              setAttendanceMap={setAttendanceMap}
              attendance={attendance}
              roomNo={roomNo}
            />
          )}
        </>
      )}
    </>
  );
};

export default AttendanceTable;