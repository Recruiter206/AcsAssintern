
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

// import React, { useContext, useEffect, useState } from 'react';
// import { TaskContext } from '../../TaskContext/TaskContext';
// import { AuthContext } from '../../auth/AuthContext';
// import { Link } from 'react-router-dom';

// const EmployeeTask = () => {
//   const { user } = useContext(AuthContext);
//   const { tasks, fetchEmployeeTasks, updateSubtask } = useContext(TaskContext);

//   const [localTasks, setLocalTasks] = useState([]);
//   const [editingTaskId, setEditingTaskId] = useState(null);
//   const [subtaskUpdates, setSubtaskUpdates] = useState({});

//   // --- UPDATED FILTER STATES ---
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [startDate, setStartDate] = useState(''); // "From" date for range
//   const [endDate, setEndDate] = useState('');     // "To" date for range

//   useEffect(() => {
//     if (user) loadTasks();
//   }, [user]);

//   useEffect(() => {
//     setLocalTasks(tasks);
//   }, [tasks]);

//   const loadTasks = async () => {
//     try {
//       const updatedTasks = await fetchEmployeeTasks();
//       if (updatedTasks) setLocalTasks(updatedTasks);
//     } catch (err) {
//       console.error('Failed to fetch tasks:', err);
//     }
//   };

//   // --- UPDATED FILTRATION LOGIC ---
//   const filteredTasks = localTasks.filter((task) => {
//     // 1. Deep Search: Check Task Name, Subtask Name, or Task ID
//     const searchVal = searchTerm.toLowerCase();
//     const matchesTaskId = task.task_id.toString().includes(searchVal);
//     const matchesTaskName = task.title.toLowerCase().includes(searchVal);
//     const matchesSubtaskName = task.subtasks?.some(sub => 
//       sub.title.toLowerCase().includes(searchVal)
//     );
//     const matchesSearch = matchesTaskId || matchesTaskName || matchesSubtaskName;

//     // 2. Status Logic: Check if any subtask matches the status
//     const matchesStatus = statusFilter === 'all' || 
//       task.subtasks?.some(sub => sub.status === statusFilter);

//     // 3. Date Range Logic: Check if task dates fall within selection
//     const taskStart = task.start_date; // Assumes YYYY-MM-DD
//     const taskEnd = task.end_date;
//     const matchesDate = 
//       (!startDate || taskStart >= startDate) && 
//       (!endDate || taskEnd <= endDate);

//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   const handleStartEditing = (taskId) => {
//     setEditingTaskId(taskId);
//     const initialUpdates = {};
//     const task = localTasks.find(t => t.task_id === taskId);
//     if (task && task.subtasks) {
//       task.subtasks.filter(sub => sub.status !== 'completed').forEach(sub => {
//         initialUpdates[sub.subtask_id] = { description: sub.employee_description || '', status: sub.status };
//       });
//     }
//     setSubtaskUpdates(initialUpdates);
//   };

//   const handleChange = (subtaskId, field, value) => {
//     setSubtaskUpdates(prev => ({ ...prev, [subtaskId]: { ...prev[subtaskId], [field]: value } }));
//   };

//   const handleSave = async () => {
//     try {
//       const subIds = Object.keys(subtaskUpdates);
//       for (const subId of subIds) {
//         const { status, description } = subtaskUpdates[subId];
//         await updateSubtask(subId, status, description);
//       }
//       setEditingTaskId(null);
//       setSubtaskUpdates({});
//       await loadTasks();
//     } catch (err) {
//       console.error('Failed to update subtasks:', err);
//     }
//   };

//   if (!user) return <p className="text-center mt-10 text-gray-500">Loading user...</p>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-3xl font-bold text-center my-6">My Tasks</h1>

//       {/* --- FILTER BAR (UI preserved, inputs mapped to new range logic) --- */}
//       <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-4  p-4   ">
//         <div>
//           <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search</label>
//           <input
//             type="text"
//             placeholder="Name, Subtask, or ID..."
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
//           <select
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All Statuses</option>
//             <option value="pending">Pending</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From Date</label>
//           <input
//             type="date"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//           />
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To Date</label>
//           <input
//             type="date"
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
//           <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
//             <tr>
//               <th className="px-3 py-2 text-left text-sm">Task ID</th>
//               <th className="px-3 py-2 text-left text-sm">Start Date</th>
//               <th className="px-3 py-2 text-left text-sm">End Date</th>
//               <th className="px-3 py-2 text-left text-sm">Task</th>
//               <th className="px-3 py-2 text-left text-sm">Description</th>
//               <th className="px-3 py-2 text-left text-sm">Subtasks</th>
//               <th className="px-3 py-2 text-left text-sm">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {filteredTasks.length > 0 ? (
//               filteredTasks.map(task => (
//                 <tr key={task.task_id} className="hover:bg-gray-50 transition duration-150">
//                   <td className="px-3 py-3 font-medium">{task.task_id}</td>
//                   <td className="px-3 py-3 text-gray-500 text-sm">{task.start_date}</td>
//                   <td className="px-3 py-3 text-gray-500 text-sm">{task.end_date}</td>
//                   <td className="px-3 py-3 text-gray-700 font-semibold">{task.title}</td>
//                   <td className="px-3 py-3 text-gray-500">{task.description}</td>
//                   <td className="px-3 py-3 space-y-1">
//                     {task.subtasks && task.subtasks.length > 0 ? task.subtasks.map(sub => {
//                       const isCompleted = sub.status === 'completed';
//                       const isEditing = editingTaskId === task.task_id && !isCompleted;
//                       return (
//                         <div key={sub.subtask_id} className="flex flex-col text-gray-500 text-sm sm:flex-row sm:justify-between items-center w-full border-b border-gray-100 pb-2 mb-2 last:border-0">
//                           <div className="flex-1 gap-1">
//                             <p className="font-medium text-gray-700">{sub.title}</p>
//                             {isEditing ? (
//                               <input
//                                 value={subtaskUpdates[sub.subtask_id]?.description || ''}
//                                 onChange={(e) => handleChange(sub.subtask_id, 'description', e.target.value)}
//                                 className="w-full border border-gray-300 rounded px-2 py-1 mt-1 text-sm"
//                                 placeholder="Enter progress details..."
//                               />
//                             ) : (
//                               <p className="text-xs italic text-gray-400">
//                                 {sub.employee_description || 'No updates yet'}
//                               </p>
//                             )}
//                           </div>
//                           {isEditing ? (
//                             <select
//                               value={subtaskUpdates[sub.subtask_id]?.status || 'pending'}
//                               onChange={(e) => handleChange(sub.subtask_id, 'status', e.target.value)}
//                               className="mt-2 sm:mt-0 border border-gray-300 rounded px-2 py-1 text-xs"
//                             >
//                               <option value="pending">Pending</option>
//                               <option value="in_progress">In Progress</option>
//                               <option value="completed">Completed</option>
//                             </select>
//                           ) : (
//                             <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 sm:mt-0 ${
//                               isCompleted ? 'bg-green-100 text-green-800' :
//                               sub.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
//                               'bg-yellow-100 text-yellow-800'
//                             }`}>
//                               {sub.status.replace('_', ' ')}
//                             </span>
//                           )}
//                         </div>
//                       );
//                     }) : <p className="text-gray-400 italic">No subtasks assigned</p>}
//                   </td>
//                   <td className="px-3 py-4 flex flex-col gap-2">
//                     <Link to={`/add-subtask/${task.task_id}`} className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 text-center">
//                       Add Subtask
//                     </Link>
//                     {task.subtasks?.some(sub => sub.status !== 'completed') && (
//                       <button
//                         onClick={() => handleStartEditing(task.task_id)}
//                         className="bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-600"
//                       >
//                         Update
//                       </button>
//                     )}
//                     {editingTaskId === task.task_id && (
//                       <button onClick={handleSave} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700">
//                         Save Changes
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
//                   No tasks found matching your filters.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default EmployeeTask;
