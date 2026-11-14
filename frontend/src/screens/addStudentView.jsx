import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import FormContainer from "../components/formContainer";
import { useDispatch, useSelector } from "react-redux";
import { addStudent, updateStudent } from "../actions/studentActions";
import Loading from "../components/loader.jsx";
import Message from "../components/message.jsx";
import { STUDENT_UPDATE_RESET } from "../constants/studentConstant";
import Loader from "../components/loader";

const CATEGORIES = [
  "Automobile Engineering",
  "Mechatronics Engineering",
  "Robotics and Automation Engineering",
  "Biomedical Engineering",
  "Agricultural Engineering",
  "Marine Engineering",
  "Mining Engineering",
  "Petroleum Engineering",
  "Environmental Engineering",
  "Metallurgical Engineering",
  "Textile Engineering",
  "Industrial Engineering",
  "Instrumentation and Control Engineering",
  "Food Technology Engineering",
  "Nuclear Engineering",
  "Aeronautical Engineering",
  "Artificial Intelligence and Machine Learning",
  "Cybersecurity Engineering",
  "Internet of Things (IoT) Engineering",
  "Computer Science and Business Systems (CSBS)",
];

const FLOORS = ["1", "2", "3", "4"];
const ROOMS = Array.from({ length: 20 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const ROOM_TYPES = ["2 Sharing", "3 Sharing"];
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1 MB

const AddStudentView = () => {
  const history = useHistory();
  const [isEdit, setIsEdit] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [fatherContact, setFatherContact] = useState("");
  const [image, setImage] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [blockNo, setBlockNo] = useState(""); // Floor No
  const [roomType, setRoomType] = useState("2 Sharing");
  const [status, setStatus] = useState("Hostel");

  const [studentIdError, setStudentIdError] = useState("");
  const [contactError, setContactError] = useState("");
  const [fatherContactError, setFatherContactError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const dispatch = useDispatch();
  const studentAdd = useSelector((state) => state.studentAdd);
  const { loading, error, success } = studentAdd;
  const studentUpdate = useSelector((state) => state.studentUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = studentUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: STUDENT_UPDATE_RESET });
      history.push("/");
    }
    if (history.location.state && history.location.state.studentProps) {
      setIsEdit(true);
      const student = history.location.state.studentProps;
      setStudentId(student.studentId || "");
      setName(student.name);
      setAddress(student.address);
      setCategory(student.category);
      setCity(student.city);
      setContact(student.contact);
      setFatherContact(student.fatherContact);
      setImage(student.image);
      setImagePreview(student.image);
      setRoomNo(student.roomNo);
      setBlockNo(student.blockNo);
      setRoomType(student.roomType || "2 Sharing");
      setStatus(student.status);
    }
    if (success) {
      history.push("/");
    }
  }, [dispatch, history, success, successUpdate]);

  // Student ID – exactly 12 digits
  const handleStudentIdChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,12}$/.test(value)) {
      setStudentId(value);
      if (value.length === 12) setStudentIdError("");
      else if (value.length > 0)
        setStudentIdError("Student ID must be exactly 12 digits");
      else setStudentIdError("");
    }
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setContact(value);
      if (value.length === 10) setContactError("");
      else if (value.length > 0)
        setContactError("Contact must be exactly 10 digits");
      else setContactError("");
    }
  };

  const handleFatherContactChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setFatherContact(value);
      if (value.length === 10) setFatherContactError("");
      else if (value.length > 0)
        setFatherContactError("Father Contact must be exactly 10 digits");
      else setFatherContactError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file (jpg, png, etc.)");
      setImage("");
      setImagePreview("");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be 1 MB or less");
      setImage("");
      setImagePreview("");
      e.target.value = "";
      return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const submitHandler = (e) => {
    if (e) e.preventDefault();

    let hasError = false;

    if (!/^\d{12}$/.test(studentId)) {
      setStudentIdError("Student ID must be exactly 12 digits");
      hasError = true;
    }
    if (!/^\d{10}$/.test(contact)) {
      setContactError("Contact must be exactly 10 digits");
      hasError = true;
    }
    if (!/^\d{10}$/.test(fatherContact)) {
      setFatherContactError("Father Contact must be exactly 10 digits");
      hasError = true;
    }
    if (!image) {
      setImageError("Please upload an image");
      hasError = true;
    }
    if (!roomNo || !blockNo) hasError = true;

    if (hasError) return;

    const payload = {
      studentId,
      name,
      address,
      category,
      city,
      contact,
      fatherContact,
      image,
      roomNo,
      blockNo,
      roomType,
      status,
    };

    if (isEdit) {
      dispatch(
        updateStudent({
          _id: history.location.state.studentProps._id,
          ...payload,
        })
      );
    } else {
      dispatch(addStudent(payload));
    }
  };

  return (
    <>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      {loading || loadingUpdate ? (
        <Loader />
      ) : (
        <>
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          <FormContainer>
            <h1>{isEdit ? "Edit Student" : "Add Student"}</h1>
            {loading && <Loading />}
            {error && <Message variant="danger">{error}</Message>}

            <Form onSubmit={submitHandler}>
              {/* Student ID – exactly 12 digits */}
              <Form.Group controlId="studentId" className="mb-3">
                <Form.Label>Student ID</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="Enter 12 digit Student ID"
                  value={studentId}
                  onChange={handleStudentIdChange}
                  isInvalid={!!studentIdError}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {studentIdError}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Must be exactly 12 digits
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="status" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {["Hostel", "Outside", "Home"].map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="city" className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="contact" className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10 digit phone number"
                  value={contact}
                  onChange={handleContactChange}
                  isInvalid={!!contactError}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {contactError}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Must be exactly 10 digits
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="fatherContact" className="mb-3">
                <Form.Label>Father Contact</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10 digit phone number"
                  value={fatherContact}
                  onChange={handleFatherContactChange}
                  isInvalid={!!fatherContactError}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {fatherContactError}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Must be exactly 10 digits
                </Form.Text>
              </Form.Group>

              {/* Floor No */}
              <Form.Group controlId="blockNo" className="mb-3">
                <Form.Label>Floor No</Form.Label>
                <Form.Control
                  as="select"
                  value={blockNo}
                  onChange={(e) => setBlockNo(e.target.value)}
                  required
                >
                  <option value="">Select Floor</option>
                  {FLOORS.map((f) => (
                    <option key={f} value={f}>
                      Floor {f}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Room No */}
              <Form.Group controlId="roomNo" className="mb-3">
                <Form.Label>Room No</Form.Label>
                <Form.Control
                  as="select"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  required
                >
                  <option value="">Select Room</option>
                  {ROOMS.map((r) => (
                    <option key={r} value={r}>
                      Room {r}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Room Type */}
              <Form.Group controlId="roomType" className="mb-3">
                <Form.Label>Room Type</Form.Label>
                <Form.Control
                  as="select"
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  required
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {/* Image Upload */}
              <Form.Group controlId="image" className="mb-3">
                <Form.Label>Student Photo</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  isInvalid={!!imageError}
                />
                <Form.Control.Feedback type="invalid">
                  {imageError}
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                  Max size: 1 MB (jpg, png, webp)
                </Form.Text>

                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        border: "2px solid var(--accent)",
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="mt-2"
                disabled={
                  studentId.length !== 12 ||
                  contact.length !== 10 ||
                  fatherContact.length !== 10 ||
                  !image ||
                  !roomNo ||
                  !blockNo
                }
              >
                {isEdit ? "Update" : "Add Student"}
              </Button>
            </Form>
          </FormContainer>
        </>
      )}
    </>
  );
};

export default AddStudentView;