
import React, { createContext, useState, useEffect } from "react";
import API from "../api/Api";

export const AttendanceContext = createContext();

const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);


    // Fetch all attendance (admin) by date
  const fetchAttendances = async (date) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await API.get('/attantance/all', { params: { date } });
      setAttendance(res.data.attendance || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  // Update attendance status (admin)
  const updateAttendanceStatuses = async (attendance_id, status) => {
    setMessage(null);
    try {
      await API.put(`/attantance/update-status/${attendance_id}`, { status });
      // Update local state
      setAttendance(prev =>
        prev.map(a => (a.attendance_id === attendance_id ? { ...a, status } : a))
      );
      setMessage(`Attendance ${status} successfully!`);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update status.');
      throw err;
    }
  };

  // Fetch employee's attendance
  const fetchAttendance = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await API.get("/attantance/");
      setAttendance(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  // Mark attendance (auto current time)
  const markAttendance = async (employee_id) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const checkInTime = now.toTimeString().slice(0, 5); // HH:MM

    // Check if already marked for today
    const alreadyMarked = attendance.some((a) => a.date === today);
    if (alreadyMarked) {
      setMessage("Attendance already marked today.");
      return null;
    }

    try {
      const res = await API.post("/attantance/mark", {
        employee_id,
        date: today,
        check_in: checkInTime,
      });

      setAttendance((prev) => [
        ...prev,
        { ...res.data, date: today, check_in: checkInTime, status: "pending" },
      ]);
      setMessage(`Attendance marked at ${checkInTime}`);
      return res.data;
    } catch (err) {
      console.error(err);
      setMessage("Failed to mark attendance.");
      throw err;
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        loading,
        error,
        message,
        fetchAttendance,
        markAttendance,fetchAttendances,updateAttendanceStatuses
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceProvider;
