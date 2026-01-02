
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

  // Fetch tasks on user load
  useEffect(() => {
    if (user) loadTasks();
  }, [user]);

  // Update localTasks whenever tasks from context change
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Function to fetch tasks and update local state
  const loadTasks = async () => {
    try {
      const updatedTasks = await fetchEmployeeTasks();
      setLocalTasks(updatedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  // Start editing only non-completed subtasks
  const handleStartEditing = (taskId) => {
    setEditingTaskId(taskId);
    const initialUpdates = {};
    const task = localTasks.find(t => t.task_id === taskId);

    task.subtasks
      .filter(sub => sub.employee_id === user.id && sub.status !== 'completed')
      .forEach(sub => {
        initialUpdates[sub.subtask_id] = {
          description: sub.employee_description || '',
          status: sub.status
        };
      });

    setSubtaskUpdates(initialUpdates);
  };

  const handleChange = (subtaskId, field, value) => {
    setSubtaskUpdates(prev => ({
      ...prev,
      [subtaskId]: { ...prev[subtaskId], [field]: value }
    }));
  };

  // Save updated subtasks
  const handleSave = async () => {
    try {
      const updatePromises = Object.keys(subtaskUpdates).map(subId => {
        const { status, description } = subtaskUpdates[subId];
        return updateSubtask(subId, status, description);
      });

      await Promise.all(updatePromises);
      setEditingTaskId(null);
      await loadTasks(); // Reload tasks after update
    } catch (err) {
      console.error('Failed to update subtasks:', err);
    }
  };

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading user...</p>;
  if (!localTasks || localTasks.length === 0) return <p className="text-center mt-10 text-gray-500">No tasks assigned yet.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Tasks</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Task ID</th>
              <th className="px-6 py-3 text-left font-semibold">Start Date</th>
              <th className="px-6 py-3 text-left font-semibold">End Date</th>
              <th className="px-6 py-3 text-left font-semibold">Task</th>
              <th className="px-6 py-3 text-left font-semibold">Description</th>
              <th className="px-6 py-3 text-left font-semibold">Subtasks</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {localTasks.map(task => (
              <tr key={task.task_id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 font-medium">{task.task_id}</td>
                <td className="px-6 py-4 text-sm">{task.start_date}</td>
                <td className="px-6 py-4 text-sm">{task.end_date}</td>
                <td className="px-6 py-4 font-semibold">{task.title}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4 space-y-2">
                  {task.subtasks.length > 0 ? task.subtasks.map(sub => {
                    const isCompleted = sub.status === 'completed';
                    const isEditing = editingTaskId === task.task_id && !isCompleted;
                    return (
                      <div
                        key={sub.subtask_id}
                        className="flex flex-col sm:flex-row sm:justify-between items-center w-full"
                      >
                        <div className="flex-1 gap-2">
                          <p className="font-medium ">{sub.title}</p>
                          {isEditing ? (
                            <input
                              value={subtaskUpdates[sub.subtask_id]?.description || ''}
                              onChange={(e) => handleChange(sub.subtask_id, 'description', e.target.value)}
                              className="w-full border border-gray-300 rounded px-2 py-1 mt-1 text-sm"
                              placeholder="Enter description..."
                            />
                          ) : (
                            <p className={`text-sm  ${isCompleted ? 'text-sm mt-3' : 'text-gray-500 mt-3'}`}>
                              {sub.employee_description || 'No description'}
                            </p>
                          )}
                        </div>
                        {isEditing ? (
                          <select
                            value={subtaskUpdates[sub.subtask_id]?.status || 'pending'}
                            onChange={(e) => handleChange(sub.subtask_id, 'status', e.target.value)}
                            className="mt-6 sm:mt-0 border border-gray-300 rounded px-2 py-1 text-sm"
                          >
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="in progress">In Progress</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                              isCompleted ? 'bg-green-100 text-green-800' :
                              sub.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                          </span>
                        )}
                      </div>
                    );
                  }) : <p className="text-gray-500">No subtasks</p>}
                </td>
                <td className="px-6 py-4 flex flex-col sm:flex-row justify-center items-center gap-2">
                  <Link
                    to={`/add-subtask/${task.task_id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                  >
                    Add Subtask
                  </Link>
                  {task.subtasks.some(sub => sub.status !== 'completed') && (
                    <button
                      onClick={() => handleStartEditing(task.task_id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Update Status
                    </button>
                  )}
                  {editingTaskId === task.task_id && (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTask;
