
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { Link } from "react-router-dom";

const Admin = () => {
  const {
    user,
    fetchEmployees,
    employees,
    updateEmployee,
    setEmployees,
    deleteEmployee,
    searchEmployees
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadEmployees = async () => {
      setLoading(true);
      await fetchEmployees();
      setLoading(false);
    };

    loadEmployees();
  }, []);

  // Handle search input changes
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      await fetchEmployees();
    } else {
      await searchEmployees(query);
    }
  };

  const handleChange = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    const edits = editData[id] || {};
    const employee = employees.find((emp) => emp.id === id);
    if (!employee) return;

    const payload = {
      id: employee.id,
      name: edits.name ?? employee.name,
      role: edits.role ?? employee.role,
    };

    await updateEmployee(id, payload);

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...payload } : emp))
    );

    setEditData((prev) => ({ ...prev, [id]: {} }));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployee(id);
    }
  };

  return (
    <div className="p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Admin Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Welcome to the Admin page! You have full access.
      </p>
     <div className="flex flex-col md:flex-row  items-center mb-6 gap-4">
  {/* Action Buttons */}
<div className="flex gap-6 mt-6">

  {/* Assign Task */}
  {/* <Link to="/assign"
    className="cursor-pointer bg-blue-600 text-white p-6 rounded-2xl shadow-lg
               hover:shadow-2xl hover:-translate-y-1 transition-all"
  >
    <h3 className="text-lg font-semibold">Assign Task</h3>
    <p className="text-sm opacity-90 mt-1">Assign tasks to employees</p>
  </Link>

  {/* View All Tasks */}
  {/* <Link to="/tasklist"
    className="cursor-pointer bg-indigo-600 text-white p-6 rounded-2xl shadow-lg
               hover:shadow-2xl hover:-translate-y-1 transition-all"
  >
    <h3 className="text-lg font-semibold">View All Tasks</h3>
    <p className="text-sm opacity-90 mt-1">See how many tasks you have assigned</p>
  </Link> */}

 

  {/* Update Attendance */}
  {/* <Link to="/update"
    className="cursor-pointer bg-green-600 text-white p-6 rounded-2xl shadow-lg
               hover:shadow-2xl hover:-translate-y-1 transition-all"
  >
    <h3 className="text-lg font-semibold">Check Attendance</h3>
    <p className="text-sm opacity-90 mt-1">Approve & reject attendance</p>
  </Link> */} 



</div>


  
</div>

      {/* Search bar */}


      {loading ? (
        <p className="text-center text-gray-500">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp, index) => {
                const empEdit = editData[emp.id] || {};

                return (
                  <tr
                    key={emp.id}
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-indigo-50 transition`}
                  >
                    {/* ID */}
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {emp.id}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={empEdit.name ?? emp.name}
                        onChange={(e) =>
                          handleChange(emp.id, "name", e.target.value)
                        }
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400"
                      />
                    </td>

                    {/* Email */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {emp.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <select
                        value={empEdit.role ?? emp.role}
                        onChange={(e) =>
                          handleChange(emp.id, "role", e.target.value)
                        }
                        className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdate(emp.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm transition"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}



    </div>
  );
};

export default Admin;
