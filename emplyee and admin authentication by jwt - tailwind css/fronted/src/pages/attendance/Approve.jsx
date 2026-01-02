
import React, { useContext, useEffect, useState } from 'react';
import { AttendanceContext } from '../../attanceContext/AttadanceContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Approve = () => {
  const { attendance, loading, error, fetchAttendances, updateAttendanceStatuses } = useContext(AttendanceContext);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // default to today

  useEffect(() => {
    fetchAttendances(date);
  }, [date]);

  const handleStatusChange = async (attendance_id, status) => {
    try {
      await updateAttendanceStatuses(attendance_id, status);
      toast.success(`Attendance ${status} successfully!`);
    } catch (err) {
      toast.error('Failed to update status.');
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">{status}</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">{status}</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">{status}</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">{status}</span>;
    }
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading attendance...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Approve Employee Attendance</h2>

      {/* Date selector */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium text-gray-700">Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {attendance.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No attendance records found for this date.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Employee ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Check In</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(att => (
                <tr key={att.attendance_id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-3">{att.employee_id}</td>
                  <td className="px-6 py-3">{att.employee_name}</td>
                  <td className="px-6 py-3">{att.check_in}</td>
                  <td className="px-6 py-3">{getStatusBadge(att.status)}</td>
                  <td className="px-6 py-3 flex gap-2">
                    {att.status === 'pending' && (
                      <>
                        <button
                          className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600 transition"
                          onClick={() => handleStatusChange(att.attendance_id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
                          onClick={() => handleStatusChange(att.attendance_id, 'rejected')}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Approve;
