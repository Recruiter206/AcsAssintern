

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { AttendanceContext } from "../../attanceContext/AttadanceContext";

const EmployeeAttendance = () => {
  const { user } = useContext(AuthContext);
  const { attendance, loading, error, message, fetchAttendance, markAttendance } =
    useContext(AttendanceContext);

  useEffect(() => {
    if (user) fetchAttendance();
  }, [user]);

  const handleMarkAttendance = () => {
    if (user) markAttendance(user.id);
  };

  const today = new Date().toISOString().split("T")[0];
  const alreadyMarked = attendance.some((a) => a.date === today);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">My Attendance</h1>

      {/* Mark Attendance */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleMarkAttendance}
          disabled={alreadyMarked}
          className={`px-6 py-2 rounded-lg text-white transition ${
            alreadyMarked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {alreadyMarked ? "Attendance Already Marked" : "Mark Attendance (Now)"}
        </button>
      </div>

      {/* Message */}
      {message && <p className="text-center mb-4 text-green-600">{message}</p>}

      {/* Attendance Table */}
      {attendance.length === 0 ? (
        <p className="text-center text-gray-500">No attendance records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Date</th>
                <th className="px-4 py-2 text-left font-semibold">mark at</th>
                
                <th className="px-4 py-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendance.map((att) => (
                <tr key={att.attendance_id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{att.date}</td>
                  <td className="px-4 py-2">{att.check_in}</td>
                  
                  <td
                    className={`px-4 py-2 font-medium ${
                      att.status === "approved"
                        ? "text-green-700"
                        : att.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendance;
