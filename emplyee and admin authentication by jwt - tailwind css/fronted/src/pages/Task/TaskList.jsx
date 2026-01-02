
import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../TaskContext/TaskContext";

const TaskList = () => {
  const { tasks, loading, fetchAllTasks } = useContext(TaskContext);
  const [localTasks, setLocalTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ----------------------
  // Load tasks
  // ----------------------
  useEffect(() => {
    const loadTasks = async () => {
      try {
        await fetchAllTasks();
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    loadTasks();
  }, []);

  // ----------------------
  // Format tasks
  // ----------------------
  useEffect(() => {
    const formatted = tasks.map(task => ({
      ...task,
      employees: task.employees ? Object.values(task.employees) : []
    }));
    setLocalTasks(formatted);
  }, [tasks]);

  // ----------------------
  // Helpers
  // ----------------------
  const getStatusBadge = status => {
    const s = (status || "pending").toLowerCase();
    if (s === "completed") return "bg-green-100 text-green-700";
    if (s === "in progress") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const formatDate = date => (date ? new Date(date).toLocaleDateString() : "—");

  // ----------------------
  // Filter tasks
  // ----------------------
  const filteredTasks = localTasks
    .map(task => {
      const taskStart = new Date(task.start_date);
      const taskEnd = new Date(task.end_date);
      const filterStart = startDate ? new Date(startDate) : null;
      const filterEnd = endDate ? new Date(endDate) : null;

      // Date filter
      let matchesDate = true;
      if (filterStart && filterEnd) matchesDate = taskStart >= filterStart && taskEnd <= filterEnd;
      else if (filterStart) matchesDate = taskStart >= filterStart;
      else if (filterEnd) matchesDate = taskEnd <= filterEnd;
      if (!matchesDate) return null;

      // Filter employees & subtasks
      const filteredEmployees = task.employees
        .map(emp => {
          // Only include subtasks matching selected status (if applied)
          const filteredSubtasks = emp.subtasks.filter(subtask =>
            statusFilter ? subtask.status.toLowerCase() === statusFilter.toLowerCase() : true
          );

          // Check search term
          const matchesEmployee = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesSubtaskSearch = filteredSubtasks.some(st => st.title.toLowerCase().includes(searchTerm.toLowerCase()));

          // Include employee only if:
          // 1. They have matching subtasks OR
          // 2. Employee name matches search
          if (filteredSubtasks.length > 0 || matchesEmployee || matchesSubtaskSearch) {
            return { ...emp, subtasks: filteredSubtasks };
          }
          return null;
        })
        .filter(Boolean);

      // Task title search
      const matchesTaskTitle = task.title.toLowerCase().includes(searchTerm.toLowerCase());

      // Include task only if task title matches or has employees with matching subtasks
      if (filteredEmployees.length > 0 || matchesTaskTitle) {
        return { ...task, employees: filteredEmployees };
      }

      return null;
    })
    .filter(Boolean);
console.log("filter",filteredTasks)
  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">All Tasks Overview</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search Task, Employee or Subtask..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        {/* <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select> */}
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      {loading ? (
        <p className="text-center mt-16 text-gray-500">Loading tasks…</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center mt-16 text-gray-500 font-semibold text-lg">No data found</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-blue-900">
              <tr>
                {["Task Title", "Description", "Start Date", "End Date", "Employee", "Subtasks", "Status"].map(head => (
                  <th key={head} className="px-6 py-4 text-left font-semibold text-gray-100 uppercase tracking-wide">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map(task =>
                task.employees.length > 0 ? (
                  task.employees.map((emp, idx) => (
                    <tr key={`${task.task_id}-${emp.employee_id}`} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                      {idx === 0 && (
                        <>
                          <td rowSpan={task.employees.length} className="px-6 py-5 font-semibold text-gray-800 align-top">{task.title}</td>
                          <td rowSpan={task.employees.length} className="px-6 py-5 text-gray-600 align-top max-w-xs">{task.description}</td>
                          <td rowSpan={task.employees.length} className="px-6 py-5 text-gray-500 align-top">{formatDate(task.start_date)}</td>
                          <td rowSpan={task.employees.length} className="px-6 py-5 text-gray-500 align-top">{formatDate(task.end_date)}</td>
                        </>
                      )}
                      <td className="px-6 py-5 font-medium text-gray-700">{emp.name}</td>
                      <td className="px-6 py-5">
                        {emp.subtasks.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {emp.subtasks.map(st => (
                              <span key={st.subtask_id} className={`px-3 py-1 text-xs rounded-full border ${getStatusBadge(st.status)}`} title={`${st.title} (${st.status})`}>{st.title}</span>
                            ))}
                          </div>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(emp.status)}`}>
                          {emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : null
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;
