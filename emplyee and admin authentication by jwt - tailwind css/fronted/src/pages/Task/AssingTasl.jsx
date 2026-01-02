
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { TaskContext } from "../../TaskContext/TaskContext";
import { toast } from "react-toastify";

const AssignTask = () => {
  const { employees, fetchEmployees } = useContext(AuthContext);
  const { assignTask } = useContext(TaskContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employeeIds, setEmployeeIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const toggleEmployee = (id) => {
    setEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !startDate || employeeIds.length === 0) {
      toast.error("Please fill all fields and select employees.");
      return;
    }

    await assignTask(title, description, startDate, endDate, employeeIds);

    // Reset form
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setEmployeeIds([]);
    setSearchTerm("");
  };

  // Filter employees by name or ID
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(emp.id).includes(searchTerm)
  );

  return (
    <div className="max-w-xl mx-auto my-5 py-6 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg shadow-2xl">
      <div className="m-4"><h2 className="text-3xl font-sans mb-6 text-gray-800 text-center">
        Assign Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Info */}
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400"
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-md border-gray-400 focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />
        <div className="flex gap-4">
  <div className="flex-1 flex flex-col">
    <label className="mb-1 font-semibold text-gray-700">Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400"
      required
    />
  </div>

  <div className="flex-1 flex flex-col">
    <label className="mb-1 font-semibold text-gray-700">End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-400"
    />
  </div>
</div>

        

        {/* Employee Search */}
        <div className="border p-4 border-gray-400 rounded-md bg-white shadow-sm">
          <div className="flex justify-between mb-2">
            <p className="font-semibold">Assign to Employees:</p>
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {filteredEmployees.map((emp) => (
              <label
                key={emp.id}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-blue-50 ${
                  employeeIds.includes(emp.id) ? "bg-blue-100" : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={emp.id}
                  checked={employeeIds.includes(emp.id)}
                  onChange={() => toggleEmployee(emp.id)}
                />
                <span className="text-gray-700">{emp.name} (ID: {emp.id})</span>
              </label>
            ))}
            {filteredEmployees.length === 0 && (
              <p className="text-gray-500 col-span-full">No employees found</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Assign Task
        </button>
      </form></div>
    </div>
  );
};

export default AssignTask;
