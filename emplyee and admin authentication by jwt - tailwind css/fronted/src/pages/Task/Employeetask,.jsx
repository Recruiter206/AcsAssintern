
import React, { useContext, useEffect, useState } from 'react';
import { TaskContext } from '../../TaskContext/TaskContext';
import { AuthContext } from '../../auth/AuthContext';
import { Link } from 'react-router-dom';

const EmployeeTask = () => {
  const { user } = useContext(AuthContext);
  const { tasks, fetchEmployeeTasks, updateSubtask } = useContext(TaskContext);

  const [localTasks, setLocalTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [subtaskUpdates, setSubtaskUpdates] = useState({});

  // --- UPDATED FILTER STATES ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState(''); // "From" date for range
  const [endDate, setEndDate] = useState('');     // "To" date for range

  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const updatedTasks = await fetchEmployeeTasks();
      if (updatedTasks) setLocalTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  // --- UPDATED FILTRATION LOGIC ---
  const filteredTasks = localTasks.filter((task) => {

    // 1. Deep Search: Check Task Name, Subtask Name, or Task ID
    const searchVal = searchTerm.toLowerCase();
    const matchesTaskId = task.task_id.toString().includes(searchVal);
    const matchesTaskName = task.title.toLowerCase().includes(searchVal);
    const matchesSubtaskName = task.subtasks?.some(sub => 
      sub.title.toLowerCase().includes(searchVal)
    );
    const matchesSearch = matchesTaskId || matchesTaskName || matchesSubtaskName;

    // 2. Status Logic: Check if any subtask matches the status
    const matchesStatus = statusFilter === 'all' || 
      task.subtasks?.some(sub => sub.status === statusFilter);

    // 3. Date Range Logic: Check if task dates fall within selection
    const taskStart = task.start_date; // Assumes YYYY-MM-DD
    const taskEnd = task.end_date;
    const matchesDate = 
      (!startDate || taskStart >= startDate) && 
      (!endDate || taskEnd <= endDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStartEditing = (taskId) => {
    setEditingTaskId(taskId);
    const initialUpdates = {};
    const task = localTasks.find(t => t.task_id === taskId);
    if (task && task.subtasks) {
      task.subtasks.filter(sub => sub.status !== 'completed').forEach(sub => {
        initialUpdates[sub.subtask_id] = { description: sub.employee_description || '', status: sub.status };
      });
    }
    setSubtaskUpdates(initialUpdates);
  };

  const handleChange = (subtaskId, field, value) => {
    setSubtaskUpdates(prev => ({ ...prev, [subtaskId]: { ...prev[subtaskId], [field]: value } }));
  };

  // const handleSave = async () => {
  //   try {
  //     const subIds = Object.keys(subtaskUpdates);
  //     for (const subId of subIds) {
  //       const { status, description } = subtaskUpdates[subId];
  //       await updateSubtask(subId, status, description);
  //     }
  //     setEditingTaskId(null);
  //     setSubtaskUpdates({});
  //     await loadTasks();
  //   } catch (err) {
  //     console.error('Failed to update subtasks:', err);
  //   }
  // };

const handleSave = async () => {
  try {
    const subIds = Object.keys(subtaskUpdates);
    
    // Use Promise.all to run all updates in parallel
    await Promise.all(
      subIds.map(subId => {
        const { status, description } = subtaskUpdates[subId];
        return updateSubtask(subId, status, description);
      })
    );

    // 1. Reset states after ALL promises resolve
    setEditingTaskId(null);
    setSubtaskUpdates({});
    
    // 2. Refresh the list
    await loadTasks();

    // 3. Trigger toast HERE (only once) instead of inside updateSubtask context
    // toast.success("Tasks updated successfully!"); 

  } catch (err) {
    console.error('Failed to update subtasks:', err);
    // toast.error("Failed to update some tasks");
  }
};

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading user...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center my-6">My Tasks</h1>

      {/* --- FILTER BAR (UI preserved, inputs mapped to new range logic) --- */}
      <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-4  p-4   ">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Search</label>
          <input
            type="text"
            placeholder="Name, Subtask, or ID..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To Date</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <tr className='py-3'>
              <th className="px-3 py-2 text-left text-sm">Task ID</th>
              <th className="px-3 py-2 text-left text-sm">Start Date</th>
              <th className="px-3 py-2 text-left text-sm">End Date</th>
              <th className="px-3 py-2 text-left text-sm">Task</th>
              <th className="px-3 py-2 text-left text-sm">Description</th>
              <th className="px-3 py-2 text-left text-sm">Subtasks</th>
              <th className="px-3 py-2 text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <tr key={task.task_id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-2 py-2 font-medium">{task.task_id}</td>
                  <td className="px-2 py-2  text-gray-500 text-sm">{task.start_date}</td>
                  <td className="px-2 py-2 text-gray-500 text-sm">{task.end_date}</td>
                  <td className="px-2 py-2 text-gray-700 text-[12px] font-semibold">{task.title}</td>
                  <td className="px-2 py-2 flex-wrap flex text-[10px] text-gray-500">{task.description}</td>
                  <td className="px-2 py-2 space-y-1">
                    {task.subtasks && task.subtasks.length > 0 ? task.subtasks.map(sub => {
                      const isCompleted = sub.status === 'completed';
                      const isEditing = editingTaskId === task.task_id && !isCompleted;
                      return (
                        <div key={sub.subtask_id} className="flex flex-col text-gray-500 text-sm sm:flex-row sm:justify-between items-center w-full border-b border-gray-100 pb-2 mb-2 last:border-0">
                          <div className="flex-1 gap-1">
                            <p className="font-medium text-gray-700">{sub.title}</p>
                            {isEditing ? (
                              <input
                                value={subtaskUpdates[sub.subtask_id]?.description || ''}
                                onChange={(e) => handleChange(sub.subtask_id, 'description', e.target.value)}
                                className="w-full border border-gray-300 rounded px-2 py-1 mt-1 text-sm"
                                placeholder="Enter progress details..."
                              />
                            ) : (
                              <p className="text-xs italic text-gray-400">
                                {sub.employee_description || 'No updates yet'}
                              </p>
                            )}
                          </div>
                          {isEditing ? (
                            <select
                              value={subtaskUpdates[sub.subtask_id]?.status || 'pending'}
                              onChange={(e) => handleChange(sub.subtask_id, 'status', e.target.value)}
                              className="mt-2 sm:mt-0 border border-gray-300 rounded px-2 py-1 text-xs"
                            >
                              <option value="pending">Pending</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          ) : (
                            <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 sm:mt-0 ${
                              isCompleted ? 'bg-green-100 text-green-800' :
                              sub.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {sub.status.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      );
                    }) : <p className="text-gray-400 italic">No subtasks assigned</p>}
                  </td>
                  <td className="px-3 py-4 flex flex-col gap-2">
                    <Link to={`/add-subtask/${task.task_id}`} className="bg-blue-600 text-white text-xs px-2 py-2 rounded-lg hover:bg-blue-700 text-center">
                      Add Subtask
                    </Link>
                    {task.subtasks?.some(sub => sub.status !== 'completed') && (
                      <button
                        onClick={() => handleStartEditing(task.task_id)}
                        className="bg-yellow-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-yellow-600"
                      >
                        Update
                      </button>
                    )}
                    {editingTaskId === task.task_id && (
                      <button onClick={handleSave} className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700">
                        Save Changes
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  No tasks found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTask;
