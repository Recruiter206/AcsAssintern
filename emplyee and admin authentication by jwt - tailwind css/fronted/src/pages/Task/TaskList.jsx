

import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "../../TaskContext/TaskContext";

const TaskList = () => {
  const { tasks, loading, fetchAllTasks } = useContext(TaskContext);

  const [localTasks, setLocalTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ---------------- FETCH TASKS ----------------
  useEffect(() => {
    fetchAllTasks().catch(console.error);
  }, []);

  // ---------------- FORMAT TASKS ----------------
  useEffect(() => {
    const formatted = tasks.map(task => ({
      ...task,
      employees: task.employees ? Object.values(task.employees) : []
    }));
    setLocalTasks(formatted);
  }, [tasks]);

  // ---------------- HELPERS ----------------
  const formatDate = date =>
    date ? new Date(date).toLocaleDateString() : "—";

  const getStatusBadge = status => {
    const s = (status || "pending").toLowerCase();
    if (s === "completed") return "bg-green-100 text-green-700";
    if (s === "in_progress") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

 
  const filteredTasks = localTasks
    .map(task => {
      // 1. DATE FILTER
      const taskStart = new Date(task.start_date);
      const taskEnd = new Date(task.end_date);
      const filterStart = startDate ? new Date(startDate) : null;
      const filterEnd = endDate ? new Date(endDate) : null;

      let dateMatch = true;
      if (filterStart && filterEnd)
        dateMatch = taskStart >= filterStart && taskEnd <= filterEnd;
      else if (filterStart)
        dateMatch = taskStart >= filterStart;
      else if (filterEnd)
        dateMatch = taskEnd <= filterEnd;

      // Agar date match nahi hui, toh pura task hi nikaal do
      if (!dateMatch) return null;

      // 2. EMPLOYEE + STATUS + SEARCH FILTER
      const filteredEmployees = task.employees
        .map(emp => {
          // Status filter check
          if (
            statusFilter &&
            emp.status?.toLowerCase() !== statusFilter.toLowerCase()
          ) {
            return null;
          }

          const search = searchTerm.toLowerCase();
          const empMatch = emp.name.toLowerCase().includes(search);
          const taskNameMatch = task.title.toLowerCase().includes(search);

          // Subtasks filter + search check
          const filteredSubtasks = emp.subtasks.filter(st => {
            const stStatusMatch = statusFilter ? st.status.toLowerCase() === statusFilter.toLowerCase() : true;
            const stSearchMatch = st.title.toLowerCase().includes(search);
            return stStatusMatch && (searchTerm ? stSearchMatch : true);
          });

          const subtaskMatch = filteredSubtasks.length > 0 && searchTerm ? 
                               emp.subtasks.some(st => st.title.toLowerCase().includes(search)) : false;

          // Agar search term hai, toh check karo employee name, subtask ya task name match ho raha hai ya nahi
          if (searchTerm) {
            if (empMatch || subtaskMatch || taskNameMatch) {
              return { ...emp, subtasks: filteredSubtasks };
            }
            return null;
          }

          // Agar search nahi hai, sirf status match ho gaya toh employee dikhao
          return { ...emp, subtasks: filteredSubtasks };
        })
        .filter(Boolean);

      // FIX: Sirf tabhi task return karo agar employees bache hon
      // Isse table ka header tabhi dikhega jab andar data hoga
      if (filteredEmployees.length > 0) {
        return { ...task, employees: filteredEmployees };
      }

      return null;
    })
    .filter(Boolean);

  // ---------------- RENDER ----------------
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Task Overview
      </h1>

      {/* FILTERS */}
      <div className=" p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4 justify-center">
        <input
          type="text"
          placeholder="Search Task / Employee / Subtask"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border shadow-amber-100 rounded-md w-64"
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 shadow-amber-100 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="px-4 py-2 shadow-amber-100 border rounded-md"
        />

        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="px-4 shadow-amber-100 py-2 border rounded-md"
        />
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center mt-20 text-gray-500">Loading tasks…</p>
      )}

      {/*  NO DATA FOUND (IMPORTANT FIX) */}
      {!loading && filteredTasks.length === 0 &&  (
        <p className="text-center mt-20 text-gray-500 text-lg font-semibold">
          No data found
        </p>
      )}

      {/*  TABLE ONLY WHEN DATA EXISTS */}
      {!loading && filteredTasks.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
              <tr>
                {[
                  "Task",
                  "Description",
                  "Start",
                  "End",
                  "Employee",
                  "Subtasks",
                  "Status"
                ].map(h => (
                  <th key={h} className="px-6 py-4 uppercase font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredTasks.map(task =>
                task.employees.map((emp, idx) => (
                  <tr key={`${task.task_id}-${emp.employee_id}`} className="hover:bg-blue-50">
                    {idx === 0 && (
                      <>
                        <td rowSpan={task.employees.length} className="px-6 py-4 font-semibold">
                          {task.title}
                        </td>
                        <td rowSpan={task.employees.length} className="px-6 py-4 text-gray-600">
                          {task.description || "—"}
                        </td>
                        <td rowSpan={task.employees.length} className="px-6 py-4">
                          {formatDate(task.start_date)}
                        </td>
                        <td rowSpan={task.employees.length} className="px-6 py-4">
                          {formatDate(task.end_date)}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4">{emp.name}</td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {emp.subtasks.map(st => (
                          <span
                            key={st.subtask_id}
                            className={`px-3 py-1 text-xs rounded-full border ${getStatusBadge(st.status)}`}
                          >
                            
                            {st.title}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(emp.status)}`}
                      >
                        {emp.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskList;