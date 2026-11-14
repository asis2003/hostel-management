import React, { useState, useEffect } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/loader";
import Message from "../components/message";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WEEKS = ["Week 1", "Week 2", "Week 3", "Week 4"];

const MEAL_KEYS = [
  { key: "teaCoffee", label: "Tea / Coffee" },
  { key: "breakfast", label: "Breakfast" },
  { key: "lunch", label: "Lunch" },
  { key: "snacks", label: "Snacks" },
  { key: "dinner", label: "Dinner" },
];

const emptyDay = () => ({
  teaCoffee: "",
  breakfast: "",
  lunch: "",
  snacks: "",
  dinner: "",
});

const defaultData = () => {
  const data = {};
  DAYS.forEach((d) => {
    data[d] = emptyDay();
  });
  return data;
};

const MenuView = () => {
  const [week, setWeek] = useState("Week 1");
  const [menuData, setMenuData] = useState(defaultData());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const isAdmin = userInfo && userInfo.isAdmin;

  const fetchMenu = async (selectedWeek) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get(
        `/menu/${encodeURIComponent(selectedWeek)}`,
        config
      );
      setMenuData(data.data || defaultData());
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchMenu(week);
    }
  }, [week, userInfo]);

  const handleChange = (day, mealKey, value) => {
    setMenuData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealKey]: value,
      },
    }));
  };

  const saveMenu = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `/menu/${encodeURIComponent(week)}`,
        { data: menuData },
        config
      );
      setSuccess("Menu saved successfully");
      setEditMode(false);
      setSaving(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setSaving(false);
    }
  };

  return (
    <>
      <h2 className="mb-3">Hostel Mess Menu</h2>

      <Row className="align-items-end mb-4">
        <Col xs={12} md={4} className="mb-2">
          <Form.Group controlId="week">
            <Form.Label>Select Week</Form.Label>
            <Form.Control
              as="select"
              value={week}
              onChange={(e) => {
                setWeek(e.target.value);
                setEditMode(false);
              }}
              style={{ maxWidth: "220px" }}
            >
              {WEEKS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        {isAdmin && (
          <Col xs={12} md={6} className="mb-2 d-flex gap-2">
            {!editMode ? (
              <Button variant="primary" onClick={() => setEditMode(true)}>
                Edit Menu
              </Button>
            ) : (
              <>
                <Button
                  variant="success"
                  onClick={saveMenu}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Menu"}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setEditMode(false);
                    fetchMenu(week);
                  }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Col>
        )}
      </Row>

      {error && <Message variant="danger">{error}</Message>}
      {success && <Message variant="success">{success}</Message>}

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            responsive
            className="table-sm menu-table"
          >
            <thead>
              <tr>
                <th>Day</th>
                {MEAL_KEYS.map((m) => (
                  <th key={m.key}>{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day}>
                  <td>
                    <strong>{day}</strong>
                  </td>
                  {MEAL_KEYS.map((m) => (
                    <td key={m.key}>
                      {editMode && isAdmin ? (
                        <Form.Control
                          type="text"
                          size="sm"
                          value={
                            (menuData[day] && menuData[day][m.key]) || ""
                          }
                          onChange={(e) =>
                            handleChange(day, m.key, e.target.value)
                          }
                          placeholder={m.label}
                        />
                      ) : (
                        <span>
                          {(menuData[day] && menuData[day][m.key]) || "—"}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {!isAdmin && (
        <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
          Only admins can edit the menu.
        </p>
      )}
    </>
  );
};

export default MenuView;