
import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../TaskContext/TaskContext";

const StatusTask = () => {
  const { tasks, loading, fetchTaskStatus } = useContext(TaskContext);
  const [localTasks, setLocalTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTaskStatus();
  }, []);

  useEffect(() => {
    const formatted = tasks.map(task => ({
      ...task,
      employees: task.employees ? Object.values(task.employees) : []
    }));
    setLocalTasks(formatted);
  }, [tasks]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading tasks...</p>;

  if (localTasks.length === 0)
    return <p className="text-center mt-10 text-gray-500">No tasks found.</p>;

  const filteredTasks = localTasks.filter(task =>
    task.task_id.toString().includes(searchTerm) ||
    task.employees.some(emp =>
      emp.employee_id.toString().includes(searchTerm)
    )
  );

  const badge = (status) => {
    const s = status.toLowerCase();
    if (s === "completed") return "bg-green-100 text-green-800";
    if (s === "in progress") return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Task Status Table
      </h1>

      {/* Search */}
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search Task ID / Employee ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-72 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg bg-white shadow-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Task ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Task Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Employee ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Employee Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Subtask
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredTasks.map(task =>
              task.employees.map(emp =>
                emp.subtasks.map(sub => (
                  <tr
                    key={`${task.task_id}-${emp.employee_id}-${sub.subtask_id}`}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3 text-center font-medium">
                      {task.task_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {task.title}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {emp.employee_id}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {emp.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {sub.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${badge(
                          sub.status
                        )}`}
                      >
                        {sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTask;
